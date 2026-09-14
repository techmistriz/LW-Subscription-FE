"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { completeCheckout } from "@/lib/paymentCheckout";
import { verifyPayment } from "@/services/payment.service";
import type { RegisterApiData } from "@/types/auth";

export const REGISTRATION_CHECKOUT_KEY = "registration_checkout";

export function usePayment() {
  const router = useRouter();

  const handleRegistrationPayment = async (
    data: RegisterApiData,
    setProcessingPayment: (value: boolean) => void,
  ) => {
    if (data.checkout_error) throw new Error(data.checkout_error);
    const subscription = await completeCheckout(
      data,
      data.user,
      (response) =>
        verifyPayment({
          ...response,
          subscription_id: data.subscription.id,
          checkout_token: data.checkout_token,
        }),
      setProcessingPayment,
    );
    if (!subscription) return;

    sessionStorage.removeItem(REGISTRATION_CHECKOUT_KEY);
    sessionStorage.setItem(
      "registration_success",
      JSON.stringify({
        email: data.user.email,
        first_name: data.user.first_name,
        last_name: data.user.last_name,
        planName: subscription.plan?.name,
        status: subscription.status,
      }),
    );
    toast.success("Your subscription is confirmed. You can now sign in.");
    router.replace("/thankyou");
  };

  return { handleRegistrationPayment };
}
