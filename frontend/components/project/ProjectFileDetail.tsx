"use client";

import { useTheme } from "@/context/ThemeContext";
import { FileReviewResult } from "@/types/review";
import ScoreCard from "@/components/review/ScoreCard";
import ReviewPanel from "@/components/review/ReviewPanel";
import Banner from "@/components/ui/Banner";

interface Props {
  file: FileReviewResult;
}

export default function ProjectFileDetail({ file }: Props) {
  const { t } = useTheme();

  if (file.error) {
    return <Banner variant="danger" icon="⚠️" title={`Failed to analyze ${file.path}`} description={file.error} />;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <p style={{ margin: 0, fontSize: "13px", fontWeight: 700, color: t.text, fontFamily: "monospace" }}>
        📄 {file.path}
      </p>
      <ScoreCard score={file.score} totalIssues={file.issues.length} issues={file.issues} />
      <ReviewPanel issues={file.issues} />
    </div>
  );
}