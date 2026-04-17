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
    if (page === currentPage) return;

    if (onPageChange) {
      onPageChange(page);
      return;
    }

    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());

    router.push(`${pathname}?${params.toString()}`);
  };

  if (lastPage <= 1) return null;

  // Dynamic page logic
  const getPages = () => {
    const pages: (number | string)[] = [];

    const start = Math.max(1, currentPage - 2);
    const end = Math.min(lastPage, currentPage + 2);

    if (start > 1) pages.push(1);
    if (start > 2) pages.push("...");

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (end < lastPage - 1) pages.push("...");
    if (end < lastPage) pages.push(lastPage);

    return pages;
  };

  const pages = getPages();

  return (
    <div className="flex items-center justify-start gap-2 my-6 text-sm">
      <span className="mr-2 text-[#333]">Pages:</span>

      {/* Previous Button */}
      {currentPage > 1 && (
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={loading}
          className="w-8 h-8 border bg-gray-100 border-gray-300 hover:bg-gray-200 cursor-pointer"
        >
          «
        </button>
      )}

      {/* Page Numbers */}
      {pages.map((page, index) =>
        page === "..." ? (
          <span key={`ellipsis-${index}`} className="px-2 text-gray-500">
            ...
          </span>
        ) : (
          <button
            key={`page-${page}-${index}`}
            onClick={() => handlePageChange(page as number)}
            disabled={loading}
            className={`w-8 h-8 border text-sm cursor-pointer ${
              currentPage === page
                ? "bg-[#c9060a] text-white border-[#c9060a]"
                : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
            }`}
          >
            {page}
          </button>
        ),
      )}

      {/* Next Button */}
      {currentPage < lastPage && (
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={loading}
          className="w-8 h-8 border bg-gray-100 border-gray-300 hover:bg-gray-200 cursor-pointer"
        >
          »
        </button>
      )}
    </div>
  );
}
