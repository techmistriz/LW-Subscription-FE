"use client";

import { useState, FormEvent, ChangeEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import Banner from "../../components/Common/Banner";
import { registerUser } from "@/lib/auth/auth";
import { verifyPayment } from "./services/payment";
import { getPlans } from "./services/plans";

import { useAppDispatch, useAppSelector } from "@/redux/store/hooks";
import { setUser } from "@/redux/store/slices/authSlice";
import { setSubscription } from "@/redux/store/slices/subscriptionSlice";

/* ------------------ Load Razorpay SDK ------------------ */
const loadRazorpay = () =>
  new Promise<boolean>((resolve) => {
    if ((window as any).Razorpay) return resolve(true);

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);

    document.body.appendChild(script);
  });

export default function RegisterForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { user, token } = useAppSelector((state) => state.auth);

  const subscriptionData = useAppSelector((state) => state.subscription.data);

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    contact: "",
    otp: "",
    dob: "",
    organisation_name: "",
    address: "",
    city: "",
    pincode: "",
    state: "",
    country: "India",
    password: "",
    password_confirmation: "",
    plan: "",
    auto_renew: false,
  });

  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string[] }>(
    {},
  );

  // OTP
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);

  // useEffect(() => {
  //   if (subscriptionData?.plan_id) {
  //     setForm((prev: any) => ({
  //       ...prev,
  //       plan: String(subscriptionData.plan_id),
  //     }));
  //   }
  // }, [subscriptionData]);

/* ------------------ Preselect Plan ------------------ */
useEffect(() => {
  if (!plans.length) return;

  // Priority 1: Redux
  if (subscriptionData?.plan_id) {
    setForm((prev) => ({
      ...prev,
      plan: String(subscriptionData.plan_id),
    }));
    return;
  }

  // Priority 2: SessionStorage
  const stored = sessionStorage.getItem("subscription");
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (parsed?.plan_id) {
        setForm((prev) => ({
          ...prev,
          plan: String(parsed.plan_id),
        }));
      }
    } catch {
      console.warn("Invalid subscription in sessionStorage");
    }
  }
}, [subscriptionData, plans]);


  // Auth Redirect
useEffect(() => {
  if (user && token) {
    // router.replace("/dashboard"); // or wherever
  } else {
    setCheckingAuth(false);
  }
}, [user, token, router]);

/* ------------------ Fetch Plans ------------------ */
useEffect(() => {
  const fetchPlans = async () => {
    try {
      const data = await getPlans();
      setPlans(data);
    } catch {
      toast.error("Failed to load plans");
    }
  };

  fetchPlans();
}, []);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
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

/* ------------------ OTP ------------------ */
const handleSendOtp = () => {
  if (form.contact.length !== 10) {
    return toast.error("Enter a valid 10-digit number");
  }

  setIsOtpSent(true);
  toast.success(`OTP sent to ${form.contact}`);
};

const handleVerifyOtp = () => {
  if (form.otp === "1234") {
    setIsOtpVerified(true);
    toast.success("Number verified!");
  } else {
    toast.error("Invalid OTP");
  }
};


/* ------------------ Razorpay Payment ------------------ */
const handleRazorpayPayment = async (payment: any, selectedPlan: any) => {
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

      try {
        const verifyRes = await verifyPayment({
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_order_id: response.razorpay_order_id,
          razorpay_signature: response.razorpay_signature,
        });

        if (!verifyRes?.status) throw new Error("Payment verification failed");

        const verifiedUser = verifyRes.data.user;
        const sub = verifiedUser?.active_subscription;

        dispatch(setUser({
          user: verifiedUser,
          token: verifyRes.data.token,
        }));

        if (sub) {
          dispatch(setSubscription({
            id: sub.id,
            plan_id: sub.plan?.id,
            name: sub.plan?.name,
            amount: Number(sub.plan?.price),
            status: sub.status,
            start_date: sub.start_date,
            end_date: sub.end_date,
          }));
        }

        router.replace("/thankyou");

      } catch (err) {
        toast.error("Payment verification failed");
      } finally {
        setProcessingPayment(false);
      }
    },

    prefill: {
      name: `${form.first_name} ${form.last_name}`,
      email: form.email,
      contact: form.contact,
    },

    theme: { color: "#c9060a" },
  });

  rzp.open();
};



 /* ------------------ Form Submit ------------------ */
const handleSubmit = async (e: FormEvent) => {
  e.preventDefault();

  if (!isOtpVerified) {
    return toast.error("Please verify your contact number first");
  }

  setLoading(true);
  setFieldErrors({});

  try {
    const selectedPlan = plans.find(
      (p) => String(p.id) === form.plan
    );

    if (!selectedPlan) {
      throw new Error("Please select a plan");
    }

    const res = await registerUser({
      ...form,
      membership_plan_id: selectedPlan.id,
    });

    if (!res?.status) {
      if (res?.errors) setFieldErrors(res.errors);
      throw new Error(res?.message || "Registration failed");
    }

    const { token, user: userData, payment } = res.data;

    if (!payment) {
      throw new Error("Payment data not received");
    }

    /* ---------- FREE PLAN ---------- */
    if (!payment.amount || payment.amount <= 0) {
      const sub = userData?.active_subscription;

      if (token && userData) {
        dispatch(setUser({ user: userData, token }));
      }

      dispatch(setSubscription({
        id: sub?.id,
        plan_id: sub?.plan?.id,
        name: sub?.plan?.name,
        amount: 0,
        status: sub?.status,
        start_date: sub?.start_date,
        end_date: sub?.end_date,
      }));

      toast.success("Registration Successful");

      router.replace(
  `/thankyou?name=${encodeURIComponent(selectedPlan.name)}&amount=0&status=success&email=${encodeURIComponent(form.email)}`
);

      return;
    }

    /* ---------- PAID PLAN ---------- */
    await handleRazorpayPayment(payment, selectedPlan);

  } catch (err: any) {
    toast.error(err.message);
  } finally {
    setLoading(false);
  }
};


  const getError = (name: string) => fieldErrors[name]?.[0];

  if (checkingAuth || processingPayment) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-[#c9060a] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm font-medium text-gray-600 tracking-widest uppercase">
            {processingPayment ? "Processing Payment..." : "Authenticating..."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <main className="bg-gray-50">
      <Banner title={"Subscribe"} />

      <section className="py-16 px-4 max-w-6xl m-auto">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* LEFT: FORM SECTION */}
          <div className="lg:col-span-7 bg-white p-8 border border-gray-200 shadow-sm rounded-xl">
            <h2 className="text-xl font-bold mb-6 text-gray-800 uppercase tracking-tight border-b pb-4">
              Personal Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="First Name *"
                name="first_name"
                value={form.first_name}
                onChange={handleChange}
                error={getError("first_name")}
              />
              <Input
                label="Last Name *"
                name="last_name"
                value={form.last_name}
                onChange={handleChange}
                error={getError("last_name")}
              />
              <Input
                label="Email *"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                error={getError("email")}
              />

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-gray-500 uppercase">
                  Contact Us *
                </label>
                <div className="flex gap-2">
                  <input
                    name="contact"
                    value={form.contact}
                    onChange={handleChange}
                    placeholder="10 digit mobile"
                    className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-[#c9060a] outline-none bg-gray-50"
                  />
                  {!isOtpVerified && (
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      className="bg-black text-white px-3 py-2 rounded-lg text-[10px] font-bold uppercase whitespace-nowrap"
                    >
                      {isOtpSent ? "Resend" : "Send OTP"}
                    </button>
                  )}
                </div>
                {isOtpSent && !isOtpVerified && (
                  <div className="flex gap-2 mt-2">
                    <input
                      name="otp"
                      placeholder="Code"
                      onChange={handleChange}
                      className="flex-1 border-b-2 border-[#c9060a] px-3 py-1 text-sm outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleVerifyOtp}
                      className="text-[#c9060a] text-xs font-bold uppercase underline"
                    >
                      Verify
                    </button>
                  </div>
                )}
                {isOtpVerified && (
                  <p className="text-green-600 text-[10px] font-bold uppercase mt-1">
                    ✓ Verified
                  </p>
                )}
                {getError("contact") && (
                  <p className="text-red-500 text-[10px] uppercase font-bold">
                    {getError("contact")}
                  </p>
                )}
              </div>

              <Input
                label="Date of Birth *"
                type="date"
                name="dob"
                value={form.dob}
                onChange={handleChange}
                error={getError("dob")}
              />
              <Input
                label="Organisation Name"
                name="organisation_name"
                value={form.organisation_name}
                onChange={handleChange}
              />

              <div className="md:col-span-2">
                <Input
                  label="Address *"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  error={getError("address")}
                />
              </div>

              <Input
                label="City *"
                name="city"
                value={form.city}
                onChange={handleChange}
                error={getError("city")}
              />
              <Input
                label="Pincode *"
                name="pincode"
                value={form.pincode}
                onChange={handleChange}
                error={getError("pincode")}
              />
              <Input
                label="State *"
                name="state"
                value={form.state}
                onChange={handleChange}
                error={getError("state")}
              />
              <Input
                label="Country *"
                name="country"
                value={form.country}
                onChange={handleChange}
                error={getError("country")}
              />

              <Input
                label="Password *"
                type="password"
                name="password"
                onChange={handleChange}
                error={getError("password")}
              />
              <Input
                label="Confirm Password *"
                type="password"
                name="password_confirmation"
                onChange={handleChange}
                error={getError("password_confirmation")}
              />
            </div>
          </div>

          {/* RIGHT: PLAN SELECTION */}

          <div className="lg:col-span-5">
            <div className="bg-white p-8 border border-gray-200 shadow-sm rounded-xl sticky top-10 space-y-6">
              <h2 className="text-xl font-bold text-gray-800 uppercase tracking-tight border-b pb-4">
                Selected Plan
              </h2>

              {/* Plan List */}
              <div className="space-y-3 max-h-[320px] overflow-y-auto pr-2 custom-scrollbar">
                {plans.map((plan) => (
                  <div
                    key={plan.id}
                    onClick={() =>
                      setForm((prev) => ({
                        ...prev,
                        plan: String(plan.id),
                      }))
                    }
                    className={`cursor-pointer p-4 rounded-xl border-2 transition-all ${
                      form.plan === String(plan.id)
                        ? "border-[#c9060a] bg-red-50 shadow-md"
                        : "border-gray-100 hover:border-gray-200"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-sm uppercase">
                        {plan.name}
                      </span>
                      <span className="text-sm font-black text-[#c9060a]">
                        {Number(plan.price) === 0 ? "FREE" : `₹${plan.price}`}
                      </span>
                    </div>
                    {/* <p className="text-[11px] text-gray-500 mt-1 uppercase font-bold tracking-tighter">
                      {plan.duration_value} {plan.duration_unit} Access
                    </p> */}
                  </div>
                ))}
              </div>

              {/* Order Summary Logic */}
              {form.plan && (
                <div className="bg-gray-50 p-5 rounded-xl space-y-3 border border-gray-100">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 font-medium">
                      Base Price
                    </span>
                    <span className="font-bold">
                      ₹
                      {plans.find((p) => String(p.id) === form.plan)?.price ||
                        0}
                    </span>
                  </div>

                  {/* Only show GST if price > 0 */}
                  {Number(
                    plans.find((p) => String(p.id) === form.plan)?.price,
                  ) > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 font-medium">
                        GST (18%)
                      </span>
                      <span className="font-bold text-red-600">
                        + ₹
                        {(
                          Number(
                            plans.find((p) => String(p.id) === form.plan)
                              ?.price,
                          ) * 0.18
                        ).toFixed(2)}
                      </span>
                    </div>
                  )}

                  <div className="pt-3 border-t border-gray-200 flex justify-between items-center">
                    <span className="text-xs font-black uppercase text-gray-800">
                      Total Payable
                    </span>
                    <span className="text-xl font-black text-[#c9060a]">
                      ₹
                      {(
                        Number(
                          plans.find((p) => String(p.id) === form.plan)
                            ?.price || 0,
                        ) * 1.18
                      ).toFixed(
                        Number(
                          plans.find((p) => String(p.id) === form.plan)?.price,
                        ) === 0
                          ? 0
                          : 2,
                      )}
                    </span>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <form onSubmit={handleSubmit} className="pt-2">
                <button
                  type="submit"
                  disabled={loading || !form.plan}
                  className="w-full bg-[#c9060a] text-white py-3 cursor-pointer rounded-xl font-bold uppercase tracking-widest hover:bg-black transition-all disabled:opacity-50 shadow-lg shadow-red-100"
                >
                  {loading
                    ? "Processing..."
                    : Number(
                          plans.find((p) => String(p.id) === form.plan)?.price,
                        ) === 0
                      ? "Register Now"
                      : "Pay Now"}
                </button>

                {!isOtpVerified && (
                  <p className="text-center text-[10px] text-gray-400 mt-3 italic font-bold uppercase tracking-tighter">
                    Please verify your contact number to proceed
                  </p>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function Input({ label, error, type = "text", ...props }: any) {
  return (
    <div className="space-y-1">
      <label className="text-[11px] font-bold text-gray-500 uppercase ml-1">
        {label}
      </label>
      <input
        type={type}
        {...props}
        className={`w-full border ${error ? "border-red-500" : "border-gray-200"} bg-gray-50 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-[#c9060a] outline-none transition-all`}
      />
      {error && (
        <p className="text-red-500 text-[10px] font-bold mt-1 uppercase">
          {error}
        </p>
      )}
    </div>
  );
}
