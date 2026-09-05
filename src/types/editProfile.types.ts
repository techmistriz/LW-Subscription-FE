export type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  contact: string;
  otp: string;
  dob: string;
  organisation: string;
  gstNumber: string;
  address: string;
  city: string;
  pincode: string;
  state: string;
  country: string;
};

export type PasswordForm = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export type EditableProfileUser = {
  first_name?: string | null;
  last_name?: string | null;
  email?: string | null;
  contact?: string | null;
  dob?: string | null;
  organisation?: string | null;
  gst_number?: string | null;
  address?: string | null;
  city?: string | null;
  pincode?: string | null;
  state?: string | null;
  country?: string | null;
};

export type UpdateProfilePayload = {
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
};
