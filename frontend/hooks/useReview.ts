import { useState } from "react";
import { ReviewResponse, AutoFixResponse } from "@/types/review";
import { reviewCode, autoFixCode, runCode, runAndReview } from "@/lib/api";
import { ExecutionResult } from "@/types/review";
import { getErrorMessage } from "@/lib/errors";

const EMPTY_STATES = ["// Paste your code here...", "", " "];

export function useReview() {
  const [code, setCode] = useState("// Paste your code here...");
  const [language, setLanguage] = useState("javascript");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ReviewResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [reviewedLanguage, setReviewedLanguage] = useState<string | null>(null);

  // File tracking
  const [importedFileName, setImportedFileName] = useState<string | null>(null);
  const [originalFileCode, setOriginalFileCode] = useState<string | null>(null);
  const [fileCleared, setFileCleared] = useState(false);

  // ── AutoFix state (moved up from AutoFixPanel) ──────────────────────────
  const [fixLoading, setFixLoading] = useState(false);
  const [fixError, setFixError] = useState<string | null>(null);
  const [fixResult, setFixResult] = useState<AutoFixResponse | null>(null);
  const [fixApplied, setFixApplied] = useState(false);

  // Execution state
  const [stdin, setStdin] = useState("");
  const [executionResult, setExecutionResult] = useState<ExecutionResult | null>(null);
  const [executionLoading, setExecutionLoading] = useState(false);
  const [executionError, setExecutionError] = useState<string | null>(null);
  const [combinedLoading, setCombinedLoading] = useState(false);
  const [executedLanguage, setExecutedLanguage] = useState<string | null>(null);

  // Derived state
  const isCodeEmpty = EMPTY_STATES.includes(code.trim());
  const isDisabled = loading || fileCleared || isCodeEmpty;
  const isLanguageStale = !!reviewedLanguage && language !== reviewedLanguage;
  const isExecutionLanguageStale = !!executedLanguage && language !== executedLanguage;

  const getButtonLabel = () => {
    if (loading) return null;
    if (fileCleared) return "⚠️ Restore Code First";
    if (isCodeEmpty) return "✏️ No Code Yet";
    return "Review Code";
  };

  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
    if (importedFileName && originalFileCode) {
      const isEmpty =
        newCode.trim() === "" ||
        newCode.trim() === "// Paste your code here...";
      setFileCleared(isEmpty);
    }
  };

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
  };

  const handleFileLoad = (fileCode: string, fileLanguage: string, fileName: string) => {
    setCode(fileCode);
    setLanguage(fileLanguage);
    setOriginalFileCode(fileCode);
    setImportedFileName(fileName);
    setFileCleared(false);
    setResult(null);
    setError(null);
    setFixError(null);
    setFixResult(null);
    setFixApplied(false);
    setReviewedLanguage(null);
    setExecutedLanguage(null);
    setExecutionResult(null);
    setExecutionError(null);
  };

  const handleFileClear = () => {
    setImportedFileName(null);
    setOriginalFileCode(null);
    setFileCleared(false);
    setCode("// Paste your code here...");
    setResult(null);
    setError(null);
    setFixError(null);
    setFixResult(null);
    setFixApplied(false);
    setReviewedLanguage(null);
    setExecutedLanguage(null);
    setExecutionResult(null);
    setExecutionError(null);
  };

  const handleRestoreFile = () => {
    if (originalFileCode) {
      setCode(originalFileCode);
      setFileCleared(false);
    }
  };

  const handleReview = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    setFixError(null);
    setFixResult(null);
    setFixApplied(false);
    setExecutionResult(null);
    setExecutionError(null);
    try {
      const data = await reviewCode(code, language);
      setResult(data);
      setReviewedLanguage(language);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  // ── AutoFix handlers (owned by hook, not by AutoFixPanel) ───────────────
  const handleAutoFix = async () => {
    if (!result?.issues.length) return;
    setFixLoading(true);
    setFixError(null);
    setFixResult(null);
    setFixApplied(false);
    try {
      const prioritized = [
        ...result.issues.filter((i) => i.severity === "critical"),
        ...result.issues.filter((i) => i.severity === "warning"),
        ...result.issues.filter((i) => i.severity === "suggestion"),
      ].slice(0, 10);
      const data = await autoFixCode(code, language, prioritized);
      setFixResult(data);
    } catch (err) {
      setFixError(getErrorMessage(err));
    } finally {
      setFixLoading(false);
    }
  };

  const handleAutoFixApplied = (fixedCode: string) => {
    const cleaned = fixedCode
      .replace(/\\n/g, "\n")
      .replace(/\\t/g, "\t")
      .replace(/\\"/g, '"')
      .replace(/\\\\/g, "\\")
      .trimEnd();
    setCode(cleaned);
    setOriginalFileCode(cleaned);
    setFileCleared(false);
    setResult(null);
    setReviewedLanguage(null);
    setFixError(null);
    setFixResult(null);
    setFixApplied(true);
  };

  const handleRunCode = async () => {
    setExecutionLoading(true);
    setExecutionError(null);
    setExecutionResult(null);
    setResult(null);
    setError(null);
    setReviewedLanguage(null);
    setExecutedLanguage(null);
    try {
      const data = await runCode(code, language, stdin);
      setExecutionResult(data.execution);
      setExecutedLanguage(language);
    } catch (err) {
      setExecutionError(getErrorMessage(err));
    } finally {
      setExecutionLoading(false);
    }
  };

  const handleRunAndReview = async () => {
    setCombinedLoading(true);
    setError(null);
    setExecutionError(null);
    setResult(null);
    setExecutionResult(null);
    setExecutedLanguage(null);
    setFixResult(null);
    setFixApplied(false);
    try {
      const data = await runAndReview(code, language, stdin);
      const { execution, ...reviewPart } = data;
      setResult(reviewPart as ReviewResponse);
      setExecutionResult(execution);
      setReviewedLanguage(language);
      setExecutedLanguage(language);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setCombinedLoading(false);
    }
  };

  return {
    code, language, loading, result, error,
    reviewedLanguage, importedFileName, fileCleared,
    isCodeEmpty, isDisabled, isLanguageStale,
    getButtonLabel,
    handleCodeChange, handleLanguageChange,
    handleFileLoad, handleFileClear, handleRestoreFile,
    handleReview,
    // AutoFix — owned by hook
    fixLoading, fixError, fixResult, fixApplied,
    handleAutoFix, handleAutoFixApplied,
    // Execution
    stdin, setStdin,
    executionResult, executionLoading, executionError,
    combinedLoading, executedLanguage, isExecutionLanguageStale,
    handleRunCode, handleRunAndReview,
  };
}