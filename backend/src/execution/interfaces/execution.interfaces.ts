import { ReviewIssue } from '../../review/interfaces/review.interfaces';

export interface ExecutionResult {
  stdout: string;
  stderr: string;
  exitCode: number;
  executionTimeMs: number;
  success: boolean;
  compileError: string | null;
}

// Shape of runtime-analysis AI response (array of issues with category: 'runtime')
export type RuntimeAnalysisResponse = ReviewIssue[];