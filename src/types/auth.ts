// types/auth.ts
export interface RegisterPayload {
  first_name: string;
  last_name: string;
  email: string;
  contact: string;
  password: string;
  password_confirmation: string;
  address: string;
  membership_plan_id: number;
}

export interface RegisterData {
  user: any; // adjust based on API
  token?: string;
}