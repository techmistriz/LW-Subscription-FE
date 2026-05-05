"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/store/hooks";
import { toast } from "sonner";
import { resetPasswordAction } from "@/redux/thunks/authThunk";
import Banner from "@/components/Common/Banner";

export default function ResetPasswordPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const params = useSearchParams();

  const { loading, error, success } = useAppSelector((state) => state.reset);

  const email = params.get("email") || "";
  const token = params.get("token") || "";

  const [form, setForm] = useState({
    password: "",
    password_confirmation: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    dispatch(
      resetPasswordAction({
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
      router.push("/login"); // redirect after success
    }

    if (error) {
      toast.error(error);
    }
  }, [success, error]);

  return (
    <main>
      <Banner title={"Reset Password"} />
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="bg-white -mt-50 p-8 rounded-xl shadow-md w-full max-w-md">
          <h2 className="text-xl font-bold mb-6 text-center">Reset Password</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="password"
              placeholder="New Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full border p-2 rounded"
              required
            />

            <input
              type="password"
              placeholder="Confirm Password"
              value={form.password_confirmation}
              onChange={(e) =>
                setForm({
                  ...form,
                  password_confirmation: e.target.value,
                })
              }
              className="w-full border p-2 rounded"
              required
            />

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
