"use client";

import { useTheme } from "@/context/ThemeContext";
import Button from "@/components/ui/Button";

interface Props {
  repoUrl: string;
  onRepoUrlChange: (url: string) => void;
  onSubmit: () => void;
  loading: boolean;
}

export default function GithubRepoInput({ repoUrl, onRepoUrlChange, onSubmit, loading }: Props) {
  const { t } = useTheme();

  return (
    <div style={{
      backgroundColor: t.surface,
      border: `1px solid ${t.border}`,
      borderRadius: "10px",
      padding: "16px",
      display: "flex",
      flexDirection: "column",
      gap: "10px",
    }}>
      <p style={{ margin: 0, fontSize: "13px", fontWeight: 600, color: t.text }}>
        🔗 Review a public GitHub repository
      </p>
      <div style={{ display: "flex", gap: "8px" }}>
        <input
          type="text"
          value={repoUrl}
          onChange={(e) => onRepoUrlChange(e.target.value)}
          placeholder="https://github.com/owner/repo"
          style={{
            flex: 1,
            backgroundColor: t.bg,
            color: t.text,
            border: `1px solid ${t.border}`,
            borderRadius: "8px",
            padding: "8px 12px",
            fontSize: "13px",
            outline: "none",
          }}
        />
        <Button variant="primary" size="md" onClick={onSubmit} loading={loading} disabled={loading}>
          {loading ? "Fetching..." : "Review Repo"}
        </Button>
      </div>
      <p style={{ margin: 0, fontSize: "11px", color: t.subtext }}>
        Public repos only · up to 5 files reviewed
      </p>
    </div>
  );
}