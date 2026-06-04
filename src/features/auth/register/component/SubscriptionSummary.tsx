"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

import { Plan } from "@/types/register.types";

interface SubscriptionSummaryProps {
  selectedPlan: Plan | undefined;
  otherPlans: Plan[];
  formPlan: string;
  loading: boolean;
  onPlanSelect: (planId: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function SubscriptionSummary({
  selectedPlan,
  otherPlans,
  formPlan,
  loading,
  onPlanSelect,
  onSubmit,
}: SubscriptionSummaryProps) {
  const searchParams = useSearchParams();

  /* ---------------- PRESELECT PLAN FROM URL ---------------- */
  useEffect(() => {
    const planFromUrl = searchParams.get("plan");

    if (!planFromUrl) return;

    // avoid overwriting user action
    if (formPlan) return;

    onPlanSelect(planFromUrl);
  }, [searchParams, formPlan, onPlanSelect]);

  const price = Number(selectedPlan?.price || 0);

  const isFree = price === 0;

  const gst = isFree ? 0 : price * 0.18;

  const total = isFree ? 0 : price + gst;

  return (
    <div className="bg-white p-6 border border-gray-200 shadow-sm rounded-xl sticky top-10 h-167.5 flex flex-col">
      <h2 className="text-xl font-bold text-gray-800 uppercase tracking-tight border-b pb-4">
        Subscription Summary
      </h2>

      <div className="space-y-4 max-h-105 overflow-y-auto pr-2 custom-scrollbar">
        {/* Selected Plan */}
        <div className="min-h-22.5 mt-2">
          {selectedPlan ? (
            <div>
              <h3 className="text-[11px] font-bold uppercase text-[#c9060a] mb-2 tracking-wider">
                Selected Plan
              </h3>

              <div className="p-4 rounded-xl border-2 border-[#c9060a] bg-red-50 shadow-md">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-sm uppercase">
                    {selectedPlan.name}
                  </span>

                  <span className="text-sm font-bold text-[#c9060a]">
                    {Number(selectedPlan.price) === 0
                      ? "0.00"
                      : `₹${selectedPlan.price}`}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-xs text-gray-400 italic">No plan selected</div>
          )}
        </div>

        {/* Other Plans */}
        {otherPlans.length > 0 && (
          <div>
            <h3 className="text-[11px] font-bold uppercase text-gray-400 mb-2 tracking-wider">
              Other Plans
            </h3>

            <div className="space-y-3">
              {otherPlans.map((plan) => (
                <div
                  key={plan.id}
                  onClick={() => onPlanSelect(String(plan.id))}
                  className="cursor-pointer p-4 rounded-xl border-2 border-gray-100 hover:border-gray-200 transition-all"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-sm uppercase">
                      {plan.name}
                    </span>

                    <span className="text-sm font-bold text-[#333]">
                      ₹{plan.price}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Order Summary */}
      {formPlan && (
        <div className="bg-gray-50 p-5 mt-4 rounded-xl space-y-3 border border-gray-100">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500 font-medium">Base Price</span>

            <span className="font-bold">{isFree ? "FREE" : `₹${price}`}</span>
          </div>

          {/* GST */}
          {!isFree && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 font-medium">GST (18%)</span>

              <span className="font-bold text-red-600">
                + ₹{gst.toFixed(2)}
              </span>
            </div>
          )}

          <div className="pt-3 border-t border-gray-200 flex justify-between items-center">
            <span className="text-xs font-bold uppercase text-gray-800">
              Total Payable
            </span>

            <span className="text-xl font-bold text-[#c9060a]">
              {isFree ? "₹0.00" : `₹${total.toFixed(2)}`}
            </span>
          </div>

          {/* Free Note */}
          {isFree && (
            <p className="text-green-600 text-xs font-bold text-center uppercase tracking-wide">
              Free Plan – No charges applicable
            </p>
          )}
        </div>
      )}

      <form onSubmit={onSubmit} className="pt-2">
        <button
          type="submit"
          disabled={loading || !selectedPlan}
          className="w-full bg-[#c9060a] text-white py-3 cursor-pointer font-bold uppercase tracking-widest hover:bg-[#333] transition-all disabled:opacity-50 shadow-lg shadow-red-100"
        >
          {loading
            ? "Processing..."
            : Number(selectedPlan?.price) === 0
              ? "Subscribe Now"
              : "Pay Now"}
        </button>

        <p className="text-center text-[10px] text-gray-400 mt-3 italic font-bold uppercase tracking-tighter">
          Please verify your contact number to proceed
        </p>
      </form>
    </div>
  );
}
