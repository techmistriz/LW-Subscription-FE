import api from "../axios";
import { extractErrorMessage } from "../errorMessage";

export interface UpdateProfilePayload {
  first_name: string;
  last_name: string;
  email: string;
  contact: string;
  password: string;
  password_confirmation: string;
  address: string;
  dob: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  organisation: string;
  gst_number: string;
  otp: string;
}

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
