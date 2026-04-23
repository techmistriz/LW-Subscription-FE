"use client";

import { getPlans } from "@/features/auth/services/plans";
import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import { useAppSelector, useAppDispatch } from "@/redux/store/hooks";
import { setSubscription } from "@/redux/store/slices/subscriptionSlice";

export default function Dashboard() {
  const dispatch = useAppDispatch();

  const { user, loading } = useAppSelector((state) => state.auth);
  const subscription = useAppSelector((state) => state.subscription.data);

  const [plans, setPlans] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    contact: "",
    address: "",
  });

  /* ---------------- USER + SUBSCRIPTION ---------------- */
  useEffect(() => {
    if (!user) return;

    setFormData({
      firstName: user.first_name || "",
      lastName: user.last_name || "",
      email: user.email || "",
      contact: user.contact || "",
      address: user.address || "",
    });

    const sub = user?.active_subscription;

    if (sub) {
      dispatch(
        setSubscription({
          id: sub.id,
          plan_id: sub.plan?.id,
          name: sub.plan?.name,
          amount: Number(sub.plan?.price),
          status: sub.status,
          start_date: sub.start_date,
          end_date: sub.end_date,
          duration_value: sub.plan?.duration_value,
          duration_unit: sub.plan?.duration_unit,
          purchase_type: sub.purchase_type,
        }),
      );
    }
  }, [user, dispatch]);

  /* ---------------- FETCH PLANS ---------------- */
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const data = await getPlans();
        setPlans(data || []);
      } catch {
        setPlans([]);
      }
    };

    fetchPlans();
  }, []);

  /* ---------------- DERIVED VALUES ---------------- */

  const highestPlan = useMemo(() => {
    if (!plans.length) return null;

    return plans.reduce((prev, curr) =>
      Number(curr.price) > Number(prev.price) ? curr : prev,
    );
  }, [plans]);

  const isActive = subscription?.status === "ACTIVE";
  const isExpired = subscription?.status === "EXPIRED";

  const isHighestPlan =
    highestPlan && subscription?.plan_id
      ? Number(subscription.plan_id) === Number(highestPlan.id)
      : false;

  /* ---------------- BUTTON LOGIC ---------------- */

  const buttonLabel = useMemo(() => {
    if (!subscription) return "Choose Plan";

    if (isExpired) return "Renew Plan";

    if (isHighestPlan && isActive) return "Current Plan";

    return "Upgrade Plan";
  }, [subscription, isExpired, isHighestPlan, isActive]);

  const buttonLink = useMemo(() => {
    if (isHighestPlan && isActive) return "#";
    return "/subscription";
  }, [isHighestPlan, isActive]);

  const buttonDisabled = isHighestPlan && isActive;

  /* ---------------- HELPERS ---------------- */

  const formatAmount = (amount?: number) => {
    if (!amount || amount === 0) return "0.00";
    return `₹${amount.toLocaleString("en-IN")}`;
  };

  const formatDate = (date?: string) => {
    return date ? new Date(date).toDateString() : "—";
  };

  if (loading) return null;

  const isFreePlan = !subscription?.amount || Number(subscription.amount) === 0;

  const planLabel = isFreePlan ? "Free Plan" : `Premium Plan `;

  /* ---------------- UI ---------------- */

  return (
    <div className="min-h-screen mt-10">
      <div className="max-w-6xl mx-auto p-4 md:p-8 border border-gray-200">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>

          <Link
            href={buttonLink}
            className={`px-4 py-2 rounded-lg text-sm ${
              buttonDisabled
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#333] text-white hover:bg-[#c6090a]"
            }`}
          >
            {buttonLabel}
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatCard title="Plan Type" value={planLabel} />

          <StatCard title="Price" value={formatAmount(subscription?.amount)} />

          <StatCard
            title="Duration"
            value={`${subscription?.duration_value || "-"} ${subscription?.duration_unit || ""}`}
          />

          <StatCard
            title="Status"
            value={isActive ? "Active" : "Inactive"}
            status
          />
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* User */}
          <div className="bg-white rounded-xl shadow-sm p-5">
            <h2 className="font-semibold text-[#333] mb-3">User Details</h2>

            <div className="space-y-2 text-sm text-[#333]">
              <div className="flex justify-between">
                <span className="text-gray-500">Name</span>
                <span className="font-medium">
                  {formData.firstName} {formData.lastName}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Email</span>
                <span className="font-medium">{formData.email}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Contact</span>
                <span className="font-medium">{formData.contact || "—"}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Address</span>
                <span className="font-medium text-right max-w-[60%]">
                  {formData.address || "—"}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Member Since</span>
                <span className="font-medium">
                  {formatDate(subscription?.start_date)}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Subscription ID</span>
                <span className="font-medium">{subscription?.id || "—"}</span>
              </div>
            </div>
          </div>

          {/* Plan */}
          <div className="rounded-xl p-px bg-linear-to-br from-[#ff3b3b] via-[#c9060a] to-[#7a0406] shadow-lg">
            <div className="bg-[#c9060a] rounded-xl p-5 text-white flex flex-col justify-between h-full">
              {/* Header */}
              <div>
                <p className="text-xs uppercase tracking-wider opacity-70">
                  Current Plan
                </p>
                <h2 className="text-2xl font-bold mt-1">
                  {subscription?.name || "No Plan"}
                </h2>
              </div>

              {/* Price */}
              <div className="mt-4">
                <h3 className="text-3xl font-bold">
                  {formatAmount(subscription?.amount)}
                </h3>
                <p className="text-xs opacity-70 mt-1">
                  inclusive of all taxes
                </p>
              </div>

              {/* Divider */}
              <div className="border-t border-white/20 my-4"></div>

              {/* Details */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="opacity-70">Valid till</span>
                  <span className="font-medium">
                    {formatDate(subscription?.end_date)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="opacity-70">Duration</span>
                  <span className="font-medium">
                    {subscription?.duration_value
                      ? `${subscription.duration_value} ${subscription.duration_unit}`
                      : "—"}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="opacity-70">Type</span>
                  <span className="font-medium">
                    {subscription?.purchase_type || "—"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- SMALL COMPONENT ---------------- */

function StatCard({
  title,
  value,
  status = false,
}: {
  title: string;
  value: string;
  status?: boolean;
}) {
  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <p className="text-sm text-gray-500">{title}</p>
      <h3
        className={`text-xl font-semibold ${
          status
            ? value === "Active"
              ? "text-green-600"
              : "text-red-600"
            : "text-[#333]"
        }`}
      >
        {value}
      </h3>
    </div>
  );
}
