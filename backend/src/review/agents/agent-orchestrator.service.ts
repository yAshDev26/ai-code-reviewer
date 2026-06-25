import { Injectable, Logger } from '@nestjs/common';
import { AiService } from '../../common/services/ai.service';
import {
  parseAiJson,
  AgentIssuesSchema,
  SynthesizerResponseSchema,
} from '../parsers/ai-response.parser';
import { buildSecurityPrompt } from '../prompts/security.prompt';
import { buildPerformancePrompt } from '../prompts/performance.prompt';
import { buildBestPracticesPrompt } from '../prompts/bestpractices.prompt';
import { buildCodeStylePrompt } from '../prompts/codestyle.prompt';
import { buildSynthesizerPrompt } from '../prompts/synthesizer.prompt';
import {
  ReviewIssue,
  ReviewResponse,
  AiReviewResponse,
} from '../interfaces/review.interfaces';

@Injectable()
export class AgentOrchestratorService {
  private readonly logger = new Logger(AgentOrchestratorService.name);

  constructor(private readonly aiService: AiService) {}

  async runAllAgents(code: string, language: string): Promise<ReviewResponse> {
    this.logger.log(`Starting multi-agent analysis for ${language} code`);
    const startTime = Date.now();

    // Run all 4 specialist agents in parallel
    const [security, performance, bestPractices, codeStyle] =
      await Promise.allSettled([
        this.runAgent('Security', buildSecurityPrompt(code, language)),
        this.runAgent('Performance', buildPerformancePrompt(code, language)),
        this.runAgent('Best Practices', buildBestPracticesPrompt(code, language)),
        this.runAgent('Code Style', buildCodeStylePrompt(code, language)),
      ]);

    const totalMs = Date.now() - startTime;
    this.logger.log(`All agents completed in ${totalMs}ms`);

    const securityIssues    = this.extractResult(security,      'Security');
    const performanceIssues = this.extractResult(performance,   'Performance');
    const bestPracticeIssues= this.extractResult(bestPractices, 'Best Practices');
    const codeStyleIssues   = this.extractResult(codeStyle,     'Code Style');

    // Synthesizer merges + deduplicates all agent results
    const synthPrompt = buildSynthesizerPrompt(language, {
      security:      securityIssues,
      performance:   performanceIssues,
      bestPractices: bestPracticeIssues,
      codeStyle:     codeStyleIssues,
    });

    const synthRaw = await this.aiService.complete(synthPrompt, 3000);

    // ← now validated against SynthesizerResponseSchema — no more 'as any'
    const finalResult = parseAiJson<AiReviewResponse>(
      synthRaw,
      'synthesizer',
      SynthesizerResponseSchema,
    );

    return {
      ...finalResult,
      meta: {
        agentsRun: 4,
        totalDurationMs: totalMs,
        agentCounts: {
          security:      securityIssues.length,
          performance:   performanceIssues.length,
          bestPractices: bestPracticeIssues.length,
          codeStyle:     codeStyleIssues.length,
        },
      },
    };
  }

  // Returns ReviewIssue[] — no more any[]
  private async runAgent(name: string, prompt: string): Promise<ReviewIssue[]> {
    const start = Date.now();
    try {
      const raw = await this.aiService.complete(prompt, 1500);
      // ← validated against AgentIssuesSchema
      const result = parseAiJson<ReviewIssue[]>(raw, name, AgentIssuesSchema);
      this.logger.log(`${name} agent: ${result.length} issues in ${Date.now() - start}ms`);
      return result;
    } catch (err) {
      this.logger.warn(`${name} agent failed: ${err}`);
      return [];
    }
  }

  private extractResult(
    settled: PromiseSettledResult<ReviewIssue[]>,
    name: string,
  ): ReviewIssue[] {
    if (settled.status === 'fulfilled') return settled.value;
    this.logger.warn(`${name} agent was rejected`);
    return [];
  }
}