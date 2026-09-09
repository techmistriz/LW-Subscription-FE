export interface RazorpayOptions {
  key?: string;
  amount: number;
  currency: string;
  order_id: string;
  name: string;
  description?: string;

  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };

  theme?: {
    color: string;
  };

  modal?: {
    ondismiss?: () => void;
  };

  handler: (response: RazorpayPaymentResponse) => Promise<void>;
}

export interface RazorpayPaymentResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export interface RazorpayPaymentFailedResponse {
  error?: {
    description?: string;
  };
}

export interface RazorpayInstance {
  open: () => void;

  on: (
    event: "payment.failed",
    handler: (response: RazorpayPaymentFailedResponse) => void,
  ) => void;
}

export interface RazorpayConstructor {
  new (options: RazorpayOptions): RazorpayInstance;
}
