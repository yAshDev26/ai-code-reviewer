"use client";

import Editor from "@monaco-editor/react";
import { useTheme } from "@/context/ThemeContext";

interface Props {
  value: string;
  onChange: (value: string) => void;
  language: string;
}

export default function CodeEditor({ value, onChange, language }: Props) {
  const { t } = useTheme();
  return (
    <Editor
      height="100%"
      language={language}
      value={value}
      theme={t.editorTheme}
      onChange={(val) => onChange(val || "")}
      options={{
        fontSize: 14,
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        wordWrap: "on",
        lineNumbers: "on",
        renderLineHighlight: "line",
        padding: { top: 16 },
      }}
    />
  );
}