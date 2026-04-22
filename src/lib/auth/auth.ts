import axiosInstance from "../api/axios";
import { RegisterForm } from "../../types";


export async function loginUser(email: string, password: string) {
  try {
    const res = await axiosInstance.post("/auth/login", {
      email,
      password,
    });

    return res.data;
  } catch (error: any) {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      "Login failed";

    throw new Error(message);
  }
}


export async function registerUser(formData: RegisterForm) {
  try {
    const res = await axiosInstance.post("/auth/register", formData);

    return res.data;
  } catch (error: any) {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      "Registration failed";

    throw new Error(message);
  }
}



export async function forgotPassword(email: string) {
  try {
    const res = await axiosInstance.post("/auth/forgot-password", {
      email,
    });

    return res.data;
  } catch (error: any) {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      "Failed to send reset link";

    throw new Error(message);
  }
}

export async function logoutApi() {
  try {
    await axiosInstance.post("/auth/logout");
    return { success: true };
  } catch (error) {
    console.error("Logout API error:", error);
    return { success: false, error };
  }
}