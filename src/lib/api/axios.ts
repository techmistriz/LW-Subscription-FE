import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    Accept: "application/json",
  },
});

// REQUEST INTERCEPTOR
api.interceptors.request.use((config) => {
  // run only in browser
  if (typeof window !== "undefined") {
    const token = sessionStorage.getItem("token");

    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }
  }

  return config;
});

//  RESPONSE INTERCEPTOR
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url || "";

    // normalize url for safety
    const normalizedUrl = url.toLowerCase();

    // skip redirect for auth endpoints
    const isAuthRequest =
      normalizedUrl.includes("/sign-in") ||
      normalizedUrl.includes("/auth/login");

    if (status === 401 && !isAuthRequest) {
      if (typeof window !== "undefined") {
        // clear only auth-related data
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("subscription");
        sessionStorage.removeItem("user");

        // hard redirect (same as your logic)
        window.location.href = "/sign-in";
      }
    }

    return Promise.reject(error);
  }
);

export default api;