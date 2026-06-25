"use client";

import { AutoFixResponse, ReviewIssue } from "@/types/review";
import { useTheme, colors } from "@/context/ThemeContext";
import Button from "@/components/ui/Button";
import Banner from "@/components/ui/Banner";

interface Props {
  issues: ReviewIssue[];
  loading: boolean;
  result: AutoFixResponse | null;
  error: string | null;
  applied: boolean;
  onFix: () => void;                       // triggers hook's handleAutoFix
  onFixApplied: (fixedCode: string) => void; // triggers hook's handleAutoFixApplied
}

export default function AutoFixPanel({
  issues,
  loading,
  result,
  error,
  applied,
  onFix,
  onFixApplied,
}: Props) {
  const { t } = useTheme();

  const issueCount = issues.length;
  const isCapped = issueCount > 10;

  return (
    <div style={{
      backgroundColor: t.surface,
      border: `1px solid ${t.border}`,
      borderRadius: "14px",
      overflow: "hidden",
    }}>
      {/* Header */}
      <div style={{
        padding: "14px 16px",
        borderBottom: result ? `1px solid ${t.border}` : "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "12px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{
            width: "36px", height: "36px",
            backgroundColor: `${t.accent}20`,
            border: `1px solid ${t.accent}`,
            borderRadius: "10px",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "18px", flexShrink: 0,
          }}>🔧</div>
          <div>
            <p style={{ margin: 0, fontWeight: 700, fontSize: "14px", color: t.text }}>
              Auto Fix All
            </p>
            <p style={{ margin: 0, fontSize: "11px", color: t.subtext }}>
              {isCapped
                ? `Fixing top 10 of ${issueCount} issues (critical first)`
                : `Let AI fix all ${issueCount} issue${issueCount !== 1 ? "s" : ""} automatically`}
            </p>
          </div>
        </div>

        <Button
          onClick={onFix}
          disabled={applied}
          loading={loading}
          variant={applied ? "success" : "primary"}
          size="md"
        >
          {applied ? "✅ Applied" : loading ? "Fixing..." : "✨ Fix All Issues"}
        </Button>
      </div>

      {/* Error */}
      {error && (
        <div style={{ padding: "12px 16px" }}>
          <Banner variant="danger" icon="⚠️" title="Auto Fix Failed" description={error} />
        </div>
      )}

      {/* Result */}
      {result && (
        <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "14px" }}>

          {/* Summary */}
          <div>
            <p style={{
              margin: "0 0 10px 0", fontSize: "11px", fontWeight: 600,
              color: t.subtext, textTransform: "uppercase", letterSpacing: "0.08em",
            }}>
              Fixes Applied ({result.summary.length})
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {result.summary.map((fix, index) => (
                <div key={index} style={{ display: "flex", alignItems: "flex-start", gap: "8px", fontSize: "13px", color: t.text }}>
                  <span style={{ color: colors.success.text, flexShrink: 0 }}>✓</span>
                  <span>{fix}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Fixed Code Preview */}
          <div>
            <p style={{
              margin: "0 0 8px 0", fontSize: "11px", fontWeight: 600,
              color: t.subtext, textTransform: "uppercase" as const, letterSpacing: "0.08em",
            }}>
              Fixed Code Preview
            </p>
            <div style={{
              backgroundColor: t.codeBg, border: `1px solid ${t.border}`,
              borderRadius: "8px", padding: "12px 14px",
              maxHeight: "200px", overflowY: "auto",
            }}>
              <pre style={{
                margin: 0, color: colors.success.text, fontSize: "12px",
                fontFamily: "monospace", whiteSpace: "pre",
                lineHeight: 1.6, tabSize: 2, overflowX: "auto",
              }}>
                {result.fixedCode
                  .replace(/\\n/g, "\n")
                  .replace(/\\t/g, "\t")
                  .replace(/\\"/g, '"')
                  .replace(/\\\\/g, "\\")}
              </pre>
            </div>
          </div>

          {/* Apply / Applied */}
          {!applied ? (
            <Button onClick={() => onFixApplied(result.fixedCode)} variant="success" size="md" fullWidth>
              ⬆️ Apply Fixed Code to Editor
            </Button>
          ) : (
            <Banner
              variant="success"
              icon="✅"
              title="Fixed code applied to editor!"
              description="Click Review Code again to verify the improvements."
            />
          )}
        </div>
      )}
    </div>
  );
}