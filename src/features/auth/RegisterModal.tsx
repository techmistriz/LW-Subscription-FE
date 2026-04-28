"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Magazine } from "@/types";
import Link from "next/link";
import Image from "next/image";
import { getLatestSingleMagazines } from "@/lib/api/services/magazines";

const RegisterModal = ({ onClose }: { onClose: () => void }) => {
  const router = useRouter();
  const [singleMagazine, setSingleMagazine] = useState<Magazine | null>(null);
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  /* ---------------- FETCH (Logic preserved) ---------------- */
  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      try {
        const res = await getLatestSingleMagazines();
        if (mounted) {
          setSingleMagazine(res || res);
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
  const imageSrc =
    singleMagazine?.image && singleMagazine.image.startsWith("http")
      ? singleMagazine.image
      : `${process.env.NEXT_PUBLIC_MAGAZINES_BASE_URL}/${singleMagazine?.image || "fallback.jpg"}`;

  const handleRedirect = () => {
    setLoading(true);
    onClose();
    router.push("/subscription");
  };

  return (
 <div className="fixed inset-0 z-9999 bg-black/50 flex items-center justify-center p-4 md:p-0">
  <div className="bg-white w-full max-w-5xl md:min-h-[520px] max-h-[95vh] overflow-y-auto md:overflow-visible rounded-xl shadow-2xl relative flex flex-col md:flex-row border border-gray-100">
          {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 flex items-center justify-center text-[#333]  cursor-pointer hover:bg-[#c2b9b9] bg-gray-100 rounded-full transition"
          aria-label="Close"
        >
          <span className="text-2xl leading-none">&times;</span>
        </button>

        {/* LEFT IMAGE */}
<div className="w-full rounded-xl md:w-5/12 bg-gradient-to-b from-gray-50 to-white p-4 md:p-15 flex items-center justify-center border-b md:border-b-0 md:border-r border-gray-100">
          <Link
            href={`/magazines/${magazineSlug}`}
            onClick={onClose}
           className="group relative w-[65%] md:w-full aspect-[3/4] overflow-hidden shadow-md hover:shadow-xl transition"
          >
            {/* SKELETON */}
            {imageLoading && (
              <div className="absolute inset-0 animate-pulse bg-gray-200" />
            )}

            <Image
              src={imageSrc}
              alt={magazineName}
              fill
              className={`object-cover transition-all duration-500  ${
                imageLoading ? "opacity-0" : "opacity-100"
              }`}
              priority
              onLoadingComplete={() => setImageLoading(false)}
            />
          </Link>
        </div>

        {/* RIGHT CONTENT */}
      <div className="w-full md:w-7/12 p-6 md:p-10 md:p-14 flex flex-col justify-center">
          <span className="text-[#c9060a] text-xs font-bold tracking-[0.2em] uppercase">
            Latest Issue
          </span>

          <Link
            href={`/magazines/${magazineSlug}`}
            onClick={onClose}
 className="mt-2 text-xl md:text-2xl font-bold text-[#333] hover:text-[#c9060a]"
           >
            {magazineName}
          </Link>

          {/* HEADLINE */}
          <div className="mt-8">
          <h2 className="text-2xl md:text-3xl font-black text-[#333] leading-tight">
              Start Your <br />
              <span className="text-[#c9060a]">Free Month</span> Now
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
             className="w-full bg-[#c9060a] hover:bg-[#333] cursor-pointer text-white py-3 md:py-3.5 rounded-lg font-semibold text-sm md:text-base ..."
            >
              {loading ? "Redirecting..." : "Subscribe Now"}
            </button>

            {/* <p className="text-center text-xs text-[#333]/40 mt-4">
              Join 10,000+ legal professionals today.
            </p> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterModal;
