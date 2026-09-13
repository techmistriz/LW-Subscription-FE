"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { useAppDispatch } from "@/store/hooks";
import { setUser } from "@/store/slices/authSlice";
import { setSubscription } from "@/store/slices/subscriptionSlice";
import type { RegisterFormData } from "@/types/register.types";
import type { PaymentDetails, SubscriptionPlan } from "@/types/models";
import { verifyPayment } from "@/services/payment.service";

const loadRazorpay = () =>
  new Promise<boolean>((resolve) => {
    if (window.Razorpay) return resolve(true);

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
    registrationToken: string | null,
    form: RegisterFormData,
    setProcessingPayment: (value: boolean) => void,
    membershipPlanId?: number,
  ) => {
    const isLoaded = await loadRazorpay();

    console.log("Razorpay SDK loaded:", isLoaded);
    console.log("window.Razorpay:", window.Razorpay);

    if (!isLoaded) {
      throw new Error("Razorpay SDK failed to load");
    }

    console.log("Razorpay options:", {
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

        try {
          const verifyRes = await verifyPayment({
            purchase_type: "NEW",
            membership_plan_id: membershipPlanId || Number(selectedPlan.id),
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
          });

          if (!verifyRes?.status) {
            throw new Error(verifyRes?.message || "Verification failed");
          }

          const userData = verifyRes.data?.user;
          const subscriptionData = verifyRes.data?.subscription;
          const token = verifyRes.data?.token;

          if (!userData || !token) {
            throw new Error("Missing user data in verification response");
          }

          const userWithSubscription = {
            ...userData,
            active_subscription: subscriptionData
              ? {
                  id: subscriptionData.id,
                  plan_id: subscriptionData.membership_plan_id,
                  status: subscriptionData.status,
                  start_date: subscriptionData.start_date,
                  end_date: subscriptionData.end_date,
                  purchase_type: subscriptionData.purchase_type,
                  plan: subscriptionData.plan,
                }
              : null,
          };

          dispatch(
            setUser({
              user: userWithSubscription,
              token,
            }),
          );

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

          toast.success("Payment successful! Registration completed.");

          router.replace("/thankyou");
        } catch (err: unknown) {
          const message =
            err instanceof Error ? err.message : "Payment verification failed";

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
        color: "#c9060a",
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

  return { handleRazorpayPayment };
}
