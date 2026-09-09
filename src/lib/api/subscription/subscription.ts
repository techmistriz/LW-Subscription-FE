import api from "../axios";

export const buyNewPlan = async (membership_plan_id: number) => {
  const res = await api.post("/subscription/buy-new-plan", {
    membership_plan_id,
  });
  return res.data;
};

export const renewPlan = async (subscription_id: number) => {
  const res = await api.post("/subscription/renew-plan", { subscription_id });
  return res.data;
};

export const upgradePlan = async (membership_plan_id: number) => {
  const res = await api.post("/subscription/upgrade-plan", {
    membership_plan_id,
  });
  return res.data;
};

export const verifySubscriptionPayment = async (payload: {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
  purchase_type?: "NEW" | "RENEW" | "UPGRADE";
  membership_plan_id?: number;
}) => {
  const res = await api.post("/subscription/payment-verify", payload);
  return res.data;
};

export const verifyRenewPayment = verifySubscriptionPayment;
