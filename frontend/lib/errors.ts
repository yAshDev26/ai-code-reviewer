/**
 * Converts an unknown thrown value into a user-friendly string.
 * Used by all hooks that call the backend API.
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof TypeError && error.message.includes("fetch")) {
    return "Cannot reach backend. Make sure NestJS is running on port 3001.";
  }
  if (error instanceof Error) return error.message;
  return "An unexpected error occurred. Please try again.";
}