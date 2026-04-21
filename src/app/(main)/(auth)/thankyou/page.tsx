"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function ThankYou() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const plan = searchParams.get("name") || "N/A";
  const amount = searchParams.get("amount");
  const status = searchParams.get("status") || "success";

  //  define this (missing in your code)
  const isSuccess = status === "success";

  //  Proper amount formatting
  const formattedAmount =
    amount && Number(amount) > 0
      ? `₹${(Number(amount) / 100).toLocaleString("en-IN")}`
      : "0.00";

  const statusLabel = isSuccess ? "Active" : "Failed";

   useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/dashboard");
    }, 2500); 

    return () => clearTimeout(timer);
  }, [router]);


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md w-full text-center">

        {/* Icon */}
        <div className={`text-5xl mb-4 ${isSuccess ? "text-green-500" : "text-red-500"}`}>
          {isSuccess ? "✔" : "✖"}
        </div>

        {/* Title */}
        <h1 className="text-2xl font-semibold mb-2">
          {isSuccess ? "Thank You!" : "Payment Failed"}
        </h1>

        {/* Description */}
        <p className="text-gray-600 mb-6">
          {isSuccess
            ? "Your subscription has been activated successfully."
            : "Your payment was not completed. Please try again."}
        </p>

        {/* Plan Info */}
        <div className="bg-gray-100 rounded-lg p-4 mb-6 text-sm">
          <p><strong>Plan:</strong> {decodeURIComponent(plan)}</p>
          <p><strong>Amount:</strong> {formattedAmount}</p>
          <p>
            <strong>Status:</strong>{" "}
            <span className={isSuccess ? "text-green-600" : "text-red-600"}>
              {statusLabel}
            </span>
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-3">
          <button
            onClick={() => router.push("/dashboard")}
            className="w-full bg-[#c6090a] hover:bg-[#333] text-white py-2 rounded-lg"
          >
            Go to Dashboard
          </button>

          <button
            onClick={() => router.push("/")}
            className="w-full border py-2 rounded-lg hover:shadow-xl"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}