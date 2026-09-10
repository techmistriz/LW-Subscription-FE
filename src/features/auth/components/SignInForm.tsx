"use client";

import Link from "next/link";
import { useState, type ChangeEvent, type FormEvent } from "react";
import Banner from "@/components/common/Banner";
import { useRouter } from "next/navigation";

/* ----------------- REDUX ----------------- */
import { useAppDispatch } from "@/store/hooks";
import {
  loginUser as loginRedux,
  fetchProfile,
} from "@/store/slices/authSlice";

import { toast } from "sonner";

type FormErrors = {
  email?: string;
  password?: string;
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const dispatch = useAppDispatch();
  const router = useRouter();

  /* ----------------- VALIDATION ----------------- */

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      newErrors.email = "Please enter your email address.";
    } else if (!EMAIL_REGEX.test(trimmedEmail)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!password) {
      newErrors.password = "Please enter your password.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  /* ----------------- INPUT HANDLERS ----------------- */

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);

    if (errors.email) {
      setErrors((prev) => ({
        ...prev,
        email: undefined,
      }));
    }
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);

    if (errors.password) {
      setErrors((prev) => ({
        ...prev,
        password: undefined,
      }));
    }
  };

  /* ----------------- SUBMIT ----------------- */

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setErrors({});

    // Stop API call if frontend validation fails
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      await dispatch(
        loginRedux({
          email: email.trim(),
          password,
        }),
      ).unwrap();

      await dispatch(fetchProfile()).unwrap();

      toast.success("Login successful!");

      router.replace("/dashboard");
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Invalid email or password.";

      toast.error(message);

      // Show API error inside form as well
      setErrors({
        email: message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="bg-white">
      <Banner title="Sign In" />

      <section className="py-10">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="text-2xl font-bold tracking-wide">SIGN IN YOURSELF</h2>

          <p className="mx-auto mt-2 max-w-xl text-sm text-[#333333]">
            Welcome back. Sign in to access your account and continue.
          </p>

          <div className="mx-auto mt-4 h-1 w-12 bg-[#c9060a]" />

          <div className="mx-auto mt-6 max-w-md border border-gray-200 bg-white p-8 text-left shadow-[0_8px_20px_rgba(0,0,0,0.25)]">
            <form onSubmit={handleSubmit} noValidate>
              {/* EMAIL */}

              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium"
                >
                  Email Address
                </label>

                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  disabled={loading}
                  autoComplete="email"
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? "email-error" : undefined}
                  className={`w-full border px-4 py-2 outline-none transition ${
                    errors.email
                      ? "border-[#c9060a]"
                      : "border-gray-300 focus:border-gray-500"
                  }`}
                />

                {errors.email && (
                  <p
                    id="email-error"
                    className="mt-1 text-sm text-[#c9060a]"
                    role="alert"
                  >
                    {errors.email}
                  </p>
                )}
              </div>

              {/* PASSWORD */}

              <div className="mb-4">
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium"
                >
                  Password
                </label>

                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={handlePasswordChange}
                  disabled={loading}
                  autoComplete="current-password"
                  aria-invalid={Boolean(errors.password)}
                  aria-describedby={
                    errors.password ? "password-error" : undefined
                  }
                  className={`w-full border px-4 py-2 outline-none transition ${
                    errors.password
                      ? "border-[#c9060a]"
                      : "border-gray-300 focus:border-gray-500"
                  }`}
                />

                {errors.password && (
                  <p
                    id="password-error"
                    className="mt-1 text-sm text-[#c9060a]"
                    role="alert"
                  >
                    {errors.password}
                  </p>
                )}
              </div>

              {/* SUBMIT */}

              <button
                disabled={loading}
                type="submit"
                className="w-full cursor-pointer bg-[#c9060a] px-6 py-2 text-sm text-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Logging in..." : "Log In"}
              </button>
            </form>

            <p className="mt-4 text-sm text-[#c9060a]">
              <Link href="/register" className="hover:underline">
                Register
              </Link>{" "}
              |{" "}
              <Link href="/forget-password" className="hover:underline">
                Forget your password?
              </Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
