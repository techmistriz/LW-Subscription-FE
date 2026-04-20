"use client";

import { useAuth } from "@/features/authContext";
import React, { useEffect, useState } from "react";

export default function Dashboard() {
  const { user, logout, loading } = useAuth();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });

  // ✅ Load from sessionStorage
  useEffect(() => {
    const stored = sessionStorage.getItem("user");

    if (stored) {
      setFormData(JSON.parse(stored));
    } else if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
      });
    }
  }, [user]);

  if (loading) return null;

  const handleSave = () => {
    sessionStorage.setItem("user", JSON.stringify(formData));
    setIsModalOpen(false);
  };

  const usagePercent = 40;

  return (
    <div className="min-h-screen  mt-10 ">
      
      {/* Container */}
      <div className="max-w-6xl mx-auto p-4 md:p-8 border border-gray-200 ">

        {/* Header Row */}
        <div className="flex justify-between items-center mb-6">
           <h1 className="text-2xl text-[#333] font-semibold">📖 Dashboard</h1>

          {/* <button
            onClick={logout}
            className="px-4 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-500 hover:text-white"
          >
            Logout
          </button> */}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 ">
          <div className="bg-white p-4 rounded-xl shadow">
            <p className="text-sm text-gray-500">Articles Read</p>
            <h3 className="text-xl font-semibold text-[#333]">18</h3>
          </div>

          <div className="bg-white p-4 rounded-xl shadow">
            <p className="text-sm text-gray-500">Remaining</p>
            <h3 className="text-xl font-semibold text-[#333]">32</h3>
          </div>

          <div className="bg-white p-4 rounded-xl shadow">
            <p className="text-sm text-gray-500">Plan</p>
            <h3 className="text-xl font-semibold text-[#333]">Premium</h3>
          </div>

          <div className="bg-white p-4 rounded-xl shadow">
            <p className="text-sm text-gray-500">Status</p>
            <h3 className="text-green-600 font-semibold">Active</h3>
          </div>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 gap-6">

          {/* User */}
          <div className="bg-white rounded-xl shadow p-5">
            <div className="flex justify-between mb-3">
              <h2 className="font-semibold text-[#333]">User Details</h2>
              <button
                onClick={() => setIsModalOpen(true)}
                className="text-[#c9060a] text-sm cursor-pointer"
              >
                Edit
              </button>
            </div>

            <p className="text-sm text-[#333]">
              <b>Name:</b> {formData.firstName} {formData.lastName}
            </p>
            <p className="text-sm text-[#333]">
              <b>Email:</b> {formData.email}
            </p>
             <p className="text-sm text-[#333]">
                <b >Member Since:</b> —
              </p>
          </div>

          {/* Plan */}
          <div className="bg-[#c9060a] text-white rounded-xl p-5 shadow">
            <h2 className="font-semibold mb-2">Your Plan</h2>
            <p className="text-sm opacity-80 ">Premium</p>
            <h3 className="text-2xl font-bold">₹199/month</h3>
            <p className="text-sm mt-2">Valid till 30 April 2026</p>
          </div>

          {/* Usage */}
        {/* <div className="bg-white rounded-xl shadow p-5 md:col-span-2">
  <h2 className="font-semibold mb-3">Article Usage</h2>

  <div className="w-full bg-gray-200 h-4 rounded-full overflow-hidden">
  <div
    className="h-full !bg-red-500 rounded-full transition-all duration-500"
    style={{ width: `${usagePercent}%`, backgroundColor:'#c6090a' }}
  />
</div>
</div> */}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-white p-6 rounded-xl w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="font-semibold mb-4">Edit Profile</h2>

            <input
              className="w-full border p-2 mb-3 rounded"
              value={formData.firstName}
              onChange={(e) =>
                setFormData({ ...formData, firstName: e.target.value })
              }
              placeholder="First Name"
            />

            <input
              className="w-full border p-2 mb-3 rounded"
              value={formData.lastName}
              onChange={(e) =>
                setFormData({ ...formData, lastName: e.target.value })
              }
              placeholder="Last Name"
            />

            <div className="flex justify-end gap-2">
              <button onClick={() => setIsModalOpen(false)}>Cancel</button>
              <button
                onClick={handleSave}
                className="bg-black text-white px-4 py-2 rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}