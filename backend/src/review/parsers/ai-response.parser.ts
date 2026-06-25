import { z, ZodSchema } from 'zod';
import { AiException } from '../../common/exceptions/ai.exception';

function extractJson(raw: string): string {
  const cleaned = raw
    .replace(/```json/gi, '')
    .replace(/```/g, '')
    .trim();

  const match = cleaned.match(/(\[[\s\S]*\]|\{[\s\S]*\})/);
  if (!match) {
    throw new AiException(`No valid JSON found in AI response`);
  }
  return match[0];
}

export function parseAiJson<T>(
  raw: string,
  context: string,
  schema?: ZodSchema<T>,
): T {
  const jsonStr = extractJson(raw);

  let parsed: unknown;
  try {
    parsed = JSON.parse(jsonStr);
  } catch {
    throw new AiException(`Failed to parse AI JSON for: ${context}`);
  }

  if (!schema) {
    return parsed as T;
  }

  const result = schema.safeParse(parsed);
  if (!result.success) {
    const issues = result.error.issues  // ← .issues not .errors
      .map((e) => `${e.path.join('.')}: ${e.message}`)
      .join(', ');
    throw new AiException(
      `AI response shape invalid for "${context}": ${issues}`,
    );
  }

  return result.data;
}

// ── Zod schemas ───────────────────────────────────────────────────────────────

const IssueSeveritySchema = z.enum(['critical', 'warning', 'suggestion']);
const IssueCategorySchema = z.enum([
  'security', 'performance', 'best-practices', 'code-style', 'runtime',
]);

export const ReviewIssueSchema = z.object({
  severity:    IssueSeveritySchema,
  line:        z.union([z.number(), z.null()]),
  issue:       z.string(),
  explanation: z.string(),
  fix:         z.string(),
  category:    IssueCategorySchema.optional(),
});

export const AgentIssuesSchema = z.array(ReviewIssueSchema);

export const SynthesizerResponseSchema = z.object({
  score:    z.number().min(1).max(10),
  language: z.string(),
  issues:   z.array(ReviewIssueSchema),
  agentSummary: z.object({
    security:      z.number(),
    performance:   z.number(),
    bestPractices: z.number(),
    codeStyle:     z.number(),
  }).optional(),
});

export const AutoFixResponseSchema = z.object({
  fixedCode: z.string().min(1),
  summary:   z.array(z.string()),
});

export const FileSummaryResponseSchema = z.object({
  score:   z.number().min(1).max(10),
  issues:  z.array(ReviewIssueSchema),
  exports: z.array(z.string()),
  imports: z.array(z.string()),
});

export const CrossFileIssuesSchema = z.array(
  z.object({
    severity:    IssueSeveritySchema,
    files:       z.array(z.string()),
    issue:       z.string(),
    explanation: z.string(),
  }),
);

export const RuntimeAnalysisSchema = z.array(ReviewIssueSchema);