export interface ReviewIssue {
  severity: "critical" | "warning" | "suggestion";
  line: number | null;
  issue: string;
  explanation: string;
  fix: string;
  category?: "security" | "performance" | "best-practices" | "code-style";
}

export interface ReviewResponse {
  score: number;
  language: string;
  issues: ReviewIssue[];
}

export interface AutoFixResponse {
  fixedCode: string;
  summary: string[];
}

export interface ProjectFileInput {
  path: string;
  content: string;
  language: string;
}

export interface FileReviewResult {
  path: string;
  language: string;
  score: number;
  issues: ReviewIssue[];
  exports: string[];
  imports: string[];
  error?: string;
}

export interface CrossFileIssue {
  severity: "critical" | "warning" | "suggestion";
  files: string[];
  issue: string;
  explanation: string;
}

export interface ProjectReviewResponse {
  overallScore: number;
  totalFiles: number;
  totalIssues: number;
  files: FileReviewResult[];
  crossFileIssues: CrossFileIssue[];
  warning: string | null;
  meta: { totalDurationMs: number };
}

export interface ExecutionResult {
  stdout: string;
  stderr: string;
  exitCode: number;
  executionTimeMs: number;
  success: boolean;
  compileError: string | null;
}