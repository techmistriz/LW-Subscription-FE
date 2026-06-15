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
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/redux/store/hooks";

const benefits = [
  {
    title: "Unlimited Digital Reading",
    desc: "Access Lex Witness content anytime on desktop, tablet, or mobile.",
    icon: Globe,
  },
  {
    title: "Print Magazine Delivery",
    desc: "Get every issue delivered to your doorstep with paid plans.",
    icon: BookOpen,
  },
  {
    title: "Expert Legal Insights",
    desc: "In-depth analysis covering law, policy, and business.",
    icon: Star,
  },
  {
    title: "12–36 Print Editions",
    desc: "Receive up to 36 print editions depending on your plan.",
    icon: Newspaper,
  },
  {
    title: "Flexible Subscription Options",
    desc: "Choose from 1 month, 1 year, 2 year, or 3 year access.",
    icon: Clock,
  },
  {
    title: "Trusted Industry Coverage",
    desc: "Stay updated on developments shaping India's legal ecosystem.",
    icon: Layers,
  },
];

export default function SubscriptionPage() {
  const [singleMagazine, setSingleMagazine] = useState<Magazine | null>(null);
  const [latestFive, setLatestFive] = useState<Magazine[]>([]);
  const [imageLoading, setImageLoading] = useState(true);

  const router = useRouter();

  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  /* ---------------- FETCH SINGLE MAGAZINE ---------------- */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const single = await getLatestSingleMagazines();
        setSingleMagazine(single);
      } catch (error) {
        console.error(error);
      } finally {
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (singleMagazine?.image) {
      setImageLoading(true);
    }
  }, [singleMagazine?.image]);

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

  /* ---------------- SCROLL TO PRICING ---------------- */
  useEffect(() => {
    const shouldScroll = sessionStorage.getItem("scrollToPricing");

    const hasHash = window.location.hash === "#pricing";

    if (!shouldScroll && !hasHash) return;

    sessionStorage.removeItem("scrollToPricing");

    const timeout = setTimeout(() => {
      const el = document.getElementById("pricing");

      if (el) {
        el.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 50);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="bg-white">
      {/*----------------- HERO SECTION -----------------*/}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 grid lg:grid-cols-2 gap-12 items-center">
        {/* LEFT IMAGE */}
        <div className="flex justify-center items-center">
          <div className="relative w-56 sm:w-64 md:w-72 lg:w-80 aspect-[3/4] shadow-2xl overflow-hidden">
            {(imageLoading || !singleMagazine?.image) && (
              <div className="absolute inset-0 z-20 flex items-center justify-center bg-gray-100">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-[#c9060a]" />
              </div>
            )}

            {singleMagazine?.image && (
              <Link href={`/magazines/${singleMagazine.slug}`}>
                <Image
                  src={`${process.env.NEXT_PUBLIC_MAGAZINES_BASE_URL}/${singleMagazine.image}`}
                  alt={singleMagazine.title || "Latest Magazine"}
                  fill
                  priority
                  className="object-cover"
                  onLoad={() => setImageLoading(false)}
                />
              </Link>
            )}
          </div>
        </div>

        {/* RIGHT CONTENT */}
        <div className="text-center lg:text-left flex flex-col justify-center h-full">
          <span className="text-[#c9060a] text-xs font-bold tracking-[0.2em] uppercase">
            Latest Issue
          </span>

          <Link
            href={`/magazines/${singleMagazine?.slug}`}
            className="mt-2 text-xl lg:text-2xl font-bold text-[#333] hover:text-[#c9060a] transition leading-snug max-w-[500px]"
          >
            {singleMagazine?.magazine_name}
          </Link>

          <p className="mt-3 text-gray-600 text-sm lg:text-base max-w-lg">
            Join thousands of legal professionals, business leaders, and
            policymakers who rely on Lex Witness for trusted insights.
          </p>

          <div className="mt-6">
            <h1 className="text-3xl lg:text34xl font-black text-[#333] leading-tight">
              Your <span className="text-[#c9060a]">1st Month</span> is on Us.
            </h1>

            <div className="mt-6 space-y-4">
              <p className="flex items-center justify-center lg:justify-start gap-3 text-gray-700">
                <span className="w-5 h-5 bg-[#c9060a]/10 text-[#c9060a] rounded-full flex items-center justify-center text-xs">
                  ✓
                </span>
                Full access to Lex Witness portal
              </p>

              <p className="flex items-center justify-center lg:justify-start gap-3 text-gray-700">
                <span className="w-5 h-5 bg-[#c9060a]/10 text-[#c9060a] rounded-full flex items-center justify-center text-xs">
                  ✓
                </span>
                No card details required
              </p>

              <p className="flex items-center justify-center lg:justify-start gap-3 text-gray-700">
                <span className="w-5 h-5 bg-[#c9060a]/10 text-[#c9060a] rounded-full flex items-center justify-center text-xs">
                  ✓
                </span>
                Upgrade or Cancel anytime
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center lg:justify-start">
            <button
              disabled={isAuthenticated}
              onClick={() => router.push("/register?plan=1")}
              className={`text-sm px-6 py-3 font-semibold transition cursor-pointer ${
                isAuthenticated
                  ? "bg-gray-500 text-white cursor-not-allowed opacity-60"
                  : "bg-[#c9060a] text-white hover:bg-[#333]"
              }`}
            >
              Start First Month is on Us
            </button>

            <button
              onClick={() => {
                document.getElementById("pricing")?.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                });
              }}
              className="border border-gray-300 text-[#333] px-6 py-3 text-sm font-semibold hover:bg-gray-50 cursor-pointer"
            >
              {isAuthenticated
                ? "Choose your Upgrade Plan"
                : "Choose your Subscription Plan"}
            </button>
          </div>
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
