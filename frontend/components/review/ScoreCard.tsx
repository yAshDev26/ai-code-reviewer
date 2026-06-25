import { useTheme, colors } from "@/context/ThemeContext";
import { ReviewIssue } from "@/types/review";
import ScoreDial from "@/components/ui/ScoreDial";

interface Props {
  score:       number;
  totalIssues: number;
  issues:      ReviewIssue[];
}

export default function ScoreCard({ score, totalIssues, issues }: Props) {
  const { t } = useTheme();

  const critical   = issues.filter((i) => i.severity === "critical").length;
  const warning    = issues.filter((i) => i.severity === "warning").length;
  const suggestion = issues.filter((i) => i.severity === "suggestion").length;

  const scoreLabel =
    score >= 8 ? "Great" : score >= 5 ? "Needs Work" : "Poor";

  const scoreToken =
    score >= 8 ? colors.suggestion : score >= 5 ? colors.warning : colors.critical;

  return (
    <div style={{
      backgroundColor: t.surface,
      border:          `1px solid ${t.border}`,
      borderRadius:    "14px",
      padding:         "20px",
      display:         "flex",
      flexDirection:   "column",
      gap:             "16px",
    }}>

      {/* Score row — now uses ScoreDial */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <ScoreDial score={score} size={72} />
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <span style={{
            fontSize:      "11px",
            color:         t.subtext,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            fontWeight:    600,
          }}>
            Code Quality
          </span>
          <span style={{ fontSize: "20px", fontWeight: 700, color: scoreToken.text }}>
            {scoreLabel}
          </span>
          <span style={{ fontSize: "12px", color: t.subtext }}>
            {totalIssues} issue{totalIssues !== 1 ? "s" : ""} found
          </span>
        </div>
      </div>

      {/* Score bar */}
      <div>
        <div style={{
          width:        "100%",
          height:       "6px",
          backgroundColor: t.border,
          borderRadius: "9999px",
          overflow:     "hidden",
        }}>
          <div style={{
            height:          "100%",
            width:           `${score * 10}%`,
            backgroundColor: scoreToken.solid,
            borderRadius:    "9999px",
            transition:      "width 0.6s ease",
          }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "4px" }}>
          <span style={{ fontSize: "10px", color: t.subtext }}>0</span>
          <span style={{ fontSize: "10px", color: t.subtext }}>10</span>
        </div>
      </div>

      {/* Breakdown */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" }}>
        {[
          { count: critical,   label: "Critical",    token: colors.critical   },
          { count: warning,    label: "Warnings",    token: colors.warning    },
          { count: suggestion, label: "Suggestions", token: colors.suggestion },
        ].map(({ count, label, token }) => (
          <div key={label} style={{
            backgroundColor: token.bg,
            border:          `1px solid ${token.border}`,
            borderRadius:    "10px",
            padding:         "12px 8px",
            textAlign:       "center",
          }}>
            <p style={{ fontSize: "24px", fontWeight: 700, color: token.text, margin: 0 }}>
              {count}
            </p>
            <p style={{ fontSize: "11px", color: token.text, opacity: 0.85, margin: "4px 0 0 0" }}>
              {label}
            </p>
          </div>
        ))}
      </div>

      {/* Agent breakdown */}
      {issues.some((i) => i.category) && (
        <div>
          <p style={{
            margin:        "0 0 8px 0",
            fontSize:      "11px",
            fontWeight:    600,
            color:         t.subtext,
            textTransform: "uppercase" as const,
            letterSpacing: "0.08em",
          }}>
            Agent Breakdown
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
            {[
              { label: "🔒 Security",       cat: "security"       },
              { label: "⚡ Performance",    cat: "performance"    },
              { label: "📐 Best Practices", cat: "best-practices" },
              { label: "🎨 Code Style",     cat: "code-style"     },
            ].map(({ label, cat }) => {
              const count = issues.filter((i) => i.category === cat).length;
              return (
                <div key={cat} style={{
                  backgroundColor: t.bg,
                  border:          `1px solid ${t.border}`,
                  borderRadius:    "8px",
                  padding:         "8px 12px",
                  display:         "flex",
                  justifyContent:  "space-between",
                  alignItems:      "center",
                }}>
                  <span style={{ fontSize: "11px", color: t.subtext, fontWeight: 500 }}>
                    {label}
                  </span>
                  <span style={{
                    fontSize:   "15px",
                    fontWeight: 700,
                    color:      count > 0 ? t.text : t.subtext,
                    opacity:    count === 0 ? 0.4 : 1,
                  }}>
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}