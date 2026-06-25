"use client";

import { ReactNode } from "react";
import { useTheme, colors } from "@/context/ThemeContext";
import Button from "./Button";

interface Props {
  open:          boolean;
  icon?:         string;
  title:         string;
  description:   ReactNode;
  confirmLabel?: string;
  cancelLabel?:  string;
  onConfirm:     () => void;
  onCancel:      () => void;
}

export default function ConfirmDialog({
  open,
  icon         = "🗑️",
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel  = "Cancel",
  onConfirm,
  onCancel,
}: Props) {
  const { t } = useTheme();

  if (!open) return null;

  return (
    <div style={{
      position:        "fixed",
      inset:           0,
      backgroundColor: "rgba(0,0,0,0.6)",
      display:         "flex",
      alignItems:      "center",
      justifyContent:  "center",
      zIndex:          999,
    }}>
      <div style={{
        backgroundColor: t.surface,
        border:          `1px solid ${t.border}`,
        borderRadius:    "16px",
        padding:         "28px 24px",
        maxWidth:        "380px",
        width:           "90%",
        display:         "flex",
        flexDirection:   "column",
        gap:             "20px",
        boxShadow:       "0 24px 64px rgba(0,0,0,0.5)",
        animation:       "fadeUp 0.2s ease-out",
      }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: "14px" }}>
          <div style={{
            width:           "40px",
            height:          "40px",
            backgroundColor: colors.danger.bg,
            border:          `1px solid ${colors.danger.border}`,
            borderRadius:    "10px",
            display:         "flex",
            alignItems:      "center",
            justifyContent:  "center",
            fontSize:        "20px",
            flexShrink:      0,
          }}>
            {icon}
          </div>
          <div>
            <p style={{ margin: 0, fontWeight: 700, fontSize: "15px", color: t.text }}>
              {title}
            </p>
            <p style={{ margin: "6px 0 0 0", fontSize: "13px", color: t.subtext, lineHeight: 1.5 }}>
              {description}
            </p>
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: "1px", backgroundColor: t.border }} />

        {/* Actions */}
        <div style={{ display: "flex", gap: "10px" }}>
          <Button
            onClick={onCancel}
            variant="neutral"
            size="md"
            fullWidth
          >
            {cancelLabel}
          </Button>
          <Button
            onClick={onConfirm}
            variant="danger"
            size="md"
            fullWidth
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}