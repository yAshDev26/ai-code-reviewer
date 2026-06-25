export function buildCodeStylePrompt(code: string, language: string): string {
  return `
You are an expert ${language} code style and maintainability reviewer.

Analyze ONLY code style and maintainability issues. Focus on:
- Inconsistent formatting or indentation
- Missing or poor comments on complex logic
- Magic numbers or strings that should be constants
- Functions or files that are too long
- Inconsistent naming (camelCase vs snake_case mixed)
- Code duplication that should be extracted
- Confusing variable names that hurt readability

Return ONLY a valid JSON array (not an object) of issues found.
Each issue must have:
- "severity": "warning" or "suggestion"
- "line": line number as number or null
- "issue": short title
- "explanation": how this hurts readability or maintainability
- "fix": improved code snippet
- "category": "code-style"

If no issues found, return an empty array [].
Return ONLY the JSON array. No markdown, no backticks, no extra text.

Code:
\`\`\`${language}
${code}
\`\`\`
  `.trim();
}