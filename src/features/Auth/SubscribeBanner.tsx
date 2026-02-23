"use client";

import { useState, ChangeEvent, FormEvent, useEffect } from "react";
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

function SubscribeBanner() {
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
    if (!alert) return;
    const timer = setTimeout(() => setAlert(null), 3000);
    return () => clearTimeout(timer);
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
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Remove error while typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
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

  const InputField = ({
    name,
    type,
    placeholder,
    maxLength,
  }: {
    name: keyof FormData;
    type: string;
    placeholder: string;
    maxLength?: number;
  }) => (
    <div className="flex flex-col w-full lg:w-80">
      <input
        className="border p-3 bg-white text-black disabled:opacity-50"
        placeholder={placeholder}
        type={type}
        name={name}
        value={form[name]}
        onChange={handleChange}
        maxLength={maxLength}
        disabled={loading}
      />
      {errors[name] && (
        <span className="text-red-500 text-sm mt-1">{errors[name]}</span>
      )}
    </div>
  );

  return (
    <section className="mt-10 bg-[#333333] py-12 mx-auto px-4">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="font-bold text-white text-2xl">SUBSCRIBE US</h2>
        <div className="w-15 h-1 bg-[#c9060a] mx-auto mt-1"></div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="mt-6 flex flex-col mx-auto gap-4 lg:flex-row">
            <InputField name="name" type="text" placeholder="Enter Your Name" />

            <InputField
              name="email"
              type="email"
              placeholder="Enter Your Email Address"
            />

            <InputField
              name="contact"
              type="tel"
              placeholder="Enter Your Mobile No."
              maxLength={10}
            />
          </div>

          <div className="flex justify-center mt-6">
            <button
              className="bg-[#c9060a] text-white px-15 py-2.5 hover:bg-[#222] disabled:opacity-50 cursor-pointer border border-white"
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

export default SubscribeBanner;
