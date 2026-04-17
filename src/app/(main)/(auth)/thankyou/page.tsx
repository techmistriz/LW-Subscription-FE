"use client";

import { useRouter } from "next/navigation";

export default function ThankYou() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="bg-white shadow-lg -mt-30 rounded-2xl p-8 max-w-md w-full text-center">
        
        {/* Icon */}
        <div className="text-green-500 text-5xl mb-4">✔</div>

        {/* Title */}
        <h1 className="text-2xl font-semibold mb-2">
          {/* Payment Successful! */}
          Thank You!
        </h1>

        {/* Description */}
        <p className="text-gray-600 mb-6">
          Your subscription has been activated successfully.
          You can now access premium articles.
        </p>

        {/* Plan Info */}
        <div className="bg-gray-100 rounded-lg p-4 mb-6 text-sm">
          <p><strong>Plan:</strong> Premium</p>
          <p><strong>Amount:</strong> ₹199</p>
          <p><strong>Status:</strong> Active</p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-3">
          <button
            onClick={() => router.push("/dashboard")}
            className="w-full bg-[#c6090a] hover:bg-[#333] cursor-pointer text-white py-2 rounded-lg"
          >
            Go to Dashboard
          </button>

          <button
            onClick={() => router.push("/")}
            className="w-full border font-medium py-2 rounded-lg cursor-pointer hover:shadow-xl"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}