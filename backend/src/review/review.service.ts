import { Injectable, Logger } from '@nestjs/common';
import { AgentOrchestratorService } from './agents/agent-orchestrator.service';
import { AiService } from '../common/services/ai.service';
import { ReviewDto } from './dto/review.dto';
import { AutoFixDto } from './dto/autofix.dto';
import { buildAutoFixPrompt } from './prompts/autofix.prompt';
import {
  parseAiJson,
  AutoFixResponseSchema,
} from './parsers/ai-response.parser';
import {
  ReviewResponse,
  AutoFixResponse,
  AiAutoFixResponse,
} from './interfaces/review.interfaces';

@Injectable()
export class ReviewService {
  private readonly logger = new Logger(ReviewService.name);

  constructor(
    private readonly aiService: AiService,
    private readonly agentOrchestrator: AgentOrchestratorService,
  ) {}

  async reviewCode(dto: ReviewDto): Promise<ReviewResponse> {
    const start = Date.now();
    this.logger.log(
      `Review started — language: ${dto.language}, size: ${dto.code.length} chars`,
    );

    const result = await this.agentOrchestrator.runAllAgents(
      dto.code,
      dto.language,
    );

    this.logger.log(
      `Review completed — ${Date.now() - start}ms, score: ${result.score}, issues: ${result.issues.length}`,
    );
    return result;
  }

  async autoFix(dto: AutoFixDto): Promise<AutoFixResponse> {
    const start = Date.now();
    this.logger.log(
      `AutoFix started — language: ${dto.language}, issues: ${dto.issues.length}`,
    );

    const prompt = buildAutoFixPrompt(dto.code, dto.language, dto.issues);
    const raw    = await this.aiService.complete(prompt, 6000);

    let result: AiAutoFixResponse;

    try {
      result = parseAiJson<AiAutoFixResponse>(
        raw,
        'auto-fix',
        AutoFixResponseSchema,
      );
    } catch {
      // Fallback — manual extraction when JSON is malformed
      const codeMatch = raw.match(
        /"fixedCode"\s*:\s*"([\s\S]*?)(?:"\s*,\s*"summary"|"\s*\})/,
      );
      if (codeMatch) {
        result = {
          fixedCode: codeMatch[1],
          summary:   ['Code fixed with best practices applied'],
        };
      } else {
        throw new Error(
          'Auto fix failed — AI response was malformed. Try with fewer issues selected.',
        );
      }
    }

    // Clean escape sequences before returning to frontend
    result.fixedCode = result.fixedCode
      .replace(/\\n/g,  '\n')
      .replace(/\\t/g,  '  ')
      .replace(/\\"/g,  '"')
      .replace(/\\\\/g, '\\')
      .trimEnd();

    this.logger.log(
      `AutoFix completed — ${Date.now() - start}ms, changes: ${result.summary.length}`,
    );
    return result;
  }
}