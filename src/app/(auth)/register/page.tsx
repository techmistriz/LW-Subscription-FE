"use client";

import Link from "next/link";
import { useState, FormEvent, ChangeEvent } from "react";
import { registerUser } from "@/lib/api/auth";

const bannerImg: React.CSSProperties = {
  backgroundImage: `url(${process.env.NEXT_PUBLIC_BANNER_BASE_URL})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
};

interface FormData {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  password_confirmation: string;
  contact: string;
  plan: string;
  auto_renew: boolean;
}

const initialFormState: FormData = {
  first_name: "",
  last_name: "",
  email: "",
  password: "",
  password_confirmation: "",
  contact: "",
  plan: "",
  auto_renew: false,
};

const plans = [
  { id: "3year", value: "3 Year Plan", price: "₹1,200 / 3 Years" },
  { id: "1year", value: "1 Year Plan", price: "₹600 / Year" },
  { id: "2year", value: "2 Year Plan", price: "₹1,000 / 2 Years" },
  { id: "7days", value: " Free Plan", price: "Free / 7 days" },
];

export default function SubscribePage() {
  const [form, setForm] = useState<FormData>(initialFormState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string[] }>({});

  // Handle all input changes
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    // Phone number: only digits, max 10
    if (name === "contact") {
      const onlyDigits = value.replace(/\D/g, "");
      setForm({ ...form, [name]: onlyDigits.slice(0, 10) });
      return;
    }

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });

    // Clear field error on change
    if (fieldErrors[name]) {
      setFieldErrors({ ...fieldErrors, [name]: [] });
    }
  };

  const handlePlanChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, plan: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
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

      setSuccess("Registration successful! Please login.");
      setForm(initialFormState);
    } catch (err: unknown) {
      console.error("Registration error:", err);
      setError(err instanceof Error ? err.message : "Server error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="bg-white">
      <section className="py-12 bg-cover bg-center flex items-center" style={bannerImg}>
        <div className="max-w-6xl mx-auto w-full px-4 flex justify-between items-center">
          <h1 className="text-white text-2xl font-bold uppercase">Subscribe</h1>
          <p className="text-sm text-gray-200">
            <Link href="/" className="text-[#c9060a]">Home</Link> | Subscribe
          </p>
        </div>
      </section>

      {/*CONTENT*/}
      <section className="py-20">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-2xl font-semibold uppercase">Register Yourself</h2>
          <p className="text-[#333333] text-sm mt-3 max-w-xl mx-auto">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit
            tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.
          </p>
          <div className="w-12 h-0.75 bg-[#c9060a] mx-auto mt-4"></div>

          {/*FORM CARD */}
          <div className="mt-12 bg-white border border-gray-200 shadow-[0_0_15px_rgba(0,0,0,0.15)] p-8 max-w-2xl mx-auto text-left">
            {error && (
              <p className="text-[#c9060a] text-sm mb-4 bg-red-50 p-3 rounded">{error}</p>
            )}
            {success && (
              <p className="text-green-600 text-sm mb-4 bg-green-50 p-3 rounded">{success}</p>
            )}

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-4 mb-6">
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
                  <label className="text-sm block mb-1">Repeat Password *</label>
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

                <div className="col-span-2">
                  <label className="text-sm block mb-1">Contact * (10 digits only)</label>
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
              </div>

              {/* PLANS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {plans.map((plan) => (
                  <label
                    key={plan.id}
                    htmlFor={plan.id}
                    className={`
                      group cursor-pointer rounded-lg border p-4 transition-all duration-200
                      flex flex-col gap-3
                      hover:shadow-md
                      has-checked:border-green-600
                      has-checked:bg-red-50
                    `}
                  >
                    <input
                      id={plan.id}
                      type="radio"
                      name="plan"
                      value={plan.value}
                      checked={form.plan === plan.value}
                      onChange={handlePlanChange}
                      className="hidden"
                      disabled={loading}
                    />
                    <div className="flex flex-col items-center justify-between">
                      <span className="text-sm font-semibold text-gray-800">{plan.value}</span>
                      <span className="text-sm font-bold text-gray-900">{plan.price}</span>
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      Browse all charts · Cancel anytime · Least cost effective
                    </p>
                  </label>
                ))}
              </div>

              <label className="flex items-center gap-2 text-sm mb-6 cursor-pointer">
                <input
                  type="checkbox"
                  name="auto_renew"
                  checked={form.auto_renew}
                  onChange={handleChange}
                  className="accent-[#c9060a] w-4 h-4"
                  disabled={loading}
                />
                Automatically renew subscription
              </label>

              <h3 className="font-semibold text-sm mb-3 text-[#333333]">Payment Details</h3>
              <p className="text-sm text-[#333333] mb-8 leading-relaxed text-left">
                Before you can accept payments, you need to connect your Stripe
                Account by going to Dashboard → Paid Member Subscriptions →
                Settings → Payments →{" "}
                <Link href="/sign-in" className="text-[#c9060a] hover:underline">
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
