"use client";

import Link from "next/link";
import { useState, FormEvent, ChangeEvent } from "react";
import { registerUser } from "@/lib/auth/auth";
import Banner from "../../components/Common/Banner";
import { FormData } from "@/types";
<<<<<<< HEAD
import { verifyPayment } from "./services/payment";
import { getPlans } from "./services/plans";
import { useRouter } from "next/navigation";

import { useAppDispatch } from "@/redux/store/hooks";
import { setUser } from "@/redux/store/slices/authSlice";
import { setSubscription } from "@/redux/store/slices/subscriptionSlice";
=======
>>>>>>> parent of 3d83ac5 (major changes)

const initialFormState: FormData = {
  first_name: "",
  last_name: "",
  email: "",
  contact: "",
  password: "",
  password_confirmation: "",
  address: "",
  plan: "",
  auto_renew: false,
};

const plans = [
  { id: "7days", value: " Free Plan", price: "Free / 7 days" },
  { id: "1year", value: "1 Year Plan", price: "₹600 / Year" },
  { id: "2year", value: "2 Year Plan", price: "₹1,000 / 2 Years" },
  { id: "3year", value: "3 Year Plan", price: "₹1,200 / 3 Years" },
];

export default function RegisterForm() {
<<<<<<< HEAD
  const router = useRouter();
  const dispatch = useAppDispatch();

=======
>>>>>>> parent of 3d83ac5 (major changes)
  const [form, setForm] = useState<FormData>(initialFormState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string[] }>({});

<<<<<<< HEAD
  // Fetch plans
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const data = await getPlans();
        setPlans(data);
      } catch (err: any) {
        setError(err.message);
      }
    };
    fetchPlans();
  }, []);

  // Input handler
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
=======
  // Handle all input changes
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const target = e.target as HTMLInputElement;
>>>>>>> parent of 3d83ac5 (major changes)

    const { name, value, type } = target;
    const checked = (target as HTMLInputElement).checked;

    // Phone number: only digits, max 10
    if (name === "contact") {
      const onlyDigits = value.replace(/\D/g, "");
      setForm({ ...form, [name]: onlyDigits.slice(0, 10) });
      return;
    }

<<<<<<< HEAD
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
=======
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
>>>>>>> parent of 3d83ac5 (major changes)

    if (fieldErrors[name]) {
      setFieldErrors({ ...fieldErrors, [name]: [] });
    }
  };

  const handlePlanChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, plan: e.target.value });
  };

<<<<<<< HEAD
  // Submit handler
  const handleSubmit = async (e: FormEvent) => {
=======
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
>>>>>>> parent of 3d83ac5 (major changes)
    e.preventDefault();
    console.log(form)

    // Reset state
    setError("");
    setSuccess("");
    setFieldErrors({});
    setLoading(true);

    // Client-side validation
    if (form.password !== form.password_confirmation) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (!form.contact || form.contact.length !== 10) {
      setFieldErrors({ contact: ["Contact must be exactly 10 digits"] });
      setLoading(false);
      return;
    }

    try {
      const result = await registerUser(form);

      if (result?.status !== true) {
        throw new Error(result?.message || "Registration failed");
      }

<<<<<<< HEAD
      const res = await registerUser({
        first_name: form.first_name,
        last_name: form.last_name,
        email: form.email,
        contact: form.contact,
        password: form.password,
        password_confirmation: form.password_confirmation,
        address: form.address,
        membership_plan_id: selectedPlan.id,
      });

      if (!res?.status) {
        setError(res?.message || "Registration failed");
        if (res?.errors) setFieldErrors(res.errors);
        return;
      }

      const token = res?.data?.token;
      const userData = res?.data?.user;
      const payment = res?.data?.payment;

      if (!payment) {
        setError("Payment data not received");
        return;
      }

      // ================= FREE PLAN =================
      if (!payment.amount || payment.amount <= 0) {
        const sub = res?.data?.user?.active_subscription;

        if (token && userData) {
          dispatch(setUser({ user: userData, token }));
        }

        dispatch(
          setSubscription({
            id: sub?.id,
            plan_id: sub?.plan?.id,
            name: sub?.plan?.name,
            amount: 0,
            status: sub?.status,
            start_date: sub?.start_date,
            end_date: sub?.end_date,
          })
        );

        router.replace(
          `/thankyou?name=${encodeURIComponent(
            selectedPlan.name
          )}&amount=0&status=success`
        );

        return;
      }

      // ================= PAID PLAN =================
      if (!payment.razorpay_key || !payment.order_id) {
        setError("Invalid payment configuration");
        return;
      }

      const isLoaded = await loadRazorpay();
      if (!isLoaded) {
        setError("Failed to load Razorpay SDK");
        return;
      }

      const options = {
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

            if (!verifyRes?.status) {
              setError(verifyRes?.message || "Payment verification failed");
              setProcessingPayment(false);
              return;
            }

            const verifiedUser = verifyRes?.data?.user;
            const token = verifyRes?.data?.token;

            if (token && verifiedUser) {
              dispatch(setUser({ user: verifiedUser, token }));
            }

            const sub = verifiedUser?.active_subscription;

            if (sub) {
              dispatch(
                setSubscription({
                  id: sub.id,
                  plan_id: sub.plan?.id,
                  name: sub.plan?.name,
                  amount: Number(sub.plan?.price),
                  status: sub.status,
                  start_date: sub.start_date,
                  end_date: sub.end_date,
                  duration_value: sub.plan?.duration_value,
                  duration_unit: sub.plan?.duration_unit,
                  purchase_type: sub.purchase_type,
                })
              );
            }

            router.replace(
              `/thankyou?name=${encodeURIComponent(
                selectedPlan.name
              )}&amount=${payment.amount}&status=success`
            );
          } catch (err: any) {
            setError(err.message || "Verification failed");
            setProcessingPayment(false);
          }
        },

        prefill: {
          name: `${form.first_name} ${form.last_name}`,
          email: form.email,
          contact: form.contact,
        },

        theme: { color: "#c9060a" },
      };

      const rzp = new (window as any).Razorpay(options);

      rzp.on("payment.failed", (response: any) => {
        setError(response?.error?.description || "Payment failed");
      });

      rzp.open();
    } catch (err: any) {
      setError(err.message || "Something went wrong");
=======
      setSuccess("Registration successful! Please login.");
      setForm(initialFormState);
    } catch (err: unknown) {
      console.error("Registration error:", err);
      setError(err instanceof Error ? err.message : "Server error occurred");
>>>>>>> parent of 3d83ac5 (major changes)
    } finally {
      setLoading(false);
    }
  };

<<<<<<< HEAD
  const getError = (name: keyof typeof fieldErrors) => fieldErrors[name]?.[0];

  // Payment loader
  if (processingPayment) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-lg font-semibold">Processing payment...</h2>
          <p className="text-sm text-gray-500">Please wait</p>
        </div>
      </div>
    );
  }

=======
>>>>>>> parent of 3d83ac5 (major changes)
  return (
    <main className="bg-white">
      <Banner title={"subscribe"} />

      {/*CONTENT*/}
      <section className="py-20">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-2xl font-semibold uppercase">
            Register Yourself
          </h2>
          <p className="text-[#333333] text-sm mt-3 max-w-xl mx-auto">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit
            tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.
          </p>
          <div className="w-12 h-0.75 bg-[#c9060a] mx-auto mt-4"></div>

          {/*FORM CARD */}
          <div className="mt-12 bg-white border border-gray-200 shadow-[0_0_15px_rgba(0,0,0,0.15)] p-8 max-w-2xl mx-auto text-left">
            {error && (
              <p className="text-[#c9060a] text-sm mb-4 bg-red-50 p-3 rounded">
                {error}
              </p>
            )}
            {success && (
              <p className="text-green-600 text-sm mb-4 bg-green-50 p-3 rounded">
                {success}
              </p>
            )}
            <h1 className="font-semibold mb-5">PERSONAL DETAILS</h1>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="text-sm block mb-1">First Name *</label>
                  <input
                    type="text"
                    name="first_name"
                    value={form.first_name}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    className={`w-full border px-3 py-2 mt-1 rounded focus:outline-none focus:ring-2 focus:ring-[#c9060a] ${
                      fieldErrors.first_name
                        ? "border-[#c9060a] bg-red-50"
                        : "border-gray-200 bg-gray-50"
                    }`}
                  />
                </div>
                <div>
                  <label className="text-sm block mb-1">Last Name *</label>
                  <input
                    type="text"
                    name="last_name"
                    value={form.last_name}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    className={`w-full border px-3 py-2 mt-1 rounded focus:outline-none focus:ring-2 focus:ring-[#c9060a] ${
                      fieldErrors.last_name
                        ? "border-[#c9060a] bg-red-50"
                        : "border-gray-200 bg-gray-50"
                    }`}
                  />
                </div>
                <div>
                  <label className="text-sm block mb-1">E-mail *</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    className={`w-full border px-3 py-2 mt-1 rounded focus:outline-none focus:ring-2 focus:ring-[#c9060a] ${
                      fieldErrors.email
                        ? "border-[#c9060a] bg-red-50"
                        : "border-gray-200 bg-gray-50"
                    }`}
                  />
                </div>
                <div>
                  <label className="text-sm block mb-1">Contact *</label>
                  <input
                    type="tel"
                    name="contact"
                    placeholder="9876543210"
                    value={form.contact}
                    maxLength={10}
                    required
                    disabled={loading}
                    className={`w-full border px-3 py-2 mt-1 rounded focus:outline-none focus:ring-2 focus:ring-[#c9060a] ${
                      fieldErrors.contact
                        ? "border-[#c9060a] bg-red-50"
                        : "border-gray-200 bg-gray-50"
                    }`}
                    onChange={handleChange}
                  />
                  {fieldErrors.contact && (
                    <span className="text-[#c9060a] text-xs mt-1 block">
                      {fieldErrors.contact[0]}
                    </span>
                  )}
                </div>
                <div>
                  <label className="text-sm block mb-1">Password *</label>
                  <input
                    required
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    autoComplete="new-password"
                    disabled={loading}
                    className={`w-full border px-3 py-2 mt-1 rounded focus:outline-none focus:ring-2 focus:ring-[#c9060a] ${
                      fieldErrors.password
                        ? "border-[#c9060a] bg-red-50"
                        : "border-gray-200 bg-gray-50"
                    }`}
                  />
                </div>
                <div>
                  <label className="text-sm block mb-1">
                    Confirm Password *
                  </label>
                  <input
                    required
                    type="password"
                    name="password_confirmation"
                    value={form.password_confirmation}
                    onChange={handleChange}
                    autoComplete="new-password"
                    disabled={loading}
                    className={`w-full border px-3 py-2 mt-1 rounded focus:outline-none focus:ring-2 focus:ring-[#c9060a] ${
                      fieldErrors.password_confirmation
                        ? "border-[#c9060a] bg-red-50"
                        : "border-gray-200 bg-gray-50"
                    }`}
                  />
                </div>
                <h1 className="font-semibold ">ADDRESS</h1> <br />
                <div className="col-span-2">
                  {/* <label className="text-sm block mb-1">
                    Confirm Password *
                  </label> */}
                  <textarea
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    disabled={loading}
                    rows={4}
                    className={`w-full border px-3 py-2 mt-1 rounded focus:outline-none focus:ring-2 focus:ring-[#c9060a] ${
                      fieldErrors.address
                        ? "border-[#c9060a] bg-red-50"
                        : "border-gray-200 bg-gray-50"
                    }`}
                  />
                </div>
              </div>
              {/* PLANS */}
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {plans.map((plan) => {
                  const isSelected = form.plan === plan.value;

                  return (
                    <label
                      key={plan.id}
                      htmlFor={plan.id}
                      className={`
          group cursor-pointer rounded-lg border border-gray-300 p-4 transition-all duration-200
          flex flex-col gap-3 hover:shadow-md
          ${isSelected ? "bg-[#c9060a] text-white border-[#c9060a]" : "bg-white"}
        `}
                    >
                      <input
                        id={plan.id}
                        type="radio"
                        name="plan"
                        value={plan.value}
                        checked={isSelected}
                        onChange={handlePlanChange}
                        className="hidden"
                        disabled={loading}
                      />

                      <div className="flex flex-col items-center justify-between">
                        <span
                          className={`text-sm font-semibold ${
                            isSelected ? "text-white" : "text-gray-800"
                          }`}
                        >
                          {plan.value}
                        </span>

                        <span
                          className={`text-sm font-bold ${
                            isSelected ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {plan.price}
                        </span>
                      </div>

                      <p
                        className={`text-xs leading-relaxed ${
                          isSelected ? "text-white/90" : "text-gray-600"
                        }`}
                      >
                        · Browse all charts <br />· Cancel anytime <br />· Least
                        cost effective
                      </p>
                    </label>
                  );
                })}
              </div>

              <label className="flex items-center gap-2 text-sm mb-6 cursor-pointer">
                <input
                  type="checkbox"
                  name="auto_renew"
                  checked={form.auto_renew}
                  onChange={(e) =>
                    setForm({ ...form, auto_renew: e.target.checked })
                  }
                  className="accent-[#c9060a] w-4 h-4"
                  disabled={loading}
                />
                Automatically renew subscription
              </label>

              <h3 className="font-semibold text-sm mb-3 text-[#333333]">
                Payment Details
              </h3>
              <p className="text-sm text-[#333333] mb-8 leading-relaxed text-left">
                Before you can accept payments, you need to connect your Stripe
                Account by going to Dashboard → Paid Member Subscriptions →
                Settings → Payments →{" "}
                <Link
                  href="/sign-in"
                  className="text-[#c9060a] hover:underline"
                >
                  Gateways
                </Link>
                .
              </p>

              <button
                type="submit"
                disabled={loading}
                className="bg-[#c9060a] text-white px-8 py-3 text-sm font-medium cursor-pointer transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed w-full lg:w-auto"
              >
                {loading ? "Registering..." : "Register"}
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
