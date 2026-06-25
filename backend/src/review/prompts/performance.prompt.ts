export function buildPerformancePrompt(code: string, language: string): string {
  return `
You are an expert performance engineer specializing in ${language}.

Analyze ONLY performance issues in the following code. Focus on:
- Time complexity problems (O(n²) when O(n) is possible)
- Unnecessary loops or nested iterations
- Memory leaks or excessive memory usage
- Redundant computations inside loops
- Missing caching or memoization opportunities
- Inefficient data structure choices
- Blocking operations that should be async

Return ONLY a valid JSON array (not an object) of issues found.
Each issue must have:
- "severity": "critical" or "warning"
- "line": line number as number or null
- "issue": short title
- "explanation": what the performance impact is
- "fix": optimized code snippet
- "category": "performance"

If no performance issues found, return an empty array [].
Return ONLY the JSON array. No markdown, no backticks, no extra text.

Code:
\`\`\`${language}
${code}
\`\`\`
  `.trim();
}