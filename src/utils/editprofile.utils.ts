import type {
  EditableProfileUser,
  FormData,
  UpdateProfilePayload,
} from "@/types/editProfile.types";

export const EMPTY_FORM_DATA: FormData = {
  firstName: "",
  lastName: "",
  email: "",
  contact: "",
  otp: "",
  dob: "",
  organisation: "",
  gstNumber: "",
  address: "",
  city: "",
  pincode: "",
  state: "",
  country: "",
};

export const createFormData = (
  user: EditableProfileUser,
): FormData => ({
  firstName: user.first_name ?? "",
  lastName: user.last_name ?? "",
  email: user.email ?? "",
  contact: user.contact ?? "",
  otp: "",
  dob: user.dob ?? "",
  organisation: user.organisation ?? "",
  gstNumber: user.gst_number ?? "",
  address: user.address ?? "",
  city: user.city ?? "",
  pincode: user.pincode ?? "",
  state: user.state ?? "",
  country: user.country ?? "",
});

export const createUpdatePayload = (
  formData: FormData,
  passwordForm: {
    newPassword: string;
    confirmPassword: string;
  },
  otp: string,
): UpdateProfilePayload => ({
  first_name: formData.firstName,
  last_name: formData.lastName,
  email: formData.email,
  contact: formData.contact,
  password: passwordForm.newPassword,
  password_confirmation: passwordForm.confirmPassword,
  address: formData.address,
  dob: formData.dob,
  city: formData.city,
  state: formData.state,
  country: formData.country,
  pincode: formData.pincode,
  organisation: formData.organisation,
  gst_number: formData.gstNumber,
  otp,
});

export const getErrorMessage = (
  error: unknown,
  fallback = "Something went wrong",
): string => {
  if (error instanceof Error) {
    return error.message;
  }

  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error
  ) {
    const message = (error as { message?: unknown }).message;

    if (typeof message === "string") {
      return message;
    }
  }

  return fallback;
};