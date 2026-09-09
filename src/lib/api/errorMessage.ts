import axios from "axios";

export function extractErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    return (
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      fallback
    );
  }
  if (error instanceof Error) return error.message;
  return fallback;
}

/** For endpoints that return field-level validation errors */
export function extractFieldError(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    const errors = error.response?.data?.errors as
      Record<string, string[]> | undefined;
    const first = errors && Object.values(errors)[0];
    if (Array.isArray(first) && first.length > 0) return first[0];
  }
  return extractErrorMessage(error, fallback);
}
