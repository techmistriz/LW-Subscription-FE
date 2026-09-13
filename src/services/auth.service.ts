import api from "@/network/axios";
import { extractErrorMessage } from "@/network/errorMessage";
import { RegisterPayload, RegisterResponse } from "@/types/auth";

export async function loginUser(email: string, password: string) {
  try {
    const res = await api.post("/auth/login", { email, password });
    return res.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error, "Login failed"));
  }
}

export async function getProfile() {
  try {
    const res = await api.get("/profile");
    return res.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error, "Failed to fetch profile"));
  }
}

export async function registerUser(
  payload: RegisterPayload,
): Promise<RegisterResponse> {
  try {
    const res = await api.post("/auth/register", payload);
    return res.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error, "Registration failed"));
  }
}

export async function forgotPassword(email: string) {
  try {
    const res = await api.post("/forgot-password", { email });
    return res.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error, "Failed to send reset link"));
  }
}

export async function resetPassword(data: {
  email: string;
  token: string;
  password: string;
  password_confirmation: string;
}) {
  try {
    const res = await api.post("/reset-password", data);
    return res.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error, "Reset password failed"));
  }
}

export async function logoutApi() {
  try {
    await api.post("/auth/logout");
    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
}

//  Verify email
export async function verifyEmailApi(data: { email: string; token: string }) {
  try {
    const res = await api.post("/auth/email/verify", data);
    return res.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error, "Email verification failed"));
  }
}

// Resend verification email
export async function resendVerificationEmailApi(email: string) {
  try {
    const res = await api.post("/auth/email/resend", { email });
    return res.data;
  } catch (error) {
    throw new Error(
      extractErrorMessage(error, "Failed to resend verification email"),
    );
  }
}