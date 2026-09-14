"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Image from "next/image";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { getMembershipPlans } from "@/services/plan.service";
import type { SubscriptionPlan } from "@/types/models";
import {
  upgradePlan,
  verifySubscriptionPayment,
  buyNewPlan,
} from "@/services/subscription.service";
import { fetchProfile } from "@/store/slices/authSlice";
import { storage } from "@/lib/storage";
import PricingSkeleton from "@/components/feedback/Skeletons/PricingSkeleton";
import { completeCheckout } from "@/lib/paymentCheckout";
import { extractErrorMessage } from "@/network/errorMessage";
import { routes } from "@/config/routes";
import { images } from "@/config/images";

export default function PricingCard() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [selectedPlanId, setSelectedPlanId] = useState<number>(2);
  const [loading, setLoading] = useState(false);
  const [redirectLoading, setRedirectLoading] = useState(false);
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);

  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const user = useAppSelector((state) => state.auth.user);
  const activeSubscription = useAppSelector(
    (state) => state.subscription.active,
  );
  const isSubscriptionReady = useAppSelector(
    (state) => state.subscription.isLoaded,
  );

  /* ---------------- FETCH PLANS ---------------- */
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const data = await getMembershipPlans();
        setPlans(data);
      } catch {
        setPlans([]);
      }
    };
    fetchPlans();
  }, []);

  /* ---------------- FEATURE PARSER ---------------- */
  const parseFeatures = (html?: string) => {
    if (!html) return [];
    const div = document.createElement("div");
    div.innerHTML = html;
    return Array.from(div.querySelectorAll("li, p")).map(
      (el) => el.textContent || "",
    );
  };

  /* ---------------- PLAN COLOR ---------------- */
  const getPlanColor = (name: string) => {
    switch (name?.toLowerCase()) {
      case "free":
        return "text-gray-500";
      case "silver":
        return "text-slate-600";
      case "gold":
        return "text-amber-500";
      case "platinum":
        return "text-indigo-500";
      default:
        return "text-gray-900";
    }
  };

  const isFreePlanDisabled = useMemo(
    () => isAuthenticated === true,
    [isAuthenticated],
  );

  /* ---------------- SUBSCRIBE / UPGRADE ---------------- */
  const handleSubscribe = useCallback(async () => {
    if (!isSubscriptionReady) {
      toast.error("Loading subscription...");
      return;
    }

    setLoading(true);

    try {
      const selectedPlan = plans.find(
        (p) => Number(p.id) === Number(selectedPlanId),
      );

      if (!selectedPlan) {
        toast.error("Please select a plan");
        return;
      }

      const isFreePlanSelected = Number(selectedPlan.price) === 0;
      if (isFreePlanSelected && isAuthenticated) {
        toast.error(
          "Free plan is only available for new users. Please choose a paid plan to continue your journey! 🚀",
        );
        return;
      }

      if (!isAuthenticated) {
        router.push(`/register?plan=${selectedPlanId}`);
        return;
      }

      const hasPaidSubscription = Number(activeSubscription?.amount || 0) > 0;
      const apiResponse = hasPaidSubscription
        ? await upgradePlan(selectedPlan.id)
        : await buyNewPlan(selectedPlan.id);
      if (!apiResponse.status) throw new Error(apiResponse.message);

      const subscription = await completeCheckout(
        apiResponse.data,
        user ?? {},
        (response) =>
          verifySubscriptionPayment({
            ...response,
            subscription_id: apiResponse.data.subscription.id,
          }),
        setRedirectLoading,
      );
      if (subscription) {
        storage.set("just_paid", "true");
        await dispatch(fetchProfile()).unwrap();
        toast.success(
          subscription.status === "ACTIVE"
            ? "Subscription activated."
            : "Payment confirmed. Your next term is scheduled.",
        );
        router.push(routes.dashboard);
      }
    } catch (error: unknown) {
      toast.error(extractErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }, [
    selectedPlanId,
    plans,
    isAuthenticated,
    activeSubscription,
    user,
    dispatch,
    router,
    isSubscriptionReady,
  ]);

  const visibleCount = plans.length;

  if (!plans.length) {
    return (
      <section className="min-h-screen bg-gray-100 w-full py-24 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <div className="h-8 w-64 bg-gray-200 rounded mx-auto mb-3 animate-pulse" />
            <div className="h-4 w-40 bg-gray-200 rounded mx-auto animate-pulse" />
          </div>
          <PricingSkeleton />
        </div>
      </section>
    );
  }

  return (
    <section
      id="pricing"
      className="min-h-screen bg-gray-100 w-full py-24 sm:px-6 lg:px-8"
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-4xl font-black uppercase tracking-tight text-gray-900">
            {isAuthenticated ? "Choose Your Premium Plan" : "Choose Your Plan"}
          </h2>
          <p className="text-gray-500 mt-2 text-sm">
            More the Merrier. We Value Your Readership.
          </p>
          <div className="w-20 h-1 bg-[#c8050b] mx-auto mt-5 rounded-full" />
        </div>

        <div
          className={`grid grid-cols-1 md:grid-cols-2 gap-1 ${
            visibleCount === 3
              ? "lg:grid-cols-3 justify-items-center"
              : "lg:grid-cols-4"
          }`}
        >
          {plans.map((plan) => {
            const isSelected = selectedPlanId === plan.id;
            const features = parseFeatures(plan.feature);
            const isFreePlanCard = Number(plan.price) === 0;
            const disableFreePlan = isFreePlanCard && isFreePlanDisabled;

            return (
              <label
                key={plan.id}
                className="relative cursor-pointer group pt-4"
              >
                {plan.tag && !disableFreePlan && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                    <span
                      className={`text-[10px] font-bold uppercase px-3 py-1 rounded-full shadow-md ${
                        plan.tag === "Most Popular" || plan.tag === "Best Value"
                          ? "bg-[#c8050b] text-white"
                          : "bg-gray-300 text-[#333]"
                      }`}
                    >
                      {plan.tag}
                    </span>
                  </div>
                )}

                {isFreePlanCard && disableFreePlan && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                    <span className="text-[10px] font-bold uppercase px-3 py-1 rounded-full shadow-md bg-gray-500 text-white">
                      For New Users
                    </span>
                  </div>
                )}

                <input
                  type="radio"
                  name="plan"
                  className="sr-only"
                  checked={isSelected}
                  onChange={() => {
                    if (disableFreePlan) {
                      toast.error(
                        "Free plan is only available for new users. Please choose a paid plan!",
                      );
                      return;
                    }
                    setSelectedPlanId(plan.id);
                  }}
                />

                <div
                  className={`relative h-full mx-4 p-6 md:p-8 rounded-2xl border-2 transition-all duration-300 bg-white ${
                    disableFreePlan
                      ? "opacity-60 cursor-not-allowed border-gray-200 bg-gray-50"
                      : "hover:shadow-xl hover:-translate-y-1"
                  } ${isSelected && !disableFreePlan ? "border-[#c8050b] shadow-2xl scale-[1.03]" : "border-gray-300"}`}
                >
                  <div className="flex justify-center mb-5">
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        isSelected && !disableFreePlan
                          ? "border-[#c8050b]"
                          : "border-gray-300"
                      }`}
                    >
                      {isSelected && !disableFreePlan && (
                        <div className="w-2.5 h-2.5 bg-[#c8050b] rounded-full" />
                      )}
                    </div>
                  </div>

                  <h3
                    className={`text-lg md:text-xl font-black uppercase tracking-widest text-center mb-3 ${getPlanColor(plan.name)}`}
                  >
                    {plan.name}
                    {activeSubscription?.plan_id === plan.id &&
                      !disableFreePlan && (
                        <span className="block text-xs text-green-600 font-normal mt-1">
                          Current Plan
                        </span>
                      )}
                  </h3>

                  <ul className="text-start space-y-1 min-h-[60px] list-disc marker:text-[#c8050b] list-inside">
                    {features.slice(0, 3).map((f, i) => (
                      <li
                        key={i}
                        className={`text-sm font-semibold ${disableFreePlan ? "text-gray-500" : "text-gray-800"}`}
                      >
                        {f}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-6 text-center">
                    {Number(plan.price) === 0 ? (
                      <>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Price
                        </p>
                        <p className="text-3xl font-black text-gray-900 mt-1">
                          FREE
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Actual Price
                        </p>
                        <p className="text-lg font-medium text-gray-400 line-through">
                          ₹{plan.actual_price}
                        </p>
                        <p className="text-xs font-semibold text-[#c8050b] uppercase tracking-wider mt-3">
                          Offer Price
                        </p>
                        <p className="text-3xl font-black text-gray-900">
                          ₹{Number(plan.price).toLocaleString()}
                        </p>
                        <p className="text-[11px] text-gray-500 mt-2">
                          + 18% GST applicable
                        </p>
                      </>
                    )}
                  </div>

                  {disableFreePlan && (
                    <div className="mt-3">
                      <p className="text-[11px] text-center text-amber-600 font-bold">
                        For New Users Only
                      </p>
                      <p className="text-[10px] text-center text-gray-500 mt-1">
                        ✨ Choose a paid plan to get started
                      </p>
                    </div>
                  )}
                </div>
              </label>
            );
          })}
        </div>

        <div className="flex justify-center mt-10 md:mt-14 px-2">
          <button
            onClick={handleSubscribe}
            disabled={loading}
            className="w-full sm:w-auto bg-[#c8050b] text-white px-6 md:px-18 py-3 font-bold text-sm md:text-lg uppercase tracking-widest hover:bg-[#333] transition-all duration-300 active:scale-95 shadow-xl shadow-red-500/20 disabled:opacity-50 cursor-pointer"
          >
            {loading
              ? "Processing..."
              : isAuthenticated
                ? "Upgrade Now"
                : "Subscribe Now"}
          </button>
        </div>
      </div>

      {redirectLoading && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
          <div className="w-[360px] max-w-full rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-2xl">
            {/* Loader */}
            <div className="relative mb-6 flex justify-center">
              <div className="absolute h-16 w-16 animate-ping rounded-full bg-red-100" />

              <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
                <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-red-200 border-t-[#c8050b]" />
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
              <div className="h-full w-1/3 animate-[slide_1.2s_linear_infinite] rounded-full bg-[#c8050b]" />
            </div>

            {/* Razorpay */}
            <div className="mt-6 flex items-center justify-center gap-2">
              <span className="text-xs text-gray-400">Secured by</span>

              <div className="flex h-6 items-center rounded-md px-">
                <Image
                  src={images.razorpayLogo}
                  alt="Razorpay"
                  width={72}
                  height={24}
                  className="h-18 w-auto object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
