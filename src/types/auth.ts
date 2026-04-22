export interface RegisterForm {
  first_name: string;
  last_name: string;
  email: string;
  contact: string;
  password: string;
  password_confirmation: string;
  address: string;
  plan: string; // UI only
  auto_renew: boolean; // UI only
}

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

export interface RegisterResponse {
  token: string | undefined;
  user: any;
  status: boolean;
  message: string;
  data: {
    user: any;
    token?: string;
    payment?: {
      amount: number;
      currency: string;
      order_id: string;
      razorpay_key: string;
    };
  };
  errors?: Record<string, string[]>;
}