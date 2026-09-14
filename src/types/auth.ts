import type { PaymentDetails, Subscription, User } from "./models";

/* ----------- AUTH USER ----------- */

export type AuthUser = User;

/* ----------- REGISTER FORM ----------- */

export interface RegisterForm {
  first_name: string;
  last_name: string;
  email: string;
  contact: string;
  password: string;
  password_confirmation: string;
  address: string;
  gst_number: string;
  plan: string;
  auto_renew: boolean;
}

/* ----------- REGISTER PAYLOAD ----------- */

export interface RegisterPayload {
  first_name: string;
  last_name: string;
  email: string;
  contact: string;
  password: string;
  password_confirmation: string;
  dob: string;
  address: string;
  gst_number: string;
  membership_plan_id: number;
}

/* ----------- REGISTER RESPONSE ----------- */

export interface RegisterApiData {
  purchase_type?: string;
  membership_plan_id?: number;
  payment: PaymentDetails | null;
  user: User;
  subscription: Subscription;
  checkout_token: string;
  checkout_error?: string;
  payment_confirmed?: boolean;
}

export interface RegisterApiOriginal {
  status: boolean;
  data: RegisterApiData;
  meta: unknown[];
  message: string;
  errors?: Record<string, string[]>;
}

export type RegisterResponse = RegisterApiOriginal;

/* ----------- RESET PASSWORD ----------- */

export interface ResetPasswordPayload {
  email: string;
  token: string;
  password: string;
  password_confirmation: string;
}
