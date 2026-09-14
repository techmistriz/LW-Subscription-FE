import { PaymentDetails, Subscription } from "./models";

export type ApiResponse<T = unknown> =
  | {
      status: true;
      message: string;
      data: T;
    }
  | {
      status: false;
      message: string;
      data: null;
      errors?: Record<string, string[]>;
    };

export interface Paging {
  current_page: number;
  last_page: number;
  total: number;
  per_page: number;
}

export interface PaginationMeta {
  paging: Paging;
}

export interface PaginatedResponse<T> {
  message: string;
  status: boolean;
  data: T[];
  meta: PaginationMeta;
}

export interface PaymentResponse {
  status: boolean;
  message: string;
  data: CheckoutData;
}

export interface CheckoutData {
  subscription: Subscription;
  payment: PaymentDetails | null;
  payment_confirmed?: boolean;
}

export interface PaymentVerificationResponse {
  status: boolean;
  message: string;
  data: {
    subscription: Subscription;
    payment_confirmed: boolean;
    payment_status?: string;
  };
}
