import api from "@/lib/api/axios";

export async function verifyPayment(data: {
  purchase_type: string;
  membership_plan_id: number;
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}) {
  try {
    const response = await api.post("/auth/verify-payment", data);

    return response.data;
  } catch (error: any) {
    console.error("VERIFY API ERROR =>", error);

    throw new Error(
      error.response?.data?.message || "Payment verification failed",
    );
  }
}
