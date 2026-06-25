import { Controller, Post, Body } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { E2BService } from './services/e2b.service';
import { ExecuteDto } from './dto/execute.dto';
import { ReviewService } from '../review/review.service';
import { AiService } from '../common/services/ai.service';
import {
  parseAiJson,
  RuntimeAnalysisSchema,
} from '../review/parsers/ai-response.parser';
import { buildRuntimeAnalysisPrompt } from './prompts/runtime-analysis.prompt';
import { ReviewIssue, ReviewResponse } from '../review/interfaces/review.interfaces';
import {
  ExecutionResult,
  RuntimeAnalysisResponse,
} from './interfaces/execution.interfaces';

@Controller('execution')
export class ExecutionController {
  constructor(
    private readonly e2bService: E2BService,
    private readonly reviewService: ReviewService,
    private readonly aiService: AiService,
  ) {}

  // Run only — E2B has its own 30s timeout, limit to 15 per minute
  @Post('run')
  @Throttle({ default: { ttl: 60000, limit: 15 } })
  async runCode(
    @Body() dto: ExecuteDto,
  ): Promise<{ execution: ExecutionResult }> {
    const result = await this.e2bService.execute(
      dto.code,
      dto.language,
      dto.stdin,
    );
    return { execution: result };
  }

  // Run + review hits E2B + 5 Groq calls — tightest limit
  @Post('run-and-review')
  @Throttle({ default: { ttl: 60000, limit: 8 } })
  async runAndReview(
    @Body() dto: ExecuteDto,
  ): Promise<ReviewResponse & { execution: ExecutionResult }> {
    const [execution, staticReview] = await Promise.all([
      this.e2bService.execute(dto.code, dto.language, dto.stdin),
      this.reviewService.reviewCode({ code: dto.code, language: dto.language }),
    ]);

    let runtimeIssues: ReviewIssue[] = [];
    try {
      const prompt = buildRuntimeAnalysisPrompt(
        dto.code,
        dto.language,
        execution.stdout,
        execution.stderr,
        execution.exitCode,
      );
      const raw = await this.aiService.complete(prompt, 1500);
      runtimeIssues = parseAiJson<RuntimeAnalysisResponse>(
        raw,
        'runtime-analysis',
        RuntimeAnalysisSchema,
      );
    } catch {
      runtimeIssues = [];
    }

    const combinedIssues: ReviewIssue[] = [
      ...staticReview.issues,
      ...runtimeIssues,
    ];

    const adjustedScore =
      !execution.success && execution.exitCode !== 0
        ? Math.max(1, Math.min(staticReview.score, 4))
        : staticReview.score;

    return {
      ...staticReview,
      score:  adjustedScore,
      issues: combinedIssues,
      execution,
    };
  }
}