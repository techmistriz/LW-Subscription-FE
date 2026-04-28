"use client";

import PricingCard from "@/components/PricingCard/Pricing";
import { getLatestSingleMagazines } from "@/lib/api/services/magazines";
import { Magazine } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function SubscriptionPage() {
  const [singleMagazine, setSingleMagazine] = useState<Magazine | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const single = await getLatestSingleMagazines();
        setSingleMagazine(single);
      } catch (error) {
        console.error("Error fetching magazines:", error);
      }
    };
    fetchData();
  }, []);

  const scrollToPricing = () => {
    const el = document.getElementById("pricing");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="bg-gray-100">
      {/*----------------- HERO SECTION -----------------*/}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 grid lg:grid-cols-2 gap-10 items-center">
        {/*----------------- LEFT CONTENT -----------------*/}
        <div className="text-center lg:text-left">
          <h1 className="text-3xl sm:text-4xl lg:text-4xl text-[#c9060a] font-semibold mb-6">
            Making Sense of India
          </h1>

          <p className="text-gray-600 mb-6 text-sm sm:text-base">
            From breaking news to in-depth analysis, we bring clarity.
          </p>

          <h2 className="text-xl lg:text-xl sm:text-2xl font-semibold mb-4 text-[#333]">
            How Delhi should deal with the reset in Dhaka
          </h2>

          <p className="mb-8 text-sm sm:text-base text-gray-700">
            The new Tarique Rahman regime in Dhaka gives India a fresh chance to
            resolve longstanding disputes with its neighbour. Also in the issue,
            expressways near completion across the country, the detection crisis
            with cancers in India, a Smart Money special on investments in 2026,
            and a Q&A with Viswanathan Anand.
          </p>

          {/*----------------- BUTTONS -----------------*/}
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start grid lg:grid-cols-1">
            <button
              onClick={scrollToPricing}
              className="bg-[#c9060a] text-sm text-white px-6 py-3 rounded-lg font-semibold transition hover:bg-[#333] cursor-pointer"
            >
              Your First Year is on Us.
            </button>

            <button className="border text-sm border-gray-300 text-[#333] px-6 py-3 rounded-lg font-semibold shadow-md hover:shadow-lg transition cursor-pointer">
              Choose your Subscription Plan
            </button>
          </div>
        </div>

        {/*----------------- RIGHT IMAGE -----------------*/}
        <div className="flex justify-center lg:justify-end">
          {singleMagazine?.image && (
            <Link
              href={`/magazines/${singleMagazine.slug}`}
              className="relative w-64 sm:w-72 md:w-80 lg:w-86 aspect-[3/4] shadow-2xl overflow-hidden hover:shadow-2xl hover:scale-100 "
            >
              <Image
                src={`${process.env.NEXT_PUBLIC_MAGAZINES_BASE_URL}/${singleMagazine.image}`}
                alt={singleMagazine.title || "Latest Magazine"}
                fill
                className="object-cover cursor-pointer"
              />
            </Link>
          )}
        </div>
      </section>

      {/*----------------- BENEFITS SECTION -----------------*/}
      <section className="bg-red-100 py-12">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 text-center">
          <div>
            <h3 className="font-semibold text-lg">Unlimited Access</h3>
            <p className="text-gray-600 text-sm mt-2">
              Access full website and app content
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg">Weekly Magazine</h3>
            <p className="text-gray-600 text-sm mt-2">
              Get physical print delivered
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg">Premium Analysis</h3>
            <p className="text-gray-600 text-sm mt-2">
              Deep insights & archives access
            </p>
          </div>
        </div>
        <div className="max-w-6xl mt-10 mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 text-center">
          <div>
            <h3 className="font-semibold text-lg">Unlimited Access</h3>
            <p className="text-gray-600 text-sm mt-2">
              Access full website and app content
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg">Weekly Magazine</h3>
            <p className="text-gray-600 text-sm mt-2">
              Get physical print delivered
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg">Premium Analysis</h3>
            <p className="text-gray-600 text-sm mt-2">
              Deep insights & archives access
            </p>
          </div>
        </div>
      </section>

      {/*----------------- PRICING -----------------*/}
      <div className="pb-16 px-4">
        <PricingCard  />
      </div>
    </div>
  );
}
