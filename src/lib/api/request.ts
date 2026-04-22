// lib/api/request.ts

import axios, { AxiosError } from "axios";
import api from "./axios";
import { ApiResponse } from "@/types";

export const request = async <T>(
  method: "GET" | "POST" | "PUT" | "DELETE",
  url: string,
  payload?: unknown
): Promise<ApiResponse<T>> => {
  try {
    const response = await api.request<T>({
      method,
      url,
      ...(method === "GET"
        ? { params: payload }
        : { data: payload }),
    });

    return {
      status: true,
      message: "Success",
      data: response.data,
    };
  } catch (error) {
    let message = "Something went wrong";
    let errors: Record<string, string[]> | undefined;

    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<{
        message?: string;
        errors?: Record<string, string[]>;
      }>;

      message =
        axiosError.response?.data?.message ||
        axiosError.message ||
        message;

      errors = axiosError.response?.data?.errors;
    }

    return {
      status: false,
      message,
      data: null,
      errors,
    };
  }
};
