export function buildRuntimeAnalysisPrompt(
  code: string,
  language: string,
  stdout: string,
  stderr: string,
  exitCode: number,
): string {
  return `
You are a senior debugger analyzing the ACTUAL execution result of ${language} code.

This code was just run. Here is what really happened:
Exit code: ${exitCode}
Stdout: ${stdout || '(empty)'}
Stderr: ${stderr || '(empty)'}

Based on the REAL runtime behavior above (not just reading the code), identify any issues that are only visible at runtime — such as:
- Actual exceptions, crashes, or stack traces shown in stderr
- Unexpected or incorrect output values shown in stdout
- Infinite loops or timeouts
- Null/undefined reference errors that occurred
- Type errors that occurred during execution

If the code ran successfully with no errors and reasonable output, return an empty array.
Do NOT repeat generic static analysis issues — only flag things confirmed by this actual execution.

Return ONLY a valid JSON array. Each issue must have:
- "severity": "critical" | "warning" | "suggestion"
- "line": line number as number or null
- "issue": short title
- "explanation": what actually happened at runtime and why
- "fix": suggested code fix
- "category": "runtime"

Return ONLY the JSON array. No markdown, no backticks, no extra text.

Code:
\`\`\`${language}
${code}
\`\`\`
  `.trim();
}