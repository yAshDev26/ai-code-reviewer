export function buildAutoFixPrompt(
  code: string,
  language: string,
  issues: { severity: string; issue: string; explanation: string }[],
): string {
  const issueList = issues
    .map(
      (i, idx) =>
        `${idx + 1}. [${i.severity.toUpperCase()}] ${i.issue}: ${i.explanation}`,
    )
    .join('\n');

  return `
You are an expert ${language} developer. Fix ALL the following issues in the code below.

Issues to fix:
${issueList}

CRITICAL RULES:
- Return ONLY a raw JSON object, nothing else
- No markdown, no backticks, no code fences, no explanation text
- The JSON must start with { and end with }
- "fixedCode" must be the complete corrected code as a single string
- Use \\n for newlines inside the string
- Use 2 spaces for indentation
- "summary" must be a short array of strings, max 5 items, each under 8 words

JSON format:
{"fixedCode":"...complete fixed code here...","summary":["fix 1","fix 2"]}

Issues to fix:
${issueList}

Original code:
${code}
  `.trim();
}