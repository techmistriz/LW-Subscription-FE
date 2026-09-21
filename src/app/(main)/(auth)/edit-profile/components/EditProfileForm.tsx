"use client";

import { ChangeEvent, useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";

import { fetchProfile } from "@/store/slices/authSlice";
import { useAppDispatch } from "@/store/hooks";

import type {
  EditableProfileUser,
  FormData,
  PasswordForm,
} from "@/types/editProfile.types";

import { sendUpdateOtp, updateProfile } from "@/services/update.service";
import {
  createFormData,
  createUpdatePayload,
  getErrorMessage,
} from "@/utils/editprofile.utils";

type EditProfileFormProps = {
  user: EditableProfileUser;
};

type EditProfileFormValues = FormData & PasswordForm;

export default function EditProfileForm({ user }: EditProfileFormProps) {
  const dispatch = useAppDispatch();

  const [otpSent, setOtpSent] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const initialData = createFormData(user);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<EditProfileFormValues>({
    defaultValues: {
      ...initialData,
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    mode: "onSubmit",
  });

  const contact = watch("contact");
  const newPassword = watch("newPassword");

  const originalContact = user.contact ?? "";

  const isContactChanged = contact !== originalContact;

  const watchedValues = watch();

  const canUpdate =
    watchedValues.firstName !== initialData.firstName ||
    watchedValues.lastName !== initialData.lastName ||
    watchedValues.contact !== initialData.contact ||
    watchedValues.dob !== initialData.dob ||
    watchedValues.organisation !== initialData.organisation ||
    watchedValues.gstNumber !== initialData.gstNumber ||
    watchedValues.country !== initialData.country ||
    watchedValues.state !== initialData.state ||
    watchedValues.city !== initialData.city ||
    watchedValues.pincode !== initialData.pincode ||
    watchedValues.address !== initialData.address ||
    Boolean(watchedValues.newPassword) ||
    Boolean(watchedValues.confirmPassword);

  const handleContactChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");

    setValue("contact", value, {
      shouldDirty: true,
      shouldValidate: true,
    });

    setValue("otp", "");

    setOtpSent(false);
  };

  const handleSendOtp = async () => {
    if (contact.length !== 10) {
      toast.error("Enter a valid mobile number");
      return;
    }

    setSendingOtp(true);

    try {
      const response = await sendUpdateOtp({
        email: watch("email"),
        contact,
      });

      setOtpSent(true);
      setCountdown(60);

      toast.success(response.message || "OTP sent successfully");
    } catch (error: unknown) {
      toast.error(getErrorMessage(error));
    } finally {
      setSendingOtp(false);
    }
  };

  useEffect(() => {
    if (countdown <= 0) {
      return;
    }

    const timer = window.setInterval(() => {
      setCountdown((previous) => previous - 1);
    }, 1000);

    return () => window.clearInterval(timer);
  }, [countdown]);

  const onSubmit = async (data: EditProfileFormValues) => {
    if (isContactChanged && !data.otp.trim()) {
      toast.error("Please enter the OTP sent to your mobile number.");
      return;
    }

    if (data.newPassword || data.confirmPassword) {
      if (data.newPassword.length < 8) {
        toast.error("Password must be at least 8 characters.");
        return;
      }

      if (data.newPassword !== data.confirmPassword) {
        toast.error("Passwords do not match.");
        return;
      }
    }

    const passwordForm: PasswordForm = {
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
      confirmPassword: data.confirmPassword,
    };

    const formData: FormData = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      contact: data.contact,
      otp: data.otp,
      dob: data.dob,
      organisation: data.organisation,
      gstNumber: data.gstNumber,
      country: data.country,
      state: data.state,
      city: data.city,
      pincode: data.pincode,
      address: data.address,
    };

    const payload = createUpdatePayload(
      formData,
      passwordForm,
      isContactChanged ? data.otp : "",
    );

    setUpdating(true);

    try {
      const response = await updateProfile(payload);

      await dispatch(fetchProfile());

      /**
       * Reset React Hook Form after successful update.
       * This also updates RHF's default values, so the form
       * is considered clean again.
       */
      reset({
        ...data,
        otp: "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setOtpSent(false);
      setCountdown(0);

      toast.success(response.message || "Profile updated successfully");
    } catch (error: unknown) {
      toast.error(getErrorMessage(error));
    } finally {
      setUpdating(false);
    }
  };

  const inputClass =
    "h-11 w-full rounded-lg border border-gray-300 bg-white px-4 text-sm text-[#333] placeholder:text-gray-400 outline-none transition-all duration-200 focus:border-[#c8050b] focus:ring-2 focus:ring-[#c8050b]/20";

  const labelClass = "mb-1.5 block text-sm font-medium text-[#333]";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-red-50 px-4 py-10">
      <div className="mx-auto max-w-4xl overflow-hidden border border-gray-200 bg-white shadow-xl">
        <div className="border-b border-[#c8050b] px-6 py-5">
          <h1 className="text-2xl font-semibold text-[#333]">Edit Profile</h1>

          <p className="mt-1 text-sm text-gray-500">
            Update your personal information.
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 gap-5 p-6 md:grid-cols-2"
        >
          {/* First Name */}
          <div>
            <label className={labelClass}>
              First Name <span className="text-[#c8050b]">*</span>
            </label>

            <input
              className={inputClass}
              {...register("firstName", {
                required: "First name is required",
              })}
            />

            {errors.firstName && (
              <p className="mt-1 text-sm text-[#c8050b]">
                {errors.firstName.message}
              </p>
            )}
          </div>

          {/* Last Name */}
          <div>
            <label className={labelClass}>
              Last Name <span className="text-[#c8050b]">*</span>
            </label>

            <input
              className={inputClass}
              {...register("lastName", {
                required: "Last name is required",
              })}
            />

            {errors.lastName && (
              <p className="mt-1 text-sm text-[#c8050b]">
                {errors.lastName.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className={labelClass}>
              Email <span className="text-[#c8050b]">*</span>
            </label>

            <input
              type="email"
              readOnly
              className="h-11 w-full cursor-default rounded-lg border border-gray-300 bg-gray-50 px-4 text-sm text-[#333] outline-none"
              {...register("email", {
                required: "Email is required",
              })}
            />

            {errors.email && (
              <p className="mt-1 text-sm text-[#c8050b]">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Contact / OTP */}
          <div>
            <label className={labelClass}>
              {otpSent ? (
                <>
                  OTP <span className="text-[#c8050b]">*</span>
                </>
              ) : (
                <>
                  Contact No <span className="text-[#c8050b]">*</span>
                </>
              )}
            </label>

            {!otpSent ? (
              <div className="flex gap-2">
                <input
                  type="tel"
                  maxLength={10}
                  className={`${inputClass} flex-1`}
                  {...register("contact", {
                    required: "Contact number is required",
                    pattern: {
                      value: /^[0-9]{10}$/,
                      message: "Enter a valid 10-digit mobile number",
                    },
                    onChange: handleContactChange,
                  })}
                />

                {isContactChanged && (
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={sendingOtp || countdown > 0}
                    className="cursor-pointer rounded-md bg-[#c8050b] px-4 text-white disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {sendingOtp
                      ? "Sending..."
                      : countdown > 0
                        ? `${countdown}s`
                        : "Get OTP"}
                  </button>
                )}
              </div>
            ) : (
              <>
                <input
                  maxLength={6}
                  inputMode="numeric"
                  placeholder="Enter OTP"
                  className={inputClass}
                  {...register("otp", {
                    required: isContactChanged ? "OTP is required" : false,
                    pattern: {
                      value: /^[0-9]{6}$/,
                      message: "Enter a valid 6-digit OTP",
                    },
                  })}
                />

                <div className="mt-2 flex items-center justify-between">
                  <p className="text-sm italic text-gray-500">
                    OTP sent to{" "}
                    <span className="font-semibold text-[#333]">{contact}</span>
                  </p>

                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={sendingOtp || countdown > 0}
                    className="text-sm font-medium text-[#c8050b] disabled:text-gray-400"
                  >
                    {countdown > 0 ? `Resend in ${countdown}s` : "Resend OTP"}
                  </button>
                </div>
              </>
            )}

            {errors.contact && (
              <p className="mt-1 text-sm text-[#c8050b]">
                {errors.contact.message}
              </p>
            )}

            {errors.otp && (
              <p className="mt-1 text-sm text-[#c8050b]">{errors.otp.message}</p>
            )}
          </div>

          {/* Date of Birth */}
          <div>
            <label className={labelClass}>
              Date of Birth <span className="text-[#c8050b]">*</span>
            </label>

            <input
              type="date"
              className={inputClass}
              {...register("dob", {
                // required: "Date of birth is required",
              })}
            />

            {errors.dob && (
              <p className="mt-1 text-sm text-[#c8050b]">{errors.dob.message}</p>
            )}
          </div>

          {/* Organisation */}
          <div>
            <label className={labelClass}>Organisation Name</label>

            <input className={inputClass} {...register("organisation")} />
          </div>

          {/* New Password */}
          <div>
            <label className={labelClass}>New Password</label>

            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                className={`${inputClass} pr-10`}
                {...register("newPassword", {
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters.",
                  },
                })}
              />

              <button
                type="button"
                onClick={() => setShowNewPassword((previous) => !previous)}
                className="absolute inset-y-0 right-3 flex cursor-pointer items-center text-gray-500 hover:text-[#c8050b]"
              >
                {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {errors.newPassword && (
              <p className="mt-1 text-sm text-[#c8050b]">
                {errors.newPassword.message}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className={labelClass}>Confirm Password</label>

            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                className={`${inputClass} pr-10`}
                {...register("confirmPassword", {
                  validate: (value) =>
                    !value ||
                    value === newPassword ||
                    "Passwords do not match.",
                })}
              />

              <button
                type="button"
                onClick={() => setShowConfirmPassword((previous) => !previous)}
                className="absolute inset-y-0 right-3 flex cursor-pointer items-center text-gray-500 hover:text-[#c8050b]"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-[#c8050b]">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* GST Number */}
          <div>
            <label className={labelClass}>GST Number</label>

            <input
              className={inputClass}
              placeholder="22AAAAA0000A1Z5"
              {...register("gstNumber", {
                onChange: (e) => {
                  const value = e.target.value.toUpperCase();

                  setValue("gstNumber", value, {
                    shouldDirty: true,
                    shouldValidate: true,
                  });
                },
              })}
            />
          </div>

          {/* Country */}
          <div>
            <label className={labelClass}>
              Country <span className="text-[#c8050b]">*</span>
            </label>

            <input
              className={inputClass}
              {...register("country", {
                required: "Country is required",
              })}
            />

            {errors.country && (
              <p className="mt-1 text-sm text-[#c8050b]">
                {errors.country.message}
              </p>
            )}
          </div>

          {/* State / City / Pincode */}
          <div className="md:col-span-2">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              {/* State */}
              <div>
                <label className={labelClass}>
                  State <span className="text-[#c8050b]">*</span>
                </label>

                <input
                  className={inputClass}
                  {...register("state", {
                    required: "State is required",
                  })}
                />

                {errors.state && (
                  <p className="mt-1 text-sm text-[#c8050b]">
                    {errors.state.message}
                  </p>
                )}
              </div>

              {/* City */}
              <div>
                <label className={labelClass}>
                  City <span className="text-[#c8050b]">*</span>
                </label>

                <input
                  className={inputClass}
                  {...register("city", {
                    required: "City is required",
                  })}
                />

                {errors.city && (
                  <p className="mt-1 text-sm text-[#c8050b]">
                    {errors.city.message}
                  </p>
                )}
              </div>

              {/* Pincode */}
              <div>
                <label className={labelClass}>
                  Pincode <span className="text-[#c8050b]">*</span>
                </label>

                <input
                  className={inputClass}
                  {...register("pincode", {
                    required: "Pincode is required",
                  })}
                />

                {errors.pincode && (
                  <p className="mt-1 text-sm text-[#c8050b]">
                    {errors.pincode.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="md:col-span-2">
            <label className={labelClass}>
              Address <span className="text-[#c8050b]">*</span>
            </label>

            <textarea
              rows={3}
              className="w-full resize-none rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-[#333] placeholder:text-gray-400 outline-none transition-all duration-200 focus:border-[#c8050b] focus:ring-2 focus:ring-[#c8050b]/20"
              {...register("address", {
                required: "Address is required",
              })}
            />

            {errors.address && (
              <p className="mt-1 text-sm text-[#c8050b]">
                {errors.address.message}
              </p>
            )}
          </div>

          {/* Submit */}
          <div className="mt-2 flex justify-end gap-3 border-t border-[#c8050b] pt-5 md:col-span-2">
            <button
              type="submit"
              disabled={!canUpdate || updating}
              className={`flex min-w-[150px] items-center justify-center gap-2 px-6 py-2.5 text-sm font-medium text-white transition ${
                canUpdate && !updating
                  ? "cursor-pointer bg-[#c8050b] hover:bg-[#a30508]"
                  : "cursor-not-allowed bg-gray-300"
              }`}
            >
              {updating ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Updating...
                </>
              ) : (
                "Update Profile"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
