"use client";

import { useTheme, colors } from "@/context/ThemeContext";
import { ProjectReviewResponse, FileReviewResult } from "@/types/review";
import Banner from "@/components/ui/Banner";
import Card from "@/components/ui/Card";
import ScoreDial from "@/components/ui/ScoreDial";

interface Props {
  result:           ProjectReviewResponse;
  selectedFilePath: string | null;
  onSelectFile:     (path: string) => void;
}

function getScoreToken(score: number) {
  if (score >= 8) return colors.suggestion;
  if (score >= 5) return colors.warning;
  return colors.critical;
}

function getScoreDot(score: number) {
  if (score >= 8) return "🟢";
  if (score >= 5) return "🟡";
  return "🔴";
}

export default function ProjectOverview({ result, selectedFilePath, onSelectFile }: Props) {
  const { t } = useTheme();
  const sortedFiles = [...result.files].sort((a, b) => a.score - b.score);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

      {result.warning && (
        <Banner
          variant="warning"
          icon="⚠️"
          title="Some files were skipped"
          description={result.warning}
        />
      )}

      {/* Overall score card — now uses ScoreDial */}
      <Card padding="20px">
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <ScoreDial score={result.overallScore} size={72} />
          <div>
            <span style={{
              fontSize:      "11px",
              color:         t.subtext,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              fontWeight:    600,
            }}>
              Project Health
            </span>
            <p style={{ margin: "4px 0 0 0", fontSize: "13px", color: t.subtext }}>
              {result.totalFiles} file{result.totalFiles !== 1 ? "s" : ""} reviewed
              {" · "}
              {result.totalIssues} issue{result.totalIssues !== 1 ? "s" : ""} found
            </p>
          </div>
        </div>
      </Card>

      {/* Cross-file issues */}
      {result.crossFileIssues.length > 0 && (
        <Card padding="16px">
          <p style={{ margin: "0 0 10px 0", fontSize: "12px", fontWeight: 700, color: t.text }}>
            🔗 Cross-File Issues ({result.crossFileIssues.length})
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {result.crossFileIssues.map((issue, idx) => (
              <div key={idx} style={{
                backgroundColor: t.bg,
                border:          `1px solid ${t.border}`,
                borderRadius:    "8px",
                padding:         "10px 12px",
              }}>
                <p style={{ margin: 0, fontSize: "12px", fontWeight: 600, color: t.text }}>
                  {issue.issue}
                </p>
                <p style={{ margin: "4px 0 6px 0", fontSize: "12px", color: t.subtext }}>
                  {issue.explanation}
                </p>
                <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
                  {issue.files.map((f) => (
                    <span key={f} style={{
                      fontSize:        "10px",
                      fontFamily:      "monospace",
                      backgroundColor: t.surface,
                      border:          `1px solid ${t.border}`,
                      borderRadius:    "4px",
                      padding:         "2px 6px",
                      color:           t.subtext,
                    }}>
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* File tree */}
      <Card padding="16px">
        <p style={{ margin: "0 0 10px 0", fontSize: "12px", fontWeight: 700, color: t.text }}>
          📁 Files (sorted by score)
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          {sortedFiles.map((file: FileReviewResult) => (
            <button
              key={file.path}
              onClick={() => onSelectFile(file.path)}
              style={{
                display:         "flex",
                alignItems:      "center",
                justifyContent:  "space-between",
                backgroundColor: selectedFilePath === file.path
                  ? `${t.accent}15`
                  : "transparent",
                border:          `1px solid ${selectedFilePath === file.path
                  ? t.accent
                  : "transparent"}`,
                borderRadius:    "8px",
                padding:         "8px 10px",
                cursor:          "pointer",
                textAlign:       "left",
                transition:      "all 0.15s ease",
                width:           "100%",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px", minWidth: 0 }}>
                <span>{file.error ? "⚪" : getScoreDot(file.score)}</span>
                <span style={{
                  fontSize:     "12px",
                  color:        t.text,
                  fontFamily:   "monospace",
                  whiteSpace:   "nowrap",
                  overflow:     "hidden",
                  textOverflow: "ellipsis",
                }}>
                  {file.path}
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
                {file.error ? (
                  <span style={{ fontSize: "11px", color: "#f87171" }}>Failed</span>
                ) : (
                  <>
                    <span style={{ fontSize: "11px", color: t.subtext }}>
                      {file.issues.length} issue{file.issues.length !== 1 ? "s" : ""}
                    </span>
                    <span style={{
                      fontSize:   "12px",
                      fontWeight: 700,
                      color:      getScoreToken(file.score).text,
                    }}>
                      {file.score}/10
                    </span>
                  </>
                )}
              </div>
            </button>
          ))}
        </div>
      </Card>
    </div>
  );
}