import { ReviewResponse, AutoFixResponse, ReviewIssue } from "@/types/review";
import { ProjectFileInput, ProjectReviewResponse } from "@/types/review";
import { ExecutionResult } from "@/types/review";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

async function handleResponse<T>(response: Response, context: string): Promise<T> {
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    const message = body?.message || `${context} failed (${response.status})`;
    throw new Error(message);
  }
  return response.json();
}

export async function reviewCode(
  code: string,
  language: string
): Promise<ReviewResponse> {
  if (!code.trim()) throw new Error("No code provided for review.");
  if (!language) throw new Error("No language selected.");

  const response = await fetch(`${BASE_URL}/review`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code, language }),
  });

  return handleResponse<ReviewResponse>(response, "Code review");
}

export async function autoFixCode(
  code: string,
  language: string,
  issues: ReviewIssue[]
): Promise<AutoFixResponse> {
  if (!code.trim()) throw new Error("No code provided for auto fix.");
  if (!issues.length) throw new Error("No issues to fix.");

  const response = await fetch(`${BASE_URL}/review/autofix`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code, language, issues }),
  });

  return handleResponse<AutoFixResponse>(response, "Auto fix");
}

export async function reviewProjectFiles(
  files: ProjectFileInput[]
): Promise<ProjectReviewResponse> {
  if (!files.length) throw new Error("No files provided for review.");

  const response = await fetch(`${BASE_URL}/project/review-files`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ files }),
  });

  return handleResponse<ProjectReviewResponse>(response, "Project review");
}

export async function reviewGithubRepo(
  repoUrl: string
): Promise<ProjectReviewResponse> {
  if (!repoUrl.trim()) throw new Error("No repository URL provided.");

  const response = await fetch(`${BASE_URL}/project/review-github`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ repoUrl }),
  });

  return handleResponse<ProjectReviewResponse>(response, "GitHub repo review");
}

export async function runCode(
  code: string,
  language: string,
  stdin?: string
): Promise<{ execution: ExecutionResult }> {
  if (!code.trim()) throw new Error("No code provided to run.");

  const response = await fetch(`${BASE_URL}/execution/run`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code, language, stdin }),
  });

  return handleResponse(response, "Run code");
}

export async function runAndReview(
  code: string,
  language: string,
  stdin?: string
): Promise<ReviewResponse & { execution: ExecutionResult }> {
  if (!code.trim()) throw new Error("No code provided to run.");

  const response = await fetch(`${BASE_URL}/execution/run-and-review`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code, language, stdin }),
  });

  return handleResponse(response, "Run & Review");
}