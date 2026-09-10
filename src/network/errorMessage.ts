import axios from "axios";

type ApiErrorResponse = {
  message?: string;
  error?: string;
  errors?: Record<string, string[]>;
};

export function extractErrorMessage(
  error: unknown,
  fallback = "Something went wrong",
): string {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    return (
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      fallback
    );
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
}

export function extractFieldError(
  error: unknown,
  fallback = "Something went wrong",
): string {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    const errors = error.response?.data?.errors;

    const firstError = errors && Object.values(errors)[0];

    if (firstError?.length) {
      return firstError[0];
    }
  }

  return extractErrorMessage(error, fallback);
}