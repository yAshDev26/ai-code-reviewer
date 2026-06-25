export function buildFileSummaryPrompt(
  filePath: string,
  code: string,
  language: string,
): string {
  return `
You are an expert code reviewer analyzing one file as part of a larger codebase.

File: ${filePath}
Language: ${language}

Analyze this file for issues across security, performance, best practices, and code style.

Return ONLY a valid JSON object with:
- "score": number 1-10 quality score for this file
- "issues": array of issue objects, each with:
  - "severity": "critical" | "warning" | "suggestion"
  - "line": line number or null
  - "issue": short title
  - "explanation": what's wrong
  - "fix": corrected code snippet
  - "category": "security" | "performance" | "best-practices" | "code-style"
- "exports": array of function/class/variable names this file exports (best guess from code)
- "imports": array of module or file names this file imports

Return ONLY valid JSON. No markdown, no backticks, no extra text.

Code:
\`\`\`${language}
${code}
\`\`\`
  `.trim();
}