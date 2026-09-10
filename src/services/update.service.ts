import api from "@/lib/api/axios";
import { extractErrorMessage } from "@/lib/api/errorMessage";
import type { UpdateProfilePayload } from "@/types/editProfile.types";

export async function updateProfile(payload: UpdateProfilePayload) {
  try {
    const res = await api.post("/update-profile", payload);
    return res.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error, "Failed to update profile"));
  }
}

export async function sendUpdateOtp(data: { email: string; contact: string }) {
  try {
    const res = await api.post("/send-update-otp", data);
    return res.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error, "Failed to send OTP"));
  }
}
