"use client";

import { useTheme } from "@/context/ThemeContext";
import CodeEditor from "./CodeEditor";
import FileUpload from "./FileUpload";
import Banner from "../ui/Banner";
import StdinInput from "@/components/execution/StdinInput";
import Button from "@/components/ui/Button";

interface Props {
  code: string;
  language: string;
  isCodeEmpty: boolean;
  fileCleared: boolean;
  importedFileName: string | null;
  onCodeChange: (code: string) => void;
  onFileLoad: (code: string, language: string, fileName: string) => void;
  onFileClear: () => void;
  onRestoreFile: () => void;
  stdin: string;
  onStdinChange: (val: string) => void;
}

export default function EditorPanel({
  code,
  language,
  isCodeEmpty,
  fileCleared,
  importedFileName,
  onCodeChange,
  onFileLoad,
  onFileClear,
  onRestoreFile,
  stdin,
  onStdinChange,
}: Props) {
  const { t } = useTheme();

  return (
    <div style={{
      width: "50%",
      display: "flex",
      flexDirection: "column",
      borderRight: `1px solid ${t.border}`,
      overflow: "hidden",
    }}>

      {/* File Upload Toolbar */}
      <div style={{
        backgroundColor: t.surface,
        borderBottom: `1px solid ${t.border}`,
        padding: "10px 16px",
        flexShrink: 0,
      }}>
        <FileUpload onFileLoad={onFileLoad} onFileClear={onFileClear} />
      </div>

      {/* Execution Controls / Stdin Input */}
      <div style={{
        backgroundColor: t.surface,
        borderBottom: `1px solid ${t.border}`,
        padding: "10px 16px",
        flexShrink: 0,
      }}>
        <StdinInput stdin={stdin} onStdinChange={onStdinChange} />
      </div>

      {/* File Cleared Warning */}
      {fileCleared && importedFileName && (
        <div style={{ padding: "10px 16px", flexShrink: 0, backgroundColor: "#7c3aed" }}>
          <Banner
            variant="info"
            title="Editor code was cleared"
            icon="⚠️"
            description={
              <>
                <strong style={{ color: "white" }}>{importedFileName}</strong>
                {" "}is still imported but code was removed
              </>
            }
            action={{ label: "↩ Restore File", onClick: onRestoreFile }}
          />
        </div>
      )}

      {/* Empty Code Hint */}
      {isCodeEmpty && !fileCleared && (
        <div style={{
          backgroundColor: `${t.accent}12`,
          borderBottom: `1px solid ${t.border}`,
          padding: "8px 16px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          flexShrink: 0,
          animation: "slideDown 0.2s ease-out",
        }}>
          <span style={{ fontSize: "13px" }}>✏️</span>
          <p style={{ margin: 0, fontSize: "12px", color: t.subtext }}>
            Start typing or{" "}
            <span style={{ color: t.accent, fontWeight: 600 }}>upload a file</span>
            {" "}to enable code review
          </p>
        </div>
      )}

      {/* Monaco Editor */}
      <div style={{ flex: 1, overflow: "hidden" }}>
        <CodeEditor value={code} onChange={onCodeChange} language={language} />
      </div>
    </div>
  );
}