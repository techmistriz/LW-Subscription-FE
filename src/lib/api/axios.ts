import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    Accept: "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token =
    typeof window !== "undefined" ? sessionStorage.getItem("token") : null;

  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url || "";

    // Skip redirect for login request
    const isAuthRequest =
      url.includes("/sign-in") || url.includes("/auth/login");

    if (status === 401 && !isAuthRequest) {
      if (typeof window !== "undefined") {
        sessionStorage.removeItem("token");

        // optional: also clear subscription
        sessionStorage.removeItem("subscription");

        window.location.href = "/sign-in";
      }
    }

    return Promise.reject(error);
  },
);

export default api;
