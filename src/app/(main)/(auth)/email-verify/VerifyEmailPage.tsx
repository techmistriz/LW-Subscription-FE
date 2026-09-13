"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { toast } from "sonner";

import Banner from "@/components/common/Banner";
import { routes } from "@/config/routes";
import {
  verifyEmail,
  resendVerificationEmail,
  clearEmailVerificationState,
  clearResendVerificationState,
} from "@/store/slices/authSlice";

export default function VerifyEmail() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const token = searchParams.get("token");
const emailParam = searchParams.get("email");

const [email, setEmail] = useState(emailParam || "");

  const verificationStarted = useRef(false);

  const {
    loading: verificationLoading,
    success: verificationSuccess,
    error: verificationError,
  } = useAppSelector((state) => state.auth.emailVerification);

  const {
    loading: resendLoading,
    success: resendSuccess,
    error: resendError,
  } = useAppSelector((state) => state.auth.resendVerification);

  /* ---------------------------------------
     VERIFY EMAIL
  --------------------------------------- */

useEffect(() => {
  // Check for both token AND email
  if (!token || !emailParam || verificationStarted.current) {
    return;
  }

  verificationStarted.current = true;

  // Pass both email and token to the thunk
  dispatch(verifyEmail({ email: emailParam, token }));
}, [token, emailParam, dispatch]);

  /* ---------------------------------------
     VERIFICATION SUCCESS / ERROR TOAST
  --------------------------------------- */

  useEffect(() => {
    if (verificationSuccess) {
      toast.success(verificationSuccess);
    }

    if (verificationError) {
      toast.error(verificationError);
    }
  }, [verificationSuccess, verificationError]);

  /* ---------------------------------------
     RESEND SUCCESS / ERROR TOAST
  --------------------------------------- */

  useEffect(() => {
    if (resendSuccess) {
      toast.success(resendSuccess);
    }

    if (resendError) {
      toast.error(resendError);
    }
  }, [resendSuccess, resendError]);

  /* ---------------------------------------
     CLEANUP
  --------------------------------------- */

  useEffect(() => {
    return () => {
      dispatch(clearEmailVerificationState());
      dispatch(clearResendVerificationState());
    };
  }, [dispatch]);

  /* ---------------------------------------
     LOGIN
  --------------------------------------- */

  const handleLogin = () => {
    router.push(routes.login);
  };

  /* ---------------------------------------
     RESEND
  --------------------------------------- */

  const handleResend = () => {
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      toast.error("Please enter your email address.");
      return;
    }

    dispatch(resendVerificationEmail(trimmedEmail));
  };

  return (
    <main>
      <Banner title="Email Verification" />

      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="bg-white -mt-50 p-8 rounded-xl shadow-md w-full max-w-md">
          <div className="text-center">

            {/* ---------------------------------------
                NO TOKEN
            --------------------------------------- */}

            {!token && (
              <>
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-[#c9060a]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 9v3.75m0 3.75h.008M10.29 3.86l-7.82 13.5A1.75 1.75 0 003.98 20h16.04a1.75 1.75 0 001.51-2.64l-7.82-13.5a1.75 1.75 0 00-3.02 0z"
                    />
                  </svg>
                </div>

                <h2 className="text-xl font-bold mb-3 text-gray-900">
                  Invalid Verification Link
                </h2>

                <p className="text-sm text-gray-500 mb-6">
                  This email verification link is invalid or incomplete.
                </p>

                <button
                  type="button"
                  onClick={handleLogin}
                  className="w-full bg-[#c9060a] cursor-pointer text-white py-2.5 rounded transition hover:bg-[#a80508]"
                >
                  Go to Login
                </button>
              </>
            )}

            {/* ---------------------------------------
                VERIFYING
            --------------------------------------- */}

            {token && verificationLoading && (
              <>
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#c9060a]/10">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#c9060a]/20 border-t-[#c9060a]" />
                </div>

                <h2 className="text-xl font-bold mb-3 text-gray-900">
                  Verifying Your Email
                </h2>

                <p className="text-sm text-gray-500">
                  Please wait while we verify your email address.
                </p>
              </>
            )}

            {/* ---------------------------------------
                SUCCESS
            --------------------------------------- */}

            {token &&
              !verificationLoading &&
              verificationSuccess && (
                <>
                  <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8 text-green-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>

                  <h2 className="text-xl font-bold mb-3 text-gray-900">
                    Email Verified Successfully
                  </h2>

                  <p className="text-sm text-gray-500 mb-6">
                    {verificationSuccess}
                  </p>

                  <button
                    type="button"
                    onClick={handleLogin}
                    className="w-full bg-[#c9060a] cursor-pointer text-white py-2.5 rounded transition hover:bg-[#a80508]"
                  >
                    Continue to Login
                  </button>
                </>
              )}

            {/* ---------------------------------------
                VERIFICATION ERROR
            --------------------------------------- */}

            {token &&
              !verificationLoading &&
              !verificationSuccess &&
              verificationError && (
                <>
                  <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8 text-[#c9060a]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 9v3.75m0 3.75h.008M10.29 3.86l-7.82 13.5A1.75 1.75 0 003.98 20h16.04a1.75 1.75 0 001.51-2.64l-7.82-13.5a1.75 1.75 0 011.51-2.64l-7.82-13.5a1.75 1.75 0 00-3.02 0z"
                      />
                    </svg>
                  </div>

                  <h2 className="text-xl font-bold mb-3 text-gray-900">
                    Verification Failed
                  </h2>

                  <p className="text-sm text-gray-500 mb-6">
                    {verificationError}
                  </p>

                  {/* Email for resend */}
                  <div className="text-left mb-3">
                    <label
                      htmlFor="verification-email"
                      className="block text-sm font-medium text-gray-700 mb-1.5"
                    >
                      Email Address
                    </label>

                    <input
                      id="verification-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full border border-gray-300 rounded px-3 py-2.5 text-sm outline-none focus:border-[#c9060a]"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={resendLoading}
                    className="w-full border border-[#c9060a] text-[#c9060a] cursor-pointer py-2.5 rounded transition hover:bg-[#c9060a] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed mb-3"
                  >
                    {resendLoading
                      ? "Sending..."
                      : "Resend Verification Email"}
                  </button>

                  <button
                    type="button"
                    onClick={handleLogin}
                    className="w-full bg-[#c9060a] cursor-pointer text-white py-2.5 rounded transition hover:bg-[#a80508]"
                  >
                    Go to Login
                  </button>
                </>
              )}
          </div>
        </div>
      </div>
    </main>
  );
}