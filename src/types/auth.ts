export interface User {
  id: number;

  first_name?: string;
  last_name?: string;
  name?: string;

  email?: string;
  contact?: string;
  phone?: string;

  address?: string;
  gst_number?: string;

  dob?: string;
  gender?: string;
  age_group?: string;

  country_id?: number;
  state_id?: number;
  city_id?: number;
  custom_city?: string;

  interest?: string | string[];
  interests?: string[];

  hearabout?: string;
  subscribe?: boolean;

  visited?: boolean;
  visited_year?: string | string[];

  role_id?: number;
  membership_plan_id?: number;

  active_subscription?: boolean;

  created_at?: string;
  updated_at?: string;
}

export interface RegisterForm {
  first_name: string;
  last_name: string;
  email: string;
  contact: string;
  password: string;
  password_confirmation: string;
  address: string;
  gst_number: string;
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
  gst_number: string;
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
