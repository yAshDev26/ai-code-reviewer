"use client";

import { useTheme } from "@/context/ThemeContext";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

const languages = [
  { label: "JavaScript", value: "javascript" },
  { label: "TypeScript", value: "typescript" },
  { label: "Python", value: "python" },
  { label: "Java", value: "java" },
  { label: "C++", value: "cpp" },
  { label: "Go", value: "go" },
];

export default function LanguageSelector({ value, onChange }: Props) {
  const { t } = useTheme();
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        backgroundColor: t.bg,
        color: t.text,
        border: `1px solid ${t.border}`,
        borderRadius: "8px",
        padding: "5px 32px 5px 10px",
        fontSize: "13px",
        fontWeight: 500,
        cursor: "pointer",
        outline: "none",
        appearance: "none",
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%238b949e' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "right 10px center",
        minWidth: "130px",
        transition: "border-color 0.15s ease",
      }}
    >
      {languages.map((lang) => (
        <option
          key={lang.value}
          value={lang.value}
          disabled={lang.value === value}   // ← disable currently active
          style={{
            backgroundColor: t.surface,
            color: lang.value === value ? t.subtext : t.text,
            fontWeight: lang.value === value ? 600 : 400,
          }}
        >
          {lang.value === value ? `✓ ${lang.label}` : lang.label}
        </option>
      ))}
    </select>
  );
}