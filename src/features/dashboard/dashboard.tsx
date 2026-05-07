"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { getPlans } from "@/features/auth/services/plans";
import { useAppSelector, useAppDispatch } from "@/redux/store/hooks";
import {
  setSubscription,
  loadSubscriptionFromStorage,
} from "@/redux/store/slices/subscriptionSlice";
import { loadUserFromStorage } from "@/redux/store/slices/authSlice";
import PageLoader from "@/components/Loader/PageLoader";

export default function Dashboard() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { user, loading, isAuthenticated, isInitialized } = useAppSelector(
    (state) => state.auth,
  );
  const subscriptionFromSlice = useAppSelector(
    (state) => state.subscription.data,
  );
  const isSubscriptionLoaded = useAppSelector(
    (state) => state.subscription.isLoaded,
  );

  const [plans, setPlans] = useState<any[]>([]);
  const [dataLoaded, setDataLoaded] = useState(false);

  // Force load data from storage on mount
  useEffect(() => {
    console.log("Dashboard mounted, loading data from storage...");
    dispatch(loadUserFromStorage());
    dispatch(loadSubscriptionFromStorage());
  }, [dispatch]);

  // Debug: Log what's in storage and Redux
  useEffect(() => {
    if (isInitialized) {
      console.log("=== DASHBOARD DATA DEBUG ===");
      console.log("User from Redux:", user);
      console.log("Subscription from slice:", subscriptionFromSlice);
      console.log("User has active_subscription:", user?.active_subscription);
      console.log("Session user:", sessionStorage.getItem("user"));
      console.log(
        "Session subscription:",
        sessionStorage.getItem("subscription"),
      );
      console.log("Session token:", sessionStorage.getItem("token"));
      setDataLoaded(true);
    }
  }, [user, subscriptionFromSlice, isInitialized]);

  // Combine subscription data from both sources
  // In your Dashboard.tsx, update the subscription mapping
  const subscription = useMemo(() => {
    // First check subscription slice
    if (subscriptionFromSlice) {
      console.log("Using subscription from slice:", subscriptionFromSlice);
      return subscriptionFromSlice;
    }

    // Then check user's active_subscription
    if (user?.active_subscription) {
      console.log(
        "Using subscription from user.active_subscription:",
        user.active_subscription,
      );
      const sub = user.active_subscription;
      return {
        id: sub.id,
        plan_id: sub.plan_id || sub.membership_plan_id, // ✅ Handle both field names
        name: sub.plan?.name,
        amount: Number(sub.plan?.price || 0),
        status: sub.status,
        start_date: sub.start_date,
        end_date: sub.end_date,
        duration_value: sub.plan?.duration_value,
        duration_unit: sub.plan?.duration_unit,
        purchase_type: sub.purchase_type,
        features: sub.plan?.feature,
        is_trial: String(sub.plan?.is_trial ?? ""),
        tag: sub.plan?.tag,
      };
    }

    console.log("No subscription found");
    return null;
  }, [subscriptionFromSlice, user]);

  /* ---------------- AUTH GUARD ---------------- */
  useEffect(() => {
    if (loading) return;
    if (!isAuthenticated || !user) {
      console.log("User not authenticated, redirecting to sign-in");
      router.replace("/sign-in");
    }
  }, [user, loading, isAuthenticated, router]);

  /* ---------------- SYNC USER DETAILS ---------------- */
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    contact: "",
    address: "",
  });

  useEffect(() => {
    if (!user) return;

    setFormData({
      firstName: user.first_name || "",
      lastName: user.last_name || "",
      email: user.email || "",
      contact: user.contact || "",
      address: user.address || "",
    });
  }, [user]);

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

  const status = subscription?.status?.toUpperCase();

  console.log("statusss", status);

  const isActive = status === "ACTIVE";
  const isExpired = status === "EXPIRED";

  const isHighestPlan = useMemo(() => {
    if (!highestPlan || !subscription?.plan_id) return false;
    return Number(subscription.plan_id) === Number(highestPlan.id);
  }, [highestPlan, subscription?.plan_id]);

  const expiredDays = useMemo(() => {
    if (!subscription?.end_date) return 0;
    const end = new Date(subscription.end_date);
    const now = new Date();
    if (now <= end) return 0;
    return Math.floor((now.getTime() - end.getTime()) / (1000 * 60 * 60 * 24));
  }, [subscription?.end_date]);

  const isLocked = isHighestPlan && isActive;

  /* ---------------- BUTTON LABEL ---------------- */
  /* ---------------- BUTTON STATE ---------------- */
  const buttonState = useMemo(() => {
    // No subscription
    if (!subscription) {
      return {
        label: "Buy Plan",
        link: "/subscription",
        disabled: false,
      };
    }

    // Highest active plan
    if (isHighestPlan && isActive) {
      return {
        label: "Current Plan",
        link: "#",
        disabled: true,
      };
    }

    // Expired plan
    if (isExpired) {
      // Within 10 days
      if (expiredDays <= 10) {
        return {
          label: "Renew Plan",
          link: "/renew",
          disabled: false,
        };
      }

      // After 10 days
      return {
        label: "Buy Plan",
        link: "/subscription",
        disabled: false,
      };
    }

    // Active but not highest
    if (isActive && !isHighestPlan) {
      return {
        label: "Upgrade Plan",
        link: "/upgrade",
        disabled: false,
      };
    }

    // Default
    return {
      label: "Buy Plan",
      link: "/subscription",
      disabled: false,
    };
  }, [subscription, isHighestPlan, isActive, isExpired, expiredDays]);

  /* ---------------- BUTTON LINK ---------------- */
  // const buttonLink = useMemo(() => {
  //   if (isLocked) return "#";

  //   if (!subscription) return "/subscription";

  //   if (isExpired) {
  //     return expiredDays <= 10 ? "/renew" : "/subscription";
  //   }

  //   if (isActive && !isHighestPlan) return "/upgrade";

  //   return "/subscription";
  // }, [subscription, isExpired, expiredDays, isHighestPlan, isActive, isLocked]);

  /* ---------------- DATE HELPERS ---------------- */
  const formatAmount = (amount?: number) =>
    !amount ? "0.00" : `₹${amount.toLocaleString("en-IN")}`;

  const formatDate = (date?: string) =>
    date ? new Date(date).toDateString() : "—";

  const endDate = subscription?.end_date;

  const remainingDays = useMemo(() => {
    if (!endDate) return null;
    const end = new Date(endDate.replace(" ", "T"));
    const now = new Date();
    const diff = end.getTime() - now.getTime();
    return diff > 0 ? Math.ceil(diff / (1000 * 60 * 60 * 24)) : 0;
  }, [endDate]);

  const remainingDaysLabel = useMemo(() => {
    if (remainingDays === null) return "—";
    if (remainingDays === 0) return "0 days";
    return `${remainingDays} day${remainingDays > 1 ? "s" : ""} left`;
  }, [remainingDays]);

  /* ---------------- LOADER ---------------- */
  if (loading || !dataLoaded || !isInitialized || !isSubscriptionLoaded) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <PageLoader />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  /* ---------------- UI ---------------- */
  return (
    <div className="min-h-screen mt-10">
      <div className="max-w-6xl mx-auto p-4 md:p-8 border border-gray-200">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <Link
            href={buttonState.disabled ? "#" : buttonState.link}
            onClick={(e) => buttonState.disabled && e.preventDefault()}
            className={`px-4 py-2 rounded-lg text-sm transition-all ${
              buttonState.disabled
                ? "bg-gray-400 text-white cursor-not-allowed pointer-events-none"
                : "bg-[#333] text-white hover:bg-[#c6090a]"
            }`}
          >
            {buttonState.label}
          </Link>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatCard title="Plan" value={subscription?.name || "No Plan"} />
          <StatCard title="Price" value={formatAmount(subscription?.amount)} />
          <StatCard
            title="Duration"
            value={
              subscription?.duration_value
                ? `${subscription.duration_value} ${subscription.duration_unit || ""}`
                : "—"
            }
          />
          <StatCard
            title="Status"
            // value={isActive ? "Active" : "Expired"}
            value={status || "No Plan"}
            status={isActive}
          />
          <StatCard
            title="Remaining"
            value={remainingDaysLabel}
            status={remainingDays === 0}
          />
        </div>

        {/* GRID */}
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

          {/* PLAN */}
          <div className="bg-[#c9060a] rounded-xl p-5 text-white">
            <p className="text-xs text-[#ffe4e6] uppercase tracking-wider">
              Your Current Plan
            </p>
            <div className="border-t border-white/20 my-4" />

            {subscription?.features && (
              <div className="mb-6">
                <p className="text-[10px] text-[#fecaca] mb-2 uppercase font-semibold">
                  Included Features
                </p>
                <div
                  className="text-sm leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: subscription.features,
                  }}
                />
              </div>
            )}

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

/* ---------------- COMPONENTS ---------------- */
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
        className={`text-xl font-semibold ${status ? "text-green-600" : "text-[#333]"}`}
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
