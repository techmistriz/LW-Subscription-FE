export type { SubscriptionPlan } from "@/types/models";

export interface RegisterFormData {
  first_name: string;
  last_name: string;
  email: string;
  contact: string;
  otp: string;
  dob: string;
  organisation: string;
  gst_number: string;
  address: string;
  city: string;
  pincode: string;
  state: string;
  country: string;
  password: string;
  password_confirmation: string;
  plan: string;
  auto_renew: boolean;
}
