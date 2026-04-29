"use client";

import { getPlans } from "@/features/auth/services/plans";
import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import { useAppSelector, useAppDispatch } from "@/redux/store/hooks";
import { setSubscription } from "@/redux/store/slices/subscriptionSlice";
import { useRouter } from "next/navigation";
import PageLoader from "@/components/Loader/PageLoader";

/* ---------------- COMPONENT ---------------- */
export default function Dashboard() {
  const router = useRouter();
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

  /* ---------------- AUTH GUARD ---------------- */
  useEffect(() => {
    if (loading) return;
    if (!user) router.replace("/sign-in");
  }, [user, loading, router]);

  /* ---------------- SYNC USER ---------------- */
  useEffect(() => {
    if (!user) return;

    setFormData({
      firstName: user.first_name || "",
      lastName: user.last_name || "",
      email: user.email || "",
      contact: user.contact || "",
      address: user.address || "",
    });

    const sub = user.active_subscription;

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

  /* ---------------- DERIVED DATA ---------------- */
  const highestPlan = useMemo(() => {
    if (!plans.length) return null;

    return plans.reduce((prev, curr) =>
      Number(curr.price) > Number(prev.price) ? curr : prev,
    );
  }, [plans]);

  const isActive = subscription?.status === "ACTIVE";
  const isExpired = subscription?.status === "EXPIRED";

  const isHighestPlan = useMemo(() => {
    if (!highestPlan || !subscription?.plan_id) return false;
    return Number(subscription.plan_id) === Number(highestPlan.id);
  }, [highestPlan, subscription?.plan_id]);

  /* ---------------- BUTTON LOGIC ---------------- */
  const buttonLabel = useMemo(() => {
    if (!subscription) return "Choose Plan";
    if (isExpired) return "Renew Plan";
    if (isHighestPlan && isActive) return "Current Plan";
    return "Upgrade Plan";
  }, [subscription, isExpired, isHighestPlan, isActive]);

  const buttonLink = isHighestPlan && isActive ? "#" : "/subscription";
  const buttonDisabled = isHighestPlan && isActive;

  /* ---------------- FORMATTERS ---------------- */
  const formatAmount = (amount?: number) =>
    !amount ? "0.00" : `₹${amount.toLocaleString("en-IN")}`;

  const formatDate = (date?: string) =>
    date ? new Date(date).toDateString() : "—";

  /* ---------------- EARLY RETURN ---------------- */
  // if (loading || !user) return null;

  const isFreePlan = !subscription?.amount || Number(subscription.amount) === 0;

  const planLabel = isFreePlan ? "Free Plan" : "Premium Plan";

  /* ---------------- REMAINING DAYS ---------------- */
  const endDate = subscription?.end_date;

  const remainingDays = useMemo(() => {
    if (!endDate) return null;

    const diff = new Date(endDate).getTime() - new Date().getTime();

    if (diff <= 0) return 0;

    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }, [endDate]);

  const remainingDaysLabel = useMemo(() => {
    if (remainingDays === null) return "—";
    if (remainingDays === 0) return "Expired";
    return `${remainingDays} day${remainingDays > 1 ? "s" : ""} left`;
  }, [remainingDays]);

  /* ---------------- UI ---------------- */
  if (loading || !user) {
    return (
      <div className="min-h-screen  flex justify-center">
        <PageLoader />
      </div>
    );
  }
  return (
    <div className="min-h-screen mt-10">
      <div className="max-w-6xl mx-auto p-4 md:p-8 border border-gray-200">
        {/*----------------- HEADER -----------------*/}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Dashboard</h1>

          {/* <Link
            href={buttonLink}
            className={`px-4 py-2 rounded-lg text-sm ${
              buttonDisabled
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#333] text-white hover:bg-[#c6090a]"
            }`}
          >
            {buttonLabel}
          </Link> */}
        </div>

        {/*----------------- STATS -----------------*/}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatCard title="Plan" value={subscription?.name || "No Plan"} />
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
          <StatCard
            title="Remaining"
            value={remainingDaysLabel}
            status={remainingDays === 0}
          />
        </div>

        {/*----------------- GRID -----------------*/}
        <div className="grid md:grid-cols-2 gap-6">
          {/* USER */}
          <div className="bg-white rounded-xl shadow-sm p-5">
            <h2 className="font-semibold mb-3">User Details</h2>

            <div className="space-y-2 text-sm">
              <Row
                label="Name"
                value={`${formData.firstName} ${formData.lastName}`}
              />
              <Row label="Email" value={formData.email} />
              <Row label="Contact" value={formData.contact || "—"} />
              <Row label="Address" value={formData.address || "—"} />
              <Row
                label="Member Since"
                value={formatDate(subscription?.start_date)}
              />
              <Row label="Subscription ID" value={subscription?.id || "—"} />
            </div>
          </div>

          {/*----------------- PLAN -----------------*/}
          <div className="bg-[#c9060a] rounded-xl p-5 text-white shadow-sm">
            <p className="text-xs text-[#ffe4e6] uppercase tracking-wider">
              Your Current Plan
            </p>

            <div className="border-t border-white/20 my-4" />

            {/* FEATURES */}
            {user.active_subscription?.plan?.feature &&
              (() => {
                const cleanFeatures = user.active_subscription.plan.feature
                  ?.replace(/style="[^"]*"/g, "") // remove inline styles
                  ?.replace(/class="[^"]*"/g, ""); // remove all classes

                return (
                  <div className="mb-6">
                    <p className="text-[10px] text-[#fecaca] mb-2 uppercase font-semibold tracking-wider">
                      Included Features
                    </p>

                    <div
                      className="plan-features text-[#fff1f2] text-sm leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: cleanFeatures }}
                    />
                  </div>
                );
              })()}

            <div className="space-y-2 text-sm">
              <RowWhite
                label="Valid till"
                value={formatDate(subscription?.end_date)}
              />
              <RowWhite
                label="Duration"
                value={
                  subscription?.duration_value
                    ? `${subscription.duration_value} ${subscription.duration_unit}`
                    : "—"
                }
              />
              <RowWhite
                label="Type"
                value={subscription?.purchase_type || "—"}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- REUSABLE COMPONENTS ---------------- */
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
          status && value !== "Active"
            ? "text-[#c6090a]"
            : status
              ? "text-green-600"
              : "text-[#333]"
        }`}
      >
        {value}
      </h3>
    </div>
  );
}

function Row({ label, value }: any) {
  return (
    <div className="flex justify-between">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

function RowWhite({ label, value }: any) {
  return (
    <div className="flex justify-between">
      <span className="opacity-70">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
