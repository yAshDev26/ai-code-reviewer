"use client";

import { useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { useReview } from "@/hooks/useReview";
import { useProjectReview } from "@/hooks/useProjectReview";
import Header from "@/components/layout/Header";
import SingleFileLayout from "@/components/editor/SingleFileLayout";
import ProjectReviewLayout from "@/components/project/ProjectReviewLayout";

export default function Home() {
  const { t } = useTheme();
  const [mode, setMode] = useState<"single" | "project">("single");
  const review = useReview();
  const project = useProjectReview();

  return (
    <main style={{
      height: "100vh", backgroundColor: t.bg, color: t.text,
      display: "flex", flexDirection: "column", overflow: "hidden",
      transition: "background-color 0.3s ease, color 0.3s ease",
    }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <Header
        mode={mode}
        onModeChange={setMode}
        singleMode={mode === "single" ? {
          language: review.language,
          loading: review.loading,
          isDisabled: review.isDisabled,
          getButtonLabel: review.getButtonLabel,
          onLanguageChange: review.handleLanguageChange,
          onReview: review.handleReview,
          onRunCode: review.handleRunCode,
          onRunAndReview: review.handleRunAndReview,
          runLoading: review.executionLoading,
          combinedLoading: review.combinedLoading,
        } : undefined}
      />

      {mode === "single"
        ? <SingleFileLayout review={review} />
        : <ProjectReviewLayout project={project} />
      }
    </main>
  );
}