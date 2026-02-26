"use client";

import { useState } from "react";
import { forgotPassword } from "@/lib/auth/auth";
import Banner from "../../components/Common/Banner";


export default function PasswordResetForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await forgotPassword(email.trim());
      setSuccess(res.message || "Password reset link sent to your email");
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="bg-white">
      <Banner title={"Password Reset"} />

      <section className="py-10">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-2xl font-semibold uppercase">
            Reset Your Password
          </h2>
          <p className="text-[#333333] text-sm mt-3 max-w-xl mx-auto">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit
            tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.
          </p>
          <div className="w-12 h-0.75 bg-[#c9060a] mx-auto mt-4"></div>

          <div className="mt-12 bg-white border shadow-[0_0_15px_rgba(0,0,0,0.15)] p-8 max-w-105 mx-auto text-left">
            <p className="text-sm text-[#333333] mb-4 leading-relaxed">
              Please enter your username or email address. You will receive a
              link to create a new password via email.
            </p>

            {error && <p className="text-[#c9060a] text-sm mb-3">{error}</p>}
            {success && (
              <p className="text-green-600 text-sm mb-3">{success}</p>
            )}

            <form onSubmit={handleSubmit} action="">
              <label className="text-sm font-medium block mb-2">
                Username or Email
              </label>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="w-full border bg-gray-50 px-3 py-2 mb-6"
              />
              <button
                disabled={loading}
                className="bg-[#c9060a] text-white px-6 py-2 text-sm w-full"
              >
                {loading ? "Sending..." : "Reset Password"}
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
