"use client";

import { useAppSelector } from "@/redux/store/hooks";
import { useRouter } from "next/navigation";

export default function ThankYou() {
  const router = useRouter();

  const { user } = useAppSelector((state) => state.auth);
  const { data: subscription } = useAppSelector((state) => state.subscription);

  const email = user?.email || "Not available";
  const planName = subscription?.name || "Your Plan";

return (
  <div className="min-h-[85vh] bg-white flex items-center justify-center px-4 pb-24">
    <div className="w-full max-w-2xl border border-gray-200 shadow-sm rounded-2xl px-8 py-14 text-center bg-white">
      
      {/* SUCCESS ICON */}
      <div className="text-green-500 text-6xl mb-6">
        ✔
      </div>

      {/* TITLE */}
      <h1 className="text-3xl sm:text-4xl font-bold text-[#333] mb-4">
        Thank You
      </h1>

      {/* MESSAGE */}
      <p className="text-lg text-gray-700 mb-3 leading-relaxed">
        Your <span className="font-semibold">{planName}</span> has been
        activated successfully.
      </p>

      <p className="text-gray-600 mb-8 leading-relaxed">
        Your login credentials have been shared with your email id{" "}
        <span className="font-medium text-[#c9060a]">
          {email}
        </span>.
      </p>

      {/* BUTTON */}
      <button
        onClick={() => router.push("/")}
        className="bg-[#c6090a] cursor-pointer hover:bg-[#333] text-white px-8 py-3  text-lg font-medium transition"
      >
        Start Your Access Now
      </button>
    </div>
  </div>
);
}
