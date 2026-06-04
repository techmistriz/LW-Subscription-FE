"use client";

import { useRegisterForm } from "../hooks/useRegisterForm";
import PersonalDetailsForm from "./PersonalDetailsForm";
import SubscriptionSummary from "./SubscriptionSummary";
import SubscriptionSummarySkeleton from "@/components/Skeletons/SubscriptionSummary";
import Banner from "@/components/Common/Banner";

export default function RegisterForm() {
  const {
    form,
    loading,
    plansLoading,
    processingPayment, //  ADD THIS - it was missing!
    selectedPlan,
    otherPlans,
    isOtpSent,
    otpTimer,
    handleChange,
    handleSendOtp,
    handleSubmit,
    getError,
    setForm,
  } = useRegisterForm();

  //  Show loading state during payment processing
  if (processingPayment) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-[#c9060a] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm font-medium text-gray-600 tracking-widest uppercase">
            Processing Payment...
          </p>
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
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-7">
            <PersonalDetailsForm
              form={form}
              onChange={handleChange}
              getError={getError}
              isOtpSent={isOtpSent}
              otpTimer={otpTimer}
              onSendOtp={handleSendOtp}
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
      </section>
    </main>
  );
}
