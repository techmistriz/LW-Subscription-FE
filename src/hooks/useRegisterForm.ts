"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { setUser } from "@/store/slices/authSlice";
import { setSubscription } from "@/store/slices/subscriptionSlice";
import { registerUser } from "@/services/auth.service";
import { getMembershipPlans } from "../services/plan.service";
import api from "@/network/axios";
import { storage } from "@/lib/storage";
import { usePayment } from "./usePayment";
import { RegisterFormData } from "@/types/register.types";
import type { SubscriptionPlan } from "@/types/models";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

const initialForm: RegisterFormData = {
  first_name: "",
  last_name: "",
  email: "",
  contact: "",
  dob: "",
  organisation: "",
  gst_number: "",
  address: "",
  city: "",
  pincode: "",
  state: "",
  country: "India",
  password: "",
  password_confirmation: "",
  plan: "",
  auto_renew: false,
};

export function useRegisterForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { handleRazorpayPayment } = usePayment();

  const subscriptionData = useAppSelector((state) => state.subscription.active);

  const [form, setForm] = useState<RegisterFormData>(initialForm);
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(false);
  const [plansLoading, setPlansLoading] = useState(true);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  const [fieldErrors, setFieldErrors] = useState<{
    [key: string]: string[];
  }>({});

  const [processingPayment, setProcessingPayment] = useState(false);

  /* ---------------- FETCH PLANS ---------------- */

  useEffect(() => {
    const fetchPlans = async () => {
      setPlansLoading(true);

      try {
        const data = await getMembershipPlans();
        setPlans(data);
      } catch {
        toast.error("Failed to load plans");
      } finally {
        setPlansLoading(false);
      }
    };

    fetchPlans();
  }, []);

  /* ---------------- PRESELECT PLAN ---------------- */

  useEffect(() => {
    if (!plans.length) return;

    if (subscriptionData?.plan_id) {
      setForm((prev) => ({
        ...prev,
        plan: String(subscriptionData.plan_id),
      }));

      return;
    }

    const stored = storage.get<{ plan_id?: number }>("subscription", true);

    if (stored?.plan_id) {
      setForm((prev) => ({
        ...prev,
        plan: String(stored.plan_id),
      }));
    }
  }, [subscriptionData, plans]);

  /* ---------------- HANDLE CHANGE ---------------- */

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target;

    if (name === "contact") {
      const digits = value.replace(/\D/g, "").slice(0, 10);

      setForm((prev) => ({
        ...prev,
        contact: digits,
      }));

      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));

    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({
        ...prev,
        [name]: [],
      }));
    }
  };

  /* ---------------- CANCEL PENDING PAYMENT ---------------- */

  const cancelPendingPayment = async () => {
    try {
      const response = await api.post("/payment/cancel-pending", {
        email: form.email,
        contact: form.contact,
      });

      return response.data;
    } catch {
      return null;
    }
  };

  /* ---------------- FORMAT DOB ---------------- */

  const formatDateForAPI = (date: string): string => {
    if (!date) return "";

    const [year, month, day] = date.split("-");

    return `${day}-${month}-${year}`;
  };

  /* ---------------- SUBMIT ---------------- */

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setFieldErrors({});

    try {
      const selectedPlan = plans.find((p) => String(p.id) === form.plan);

      if (!selectedPlan) {
        throw new Error("Please select a plan");
      }

      const formattedDob = formatDateForAPI(form.dob);

      const payload = {
        ...form,
        dob: formattedDob,
        membership_plan_id: selectedPlan.id,
      };

      /* ---------------- REGISTER USER ---------------- */

      let res;

      try {
        res = await registerUser(payload);
      } catch (error: unknown) {
        const isPendingPaymentError =
          error instanceof Error &&
          error.message === "Pending payment already exists";

        if (!isPendingPaymentError) {
          throw error;
        }

        toast.info("Cleaning up previous payment session...");

        await cancelPendingPayment();

        await new Promise((resolve) => setTimeout(resolve, 1000));

        res = await registerUser(payload);
      }

      console.log("[Register] API response:", res);

      /* ---------------- API ERROR ---------------- */

      const apiResponse = res?.response?.original;

      console.log("[Register] API status:", apiResponse?.status);
      console.log("[Register] API message:", apiResponse?.message);

      if (apiResponse?.status === false) {
        if (apiResponse?.errors) {
          setFieldErrors(apiResponse.errors);
        }

        throw new Error(apiResponse?.message || "Registration failed");
      }

      /* ---------------- PAYMENT DATA ---------------- */

      const responseData = apiResponse?.data;

      console.log("[Register] responseData:", responseData);

      const paymentData = responseData;

      console.log("[Register] paymentData:", paymentData);

      /* ---------------- PAID PLAN ---------------- */

      if (paymentData?.payment) {
        const payment = paymentData.payment;

        const membershipPlanId =
          paymentData.membership_plan_id ?? selectedPlan.id;

        console.log("[Register] Payment flow triggered:", {
          payment,
          membershipPlanId,
        });

        if (!payment.razorpay_key) {
          throw new Error("Razorpay key missing");
        }

        if (!payment.order_id) {
          throw new Error("Razorpay order ID missing");
        }

        if (!payment.amount) {
          throw new Error("Razorpay amount missing");
        }

        console.log("[Register] Opening Razorpay with:", {
          key: payment.razorpay_key,
          amount: payment.amount,
          currency: payment.currency,
          order_id: payment.order_id,
        });

        await handleRazorpayPayment(
          payment,
          selectedPlan,
          null,
          form,
          setProcessingPayment,
          membershipPlanId,
        );

        return;
      }

      /* ---------------- FREE PLAN ---------------- */

     /* ---------------- FREE PLAN ---------------- */

const userData = responseData?.user;
const newSubscription = responseData?.subscription;

if (userData && newSubscription) {
  console.log("[Register] Free registration successful:", {
    user: userData,
    subscription: newSubscription,
  });

  toast.success(
    "Registration successful. Please check your email to verify your account.",
  );

  setRegistrationSuccess(true);

  return;
}
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Registration failed";

      console.error("[Register] Error:", err);

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return {
  form,
  plans,
  loading,
  plansLoading,
  fieldErrors,
  processingPayment,
  registrationSuccess,

  selectedPlan: plans.find((p) => String(p.id) === form.plan),

  otherPlans: plans.filter((p) => String(p.id) !== form.plan),

  handleChange,
  handleSubmit,
  setForm,

  getError: (name: string) => fieldErrors[name]?.[0],
};
}
