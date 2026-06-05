import axiosInstance from "../axios";

/* ---------------- BUY NEW PLAN ---------------- */
export const buyNewPlan = async (membership_plan_id: number) => {
  try {
    const body = {
      membership_plan_id,
    };

    const res = await axiosInstance.post("/subscription/buy-new-plan", body);

    // console.log("BUY NEW PLAN RESPONSE DATA =>", res.data);

    return res.data;
  } catch (error: any) {
    console.log("BUY NEW PLAN ERROR DATA =>", error?.response?.data);

    throw error;
  }
};

/* ---------------- RENEW PLAN ---------------- */
export const renewPlan = async (subscription_id: number) => {
  try {
    const body = {
      subscription_id,
    };

    const res = await axiosInstance.post("/subscription/renew-plan", body);

    // console.log("RENEW RESPONSE DATA =>", res.data);

    return res.data;
  } catch (error: any) {
    console.log("RENEW PLAN ERROR DATA =>", error?.response?.data);

    throw error;
  }
};

/* ---------------- UPGRADE PLAN ---------------- */
export const upgradePlan = async (membership_plan_id: number) => {
  try {
    const body = {
      membership_plan_id,
    };

    const res = await axiosInstance.post("/subscription/upgrade-plan", body);

    // console.log("UPGRADE RESPONSE DATA =>", res.data);

    return res.data;
  } catch (error: any) {
    console.log("UPGRADE PLAN ERROR DATA =>", error?.response?.data);

    throw error;
  }
};

/* ---------------- PAYMENT VERIFY ---------------- */
export const verifySubscriptionPayment = async (payload: {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
  purchase_type?: "NEW" | "RENEW" | "UPGRADE";
  membership_plan_id?: number;
}) => {
  try {
    const res = await axiosInstance.post(
      "/subscription/payment-verify",
      payload,
    );

    // console.log("VERIFY RESPONSE DATA =>", res.data);

    return res.data;
  } catch (error: any) {
    console.log("VERIFY PAYMENT ERROR DATA =>", error?.response?.data);

    throw error;
  }
};

/* ---------------- VERIFY RENEW PAYMENT ---------------- */
export const verifyRenewPayment = verifySubscriptionPayment;
