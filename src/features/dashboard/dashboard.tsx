"use client";

import { getPlans } from "@/features/auth/services/plans";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "@/redux/store/hooks";
import { setSubscription } from "@/redux/store/slices/subscriptionSlice";

export default function Dashboard() {
  const dispatch = useAppDispatch();

  const { user, loading } = useAppSelector((state) => state.auth);
  const subscription = useAppSelector((state) => state.subscription.data);

  const [plans, setPlans] = useState<any[]>([]);
  const [isHighest, setIsHighest] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });

  //  USER + SUBSCRIPTION → Redux
  useEffect(() => {
    if (!user) return;

    // USER
    setFormData({
      firstName: user.first_name || "",
      lastName: user.last_name || "",
      email: user.email || "",
    });

    // SUBSCRIPTION → dispatch once
    const activeSub = user?.active_subscription;

    if (activeSub) {
      dispatch(
        setSubscription({
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
        })
      );
    }
  }, [user, dispatch]);

  //  FETCH PLANS
  useEffect(() => {
    const fetchPlans = async () => {
      const data = await getPlans();
      setPlans(data);

      const highest = data.reduce((prev: any, curr: any) =>
        Number(curr.price) > Number(prev.price) ? curr : prev
      );

      const currentPlanId = subscription?.plan_id;

      setIsHighest(
        currentPlanId && highest?.id
          ? Number(currentPlanId) === Number(highest.id)
          : false
      );
    };

    fetchPlans();
  }, [subscription]);

  if (loading) return null;

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
             {/* <h2 className="font-semibold text-[#dcbcbc]">Your Plan</h2> */}
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
    </div>
  );
}