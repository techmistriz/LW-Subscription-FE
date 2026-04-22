import api from "@/lib/api/axios";

export async function verifyPayment(data: {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}) {
  try {
    console.log(" VERIFY API CALL START");
    console.log("Verify Payload:", data);

    const response = await api.post(
      "/auth/razorpay/notify",
      data
    );

    console.log(" VERIFY API RESPONSE:", response.data);

    return response.data;
  } catch (error: any) {
    console.error("VERIFY API ERROR:", error);
    console.log("VERIFY ERROR DATA:", error.response?.data);

    throw new Error(
      error.response?.data?.message || "Payment verification failed"
    );
  }
}