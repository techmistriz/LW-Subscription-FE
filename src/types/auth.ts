import type { PaymentDetails, Subscription, User } from "./models";

/* ==================== AUTH USER ==================== */

export type AuthUser = User;

/* ==================== REGISTER FORM ==================== */

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

/* ==================== REGISTER PAYLOAD ==================== */

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

/* ==================== REGISTER RESPONSE ==================== */

export interface RegisterResponseData {
  response: any;
  membership_plan_id: number;

  user: User;

  token?: string;

  payment?: PaymentDetails;

  subscription?: Subscription;
}

export interface RegisterResponse {
  response: any;
  status: boolean;
  message: string;

  data: RegisterResponseData;

  errors?: Record<string, string[]>;
}

export interface ResetPasswordPayload {
  email: string;
  token: string;
  password: string;
  password_confirmation: string;
}
