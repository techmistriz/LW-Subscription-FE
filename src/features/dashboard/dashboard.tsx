"use client";

import { getPlans } from "@/features/auth/services/plans";
import { useAuth } from "@/features/authContext";
import Link from "next/link";
import React, { useEffect, useState } from "react";

export default function Dashboard() {
  const { user, loading } = useAuth();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [subscription, setSubscription] = useState<any>({
    name: "Free Plan",
    amount: 0,
    status: "ACTIVE",
  });

  const [plans, setPlans] = useState<any[]>([]);
  const [isHighest, setIsHighest] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });

  // SAFE LOAD 
  useEffect(() => {
    const safeParse = (key: string) => {
      try {
        const data = sessionStorage.getItem(key);
        if (!data || data === "undefined") return null;
        return JSON.parse(data);
      } catch {
        sessionStorage.removeItem(key);
        return null;
      }
    };

    const storedUser = safeParse("user");
    const storedSub = safeParse("subscription");

    // USER sync
    const baseUser = user || storedUser;
console.log("dashboard", baseUser)
    if (baseUser) {
      setFormData({
        firstName: baseUser.first_name || "",
        lastName: baseUser.last_name || "",
        email: baseUser.email || "",
      });
    }

    // SUBSCRIPTION sync 
    const activeSub = baseUser?.active_subscription;

    if (activeSub) {
      const normalized = {
        id: activeSub.id,
        plan_id: activeSub.plan?.id,
        name: activeSub.plan?.name,
        amount: Number(activeSub.plan?.price),
        status: activeSub.status,
        start_date: activeSub.start_date,
        end_date: activeSub.end_date,
        duration_value: activeSub.plan?.duration_value,
        duration_unit: activeSub.plan?.duration_unit,
        purchase_type: activeSub.purchase_type,
      };

      setSubscription(normalized);
      sessionStorage.setItem("subscription", JSON.stringify(normalized));
    } else if (storedSub) {
      setSubscription(storedSub);
    }
  }, [user]);

  // PLANS 
  useEffect(() => {
    const fetchPlans = async () => {
      const data = await getPlans();
      setPlans(data);

      const highest = data.reduce((prev: any, curr: any) =>
        Number(curr.price) > Number(prev.price) ? curr : prev
      );

      const currentPlanId = subscription?.plan_id;

      if (currentPlanId && highest?.id) {
        setIsHighest(Number(currentPlanId) === Number(highest.id));
      } else {
        setIsHighest(false);
      }
    };

    fetchPlans();
  }, [subscription]);

  if (loading) return null;

  const handleSave = () => {
    sessionStorage.setItem("user", JSON.stringify(formData));
    setIsModalOpen(false);
  };

  // HELPERS 
  const isActive = subscription?.status === "ACTIVE";

  const formatAmount = (amount: any) => {
    const num = Number(amount);
    if (!num || num === 0) return "Free";
    return `₹${num.toLocaleString("en-IN")}`;
  };

  const formatDate = (date?: string) => {
    return date ? new Date(date).toDateString() : "—";
  };

  return (
    <div className="min-h-screen mt-10">
      <div className="max-w-6xl mx-auto p-4 md:p-8 border border-gray-200">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>

          <Link
            href={isHighest ? "#" : "/subscription"}
            className={`px-4 py-2 rounded-lg text-sm ${
              isHighest
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#333] text-white hover:bg-[#c6090a]"
            }`}
          >
            {isHighest ? "Current Plan" : "Upgrade Plan"}
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
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
            <h3 className="text-xl font-semibold text-[#333]">
              {subscription?.name || "—"}
            </h3>
          </div>

          <div className="bg-white p-4 rounded-xl shadow">
            <p className="text-sm text-gray-500">Status</p>
            <h3 className={`font-semibold ${isActive ? "text-green-600" : "text-red-600"}`}>
              {isActive ? "Active" : "Inactive"}
            </h3>
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
              <b>Member Since:</b> {formatDate(subscription?.start_date)}
            </p>

            <p className="text-sm text-[#333]">
              <b>Subscription ID:</b> {subscription?.id || "—"}
            </p>
          </div>

          {/* Plan */}
          <div className="bg-[#c9060a] text-white rounded-xl p-5 shadow">
            <p className="font-semibold mb-2">
              {subscription?.name || "No Plan"}
            </p>

            <h3 className="text-2xl font-bold">
              {formatAmount(subscription?.amount)}
            </h3>

            <p className="text-sm mt-2">
              Valid till - {formatDate(subscription?.end_date)}
            </p>

            <p className="text-xs mt-3 opacity-80">
              Duration:{" "}
              {subscription?.duration_value
                ? `${subscription?.duration_value} ${subscription?.duration_unit}`
                : "—"}
            </p>

            <p className="text-xs opacity-80">
              Type: {subscription?.purchase_type || "—"}
            </p>
          </div>
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
              readOnly
              onChange={(e) =>
                setFormData({ ...formData, firstName: e.target.value })
              }
              placeholder="First Name"
            />

            <input
              className="w-full border p-2 mb-3 rounded"
              value={formData.lastName}
              readOnly
              onChange={(e) =>
                setFormData({ ...formData, lastName: e.target.value })
              }
              placeholder="Last Name"
            />

            <div className="flex justify-end gap-2">
              <button onClick={() => setIsModalOpen(false)}>Cancel</button>
              <button
                onClick={handleSave}
                className="bg-[#333] text-white px-4 py-2 rounded hover:bg-[#c6090a]"
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