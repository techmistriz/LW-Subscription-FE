"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

import { sendUpdateOtp, updateProfile } from "@/lib/api/Update-Profile/update";
import { fetchProfile } from "@/store/slices/authSlice";
import { useAppDispatch } from "@/store/hooks";

import type {
  EditableProfileUser,
  FormData,
  PasswordForm,
} from "@/types/editProfile.types";

import {
  createFormData,
  createUpdatePayload,
  getErrorMessage,
} from "@/utils/editProfile.utils";

type EditProfileFormProps = {
  user: EditableProfileUser;
};

export default function EditProfileForm({ user }: EditProfileFormProps) {
  const dispatch = useAppDispatch();

  const [otpSent, setOtpSent] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const initialData = createFormData(user);

  const [formData, setFormData] = useState<FormData>(initialData);
  const [initialFormData] = useState<FormData>(initialData);

  const [passwordForm, setPasswordForm] = useState<PasswordForm>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const originalContact = user.contact ?? "";

  const isContactChanged = formData.contact !== originalContact;

  const hasFormChanged =
    JSON.stringify({
      ...formData,
      otp: "",
    }) !==
    JSON.stringify({
      ...initialFormData,
      otp: "",
    });

  const hasPasswordChanged =
    passwordForm.newPassword.trim() !== "" ||
    passwordForm.confirmPassword.trim() !== "";

  const canUpdate = hasFormChanged || hasPasswordChanged;

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
      ...(name === "contact" ? { otp: "" } : {}),
    }));

    if (name === "contact") {
      setOtpSent(false);
    }
  };

  const handleContactChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");

    setFormData((previous) => ({
      ...previous,
      contact: value,
      otp: "",
    }));

    setOtpSent(false);
  };

  const handleSendOtp = async () => {
    if (formData.contact.length !== 10) {
      toast.error("Enter a valid mobile number");
      return;
    }

    setSendingOtp(true);

    try {
      const response = await sendUpdateOtp({
        email: formData.email,
        contact: formData.contact,
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

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setPasswordForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isContactChanged && !formData.otp.trim()) {
      toast.error("Please enter the OTP sent to your mobile number.");
      return;
    }

    if (passwordForm.newPassword || passwordForm.confirmPassword) {
      if (passwordForm.newPassword.length < 8) {
        toast.error("Password must be at least 8 characters.");
        return;
      }

      if (passwordForm.newPassword !== passwordForm.confirmPassword) {
        toast.error("Passwords do not match.");
        return;
      }
    }

    const payload = createUpdatePayload(
      formData,
      passwordForm,
      isContactChanged ? formData.otp : "",
    );

    setUpdating(true);

    try {
      const response = await updateProfile(payload);

      await dispatch(fetchProfile());

      setFormData((previous) => ({
        ...previous,
        otp: "",
      }));

      setOtpSent(false);

      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      toast.success(response.message || "Profile updated successfully");
    } catch (error: unknown) {
      toast.error(getErrorMessage(error));
    } finally {
      setUpdating(false);
    }
  };

  const inputClass =
    "h-11 w-full rounded-lg border border-gray-300 bg-white px-4 text-sm text-[#333] placeholder:text-gray-400 outline-none transition-all duration-200 focus:border-[#C9060A] focus:ring-2 focus:ring-[#C9060A]/20";

  const labelClass = "mb-1.5 block text-sm font-medium text-[#333]";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-red-50 px-4 py-10">
      <div className="mx-auto max-w-4xl overflow-hidden border border-gray-200 bg-white shadow-xl">
        <div className="border-b border-[#c9060a] px-6 py-5">
          <h1 className="text-2xl font-semibold text-[#333]">Edit Profile</h1>

          <p className="mt-1 text-sm text-gray-500">
            Update your personal information.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 gap-5 p-6 md:grid-cols-2"
        >
          <div>
            <label className={labelClass}>
              First Name <span className="text-[#C9060A]">*</span>
            </label>

            <input
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>
              Last Name <span className="text-[#C9060A]">*</span>
            </label>

            <input
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>
              Email <span className="text-[#C9060A]">*</span>
            </label>

            <input
              type="email"
              name="email"
              readOnly
              value={formData.email}
              className="h-11 w-full cursor-default rounded-lg border border-gray-300 bg-gray-50 px-4 text-sm text-[#333] outline-none"
            />
          </div>

          <div>
            <label className={labelClass}>
              {otpSent ? (
                <>
                  OTP <span className="text-[#C9060A]">*</span>
                </>
              ) : (
                <>
                  Contact No <span className="text-[#C9060A]">*</span>
                </>
              )}
            </label>

            {!otpSent ? (
              <div className="flex gap-2">
                <input
                  type="tel"
                  name="contact"
                  maxLength={10}
                  value={formData.contact}
                  onChange={handleContactChange}
                  className={`${inputClass} flex-1`}
                />

                {isContactChanged && (
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={sendingOtp || countdown > 0}
                    className="cursor-pointer rounded-md bg-[#C9060A] px-4 text-white disabled:cursor-not-allowed disabled:opacity-60"
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
                  name="otp"
                  maxLength={6}
                  inputMode="numeric"
                  value={formData.otp}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="Enter OTP"
                />

                <div className="mt-2 flex items-center justify-between">
                  <p className="text-sm italic text-gray-500">
                    OTP sent to{" "}
                    <span className="font-semibold text-[#333]">
                      {formData.contact}
                    </span>
                  </p>

                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={sendingOtp || countdown > 0}
                    className="text-sm font-medium text-[#C9060A] disabled:text-gray-400"
                  >
                    {countdown > 0 ? `Resend in ${countdown}s` : "Resend OTP"}
                  </button>
                </div>
              </>
            )}
          </div>

          <div>
            <label className={labelClass}>
              Date of Birth <span className="text-[#C9060A]">*</span>
            </label>

            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Organisation Name</label>

            <input
              name="organisation"
              value={formData.organisation}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>New Password</label>

            <div className="relative">
              <input
                name="newPassword"
                type={showNewPassword ? "text" : "password"}
                value={passwordForm.newPassword}
                onChange={handlePasswordChange}
                className={`${inputClass} pr-10`}
              />

              <button
                type="button"
                onClick={() => setShowNewPassword((previous) => !previous)}
                className="absolute inset-y-0 right-3 flex cursor-pointer items-center text-gray-500 hover:text-[#C9060A]"
              >
                {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div>
            <label className={labelClass}>Confirm Password</label>

            <div className="relative">
              <input
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={passwordForm.confirmPassword}
                onChange={handlePasswordChange}
                className={`${inputClass} pr-10`}
              />

              <button
                type="button"
                onClick={() => setShowConfirmPassword((previous) => !previous)}
                className="absolute inset-y-0 right-3 flex cursor-pointer items-center text-gray-500 hover:text-[#C9060A]"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div>
            <label className={labelClass}>GST Number</label>

            <input
              name="gstNumber"
              value={formData.gstNumber}
              onChange={(e) =>
                setFormData((previous) => ({
                  ...previous,
                  gstNumber: e.target.value.toUpperCase(),
                }))
              }
              className={inputClass}
              placeholder="22AAAAA0000A1Z5"
            />
          </div>

          <div>
            <label className={labelClass}>
              Country <span className="text-[#C9060A]">*</span>
            </label>

            <input
              name="country"
              value={formData.country}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div className="md:col-span-2">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              <div>
                <label className={labelClass}>
                  State <span className="text-[#C9060A]">*</span>
                </label>

                <input
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>
                  City <span className="text-[#C9060A]">*</span>
                </label>

                <input
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>
                  Pincode <span className="text-[#C9060A]">*</span>
                </label>

                <input
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          <div className="md:col-span-2">
            <label className={labelClass}>
              Address <span className="text-[#C9060A]">*</span>
            </label>

            <textarea
              rows={3}
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full resize-none rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-[#333] placeholder:text-gray-400 outline-none transition-all duration-200 focus:border-[#C9060A] focus:ring-2 focus:ring-[#C9060A]/20"
            />
          </div>

          <div className="mt-2 flex justify-end gap-3 border-t border-[#c9060a] pt-5 md:col-span-2">
            <button
              type="submit"
              disabled={!canUpdate || updating}
              className={`flex min-w-[150px] items-center justify-center gap-2 px-6 py-2.5 text-sm font-medium text-white transition ${
                canUpdate && !updating
                  ? "cursor-pointer bg-[#C9060A] hover:bg-[#a30508]"
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
