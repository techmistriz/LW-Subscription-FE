"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronDown,
  Calendar,
  Sparkles,
  Clock,
  CreditCard,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar as CalendarIcon,
  FileText,
  RefreshCw,
  ArrowUpRight,
} from "lucide-react";

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

  const activeSubscription = useAppSelector(
    (state) => state.subscription.active,
  );
  const pendingSubscription = useAppSelector(
    (state) => state.subscription.pending,
  );
  const isSubscriptionLoaded = useAppSelector(
    (state) => state.subscription.isLoaded,
  );

  const [plans, setPlans] = useState<any[]>([]);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [expandedUpgrades, setExpandedUpgrades] = useState<{
    [key: number]: boolean;
  }>({});

  useEffect(() => {
    dispatch(loadUserFromStorage());
    dispatch(loadSubscriptionFromStorage());
  }, [dispatch]);

  useEffect(() => {
    if (isInitialized) {
      setDataLoaded(true);
    }
  }, [user, activeSubscription, pendingSubscription, isInitialized]);

  const subscription = activeSubscription;

  const pendingSubscriptions = useMemo(() => {
    if (Array.isArray(pendingSubscription)) {
      return pendingSubscription.filter(
        (sub) => sub.status?.toUpperCase() === "PENDING",
      );
    }
    if (
      pendingSubscription &&
      pendingSubscription.status?.toUpperCase() === "PENDING"
    ) {
      return [pendingSubscription];
    }
    return [];
  }, [pendingSubscription]);

  const hasPendingUpgrades = pendingSubscriptions.length > 0;

  const toggleUpgradeExpand = (planId: number) => {
    setExpandedUpgrades((prev) => ({
      ...prev,
      [planId]: !prev[planId],
    }));
  };

  useEffect(() => {
    if (loading) return;
    if (!isAuthenticated || !user) {
      router.replace("/sign-in");
    }
  }, [user, loading, isAuthenticated, router]);

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

  const status = subscription?.status?.toUpperCase();

  const now = new Date();
  const hasExpiredByDate = subscription?.end_date
    ? new Date(subscription.end_date) < now
    : false;

  const isActive = status === "ACTIVE" && !hasExpiredByDate;

  const isExpired = hasExpiredByDate || status === "EXPIRED";
  const isFreePlan = !subscription || Number(subscription?.amount || 0) === 0;
  const isPaidPlan = !isFreePlan;

  const formatAmount = (amount?: number) =>
    !amount ? "0.00" : `₹${amount.toLocaleString("en-IN")}`;

  const formatDate = (date?: string) =>
    date ? new Date(date).toDateString() : "—";

  const endDate = subscription?.end_date;
  const remainingDays = useMemo(() => {
    if (!endDate) return null;
    const end = new Date(endDate);
    const now = new Date();
    const diff = end.getTime() - now.getTime();
    return diff > 0 ? Math.ceil(diff / (1000 * 60 * 60 * 24)) : 0;
  }, [endDate]);

  const remainingDaysLabel = useMemo(() => {
    if (remainingDays === null) return "—";
    if (remainingDays === 0) return "Expired";
    return `${remainingDays} day${remainingDays > 1 ? "s" : ""} left`;
  }, [remainingDays]);

  const handleRenewPlan = async () => {
    try {
      if (!subscription?.id) return;
      if (isFreePlan) {
        alert("Free plan cannot be renewed. Please upgrade to a paid plan.");
        return;
      }

      const res = await renewPlan(subscription.id);
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
            const verifyRes = await verifyRenewPayment({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              membership_plan_id: subscription.plan_id,
              purchase_type: "RENEW",
            });

            if (verifyRes?.status) {
              const sub = verifyRes.data.subscription;
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
              dispatch(setSubscription(formattedSub));
              setDataLoaded(false);
              requestAnimationFrame(() => setDataLoaded(true));
            }
          } catch (error) {
            console.error("Verify failed:", error);
          }
        },
        prefill: {
          name: `${user?.first_name || ""} ${user?.last_name || ""}`,
          email: user?.email,
          contact: user?.contact,
        },
        theme: { color: "#c9060a" },
        retry: { enabled: true },
        modal: { ondismiss: function () {} },
      };

      if (!window.Razorpay) {
        alert("Razorpay SDK failed to load");
        return;
      }

      const razor = new window.Razorpay(options);
      razor.open();
    } catch (error: any) {
      alert(error?.response?.data?.message || "Renew failed");
    }
  };

  if (loading || !dataLoaded || !isInitialized || !isSubscriptionLoaded) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <PageLoader />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 border border-gray-300 my-5">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-2xl font-semibold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Welcome back, {formData.firstName || "User"}!
              </h1>
              <p className="text-gray-500 text-sm  mt-1">
                Manage your subscription and account settings
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/invoice"
                className="inline-flex items-center gap-2 px-4 py-2 shadow-2xl  text-sm font-medium border border-gray-200 bg-white text-gray-700 hover:bg-gray-100 hover:border-gray-300 transition-all duration-200"
              >
                <FileText className="w-4 h-4" />
                Invoices
              </Link>
              <Link
                href="/subscription"
                className="inline-flex items-center gap-2 px-5 py-2  text-sm font-medium bg-gradient-to-r from-red-800 to-[#c9060a] text-white hover:from-gray-900 hover:to-[#333] transition-all duration-200 shadow-lg shadow-gray-200"
              >
                <Sparkles className="w-4 h-4" />
                {isFreePlan ? "Upgrade Plan" : "Change Plan"}
              </Link>
              {isPaidPlan &&
                isActive &&
                remainingDays !== null &&
                remainingDays <= 30 &&
                remainingDays > 0 && (
                  <button
                    onClick={handleRenewPlan}
                    className="inline-flex items-center cursor-pointer gap-2 px-5 py-2  text-sm font-medium bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 transition-all duration-200 shadow-lg shadow-red-100"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Renew ({remainingDays} days)
                  </button>
                )}
            </div>
          </div>
        </div>

        {/* Pending Upgrades Banner */}
        {hasPendingUpgrades && (
          <div className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-[#c9060a] rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-[#c9060a]" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800">
                    {pendingSubscriptions.length} Upcoming Plan
                    {pendingSubscriptions.length > 1 ? "s" : ""} Scheduled
                  </p>
                  <p className="text-sm text-gray-600">
                    Your plan will be automatically upgraded on{" "}
                    {formatDate(pendingSubscription?.start_date)}
                    {pendingSubscriptions.length > 1 ? "s are" : " is"} waiting
                    to be activated
                  </p>

                  {/* <p className="text-sm text-gray-600">
                    Your new plan
                    {pendingSubscriptions.length > 1 ? "s are" : " is"} waiting
                    to be activated
                  </p> */}
                </div>

                {/* <div>
                <p className="text-blue-800 font-semibold">
                  Upgrade to {pendingSubscription.name} is scheduled
                </p>
                <p className="text-blue-600 text-sm">
                  Your plan will be automatically upgraded on {pendingActivationDate?.toDateString()}
                  {daysUntilUpgrade && daysUntilUpgrade > 0 && ` (in ${daysUntilUpgrade} days)`}
                </p>
              </div> */}
              </div>
              <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
                Pending Activation
              </span>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <StatCard
            icon={<Sparkles className="w-5 h-5" />}
            title="Current Plan"
            value={subscription?.name || "No Plan"}
            subtitle={
              subscription?.duration_value
                ? `${subscription.duration_value} ${subscription.duration_unit}`
                : ""
            }
          />
          {hasPendingUpgrades && (
            <StatCard
              icon={<Calendar className="w-5 h-5" />}
              title="Upcoming Plans"
              value={`${pendingSubscriptions.length} Plan${pendingSubscriptions.length > 1 ? "s" : ""}`}
              subtitle="Pending activation"
            />
          )}
          <StatCard
            icon={<CreditCard className="w-5 h-5" />}
            title="Base Price"
            value={formatAmount(subscription?.amount)}
            subtitle={subscription?.amount ? "+18% GST" : ""}
          />
          {/* <StatCard
            icon={<Clock className="w-5 h-5" />}
            title="Remaining"
            value={remainingDaysLabel}
            subtitle={remainingDays && remainingDays > 0 ? "until expiry" : ""}
            alert={
              remainingDays !== null && remainingDays <= 7 && remainingDays > 0
            }
          /> */}
          <StatCard
            icon={
              <div
                className={`w-2 h-2 rounded-full ${isActive ? "bg-green-500" : "bg-red-500"}`}
              />
            }
            title="Status"
            value={
              isActive ? "Active" : isExpired ? "Expired" : status || "No Plan"
            }
            subtitle={
              isActive && remainingDays ? `${remainingDays} days remaining` : ""
            }
            status={isActive}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-5">
          {/* User Details Card - Compact */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-4 py-2.5 border-b border-gray-100">
              <h2 className="font-semibold text-gray-800 text-sm">
                Account Details
              </h2>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Name</span>
                <span className="text-sm font-medium text-gray-800">{`${formData.firstName} ${formData.lastName}`}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Email</span>
                <span className="text-sm font-medium text-gray-800 truncate ml-2">
                  {formData.email}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Contact</span>
                <span className="text-sm font-medium text-gray-800">
                  {formData.contact || "—"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Address</span>
                <span className="text-sm font-medium text-gray-800 truncate ml-2">
                  {formData.address || "—"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Member Since</span>
                <span className="text-sm font-medium text-gray-800">
                  {formatDate(subscription?.start_date)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Subscription ID</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-800">
                    {subscription?.id || "—"}
                  </span>
                  {subscription?.id && (
                    <button
                      onClick={() =>
                        navigator.clipboard.writeText(String(subscription.id))
                      }
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <FileText className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Current Plan Card - Compact like reference */}
          <div className="bg-gradient-to-br from-red-600 to-red-700 rounded-xl shadow-lg overflow-hidden">
            <div className="px-4 py-2.5 bg-white/10">
              <h2 className="font-semibold text-white text-sm">
                YOUR CURRENT PLAN
              </h2>
            </div>
            <div className="p-4 text-white space-y-3">
              {/* Features Section */}
              {subscription?.features && (
                <div>
                  <p className="text-[10px] text-red-200 uppercase tracking-wider font-semibold mb-1.5">
                    INCLUDED FEATURES
                  </p>
                  <div
                    className="text-sm text-red-100 space-y-0.5 [&_ul]:list-disc [&_ul]:pl-4 [&_li]:mb-0.5"
                    dangerouslySetInnerHTML={{ __html: subscription.features }}
                  />
                </div>
              )}

              {/* Plan Details */}
              <div className="flex justify-between items-center pt-2">
                <span className="text-sm text-red-200">Valid till</span>
                <span className="text-sm font-medium text-white">
                  {formatDate(subscription?.end_date)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-red-200">Duration</span>
                <span className="text-sm font-medium text-white">
                  {subscription?.duration_value
                    ? `${subscription.duration_value} ${subscription.duration_unit}`
                    : "—"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-red-200">Type</span>
                <span className="text-sm font-medium text-white">
                  {subscription?.purchase_type || "—"}
                </span>
              </div>
              {subscription?.total_amount && (
                <div className="flex justify-between items-center pt-1 border-t border-white/20">
                  <span className="text-sm text-red-200">Total Amount</span>
                  <span className="text-sm font-bold text-white">
                    ₹{Number(subscription.total_amount).toLocaleString("en-IN")}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Upcoming Plans Section */}
        {hasPendingUpgrades && (
          <div className="mt-10">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-1 h-6 bg-[#c9060a] rounded-full"></div>
              <h2 className="text-xl font-bold text-gray-800">
                Upcoming Plans
              </h2>
              <span className="px-2.5 py-0.5 bg-blue-100 text-[#c9060a] text-sm font-medium rounded-full">
                {pendingSubscriptions.length}
              </span>
            </div>
            <div className="space-y-4">
              {pendingSubscriptions.map((pendingPlan, index) => {
                const pendingActivationDate = new Date(pendingPlan.start_date);
                const daysUntilUpgrade = Math.ceil(
                  (pendingActivationDate.getTime() - new Date().getTime()) /
                    (1000 * 60 * 60 * 24),
                );
                const isExpanded = expandedUpgrades[pendingPlan.id] || false;

                return (
                  <div
                    key={pendingPlan.id}
                    className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-all duration-300"
                  >
                    <button
                      onClick={() => toggleUpgradeExpand(pendingPlan.id)}
                      className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors duration-200 text-left"
                    >
                      <div className="flex items-center gap-4 flex-wrap">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center">
                            <Calendar className="w-5 h-5 text-[#c9060a]" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800">
                              Plan {index + 1}: {pendingPlan.name}
                            </p>
                            <p className="text-sm text-gray-500 mt-0.5">
                              {pendingPlan.duration_value}{" "}
                              {pendingPlan.duration_unit}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span
                            className={`px-2.5 py-1 text-sm font-medium rounded-full ${daysUntilUpgrade > 0 ? "bg-amber-100 text-amber-700" : "bg-green-100 text-green-700"}`}
                          >
                            {daysUntilUpgrade > 0
                              ? `Activates in ${daysUntilUpgrade} day${daysUntilUpgrade > 1 ? "s" : ""}`
                              : "Ready to activate"}
                          </span>
                          <ChevronDown
                            className={`w-5 h-5 text-gray-400 cursor-pointer hover:text-[#c9060a] transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                          />
                        </div>
                      </div>
                    </button>

                    <div
                      className={`transition-all duration-300 ease-in-out ${isExpanded ? "block" : "hidden"}`}
                    >
                      <div className="px-5 pb-5 pt-0 border-t border-gray-100">
                        <div className="grid md:grid-cols-2 gap-6 mt-5">
                          <div className="bg-gray-50 rounded-xl p-4">
                            <p className="text-sm font-medium text-gray-700 mb-3">
                              Plan Details
                            </p>
                            <div className="space-y-2">
                              <DetailRowSimple
                                label="Plan Name"
                                value={pendingPlan.name}
                              />
                              <DetailRowSimple
                                label="Duration"
                                value={`${pendingPlan.duration_value} ${pendingPlan.duration_unit}`}
                              />
                              <DetailRowSimple
                                label="Base Price"
                                value={formatAmount(pendingPlan.amount)}
                              />
                              <DetailRowSimple
                                label="Valid From"
                                value={formatDate(pendingPlan.start_date)}
                              />
                              <DetailRowSimple
                                label="Valid Until"
                                value={formatDate(pendingPlan.end_date)}
                              />
                              {pendingPlan.total_amount && (
                                <DetailRowSimple
                                  label="Total Amount"
                                  value={`₹${pendingPlan.total_amount}`}
                                  highlight
                                />
                              )}
                            </div>
                          </div>
                          <div className="bg-gray-50 rounded-xl p-4">
                            <p className="text-sm font-medium text-gray-700 mb-3">
                              Features
                            </p>
                            {pendingPlan.features ? (
                              <div
                                className="text-sm text-gray-600 space-y-1 [&_ul]:list-disc [&_ul]:pl-4 [&_li]:mb-1"
                                dangerouslySetInnerHTML={{
                                  __html: pendingPlan.features,
                                }}
                              />
                            ) : (
                              <p className="text-sm text-gray-400">
                                No features listed
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
                          <p className="text-sm text-blue-700 text-center flex items-center justify-center gap-1">
                            <Sparkles className="w-3 h-3" />
                            This plan will automatically activate on{" "}
                            {formatDate(pendingPlan.start_date)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Enhanced Components
function StatCard({ icon, title, value, subtitle, status, alert }: any) {
  return (
    <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 group">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 font-medium mb-1">{title}</p>
          <p
            className={`text-2xl font-semibold ${alert ? "text-[#c9060a]" : status ? "text-green-600" : "text-gray-800"}`}
          >
            {value}
          </p>
          {subtitle && <p className="text-sm text-gray-400 mt-1">{subtitle}</p>}
        </div>
        <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center group-hover:bg-gray-100 transition-colors">
          {icon}
        </div>
      </div>
    </div>
  );
}

function DetailRowSimple({ label, value, highlight }: any) {
  return (
    <div className="flex justify-between items-center py-1.5">
      <span className="text-gray-500 text-sm">{label}</span>
      <span
        className={`text-sm ${highlight ? "font-bold text-red-600" : "font-medium text-gray-800"}`}
      >
        {value}
      </span>
    </div>
  );
}
