export function buildSynthesizerPrompt(
  language: string,
  agentResults: {
    security: any[];
    performance: any[];
    bestPractices: any[];
    codeStyle: any[];
  }
): string {
  return `
You are a senior engineering lead synthesizing code review findings.

You have received findings from 4 specialist agents reviewing ${language} code.
Your job is to:
1. Merge all findings into a single list
2. Remove any duplicate issues (same problem found by multiple agents)
3. Calculate an overall quality score from 1-10
4. Return the final structured review

Agent findings:
Security issues: ${JSON.stringify(agentResults.security)}
Performance issues: ${JSON.stringify(agentResults.performance)}
Best practice issues: ${JSON.stringify(agentResults.bestPractices)}
Code style issues: ${JSON.stringify(agentResults.codeStyle)}

Scoring guide:
- 9-10: Excellent, production ready
- 7-8: Good, minor improvements needed
- 5-6: Needs work, several issues
- 3-4: Poor quality, significant issues
- 1-2: Critical problems, major rewrite needed

Return ONLY a valid JSON object with:
- "score": number 1-10
- "language": "${language}"
- "agentSummary": object with counts { security: n, performance: n, bestPractices: n, codeStyle: n }
- "issues": merged deduplicated array of all issues, each with severity, line, issue, explanation, fix, category

Return ONLY valid JSON. No markdown, no backticks, no extra text.
  `.trim();
}