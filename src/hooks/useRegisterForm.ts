"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { registerUser } from "@/services/auth.service";
import { getMembershipPlans } from "../services/plan.service";
import api from "@/network/axios";
import { usePayment, REGISTRATION_CHECKOUT_KEY } from "./usePayment";

import type { RegisterApiData, RegisterPayload } from "@/types/auth";
import { extractErrorMessage } from "@/network/errorMessage";
import { RegisterFormData } from "@/types/register.types";
import type { SubscriptionPlan } from "@/types/models";

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

  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(false);
  const [plansLoading, setPlansLoading] = useState(true);
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

  /* ---------------- RESUME PAYMENT ---------------- */

  const resumePayment = async () => {
    if (!pendingCheckout || loading) return;

    setLoading(true);

    try {
      const res = await api.post<{
        status: boolean;
        data: RegisterApiData;
        message: string;
      }>("/auth/retry-payment", pendingCheckout);

      if (!res.data.status) {
        throw new Error(res.data.message);
      }

      await handleRegistrationPayment(
        {
          ...res.data.data,
          checkout_token: pendingCheckout.checkout_token,
        },
        setProcessingPayment,
      );
    } catch (error) {
      toast.error(extractErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- SUBMIT REGISTRATION ---------------- */

  const submitRegistration = async (formData: RegisterFormData) => {
    if (loading) return;

    /*
     * If this email already has a pending checkout,
     * resume that payment instead of creating another
     * registration.
     */
    if (pendingCheckout?.email === formData.email) {
      await resumePayment();
      return;
    }

    setLoading(true);

    try {
      /* ---------------- FIND SELECTED PLAN ---------------- */

      const selectedPlan = plans.find(
        (plan) => String(plan.id) === formData.plan,
      );

      if (!selectedPlan) {
        throw new Error("Please select a plan");
      }

      /* ---------------- API PAYLOAD ---------------- */

      const payload: RegisterPayload = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        contact: formData.contact,
        password: formData.password,
        password_confirmation: formData.password_confirmation,
        dob: formData.dob,
        organisation: formData.organisation,
        gst_number: formData.gst_number,
        address: formData.address,
        city: formData.city,
        pincode: formData.pincode,
        state: formData.state,
        country: formData.country,
        membership_plan_id: selectedPlan.id,
        auto_renew: formData.auto_renew,
      };

      /* ---------------- REGISTER USER ---------------- */

      const res = await registerUser(payload);

      if (!res.status) {
        throw new Error(res.message);
      }

      const data = res.data;

      /* ---------------- SAVE PENDING CHECKOUT ---------------- */

      if (Number(data.subscription.total_amount) > 0) {
        const saved = {
          subscription_id: data.subscription.id,
          checkout_token: data.checkout_token,
          email: data.user.email ?? formData.email,
        };

        sessionStorage.setItem(
          REGISTRATION_CHECKOUT_KEY,
          JSON.stringify(saved),
        );

        setPendingCheckout(saved);
      }

      /* ---------------- HANDLE PAYMENT ---------------- */

      await handleRegistrationPayment(data, setProcessingPayment);
    } catch (error) {
      toast.error(extractErrorMessage(error, "Registration failed."));
    } finally {
      setLoading(false);
    }
  };

  return {
    plans,
    loading,
    plansLoading,
    processingPayment,
    pendingCheckout,
    resumePayment,
    submitRegistration,
  };
}
