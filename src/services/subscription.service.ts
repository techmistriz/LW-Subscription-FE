import api from "@/network/axios";
import type { PaymentResponse, PaymentVerificationResponse } from "@/types/api";

export const buyNewPlan = async (
  membership_plan_id: number,
): Promise<PaymentResponse> => {
  const res = await api.post("/subscription/new-plan", {
    membership_plan_id,
  });
  return res.data;
};

export const renewPlan = async (
  subscription_id: number,
): Promise<PaymentResponse> => {
  const res = await api.post("/subscription/renew-plan", { subscription_id });
  return res.data;
};

export const upgradePlan = async (
  membership_plan_id: number,
): Promise<PaymentResponse> => {
  const res = await api.post("/subscription/upgrade-plan", {
    membership_plan_id,
  });
  return res.data;
};

export const verifySubscriptionPayment = async (payload: {
  subscription_id: number;
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}): Promise<PaymentVerificationResponse> => {
  const res = await api.post("/subscription/payment-verify", payload);
  return res.data;
};

export const verifyRenewPayment = verifySubscriptionPayment;

export const retrySubscriptionPayment = async (
  subscription_id: number,
): Promise<PaymentResponse> => {
  const res = await api.post("/subscription/retry-payment", {
    subscription_id,
  });
  return res.data;
};
