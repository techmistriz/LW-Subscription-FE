"use client";

import { useEffect, useState } from "react";
import { useAppSelector } from "@/redux/store/hooks";
import { Eye, EyeOff } from "lucide-react";
import { sendUpdateOtp, updateProfile } from "@/lib/api/Update-Profile/update";
import { toast } from "sonner";
import { fetchProfile } from "@/redux/store/slices/authSlice";
import { useAppDispatch } from "@/redux/store/hooks";


type FormData = {
    firstName: string;
    lastName: string;
    email: string;
    contact: string;
    otp: string;
    dob: string;
    organisation: string;
    gstNumber: string;
    address: string;
    city: string;
    pincode: string;
    state: string;
    country: string;
};

type PasswordForm = {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
};

export default function EditProfilePage() {
    const [otpSent, setOtpSent] = useState(false);
    const [sendingOtp, setSendingOtp] = useState(false);

    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [countdown, setCountdown] = useState(0);

    const [passwordForm, setPasswordForm] = useState<PasswordForm>({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const user = useAppSelector((state) => state.auth.user)
    const dispatch = useAppDispatch();

    const [formData, setFormData] = useState<FormData>({
        firstName: "",
        lastName: "",
        email: "",
        contact: "",
        otp: "",
        dob: "",
        organisation: "",
        gstNumber: "",
        address: "",
        city: "",
        pincode: "",
        state: "",
        country: "",
    });

    // console.log("User", user)

    useEffect(() => {
        if (!user) return;

        setFormData({
            firstName: user.first_name || "",
            lastName: user.last_name || "",
            email: user.email || "",
            contact: user.contact || "",
            otp: "",
            dob: user.dob || "",
            organisation: user.organisation || "",
            gstNumber: user.gst_number || "",
            address: user.address || "",
            city: user.city || "",
            pincode: user.pincode || "",
            state: user.state || "",
            country: user.country || "",
        });
    }, [user]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
            ...(name === "contact"
                ? {
                    otp: "",
                }
                : {}),
        }));

        if (name === "contact") {
            setOtpSent(false);
        }
    };

    const handleContactChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, "");

        setFormData(prev => ({
            ...prev,
            contact: value,
            otp: ""
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
            const res = await sendUpdateOtp({
                email: formData.email,
                contact: formData.contact,
            });

            setOtpSent(true);
            setCountdown(60);

            toast.success(res.message || "OTP sent successfully");
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setSendingOtp(false);
        }
    };

    useEffect(() => {
        if (countdown <= 0) return;

        const timer = setInterval(() => {
            setCountdown((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [countdown]);


    const handlePasswordChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        setPasswordForm((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate mobile verification
        if (isContactChanged && !formData.otp.trim()) {
            toast.error("Please enter the OTP sent to your mobile number.");
            return;
        }

        // Validate GST
        // const gstRegex =
        //     /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/;

        // if (
        //     formData.gstNumber &&
        //     !gstRegex.test(formData.gstNumber.toUpperCase())
        // ) {
        //     alert("Invalid GST Number");
        //     return;
        // }

        // Validate password
        if (
            passwordForm.newPassword ||
            passwordForm.confirmPassword
        ) {

            if (passwordForm.newPassword.length < 8) {
                toast.error("Password must be at least 8 characters.");
                return;
            }

            if (
                passwordForm.newPassword !==
                passwordForm.confirmPassword
            ) {
                toast.error("Passwords do not match.");
                return;
            }
        }

        const payload = {
            first_name: formData.firstName,
            last_name: formData.lastName,
            email: formData.email,
            contact: formData.contact,
            password: passwordForm.newPassword || "",
            password_confirmation: passwordForm.confirmPassword || "",
            address: formData.address,
            dob: formData.dob,
            city: formData.city,
            state: formData.state,
            country: formData.country,
            pincode: formData.pincode,
            organisation: formData.organisation,
            gst_number: formData.gstNumber,
            otp: isContactChanged ? formData.otp : "",
        };

        try {
            const res = await updateProfile(payload);

            await dispatch(fetchProfile());

            setOtpSent(false);

            setPasswordForm({
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
            });

            setFormData((prev) => ({
                ...prev,
                otp: "",
            }));

            toast.success(res.message || "Profile updated successfully");
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    const inputClass =
        "h-11 w-full rounded-lg border border-gray-300 bg-white px-4 text-sm text-[#333] placeholder:text-gray-400 outline-none transition-all duration-200 focus:border-[#C9060A] focus:ring-2 focus:ring-[#C9060A]/20";

    const labelClass = "mb-1.5 block text-sm font-medium text-[#333]";

    const originalContact = user?.contact || "";

    const isContactChanged = formData.contact !== originalContact;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-red-50 px-4 py-10">
            <div className="mx-auto max-w-4xl overflow-hidden   border border-gray-200 bg-white shadow-xl">
                {/* Header */}
                <div className="border-b border-[#c9060a] px-6 py-5">
                    <h1 className="text-2xl font-semibold text-[#333]">
                        Edit Profile
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Update your personal information.
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="grid grid-cols-1 gap-5 p-6 md:grid-cols-2"
                >
                    {/* First Name */}
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

                    {/* Last Name */}
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

                    {/* Email */}
                    <div>
                        <label className={labelClass}>
                            Email <span className="text-[#C9060A]">*</span>
                        </label>
                        <input
                            type="email"
                            name="email"
                            readOnly
                            value={formData.email}
                            onChange={handleChange}
                            className="h-11 w-full cursor-not-allowed rounded-lg border border-gray-300 bg-gray-50 px-4 text-sm text-[#333] cursor-default focus:outline-none"
                        />
                    </div>

                    {/* Contact / OTP */}
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
                            <>
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
                                            className="rounded-md bg-[#C9060A] px-4 text-white disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
                                        >
                                            {sendingOtp
                                                ? "Sending..."
                                                : countdown > 0
                                                    ? `${countdown}s`
                                                    : "Get OTP"}
                                        </button>
                                    )}
                                </div>
                            </>
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
                                    <p className="text-sm text-gray-500 italic">
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
                                        {countdown > 0
                                            ? `Resend in ${countdown}s`
                                            : "Resend OTP"}
                                    </button>
                                </div>
                            </>
                        )}
                    </div>



                    {/* Date of Birth */}
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

                    {/* Organisation */}
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
                                onClick={() => setShowNewPassword(!showNewPassword)}
                                className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-[#C9060A] cursor-pointer"
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
                                onClick={() =>
                                    setShowConfirmPassword(!showConfirmPassword)
                                }
                                className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-[#C9060A] cursor-pointer"
                            >
                                {showConfirmPassword ? (
                                    <EyeOff size={18} />
                                ) : (
                                    <Eye size={18} />
                                )}
                            </button>
                        </div>
                    </div>


                    <div>
                        <label className={labelClass}>GST Number</label>

                        <input
                            name="gstNumber"
                            value={formData.gstNumber}
                            onChange={(e) =>
                                setFormData(prev => ({
                                    ...prev,
                                    gstNumber: e.target.value.toUpperCase()
                                }))
                            }
                            className={inputClass}
                            placeholder="22AAAAA0000A1Z5"
                        />
                    </div>

                    {/* Country */}
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


                    {/* State, City & Pincode */}
                    <div className="md:col-span-2">
                        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                            {/* State */}
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

                            {/* City */}
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

                            {/* Pincode */}
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


                    {/* Address */}
                    <div className="md:col-span-2">
                        <label className={labelClass}>
                            Address <span className="text-[#C9060A]">*</span>
                        </label>
                        <textarea
                            rows={3}
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-[#333] placeholder:text-gray-400 outline-none transition-all duration-200 focus:border-[#C9060A] focus:ring-2 focus:ring-[#C9060A]/20 resize-none"
                        />
                    </div>



                    {/* Actions */}
                    <div className="md:col-span-2 mt-2 flex justify-end gap-3 border-t border-gray-200 pt-5">
                        <button
                            type="button"
                            className="  border border-gray-300 px-5 py-2.5 text-sm font-medium text-[#333] transition hover:bg-gray-100 cursor-pointer"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="  bg-[#C9060A] px-6 py-2.5 text-sm font-medium text-white transition hover:bg-[#a30508] cursor-pointer"
                        >
                            Update Profile
                        </button>
                    </div>


                </form>
            </div>
        </div>
    );
}