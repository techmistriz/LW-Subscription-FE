export interface RegisterFormData {
  first_name: string;
  last_name: string;
  email: string;
  contact: string;
  otp: string;
  dob: string;
  organisation: string;
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

export interface Plan {
  id: number;
  name: string;
  price: string | number;
  duration_value: number;
  duration_unit: string;
  feature: string;
  is_trial: number;
  tag: string;
}

export interface PaymentData {
  razorpay_key: string;
  amount: number;
  currency: string;
  order_id: string;
}