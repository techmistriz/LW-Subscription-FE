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
  otp: string;
  dob: string;
  password_confirmation: string;
  address: string;
  membership_plan_id: number;
}

export interface RegisterResponse {
  status: boolean;
  message: string;

  data: {
    membership_plan_id: number;
    user: any;
    token?: string;

    payment?: {
      amount: number;
      currency: string;
      order_id: string;
      razorpay_key: string;
    };

    subscription?: {
      //  ADD THIS
      id: number;
      status: string;
      start_date: string;
      end_date: string;
      purchase_type: string;
      plan?: any;
    };
  };

  errors?: Record<string, string[]>;
}
