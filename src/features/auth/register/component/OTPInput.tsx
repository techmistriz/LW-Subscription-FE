"use client";

import { ChangeEvent } from "react";

interface OTPInputProps {
  isOtpSent: boolean;
  email: string;
  otp: string;
  otpTimer: number;
  isSendingOtp: boolean; // ADD
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onSendOtp: () => void;
  error?: string;
}

export default function OTPInput({
  isOtpSent,
  email,
  otp,
  otpTimer,
  isSendingOtp, // ADD
  onChange,
  onSendOtp,
  error,
}: OTPInputProps) {
  return (
    <div className="space-y-1">
      <label className="text-[11px] font-bold text-gray-500 uppercase">
        Email *
      </label>

      {/* EMAIL + GET OTP */}
      {!isOtpSent && (
        <div className="flex gap-2">
          <input
            type="email"
            name="email"
            value={email}
            onChange={onChange}
            placeholder="Enter email"
            className={`min-w-0 flex-1 border ${
              error ? "border-red-500" : "border-gray-200"
            } bg-gray-50 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-[#c9060a] outline-none transition-all`}
          />

          <button
            type="button"
            onClick={onSendOtp}
            disabled={otpTimer > 0 || !email || isSendingOtp}
            className={`shrink-0 px-3 py-2 rounded-md text-[9px] font-bold uppercase whitespace-nowrap transition-all ${
              otpTimer > 0 || !email || isSendingOtp
                ? "bg-gray-300 cursor-not-allowed text-gray-600"
                : "bg-[#c9060a] text-white cursor-pointer"
            }`}
          >
            {isSendingOtp ? (
              <span className="flex items-center gap-1.5">
                <span className="h-3 w-3 animate-spin rounded-full border-2 border-gray-500 border-t-transparent" />
                Sending...
              </span>
            ) : otpTimer > 0 ? (
              `Resend ${otpTimer}s`
            ) : (
              "Get OTP"
            )}
          </button>
        </div>
      )}

      {/* OTP + RESEND */}
      {isOtpSent && (
        <>
          <div className="flex gap-2">
            <input
              name="otp"
              value={otp}
              onChange={onChange}
              placeholder="Enter OTP"
              maxLength={6}
              inputMode="numeric"
              className={`min-w-0 flex-1 border ${
                error ? "border-red-500" : "border-gray-200"
              } bg-gray-50 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-[#c9060a] outline-none`}
            />

            <button
              type="button"
              onClick={onSendOtp}
              disabled={otpTimer > 0}
              className={`shrink-0 px-3 py-2 rounded-md text-[9px] font-bold uppercase whitespace-nowrap transition-all ${
                otpTimer > 0
                  ? "bg-gray-300 cursor-not-allowed text-gray-600"
                  : "bg-[#c9060a] text-white cursor-pointer"
              }`}
            >
              {otpTimer > 0 ? `Resend ${otpTimer}s` : "Resend OTP"}
            </button>
          </div>

          <p className="text-[10px] text-gray-500 font-medium">
            OTP sent to{" "}
            <span className="text-[#c9060a] font-bold">{email}</span>
          </p>
        </>
      )}

      {error && (
        <p className="text-red-500 text-[10px] uppercase font-bold">{error}</p>
      )}
    </div>
  );
}
