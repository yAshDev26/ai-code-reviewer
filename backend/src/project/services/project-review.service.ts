import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { AiService } from '../../common/services/ai.service';
import {
  parseAiJson,
  FileSummaryResponseSchema,
  CrossFileIssuesSchema,
} from '../../review/parsers/ai-response.parser';
import { buildFileSummaryPrompt } from '../prompts/file-summary.prompt';
import { buildCrossFilePrompt } from '../prompts/cross-file.prompt';
import { GithubFetcherService } from './github-fetcher.service';
import {
  ProjectFileInput,
  ProjectReviewResponse,
  FileReviewResult,
  CrossFileIssue,
  AiFileSummaryResponse,
} from '../interfaces/project.interfaces';

@Injectable()
export class ProjectReviewService {
  private readonly logger = new Logger(ProjectReviewService.name);
  private readonly MAX_FILES = 5;

  constructor(
    private readonly aiService: AiService,
    private readonly githubFetcher: GithubFetcherService,
  ) {}

  async reviewFiles(files: ProjectFileInput[]): Promise<ProjectReviewResponse> {
    if (files.length === 0) {
      throw new BadRequestException('No files provided for review.');
    }
    const capped = files.slice(0, this.MAX_FILES);
    const warning =
      files.length > this.MAX_FILES
        ? `Only the first ${this.MAX_FILES} files were reviewed (${files.length} were provided).`
        : null;

    return this.runProjectReview(capped, warning);
  }

  async reviewGithubRepo(repoUrl: string): Promise<ProjectReviewResponse> {
    const files = await this.githubFetcher.fetchRepoFiles(repoUrl);
    if (files.length === 0) {
      throw new BadRequestException(
        'No supported source files found in this repository.',
      );
    }
    return this.runProjectReview(files, null);
  }

  private async runProjectReview(
    files: ProjectFileInput[],
    warning: string | null,
  ): Promise<ProjectReviewResponse> {
    this.logger.log(`Reviewing project with ${files.length} files`);
    const startTime = Date.now();

    const fileResults = await Promise.allSettled(
      files.map((file) => this.reviewSingleFile(file)),
    );

    // Map settled results — failed files get an error placeholder
    const successfulResults: FileReviewResult[] = fileResults.map((r, idx) =>
      r.status === 'fulfilled'
        ? r.value
        : {
            path:     files[idx].path,
            language: files[idx].language,
            score:    0,
            issues:   [],
            exports:  [],
            imports:  [],
            error:    'Failed to analyze this file',
          },
    );

    const crossFileIssues = await this.runCrossFileAnalysis(successfulResults);

    const validScores = successfulResults
      .filter((f) => !f.error)
      .map((f) => f.score);

    const overallScore =
      validScores.length > 0
        ? Math.round(
            (validScores.reduce((a, b) => a + b, 0) / validScores.length) * 10,
          ) / 10
        : 0;

    const totalIssues =
      successfulResults.reduce((sum, f) => sum + f.issues.length, 0) +
      crossFileIssues.length;

    const totalMs = Date.now() - startTime;
    this.logger.log(`Project review completed in ${totalMs}ms`);

    return {
      overallScore,
      totalFiles:  files.length,
      totalIssues,
      files:       successfulResults,
      crossFileIssues,
      warning,
      meta: { totalDurationMs: totalMs },
    };
  }

  private async reviewSingleFile(
    file: ProjectFileInput,
  ): Promise<FileReviewResult> {
    const prompt = buildFileSummaryPrompt(file.path, file.content, file.language);
    const raw    = await this.aiService.complete(prompt, 2500);

    // ← validated against FileSummaryResponseSchema — no more parseAiJson<any>
    const parsed = parseAiJson<AiFileSummaryResponse>(
      raw,
      `file-summary:${file.path}`,
      FileSummaryResponseSchema,
    );

    return {
      path:     file.path,
      language: file.language,
      score:    parsed.score  ?? 5,
      issues:   parsed.issues ?? [],
      exports:  parsed.exports ?? [],
      imports:  parsed.imports ?? [],
    };
  }

  private async runCrossFileAnalysis(
    fileResults: FileReviewResult[],
  ): Promise<CrossFileIssue[]> {
    try {
      const prompt = buildCrossFilePrompt(
        fileResults.map((f) => ({
          path:     f.path,
          exports:  f.exports,
          imports:  f.imports,
          language: f.language,
        })),
      );
      const raw    = await this.aiService.complete(prompt, 1500);

      // ← validated against CrossFileIssuesSchema — no more any[]
      return parseAiJson<CrossFileIssue[]>(raw, 'cross-file', CrossFileIssuesSchema);
    } catch (err) {
      this.logger.warn(`Cross-file analysis failed: ${err}`);
      return [];
    }
  }
}