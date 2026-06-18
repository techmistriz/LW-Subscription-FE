"use client";

import { useState, useCallback, useEffect, useMemo } from "react";

import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/redux/store/hooks";

import { useAppSelector } from "@/redux/store/hooks";

import { getPlans } from "@/features/auth/services/plans";
import {
  upgradePlan,
  verifySubscriptionPayment,
  renewPlan,
} from "@/lib/api/subscription/subscription";

import PricingSkeleton from "../Skeletons/PricingSkeleton";
import { toast } from "sonner";
import { fetchProfile } from "@/redux/store/slices/authSlice";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function PricingCard() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [selectedPlanId, setSelectedPlanId] = useState<number>(2);

  const [loading, setLoading] = useState(false);
  const [redirectLoading, setRedirectLoading] = useState(false);

  const [plans, setPlans] = useState<any[]>([]);

  const isAuthenticated = useAppSelector(
    (state: any) => state.auth.isAuthenticated,
  );

  const user = useAppSelector((state: any) => state.auth.user);

  const activeSubscription = useAppSelector(
    (state: any) => state.subscription.active,
  );

  /* ---------------- FETCH PLANS ---------------- */
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await getPlans();

        const data = Array.isArray(res)
          ? res
          : Array.isArray(res?.data)
            ? res.data
            : [];

        setPlans(data);
      } catch (err) {
        console.error("Failed to load plans", err);

        setPlans([]);
      }
    };

    fetchPlans();
  }, []);

  /* ---------------- FEATURE PARSER ---------------- */
  const parseFeatures = (html: string) => {
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

  //-------------------------
  const isSubscriptionReady = useAppSelector(
    (state: any) => state.subscription.isLoaded,
  );

  // For registered users, free plan is always disabled
  const isFreePlanDisabled = useMemo(() => {
    return isAuthenticated === true;
  }, [isAuthenticated]);

  /* ---------------- SUBSCRIBE / UPGRADE ---------------- */
  const handleSubscribe = useCallback(async () => {
    try {
      if (!isSubscriptionReady) {
        toast.error("Loading subscription...");
        return;
      }

      setLoading(true);

      const selectedPlan = plans.find(
        (p) => Number(p.id) === Number(selectedPlanId),
      );

      if (!selectedPlan) {
        toast.error("Please select a plan");
        setLoading(false);
        return;
      }

      // Check if trying to select free plan as registered user
      const isFreePlanSelected = Number(selectedPlan.price) === 0;
      if (isFreePlanSelected && isAuthenticated) {
        toast.error(
          "Free plan is only available for new users. Please choose a paid plan to continue your journey! 🚀",
        );
        setLoading(false);
        return;
      }

      if (!isAuthenticated) {
        router.push(`/register?plan=${selectedPlanId}`);
        setLoading(false);
        return;
      }

      const subscriptionId = activeSubscription?.id;
      const subscriptionAmount = Number(activeSubscription?.amount || 0);
      const subscriptionStatus = activeSubscription?.status?.toUpperCase();
      const endDate = activeSubscription?.end_date;
      const isExpiredByDate = endDate ? new Date(endDate) < new Date() : false;
      const isExpired = subscriptionStatus === "EXPIRED" || isExpiredByDate;
      const isFreePlan = subscriptionAmount === 0;
      const hasSubscription = !!subscriptionId;

      let apiResponse: any = null;
      let paymentData: any = null;
      let purchaseType: "NEW" | "RENEW" | "UPGRADE" = "NEW";

      /* ---------------- CASE 1: NO SUBSCRIPTION ---------------- */
      if (!hasSubscription) {
        purchaseType = "NEW";
        apiResponse = await upgradePlan(selectedPlan.id);
      } else if (isFreePlan && isExpired) {
        /* ---------------- CASE 2: FREE PLAN EXPIRED -> Upgrade ---------------- */
        purchaseType = "NEW";
        apiResponse = await upgradePlan(selectedPlan.id);
      } else if (!isFreePlan && isExpired) {
        /* ---------------- CASE 3: PAID PLAN EXPIRED -> RENEW ---------------- */
        purchaseType = "RENEW";
        apiResponse = await renewPlan(subscriptionId);
      } else {
        /* ---------------- CASE 4: ACTIVE PLAN -> UPGRADE ---------------- */
        purchaseType = "UPGRADE";
        apiResponse = await upgradePlan(selectedPlan.id);
      }

      paymentData = apiResponse?.data?.payment || apiResponse?.data;

      if (!paymentData) {
        toast.error("Payment initiation failed");
        setLoading(false);
        return;
      }

      /* ---------------- RAZORPAY ---------------- */
      const options = {
        key: paymentData?.razorpay_key || process.env.NEXT_PUBLIC_RAZORPAY_KEY,
        amount: paymentData?.amount,
        currency: paymentData?.currency || "INR",
        order_id: paymentData?.order_id,
        name: "Lex Witness",
        prefill: {
          name: `${user?.first_name || ""} ${user?.last_name || ""}`,
          email: user?.email,
          contact: user?.contact,
        },
        theme: {
          color: "#c9060a",
        },
        handler: async function (response: any) {
          try {
            setRedirectLoading(true);
            
            const verifyPayload = {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              membership_plan_id: selectedPlan.id,
              purchase_type: purchaseType,
            };

            const verifyRes = await verifySubscriptionPayment(verifyPayload);

            // Check if verification was successful
            if (verifyRes?.success || verifyRes?.data?.success) {
              // Fetch updated profile
              await dispatch(fetchProfile()).unwrap();
              
              toast.success("Payment successful! 🎉");
              
              // Redirect to dashboard
              router.push("/dashboard");
            } else {
              // Verification failed but payment was successful
              toast.error(
                verifyRes?.message || 
                verifyRes?.data?.message || 
                "Payment verification failed. Please contact support."
              );
              setRedirectLoading(false);
            }
          } catch (err: any) {
            console.error("Verification error:", err);
            
            // Check if it's a network error or API error
            if (err?.response?.status === 404) {
              toast.error("Payment verification endpoint not found. Please contact support.");
            } else if (err?.response?.status === 500) {
              toast.error("Server error during verification. Please contact support.");
            } else {
              toast.error(
                err?.response?.data?.message || 
                err?.message || 
                "Payment verification failed. Please check your subscription status."
              );
            }
            setRedirectLoading(false);
          }
        },
      };

      const razorpay = new window.Razorpay(options);

      razorpay.on("payment.failed", function (response: any) {
        setLoading(false);
        setRedirectLoading(false);
        toast.error(response?.error?.description || "Payment failed");
      });

      razorpay.open();
    } catch (error: any) {
      console.error("Payment error:", error);
      toast.error(error?.response?.data?.message || "Something went wrong");
      setLoading(false);
      setRedirectLoading(false);
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

  /* ---------------- FILTER PLANS ---------------- */
  const filteredPlans = useMemo(() => {
    if (!plans.length) return [];

    return plans;
  }, [plans]);

  const visibleCount = filteredPlans.length;

  /* ---------------- LOADER ---------------- */
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
        {/* HEADER */}
        <div className="text-center mb-14">
          <h2 className="text-4xl font-black uppercase tracking-tight text-gray-900">
            {isAuthenticated ? "Choose Your Premium Plan" : "Choose Your Plan"}
          </h2>

          <p className="text-gray-500 mt-2 text-sm">
            {isAuthenticated
              ? "More the Merrier. We Value Your Readership."
              : "More the Merrier. We Value Your Readership."}
          </p>

          <div className="w-20 h-1 bg-[#c9060a] mx-auto mt-5 rounded-full" />
        </div>

        {/* GRID */}
        <div
          className={`grid grid-cols-1 md:grid-cols-2 gap-1 ${
            visibleCount === 3
              ? "lg:grid-cols-3 justify-items-center"
              : "lg:grid-cols-4"
          }`}
        >
          {filteredPlans.map((plan) => {
            const isSelected = selectedPlanId === plan.id;
            const features = parseFeatures(plan.feature);
            const isFreePlanCard = Number(plan.price) === 0;
            const disableFreePlan = isFreePlanCard && isFreePlanDisabled;

            return (
              <label
                key={plan.id}
                className="relative cursor-pointer group pt-4"
              >
                {/* BADGE */}
                {plan.tag && !disableFreePlan && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                    <span
                      className={`text-[10px] font-bold uppercase px-3 py-1 rounded-full shadow-md
                      ${
                        plan.tag === "Most Popular" || plan.tag === "Best Value"
                          ? "bg-[#c9060a] text-white"
                          : "bg-gray-300 text-[#333]"
                      }`}
                    >
                      {plan.tag}
                    </span>
                  </div>
                )}

                {/* FREE PLAN LOCKED BADGE */}
                {isFreePlanCard && disableFreePlan && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                    <span className="text-[10px] font-bold uppercase px-3 py-1 rounded-full shadow-md bg-gray-500 text-white">
                      For New Users
                    </span>
                  </div>
                )}

                {/* RADIO */}
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

                {/* CARD */}
                <div
                  className={`relative h-full mx-4 p-6 md:p-8 rounded-2xl border-2 transition-all duration-300 bg-white
                  ${
                    disableFreePlan
                      ? "opacity-60 cursor-not-allowed border-gray-200 bg-gray-50"
                      : "hover:shadow-xl hover:-translate-y-1"
                  }
                  ${isSelected && !disableFreePlan ? "border-[#c9060a] shadow-2xl scale-[1.03]" : "border-gray-300"}`}
                >
                  {/* RADIO ICON */}
                  <div className="flex justify-center mb-5">
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center
                      ${isSelected && !disableFreePlan ? "border-[#c9060a]" : "border-gray-300"}`}
                    >
                      {isSelected && !disableFreePlan && (
                        <div className="w-2.5 h-2.5 bg-[#c9060a] rounded-full" />
                      )}
                    </div>
                  </div>

                  {/* NAME */}
                  <h3
                    className={`text-lg md:text-xl font-black uppercase tracking-widest text-center mb-3 ${getPlanColor(
                      plan.name,
                    )}`}
                  >
                    {plan.name}
                    {activeSubscription?.plan_id === plan.id &&
                      !disableFreePlan && (
                        <span className="block text-xs text-green-600 font-normal mt-1">
                          Current Plan
                        </span>
                      )}
                  </h3>

                  {/* FEATURES */}
                  <ul className="text-start space-y-1 min-h-[60px] list-disc marker:text-[#c9060a] list-inside">
                    {features.slice(0, 3).map((f: string, i: number) => (
                      <li
                        key={i}
                        className={`text-sm font-semibold ${disableFreePlan ? "text-gray-500" : "text-gray-800"}`}
                      >
                        {f}
                      </li>
                    ))}
                  </ul>

                  {/* PRICE */}
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

                        <p className="text-xs font-semibold text-[#c9060a] uppercase tracking-wider mt-3">
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

        {/* CTA */}
        <div className="flex justify-center mt-10 md:mt-14 px-2">
          <button
            onClick={handleSubscribe}
            disabled={loading}
            className="w-full sm:w-auto bg-[#c9060a] text-white px-6 md:px-18 py-3 font-bold text-sm md:text-lg uppercase tracking-widest hover:bg-[#333] transition-all duration-300 active:scale-95 shadow-xl shadow-red-500/20 disabled:opacity-50 cursor-pointer"
          >
            {loading
              ? "Processing..."
              : isAuthenticated
                ? "Upgrade Now"
                : "Subscribe Now"}
          </button>
        </div>
      </div>

      {/* Redirect Loading Overlay */}
      {redirectLoading && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="w-[360px] rounded-3xl bg-white p-8 text-center shadow-2xl border border-gray-100">
            <div className="relative flex justify-center mb-6">
              <div className="absolute w-16 h-16 rounded-full bg-red-100 animate-ping" />

              <div className="relative w-16 h-16 rounded-full bg-red-50 flex items-center justify-center">
                <div className="w-8 h-8 border-[3px] border-red-200 border-t-[#c9060a] rounded-full animate-spin" />
              </div>
            </div>

            <h2 className="text-lg font-semibold text-gray-900">
              Verifying Payment
            </h2>

            <p className="text-sm text-gray-500 mt-2">
              Please wait while we confirm your transaction.
            </p>

            <div className="mt-5 h-1 w-full bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full w-1/3 bg-[#c9060a] animate-[slide_1.2s_linear_infinite]" />
            </div>

            <p className="text-xs text-gray-400 mt-5">Secured by Razorpay</p>
          </div>
        </div>
      )}
    </section>
  );
}