"use client";

import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { subscribeUser } from "@/lib/api/subscribe";

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

function BannerForm() {
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

  // Auto hide alert after 3 seconds
  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => {
        setAlert(null);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [alert]);

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

    if (!form.contact.trim()) {
      newErrors.contact = "Please fill out this field.";
    } else if (form.contact.length !== 10) {
      newErrors.contact = "Mobile number must be 10 digits.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });

    // remove error while typing
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);

    try {
      await subscribeUser(form);

      setAlert({
        type: "success",
        message: "Subscribed successfully!",
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
        <div className="w-10 h-1 bg-[#c9060a] mx-auto mt-2"></div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="mt-6 flex flex-col gap-4 lg:flex-row">

            {/* Name */}
            <div className="flex flex-col w-full lg:w-80">
              <input
                className="border p-3 bg-white text-black disabled:opacity-50"
                placeholder="Enter Your Name"
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                disabled={loading}
              />
              {errors.name && (
                <span className="text-red-500 text-sm mt-1">
                  {errors.name}
                </span>
              )}
            </div>

            {/* Email */}
            <div className="flex flex-col w-full lg:w-80">
              <input
                className="border p-3 bg-white text-black disabled:opacity-50"
                placeholder="Enter Your Email Address"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                disabled={loading}
              />
              {errors.email && (
                <span className="text-red-500 text-sm mt-1">
                  {errors.email}
                </span>
              )}
            </div>

            {/* Contact */}
            <div className="flex flex-col w-full lg:w-80">
              <input
                className="border p-3 bg-white text-black disabled:opacity-50"
                placeholder="Enter Your Mobile No."
                type="tel"
                name="contact"
                value={form.contact}
                maxLength={10}
                onChange={handleChange}
                disabled={loading}
              />
              {errors.contact && (
                <span className="text-red-500 text-sm mt-1">
                  {errors.contact}
                </span>
              )}
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-center mt-6">
            <button
              className="bg-[#c9060a] text-white px-10 py-3 hover:bg-[#222] disabled:opacity-50"
              type="submit"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>

          {/* Alert Box */}
          {alert && (
            <div
              className={`mt-6 border px-4 py-3 text-sm ${
                alert.type === "success"
                  ? "border-green-500 text-green-400"
                  : "border-yellow-500 text-yellow-400"
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

export default BannerForm;
