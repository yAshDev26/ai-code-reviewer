export function buildCrossFilePrompt(
  files: { path: string; exports: string[]; imports: string[]; language: string }[],
): string {
  const fileSummaries = files
    .map(
      (f) =>
        `File: ${f.path}\nExports: ${f.exports.join(', ') || 'none'}\nImports: ${f.imports.join(', ') || 'none'}`,
    )
    .join('\n\n');

  return `
You are a senior architect analyzing relationships between files in a codebase.

Files and their imports/exports:

${fileSummaries}

Look for cross-file issues such as:
- Imports that don't match any known export (broken references)
- Inconsistent naming conventions across files
- Potential duplicate logic suggested by similar export names
- Circular dependency risks

Return ONLY a valid JSON array of cross-file issues. Each issue must have:
- "severity": "critical" | "warning" | "suggestion"
- "files": array of file paths involved
- "issue": short title
- "explanation": what the cross-file problem is

If no cross-file issues found, return an empty array [].
Return ONLY valid JSON. No markdown, no backticks, no extra text.
  `.trim();
}