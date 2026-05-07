"use client";

import { ChangeEvent } from "react";

interface FormInputProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  error?: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
}

export default function FormInput({
  label,
  error,
  type = "text",
  required = false,
  ...props
}: FormInputProps) {
  const displayLabel = label.replace(" *", "");
  
  return (
    <div className="space-y-1">
      <label className="text-[11px] font-bold text-gray-500 uppercase ml-1">
        {displayLabel}
        {required && <span className="text-[#c9060a] ml-1">*</span>}
      </label>
      <input
        type={type}
        {...props}
        className={`w-full border ${error ? "border-red-500" : "border-gray-200"} bg-gray-50 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-[#c9060a] outline-none transition-all`}
      />
      {error && (
        <p className="text-red-500 text-[10px] font-bold mt-1 uppercase">
          {error}
        </p>
      )}
    </div>
  );
}