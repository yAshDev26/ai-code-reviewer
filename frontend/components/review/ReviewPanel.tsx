"use client";

import { useState } from "react";
import { ReviewIssue } from "@/types/review";
import { colors, useTheme } from "@/context/ThemeContext";
import SeverityBadge from "@/components/review/SeverityBadge";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";

interface Props {
  issues: ReviewIssue[];
}

type Filter = "all" | "critical" | "warning" | "suggestion";

export default function ReviewPanel({ issues }: Props) {
  const { t } = useTheme();
  const [copied, setCopied] = useState<number | null>(null);
  const [filter, setFilter] = useState<Filter>("all");

  const handleCopy = (fix: string, index: number) => {
    navigator.clipboard.writeText(fix).then(() => {
      setCopied(index);
      setTimeout(() => setCopied(null), 2000);
    }).catch(() => {
      // Fallback for browsers that block clipboard
      const el = document.createElement("textarea");
      el.value = fix;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(index);
      setTimeout(() => setCopied(null), 2000);
    });
  };

  const filters: {
    label: string;
    value: Filter;
    token: typeof colors.critical | null;
  }[] = [
    { label: "All", value: "all", token: null },
    { label: "Critical", value: "critical", token: colors.critical },
    { label: "Warning", value: "warning", token: colors.warning },
    { label: "Suggestion", value: "suggestion", token: colors.suggestion },
  ];

  const filtered =
    filter === "all" ? issues : issues.filter((i) => i.severity === filter);

  if (issues.length === 0) {
    return (
      <EmptyState
        icon="✅"
        title="No issues found!"
        description="Your code looks great."
      />
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

      {/* Section Title */}
      <span style={{
        fontSize: "12px", color: t.subtext,
        textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600,
      }}>
        Issues Found ({issues.length})
      </span>

      {/* Filter Tabs */}
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
        {filters.map((f) => {
          const isActive = filter === f.value;
          const count =
            f.value === "all"
              ? issues.length
              : issues.filter((i) => i.severity === f.value).length;
          return (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              style={{
                fontSize: "12px", fontWeight: 600,
                padding: "5px 14px",
                borderRadius: "9999px",
                border: `1.5px solid ${isActive ? (f.token?.border ?? t.accent) : t.border}`,
                backgroundColor: isActive ? (f.token?.bg ?? `${t.accent}20`) : "transparent",
                color: isActive ? (f.token?.text ?? t.accent) : t.subtext,
                cursor: "pointer",
                transition: "all 0.15s ease",
                display: "flex", alignItems: "center", gap: "6px",
              }}
            >
              {f.label}
              <span style={{
                fontSize: "11px",
                backgroundColor: isActive ? "rgba(255,255,255,0.15)" : t.border,
                color: isActive ? (f.token?.text ?? t.accent) : t.subtext,
                padding: "1px 7px",
                borderRadius: "9999px",
              }}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* No results for filter */}
      {filtered.length === 0 && (
        <div style={{
          textAlign: "center", padding: "24px",
          color: t.subtext, fontSize: "13px",
          border: `1px dashed ${t.border}`,
          borderRadius: "12px",
        }}>
          No {filter} issues found
        </div>
      )}

      {/* Issue Cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {filtered.map((issue, index) => (
          <Card key={index} hoverable padding="16px">
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>

              {/* Badge + Category + Line */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "6px" }}>
                
                {/* Left side — Severity + Category */}
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <SeverityBadge severity={issue.severity} />
                  
                  {issue.category && (
                    <span style={{
                      fontSize: "10px",
                      fontWeight: 600,
                      padding: "3px 8px",
                      borderRadius: "9999px",
                      backgroundColor: t.bg,
                      color: t.subtext,
                      border: `1px solid ${t.border}`,
                      textTransform: "uppercase" as const,
                      letterSpacing: "0.06em",
                    }}>
                      {issue.category === "security" ? "🔒 Security"
                        : issue.category === "performance" ? "⚡ Performance"
                        : issue.category === "best-practices" ? "📐 Best Practices"
                        : issue.category === "code-style" ? "🎨 Code Style"
                        : issue.category}
                    </span>
                  )}
                </div>

                {/* Right side — Line number */}
                {issue.line && (
                  <span style={{
                    fontSize: "11px", color: t.subtext,
                    backgroundColor: t.bg,
                    padding: "3px 10px", borderRadius: "6px",
                    border: `1px solid ${t.border}`,
                    fontFamily: "monospace",
                  }}>
                    Line {issue.line}
                  </span>
                )}
              </div>

              {/* Title */}
              <p style={{ margin: 0, color: t.text, fontWeight: 600, fontSize: "14px" }}>
                {issue.issue}
              </p>

              {/* Explanation */}
              <p style={{ margin: 0, color: t.subtext, fontSize: "13px", lineHeight: 1.6 }}>
                {issue.explanation}
              </p>

              {/* Fix Block */}
              {issue.fix && (
                <div style={{ position: "relative" }}>
                  <div style={{
                    backgroundColor: t.codeBg,
                    border: `1px solid ${t.border}`,
                    borderRadius: "8px",
                    padding: "12px 14px",
                    paddingRight: "90px",
                  }}>
                    <pre style={{
                      margin: 0,
                      color: colors.suggestion.text,
                      fontSize: "12px",
                      fontFamily: "monospace",
                      overflowX: "auto",
                      whiteSpace: "pre-wrap",
                      lineHeight: 1.6,
                    }}>
                      {issue.fix}
                    </pre>
                  </div>

                  {/* Copy Button */}
                  <div style={{ position: "absolute", top: "8px", right: "8px" }}>
                    <Button
                      onClick={() => handleCopy(issue.fix, index)}
                      variant={copied === index ? "success" : "neutral"}
                      size="sm"
                    >
                      {copied === index ? "✅ Copied!" : "📋 Copy"}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}