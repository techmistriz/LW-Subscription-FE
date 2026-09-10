"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { toast } from "sonner";
import {
  resetPassword,
  clearPasswordResetState,
} from "@/store/slices/authSlice";
import { Eye, EyeOff } from "lucide-react";
import Banner from "@/components/common/Banner";
import { routes } from "@/config/routes";

export default function ResetPasswordPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const params = useSearchParams();

  const { loading, error, success } = useAppSelector(
    (state) => state.auth.passwordReset,
  );

  const email = params.get("email") || "";
  const token = params.get("token") || "";

  const [form, setForm] = useState({
    password: "",
    password_confirmation: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (form.password !== form.password_confirmation) {
      toast.error("Passwords do not match");
      return;
    }

    dispatch(
      resetPassword({
        email,
        token,
        password: form.password,
        password_confirmation: form.password_confirmation,
      }),
    );
  };

  useEffect(() => {
    if (success) {
      toast.success(success);
      dispatch(clearPasswordResetState());
      router.push(routes.signIn);
      return;
    }

    if (error) {
      toast.error(error);
      dispatch(clearPasswordResetState());
    }
  }, [success, error, dispatch, router]);

  return (
    <main>
      <Banner title={"Reset Password"} />
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="bg-white -mt-50 p-8 rounded-xl shadow-md w-full max-w-md">
          <h2 className="text-xl font-bold mb-6 text-center">Reset Password</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="New Password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full border p-2 pr-10 rounded"
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                value={form.password_confirmation}
                onChange={(e) =>
                  setForm({
                    ...form,
                    password_confirmation: e.target.value,
                  })
                }
                className="w-full border p-2 pr-10 rounded"
                required
              />

              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <button
              disabled={loading}
              className="w-full bg-[#c9060a] cursor-pointer text-white py-2 rounded"
            >
              {loading ? "Updating..." : "Reset Password"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
