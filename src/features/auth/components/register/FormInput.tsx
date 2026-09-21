"use client";

import { InputHTMLAttributes } from "react";

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export default function FormInput({
  label,
  error,
  required = false,
  type = "text",
  ...props
}: FormInputProps) {
  const displayLabel = label.replace(" *", "");

  return (
    <div className="space-y-1">
      <label className="ml-1 text-[11px] font-bold uppercase text-gray-500">
        {displayLabel}

        {required && <span className="ml-1 text-[#c8050b]">*</span>}
      </label>

      <input
        type={type}
        {...props}
        className={`w-full rounded-lg border bg-gray-50 px-3 py-2 text-sm outline-none transition-all focus:ring-1 focus:ring-[#c8050b] ${
          error ? "border-red-500" : "border-gray-200"
        }`}
      />

      {error && (
        <p className="mt-1 text-[10px] font-bold uppercase text-[#c8050b]">{error}</p>
      )}
    </div>
  );
}
