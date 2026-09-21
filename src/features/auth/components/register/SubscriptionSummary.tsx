"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

import type { SubscriptionPlan } from "@/types/models";

interface SubscriptionSummaryProps {
  selectedPlan: SubscriptionPlan | undefined;
  otherPlans: SubscriptionPlan[];
  formPlan: string;
  loading: boolean;
  onPlanSelect: (planId: string) => void;
}

export default function SubscriptionSummary({
  selectedPlan,
  otherPlans,
  formPlan,
  loading,
  onPlanSelect,
}: SubscriptionSummaryProps) {
  const searchParams = useSearchParams();

  /* ---------------- PRESELECT PLAN FROM URL ---------------- */

  useEffect(() => {
    const planFromUrl = searchParams.get("plan");

    if (!planFromUrl) return;

    // Avoid overwriting user selection
    if (formPlan) return;

    onPlanSelect(planFromUrl);
  }, [searchParams, formPlan, onPlanSelect]);

  const price = Number(selectedPlan?.price || 0);
  const isFree = price === 0;
  const gst = isFree ? 0 : price * 0.18;
  const total = isFree ? 0 : price + gst;

  return (
    <div className="sticky top-10 flex h-165.5 flex-col rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="border-b pb-4 text-xl font-bold uppercase tracking-tight text-gray-800">
        Subscription Summary
      </h2>

      <div className="max-h-105 space-y-4 overflow-y-auto pr-2 custom-scrollbar">
        {/* Selected Plan */}
        <div className="mt-2 min-h-22.5">
          {selectedPlan ? (
            <div>
              <h3 className="mb-2 text-[11px] font-bold uppercase tracking-wider text-[#c8050b]">
                Selected Plan
              </h3>

              <div className="rounded-xl border-2 border-[#c8050b] bg-red-50 p-4 shadow-md">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold uppercase">
                    {selectedPlan.name}
                  </span>

                  <span className="text-sm font-bold text-[#c8050b]">
                    {Number(selectedPlan.price) === 0
                      ? "0.00"
                      : `₹${selectedPlan.price}`}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-xs italic text-gray-400">No plan selected</div>
          )}
        </div>

        {/* Other Plans */}
        {otherPlans.length > 0 && (
          <div>
            <h3 className="mb-2 text-[11px] font-bold uppercase tracking-wider text-gray-400">
              Other Plans
            </h3>

            <div className="space-y-3">
              {otherPlans.map((plan) => (
                <button
                  key={plan.id}
                  type="button"
                  onClick={() => onPlanSelect(String(plan.id))}
                  className="w-full cursor-pointer rounded-xl border-2 border-gray-100 p-4 text-left transition-all hover:border-gray-200"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold uppercase">
                      {plan.name}
                    </span>

                    <span className="text-sm font-bold text-[#333]">
                      ₹{plan.price}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Order Summary */}
      {formPlan && (
        <div className="mt-4 space-y-3 rounded-xl border border-gray-100 bg-gray-50 p-5">
          <div className="flex justify-between text-sm">
            <span className="font-medium text-gray-500">Base Price</span>

            <span className="font-bold">{isFree ? "FREE" : `₹${price}`}</span>
          </div>

          {/* GST */}
          {!isFree && (
            <div className="flex justify-between text-sm">
              <span className="font-medium text-gray-500">GST (18%)</span>

              <span className="font-bold text-red-600">
                + ₹{gst.toFixed(2)}
              </span>
            </div>
          )}

          <div className="flex items-center justify-between border-t border-gray-200 pt-3">
            <span className="text-xs font-bold uppercase text-gray-800">
              Total Payable
            </span>

            <span className="text-xl font-bold text-[#c8050b]">
              {isFree ? "₹0.00" : `₹${total.toFixed(2)}`}
            </span>
          </div>

          {/* Free Note */}
          {isFree && (
            <p className="text-center text-xs font-bold uppercase tracking-wide text-green-600">
              Free Plan – No charges applicable
            </p>
          )}
        </div>
      )}

      {/* Submit Button */}
      <div className="pt-6">
        <button
          type="submit"
          disabled={loading || !selectedPlan}
          className="w-full cursor-pointer bg-[#c8050b] py-3 font-bold uppercase tracking-widest text-white shadow-lg shadow-red-100 transition-all hover:bg-[#333] disabled:opacity-50"
        >
          {loading
            ? "Processing..."
            : Number(selectedPlan?.price) === 0
              ? "Subscribe Now"
              : "Pay Now"}
        </button>

        {/* <p className="mt-3 text-center text-[10px] font-bold uppercase italic tracking-tighter text-gray-400">
          Please verify your contact number to proceed
        </p> */}
      </div>
    </div>
  );
}
