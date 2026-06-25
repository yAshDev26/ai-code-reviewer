"use client";

import { useTheme } from "@/context/ThemeContext";
import { useProjectReview } from "@/hooks/useProjectReview";
import GithubRepoInput    from "@/components/project/GithubRepoInput";
import ProjectFileUpload  from "@/components/project/ProjectFileUpload";
import ProjectOverview    from "@/components/project/ProjectOverview";
import ProjectFileDetail  from "@/components/project/ProjectFileDetail";
import Banner             from "@/components/ui/Banner";
import Button             from "@/components/ui/Button";
import Spinner            from "@/components/ui/Spinner";
import EmptyState         from "@/components/ui/EmptyState";

interface Props {
  project: ReturnType<typeof useProjectReview>;
}

export default function ProjectReviewLayout({ project }: Props) {
  const { t } = useTheme();

  const selectedFile = project.result?.files.find(
    (f) => f.path === project.selectedFilePath,
  );

  return (
    <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>

      {/* Left — Upload / GitHub input */}
      <div style={{
        width:         "40%",
        borderRight:   `1px solid ${t.border}`,
        overflowY:     "auto",
        padding:       "16px",
        display:       "flex",
        flexDirection: "column",
        gap:           "16px",
      }}>
        <GithubRepoInput
          repoUrl={project.repoUrl}
          onRepoUrlChange={project.setRepoUrl}
          onSubmit={project.handleReviewGithub}
          loading={project.loading}
        />

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ flex: 1, height: "1px", backgroundColor: t.border }} />
          <span style={{ fontSize: "11px", color: t.subtext }}>OR</span>
          <div style={{ flex: 1, height: "1px", backgroundColor: t.border }} />
        </div>

        <ProjectFileUpload
          files={project.files}
          onFilesSelected={project.handleFilesSelected}
          onRemoveFile={project.handleRemoveFile}
          onClearFiles={project.handleClearFiles}
        />

        {project.fileCountWarning && (
          <Banner
            variant="warning"
            icon="⚠️"
            title="Too many files"
            description={project.fileCountWarning}
          />
        )}

        {project.files.length > 0 && (
          <Button
            onClick={project.handleReviewFiles}
            disabled={project.loading}
            loading={project.loading}
            variant="primary"
            size="md"
            fullWidth
          >
            {project.loading
              ? "Reviewing..."
              : `Review ${Math.min(project.files.length, 5)} Files ✨`}
          </Button>
        )}

        {project.error && (
          <Banner variant="danger" icon="⚠️" title="Error" description={project.error} />
        )}
      </div>

      {/* Right — Results */}
      <div style={{ width: "60%", overflowY: "auto", padding: "16px" }}>
        {!project.result && !project.loading && (
            <EmptyState
                icon="📁"
                title="No project loaded yet"
                description="Upload files or paste a GitHub URL to review a project"
            />
        )}

        {/* Loading — uses Spinner component */}
        {project.loading && (
          <div style={{
            height:         "100%",
            display:        "flex",
            flexDirection:  "column",
            alignItems:     "center",
            justifyContent: "center",
            gap:            "16px",
          }}>
            <Spinner size={48} />
            <p style={{ fontSize: "13px", color: t.subtext }}>
              Analyzing project files...
            </p>
          </div>
        )}

        {project.result && (
          <div style={{
            display:       "flex",
            flexDirection: "column",
            gap:           "20px",
            animation:     "fadeUp 0.3s ease-out",
          }}>
            <ProjectOverview
              result={project.result}
              selectedFilePath={project.selectedFilePath}
              onSelectFile={project.setSelectedFilePath}
            />
            {selectedFile && <ProjectFileDetail file={selectedFile} />}
          </div>
        )}
      </div>
    </div>
  );
}