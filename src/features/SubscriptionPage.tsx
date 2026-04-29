"use client";

import LatestEdition from "@/components/LatestEdition/LatestEdition";
import PricingCard from "@/components/PricingCard/Pricing";
import {
  getLatestMagazines,
  getLatestSingleMagazines,
  latestEdition,
} from "@/lib/api/services/magazines";
import { Magazine } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { Globe, BookOpen, Star, Newspaper, Clock, Layers } from "lucide-react";

const benefits = [
  {
    title: "Unlimited Access",
    desc: "Read all articles across web and app without limits",
    icon: Globe,
  },
  {
    title: "Weekly Magazine",
    desc: "Get the latest print edition delivered to your doorstep",
    icon: BookOpen,
  },
  {
    title: "Premium Analysis",
    desc: "Expert opinions and deep-dive editorial insights",
    icon: Star,
  },
  {
    title: "Daily News Brief",
    desc: "Stay updated with concise daily summaries",
    icon: Newspaper,
  },
  {
    title: "Early Access",
    desc: "Read selected stories before they are publicly available",
    icon: Clock,
  },
  {
    title: "Archive Access",
    desc: "Explore past editions and historical articles anytime",
    icon: Layers,
  },
];

export default function SubscriptionPage() {
  const [singleMagazine, setSingleMagazine] = useState<Magazine | null>(null);
  const [latestFive, setLatestFive] = useState<Magazine[]>([]);

  /* ---------------- FETCH SINGLE MAGAZINE ---------------- */
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

  /* ---------------- FETCH LATEST MAGAZINES ---------------- */
  useEffect(() => {
    const fetchMagazines = async () => {
      try {
        const latestEditionData = await latestEdition();

        if (latestEditionData?.magazine?.id) {
          const mags = await getLatestMagazines({
            skipId: latestEditionData.magazine.id,
            limit: 5,
          });

          setLatestFive(mags || []);
        }
      } catch (err) {
        console.error("Error fetching latest magazines:", err);
      }
    };

    fetchMagazines();
  }, []);

  /* ---------------- CONTROLLED SCROLL (FIXED) ---------------- */
  useEffect(() => {
    const shouldScroll = sessionStorage.getItem("scrollToPricing");

    if (!shouldScroll) return;

    sessionStorage.removeItem("scrollToPricing");

    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }

    const scroll = () => {
      const el = document.getElementById("pricing");

      if (el) {
        el.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    };

    requestAnimationFrame(() => {
      setTimeout(scroll, 150);
    });
  }, []);

  return (
    <div className="bg-white">
      {/*----------------- HERO SECTION -----------------*/}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 grid lg:grid-cols-2 gap-10 items-center">
        {/* LEFT CONTENT */}
        <div className="text-center lg:text-left">
          <h1 className="text-3xl sm:text-4xl lg:text-4xl text-[#c9060a] font-semibold mb-6">
            Making Sense of India
          </h1>

          <p className="text-gray-600 mb-6 text-sm sm:text-base">
            From breaking news to in-depth analysis, we bring clarity.
          </p>

          <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-[#333]">
            How Delhi should deal with the reset in Dhaka
          </h2>

          <p className="mb-8 text-sm sm:text-base text-gray-700">
            The new Tarique Rahman regime in Dhaka gives India a fresh chance to
            resolve longstanding disputes with its neighbour.
          </p>

          {/* BUTTONS */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            {/* FIXED CTA (NO HASH, NO FLASH) */}
            <button
              onClick={() => {
                sessionStorage.setItem("scrollToPricing", "1");
                window.location.href = "/subscription";
              }}
              className="bg-[#c9060a] text-sm text-white px-5 py-3 font-semibold hover:bg-[#333] transition"
            >
              Your First Year is on Us
            </button>

            <button className="border text-sm border-gray-300 text-[#333] px-5 py-3 font-semibold shadow-md hover:shadow-lg transition">
              Choose your Subscription Plan
            </button>
          </div>
        </div>

        {/* RIGHT IMAGE */}
        <div className="flex justify-center lg:justify-end">
          {singleMagazine?.image && (
            <Link
              href={`/magazines/${singleMagazine.slug}`}
              className="relative w-64 sm:w-72 md:w-80 lg:w-76 aspect-[3/4] shadow-2xl overflow-hidden"
            >
              <Image
                src={`${process.env.NEXT_PUBLIC_MAGAZINES_BASE_URL}/${singleMagazine.image}`}
                alt={singleMagazine.title || "Latest Magazine"}
                fill
                className="object-cover"
              />
            </Link>
          )}
        </div>
      </section>

      {/*----------------- LATEST EDITIONS -----------------*/}
      {latestFive.length > 0 && (
        <div className="bg-gray-100 py-10">
          <LatestEdition magazines={latestFive} />
        </div>
      )}

      {/*----------------- BENEFITS SECTION -----------------*/}
      <section className="bg-white py-12">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 text-center">
          {benefits.map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={i} className="flex flex-col items-center">
                <div className="w-12 h-12 flex items-center justify-center bg-[#c9060a]/10 rounded-full mb-4">
                  <Icon className="w-6 h-6 text-[#c9060a]" />
                </div>

                <h3 className="font-semibold text-lg">{item.title}</h3>
                <p className="text-gray-600 text-sm mt-2">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/*----------------- PRICING -----------------*/}
      <div id="pricing">
        <PricingCard />
      </div>
    </div>
  );
}
