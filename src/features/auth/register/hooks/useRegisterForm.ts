"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/redux/store/hooks";
import { setUser } from "@/redux/store/slices/authSlice";
import { setSubscription } from "@/redux/store/slices/subscriptionSlice";
import { registerUser, sendOtp } from "@/lib/api/auth/auth";
import { usePayment } from "./usePayment";
import axiosInstance from "@/lib/api/axios";
import { Plan, RegisterFormData } from "@/types/register.types";
import { getPlans } from "../../services/plans";

const initialForm: RegisterFormData = {
  first_name: "",
  last_name: "",
  email: "",
  contact: "",
  otp: "",
  dob: "",
  organisation: "",
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

  const { user, token } = useAppSelector((state) => state.auth);
  const subscriptionData = useAppSelector((state) => state.subscription.data);

  const [form, setForm] = useState<RegisterFormData>(initialForm);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(false);
  const [plansLoading, setPlansLoading] = useState(true);
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string[] }>(
    {},
  );
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);
  const [processingPayment, setProcessingPayment] = useState(false); //  ADD THIS

  // Fetch plans
  useEffect(() => {
    const fetchPlans = async () => {
      setPlansLoading(true);
      try {
        const data = await getPlans();
        setPlans(data);
      } catch {
        toast.error("Failed to load plans");
      } finally {
        setPlansLoading(false);
      }
    };
    fetchPlans();
  }, []);

  // Preselect plan
  useEffect(() => {
    if (!plans.length) return;
    if (subscriptionData?.plan_id) {
      setForm((prev) => ({ ...prev, plan: String(subscriptionData.plan_id) }));
    } else {
      const stored = sessionStorage.getItem("subscription");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed?.plan_id) {
            setForm((prev) => ({ ...prev, plan: String(parsed.plan_id) }));
          }
        } catch {
          console.warn("Invalid subscription in sessionStorage");
        }
      }
    }
  }, [subscriptionData, plans]);

  // OTP timer
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
    if (form.contact.length !== 10) {
      return toast.error("Enter valid number");
    }

    try {
      const res = await sendOtp(form.contact);
      if (!res?.status) throw new Error(res?.message);

      setIsOtpSent(true);
      setOtpTimer(60);
      // toast.success("OTP sent");

      const otp = res?.data?.otp || res?.otp;
      if (otp && process.env.NODE_ENV === "development") {
        console.log("OTP:", otp);
        toast.success(`Demo OTP: ${otp}`);
      }
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const cancelPendingPayment = async () => {
    try {
      const response = await axiosInstance.post("/payment/cancel-pending", {
        email: form.email,
        contact: form.contact,
      });
      return response.data;
    } catch (error: any) {
      console.log("No pending payment found");
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

      let res;
      try {
        res = await registerUser({
          ...form,
          otp: form.otp,
          dob: formattedDob,
          membership_plan_id: selectedPlan.id,
        });
      } catch (error: any) {
        if (
          error.message === "Pending payment already exists" ||
          error.response?.data?.message === "Pending payment already exists"
        ) {
          toast.info("Cleaning up previous payment session...");
          await cancelPendingPayment();
          await new Promise((resolve) => setTimeout(resolve, 1000));
          res = await registerUser({
            ...form,
            otp: form.otp,
            dob: formattedDob,
            membership_plan_id: selectedPlan.id,
          });
        } else {
          throw error;
        }
      }

      console.log("Registration response:", res);

      if (!res?.status) {
        if (res?.errors) setFieldErrors(res.errors);
        throw new Error(res?.message || "Registration failed");
      }

      const responseData = res.data;

      // Check if this is a payment response (no user/token)
      if (responseData?.payment && !responseData?.user) {
        const payment = responseData.payment;
        const membershipPlanId = responseData.membership_plan_id;

        console.log("Payment initiation response:", {
          payment,
          membershipPlanId,
        });

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

      //  FIX: Handle free plan response (has user, subscription, token)
      const {
        token,
        user: userData,
        subscription: subscriptionData,
      } = responseData;

      console.log("Free plan response - User:", userData);
      console.log("Free plan response - Subscription:", subscriptionData);
      console.log("Free plan response - Token:", token);

      if (token && userData) {
        axiosInstance.defaults.headers.common["Authorization"] =
          `Bearer ${token}`;

        //  CRITICAL: Add subscription to user object
        const userWithSubscription = {
          ...userData,
          active_subscription: subscriptionData
            ? {
                id: subscriptionData.id,
                plan_id: subscriptionData.plan?.id,
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
        dispatch(setUser({ user: userWithSubscription, token }));

        // Also dispatch subscription separately
        if (subscriptionData) {
          dispatch(
            setSubscription({
              id: subscriptionData.id,
              plan_id: subscriptionData.plan?.id,
              name: subscriptionData.plan?.name,
              amount: Number(subscriptionData.plan?.price || 0),
              status: subscriptionData.status,
              start_date: subscriptionData.start_date,
              end_date: subscriptionData.end_date,
              purchase_type: subscriptionData.purchase_type,
              features: subscriptionData.plan?.feature,
              is_trial: String(subscriptionData.plan?.is_trial ?? ""),
              tag: subscriptionData.plan?.tag,
            }),
          );
        }

        toast.success("Registration Successful");

        // Wait for Redux to persist
        await new Promise((resolve) => setTimeout(resolve, 500));

        router.replace("/thankyou");
        return;
      }
    } catch (err: any) {
      console.error("Submit error:", err);
      toast.error(err.message || "Registration failed");
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
    isOtpSent,
    otpTimer,
    processingPayment, //  Export this
    selectedPlan: plans.find((p) => String(p.id) === form.plan),
    otherPlans: plans.filter((p) => String(p.id) !== form.plan),
    handleChange,
    handleSendOtp,
    handleSubmit,
    setForm,
    getError: (name: string) => fieldErrors[name]?.[0],
  };
}
