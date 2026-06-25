import { useState } from "react";
import { ProjectReviewResponse, ProjectFileInput } from "@/types/review";
import { reviewProjectFiles, reviewGithubRepo } from "@/lib/api";
import { EXTENSION_MAP } from "@/lib/constants/languages"; // ← replaces inline map
import { getErrorMessage } from "@/lib/errors";

const MAX_FILES = 5;

export function useProjectReview() {
  const [files, setFiles] = useState<ProjectFileInput[]>([]);
  const [repoUrl, setRepoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ProjectReviewResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedFilePath, setSelectedFilePath] = useState<string | null>(null);

  const fileCountWarning =
    files.length > MAX_FILES
      ? `Only the first ${MAX_FILES} files will be reviewed (${files.length} selected).`
      : null;

  const handleFilesSelected = (fileList: FileList) => {
    setError(null);
    const newFiles: ProjectFileInput[] = [];
    const promises: Promise<void>[] = [];

    Array.from(fileList).forEach((file) => {
      const ext = file.name.split(".").pop()?.toLowerCase() || "";
      const language = EXTENSION_MAP[ext]; // ← uses shared constant
      if (!language) return;

      const promise = file.text().then((content) => {
        newFiles.push({
          path: (file as any).webkitRelativePath || file.name,
          content,
          language,
        });
      });
      promises.push(promise);
    });

    Promise.all(promises).then(() => {
      setFiles((prev) => [...prev, ...newFiles]);
    });
  };

  const handleRemoveFile = (path: string) => {
    setFiles((prev) => prev.filter((f) => f.path !== path));
  };

  const handleClearFiles = () => {
    setFiles([]);
    setResult(null);
    setError(null);
  };

  const handleReviewFiles = async () => {
    if (files.length === 0) {
      setError("Please add at least one file to review.");
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);
    setSelectedFilePath(null);
    try {
      const data = await reviewProjectFiles(files.slice(0, MAX_FILES));
      setResult(data);
      if (data.files.length > 0) {
        setSelectedFilePath(data.files[0].path);
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleReviewGithub = async () => {
    if (!repoUrl.trim()) {
      setError("Please enter a GitHub repository URL.");
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);
    setSelectedFilePath(null);
    try {
      const data = await reviewGithubRepo(repoUrl.trim());
      setResult(data);
      if (data.files.length > 0) {
        setSelectedFilePath(data.files[0].path);
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return {
    files,
    repoUrl,
    setRepoUrl,
    loading,
    result,
    error,
    selectedFilePath,
    setSelectedFilePath,
    fileCountWarning,
    handleFilesSelected,
    handleRemoveFile,
    handleClearFiles,
    handleReviewFiles,
    handleReviewGithub,
  };
}