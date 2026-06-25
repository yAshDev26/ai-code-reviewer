export const EXTENSION_MAP: Record<string, string> = {
  js: "javascript",
  jsx: "javascript",
  ts: "typescript",
  tsx: "typescript",
  py: "python",
  java: "java",
  cpp: "cpp",
  cc: "cpp",
  go: "go",
};

export const SUPPORTED_EXTENSIONS = Object.keys(EXTENSION_MAP);
export const SUPPORTED_LANGUAGES = [
  ...new Set(Object.values(EXTENSION_MAP)),
] as const;