"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getMembershipPlans } from "@/features/auth/services/plans";

export default function PricingCard() {
  const [plans, setPlans] = useState<any[]>([]);
  const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await getMembershipPlans(0); // is_trial = 0
        const data = Array.isArray(res) ? res : res?.data ?? [];

        setPlans(data);

        if (data.length > 0) {
          setSelectedPlanId(data[0].id);
        }
      } catch (error) {
        console.error("Failed to load plans:", error);
        setPlans([]);
      }
    };

    fetchPlans();
  }, []);

  const currentPlan =
    plans.find((p) => p.id === selectedPlanId) || plans[0];

  return (
    <div id="pricing" className="flex items-center justify-center px-6 py-20">
      <div className="grid md:grid-cols-2 gap-10 max-w-3xl w-full">

        {/* LEFT CARD */}
        <div className="relative bg-white rounded-2xl border-4 border-red-500 shadow-xl overflow-hidden">

          <div className="bg-[#c9060a] italic text-white text-center py-2 text-xl font-bold">
            Recommended
          </div>

          <div className="text-center">

            <h2 className="text-3xl font-bold mb-1 py-4">
              Digital + Print
            </h2>

            <p className="text-gray-500 mb-3 text-xs">
              {currentPlan?.duration_value ?? "-"}{" "}
              {currentPlan?.duration_unit ?? ""} | Print Editions + Unlimited Digital Access
            </p>

            <ul className="text-left space-y-3 text-gray-700 mb-3 px-4 text-[13px]">
              <li>• Your First Month Is on Us</li>
              <li>• ₹{currentPlan?.price ?? 0} / year thereafter</li>
              <li>• ₹1 will be charged & refunded to activate subscription</li>
            </ul>

            {/* RADIO BUTTONS */}
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
                ₹{currentPlan?.price ?? 0}{" "}
                <span className="text-gray-500 text-sm font-medium">
                  / {currentPlan?.duration_value ?? "-"} Yr
                </span>
              </div>

              <div className="text-sm text-[#c9060a] mb-6">
                (100% Off){" "}
                <span className="text-gray-500 text-[14px]">
                  | Cancel anytime
                </span>
              </div>

              <div className="flex justify-center mb-6">
                <div className="w-40 h-40 bg-gray-100 rounded-full flex items-center justify-center">
                  <span className="text-gray-400">Magazine Image</span>
                </div>
              </div>

              <Link href="/register">
                <button className="bg-[#c9060a] text-white px-8 py-1 rounded-xl text-sm mb-6 cursor-pointer">
                  START MY FREE MONTH
                </button>
              </Link>

            </div>
          </div>
        </div>

        {/* RIGHT CARD (UNCHANGED) */}
        <div className="relative bg-white rounded-2xl h-150 shadow-lg overflow-hidden">

          <div className="text-center">

            <h2 className="text-3xl font-semibold my-3">Digital</h2>

            <p className="text-gray-500 mb-3 text-xs">
              1 Yr | Unlimited Digital Access
            </p>

            <ul className="text-left space-y-3 text-[14px] text-gray-700 mb-6 pl-4">
              <li>• Start reading instantly</li>
              <li>• PDF download for offline reading</li>
              <li>• Access our timeless archives</li>
            </ul>

            <div className="relative bg-gray-300 overflow-hidden">

              <div className="absolute top-6 right-[-40px] rotate-45 bg-[#c9060a] text-white text-sm px-10 py-1 font-semibold shadow-md">
                Save ₹4201
              </div>

              <div className="text-gray-400 line-through text-xl mb-2">
                ₹5200
              </div>

              <div className="text-5xl font-semibold mb-2">
                ₹999 <span className="text-lg text-gray-500">/ 1 Yr</span>
              </div>

              <div className="text-sm text-[#c9060a] mb-10">
                (81% Off)
              </div>

              <div className="flex justify-center mb-10">
                <div className="w-40 h-40 bg-gray-100 rounded-full flex items-center justify-center">
                  <span className="text-gray-400">Image</span>
                </div>
              </div>

              <Link href="/register">
                <button className="bg-[#c9060a] text-white px-6 rounded-xl cursor-pointer mb-10">
                  GET INSTANT ACCESS
                </button>
              </Link>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}