"use client";

interface Props {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: Props) {
  return (
    <html lang="en">
      <body style={{
        margin: 0,
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "16px",
        backgroundColor: "#0d1117",
        color: "#ffffff",
        fontFamily: "system-ui, sans-serif",
        textAlign: "center",
        padding: "32px",
      }}>
        <div style={{ fontSize: "40px" }}>🔴</div>
        <h2 style={{ margin: 0, fontSize: "18px", color: "#f87171" }}>
          Critical error — the app could not load
        </h2>
        <p style={{ margin: 0, fontSize: "13px", color: "#8b949e", maxWidth: "400px" }}>
          {error.message || "An unexpected error occurred at the root level."}
        </p>
        <button
          onClick={reset}
          style={{
            padding: "8px 20px",
            backgroundColor: "rgba(124,58,237,0.15)",
            border: "1.5px solid #7c3aed",
            borderRadius: "8px",
            color: "#a78bfa",
            fontSize: "13px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Reload app
        </button>
      </body>
    </html>
  );
}