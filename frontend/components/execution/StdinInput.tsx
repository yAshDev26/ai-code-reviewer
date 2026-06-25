"use client";

import { useState } from "react";
import { useTheme } from "@/context/ThemeContext";

interface Props {
  stdin: string;
  onStdinChange: (val: string) => void;
}

export default function StdinInput({ stdin, onStdinChange }: Props) {
  const { t } = useTheme();
  const [expanded, setExpanded] = useState(false);

  return (
    <div>
      <button
        onClick={() => setExpanded(!expanded)}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          fontSize: "11px",
          color: t.subtext,
          fontWeight: 600,
          display: "flex",
          alignItems: "center",
          gap: "4px",
          padding: 0,
        }}
      >
        ⌨️ {expanded ? "Hide" : "Add"} Input (stdin) {stdin && !expanded ? "●" : ""}
      </button>
      {expanded && (
        <textarea
          value={stdin}
          onChange={(e) => onStdinChange(e.target.value)}
          placeholder="Optional input your program reads from stdin..."
          style={{
            width: "100%",
            marginTop: "6px",
            backgroundColor: t.bg,
            color: t.text,
            border: `1px solid ${t.border}`,
            borderRadius: "8px",
            padding: "8px 10px",
            fontSize: "12px",
            fontFamily: "monospace",
            minHeight: "60px",
            resize: "vertical",
            outline: "none",
          }}
        />
      )}
    </div>
  );
}