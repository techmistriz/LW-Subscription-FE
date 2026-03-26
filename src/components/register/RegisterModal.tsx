"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/features/authContext";

const RegisterModal = ({ onClose }: { onClose: () => void }) => {
  const router = useRouter();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };


  const { login } = useAuth();

const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();

  login(form); // ONLY this is needed

  // onClose();
   if (onClose) onClose(); 
  router.push("/subscription");
};

  return (
    <div className="fixed inset-0 z-[9999] bg-black/50 flex items-center justify-center">
      <div className="bg-white w-full max-w-lg p-6 rounded shadow-lg relative">
        {/* Close */}
        {/* <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 text-xl"
        >
          ✕
        </button> */}

        <h2 className="text-xl font-semibold text-center mb-2">
          Register to Continue
        </h2>

        <p className="text-center text-gray-500 mb-4 text-sm">
          Fill your details to register
        </p>

        <form onSubmit={handleSubmit} className="grid gap-3">
          <input
            name="firstName"
            placeholder="First Name"
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />
          <input
            name="lastName"
            placeholder="Last Name"
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />
          <input
            name="phone"
            type="tel"
            placeholder="Phone Number"
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />

          <button className="bg-[#c9060a] text-white py-2 mt-2 cursor-pointer">Register</button>
        </form>

        {/* Sign In Button */}
        <div className="text-center mt-4 text-sm ">
          Already have an account?{" "}
          <button
  onClick={() => {
    // Close the modal
    if (onClose) onClose();

    // Clear any temporary registration info if needed
    // (optional, you may skip this)
    // localStorage.removeItem("registered");

    // Navigate to sign-in
    router.push("/sign-in");
  }}
  className="underline font-medium cursor-pointer"
>
  Sign In
</button>
        </div>
      </div>
    </div>
  );
};

export default RegisterModal;
