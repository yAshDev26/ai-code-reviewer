// ── Core issue type ──────────────────────────────────────────────────────────

export type IssueSeverity = 'critical' | 'warning' | 'suggestion';
export type IssueCategory = 'security' | 'performance' | 'best-practices' | 'code-style' | 'runtime';

export interface ReviewIssue {
  severity: IssueSeverity;
  line: number | null;
  issue: string;
  explanation: string;
  fix: string;
  category?: IssueCategory;
}

// ── Agent & synthesizer shapes ───────────────────────────────────────────────

export interface AgentSummary {
  security: number;
  performance: number;
  bestPractices: number;
  codeStyle: number;
}

export interface ReviewMeta {
  agentsRun: number;
  totalDurationMs: number;
  agentCounts: AgentSummary;
}

// ── API response shapes ──────────────────────────────────────────────────────

export interface ReviewResponse {
  score: number;
  language: string;
  issues: ReviewIssue[];
  agentSummary?: AgentSummary;
  meta?: ReviewMeta;
}

export interface AutoFixResponse {
  fixedCode: string;
  summary: string[];
}

// ── AI raw response shapes (what Groq actually returns before validation) ────
// These are the shapes parseAiJson<T> will validate against

export interface AiReviewResponse {
  score: number;
  language: string;
  issues: ReviewIssue[];
  agentSummary?: AgentSummary;
}

export interface AiAutoFixResponse {
  fixedCode: string;
  summary: string[];
}