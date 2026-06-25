"use client";

import { useRef, useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { ProjectFileInput } from "@/types/review";
import Button from "@/components/ui/Button";

interface Props {
  files: ProjectFileInput[];
  onFilesSelected: (fileList: FileList) => void;
  onRemoveFile: (path: string) => void;
  onClearFiles: () => void;
}

export default function ProjectFileUpload({
  files,
  onFilesSelected,
  onRemoveFile,
  onClearFiles,
}: Props) {
  const { t } = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) onFilesSelected(e.dataTransfer.files);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".js,.jsx,.ts,.tsx,.py,.java,.cpp,.cc,.go"
        onChange={(e) => e.target.files && onFilesSelected(e.target.files)}
        style={{ display: "none" }}
      />
      <input
        ref={folderInputRef}
        type="file"
        // @ts-ignore - webkitdirectory is non-standard but widely supported
        webkitdirectory=""
        directory=""
        multiple
        onChange={(e) => e.target.files && onFilesSelected(e.target.files)}
        style={{ display: "none" }}
      />

      {/* Drop zone */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        style={{
          border: `1.5px dashed ${isDragging ? t.accent : t.border}`,
          borderRadius: "10px",
          padding: "16px",
          backgroundColor: isDragging ? `${t.accent}15` : t.surface,
          transition: "all 0.2s ease",
          textAlign: "center",
        }}
      >
        <p style={{ margin: "0 0 10px 0", fontSize: "13px", color: t.text, fontWeight: 600 }}>
          {isDragging ? "Drop files here" : "Drag & drop multiple files"}
        </p>
        <p style={{ margin: "0 0 12px 0", fontSize: "11px", color: t.subtext }}>
          .js .ts .py .java .cpp .go — up to 5 files reviewed
        </p>
        <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
          <Button variant="primary" size="sm" onClick={() => fileInputRef.current?.click()}>
            📄 Select Files
          </Button>
          <Button variant="neutral" size="sm" onClick={() => folderInputRef.current?.click()}>
            📁 Select Folder
          </Button>
        </div>
      </div>

      {/* Selected files list */}
      {files.length > 0 && (
        <div style={{
          backgroundColor: t.surface,
          border: `1px solid ${t.border}`,
          borderRadius: "10px",
          padding: "10px",
          display: "flex",
          flexDirection: "column",
          gap: "6px",
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: "11px", fontWeight: 600, color: t.subtext, textTransform: "uppercase", letterSpacing: "0.06em" }}>
              {files.length} file{files.length !== 1 ? "s" : ""} selected
            </span>
            <button
              onClick={onClearFiles}
              style={{
                fontSize: "11px",
                color: "#f87171",
                background: "none",
                border: "none",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              Clear all
            </button>
          </div>
          {files.map((file) => (
            <div key={file.path} style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              backgroundColor: t.bg,
              border: `1px solid ${t.border}`,
              borderRadius: "6px",
              padding: "6px 10px",
            }}>
              <span style={{ fontSize: "12px", color: t.text, fontFamily: "monospace" }}>
                {file.path}
              </span>
              <button
                onClick={() => onRemoveFile(file.path)}
                style={{
                  background: "none", border: "none",
                  color: t.subtext, cursor: "pointer", fontSize: "13px",
                }}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}