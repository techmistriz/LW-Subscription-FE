// "use client";

// import { useState, useCallback } from "react";
// import { useRouter } from "next/navigation";
// import { useDispatch } from "react-redux";
// // import { setPlanSelection } from "@/redux/slices/subscriptionSlice";

// /* ---------------- Static Plan Config ----------------
//    UI metadata only (colors, labels, pricing display)
// ----------------------------------------------------- */
// const planDetails = [
//   {
//     id: 1,
//     name: "Free",
//     color: "text-gray-500",
//     bg: "peer-checked:bg-gray-50",
//     border: "peer-checked:border-gray-900",
//     detail: "1 Month is on Us",
//     sub: "Trial Access",
//     price: "0",
//   },
//   {
//     id: 2,
//     name: "Silver",
//     color: "text-slate-400",
//     bg: "peer-checked:bg-slate-50",
//     border: "peer-checked:border-slate-400",
//     detail: "12 Editions of Print",
//     sub: "1 Year of Digital Access",
//     price: "1,000",
//   },
//   {
//     id: 3,
//     name: "Gold",
//     color: "text-amber-500",
//     bg: "peer-checked:bg-amber-50",
//     border: "peer-checked:border-amber-500",
//     detail: "24 Editions of Print",
//     sub: "2 Year of Digital Access",
//     price: "1,800",
//   },
//   {
//     id: 4,
//     name: "Platinum",
//     color: "text-indigo-400",
//     bg: "peer-checked:bg-indigo-50",
//     border: "peer-checked:border-indigo-400",
//     detail: "36 Editions of Print",
//     sub: "3 Year of Digital Access",
//     price: "2,500",
//   },
// ];

// /* ---------------- MAIN COMPONENT ---------------- */
// export default function PricingCard() {
//   const router = useRouter();
//   const dispatch = useDispatch();

//   /* ---------------- Selected Plan State ---------------- */
//   const [selectedPlanId, setSelectedPlanId] = useState<number>(2);
//   const [loading, setLoading] = useState(false);

//   /* ---------------- Plan Selection Handler ----------------
//      Updates selected plan in UI
//   -------------------------------------------------------- */
//   const handlePlanChange = useCallback((id: number) => {
//     setSelectedPlanId(id);
//   }, []);

//   /* ---------------- Subscribe Handler ----------------
//      1. Store selected plan (Redux optional)
//      2. Redirect to register page
//   ---------------------------------------------------- */
//   const handleSubscribe = useCallback(() => {
//     setLoading(true);

//     // Optional Redux persistence
//     // dispatch(setPlanSelection(selectedPlanId));

//     router.push("/register");
//   }, [router, selectedPlanId]);

//   /* ---------------- UI ---------------- */
//   return (
//     <div
//       id="pricing"
//       className="bg-white py-20 px-6 max-w-6xl mx-auto font-sans"
//     >
//       {/* Header */}
//       <div className="text-center mb-12">
//         <h2 className="text-3xl font-black uppercase tracking-tight text-gray-900">
//           Select Your Plan
//         </h2>
//         <div className="w-16 h-1 bg-[#c9060a] mx-auto mt-4" />
//       </div>

//       {/* Plan Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//         {planDetails.map((plan) => (
//           <label key={plan.id} className="relative cursor-pointer">
//             <input
//               type="radio"
//               name="plan"
//               className="peer sr-only"
//               checked={selectedPlanId === plan.id}
//               onChange={() => handlePlanChange(plan.id)}
//             />

//             {/* Plan Card */}
//             <div
//               className={`h-full p-8 text-center flex flex-col items-center border-2 border-gray-100 rounded-2xl transition-all duration-200
//               ${plan.bg} ${plan.border} peer-checked:shadow-inner`}
//             >
//               {/* Selection Indicator */}
//               <div className="w-5 h-5 border-2 border-gray-300 rounded-full mb-4 flex items-center justify-center">
//                 {selectedPlanId === plan.id && (
//                   <div className="w-2.5 h-2.5 bg-[#c9060a] rounded-full" />
//                 )}
//               </div>

//               {/* Plan Name */}
//               <h3
//                 className={`text-xl font-black uppercase tracking-widest ${plan.color} mb-4`}
//               >
//                 {plan.name}
//               </h3>

//               {/* Plan Details */}
//               <div className="flex-grow space-y-2">
//                 <p className="text-gray-800 font-bold text-sm">
//                   {plan.detail}
//                 </p>
//                 <p className="text-gray-500 text-[10px] uppercase tracking-wider">
//                   {plan.sub}
//                 </p>
//               </div>

//               {/* Price */}
//               <div className="mt-8">
//                 <p className="text-2xl font-black text-gray-900">
//                   {plan.price === "0" ? "FREE" : `₹${plan.price}/-`}
//                 </p>

//                 {plan.price !== "0" && (
//                   <p className="text-[10px] text-gray-400 font-bold">
//                     + 18% GST
//                   </p>
//                 )}
//               </div>
//             </div>
//           </label>
//         ))}
//       </div>

//       {/* CTA Button */}
//       <div className="flex justify-center mt-12">
//         <button
//           onClick={handleSubscribe}
//           disabled={loading}
//           className="bg-[#c9060a] text-white px-20 py-4 rounded-xl font-bold text-lg hover:bg-[#333] transition-all active:scale-95 shadow-xl shadow-red-500/20 disabled:opacity-50"
//         >
//           {loading ? "CONTINUING..." : "SUBSCRIBE NOW"}
//         </button>
//       </div>
//     </div>
//   );
// } 


"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setSubscription } from "@/redux/store/slices/subscriptionSlice";
// import { setPlanSelection } from "@/redux/slices/subscriptionSlice";

/* ---------------- PLAN CONFIG ---------------- */
const planDetails = [
  {
    id: 1,
    name: "Free",
    color: "text-gray-500",
    bg: "peer-checked:bg-gray-50",
    border: "peer-checked:border-gray-900",
    detail: "1 Month is on Us",
    sub: "Trial Access",
    price: "0",
    badge: "Starter",
  },
  {
    id: 2,
    name: "Silver",
    color: "text-slate-600",
    bg: "peer-checked:bg-slate-50",
    border: "peer-checked:border-slate-500",
    detail: "12 Editions of Print",
    sub: "1 Year Digital Access",
    price: "1,000",
    badge: "Most Popular",
  },
  {
    id: 3,
    name: "Gold",
    color: "text-amber-500",
    bg: "peer-checked:bg-amber-50",
    border: "peer-checked:border-amber-500",
    detail: "24 Editions of Print",
    sub: "2 Year Digital Access",
    price: "1,800",
    badge: "",
  },
  {
    id: 4,
    name: "Platinum",
    color: "text-indigo-500",
    bg: "peer-checked:bg-indigo-50",
    border: "peer-checked:border-indigo-500",
    detail: "36 Editions of Print",
    sub: "3 Year Digital Access",
    price: "2,500",
    badge: "Best Value",
  },
];

/* ---------------- COMPONENT ---------------- */
export default function PricingCard() {
  const router = useRouter();
  const dispatch = useDispatch();

  const [selectedPlanId, setSelectedPlanId] = useState<number>(2);
  const [loading, setLoading] = useState(false);

const handleSubscribe = useCallback(() => {
  setLoading(true);

  const selectedPlan = planDetails.find(
    (p) => p.id === selectedPlanId
  );

  if (selectedPlan) {
    dispatch(
      setSubscription({
        plan_id: selectedPlan.id,
        name: selectedPlan.name,
        amount: Number(selectedPlan.price),
        duration_value:
          selectedPlan.id === 1 ? 1 :
          selectedPlan.id === 2 ? 1 :
          selectedPlan.id === 3 ? 2 : 3,
        duration_unit: "year",
      })
    );
  }

  router.push("/register");
}, [router, selectedPlanId, dispatch]);

  return (
    <section
      id="pricing"
      className=" max-w-6xl m-auto to-gray-50 py-24 px-6"
    >
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
        {planDetails.map((plan) => {
          const isSelected = selectedPlanId === plan.id;

          return (
            <label
              key={plan.id}
              className="relative cursor-pointer group"
            >
              <input
                type="radio"
                name="plan"
                className="peer sr-only"
                checked={isSelected}
                onChange={() => setSelectedPlanId(plan.id)}
              />

              {/* CARD */}
              <div
                className={`
                  relative h-full p-8 rounded-2xl border-2 border-gray-300 transition-all duration-300
                  bg-white shadow-sm
                  hover:shadow-xl hover:-translate-y-1
                  ${plan.border}
                  ${isSelected ? "shadow-2xl scale-[1.02]" : ""}
                `}
              >
                {/* BADGE */}
                {plan.badge && (
                  <div className="absolute top-4 right-4">
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full
                      ${
                        plan.badge === "Most Popular"
                          ? "bg-[#333] text-white"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {plan.badge}
                    </span>
                  </div>
                )}

                {/* RADIO DOT */}
                <div className="flex justify-center mb-6">
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all
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

                {/* TITLE */}
                <h3
                  className={`text-xl font-black uppercase tracking-widest text-center mb-3 ${plan.color}`}
                >
                  {plan.name}
                </h3>

                {/* DETAILS */}
                <div className="text-center space-y-1 min-h-[70px]">
                  <p className="text-gray-800 font-semibold text-sm">
                    {plan.detail}
                  </p>
                  <p className="text-gray-500 text-[11px] uppercase tracking-wide">
                    {plan.sub}
                  </p>
                </div>

                {/* PRICE */}
                <div className="mt-8 text-center">
                  <p className="text-3xl font-black text-gray-900">
                    {plan.price === "0" ? "FREE" : `₹${plan.price}`}
                  </p>
                  {plan.price !== "0" && (
                    <p className="text-[11px] text-gray-400 font-medium">
                      + 18% GST applicable
                    </p>
                  )}
                </div>

                {/* SELECTED STATE GLOW */}
                {isSelected && (
                  <div className="absolute inset-0 rounded-2xl border-2 border-[#c9060a] pointer-events-none" />
                )}
              </div>
            </label>
          );
        })}
      </div>

      {/* CTA */}
      <div className="flex justify-center mt-14">
        <button
          onClick={handleSubscribe}
          disabled={loading}
          className="
            bg-[#c9060a] text-white px-18 py-3 rounded-xl
            font-bold text-lg uppercase tracking-widest
            hover:bg-[#333] transition-all duration-300
            active:scale-95 shadow-xl shadow-red-500/20
            disabled:opacity-50
            cursor-pointer
          "
        >
          {loading ? "Processing..." : "Subscribe Now"}
        </button>
      </div>
    </section>
  );
}