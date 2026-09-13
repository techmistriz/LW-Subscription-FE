"use client";

import { useRegisterForm } from "@/hooks/useRegisterForm";
import PersonalDetailsForm from "./PersonalDetailsForm";
import SubscriptionSummary from "./SubscriptionSummary";
import SubscriptionSummarySkeleton from "@/components/feedback/Skeletons/SubscriptionSummary";
import Banner from "@/components/common/Banner";
import Image from "next/image";

export default function RegisterForm() {
  const {
    form,
    loading,
    plansLoading,
    processingPayment, //  ADD THIS - it was missing!
    registrationSuccess,
    selectedPlan,
    otherPlans,
    handleChange,
    handleSubmit,
    getError,
    setForm,
  } = useRegisterForm();

  //  Show loading state during payment processing
  if (processingPayment) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
        <div className="w-[360px] max-w-full rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-2xl">
          {/* Loader */}
          <div className="relative mb-6 flex justify-center">
            <div className="absolute h-16 w-16 animate-ping rounded-full bg-red-100" />

            <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
              <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-red-200 border-t-[#c9060a]" />
            </div>
          </div>

          {/* Title */}
          <h2 className="text-lg font-semibold text-gray-900">
            Verifying Payment
          </h2>

          {/* Description */}
          <p className="mt-2 text-sm leading-5 text-gray-500">
            Please wait while we confirm your transaction.
          </p>

          {/* Progress */}
          <div className="mt-6 h-1 w-full overflow-hidden rounded-full bg-gray-100">
            <div className="h-full w-1/3 animate-[slide_1.2s_linear_infinite] rounded-full bg-[#c9060a]" />
          </div>

          {/* Razorpay */}
          <div className="mt-6 flex items-center justify-center gap-2">
            <span className="text-xs text-gray-400">Secured by</span>

            <div className="flex h-6 items-center rounded-md px-">
              <Image
                src="/razorpay-logo.webp"
                alt="Razorpay"
                width={72}
                height={24}
                className="h-18 w-auto object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (plansLoading) {
    return (
      <main className="bg-gray-50">
        <Banner title={"Subscribe"} />
        <section className="py-16 px-4 max-w-6xl m-auto">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-7">
              <div className="bg-white p-8 border border-gray-200 shadow-sm rounded-xl">
                <div className="animate-pulse space-y-4">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="h-10 bg-gray-200 rounded"></div>
                    <div className="h-10 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:col-span-5">
              <SubscriptionSummarySkeleton />
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="bg-gray-50">
      <Banner title={"Subscribe"} />

      <section className="py-16 px-4 max-w-6xl m-auto">
        {registrationSuccess ? (
          <div className="mx-auto max-w-2xl rounded-xl border border-gray-200 bg-white px-6 py-16 text-center shadow-sm">
            {/* Success Icon */}
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <svg
                className="h-8 w-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>

            <h2 className="text-2xl font-semibold text-gray-900">
              Registration Successful
            </h2>

            <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-gray-600">
              Please check your email to verify your account.
            </p>
          </div>
        ) : (
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-7">
              <PersonalDetailsForm
                form={form}
                onChange={handleChange}
                getError={getError}
              />
            </div>

            <div className="lg:col-span-5">
              <SubscriptionSummary
                selectedPlan={selectedPlan}
                otherPlans={otherPlans}
                formPlan={form.plan}
                loading={loading}
                onPlanSelect={(planId) =>
                  setForm((prev) => ({ ...prev, plan: planId }))
                }
                onSubmit={handleSubmit}
              />
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
