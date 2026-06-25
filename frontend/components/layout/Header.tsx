"use client";

import { useTheme } from "@/context/ThemeContext";
import LanguageSelector from "@/components/layout/LanguageSelector";
import ThemeSwitcher from "@/components/layout/ThemeSwitcher";
import Button from "@/components/ui/Button";

// ── Interfaces split by concern (ISP) ────────────────────────────────────────

interface HeaderBaseProps {
  mode: "single" | "project";
  onModeChange: (mode: "single" | "project") => void;
}

interface SingleModeActions {
  language: string;
  loading: boolean;
  isDisabled: boolean;
  getButtonLabel: () => string | null;
  onLanguageChange: (lang: string) => void;
  onReview: () => void;
  onRunCode: () => void;
  onRunAndReview: () => void;
  runLoading: boolean;
  combinedLoading: boolean;
}

type HeaderProps = HeaderBaseProps & { singleMode?: SingleModeActions };

export default function Header({ mode, onModeChange, singleMode }: HeaderProps) {
  const { t } = useTheme();
  const anyLoading = singleMode
    ? singleMode.loading || singleMode.runLoading || singleMode.combinedLoading
    : false;

  return (
    <header style={{
      backgroundColor: t.surface,
      borderBottom: `1px solid ${t.border}`,
      padding: "10px 20px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      flexShrink: 0,
      boxShadow: "0 1px 8px rgba(0,0,0,0.2)",
      zIndex: 10,
      gap: "16px",
    }}>

      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", flexShrink: 0 }}>
        <div style={{
          width: "34px", height: "34px", backgroundColor: t.accent,
          borderRadius: "10px", display: "flex", alignItems: "center",
          justifyContent: "center", fontSize: "17px",
        }}>🔍</div>
        <div>
          <div style={{ fontWeight: 700, fontSize: "15px", color: t.text, lineHeight: 1.2 }}>
            AI Code Reviewer
          </div>
          <div style={{ fontSize: "11px", color: t.subtext }}>
            Instant AI-powered code analysis
          </div>
        </div>
      </div>

      {/* Mode Toggle */}
      <div style={{
        display: "flex", backgroundColor: t.bg,
        border: `1px solid ${t.border}`, borderRadius: "10px",
        padding: "3px", flexShrink: 0,
      }}>
        {(["single", "project"] as const).map((m) => (
          <button
            key={m}
            onClick={() => onModeChange(m)}
            style={{
              fontSize: "12px", fontWeight: 600, padding: "6px 14px",
              borderRadius: "7px", border: "none",
              backgroundColor: mode === m ? t.accent : "transparent",
              color: mode === m ? "white" : t.subtext,
              cursor: "pointer", transition: "all 0.15s ease",
            }}
          >
            {m === "single" ? "📄 Single File" : "📁 Project"}
          </button>
        ))}
      </div>

      {/* Single-mode only: Language Selector */}
      {mode === "single" && singleMode && (
        <div style={{
          display: "flex", alignItems: "center", gap: "10px",
          backgroundColor: t.bg, border: `1px solid ${t.border}`,
          borderRadius: "10px", padding: "6px 14px",
        }}>
          <span style={{ fontSize: "12px", color: t.subtext, fontWeight: 600 }}>
            🌐 Language
          </span>
          <div style={{ width: "1px", height: "16px", backgroundColor: t.border }} />
          <LanguageSelector value={singleMode.language} onChange={singleMode.onLanguageChange} />
        </div>
      )}

      {/* Right Controls */}
      <div style={{ display: "flex", alignItems: "center", gap: "14px", flexShrink: 0 }}>
        <ThemeSwitcher />
        <div style={{ width: "1px", height: "24px", backgroundColor: t.border }} />

        {/* Single-mode only: action buttons */}
        {mode === "single" && singleMode && (
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Button
              onClick={singleMode.onRunCode}
              disabled={singleMode.isDisabled || (anyLoading && !singleMode.runLoading)}
              loading={singleMode.runLoading}
              variant="outline"
              size="md"
            >
              ⚡ Run Code
            </Button>

            <Button
              onClick={singleMode.onRunAndReview}
              disabled={singleMode.isDisabled || (anyLoading && !singleMode.combinedLoading)}
              loading={singleMode.combinedLoading}
              variant="outline"
              size="md"
            >
              ⚡🔍 Run & Review
            </Button>

            <div style={{ width: "1px", height: "24px", backgroundColor: t.border }} />

            <Button
              onClick={singleMode.onReview}
              disabled={singleMode.isDisabled || (anyLoading && !singleMode.loading)}
              loading={singleMode.loading}
              variant="outline"
              size="md"
              title={singleMode.isDisabled ? "Add some code to the editor first" : ""}
            >
              {singleMode.loading ? "Reviewing..." : `🔍 ${singleMode.getButtonLabel()}`}
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}