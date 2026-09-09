"use client";

import { ChangeEvent } from "react";
import FormInput from "./FormInput";
import OTPInput from "./OTPInput";
import { RegisterFormData } from "@/types/register.types";

interface PersonalDetailsFormProps {
  form: RegisterFormData;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  getError: (name: string) => string | undefined;
  isOtpSent: boolean;
  otpTimer: number;
  isSendingOtp: boolean; // ADD
  onSendOtp: () => void;
}

export default function PersonalDetailsForm({
  form,
  onChange,
  getError,
  isOtpSent,
  otpTimer,
  isSendingOtp, // ADD
  onSendOtp,
}: PersonalDetailsFormProps) {
  return (
    <div className="bg-white p-8 border border-gray-200 shadow-sm rounded-xl">
      <h2 className="text-xl font-bold mb-6 text-gray-800 uppercase tracking-tight border-b pb-4">
        Personal Details
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
          label="First Name *"
          name="first_name"
          value={form.first_name}
          onChange={onChange}
          error={getError("first_name")}
          required
        />

        <FormInput
          label="Last Name *"
          name="last_name"
          value={form.last_name}
          onChange={onChange}
          error={getError("last_name")}
          required
        />

        <OTPInput
          isOtpSent={isOtpSent}
          email={form.email}
          otp={form.otp}
          otpTimer={otpTimer}
          isSendingOtp={isSendingOtp} // ADD
          onChange={onChange}
          onSendOtp={onSendOtp}
          error={getError("otp")}
        />

        <FormInput
          label="Contact Number *"
          name="contact"
          value={form.contact}
          onChange={onChange}
          error={getError("contact")}
          required
          maxLength={10}
          inputMode="numeric"
          pattern="[0-9]*"
          placeholder="WhatsApp preferred"
        />

        <FormInput
          label="Date of Birth *"
          type="date"
          name="dob"
          value={form.dob}
          onChange={onChange}
          error={getError("dob")}
          required
        />

        <FormInput
          label="Organisation Name"
          name="organisation"
          value={form.organisation}
          onChange={onChange}
        />

        <FormInput
          label="GST Number"
          name="gst_number"
          value={form.gst_number}
          onChange={onChange}
          error={getError("gst_number")}
          maxLength={15}
          autoComplete="off"
        />

        <div className="md:col-span-1">
          <FormInput
            label="Address *"
            name="address"
            value={form.address}
            onChange={onChange}
            error={getError("address")}
            required
          />
        </div>

        <FormInput
          label="City *"
          name="city"
          value={form.city}
          onChange={onChange}
          error={getError("city")}
          required
        />

        <FormInput
          label="Pincode *"
          name="pincode"
          value={form.pincode}
          onChange={onChange}
          error={getError("pincode")}
          required
          maxLength={6}
          inputMode="numeric"
          pattern="[0-9]*"
        />

        <FormInput
          label="State *"
          name="state"
          value={form.state}
          onChange={onChange}
          error={getError("state")}
          required
        />

        <FormInput
          label="Country *"
          name="country"
          value={form.country}
          onChange={onChange}
          error={getError("country")}
          required
        />

        <FormInput
          label="Password *"
          type="password"
          name="password"
          value={form.password}
          onChange={onChange}
          error={getError("password")}
          required
        />

        <FormInput
          label="Confirm Password *"
          type="password"
          name="password_confirmation"
          value={form.password_confirmation}
          onChange={onChange}
          error={getError("password_confirmation")}
          required
        />
      </div>
    </div>
  );
}
