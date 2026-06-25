"use client";

import { useTheme, colors } from "@/context/ThemeContext";
import { ExecutionResult } from "@/types/review";

interface Props {
  execution: ExecutionResult;
}

export default function ConsolePanel({ execution }: Props) {
  const { t } = useTheme();
  const statusToken = execution.success ? colors.success : colors.danger;

  return (
    <div style={{
      border: `1px solid ${t.border}`,
      borderRadius: "12px",
      overflow: "hidden",
    }}>
      {/* Header */}
      <div style={{
        backgroundColor: t.surface,
        borderBottom: `1px solid ${t.border}`,
        padding: "10px 14px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "13px" }}>🖥️</span>
          <span style={{ fontSize: "12px", fontWeight: 700, color: t.text }}>
            Console Output
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "11px", color: t.subtext }}>
            {execution.executionTimeMs}ms
          </span>
          <span style={{
            fontSize: "11px",
            fontWeight: 700,
            color: statusToken.text,
            backgroundColor: statusToken.bg,
            border: `1px solid ${statusToken.border}`,
            padding: "2px 10px",
            borderRadius: "9999px",
          }}>
            {execution.success ? "✓ Exit 0" : `✗ Exit ${execution.exitCode}`}
          </span>
        </div>
      </div>

      {/* Terminal body */}
      <div style={{
        backgroundColor: "#0a0a0a",
        padding: "12px 14px",
        maxHeight: "220px",
        overflowY: "auto",
        fontFamily: "monospace",
        fontSize: "12px",
        lineHeight: 1.6,
      }}>
        {execution.stdout && (
          <pre style={{ margin: 0, color: "#e2e8f0", whiteSpace: "pre-wrap" }}>
            {execution.stdout}
          </pre>
        )}
        {execution.stderr && (
          <pre style={{
            margin: execution.stdout ? "8px 0 0 0" : 0,
            color: "#f87171",
            whiteSpace: "pre-wrap",
          }}>
            {execution.stderr}
          </pre>
        )}
        {!execution.stdout && !execution.stderr && (
          <span style={{ color: "#6b7280" }}>(no output)</span>
        )}
      </div>
    </div>
  );
}