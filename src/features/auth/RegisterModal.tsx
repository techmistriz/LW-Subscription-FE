"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { loginUser as loginApi, registerUser } from "@/lib/auth/auth";
import { getMembershipPlan } from "@/features/auth/services/plans";

import { useAppDispatch } from "@/redux/store/hooks";
import { loginUser, setUser } from "@/redux/store/slices/authSlice";
import { setSubscription } from "@/redux/store/slices/subscriptionSlice";

const RegisterModal = ({ onClose }: { onClose: () => void }) => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [loading, setLoading] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [planId, setPlanId] = useState<number>(1);

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    contact: "",
    address: "",
    password: "",
    password_confirmation: "",
  });

  // FETCH PLAN
  useEffect(() => {
    let mounted = true;

    const fetchPlan = async () => {
      try {
        const res = await getMembershipPlan(1);
        if (mounted) setPlanId(res?.data?.id || 1);
      } catch {
        if (mounted) setPlanId(1);
      }
    };

    fetchPlan();
    return () => {
      mounted = false;
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);

  try {
    // REGISTER (ALREADY RETURNS TOKEN + USER)
    const registerRes = await registerUser({
      ...form,
      membership_plan_id: planId,
    });

    if (!registerRes?.status) {
      throw new Error(registerRes?.message || "Registration failed");
    }

    const token =
      registerRes?.data?.token ||
      registerRes?.token;

    const userData =
      registerRes?.data?.user ||
      registerRes?.user;

    if (!token || !userData) {
      throw new Error("Invalid register response");
    }

    // SHOW PROCESSING
    setProcessingPayment(true);

    // SET USER (NOT loginUser thunk)
    dispatch(
      setUser({
        user: userData,
        token,
      })
    );

    // SUBSCRIPTION
    const sub = userData?.active_subscription;

    if (sub) {
      dispatch(
        setSubscription({
          id: sub?.id,
          plan_id: sub?.plan?.id,
          name: sub?.plan?.name,
          amount: Number(sub?.plan?.price),
          status: sub?.status,
          start_date: sub?.start_date,
          end_date: sub?.end_date,
          duration_value: sub?.plan?.duration_value,
          duration_unit: sub?.plan?.duration_unit,
          purchase_type: sub?.purchase_type,
        })
      );
    }

    const planName = sub?.plan?.name || "Basic Plan";
    const amount = sub?.plan?.price || 0;

    setTimeout(() => {
      setProcessingPayment(false);
      onClose?.();

      router.replace(
        `/thankyou?name=${encodeURIComponent(
          planName
        )}&amount=${amount}&status=success`
      );
    }, 800);
  } catch (error: any) {
    console.error("ERROR:", error.message);
    setProcessingPayment(false);
  } finally {
    setLoading(false);
  }
};

  // LOADING SCREEN
  if (processingPayment) {
    return (
      <div className="fixed inset-0 z-[9999] bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-lg font-semibold">Processing...</h2>
          <p className="text-sm text-gray-500">Please wait</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-9999 bg-black/50 flex items-center justify-center">
      <div className="bg-white w-full max-w-lg p-6 rounded shadow-lg relative">
         <button
    onClick={onClose}
    className="absolute top-3 right-3 w-8 h-8 cursor-pointer flex items-center justify-center text-gray-500 hover:text-[#c6090a] hover:bg-gray-100 rounded-full text-xl"
    aria-label="Close modal"
  >
    ×
  </button>
        <h2 className="text-xl font-semibold text-center mb-2">
          Register to Continue
        </h2>

        <p className="text-center text-gray-500 mb-4 text-sm">
          Fill your details to register
        </p>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-3"
        >
          <input name="first_name" placeholder="First Name" onChange={handleChange} className="border p-2 rounded" required />
          <input name="last_name" placeholder="Last Name" onChange={handleChange} className="border p-2 rounded" required />
          <input name="email" type="email" placeholder="Email" onChange={handleChange} className="border p-2 rounded" required />
          <input name="contact" type="tel" placeholder="Phone Number" onChange={handleChange} className="border p-2 rounded" required />
          <input name="password" type="password" placeholder="Password" onChange={handleChange} className="border p-2 rounded" required />
          <input name="password_confirmation" type="password" placeholder="Confirm Password" onChange={handleChange} className="border p-2 rounded" required />

          <input
            name="address"
            type="text"
            placeholder="Enter your address.."
            onChange={handleChange}
            className="border p-2 rounded md:col-span-2"
            required
          />

          <button
            disabled={loading}
            className="bg-[#c9060a] text-white py-2 mt-2 md:col-span-2 disabled:opacity-60 cursor-pointer"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <div className="text-center mt-4 text-sm">
          Already have an account?{" "}
          <button
            onClick={() => router.push("/sign-in")}
            className="underline font-medium hover:text-[#c6090a] cursor-pointer"
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegisterModal;