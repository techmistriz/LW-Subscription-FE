// import api from "@/lib/api/axios";

// export async function verifyPayment(data: {
//   purchase_type: string;
//   membership_plan_id: number;
//   razorpay_payment_id: string;
//   razorpay_order_id: string;
//   razorpay_signature: string;
// }) {
//   try {
//     // console.log(" VERIFY API CALL START");
//     // console.log("Verify Payload:", data);

//     const response = await api.post("/auth/verify-payment", data);

//     console.log(" VERIFY API RESPONSE:", response.data);

//     return response.data;
//   } catch (error: any) {
//     console.error("VERIFY API ERROR:", error);
//     // console.log("VERIFY ERROR DATA:", error.response?.data);

//     throw new Error(
//       error.response?.data?.message || "Payment verification failed",
//     );
//   }
// }



import api from "@/lib/api/axios";

export async function verifyPayment(data: {
  purchase_type: string;
  membership_plan_id: number;
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}) {
  try {
    console.log(
      "========== VERIFY PAYMENT API =========="
    );

    console.log("VERIFY REQUEST DATA =>", data);

    const response = await api.post(
      "/auth/verify-payment",
      data
    );

    console.log(
      "VERIFY API FULL RESPONSE =>",
      response
    );

    console.log(
      "VERIFY API RESPONSE DATA =>",
      response.data
    );

    console.log(
      "VERIFY API USER =>",
      response?.data?.data?.user
    );

    console.log(
      "VERIFY API SUBSCRIPTION =>",
      response?.data?.data?.subscription
    );

    console.log(
      "VERIFY API TOKEN =>",
      response?.data?.data?.token
    );

    return response.data;
  } catch (error: any) {
    console.error(
      "VERIFY API ERROR =>",
      error
    );

    console.log(
      "VERIFY ERROR RESPONSE =>",
      error?.response
    );

    console.log(
      "VERIFY ERROR DATA =>",
      error?.response?.data
    );

    throw new Error(
      error.response?.data?.message ||
        "Payment verification failed"
    );
  }
}