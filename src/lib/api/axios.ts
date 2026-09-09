// src/lib/api/axios.ts
import axios, { AxiosHeaders } from "axios";
import { storage } from "@/lib/storage";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    Accept: "application/json",
  },
});

/* ----------------------- REQUEST INTERCEPTOR ----------------------- */
api.interceptors.request.use((config) => {
  const token = storage.get("token");

  if (token) {
    if (!config.headers) {
      config.headers = new AxiosHeaders();
    }
    config.headers.set("Authorization", `Bearer ${token}`);
  }

  return config;
});

/* ----------------------- RESPONSE INTERCEPTOR ----------------------- */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url || "";
    const normalizedUrl = url.toLowerCase();

    const isAuthRequest =
      normalizedUrl.includes("/sign-in") ||
      normalizedUrl.includes("/auth/login");

    if (status === 401 && !isAuthRequest) {
      if (typeof window !== "undefined") {
        storage.clearAuthData(); // token, subscription, user — sab ek call mein
        window.location.href = "/sign-in";
      }
    }

    return Promise.reject(error);
  },
);

export default api;
