"use client";

import PricingCard from "@/components/PricingCard/Pricing";
import {
  getLatestSingleMagazines,
} from "@/lib/api/services/magazines";
import { Magazine } from "@/types";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function SubscriptionPage() {
  const [singleMagazine, setSingleMagazine] = useState<Magazine | null>(null);

  // Fetch magazines
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

  return (
    <div className="bg-gray-100">
      {/* HERO SECTION */}
      <section className="max-w-7xl mx-auto mr-10 px-6 py-16 grid lg:grid-cols-2 gap-10 items-center">
        <div>
          <h1 className="text-4xl text-[#c9060a] font-semibold mb-6">Making Sense of India</h1>
          <p className="text-gray-600 mb-6">
            From breaking news to in-depth analysis, we bring clarity.
          </p>
          <h2 className="text-2xl font-semibold mb-6 text-[#333]">
            How Delhi should deal with the reset in Dhaka
          </h2>
          <p className="mb-8">
            The new Tarique Rahman regime in Dhaka gives India a fresh chance to
            resolve longstanding disputes with its neighbour. Also in the issue,
            expressways near completion across the country, the detection crisis
            with cancers in India, a Smart Money special on investments in 2026,
            and a Q&A with Viswanathan Anand.
          </p>
          <button className="bg-[#c9060a] text-white w-100 px-5 py-4 rounded-lg font-semibold cursor-pointer transition">
            Your first year is on us!
          </button>{" "}
          <button className=" text-[#333] w-100 border mt-4 shadow-[0_0px_15px_rgba(0,0,0,0.3)] px-5 py-4 rounded-lg font-semibold  transition cursor-pointer">
            Exclusive rates only for our existing readers - Renew Now!
          </button>
        </div>
        <div className="relative h-100 w-full ">
          <div className="relative w-full h-100 flex justify-center items-center perspective-1000">
            {singleMagazine?.image && (
              <div className="relative w-70 h-95 rounded-xl shadow-3d transform-gpu hover:rotate-y-3 hover:rotate-x-2 transition-all duration-500">
                <Image
                  src={`${process.env.NEXT_PUBLIC_MAGAZINES_BASE_URL}/${singleMagazine.image}`}
                  alt={singleMagazine.title || "Latest Magazine"}
                  fill
                  className="object-cover rounded-xl"
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="bg-red-100 py-12">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 text-center">
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

      {/* PRICING */}
      <PricingCard />     

     
    
    </div>
  );
}
