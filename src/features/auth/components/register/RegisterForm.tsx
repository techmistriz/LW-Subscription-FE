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
    processingPayment,
    selectedPlan,
    otherPlans,
    handleChange,
    handleSubmit,
    getError,
    setForm,
    pendingCheckout,
    resumePayment,
  } = useRegisterForm();

  if (processingPayment) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
        <div className="w-[360px] max-w-full rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-2xl">
          <div className="relative mb-6 flex justify-center">
            <div className="absolute h-16 w-16 animate-ping rounded-full bg-red-100" />

            <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
              <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-red-200 border-t-[#c8050b]" />
            </div>
          </div>

          <h2 className="text-lg font-semibold text-gray-900">
            Verifying Payment
          </h2>

          <p className="mt-2 text-sm leading-5 text-gray-500">
            Please wait while we confirm your transaction.
          </p>

          <div className="mt-6 h-1 w-full overflow-hidden rounded-full bg-gray-100">
            <div className="h-full w-1/3 animate-[slide_1.2s_linear_infinite] rounded-full bg-[#c8050b]" />
          </div>

          <div className="mt-6 flex items-center justify-center gap-2">
            <span className="text-xs text-gray-400">Secured by</span>

            <div className="flex h-6 items-center rounded-md">
              <Image
                src="/razorpay-logo.webp"
                alt="Razorpay"
                width={72}
                height={24}
                className="h-6 w-auto object-contain"
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
        <Banner title="Subscribe" />

        <section className="m-auto max-w-6xl px-4 py-16">
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
                <div className="animate-pulse space-y-4">
                  <div className="h-4 w-1/4 rounded bg-gray-200" />

                  <div className="grid grid-cols-2 gap-4">
                    <div className="h-10 rounded bg-gray-200" />
                    <div className="h-10 rounded bg-gray-200" />
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
      <Banner title="Subscribe" />

      <section className="m-auto max-w-6xl px-4 py-16">
        {pendingCheckout && (
          <div
            className="mb-6 border border-amber-200 bg-amber-50 p-4 text-sm"
            role="status"
          >
            <p>
              Your account is saved. Complete the pending payment for{" "}
              {pendingCheckout.email}, or sign in to view subscription history.
            </p>
            <button
              type="button"
              onClick={resumePayment}
              disabled={loading}
              className="mt-3 bg-[#c8050b] px-4 py-2 text-white disabled:opacity-50"
            >
              {loading ? "Please wait..." : "Resume payment"}
            </button>
          </div>
        )}
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 lg:grid-cols-12">
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
                setForm((prev) => ({
                  ...prev,
                  plan: planId,
                }))
              }
              onSubmit={handleSubmit}
            />
          </div>
        </div>
      </section>
    </main>
  );
}
