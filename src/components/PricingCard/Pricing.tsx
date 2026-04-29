"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setSubscription } from "@/redux/store/slices/subscriptionSlice";
import { getPlans } from "@/features/auth/services/plans";
import PricingSkeleton from "../Skeletons/PricingSkeleton";

export default function PricingCard() {
  const router = useRouter();
  const dispatch = useDispatch();

  const [selectedPlanId, setSelectedPlanId] = useState<number>(2);
  const [loading, setLoading] = useState(false);
  const [plans, setPlans] = useState<any[]>([]);

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
      (el) => el.textContent || ""
    );
  };

  /* ---------------- COLOR MAPPING (FIX) ---------------- */
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

  /* ---------------- SUBSCRIBE ---------------- */
  const handleSubscribe = useCallback(() => {
    setLoading(true);

    const selectedPlan = plans.find((p) => p.id === selectedPlanId);

    if (selectedPlan) {
      dispatch(
        setSubscription({
          plan_id: selectedPlan.id,
          name: selectedPlan.name,
          amount: Number(selectedPlan.price),
          duration_value: selectedPlan.duration_value,
          duration_unit: selectedPlan.duration_unit,
        })
      );
    }

    router.push("/register");
  }, [router, selectedPlanId, dispatch, plans]);

if (!plans.length) {
  return (
    <section className="min-h-screen bg-gray-100 w-full py-24 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <div className="h-8 w-64 bg-gray-200 rounded mx-auto mb-3 animate-pulse" />
          <div className="h-4 w-40 bg-gray-200 rounded mx-auto animate-pulse" />
        </div>

        <PricingSkeleton/>
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
            Choose Your Plan
          </h2>
          <p className="text-gray-500 mt-2 text-sm">
            Flexible pricing built for professionals
          </p>
          <div className="w-20 h-1 bg-[#c9060a] mx-auto mt-5 rounded-full" />
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          {plans.map((plan) => {
            const isSelected = selectedPlanId === plan.id;
            const features = parseFeatures(plan.feature);

            return (
              <label
                key={plan.id}
                className="relative cursor-pointer group pt-4"
              >

                {/* BADGE */}
                {plan.tag && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                    <span
                      className={`text-[10px] font-bold uppercase px-3 py-1 rounded-full shadow-md
                      ${
                        plan.tag === "Most Popular" ||
                        plan.tag === "Best Value"
                          ? "bg-[#c9060a] text-white"
                          : "bg-gray-300 text-[#333 ]"
                      }`}
                    >
                      {plan.tag}
                    </span>
                  </div>
                )}

                {/* RADIO */}
                <input
                  type="radio"
                  name="plan"
                  className="sr-only"
                  checked={isSelected}
                  onChange={() => setSelectedPlanId(plan.id)}
                />

                {/* CARD */}
                <div
                  className={`relative h-full mx-4 p-6 md:p-8 rounded-2xl border-2 transition-all duration-300 bg-white hover:shadow-xl hover:-translate-y-1
                  ${
                    isSelected
                      ? "border-[#c9060a] shadow-2xl scale-[1.03]"
                      : "border-gray-300"
                  }`}
                >

                  {/* RADIO INDICATOR */}
                  <div className="flex justify-center mb-5">
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center
                      ${
                        isSelected
                          ? "border-[#c9060a]"
                          : "border-gray-300"
                      }`}
                    >
                      {isSelected && (
                        <div className="w-2.5 h-2.5 bg-[#c9060a] rounded-full" />
                      )}
                    </div>
                  </div>

                  {/* NAME (FIXED COLOR HERE) */}
                  <h3
                    className={`text-lg md:text-xl font-black uppercase tracking-widest text-center mb-3 ${getPlanColor(
                      plan.name
                    )}`}
                  >
                    {plan.name}
                  </h3>

                  {/* FEATURES */}
                  <ul className="text-start space-y-1 min-h-[60px] list-disc marker:text-[#c9060a] list-inside">
                    {features.slice(0, 3).map((f: string, i: number) => (
                      <li
                        key={i}
                        className="text-sm text-gray-800 font-semibold"
                      >
                        {f}
                      </li>
                    ))}
                  </ul>

                  {/* PRICE */}
                  <div className="mt-6 text-center">
                    <p className="text-2xl md:text-3xl font-black text-gray-900">
                      {Number(plan.price) === 0
                        ? "FREE"
                        : `₹${plan.price}`}
                    </p>

                    {Number(plan.price) !== 0 && (
                      <p className="text-[11px] text-gray-400">
                        + 18% GST applicable
                      </p>
                    )}
                  </div>
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
            {loading ? "Processing..." : "Subscribe Now"}
          </button>
        </div>

      </div>
    </section>
  );
}