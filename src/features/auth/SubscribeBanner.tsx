"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { subscribeUser } from "@/lib/auth/subscribe";

interface FormData {
  name: string;
  email: string;
  contact: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  contact?: string;
}

/* ✅ Moved OUTSIDE to prevent re-render focus issue */
const InputField = ({
  name,
  type,
  placeholder,
  value,
  onChange,
  error,
  maxLength,
  disabled,
}: {
  name: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  maxLength?: number;
  disabled?: boolean;
}) => (
  <div className="flex flex-col w-full lg:w-80">
    <input
      className="border p-3 bg-white text-black disabled:opacity-50"
      name={name}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      maxLength={maxLength}
      disabled={disabled}
    />
    {error && <span className="text-[#c9060a] text-sm mt-1">{error}</span>}
  </div>
);

export default function SubscribeBanner() {
  const [form, setForm] = useState<FormData>({
    name: "",
    email: "",
    contact: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  /* ✅ auto-hide alert */
  useEffect(() => {
    if (!alert) return;
    const timer = setTimeout(() => setAlert(null), 3000);
    return () => clearTimeout(timer);
  }, [alert]);

  /* ✅ validation */
  const validate = () => {
    const newErrors: FormErrors = {};

    if (!form.name.trim()) {
      newErrors.name = "Please fill out this field.";
    }

    if (!form.email.trim()) {
      newErrors.email = "Please fill out this field.";
    } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      newErrors.email = "Please enter a valid email.";
    }

    if (!/^[0-9]{10}$/.test(form.contact)) {
      newErrors.contact = "Mobile number must be 10 digits.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* ✅ input handler */
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  /* ✅ submit handler */
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);

    try {
      const res = await subscribeUser(form);

      setAlert({
        type: "success",
        message: res?.message || "Subscribed successfully!",
      });

      setForm({ name: "", email: "", contact: "" });
    } catch (err: any) {
      setAlert({
        type: "error",
        message: err?.message || "Something went wrong.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mt-10 bg-[#333333] py-12 px-4">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="font-bold text-white text-2xl">SUBSCRIBE US</h2>
        <div className="w-15 h-1 bg-[#c9060a] mx-auto mt-1"></div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="mt-6 flex flex-col gap-4 lg:flex-row justify-center">
            <InputField
              name="name"
              type="text"
              placeholder="Enter Your Name"
              value={form.name}
              onChange={handleChange}
              error={errors.name}
              disabled={loading}
            />

            <InputField
              name="email"
              type="email"
              placeholder="Enter Your Email Address"
              value={form.email}
              onChange={handleChange}
              error={errors.email}
              disabled={loading}
            />

            <InputField
              name="contact"
              type="tel"
              placeholder="Enter Your Mobile No."
              value={form.contact}
              onChange={handleChange}
              error={errors.contact}
              maxLength={10}
              disabled={loading}
            />
          </div>

          <div className="flex justify-center mt-6">
            <button
              className="bg-[#c9060a] text-white px-15 py-2.5 hover:bg-[#333] cursor-pointer disabled:opacity-50 border border-white"
              type="submit"
              disabled={loading}
            >
              {loading ? "SUBMITTING..." : "SUBMIT"}
            </button>
          </div>

          {alert && (
            <div
              className={`mt-6 border w-1/2 mx-auto px-4 py-2 text-sm ${
                alert.type === "success"
                  ? "border-green-500 text-green-400"
                  : "border-red-500 text-gray-400"
              }`}
            >
              {alert.message}
            </div>
          )}
        </form>
      </div>
    </section>
  );
}
