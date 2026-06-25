"use client";

import { useReview } from "@/hooks/useReview";
import EditorPanel from "@/components/editor/EditorPanel";
import ResultsPanel from "@/components/review/ResultsPanel";

interface Props {
  review: ReturnType<typeof useReview>;
}

export default function SingleFileLayout({ review }: Props) {
  return (
    <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
      <EditorPanel
        code={review.code}
        language={review.language}
        isCodeEmpty={review.isCodeEmpty}
        fileCleared={review.fileCleared}
        importedFileName={review.importedFileName}
        onCodeChange={review.handleCodeChange}
        onFileLoad={review.handleFileLoad}
        onFileClear={review.handleFileClear}
        onRestoreFile={review.handleRestoreFile}
        stdin={review.stdin}
        onStdinChange={review.setStdin}
      />
      <ResultsPanel
        result={review.result}
        loading={review.loading || review.combinedLoading}
        error={review.error}
        code={review.code}
        language={review.language}
        reviewedLanguage={review.reviewedLanguage}
        isLanguageStale={review.isLanguageStale}
        onReview={review.handleReview}
        fixLoading={review.fixLoading}
        fixError={review.fixError}
        fixResult={review.fixResult}
        fixApplied={review.fixApplied}
        onAutoFix={review.handleAutoFix}
        onAutoFixApplied={review.handleAutoFixApplied}
        executionResult={review.executionResult}
        executionLoading={review.executionLoading}
        executionError={review.executionError}
        executedLanguage={review.executedLanguage}
        isExecutionLanguageStale={review.isExecutionLanguageStale}
        onRerunExecution={review.result ? review.handleRunAndReview : review.handleRunCode}
      />
    </div>
  );
}