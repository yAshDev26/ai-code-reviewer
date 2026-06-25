"use client";

import { useTheme } from "@/context/ThemeContext";
import { ReviewResponse, ExecutionResult, AutoFixResponse } from "@/types/review";
import ScoreCard    from "../review/ScoreCard";
import ReviewPanel  from "../review/ReviewPanel";
import AutoFixPanel from "../review/AutoFixPanel";
import Banner       from "../ui/Banner";
import Badge        from "../ui/Badge";
import Spinner      from "../ui/Spinner";
import EmptyState   from "../ui/EmptyState";
import ConsolePanel from "@/components/execution/ConsolePanel";

interface Props {
  result:           ReviewResponse | null;
  loading:          boolean;
  error:            string | null;
  code:             string;
  language:         string;
  reviewedLanguage: string | null;
  isLanguageStale:  boolean;
  onReview:         () => void;
  fixLoading:       boolean;
  fixError:         string | null;
  fixResult:        AutoFixResponse | null;
  fixApplied:       boolean;
  onAutoFix:        () => void;
  onAutoFixApplied: (fixedCode: string) => void;
  executionResult:          ExecutionResult | null;
  executionLoading:         boolean;
  executionError:           string | null;
  executedLanguage:         string | null;
  isExecutionLanguageStale: boolean;
  onRerunExecution:         () => void;
}

export default function ResultsPanel({
  result, loading, error, language,
  reviewedLanguage, isLanguageStale, onReview,
  fixLoading, fixError, fixResult, fixApplied,
  onAutoFix, onAutoFixApplied,
  executionError, executionLoading, executionResult,
  executedLanguage, isExecutionLanguageStale, onRerunExecution,
}: Props) {
  const { t } = useTheme();

  const isLoading    = loading || executionLoading;
  const combinedError = error || executionError;
  const hasContent   = result || executionResult;

  const showStaleWarning = isLanguageStale || isExecutionLanguageStale;
  const bothStale        = isLanguageStale && isExecutionLanguageStale;
  const staleFrom        = executedLanguage || reviewedLanguage || "";

  const staleTitle = bothStale
    ? "Language changed — output and review may be outdated"
    : isExecutionLanguageStale
    ? "Language changed — console output may be outdated"
    : "Language changed — review results may be outdated";

  const staleActionLabel = bothStale || isExecutionLanguageStale
    ? `🔄 Re-run in ${language.charAt(0).toUpperCase() + language.slice(1)}`
    : `🔄 Re-review in ${language.charAt(0).toUpperCase() + language.slice(1)}`;

  const staleAction = bothStale || isExecutionLanguageStale
    ? onRerunExecution
    : onReview;

  return (
    <div style={{
      width:           "50%",
      overflowY:       "auto",
      overflowX:       "hidden",
      backgroundColor: t.bg,
      scrollbarGutter: "stable",
    }}>

      {/* Empty state — uses EmptyState component */}
      {!hasContent && !isLoading && !combinedError && (
        <EmptyState
          icon="🤖"
          title="Ready to Review"
          description={
            <>
              Paste your code or upload a file, then click{" "}
              <span style={{ color: t.accent, fontWeight: 600 }}>Review Code</span>
            </>
          }
        >
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", justifyContent: "center" }}>
            <Badge variant="critical" />
            <Badge variant="warning" />
            <Badge variant="suggestion" />
          </div>
        </EmptyState>
      )}

      {/* Loading — uses Spinner component */}
      {isLoading && (
        <div style={{
          height:         "100%",
          minHeight:      "400px",
          display:        "flex",
          flexDirection:  "column",
          alignItems:     "center",
          justifyContent: "center",
          gap:            "16px",
        }}>
          <Spinner size={48} />
          <div style={{ textAlign: "center" }}>
            <p style={{ color: t.text, fontSize: "14px", fontWeight: 500 }}>
              {executionLoading && !loading
                ? "Running your code..."
                : "Analyzing your code..."}
            </p>
            <p style={{ color: t.subtext, fontSize: "12px", marginTop: "4px" }}>
              This usually takes a few seconds
            </p>
          </div>
        </div>
      )}

      {/* Error */}
      {combinedError && !isLoading && (
        <div style={{ margin: "24px" }}>
          <Banner variant="danger" icon="⚠️" title="Error" description={combinedError} />
        </div>
      )}

      {/* Results */}
      {hasContent && !isLoading && (
        <div style={{
          padding:       "20px",
          display:       "flex",
          flexDirection: "column",
          gap:           "16px",
          animation:     "fadeUp 0.3s ease-out",
        }}>
          {showStaleWarning && staleFrom && (
            <Banner
              variant="warning"
              icon="⚠️"
              title={staleTitle}
              description={
                <>
                  Executed/reviewed as{" "}
                  <strong style={{ color: "#f59e0b" }}>
                    {staleFrom.charAt(0).toUpperCase() + staleFrom.slice(1)}
                  </strong>
                  {" → "}now set to{" "}
                  <strong style={{ color: "#f59e0b" }}>
                    {language.charAt(0).toUpperCase() + language.slice(1)}
                  </strong>
                </>
              }
              action={{ label: staleActionLabel, onClick: staleAction }}
            />
          )}

          {executionResult && <ConsolePanel execution={executionResult} />}

          {result && (
            <>
              <ScoreCard
                score={result.score}
                totalIssues={result.issues.length}
                issues={result.issues}
              />
              {result.issues.length > 0 && (
                <AutoFixPanel
                  issues={result.issues}
                  loading={fixLoading}
                  result={fixResult}
                  error={fixError}
                  applied={fixApplied}
                  onFix={onAutoFix}
                  onFixApplied={onAutoFixApplied}
                />
              )}
              <ReviewPanel issues={result.issues} />
            </>
          )}
        </div>
      )}
    </div>
  );
}