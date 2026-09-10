import axios from "axios";

import api from "./axios";
import type { ApiResponse } from "@/types/api";

export const request = async <T>(
  method: "GET" | "POST" | "PUT" | "DELETE",
  url: string,
  payload?: unknown,
): Promise<ApiResponse<T>> => {
  try {
    const response = await api.request<T>({
      method,
      url,
      ...(method === "GET" ? { params: payload } : { data: payload }),
    });

    return {
      status: true,
      message: "Success",
      data: response.data,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        status: false,
        message:
          error.response?.data?.message ||
          error.message ||
          "Something went wrong",
        data: null,
        errors: error.response?.data?.errors,
      };
    }

    return {
      status: false,
      message: error instanceof Error ? error.message : "Something went wrong",
      data: null,
    };
  }
};
