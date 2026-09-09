"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import { getMagazines } from "@/lib/api/services/magazines";
import { getYears } from "@/lib/api/services/years";
import Pagination from "@/components/common/Pagination";
import { Magazine, Year } from "@/types";
import Banner from "@/components/common/Banner";
import YearFilter from "@/components/common/YearFilter";
import PageLoader from "@/components/feedback/Loader/PageLoader";
import SafeImage from "@/components/media/SafeImage";

const magazineBaseUrl = process.env.NEXT_PUBLIC_MAGAZINES_BASE_URL || "";

/*----------------- MagazinesPage component displays all magazine editions with year filtering and pagination support -----------------*/
export default function MagazinesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const yearParam = searchParams.get("year");
  const pageParam = Number(searchParams.get("page")) || 1;

  const [magazines, setMagazines] = useState<Magazine[]>([]);
  const [loading, setLoading] = useState(false);
  const [years, setYears] = useState<Year[]>([]);
  const [selectedYearId, setSelectedYearId] = useState<number | null>(
    yearParam ? Number(yearParam) : null,
  );
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [error, setError] = useState("");

  /*----------------- Fetch magazines with optional year filter and pagination -----------------*/
  const fetchMagazines = useCallback(
    async (year?: number, pageNumber: number = 1) => {
      setLoading(true);

      try {
        const result = await getMagazines(year, pageNumber);

        if (result?.status === false) {
          throw new Error(result.message || "Failed to load magazines");
        }

        setError("");
        setMagazines(result.data ?? []);
        setLastPage(result.meta?.paging?.last_page ?? 1);
        setPage(result.meta?.paging?.current_page ?? 1);
      } catch (err: unknown) {
        console.error("Failed to load magazines:", err);

        const message =
          err instanceof Error ? err.message : "Something went wrong";

        setError(message);
        setMagazines([]);
        setLastPage(1);
        setPage(1);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  /*----------------- Load magazines on component mount -----------------*/
  useEffect(() => {
    const year = yearParam ? Number(yearParam) : undefined;

    fetchMagazines(year, pageParam);
  }, [fetchMagazines, yearParam, pageParam]);

  /*----------------- Load available years for filtering -----------------*/
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

  const handleApplyFilter = () => {
    const params = new URLSearchParams();

    if (selectedYearId) {
      params.set("year", String(selectedYearId));
    }

    params.set("page", "1");

    router.push(`/magazines?${params.toString()}`);
  };

  return (
    <section className="pb-8">
      {/*----------------- Hero banner -----------------*/}
      <Banner title="Magazines" />

      {/*----------------- Main content -----------------*/}
      <div className="mx-auto max-w-6xl px-4">
        {/*----------------- Page header -----------------*/}
        <h2 className="mt-6 text-2xl font-semibold text-[#333]">
          ALL EDITIONS MAGAZINE
        </h2>

        <div className="mt-1 h-1.5 w-14 bg-[#c9060a]" />

        {/*----------------- Filter controls -----------------*/}
        <YearFilter
          years={years}
          selectedYear={selectedYearId}
          onSelect={setSelectedYearId}
          onApply={handleApplyFilter}
        />

        <hr className="mb-6 border-gray-200" />

        {/*----------------- Magazines grid -----------------*/}
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4 lg:grid-cols-5">
          {loading ? (
            <div className="col-span-full flex justify-center py-16">
              <PageLoader />
            </div>
          ) : error ? (
            <div className="col-span-full py-12 text-center text-red-600">
              {error}
            </div>
          ) : (
            magazines.map((magazine) => (
              <Link
                key={magazine.id}
                href={`/magazines/${magazine.slug}`}
                className="transition hover:shadow-lg"
              >
                {/*----------------- Magazine cover -----------------*/}
                <div className="relative aspect-3/4 w-full">
                  <SafeImage
                    src={
                      magazine.image
                        ? `${magazineBaseUrl}/${magazine.image}`
                        : undefined
                    }
                    alt={magazine.title || "Magazine edition"}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                  />
                </div>

                {/*----------------- Magazine details -----------------*/}
                <div className="p-3 text-center">
                  <p className="text-sm text-[#333333]">{magazine.title}</p>
                  <p className="font-medium text-[#c9060a]">Read more</p>
                </div>
              </Link>
            ))
          )}
        </div>

        {/*----------------- Pagination controls -----------------*/}
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
