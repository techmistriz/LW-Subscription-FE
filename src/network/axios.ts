import axios, { AxiosHeaders } from "axios";

import { STORAGE_KEYS } from "@/config/constants";
import { siteConfig } from "@/config/site";
import { storage } from "@/lib/storage";

const api = axios.create({
  baseURL: siteConfig.apiBaseUrl,
  headers: {
    Accept: "application/json",
  },
});

/* ----------------------- REQUEST INTERCEPTOR ----------------------- */

api.interceptors.request.use((config) => {
  const token = storage.get(STORAGE_KEYS.AUTH_TOKEN);

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
        storage.clearAuthData();
        window.location.href = "/sign-in";
      }
    }

    return Promise.reject(error);
  },
);

export default api;