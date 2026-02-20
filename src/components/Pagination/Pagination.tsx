"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";

interface PaginationProps {
  currentPage: number;
  lastPage: number;
  loading?: boolean;
  onPageChange?: (page: number) => void;
}

export default function Pagination({
  currentPage,
  lastPage,
  loading = false,
    onPageChange,
}: PaginationProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const handlePageChange = (page: number) => {
  if (onPageChange) {
    onPageChange(page); //  use custom handler
    return;
  }

  const params = new URLSearchParams(searchParams.toString());
  params.set("page", page.toString());
  router.push(`${pathname}?${params.toString()}`);
};


  if (lastPage <= 1) return null;

  const maxVisible = 7; // show first 7 pages like screenshot

  return (
    <div className="flex items-center justify-center gap-2 mt-10 text-sm">
      <span className="mr-2 text-[#333]">Pages:</span>

      {/* First Pages */}
      {Array.from({ length: Math.min(maxVisible, lastPage) }, (_, i) => {
        const page = i + 1;

        return (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            disabled={loading}
            className={`w-8 h-8 border text-sm ${
              currentPage === page
                ? "bg-[#c9060a] text-white border-[#c9060a]"
                : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
            }`}
          >
            {page}
          </button>
        );
      })}

      {/* Ellipsis + Last Page */}
      {lastPage > maxVisible && (
        <>
          <span className="px-2 text-gray-500">...</span>

          <button
            onClick={() => handlePageChange(lastPage)}
            disabled={loading}
            className={`w-8 h-8 border text-sm ${
              currentPage === lastPage
                ? "bg-[#c9060a] text-white border-[#c9060a]"
                : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
            }`}
          >
            {lastPage}
          </button>
        </>
      )}

      {/* Next Arrow » */}
      {currentPage < lastPage && (
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={loading}
          className="w-8 h-8 border bg-gray-100 border-gray-300 hover:bg-gray-200"
        >
          »
        </button>
      )}
    </div>
  );
}
