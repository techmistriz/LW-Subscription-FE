"use client";

import FormInput from "./FormInput";
import { RegisterFormData } from "@/types/register.types";

import {
  FieldErrors,
  UseFormGetValues,
  UseFormRegister,
} from "react-hook-form";

interface PersonalDetailsFormProps {
  register: UseFormRegister<RegisterFormData>;
  errors: FieldErrors<RegisterFormData>;
  getValues: UseFormGetValues<RegisterFormData>;
}

export default function PersonalDetailsForm({
  register,
  errors,
  getValues,
}: PersonalDetailsFormProps) {
  return (
    <div className="bg-white p-8 border border-gray-200 shadow-sm rounded-xl">
      <h2 className="text-xl font-bold mb-6 text-gray-800 uppercase tracking-tight border-b pb-4">
        Personal Details
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* First Name */}
        <FormInput
          label="First Name *"
          {...register("first_name", {
            required: "First name is required",
          })}
          error={errors.first_name?.message}
          required
        />

        {/* Last Name */}
        <FormInput
          label="Last Name *"
          {...register("last_name", {
            required: "Last name is required",
          })}
          error={errors.last_name?.message}
          required
        />

        {/* Email */}
        <FormInput
          label="Email *"
          type="email"
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Enter a valid email",
            },
          })}
          error={errors.email?.message}
          required
          autoComplete="email"
          placeholder="Enter email"
        />

        {/* Contact */}
        <FormInput
          label="Contact Number *"
          {...register("contact", {
            required: "Contact number is required",
            pattern: {
              value: /^[0-9]{10}$/,
              message: "Enter a valid 10 digit number",
            },
          })}
          error={errors.contact?.message}
          required
          maxLength={10}
          inputMode="numeric"
          pattern="[0-9]*"
          placeholder="WhatsApp preferred"
        />

        {/* DOB */}
        <FormInput
          label="Date of Birth *"
          type="date"
          {...register("dob", {
            required: "Date of birth is required",
          })}
          error={errors.dob?.message}
          required
        />

        {/* Organisation */}
        <FormInput
          label="Organisation Name"
          {...register("organisation")}
          error={errors.organisation?.message}
        />

        {/* GST */}
        <FormInput
          label="GST Number"
          {...register("gst_number", {
            maxLength: {
              value: 15,
              message: "GST number cannot exceed 15 characters",
            },
          })}
          error={errors.gst_number?.message}
          maxLength={15}
          autoComplete="off"
        />

        {/* Address */}
        <FormInput
          label="Address *"
          {...register("address", {
            required: "Address is required",
          })}
          error={errors.address?.message}
          required
        />

        {/* City */}
        <FormInput
          label="City *"
          {...register("city", {
            required: "City is required",
          })}
          error={errors.city?.message}
          required
        />

        {/* Pincode */}
        <FormInput
          label="Pincode *"
          {...register("pincode", {
            required: "Pincode is required",
            pattern: {
              value: /^[0-9]{6}$/,
              message: "Enter a valid 6 digit pincode",
            },
          })}
          error={errors.pincode?.message}
          required
          maxLength={6}
          inputMode="numeric"
          pattern="[0-9]*"
        />

        {/* State */}
        <FormInput
          label="State *"
          {...register("state", {
            required: "State is required",
          })}
          error={errors.state?.message}
          required
        />

        {/* Country */}
        <FormInput
          label="Country *"
          {...register("country", {
            required: "Country is required",
          })}
          error={errors.country?.message}
          required
        />

        {/* Password */}
        <FormInput
          label="Password *"
          type="password"
          {...register("password", {
            required: "Password is required",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters",
            },
          })}
          error={errors.password?.message}
          required
        />

        {/* Confirm Password */}
        <FormInput
          label="Confirm Password *"
          type="password"
          {...register("password_confirmation", {
            required: "Confirm password is required",
            validate: (value) =>
              value === getValues("password") || "Passwords do not match",
          })}
          error={errors.password_confirmation?.message}
          required
        />
      </div>
    </div>
  );
}
