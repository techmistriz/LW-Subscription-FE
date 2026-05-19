// import axiosInstance from "../axios";


// /* ---------------- BUY NEW PLAN ---------------- */
// export const buyNewPlan = async (
//   membership_plan_id: number
// ) => {
//   const res = await axiosInstance.post(
//     "/subscription/buy-new-plan",
//     {
//       membership_plan_id,
//     }
//   );

//   return res.data;
// };

// /* ---------------- RENEW PLAN ---------------- */
// export const renewPlan = async (
//   subscription_id: number
// ) => {

//   const body = {
//     subscription_id,
//   };

//   console.log("========== RENEW REQUEST ==========");
//   console.log("URL => /subscription/renew-plan");

//   console.log("BODY =>", body);

//   console.log(
//     "HEADERS =>",
//     axiosInstance.defaults.headers.common
//   );

//   console.log(
//     "TOKEN =>",
//     axiosInstance.defaults.headers.common[
//       "Authorization"
//     ]
//   );

//   const res = await axiosInstance.post(
//     "/subscription/renew-plan",
//     body
//   );

//   console.log("RENEW RESPONSE =>", res.data);

//   return res.data;
// };


// /* ---------------- UPGRADE PLAN ---------------- */
// export const upgradePlan = async (
//   membership_plan_id: number
// ) => {
//   const res = await axiosInstance.post(
//     "/subscription/upgrade-plan",
//     {
//       membership_plan_id,
//     }
//   );

//   return res.data;
// };


// /* ----------------  PAYMENT VERIFY ---------------- */
// export const verifySubscriptionPayment = async (payload: {
//   razorpay_payment_id: string;
//   razorpay_order_id: string;
//   razorpay_signature: string;
// purchase_type?: "NEW" | "RENEW" | "UPGRADE";
//   membership_plan_id?: number;
// }) => {
//   const res = await axiosInstance.post(
//     "/subscription/payment-verify",
//     payload
//   );

//   return res.data;
// };

// /* ---------------- VERIFY RENEW PAYMENT ---------------- */
// /* same API */
// export const verifyRenewPayment =
//   verifySubscriptionPayment;



import axiosInstance from "../axios";

/* ---------------- BUY NEW PLAN ---------------- */
export const buyNewPlan = async (
  membership_plan_id: number
) => {
  try {
    const body = {
      membership_plan_id,
    };

    console.log("========== BUY NEW PLAN ==========");
    console.log("URL => /subscription/buy-new-plan");
    console.log("BODY =>", body);

    console.log(
      "TOKEN =>",
      axiosInstance.defaults.headers.common["Authorization"]
    );

    const res = await axiosInstance.post(
      "/subscription/buy-new-plan",
      body
    );

    console.log("BUY NEW PLAN FULL RESPONSE =>", res);
    console.log("BUY NEW PLAN RESPONSE DATA =>", res.data);

    return res.data;
  } catch (error: any) {
    console.log("BUY NEW PLAN ERROR =>", error);
    console.log(
      "BUY NEW PLAN ERROR RESPONSE =>",
      error?.response
    );
    console.log(
      "BUY NEW PLAN ERROR DATA =>",
      error?.response?.data
    );

    throw error;
  }
};

/* ---------------- RENEW PLAN ---------------- */
export const renewPlan = async (
  subscription_id: number
) => {
  try {
    const body = {
      subscription_id,
    };

    console.log("========== RENEW PLAN ==========");
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

    console.log("RENEW FULL RESPONSE =>", res);

    console.log("RENEW RESPONSE DATA =>", res.data);

    console.log(
      "RENEW SUBSCRIPTION =>",
      res?.data?.data?.subscription
    );

    console.log(
      "RENEW PAYMENT =>",
      res?.data?.data?.payment
    );

    return res.data;
  } catch (error: any) {
    console.log("RENEW PLAN ERROR =>", error);

    console.log(
      "RENEW PLAN ERROR RESPONSE =>",
      error?.response
    );

    console.log(
      "RENEW PLAN ERROR DATA =>",
      error?.response?.data
    );

    throw error;
  }
};

/* ---------------- UPGRADE PLAN ---------------- */
export const upgradePlan = async (
  membership_plan_id: number
) => {
  try {
    const body = {
      membership_plan_id,
    };

    console.log("========== UPGRADE PLAN ==========");
    console.log("URL => /subscription/upgrade-plan");

    console.log("BODY =>", body);

    console.log(
      "TOKEN =>",
      axiosInstance.defaults.headers.common[
        "Authorization"
      ]
    );

    const res = await axiosInstance.post(
      "/subscription/upgrade-plan",
      body
    );

    console.log("UPGRADE FULL RESPONSE =>", res);

    console.log(
      "UPGRADE RESPONSE DATA =>",
      res.data
    );

    console.log(
      "UPGRADE PAYMENT =>",
      res?.data?.data?.payment
    );

    return res.data;
  } catch (error: any) {
    console.log("UPGRADE PLAN ERROR =>", error);

    console.log(
      "UPGRADE PLAN ERROR RESPONSE =>",
      error?.response
    );

    console.log(
      "UPGRADE PLAN ERROR DATA =>",
      error?.response?.data
    );

    throw error;
  }
};

/* ---------------- PAYMENT VERIFY ---------------- */
export const verifySubscriptionPayment = async (
  payload: {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
    purchase_type?: "NEW" | "RENEW" | "UPGRADE";
    membership_plan_id?: number;
  }
) => {
  try {
    console.log(
      "========== PAYMENT VERIFY =========="
    );

    console.log(
      "URL => /subscription/payment-verify"
    );

    console.log("VERIFY PAYLOAD =>", payload);

    const res = await axiosInstance.post(
      "/subscription/payment-verify",
      payload
    );

    console.log(
      "VERIFY FULL RESPONSE =>",
      res
    );

    console.log(
      "VERIFY RESPONSE DATA =>",
      res.data
    );

    console.log(
      "VERIFY SUBSCRIPTION =>",
      res?.data?.data?.subscription
    );

    console.log(
      "VERIFY USER =>",
      res?.data?.data?.user
    );

    return res.data;
  } catch (error: any) {
    console.log("VERIFY PAYMENT ERROR =>", error);

    console.log(
      "VERIFY PAYMENT ERROR RESPONSE =>",
      error?.response
    );

    console.log(
      "VERIFY PAYMENT ERROR DATA =>",
      error?.response?.data
    );

    throw error;
  }
};

/* ---------------- VERIFY RENEW PAYMENT ---------------- */
export const verifyRenewPayment =
  verifySubscriptionPayment;