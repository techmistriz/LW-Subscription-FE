export type { Plan } from "@/features/auth/services/plans.service";

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

export interface PaymentData {
  razorpay_key: string;
  amount: number;
  currency: string;
  order_id: string;
}
