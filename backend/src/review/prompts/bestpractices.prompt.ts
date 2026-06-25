export function buildBestPracticesPrompt(code: string, language: string): string {
  return `
You are an expert software architect specializing in ${language} best practices.

Analyze ONLY best practice violations in the following code. Focus on:
- SOLID principle violations
- Design pattern misuse or missing patterns
- Dead code, unused variables or imports
- Functions doing too many things (single responsibility)
- Poor naming conventions
- Missing error handling or edge case coverage
- Overly complex logic that should be simplified
- Missing input validation

Return ONLY a valid JSON array (not an object) of issues found.
Each issue must have:
- "severity": "warning" or "suggestion"
- "line": line number as number or null
- "issue": short title
- "explanation": why this violates best practices
- "fix": improved code snippet
- "category": "best-practices"

If no issues found, return an empty array [].
Return ONLY the JSON array. No markdown, no backticks, no extra text.

Code:
\`\`\`${language}
${code}
\`\`\`
  `.trim();
}