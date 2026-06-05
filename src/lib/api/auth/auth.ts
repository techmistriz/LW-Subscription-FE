import axiosInstance from "../axios";
import { RegisterPayload, RegisterResponse } from "@/types/auth";

/*----------------- LOGIN -----------------*/
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

/*-----------------IUSER PROFILE -----------------*/
export async function getProfile() {
  try {
    const res = await axiosInstance.get("/profile");

    // console.log("Profile Data", res.data);

    return res.data;
  } catch (error: any) {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      "Failed to fetch profile";

    throw new Error(message);
  }
}

/*----------------- REGISTER -----------------*/
export async function registerUser(
  payload: RegisterPayload,
): Promise<RegisterResponse> {
  try {
    const res = await axiosInstance.post("/auth/register", payload);
    return res.data;
  } catch (error: any) {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      "Registration failed";

    throw new Error(message);
  }
}

/*----------------- SEND OTP -----------------*/
export async function sendOtp(contact: string) {
  try {
    const res = await axiosInstance.post("/auth/send-otp", {
      contact,
    });

    return res.data;
  } catch (error: any) {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      "Failed to send OTP";

    throw new Error(message);
  }
}

/*----------------- FORGOT PASSWORD -----------------*/
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

/*----------------- RESET PASSWORD -----------------*/
export async function resetPassword(data: {
  email: string;
  token: string;
  password: string;
  password_confirmation: string;
}) {
  try {
    const res = await axiosInstance.post("/auth/reset-password", data);
    return res.data;
  } catch (error: any) {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      "Reset password failed";

    throw new Error(message);
  }
}

/*----------------- LOGOUT -----------------*/
export async function logoutApi() {
  try {
    await axiosInstance.post("/auth/logout");
    return { success: true };
  } catch (error) {
    console.error("Logout API error:", error);
    return { success: false, error };
  }
}
