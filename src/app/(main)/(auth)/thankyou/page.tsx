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
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-center px-6">

      {/* SUCCESS ICON */}
      <div className="text-green-500 text-6xl mb-6 -mt-30">✔</div>

      {/* TITLE */}
      <h1 className="text-3xl sm:text-4xl font-bold text-[#333] mb-4">
        Thank You
      </h1>
 {/* <p>
  Your Gold Subscription has been activated successfully.
 </p> */}
      {/* MESSAGE */}
      <p className="text-lg text-gray-700 mb-2">
        Your <span className="font-semibold">{planName}</span> has been activated successfully.
      </p>

      <p className="text-gray-600 mb-8">
        Your login credentials have been shared with you on your email id{" "}
        <span className="font-medium text-[#c9060a]">{email}</span>.
      </p>

      {/* BUTTON */}
      <button
        onClick={() => router.push("/")}
        className="bg-[#c6090a] cursor-pointer hover:bg-[#333] text-white px-8 py-3 rounded-sm text-lg font-medium transition"
      >
        Start Your Access Now
      </button>
    </div>
  );
}