"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { setUser } from "@/store/slices/authSlice";
import { setSubscription } from "@/store/slices/subscriptionSlice";
import { registerUser, sendOtp } from "@/services/auth.service";
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
  otp: "",
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
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string[] }>(
    {},
  );
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);

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
      setForm((prev) => ({ ...prev, plan: String(subscriptionData.plan_id) }));
      return;
    }

    const stored = storage.get<{ plan_id?: number }>("subscription", true);
    if (stored?.plan_id) {
      setForm((prev) => ({ ...prev, plan: String(stored.plan_id) }));
    }
  }, [subscriptionData, plans]);

  /* ---------------- OTP TIMER ---------------- */
  useEffect(() => {
    if (otpTimer <= 0) return;
    const interval = setInterval(() => setOtpTimer((prev) => prev - 1), 1000);
    return () => clearInterval(interval);
  }, [otpTimer]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target;

    if (name === "contact") {
      const digits = value.replace(/\D/g, "").slice(0, 10);
      return setForm((prev) => ({ ...prev, contact: digits }));
    }

    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));

    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: [] }));
    }
  };

  const handleSendOtp = async () => {
    if (!form.email || !form.contact) {
      return toast.error("Please enter email and mobile number");
    }
    if (form.contact.length !== 10) {
      return toast.error("Enter valid number");
    }
    if (isSendingOtp) return;

    setIsSendingOtp(true);
    try {
      const res = await sendOtp({ contact: form.contact, email: form.email });
      if (!res?.status) {
        throw new Error(res?.message || "Failed to send OTP");
      }
      setIsOtpSent(true);
      setOtpTimer(60);
      toast.success("OTP sent successfully");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to send OTP";

      toast.error(message);
    } finally {
      setIsSendingOtp(false);
    }
  };

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

  const formatDateForAPI = (date: string): string => {
    if (!date) return "";
    const [year, month, day] = date.split("-");
    return `${day}-${month}-${year}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFieldErrors({});

    try {
      const selectedPlan = plans.find((p) => String(p.id) === form.plan);
      if (!selectedPlan) throw new Error("Please select a plan");

      const formattedDob = formatDateForAPI(form.dob);
      const payload = {
        ...form,
        otp: form.otp,
        dob: formattedDob,
        membership_plan_id: selectedPlan.id,
      };

      let res;
      try {
        res = await registerUser(payload);
      } catch (error: unknown) {
        const isPendingPaymentError =
          error instanceof Error &&
          error.message === "Pending payment already exists";

        if (!isPendingPaymentError) throw error;

        toast.info("Cleaning up previous payment session...");
        await cancelPendingPayment();
        await new Promise((resolve) => setTimeout(resolve, 1000));
        res = await registerUser(payload);
      }

      if (!res?.status) {
        if (res?.errors) setFieldErrors(res.errors);
        throw new Error(res?.message || "Registration failed");
      }

      const responseData = res.data;

      /* ---- Payment-required response (no user/token yet) ---- */
      if (responseData?.payment && !responseData?.user) {
        const { payment, membership_plan_id: membershipPlanId } = responseData;

        if (payment && payment.amount > 0) {
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
      }

      /* ---- Free plan response (user + subscription + token) ---- */
      const {
        token,
        user: userData,
        subscription: newSubscription,
      } = responseData;

      if (token && userData) {
        const userWithSubscription = {
          ...userData,
          active_subscription: newSubscription
            ? {
                id: newSubscription.id,
                plan_id: newSubscription.plan?.id,
                status: newSubscription.status,
                start_date: newSubscription.start_date,
                end_date: newSubscription.end_date,
                purchase_type: newSubscription.purchase_type,
                plan: newSubscription.plan,
              }
            : null,
        };

        dispatch(setUser({ user: userWithSubscription, token }));

        if (newSubscription) {
          dispatch(
            setSubscription({
              id: newSubscription.id,
              plan_id: newSubscription.plan?.id,
              name: newSubscription.plan?.name,
              amount: Number(newSubscription.plan?.price || 0),
              status: newSubscription.status,
              start_date: newSubscription.start_date,
              end_date: newSubscription.end_date,
              duration_value: newSubscription.plan?.duration_value,
              duration_unit: newSubscription.plan?.duration_unit,
              purchase_type: newSubscription.purchase_type,
              features: newSubscription.plan?.feature,
              is_trial: String(newSubscription.plan?.is_trial ?? ""),
              tag: newSubscription.plan?.tag,
              created_at: newSubscription.plan?.created_at,
            }),
          );
        }

        toast.success("Registration Successful");
        router.replace("/thankyou");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to send OTP";

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
    isSendingOtp,
    isOtpSent,
    otpTimer,
    processingPayment,
    selectedPlan: plans.find((p) => String(p.id) === form.plan),
    otherPlans: plans.filter((p) => String(p.id) !== form.plan),
    handleChange,
    handleSendOtp,
    handleSubmit,
    setForm,
    getError: (name: string) => fieldErrors[name]?.[0],
  };
}
