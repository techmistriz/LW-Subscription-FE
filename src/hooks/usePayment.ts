"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { useAppDispatch } from "@/store/hooks";
import { setSubscription } from "@/store/slices/subscriptionSlice";
import type { RegisterFormData } from "@/types/register.types";
import type { PaymentDetails, SubscriptionPlan } from "@/types/models";
import { verifyPayment } from "@/services/payment.service";

const loadRazorpay = () =>
  new Promise<boolean>((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";

    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);

    document.body.appendChild(script);
  });

export function usePayment() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const handleRazorpayPayment = async (
    payment: PaymentDetails,
    selectedPlan: SubscriptionPlan,
    _registrationToken: string | null,
    form: RegisterFormData,
    setProcessingPayment: (value: boolean) => void,
    membershipPlanId?: number,
  ) => {
    const isLoaded = await loadRazorpay();

    console.log("[Razorpay] SDK loaded:", isLoaded);
    console.log("[Razorpay] window.Razorpay:", window.Razorpay);

    if (!isLoaded) {
      throw new Error("Razorpay SDK failed to load");
    }

    console.log("[Razorpay] Opening checkout with:", {
      key: payment.razorpay_key,
      amount: payment.amount,
      currency: payment.currency,
      order_id: payment.order_id,
    });

    const rzp = new window.Razorpay({
      key: payment.razorpay_key,
      amount: payment.amount,
      currency: payment.currency,
      order_id: payment.order_id,
      name: "Lexwitness",
      description: selectedPlan.name,

      handler: async (response) => {
        setProcessingPayment(true);

        console.log("[Razorpay] Payment response:", response);

        try {
          const payload = {
            purchase_type: "NEW",
            membership_plan_id: membershipPlanId || Number(selectedPlan.id),
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
          };

          console.log("[Payment] Verify payload:", payload);

          const verifyRes = await verifyPayment(payload);

          console.log("[Payment] Verify API response:", verifyRes);

          if (!verifyRes?.status) {
            throw new Error(
              verifyRes?.message || "Payment verification failed",
            );
          }

          const userData = verifyRes.data?.user;
          const subscriptionData = verifyRes.data?.subscription;

          if (!userData) {
            throw new Error(
              "Payment verified, but user data was not returned.",
            );
          }

          /*
           * Store the successful registration details temporarily.
           *
           * We don't set the authenticated user here because the user
           * still needs to verify their email before logging in.
           */
          sessionStorage.setItem(
            "registration_success",
            JSON.stringify({
              email: userData.email,
              first_name: userData.first_name,
              last_name: userData.last_name,
              planName: subscriptionData?.plan?.name || selectedPlan.name,
            }),
          );

          /*
           * Store subscription information only if returned by API.
           *
           * This is optional for the Thank You page because the page can
           * also read planName from sessionStorage.
           */
          if (subscriptionData) {
            dispatch(
              setSubscription({
                id: subscriptionData.id,
                plan_id: subscriptionData.membership_plan_id,
                name: subscriptionData.plan?.name,
                amount: Number(subscriptionData.plan?.price || 0),
                status: subscriptionData.status,
                start_date: subscriptionData.start_date,
                end_date: subscriptionData.end_date,
                duration_value: subscriptionData.plan?.duration_value,
                duration_unit: subscriptionData.plan?.duration_unit,
                purchase_type: subscriptionData.purchase_type,
                features: subscriptionData.plan?.feature,
                is_trial: String(subscriptionData.plan?.is_trial ?? ""),
                tag: subscriptionData.plan?.tag,
                created_at: subscriptionData.plan?.created_at,
              }),
            );
          }

          console.log("[Payment] Payment verified successfully.");
          console.log("[Payment] Registration email:", userData.email);
          console.log("[Payment] Subscription:", subscriptionData);

          toast.success(
            "Payment successful! Your subscription has been activated.",
          );

          /*
           * User must verify email before login.
           */
          router.replace("/thankyou");
        } catch (err: unknown) {
          const message =
            err instanceof Error ? err.message : "Payment verification failed";

          console.error("[Payment] Verification error:", err);

          toast.error(message);
          setProcessingPayment(false);
        }
      },

      prefill: {
        name: `${form.first_name} ${form.last_name}`,
        email: form.email,
        contact: form.contact,
      },

      theme: {
        color: "#c8050b",
      },

      modal: {
        ondismiss: () => {
          toast.info("Payment cancelled");
          setProcessingPayment(false);
        },
      },
    });

    rzp.open();
  };

  return {
    handleRazorpayPayment,
  };
}
