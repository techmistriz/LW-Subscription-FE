import axiosInstance from "../axios";

/* ---------------- UPGRADE PLAN ---------------- */
export const upgradePlan = async (
  membership_plan_id: number
) => {
  const res = await axiosInstance.post(
    "/subscription/upgrade-plan",
    {
      membership_plan_id,
    }
  );

  return res.data;
};

/* ---------------- BUY NEW PLAN ---------------- */
export const buyNewPlan = async (
  membership_plan_id: number
) => {
  const res = await axiosInstance.post(
    "/subscription/buy-new-plan",
    {
      membership_plan_id,
    }
  );

  return res.data;
};

/* ---------------- RENEW PLAN ---------------- */
export const renewPlan = async (
  subscription_id: number
) => {

  const body = {
    subscription_id,
  };

  console.log("========== RENEW REQUEST ==========");
  console.log("URL => /subscription/renew-plan");

  console.log("BODY =>", body);

  console.log(
    "HEADERS =>",
    axiosInstance.defaults.headers.common
  );

  console.log(
    "TOKEN =>",
    axiosInstance.defaults.headers.common[
      "Authorization"
    ]
  );

  const res = await axiosInstance.post(
    "/subscription/renew-plan",
    body
  );

  console.log("RENEW RESPONSE =>", res.data);

  return res.data;
};

/* ---------------- VERIFY PAYMENT ---------------- */
export const verifySubscriptionPayment = async (payload: {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
  purchase_type?: "RENEW" | "UPGRADE";
  membership_plan_id?: number;
}) => {
  const res = await axiosInstance.post(
    "/subscription/payment-verify",
    payload
  );

  return res.data;
};

/* ---------------- VERIFY RENEW PAYMENT ---------------- */
/* same API */
export const verifyRenewPayment =
  verifySubscriptionPayment;