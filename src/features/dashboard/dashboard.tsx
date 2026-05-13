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
import {
  renewPlan,
  verifyRenewPayment,
} from "@/lib/api/subscription/subscription";

declare global {
  interface Window {
    Razorpay: any;
  }
}

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

  // In your Dashboard.tsx, update the subscription mapping
  //  FIXED: direct Redux subscription reference
  const subscription = subscriptionFromSlice;

  // debug only
  useEffect(() => {
    console.log(" LIVE SUBSCRIPTION UPDATE:", subscriptionFromSlice);
  }, [subscriptionFromSlice]);
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

  const now = new Date();

  const hasExpiredByDate = subscription?.end_date
    ? new Date(subscription.end_date) < now
    : false;

  const isActive = status === "ACTIVE" && !hasExpiredByDate;

  const isExpired = status === "EXPIRED" || hasExpiredByDate;

  const isHighestPlan = useMemo(() => {
    if (!highestPlan || !subscription?.plan_id) return false;
    return Number(subscription.plan_id) === Number(highestPlan.id);
  }, [highestPlan, subscription?.plan_id]);

  const isFreePlan = !subscription || Number(subscription?.amount || 0) === 0;
  const isPaidPlan = !isFreePlan;

  const expiredDays = useMemo(() => {
    if (!subscription?.end_date) return 0;
    const end = new Date(subscription.end_date);
    const now = new Date();
    if (now <= end) return 0;
    return Math.floor((now.getTime() - end.getTime()) / (1000 * 60 * 60 * 24));
  }, [subscription?.end_date]);

  const isLocked = isHighestPlan && isActive;

  /* ---------------- BUTTON LABEL ---------------- */

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

  const handleRenewPlan = async () => {
    try {
      if (!subscription?.id) return;

      const res = await renewPlan(subscription.id);

      console.log("Renew response", res);

      const payment = res?.data?.payment;

      if (!payment) {
        alert("Payment data not received");
        return;
      }

      const options = {
        key: payment.razorpay_key,
        amount: payment.amount,
        currency: payment.currency || "INR",
        order_id: payment.order_id,

        name: "Lex Witness",

        handler: async function (response: any) {
          try {
            console.log(" Razorpay Success Response:", response);

            const verifyRes = await verifyRenewPayment({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              membership_plan_id: subscription.plan_id,
              purchase_type: "RENEW",
            });

            //  FULL RESPONSE LOG (MOST IMPORTANT)
            console.log(" VERIFY API FULL RESPONSE:", verifyRes);
            console.log(" VERIFY DATA:", verifyRes?.data);
            console.log(
              " UPDATED SUBSCRIPTION:",
              verifyRes?.data?.subscription,
            );

            if (verifyRes?.status) {
              const sub = verifyRes.data.subscription;

              console.log(" RAW SUB FROM API:", sub);

              //  NORMALIZE like your dashboard expects
              const formattedSub = {
                id: sub.id,
                plan_id: sub.membership_plan_id,
                name: sub.plan?.name,
                amount: Number(sub.plan?.price || sub.total_amount || 0),
                status: sub.status,
                start_date: sub.start_date,
                end_date: sub.end_date,
                duration_value: sub.plan?.duration_value,
                duration_unit: sub.plan?.duration_unit,
                purchase_type: sub.purchase_type,
                features: sub.plan?.feature,
                tag: sub.plan?.tag,
              };

              console.log(" FORMATTED SUB FOR REDUX:", formattedSub);

              //  update Redux instantly
              dispatch(setSubscription(formattedSub));

              //  force React refresh (important)
              setDataLoaded(false);
              requestAnimationFrame(() => setDataLoaded(true));
            }
          } catch (error) {
            console.error(" Verify failed:", error);
          }
        },

        prefill: {
          name: `${user?.first_name || ""} ${user?.last_name || ""}`,
          email: user?.email,
          contact: user?.contact,
        },

        theme: {
          color: "#c9060a",
        },

        retry: {
          enabled: true,
        },

        modal: {
          ondismiss: function () {
            console.log("Payment popup closed");
          },
        },
      };

      if (!window.Razorpay) {
        alert("Razorpay SDK failed to load");
        return;
      }

      const razor = new window.Razorpay(options);
      razor.open();
    } catch (error: any) {
      console.log("RENEW ERROR =>", error?.response?.data);

      alert(error?.response?.data?.message || "Renew failed");
    }
  };

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

          <div className="flex gap-3">
            {/* EXPIRED → SHOW BOTH BUTTONS */}
            {isFreePlan && (
              <Link
                href="/subscription"
                className="px-4 py-2 rounded-lg text-sm bg-[#333] text-white hover:bg-[#c6090a]"
              >
                Upgrade Your Plan
              </Link>
            )}
            {isPaidPlan && isActive && !isHighestPlan && (
              <>
                <Link
                  href="/subscription"
                  className="px-4 py-2 rounded-lg text-sm bg-[#333] text-white hover:bg-[#c6090a]"
                >
                  Change Plan
                </Link>

                {remainingDays !== null && remainingDays <= 30 && (
                  <button
                    onClick={handleRenewPlan}
                    className="px-4 py-2 rounded-lg text-sm bg-[#c9060a] text-white hover:bg-[#333]"
                  >
                    Renew Your Current Plan
                  </button>
                )}
              </>
            )}
            {isPaidPlan && isExpired && !isHighestPlan && (
              <Link
                href="/subscription"
                className="px-4 py-2 rounded-lg text-sm bg-[#333] text-white hover:bg-[#c6090a]"
              >
                Change Plan
              </Link>
            )}

            {/* {isHighestPlan && null}  */}
          </div>
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
