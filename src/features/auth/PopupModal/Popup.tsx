"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

import { Magazine } from "@/types";
import { getLatestSingleMagazines } from "@/lib/api/services/magazines";

interface PopupProps {
  onClose: () => void;
}

const Popup = ({ onClose }: PopupProps) => {
  const router = useRouter();

  const [singleMagazine, setSingleMagazine] = useState<Magazine | null>(null);

  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  /* ---------------- FETCH ---------------- */
  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      try {
        const res = await getLatestSingleMagazines();

        console.log("Single Magazine:", res);

        if (mounted && res) {
          setSingleMagazine(res);
        }
      } catch (error) {
        console.error("Error fetching magazines:", error);
      }
    };

    fetchData();

    router.prefetch("/subscription");

    return () => {
      mounted = false;
    };
  }, [router]);

  /* ---------------- DATA MAPPING ---------------- */
  const magazineName = singleMagazine?.magazine_name || "Lex Witness Magazine";

  const magazineSlug = singleMagazine?.slug || "latest";

  const imageSrc = singleMagazine?.image?.startsWith("http")
    ? singleMagazine.image
    : `${process.env.NEXT_PUBLIC_MAGAZINES_BASE_URL}/${
        singleMagazine?.image || "fallback.jpg"
      }`;

  /* ---------------- REDIRECT ---------------- */
  /* ---------------- REDIRECT ---------------- */
  const handleRedirect = () => {
    setLoading(true);

    sessionStorage.setItem("scrollToPricing", "true");

    onClose();

    window.location.href = "/subscription#pricing";
  };

  return (
    <div className="fixed inset-0 z-9999 bg-black/50 flex items-center justify-center p-4 md:p-0">
      <div className="relative flex flex-col w-full max-w-4xl overflow-y-auto bg-white border border-gray-100 shadow-2xl md:flex-row md:min-h-[520px] max-h-[95vh] md:overflow-visible">
        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute z-10 flex items-center justify-center w-9 h-9 text-[#333] transition bg-gray-100 rounded-full cursor-pointer top-4 right-4 hover:bg-[#c2b9b9]"
        >
          <span className="text-2xl leading-none">&times;</span>
        </button>

        {/* LEFT IMAGE */}
        <div className="flex items-center justify-center w-full p-4 border-b border-gray-100 md:w-5/12 bg-linear-to-b from-gray-50 to-white md:p-12 md:border-b-0 md:border-r">
          <Link
            href={`/magazines/${magazineSlug}`}
            onClick={onClose}
            className="group relative w-[65%] md:w-full aspect-[3/4] overflow-hidden shadow-md hover:shadow-xl transition"
          >
            {/* SKELETON */}
            {imageLoading && (
              <div className="absolute inset-0 bg-gray-200 animate-pulse" />
            )}

            <Image
              src={imageSrc}
              alt={magazineName}
              fill
              priority
              className={`object-cover transition-all duration-500 ${
                imageLoading ? "opacity-0" : "opacity-100"
              }`}
              onLoadingComplete={() => setImageLoading(false)}
            />
          </Link>
        </div>

        {/* RIGHT CONTENT */}
        <div className="flex flex-col justify-center w-full p-6 md:w-7/12 md:p-14">
          <span className="text-[#c9060a] text-xs font-bold tracking-[0.2em] uppercase">
            Latest Issue
          </span>

          <Link
            href={`/magazines/${magazineSlug}`}
            onClick={onClose}
            className="mt-2 text-xl font-bold text-[#333] transition hover:text-[#c9060a] md:text-2xl"
          >
            {magazineName}
          </Link>

          {/* HEADLINE */}
          <div className="mt-8">
            <h2 className="text-2xl font-black leading-tight text-[#333] md:text-xl">
              Start Your <span className="text-[#c9060a]">Free Month</span> Now
            </h2>

            <p className="text-[#333]/70 mt-3 flex items-center gap-2 text-sm">
              <span className="w-5 h-5 bg-[#c9060a]/10 text-[#c9060a] rounded-full flex items-center justify-center text-xs">
                ✓
              </span>
              Full access to all premium insights
            </p>

            <p className="text-[#333]/50 mt-1 text-xs italic">
              No credit card required
            </p>
          </div>

          {/* CTA */}
          <div className="mt-10">
            <button
              onClick={handleRedirect}
              disabled={loading}
              className="w-fit px-4 py-3 md:py-3.5 bg-[#c9060a] hover:bg-[#333] text-white font-semibold text-sm md:text-base transition disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? "Redirecting..." : "Subscribe Now"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Popup;
