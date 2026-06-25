/**
 * @deprecated Legacy single-agent prompt — replaced by the 4-agent pipeline
 * in agent-orchestrator.service.ts. Kept for reference only.
 * Do NOT use in production code.
 *
 * To remove: delete this file and verify no imports reference it.
 * Safe to delete after: confirming agent-orchestrator handles all review flows.
 */
export function buildReviewPrompt(code: string, language: string): string {
  return `
You are an expert code reviewer. Analyze the following ${language} code and return a JSON object.

The JSON must have:
- "score": a number from 1 to 10 rating overall code quality
- "language": the programming language
- "issues": an array of issue objects

Each issue object must have:
- "severity": one of "critical" | "warning" | "suggestion"
- "line": line number as a number or null
- "issue": short title of the problem
- "explanation": clear explanation of what is wrong
- "fix": corrected code snippet as a string

Return ONLY valid JSON. No markdown, no backticks, no extra text.

Code to review:
\`\`\`${language}
${code}
\`\`\`
  `.trim();
}