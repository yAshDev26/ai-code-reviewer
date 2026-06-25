import { ReviewIssue } from '../../review/interfaces/review.interfaces';

// ── Input ────────────────────────────────────────────────────────────────────

export interface ProjectFileInput {
  path: string;
  content: string;
  language: string;
}

// ── Per-file AI response shape (what Groq returns for file-summary prompt) ───

export interface AiFileSummaryResponse {
  score: number;
  issues: ReviewIssue[];
  exports: string[];
  imports: string[];
}

// ── Output shapes ────────────────────────────────────────────────────────────

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
  severity: 'critical' | 'warning' | 'suggestion';
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