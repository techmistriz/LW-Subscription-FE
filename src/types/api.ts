import { PaymentDetails } from "./models";

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
  status?: boolean;
  message?: string;
  data?: {
    payment?: PaymentDetails;
    razorpay_key?: string;
    amount?: number;
    currency?: string;
    order_id?: string;
  };
}
