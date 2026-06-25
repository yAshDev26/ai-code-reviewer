"use client";

import { useRef, useState } from "react";
import { useTheme, colors } from "@/context/ThemeContext";
import { EXTENSION_MAP, SUPPORTED_EXTENSIONS } from "@/lib/constants/languages";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

interface Props {
  onFileLoad:  (code: string, language: string, fileName: string) => void;
  onFileClear: () => void;
}

export default function FileUpload({ onFileLoad, onFileClear }: Props) {
  const { t } = useTheme();
  const inputRef = useRef<HTMLInputElement>(null);

  const [isDragging,  setIsDragging]  = useState(false);
  const [fileName,    setFileName]    = useState<string | null>(null);
  const [error,       setError]       = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const acceptAttr = SUPPORTED_EXTENSIONS.map((e) => `.${e}`).join(",");

  const processFile = (file: File) => {
    setError(null);
    const ext      = file.name.split(".").pop()?.toLowerCase() || "";
    const language = EXTENSION_MAP[ext];
    if (!language) {
      setError(
        `Unsupported file type ".${ext}". Supported: ${SUPPORTED_EXTENSIONS.map((e) => `.${e}`).join(" ")}`,
      );
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setFileName(file.name);
      onFileLoad(content, language, file.name);
    };
    reader.readAsText(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const handleClearConfirmed = () => {
    setFileName(null);
    setError(null);
    setShowConfirm(false);
    if (inputRef.current) inputRef.current.value = "";
    onFileClear();
  };

  return (
    <div style={{ width: "100%" }}>
      <input
        ref={inputRef}
        type="file"
        accept={acceptAttr}
        onChange={handleFileChange}
        style={{ display: "none" }}
      />

      {/* Drop Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onClick={() => !fileName && inputRef.current?.click()}
        style={{
          border:          `1.5px dashed ${isDragging ? t.accent : fileName ? colors.suggestion.border : t.border}`,
          borderRadius:    "10px",
          padding:         "10px 16px",
          backgroundColor: isDragging
            ? `${t.accent}15`
            : fileName ? colors.suggestion.bg : t.surface,
          cursor:     fileName ? "default" : "pointer",
          transition: "all 0.2s ease",
          display:    "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap:        "10px",
          minHeight:  "48px",
        }}
      >
        {/* Left */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "18px" }}>
            {isDragging ? "📂" : fileName ? "✅" : "📁"}
          </span>
          {fileName ? (
            <div>
              <p style={{ margin: 0, fontSize: "12px", fontWeight: 700, color: colors.suggestion.text }}>
                {fileName}
              </p>
              <p style={{ margin: 0, fontSize: "11px", color: t.subtext }}>
                Loaded into editor
              </p>
            </div>
          ) : (
            <div>
              <p style={{ margin: 0, fontSize: "12px", fontWeight: 600, color: t.text }}>
                {isDragging ? "Drop your file here" : "Upload a file"}
              </p>
              <p style={{ margin: 0, fontSize: "11px", color: t.subtext }}>
                {SUPPORTED_EXTENSIONS.map((e) => `.${e}`).join(" ")} — click or drag & drop
              </p>
            </div>
          )}
        </div>

        {/* Right */}
        {fileName ? (
          <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
            <button
              onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}
              style={{
                fontSize:        "12px",
                fontWeight:      600,
                color:           t.subtext,
                backgroundColor: colors.neutral.bg,
                border:          `1px solid ${t.border}`,
                borderRadius:    "6px",
                padding:         "5px 12px",
                cursor:          "pointer",
                transition:      "all 0.15s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = colors.neutral.hoverBg)}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = colors.neutral.bg)}
            >
              Change
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); setShowConfirm(true); }}
              style={{
                fontSize:        "12px",
                fontWeight:      600,
                color:           colors.danger.text,
                backgroundColor: colors.danger.bg,
                border:          `1px solid ${colors.danger.border}`,
                borderRadius:    "6px",
                padding:         "5px 12px",
                cursor:          "pointer",
                transition:      "all 0.15s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = colors.danger.hoverBg)}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = colors.danger.bg)}
            >
              Clear
            </button>
          </div>
        ) : (
          <button
            onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}
            style={{
              fontSize:        "12px",
              fontWeight:      600,
              color:           t.accent,
              backgroundColor: `${t.accent}18`,
              border:          `1.5px solid ${t.accent}`,
              borderRadius:    "6px",
              padding:         "5px 14px",
              cursor:          "pointer",
              transition:      "all 0.15s ease",
            }}
          >
            Browse
          </button>
        )}
      </div>

      {/* Error */}
      {error && (
        <p style={{
          margin:     "6px 0 0 0",
          fontSize:   "11px",
          color:      colors.danger.text,
          display:    "flex",
          alignItems: "center",
          gap:        "4px",
        }}>
          ⚠️ {error}
        </p>
      )}

      {/* Confirm dialog — replaces the 50-line inline modal */}
      <ConfirmDialog
        open={showConfirm}
        icon="🗑️"
        title="Clear imported file?"
        description={
          <>
            This will remove{" "}
            <strong style={{ color: t.text }}>{fileName}</strong>{" "}
            and reset the editor to blank.
          </>
        }
        confirmLabel="Yes, Clear File"
        cancelLabel="Cancel"
        onConfirm={handleClearConfirmed}
        onCancel={() => setShowConfirm(false)}
      />
    </div>
  );
}