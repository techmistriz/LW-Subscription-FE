"use client";

import { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { toast } from "sonner";

import { subscribeUser } from "@/services/subscribe.service";
import type { SubscribePayload } from "@/services/subscribe.service";

/* ----------------- Input Field ----------------- */

const InputField = ({
  type,
  placeholder,
  registration,
  error,
  maxLength,
  disabled,
}: {
  name: string;
  type: string;
  placeholder: string;
  registration: ReturnType<
    typeof useForm<SubscribePayload>
  >["register"] extends (name: infer _T, options?: infer _O) => infer R
    ? R
    : never;
  error?: string;
  maxLength?: number;
  disabled?: boolean;
}) => (
  <div className="flex flex-col w-full lg:w-80">
    <input
      className="border p-3 bg-white text-black disabled:opacity-50"
      type={type}
      placeholder={placeholder}
      {...registration}
      maxLength={maxLength}
      disabled={disabled}
    />

    {error && (
      <span className="text-[#c8050b] text-sm mt-1 text-left lg:text-center">
        {error}
      </span>
    )}
  </div>
);

/* ----------------- Component ----------------- */

export default function SubscribeBanner() {
  const [loading, setLoading] = useState(false);

  const [alert, setAlert] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SubscribePayload>({
    defaultValues: {
      name: "",
      email: "",
      contact: "",
    },
    mode: "onSubmit",
  });

  /* ----------------- Auto-hide alert ----------------- */

  useEffect(() => {
    if (!alert) return;

    const timer = setTimeout(() => {
      setAlert(null);
    }, 3000);

    return () => clearTimeout(timer);
  }, [alert]);

  /* ----------------- Submit Handler ----------------- */

  const onSubmit: SubmitHandler<SubscribePayload> = async (data) => {
    setLoading(true);

    try {
      const res = await subscribeUser(data);

      setAlert({
        type: "success",
        message: res?.message || "Subscribed successfully!",
      });

      reset();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Subscription failed";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mt-10 bg-[#333333] py-12 px-4">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="font-semibold text-white text-2xl uppercase tracking-wide">
          Signup for Lex Witness Newsletter
        </h2>

        <div className="w-15 h-1 bg-[#c8050b] mx-auto mt-1"></div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="mt-6 flex flex-col gap-4 lg:flex-row justify-center">
            {/* Name */}
            <InputField
              name="name"
              type="text"
              placeholder="Enter Your Name"
              registration={register("name", {
                required: "Name is required.",
              })}
              error={errors.name?.message}
              disabled={loading}
            />

            {/* Email */}
            <InputField
              name="email"
              type="email"
              placeholder="Enter Your Email Address"
              registration={register("email", {
                required: "Email is required.",
                pattern: {
                  value: /^\S+@\S+\.\S+$/,
                  message: "Please enter a valid email.",
                },
              })}
              error={errors.email?.message}
              disabled={loading}
            />

            {/* Contact */}
            <InputField
              name="contact"
              type="tel"
              placeholder="Enter Your Mobile No."
              registration={register("contact", {
                required: "Mobile number is required.",
                pattern: {
                  value: /^[0-9]{10}$/,
                  message: "Mobile number must be 10 digits.",
                },
              })}
              error={errors.contact?.message}
              maxLength={10}
              disabled={loading}
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-center mt-6">
            <button
              className="bg-[#c8050b] text-white px-15 py-2.5 hover:bg-[#333] cursor-pointer disabled:opacity-50 border border-white"
              type="submit"
              disabled={loading}
            >
              {loading ? "SUBMITTING..." : "SUBMIT"}
            </button>
          </div>

          {/* Alert */}
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
