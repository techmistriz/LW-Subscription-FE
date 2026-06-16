"use client";

import { ChangeEvent } from "react";

interface OTPInputProps {
  isOtpSent: boolean;
  contact: string;
  otp: string;
  otpTimer: number;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onSendOtp: () => void;
  error?: string;
}

export default function OTPInput({
  isOtpSent,
  contact,
  otp,
  otpTimer,
  onChange,
  onSendOtp,
  error,
}: OTPInputProps) {
  return (
    <div className="space-y-1">
      <label className="text-[11px] font-bold text-gray-500 uppercase">
        Contact Us *
      </label>

      {/* CONTACT INPUT */}
      {!isOtpSent && (
       <div className="flex flex-col sm:flex-row gap-2">
          <input
            name="contact"
            value={contact}
            onChange={onChange}
            placeholder="10 digit mobile"
            className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-[#c9060a] outline-none bg-gray-50"
          />

          <button
            type="button"
            onClick={onSendOtp}
            disabled={otpTimer > 0}
            className={`px-3 py-3 rounded-md text-[10px] font-bold uppercase whitespace-nowrap transition-all ${
              otpTimer > 0
                ? "bg-gray-300 cursor-not-allowed text-gray-600"
                : "bg-[#c9060a] text-white cursor-pointer"
            }`}
          >
            {otpTimer > 0 ? `Resend ${otpTimer}s` : "Get OTP"}
          </button>
        </div>
      )}

      {/* OTP INPUT */}
      {isOtpSent && (
        <div className="flex gap-2">
          <input
            name="otp"
            value={otp}
            onChange={onChange}
            placeholder="Enter OTP"
            className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-[#c9060a] outline-none bg-gray-50"
          />

          <button
            type="button"
            onClick={onSendOtp}
            disabled={otpTimer > 0}
            className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase whitespace-nowrap transition-all ${
              otpTimer > 0
                ? "bg-gray-300 cursor-not-allowed text-gray-600"
                : "bg-[#c9060a] text-white cursor-pointer"
            }`}
          >
            {otpTimer > 0 ? `Resend ${otpTimer}s` : "Resend OTP"}
          </button>
        </div>
      )}

      {/* OTP INFO */}
      {isOtpSent && (
        <p className="text-[10px] text-gray-500 font-medium mt-1">
          OTP sent to{" "}
          <span className="text-[#c9060a] font-bold">+91 {contact}</span>
        </p>
      )}

      {/* ERROR */}
      {error && (
        <p className="text-red-500 text-[10px] uppercase font-bold">{error}</p>
      )}
    </div>
  );
}
