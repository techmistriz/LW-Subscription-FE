import type { PaymentVerificationResponse } from "@/types/api";
import api from "@/network/axios";
import { extractErrorMessage } from "@/network/errorMessage";

export interface VerifyPaymentPayload {
  subscription_id: number;
  checkout_token: string;
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export async function verifyPayment(
  data: VerifyPaymentPayload,
): Promise<PaymentVerificationResponse> {
  try {
    const response = await api.post("/auth/verify-payment", data);
    return response.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error, "Payment verification failed"));
  }
}
