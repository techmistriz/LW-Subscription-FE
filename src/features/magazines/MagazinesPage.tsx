"use client";

import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, useCallback } from "react";
import { getMagazines } from "@/lib/api/services/magazines";
import { getYears } from "@/lib/api/services/years";
// import { MagazineSkeleton } from "@/components/Skeletons/magazineSkeleton";
import Pagination from "@/components/Pagination/Pagination";
import { Magazine, Year } from "@/types";
import Banner from "@/components/Common/Banner";
import YearFilter from "@/components/Common/YearFilter";
import PageLoader from "@/components/Loader/PageLoader";

const magazineBaseUrl = process.env.NEXT_PUBLIC_MAGAZINES_BASE_URL || "";

/**
 * MagazinesPage component displays all magazine editions with year filtering
 * and pagination support
 */
export default function MagazinesPage({
  currentPage,
}: {
  currentPage: number;
}) {
  // State management
  const [magazines, setMagazines] = useState<Magazine[]>([]);
  const [loading, setLoading] = useState(false);
  const [years, setYears] = useState<Year[]>([]);
  const [selectedYearId, setSelectedYearId] = useState<number | null>(null);
  const [yearOpen, setYearOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  const dropdownRef = useRef<HTMLDivElement>(null);
  // const searchParams = useSearchParams();
  // const currentPage = Number(searchParams.get("page")) || 1;

  // Fetch magazines with optional year filter and pagination
  const fetchMagazines = useCallback(
    async (year?: number, pageNumber: number = 1) => {
      setLoading(true);
      try {
        const result = await getMagazines(year, pageNumber);
        setMagazines(result.data ?? []);
        setLastPage(result.meta?.paging?.last_page ?? 1);
        setPage(result.meta?.paging?.current_page ?? 1);
      } catch (error) {
        console.error("Failed to load magazines:", error);
        setMagazines([]);
        setLastPage(1);
        setPage(1);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // Load magazines on component mount
  useEffect(() => {
    fetchMagazines(undefined, currentPage);
  }, [fetchMagazines, currentPage]);

  // Load available years for filtering
  useEffect(() => {
    async function loadYears() {
      try {
        const yearsData = await getYears();
        setYears(yearsData || []);
      } catch (error) {
        console.error("Failed to load years:", error);
        setYears([]);
      }
    }
    loadYears();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setYearOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleApplyFilter = () => {
    fetchMagazines(selectedYearId ?? undefined, 1);
  };

  const selectedYearLabel = selectedYearId
    ? years.find((y) => y === selectedYearId)
    : null;

  return (
    <section className="pb-8">
      {/* Hero banner */}
      <Banner title="Magazines" />

      {/* Main content */}
      <div className="max-w-6xl mx-auto px-4">
        {/* Page header */}
        <h2 className="mt-6 text-2xl font-semibold text-[#333]">
          ALL EDITIONS MAGAZINE
        </h2>
        <div className="w-14 h-1.5 bg-[#c9060a] mt-1"></div>

        {/* Filter controls */}
        <YearFilter
          years={years}
          selectedYear={selectedYearId}
          onSelect={setSelectedYearId}
          onApply={handleApplyFilter}
          // disabled={loading || !authorId}
        />
        <hr className="border-gray-200 mb-6" />

        {/* Magazines grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {/* {loading ? (
            // Loading skeleton
            Array.from({ length: 10 }).map((_, i) => (
              <MagazineSkeleton key={i} />
            )) */}

          {loading ? (
            <div className="col-span-full flex justify-center py-16">
              <PageLoader />
            </div>
          ) : magazines.length === 0 ? (
            // Empty state
            <p className="col-span-full text-center text-[#333333] py-12">
              {selectedYearLabel
                ? `No magazines found for ${selectedYearLabel}`
                : "No magazines found"}
            </p>
          ) : (
            // Magazines list
            magazines.map((magazine) => (
              <Link
                key={magazine.id}
                href={`/magazines/${magazine.slug}`}
                className="hover:shadow-lg transition"
              >
                {/* Magazine cover */}
                <div className="relative w-full aspect-3/4">
                  <Image
                    src={
                      magazine.image
                        ? `${magazineBaseUrl}/${magazine.image}`
                        : "/placeholder.jpg"
                    }
                    alt={magazine.title || "Magazine edition"}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                  />
                </div>
                {/* Magazine details */}
                <div className="p-3 text-center">
                  <p className="text-sm text-[#333333]">{magazine.title}</p>
                  <p className="text-[#c9060a] font-medium">Read more</p>
                </div>
              </Link>
            ))
          )}
        </div>

        {/* Pagination controls */}
        <Suspense fallback={null}>
          <Pagination
            currentPage={page}
            lastPage={lastPage}
            loading={loading}
          />
        </Suspense>
      </div>
    </section>
  );
}
