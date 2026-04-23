"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getMembershipPlans } from "@/features/auth/services/plans";
import { useAppSelector } from "@/redux/store/hooks";

export default function PricingCard() {
  const [plans, setPlans] = useState<any[]>([]);
  const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null);

  const subscription = useAppSelector((state) => state.subscription.data);

  // Fetch plans + set default selection
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await getMembershipPlans(0);
        const data = Array.isArray(res) ? res : (res?.data ?? []);

        setPlans(data);

        if (subscription?.plan_id) {
          setSelectedPlanId(Number(subscription.plan_id));
        } else if (data.length > 0) {
          setSelectedPlanId(data[0].id);
        }
      } catch (error) {
        console.error("Failed to load plans:", error);
        setPlans([]);
      }
    };

    fetchPlans();
  }, [subscription]);

  const currentPlan = plans.find((p) => p.id === selectedPlanId) || plans[0];

  const status = subscription?.status?.toUpperCase();
  const isActive = status === "ACTIVE";
  const isExpired = status === "EXPIRED";

  const isCurrentPlan =
    subscription?.plan_id &&
    Number(subscription.plan_id) === Number(selectedPlanId);

  const getActionLabel = () => {
    if (!subscription) return "START MY FREE MONTH";

    if (isCurrentPlan && isActive) return "CURRENT PLAN";
    if (isCurrentPlan && isExpired) return "RENEW PLAN";
    if (!isCurrentPlan && isActive) return "UPGRADE PLAN";
    if (!isCurrentPlan && isExpired) return "BUY PLAN";

    return "START MY FREE MONTH";
  };

  const isDisabled = isCurrentPlan && isActive;

  // Right card helper

  const sortedPlans = [...plans].sort(
    (a, b) => Number(a.price) - Number(b.price),
  );

  const currentIndex = sortedPlans.findIndex(
    (p) => Number(p.id) === Number(selectedPlanId),
  );

  // 👉 next higher OR fallback to highest
  const rightPlan =
    currentIndex !== -1 && currentIndex < sortedPlans.length - 1
      ? sortedPlans[currentIndex + 1]
      : sortedPlans[sortedPlans.length - 1];

  const isRightCurrent =
    subscription?.plan_id &&
    Number(subscription.plan_id) === Number(rightPlan?.id);

  const isRightDisabled = isRightCurrent && isActive;

  const getRightLabel = () => {
    if (!subscription) return "GET INSTANT ACCESS";

    if (isRightCurrent && isActive) return "CURRENT PLAN";
    if (isRightCurrent && isExpired) return "RENEW PLAN";
    if (!isRightCurrent && isActive) return "UPGRADE PLAN";
    if (!isRightCurrent && isExpired) return "BUY PLAN";

    return "GET INSTANT ACCESS";
  };

  return (
    <div id="pricing" className="flex items-center justify-center px-6 py-20">
      <div className="grid md:grid-cols-2 gap-10 max-w-3xl w-full">
        {/* LEFT CARD */}
        <div className="relative bg-white rounded-2xl border-4 border-red-500 shadow-xl overflow-hidden">
          <div className="bg-[#c9060a] italic text-white text-center py-2 text-xl font-bold">
            Recommended
          </div>

          <div className="text-center">
            <h2 className="text-3xl font-bold mb-1 py-4">Digital + Print</h2>

            <p className="text-gray-500 mb-3 text-xs">
              {currentPlan?.duration_value ?? "-"}{" "}
              {currentPlan?.duration_unit ?? ""} | Print Editions + Unlimited
              Digital Access
            </p>

            <ul className="text-left space-y-3 text-gray-700 mb-3 px-4 text-[13px]">
              <li>• Your First Month Is on Us</li>
              <li>• ₹{currentPlan?.price ?? 0} / year thereafter</li>
              <li>• ₹1 will be charged & refunded to activate subscription</li>
            </ul>

            {/* RADIO */}
            <div className="flex justify-center gap-4 mb-6">
              {plans.map((p) => (
                <label
                  key={p.id}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl cursor-pointer border
                    ${
                      selectedPlanId === p.id
                        ? "bg-red-100 border-red-500"
                        : "bg-gray-100 border-gray-300"
                    }`}
                >
                  <input
                    type="radio"
                    name="plan"
                    checked={selectedPlanId === p.id}
                    onChange={() => setSelectedPlanId(p.id)}
                  />
                  {p.duration_value}Y
                </label>
              ))}
            </div>

            {/* PRICE */}
            <div className="bg-gray-300">
              <div className="mb-2 text-gray-400 line-through text-xl">
                ₹{currentPlan ? Number(currentPlan.price) + 300 : 0}
              </div>

              <div className="text-2xl font-semibold text-[#c9060a] mb-2">
                ₹{currentPlan?.price ?? 0}
                <span className="text-gray-500 text-sm font-medium">
                  {" "}
                  / {currentPlan?.duration_value ?? "-"} Yr
                </span>
              </div>

              <div className="text-sm text-[#c9060a] mb-6">
                (100% Off)
                <span className="text-gray-500 text-[14px]">
                  {" "}
                  | Cancel anytime
                </span>
              </div>

              <div className="flex justify-center mb-6">
                <div className="w-40 h-40 bg-gray-100 rounded-full flex items-center justify-center">
                  <span className="text-gray-400">Magazine Image</span>
                </div>
              </div>

              {/* BUTTON */}
              {isDisabled ? (
                <button
                  disabled
                  className="bg-[#c9060a] text-white px-8 py-1 rounded-xl text-sm mb-6 opacity-50 cursor-not-allowed"
                >
                  {getActionLabel()}
                </button>
              ) : (
                <Link href="/subscription">
                  <button className="bg-[#c9060a] text-white px-8 py-1 rounded-xl text-sm mb-6 cursor-pointer">
                    {getActionLabel()}
                  </button>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT CARD */}
        {rightPlan && (
          <div className="relative bg-white rounded-2xl h-150 shadow-lg overflow-hidden">
            <div className="text-center">
              <h2 className="text-3xl font-semibold my-3">
                {rightPlan?.name || "Digital"}
              </h2>

              <p className="text-gray-500 mb-3 text-xs">
                {rightPlan?.duration_value ?? "1"}{" "}
                {rightPlan?.duration_unit ?? "Yr"} | Unlimited Digital Access
              </p>

              <ul className="text-left space-y-3 text-[14px] text-gray-700 mb-6 pl-4">
                <li>• Start reading instantly</li>
                <li>• PDF download for offline reading</li>
                <li>• Access our timeless archives</li>
              </ul>

              <div className="relative bg-gray-300 overflow-hidden">
                <div className="absolute top-6 right-[-40px] rotate-45 bg-[#c9060a] text-white text-sm px-10 py-1 font-semibold shadow-md">
                  Save ₹{rightPlan ? Number(rightPlan.price) + 4201 : 0}
                </div>

                <div className="text-gray-400 line-through text-xl mb-2">
                  ₹{rightPlan ? Number(rightPlan.price) + 4200 : 0}
                </div>

                <div className="text-5xl font-semibold mb-2">
                  ₹{rightPlan?.price ?? 0}
                  <span className="text-lg text-gray-500">
                    {" "}
                    / {rightPlan?.duration_value ?? "1"} Yr
                  </span>
                </div>

                <div className="text-sm text-[#c9060a] mb-10">(Best Value)</div>

                <div className="flex justify-center mb-10">
                  <div className="w-40 h-40 bg-gray-100 rounded-full flex items-center justify-center">
                    <span className="text-gray-400">Image</span>
                  </div>
                </div>

                {isRightDisabled ? (
                  <button
                    disabled
                    className="bg-[#c9060a] text-white px-6 rounded-xl mb-10 opacity-50 cursor-not-allowed"
                  >
                    {getRightLabel()}
                  </button>
                ) : (
                  <Link href="/subscription">
                    <button className="bg-[#c9060a] text-white px-6 rounded-xl cursor-pointer mb-10">
                      {getRightLabel()}
                    </button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
