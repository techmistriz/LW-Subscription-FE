"use client";

import { useState } from "react";

export default function PricingCard() {
  const [plan, setPlan] = useState("1y");

  return (
    <div className=" flex items-center justify-center px-6 py-20">
      <div className="grid md:grid-cols-2 gap-10 max-w-3xl h-auto w-full">
        {/* LEFT FEATURED CARD */}
        <div className="relative bg-white rounded-2xl border-4 border-red-500 shadow-xl overflow-hidden">
          {/* Top Red Banner */}
          <div className="bg-[#c9060a] italic text-white text-center py-2 text-xl font-bold">
            Recommended
          </div>

          <div className=" text-center">
            <h2 className="text-3xl font-bold mb-1 py-4">Digital + Print</h2>

            <p className="text-gray-500 mb-3 text-xs">
              1 Year | Print Editions + Unlimited Digital Access
            </p>

            <ul className="text-left space-y-3 text-gray-700 mb-3 px-4 text-[13px]">
              <li>• Your First Month Is on Us</li>
              <li>• ₹599 / year thereafter</li>
              <li>• ₹1 will be charged & refunded to activate subscription</li>
            </ul>

            {/* Toggle */}
            <div className="flex justify-center gap-4 mb-6">
              <label className="flex items-center border border-gray-300 gap-2 bg-gray-100 px-4 py-2 rounded-xl cursor-pointer">
                <input
                  type="radio"
                  checked={plan === "1y"}
                  onChange={() => setPlan("1y")}
                />
                1 Yr
              </label>

              <label className="flex items-center border border-gray-300 gap-2 bg-gray-100 px-4 py-2 rounded-xl cursor-pointer">
                <input
                  type="radio"
                  checked={plan === "2y"}
                  onChange={() => setPlan("2y")}
                />
                2 Yr
              </label> <label className="flex items-center border border-gray-300 gap-2 bg-gray-100 px-4 py-2 rounded-xl cursor-pointer">
                <input
                  type="radio"
                  checked={plan === "3y"}
                  onChange={() => setPlan("3y")}
                />
                3 Yr
              </label>
            </div>

            {/* Price */}
            <div className="bg-gray-300">

            <div className="mb-2 text-gray-400 line-through text-xl">₹299</div>

            <div className="text-2xl font-semibold text-[#c9060a] mb-2">
              Free{" "}
              <span className="text-gray-500 text-sm font-medium">
                / 1 Month
              </span>
            </div>

            <div className="text-sm text-[#c9060a] mb-6">
              (100% Off) <span className="text-gray-500 text-[14px]">| Cancel anytime</span>
            </div>

            {/* Image Placeholder */}
            <div className="flex justify-center mb-6">
              <div className="w-40 h-40 bg-gray-100 rounded-full flex items-center justify-center">
                <span className="text-gray-400">Magazine Image</span>
              </div>
            </div>

            <button className="bg-[#c9060a] hover:bg-[#c9060a] transition mb-6 text-white px-8 py-1 rounded-xl text-sm">
              START MY FREE MONTH
            </button>
            </div>

          </div>
        </div>

        {/* RIGHT CARD */}
        <div className="relative bg-white rounded-2xl h-150 shadow-lg overflow-hidden">
          {/* Ribbon */}

          <div className=" text-center">
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
                ₹999
                <span className="text-lg text-gray-500 font-medium">
                  {" "}
                  / 1 Yr
                </span>
              </div>

              <div className="text-sm text-[#c9060a] mb-10">
                (81% Off){" "}
                <span className="text-gray-500 text-[12px]">| Cancel anytime</span>
              </div>

              {/* Image Placeholder */}
              <div className="flex justify-center mb-10">
                <div className="w-40 h-40 bg-gray-100 rounded-full flex items-center justify-center">
                  <span className="text-gray-400">Image</span>
                </div>
              </div>

              <button className="bg-[#c9060a]  hover:bg-[#c9060a] mb-10 transition text-white px-6  rounded-xl ">
                GET INSTANT ACCESS
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
