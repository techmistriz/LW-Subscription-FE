import api from "../axios";

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

export async function updateProfile(
  payload: UpdateProfilePayload
) {
  try {
    const res = await api.post(
      "/update-profile",
      payload
    );

    return res.data;
  } catch (error: any) {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      "Failed to update profile";

    throw new Error(message);
  }
}


/*----------------- SEND UPDATE OTP -----------------*/
export async function sendUpdateOtp(data: {
  email: string;
  contact: string;
}) {
  try {
    const res = await api.post("/send-update-otp", data);
    console.log("Update OTP", res)
    return res.data;
  } catch (error: any) {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      "Failed to send OTP";

    throw new Error(message);
  }
}