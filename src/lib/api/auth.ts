import axiosInstance from "./axios";
import { RegisterForm } from "../types.ts";

/* ================= LOGIN ================= */
export async function loginUser(email: string, password: string) {
  try {
    const response = await axiosInstance.post("/auth/login", {
      email,
      password,
    });

    return response.data;
  } catch (error: any) {
    const data = error.response?.data;

    let errorMsg = "Login failed";

    if (typeof data?.message === "string") {
      errorMsg = data.message;
    } else if (data?.message && typeof data.message === "object") {
      errorMsg =
        data.message.error ||
        data.message.message ||
        data.message.detail ||
        (Array.isArray(data.message)
          ? data.message[0]
          : null) ||
        JSON.stringify(data.message).slice(0, 100);
    } else if (data?.error) {
      errorMsg = String(data.error);
    }

    throw new Error(errorMsg);
  }
}

/* ================= LOGOUT ================= */
export async function logoutApi() {
  try {
    await axiosInstance.post("/auth/logout");
    return { success: true };
  } catch (error) {
    console.error("Logout API error:", error);
    return { success: false, error };
  }
}

/* ================= REGISTER ================= */
export async function registerUser(formData: RegisterForm) {
  try {
    const response = await axiosInstance.post("/auth/register", formData);
    return response.data;
  } catch (error: any) {
    const result = error.response?.data;

    if (result?.errors) {
      const errorList = Object.entries(result.errors)
        .map(([field, msgs]: [string, any]) =>
          `${field}: ${msgs.join(", ")}`
        )
        .join("; ");

      throw new Error(errorList);
    }

    throw new Error(result?.message || "Registration failed");
  }
}

/* ================= FORGOT PASSWORD ================= */
export async function forgotPassword(email: string) {
  try {
    const response = await axiosInstance.post("/auth/forgot-password", {
      email,
    });

    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to send reset link"
    );
  }
}
