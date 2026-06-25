"use client";

import { useEffect } from "react";

interface Props {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: Props) {
  useEffect(() => {
    console.error("[App Error Boundary]", error);
  }, [error]);

  return (
    <div style={{
      height: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: "16px",
      padding: "32px",
      textAlign: "center",
      backgroundColor: "#0d1117",
      color: "#ffffff",
    }}>
      <div style={{
        width: "64px",
        height: "64px",
        backgroundColor: "rgba(239,68,68,0.10)",
        border: "1px solid #ef4444",
        borderRadius: "16px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "28px",
      }}>
        ⚠️
      </div>

      <div>
        <h2 style={{ margin: "0 0 8px 0", fontSize: "18px", fontWeight: 700, color: "#f87171" }}>
          Something went wrong
        </h2>
        <p style={{ margin: 0, fontSize: "13px", color: "#8b949e", maxWidth: "400px", lineHeight: 1.6 }}>
          {error.message || "An unexpected error occurred. The issue has been logged."}
        </p>
        {error.digest && (
          <p style={{ margin: "8px 0 0 0", fontSize: "11px", color: "#8b949e", fontFamily: "monospace" }}>
            Error ID: {error.digest}
          </p>
        )}
      </div>

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
        Try again
      </button>
    </div>
  );
}