"use client";

import { useState, useRef, useEffect } from "react";

interface Year {
  id: number;
  name: number | string;
}

interface YearFilterProps {
  years: Year[];
  selectedYear: number | null;
  onSelect: (year: number | null) => void;
  onApply: () => void;
  disabled?: boolean;
}

export default function YearFilter({
  years,
  selectedYear,
  onSelect,
  onApply,
  disabled = false,
}: YearFilterProps) {
  const [yearOpen, setYearOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex flex-col sm:flex-row gap-3 my-4 sm:items-center">
      <div className="relative w-full sm:w-40" ref={dropdownRef}>
        <button
          onClick={() => setYearOpen(!yearOpen)}
          disabled={disabled}
          className="border border-gray-300 px-4 py-2 lg:w-47 w-full flex justify-between items-center bg-white hover:bg-gray-50 disabled:opacity-50"
        >
          <span className="ml-5">
            {selectedYear
              ? years.find((y) => y.id === selectedYear)?.name
              : "Select Year"}
          </span>

          <span
            className={`ml-2 transition-transform duration-200 ${
              yearOpen ? "rotate-180" : ""
            }`}
          >
            ▾
          </span>
        </button>

        {yearOpen && (
          <div className="absolute w-full bg-white border border-gray-300 shadow-lg z-10">
            <div
              onClick={() => {
                onSelect(null);
                setYearOpen(false);
              }}
              className="px-4 py-3 hover:bg-gray-100 cursor-pointer text-sm"
            >
              All Years
            </div>

            {years.map((year) => (
              <div
                key={year.id}
                onClick={() => {
                  onSelect(year.id);
                  setYearOpen(false);
                }}
                className="px-4 py-3 hover:bg-gray-100 cursor-pointer text-sm"
              >
                {year.name}
              </div>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={onApply}
        disabled={disabled}
        className="bg-[#c9060a] lg:w-47 ml-10 cursor-pointer text-white px-6 py-2 hover:bg-[#333] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Filter
      </button>
    </div>
  );
}
