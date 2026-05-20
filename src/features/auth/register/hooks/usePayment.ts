"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAppDispatch } from "@/redux/store/hooks";
import { setUser } from "@/redux/store/slices/authSlice";
import { setSubscription } from "@/redux/store/slices/subscriptionSlice";
import axiosInstance from "@/lib/api/axios";
import { Plan, RegisterFormData } from "@/types/register.types";
import { verifyPayment } from "../../services/payment";

const loadRazorpay = () =>
  new Promise<boolean>((resolve) => {
    if ((window as any).Razorpay) return resolve(true);
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
    payment: any,
    selectedPlan: Plan,
    registrationToken: string | null,
    form: RegisterFormData,
    setProcessingPayment: (value: boolean) => void,
    membershipPlanId?: number,
  ) => {
    console.log("Starting Razorpay payment with:", {
      payment,
      selectedPlan,
      membershipPlanId,
    });

    const isLoaded = await loadRazorpay();
    if (!isLoaded) throw new Error("Razorpay SDK failed to load");

    const rzp = new (window as any).Razorpay({
      key: payment.razorpay_key,
      amount: payment.amount,
      currency: payment.currency,
      order_id: payment.order_id,
      name: "Lexwitness",
      description: selectedPlan.name,

    handler: async (response: any) => {
  setProcessingPayment(true);

  console.log(
    "========== RAZORPAY SUCCESS =========="
  );

  console.log(
    "RAZORPAY RESPONSE =>",
    response
  );

  console.log(
    "SELECTED PLAN =>",
    selectedPlan
  );

  console.log(
    "MEMBERSHIP PLAN ID =>",
    membershipPlanId
  );

  try {
          const verifyPayload = {
            purchase_type: "NEW",
            membership_plan_id: membershipPlanId || Number(selectedPlan.id),
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
          };

          console.log("Sending verification payload:", verifyPayload);

          const verifyRes = await verifyPayment(verifyPayload);

          console.log("Verification response:", verifyRes);

          if (!verifyRes?.status) {
            throw new Error(verifyRes?.message || "Verification failed");
          }

          const userData = verifyRes.data?.user;
          const subscriptionData = verifyRes.data?.subscription;
          const token = verifyRes.data?.token;

          console.log("User data:", userData);
          console.log("Subscription data:", subscriptionData);
          console.log("Token:", token);

          if (!userData || !token) {
            throw new Error("Missing user data in verification response");
          }

          // Add subscription to user object
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

          console.log("User with subscription:", userWithSubscription);

          // Dispatch to Redux
          dispatch(
            setUser({
              user: userWithSubscription,
              token: token,
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
              }),
            );
          }

          // Wait for Redux to persist to storage
          await new Promise((resolve) => setTimeout(resolve, 1000));

          // Verify data was saved
          const savedUser = sessionStorage.getItem("user");
          const savedSubscription = sessionStorage.getItem("subscription");

          console.log("Storage verification - User saved:", !!savedUser);
          console.log(
            "Storage verification - Subscription saved:",
            !!savedSubscription,
          );

          toast.success("Payment successful! Registration completed.");

          // Redirect to thank you page
          router.replace("/thankyou");
        } catch (err: any) {
          console.error("Payment verification error:", err);
          toast.error(err.message || "Payment verification failed");
          setProcessingPayment(false);
        }
      },

      prefill: {
        name: `${form.first_name} ${form.last_name}`,
        email: form.email,
        contact: form.contact,
      },

      theme: { color: "#c9060a" },

      modal: {
        ondismiss: () => {
          console.log("Payment modal closed by user");
          toast.info("Payment cancelled");
          setProcessingPayment(false);
        },
      },
    });

    rzp.open();
  };

  return { handleRazorpayPayment };
}
