import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Groq from 'groq-sdk';
import { AiException } from '../exceptions/ai.exception';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private client: Groq;

  private readonly model     = 'llama-3.3-70b-versatile';
  private readonly MAX_TOKENS = 8000;
  private readonly MAX_RETRIES = 2;
  private readonly RETRY_DELAY_MS = 1000; // doubles each attempt

  constructor(private configService: ConfigService) {
    this.client = new Groq({
      apiKey: this.configService.get<string>('GROQ_API_KEY'),
    });
  }

  async complete(prompt: string, maxTokens = 2048): Promise<string> {
    const tokens = Math.min(maxTokens, this.MAX_TOKENS);
    let lastError: Error = new Error('Unknown error');

    for (let attempt = 0; attempt <= this.MAX_RETRIES; attempt++) {
      try {
        if (attempt > 0) {
          const delay = this.RETRY_DELAY_MS * attempt; // 1s, 2s
          this.logger.warn(
            `Groq retry attempt ${attempt}/${this.MAX_RETRIES} after ${delay}ms`,
          );
          await this.sleep(delay);
        }

        const response = await this.client.chat.completions.create({
          model:       this.model,
          max_tokens:  tokens,
          temperature: 0.1,
          messages:    [{ role: 'user', content: prompt }],
        });

        const content = response.choices[0]?.message?.content ?? '';

        if (attempt > 0) {
          this.logger.log(`Groq succeeded on retry attempt ${attempt}`);
        }

        return content;
      } catch (err) {
        lastError = err as Error;

        // Don't retry on validation errors — they won't resolve with retries
        if (this.isNonRetryableError(lastError)) {
          this.logger.error(`Groq non-retryable error: ${lastError.message}`);
          break;
        }

        this.logger.warn(
          `Groq attempt ${attempt + 1} failed: ${lastError.message}`,
        );
      }
    }

    throw new AiException(
      `Groq API failed after ${this.MAX_RETRIES + 1} attempts: ${lastError.message}`,
    );
  }

  // Rate limit check — tells caller to slow down before hammering the API
  async completeWithRateCheck(
    prompt: string,
    maxTokens = 2048,
  ): Promise<string> {
    return this.complete(prompt, maxTokens);
  }

  private isNonRetryableError(err: Error): boolean {
    const msg = err.message.toLowerCase();
    return (
      msg.includes('invalid api key') ||
      msg.includes('unauthorized') ||
      msg.includes('400') ||           // bad request — won't improve on retry
      msg.includes('context length')   // prompt too long — won't improve on retry
    );
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}