"use client";

import { useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";

import Banner from "@/components/common/Banner";
import { routes } from "@/config/routes";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
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

  // const [email, setEmail] = useState(emailParam ?? "");

  const verificationStarted = useRef(false);
  const verificationToastShown = useRef(false);
  const resendToastShown = useRef(false);

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

  /* ------------------- 
     KEEP EMAIL IN SYNC WITH URL
  -------------------  */
  // useEffect(() => {
  //   if (emailParam) {
  //     setEmail(emailParam);
  //   }
  // }, [emailParam]);

  /* ------------------- 
     VERIFY EMAIL
  -------------------  */
  useEffect(() => {
    if (!token || !emailParam || verificationStarted.current) {
      return;
    }

    verificationStarted.current = true;

    dispatch(
      verifyEmail({
        email: emailParam,
        token,
      }),
    );
  }, [token, emailParam, dispatch]);

  /* ------------------- 
     VERIFICATION TOAST
  -------------------  */
  useEffect(() => {
    if (verificationLoading || verificationToastShown.current) {
      return;
    }

    if (verificationSuccess) {
      verificationToastShown.current = true;
      toast.success(verificationSuccess);
      return;
    }

    if (verificationError) {
      verificationToastShown.current = true;
      toast.error(verificationError);
    }
  }, [verificationLoading, verificationSuccess, verificationError]);

  /* ------------------- 
     RESEND TOAST
  -------------------  */
  useEffect(() => {
    if (resendLoading || resendToastShown.current) {
      return;
    }

    if (resendSuccess) {
      resendToastShown.current = true;
      toast.success(resendSuccess);
      return;
    }

    if (resendError) {
      resendToastShown.current = true;
      toast.error(resendError);
    }
  }, [resendLoading, resendSuccess, resendError]);

  /* ------------------- 
     CLEANUP
  -------------------  */
  useEffect(() => {
    return () => {
      dispatch(clearEmailVerificationState());
      dispatch(clearResendVerificationState());
    };
  }, [dispatch]);

  /* ------------------- 
     LOGIN
  -------------------  */
  const handleLogin = () => {
    router.push(routes.signIn);
  };

  /* ------------------- 
     RESEND VERIFICATION EMAIL
  -------------------  */
  const handleResend = () => {
    const trimmedEmail = emailParam?.trim() ?? "";

    if (!trimmedEmail) {
      toast.error("Please enter your email address.");
      return;
    }

    resendToastShown.current = false;

    dispatch(resendVerificationEmail(trimmedEmail));
  };

  const hasInvalidLink = !token || !emailParam;

  const isVerifying =
    Boolean(token) && Boolean(emailParam) && verificationLoading;

  const isVerified =
    Boolean(token) && !verificationLoading && Boolean(verificationSuccess);

  const hasVerificationError =
    Boolean(token) &&
    !verificationLoading &&
    !verificationSuccess &&
    Boolean(verificationError);

  return (
    <main className="min-h-screen bg-gray-50">
      <Banner title="Email Verification" />

      <section className="flex min-h-[calc(100vh-160px)] items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-lg">
          {/* Main Card Container with normalized margins */}
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-[0_10px_40px_rgba(0,0,0,0.08)]">
            <div className="px-6 py-10 sm:px-10 sm:py-12">
              <div className="text-center">
                {/* INVALID LINK */}
                {hasInvalidLink && (
                  <>
                    <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-50 ring-8 ring-red-50/60">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-9 w-9 text-[#c8050b]"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.8}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 9v3.75m0 3.75h.008M10.29 3.86l-7.82 13.5A1.75 1.75 0 003.98 20h16.04a1.75 1.75 0 001.51-2.64l-7.82-13.5a1.75 1.75 0 00-3.02 0z"
                        />
                      </svg>
                    </div>

                    <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#c8050b]">
                      Email Verification
                    </p>

                    <h2 className="mb-3 text-2xl font-bold tracking-tight text-gray-900">
                      Invalid Verification Link
                    </h2>

                    <p className="mx-auto mb-8 max-w-sm text-sm leading-6 text-gray-500">
                      This verification link is invalid or incomplete. Please
                      return to the login page and try again.
                    </p>

                    <button
                      type="button"
                      onClick={handleLogin}
                      className="w-full cursor-pointer  bg-[#c8050b] px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[#a80508] hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#c8050b]/30"
                    >
                      Go to Login
                    </button>
                  </>
                )}

                {/* VERIFYING */}
                {isVerifying && (
                  <div>
                    <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-50 ring-8 ring-red-50/60">
                      <div className="h-9 w-9 animate-spin rounded-full border-[2px] border-gray-200 border-t-[#c8050b]" />
                    </div>

                    <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#c8050b]">
                      Please Wait
                    </p>

                    <h2 className="mb-3 text-2xl font-bold tracking-tight text-gray-900">
                      Verifying Your Email
                    </h2>

                    <p className="mx-auto mb-8 max-w-sm text-sm leading-6 text-gray-500">
                      We&apos;re securely verifying your email address.
                      <br />
                      This will only take a moment.
                    </p>

                    <div className="mx-auto mt-6 h-px w-12 bg-[#c8050b]/20" />

                    <p className="mt-4 text-xs text-gray-400">
                      Please don&apos;t close this page.
                    </p>
                  </div>
                )}

                {/* SUCCESS */}
                {isVerified && (
                  <>
                    <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-50 ring-8 ring-green-50/70">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-7 w-7 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2.5}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                    </div>

                    <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-green-600">
                      Verification Complete
                    </p>

                    <h2 className="mb-3 text-2xl font-bold tracking-tight text-gray-900">
                      Email Verified Successfully
                    </h2>

                    <p className="mx-auto mb-8 max-w-sm text-sm leading-6 text-gray-500">
                      {verificationSuccess}
                    </p>

                    <button
                      type="button"
                      onClick={handleLogin}
                      className="w-full cursor-pointer   bg-[#c8050b] px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[#a80508] hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#c8050b]/30"
                    >
                      Continue to Login
                    </button>
                  </>
                )}

                {/* VERIFICATION ERROR */}
                {hasVerificationError && (
                  <>
                    <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-50 ring-8 ring-red-50/60">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-9 w-9 text-[#c8050b]"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.8}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 9v3.75m0 3.75h.008M10.29 3.86l-7.82 13.5A1.75 1.75 0 003.98 20h16.04a1.75 1.75 0 001.51-2.64l-7.82-13.5a1.75 1.75 0 00-3.02 0z"
                        />
                      </svg>
                    </div>

                    <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#c8050b]">
                      Verification Error
                    </p>

                    <h2 className="mb-3 text-2xl font-bold tracking-tight text-gray-900">
                      Verification Failed
                    </h2>

                    <p className="mx-auto mb-7 max-w-sm text-sm leading-6 text-gray-500">
                      {verificationError}
                    </p>

                    <div className="mb-5 rounded-xl border border-gray-200 bg-gray-50 p-4 text-left">
                      <label
                        htmlFor="verification-email"
                        className="mb-2 block text-sm font-semibold text-gray-800"
                      >
                        Email Address
                      </label>

                      <input
                        id="verification-email"
                        disabled
                        type="email"
                        value={emailParam ?? ""}
                        className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-3 text-sm text-gray-700 outline-none disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={handleResend}
                      disabled={resendLoading}
                      className="mb-3 flex w-full cursor-pointer items-center justify-center gap-2 border border-[#c8050b] px-5 py-3 text-sm font-semibold text-[#c8050b] transition-all duration-200 hover:bg-[#c8050b] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#c8050b]/20 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {resendLoading && (
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#c8050b]/30 border-t-[#c8050b]" />
                      )}

                      {resendLoading
                        ? "Sending Verification Email..."
                        : "Resend Verification Email"}
                    </button>

                    <button
                      type="button"
                      onClick={handleLogin}
                      className="w-full cursor-pointer  bg-[#c8050b] px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[#a80508] hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#c8050b]/30"
                    >
                      Go to Login
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="h-1 bg-[#c8050b]" />
          </div>
        </div>
      </section>
    </main>
  );
}
