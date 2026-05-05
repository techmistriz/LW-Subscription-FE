"use client";

import { useEffect, useState } from "react";
import Banner from "../../components/Common/Banner";
import { toast } from "sonner";

import { useAppDispatch, useAppSelector } from "@/redux/store/hooks";
import { forgotPasswordAction } from "@/redux/thunks/authThunk";
import { clearResetState } from "@/redux/store/slices/resetSlice";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");

  const dispatch = useAppDispatch();
  const { loading, error, success } = useAppSelector((state) => state.reset);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email.trim()) {
      return toast.error("Email is required");
    }

    dispatch(forgotPasswordAction(email.trim()));
  };

  useEffect(() => {
    if (success) {
      toast.success(success);
      setEmail(""); // clear input after success

      // optional: reset redux state after 3 sec
      setTimeout(() => {
        dispatch(clearResetState());
      }, 3000);
    }

    if (error) {
      toast.error(error);

      setTimeout(() => {
        dispatch(clearResetState());
      }, 3000);
    }
  }, [success, error, dispatch]);

  return (
    <main className="bg-white">
      <Banner title={"Forgot Password"} />

      <section className="py-10">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-2xl font-semibold uppercase">
            Forgot Your Password?
          </h2>

          <p className="text-[#333333] text-sm mt-3 max-w-xl mx-auto">
            Enter your email and we’ll send you a link to reset your password.
          </p>

          <div className="w-12 h-[2px] bg-[#c9060a] mx-auto mt-4"></div>

          <div className="mt-12 bg-white border shadow-md p-8 max-w-md mx-auto text-left">
            <form onSubmit={handleSubmit}>
              <label className="text-sm font-medium block mb-2">
                Email Address
              </label>

              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                placeholder="Enter your email"
                className="w-full border bg-gray-50 px-3 py-2 mb-6 outline-none focus:ring-1 focus:ring-[#c9060a]"
              />

              <button
                disabled={loading}
                className="bg-[#c9060a] text-white px-6 py-2 text-sm w-full disabled:opacity-50"
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
            </form>

            {/* UX feedback */}
            {success && (
              <p className="text-green-600 text-xs mt-4 text-center">
                Check your email for reset link
              </p>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}