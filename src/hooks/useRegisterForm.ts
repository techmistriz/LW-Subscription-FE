"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";

import { registerUser } from "@/services/auth.service";
import { getMembershipPlans } from "../services/plan.service";
import api from "@/network/axios";
import { usePayment, REGISTRATION_CHECKOUT_KEY } from "./usePayment";
import type { RegisterApiData } from "@/types/auth";
import { extractErrorMessage } from "@/network/errorMessage";
import { RegisterFormData } from "@/types/register.types";
import type { SubscriptionPlan } from "@/types/models";

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
  const { handleRegistrationPayment } = usePayment();
  const [pendingCheckout, setPendingCheckout] = useState<{
    subscription_id: number;
    checkout_token: string;
    email: string;
  } | null>(() => {
    try {
      const saved = sessionStorage.getItem(REGISTRATION_CHECKOUT_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [form, setForm] = useState<RegisterFormData>(initialForm);
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(false);
  const [plansLoading, setPlansLoading] = useState(true);
  const [registrationSuccess] = useState(false);

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

  const resumePayment = async () => {
    if (!pendingCheckout || loading) return;
    setLoading(true);
    try {
      const res = await api.post<{
        status: boolean;
        data: RegisterApiData;
        message: string;
      }>("/auth/retry-payment", pendingCheckout);
      if (!res.data.status) throw new Error(res.data.message);
      await handleRegistrationPayment(
        { ...res.data.data, checkout_token: pendingCheckout.checkout_token },
        setProcessingPayment,
      );
    } catch (error) {
      toast.error(extractErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    if (pendingCheckout?.email === form.email) {
      await resumePayment();
      return;
    }
    setLoading(true);
    setFieldErrors({});
    try {
      const selectedPlan = plans.find((p) => String(p.id) === form.plan);
      if (!selectedPlan) throw new Error("Please select a plan");
      const res = await registerUser({
        ...form,
        membership_plan_id: selectedPlan.id,
      });
      if (!res.status) {
        setFieldErrors(res.errors ?? {});
        throw new Error(res.message);
      }
      const data = res.data;
      if (Number(data.subscription.total_amount) > 0) {
        const saved = {
          subscription_id: data.subscription.id,
          checkout_token: data.checkout_token,
          email: data.user.email ?? form.email,
        };
        sessionStorage.setItem(
          REGISTRATION_CHECKOUT_KEY,
          JSON.stringify(saved),
        );
        setPendingCheckout(saved);
      }
      await handleRegistrationPayment(data, setProcessingPayment);
    } catch (error) {
      toast.error(extractErrorMessage(error, "Registration failed."));
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
    pendingCheckout,
    resumePayment,

    selectedPlan: plans.find((p) => String(p.id) === form.plan),

    otherPlans: plans.filter((p) => String(p.id) !== form.plan),

    handleChange,
    handleSubmit,
    setForm,

    getError: (name: string) => fieldErrors[name]?.[0],
  };
}
