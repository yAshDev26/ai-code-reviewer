export function buildSecurityPrompt(code: string, language: string): string {
  return `
You are an expert security code reviewer specializing in ${language}.

Analyze ONLY security vulnerabilities in the following code. Focus on:
- Hardcoded secrets, API keys, passwords
- SQL/NoSQL injection risks
- XSS vulnerabilities
- Insecure dependencies or imports
- Authentication/authorization flaws
- Sensitive data exposure
- OWASP Top 10 issues

Return ONLY a valid JSON array (not an object) of issues found.
Each issue must have:
- "severity": "critical" or "warning"
- "line": line number as number or null
- "issue": short title
- "explanation": what the security risk is
- "fix": secure code snippet
- "category": "security"

If no security issues found, return an empty array [].
Return ONLY the JSON array. No markdown, no backticks, no extra text.

Code:
\`\`\`${language}
${code}
\`\`\`
  `.trim();
}