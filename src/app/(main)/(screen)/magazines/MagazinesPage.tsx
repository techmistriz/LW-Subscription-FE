import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, useCallback } from "react";
import { getMagazines } from "@/lib/api/services/magazines";
import { getYears } from "@/lib/api/services/years";
import { MagazineSkeleton } from "@/components/Skeletons/magazineSkeleton";
import Pagination from "@/components/Pagination/Pagination";
import { Magazine } from "@/types";

const magazineBaseUrl = process.env.NEXT_PUBLIC_MAGAZINES_BASE_URL || "";
const bannerImg: React.CSSProperties = {
  backgroundImage: `url(${process.env.NEXT_PUBLIC_BANNER_BASE_URL})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
};

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
  const [years, setYears] = useState<{ id: number; name: number }[]>([]);
  const [selectedYearId, setSelectedYearId] = useState<number | null>(null);
  const [yearOpen, setYearOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  const dropdownRef = useRef<HTMLDivElement>(null);
  // const searchParams = useSearchParams();
  // const currentPage = Number(searchParams.get("page")) || 1;

  // Fetch magazines with optional year filter and pagination
  const fetchMagazines = useCallback(
    async (year_id?: number, pageNumber: number = 1) => {
      setLoading(true);
      try {
        const result = await getMagazines(year_id, pageNumber);
        // console.log("MAG API RESULT:", result);

        // console.log("Magazine Pagination META:", result.meta);

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
        setYears(yearsData.data || []);
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

  // Filter handlers
  const handleYearSelect = (yearId: number | null) => {
    setSelectedYearId(yearId);
    setYearOpen(false);
  };

  const handleApplyFilter = () => {
    fetchMagazines(selectedYearId ?? undefined, 1);
  };

  const selectedYearLabel = selectedYearId
    ? years.find((y) => y.id === selectedYearId)?.name
    : null;

  return (
    <section className="pb-8">
      {/* Hero banner */}
      <section className="py-12 bg-cover bg-center" style={bannerImg}>
        <div className="max-w-6xl mx-auto px-4 flex justify-between items-center">
          <h1 className="text-white text-2xl font-bold">MAGAZINE</h1>
          <p className="text-sm text-gray-200">
            <Link href="/" className="text-[#c9060a]">
              Home
            </Link>{" "}
            | Magazine
          </p>
        </div>
      </section>

      {/* Main content */}
      <div className="max-w-6xl mx-auto px-4">
        {/* Page header */}
        <h2 className="mt-6 text-2xl font-bold">ALL EDITIONS MAGAZINE</h2>
        <div className="w-14 h-1.5 bg-[#c9060a] mt-1"></div>

        {/* Filter controls */}
        <div className="flex flex-col sm:flex-row gap-3 my-6 sm:items-center">
          <div className="relative w-full sm:w-40" ref={dropdownRef}>
            <button
              onClick={() => setYearOpen(!yearOpen)}
              disabled={loading}
              className="border border-gray-300 px-4 py-2 w-full flex justify-between items-center bg-white disabled:opacity-50"
            >
              {selectedYearLabel || "All Years"}
              <span
                className={`ml-2 transition-transform duration-200 ${
                  yearOpen ? "rotate-180" : "rotate-0"
                }`}
              >
                ▾
              </span>
            </button>

            {yearOpen && (
              <div className="absolute w-full bg-white border shadow z-10 max-h-64 overflow-y-auto">
                <div
                  onClick={() => handleYearSelect(null)}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  All Years
                </div>
                {years.map((year) => (
                  <div
                    key={year.id}
                    onClick={() => handleYearSelect(year.id)}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    {year.name}
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={handleApplyFilter}
            disabled={loading}
            className={`border px-15 py-2 text-white bg-[#c9060a] cursor-pointer ${
              loading ? "opacity-50 cursor-not-allowed" : "hover:bg-[#a00508]"
            }`}
          >
            {loading ? "Filtering..." : "Filter"}
          </button>
        </div>

        {/* Magazines grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {loading ? (
            // Loading skeleton
            Array.from({ length: 10 }).map((_, i) => (
              <MagazineSkeleton key={i} />
            ))
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
