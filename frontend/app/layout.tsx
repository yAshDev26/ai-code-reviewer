import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "AI Code Reviewer",
  description: "Instant AI-powered code analysis",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" style={{ height: "100%", overflow: "hidden" }}>
      <body style={{
        height: "100%",
        margin: 0,
        padding: 0,
        overflow: "hidden",
      }}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}