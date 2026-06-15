"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { FaWhatsapp, FaPhoneAlt, FaEnvelope } from "react-icons/fa";

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

        // console.log("Single Magazine:", res);

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
  <div className="fixed inset-0 z-[9999] bg-black/50 flex items-center justify-center p-4">
    <div className="relative w-full max-w-4xl overflow-hidden bg-white border border-gray-100 shadow-2xl rounded-lg">
      
      {/* CLOSE BUTTON */}
      <button
        onClick={onClose}
        aria-label="Close"
        className="absolute z-20 flex items-center justify-center w-10 h-10 text-[#333] bg-gray-100 rounded-full top-4 right-4 hover:bg-gray-200 cursor-pointer"
      >
        <span className="text-2xl leading-none">&times;</span>
      </button>

      {/* TOP SECTION */}
      <div className="flex flex-col md:flex-row">
        {/* LEFT IMAGE */}
        <div className="flex items-center justify-center w-full p-4 border-b border-gray-100 md:w-5/12 bg-gradient-to-b from-gray-50 to-white md:p-12 md:border-b-0 md:border-r">
          <Link
            href={`/magazines/${magazineSlug}`}
            onClick={onClose}
            className="group relative w-[45%] sm:w-[40%] md:w-full aspect-[3/4] overflow-hidden shadow-md hover:shadow-xl transition"
          >
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
            className="mt-2 max-w-[370px] text-lg md:text-2xl font-bold text-[#333] hover:text-[#c9060a] transition"
          >
            {magazineName}
          </Link>

          <div className="mt-6">
            <h2 className="text-2xl font-black text-[#333]">
              Your <span className="text-[#c9060a]">1st Month</span> is on Us.
            </h2>

            <div className="mt-4 space-y-3">
              <p className="flex items-center gap-2 text-sm text-[#333]/70">
                <span className="w-4 h-4 bg-[#c9060a]/10 text-[#c9060a] rounded-full flex items-center justify-center text-xs">
                  ✓
                </span>
                Full access to Lex Witness portal
              </p>

              <p className="flex items-center gap-2 text-sm text-[#333]/70">
                <span className="w-4 h-4 bg-[#c9060a]/10 text-[#c9060a] rounded-full flex items-center justify-center text-xs">
                  ✓
                </span>
                No card details required
              </p>

              <p className="flex items-center gap-2 text-sm text-[#333]/70">
                <span className="w-4 h-4 bg-[#c9060a]/10 text-[#c9060a] rounded-full flex items-center justify-center text-xs">
                  ✓
                </span>
                Upgrade or Cancel anytime
              </p>
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={handleRedirect}
              disabled={loading}
              className="w-full md:w-fit px-5 py-3 bg-[#c9060a] hover:bg-[#333] text-white font-semibold text-sm transition disabled:opacity-70 cursor-pointer"
            >
              {loading ? "Redirecting..." : "Subscribe Now"}
            </button>
          </div>
        </div>
      </div>

      {/* BOTTOM CONTACT BAR */}
      <div className="border-t border-gray-200 px-6 py-5 bg-gray-50">
        <p className="text-center text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
          Questions?
        </p>

        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
          <a
            href="tel:7982771770"
            className="flex items-center gap-2 text-sm text-[#333] hover:text-[#c9060a] transition"
          >
            <FaPhoneAlt className="text-[#c9060a]" />
            <span>+91 7982771770</span>
          </a>

          <a
            href="mailto:info@witnesslive.in"
            className="flex items-center gap-2 text-sm text-[#333] hover:text-[#c9060a] transition"
          >
            <FaEnvelope className="text-[#c9060a]" />
            <span>info@witnesslive.in</span>
          </a>

          <a
            href="https://wa.me/917982771770?text=Hi%2C%20I%20have%20a%20few%20questions%20about%20Lex%20Witness"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-[#333] hover:text-[#25D366] transition"
          >
            <FaWhatsapp className="text-[#25D366]" />
            <span>WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  </div>
);
};

export default Popup;
