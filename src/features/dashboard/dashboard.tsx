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
  CalendarCheck,
} from "lucide-react";

import { getPlans } from "@/features/auth/services/plans";
import { useAppSelector, useAppDispatch } from "@/redux/store/hooks";
import {
  setSubscription,
  loadSubscriptionFromStorage,
} from "@/redux/store/slices/subscriptionSlice";
import {
  fetchProfile,
  loadUserFromStorage,
} from "@/redux/store/slices/authSlice";
import PageLoader from "@/components/Loader/PageLoader";
import {
  renewPlan,
  verifyRenewPayment,
} from "@/lib/api/subscription/subscription";
import { getActivationLabel } from "./helper";

declare global {
  interface Window {
    Razorpay: any;
  }
}

const getPendingActivationDate = (
  pendingSubscriptions: any[],
  activeSubscription: any,
  index: number,
) => {
  if (index === 0) {
    return activeSubscription?.end_date;
  }

  return pendingSubscriptions[index - 1]?.end_date;
};

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
  const [renewSuccess, setRenewSuccess] = useState(false);
  const [renewLoading, setRenewLoading] = useState(false);
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

  console.log("Current Plan End:", subscription?.end_date);

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
          setRenewLoading(true);

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
              await dispatch(fetchProfile()).unwrap();

              setRenewLoading(false);
              setRenewSuccess(true);
            } else {
              setRenewLoading(false);
            }
          } catch (error) {
            setRenewLoading(false);
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
                    Renew ({remainingDays} days left)
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
            <div className="space-y-4 ">
              {pendingSubscriptions.map((pendingPlan, index) => {
                const pendingActivationDate = new Date(pendingPlan.start_date);
                const daysUntilUpgrade = Math.ceil(
                  (pendingActivationDate.getTime() - new Date().getTime()) /
                    (1000 * 60 * 60 * 24),
                );
                const isExpanded = expandedUpgrades[pendingPlan.id] || false;
                console.log(pendingPlan);
                const DetailItem = ({ label, value, subValue }) => (
                  <div className="space-y-1">
                    <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                      {label}
                    </p>
                    <p className="text-sm font-bold text-gray-800">{value}</p>
                    {subValue && (
                      <p className="text-[10px] text-gray-500 font-medium">
                        {subValue}
                      </p>
                    )}
                  </div>
                );

                console.log("Pending Plan Start:", pendingPlan.start_date);

                const activationDate = getPendingActivationDate(
                  pendingSubscriptions,
                  subscription,
                  index,
                );

                return (
                  <div
                    key={pendingPlan.id}
                    className="group  bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
                  >
                    <button
                      onClick={() => toggleUpgradeExpand(pendingPlan.id)}
                      className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition text-left  cursor-pointer"
                    >
                      {/* LEFT SIDE */}
                      <div className="flex items-center gap-4">
                        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center group-hover:scale-105 transition">
                          <Calendar className="w-5 h-5 text-[#c9060a]" />
                        </div>

                        <div>
                          <p className="font-semibold text-gray-900">
                            Plan {index + 1}: {pendingPlan.name}
                          </p>

                          <p className="text-sm text-gray-500 mt-0.5">
                            {pendingPlan.duration_value}{" "}
                            {pendingPlan.duration_unit}
                          </p>
                        </div>
                      </div>

                      {/* RIGHT SIDE */}
                      <div className="flex items-center gap-3">
                        <span
                          className={`px-3 py-1 text-xs font-semibold rounded-full ${
                            daysUntilUpgrade > 0
                              ? "bg-amber-100 text-amber-700"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {getActivationLabel(activationDate)}
                        </span>

                        <ChevronDown
                          className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${
                            isExpanded ? "rotate-180" : ""
                          }`}
                        />
                      </div>
                    </button>

                    {/* EXPAND AREA */}
                    <div
                      className={`grid transition-all duration-500 ease-in-out ${
                        isExpanded
                          ? "grid-rows-[1fr] opacity-100"
                          : "grid-rows-[0fr] opacity-0"
                      }`}
                    >
                      <div className="overflow-hidden">
                        <div className="px-6 pb-6 pt-2">
                          <div className="flex flex-col md:flex-row overflow-hidden border border-gray-200 rounded-2xl bg-white shadow-sm">
                            {/* LEFT SIDEBAR: THE STATS */}
                            <div className="w-full md:w-1/3 bg-gray-50/80 p-6 border-b md:border-b-0 md:border-r border-gray-200">
                              <div className="space-y-6">
                                <div>
                                  <span className="inline-block px-2 py-1 rounded bg-blue-100 text-blue-700 text-[10px] font-bold uppercase tracking-widest mb-2">
                                    {pendingPlan.purchase_type}
                                  </span>
                                  <h3 className="text-xl font-black text-gray-900 leading-tight">
                                    {pendingPlan.name}
                                  </h3>
                                </div>

                                <div className="bg-gray-300 rounded-xl p-4 text-white shadow-lg shadow-gray-200">
                                  <p className="text-[#333] text-xs font-medium">
                                    Total Payable
                                  </p>
                                  <div className="flex items-baseline gap-1">
                                    <span className="text-2xl font-bold text-[#C9060a]">
                                      {pendingPlan.total_amount
                                        ? `₹${pendingPlan.total_amount}`
                                        : formatAmount(pendingPlan.amount)}
                                    </span>
                                    {pendingPlan.total_amount && (
                                      <span className="text-[#333] text-xs line-through">
                                        {formatAmount(pendingPlan.amount)}
                                      </span>
                                    )}
                                  </div>
                                </div>

                                <div className="space-y-3">
                                  <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-500">
                                      Duration
                                    </span>
                                    <span className="font-bold text-gray-800">
                                      {pendingPlan.duration_value}{" "}
                                      {pendingPlan.duration_unit}
                                    </span>
                                  </div>
                                  <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-500">
                                      Current Status
                                    </span>
                                    <span className="text-orange-600 font-bold uppercase text-[11px] px-2 py-0.5 bg-orange-50 rounded">
                                      {pendingPlan.status}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* RIGHT CONTENT: THE TIMELINE & FEATURES */}
                            <div className="w-full md:w-2/3 p-6 flex flex-col justify-between">
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8">
                                <div className="relative pl-6 border-l-2 border-blue-500">
                                  <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-blue-500 border-4 border-white" />
                                  <p className="text-xs font-bold text-gray-400 uppercase">
                                    Valid From
                                  </p>
                                  <p className="text-base font-semibold text-gray-800">
                                    {formatDate(pendingPlan.start_date)}
                                  </p>
                                </div>
                                <div className="relative pl-6 border-l-2 border-gray-200">
                                  <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-gray-200 border-4 border-white" />
                                  <p className="text-xs font-bold text-gray-400 uppercase">
                                    Valid Until
                                  </p>
                                  <p className="text-base font-semibold text-gray-800">
                                    {formatDate(pendingPlan.end_date)}
                                  </p>
                                </div>
                              </div>

                              {pendingPlan.features && (
                                <div className="mb-6">
                                  <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-4">
                                    Plan Benefits
                                  </p>
                                  <div
                                    className="text-sm text-gray-600 grid grid-cols-1 gap-2 
                [&_ul]:list-none [&_li]:flex [&_li]:items-center [&_li]:before:content-['✓'] [&_li]:before:mr-3 [&_li]:before:text-green-500 [&_li]:before:font-bold"
                                    dangerouslySetInnerHTML={{
                                      __html: pendingPlan.features,
                                    }}
                                  />
                                </div>
                              )}

                              {/* NOTICE FOOTER */}
                              <div className="mt-auto flex items-center gap-3 py-3 px-4 bg-amber-50 rounded-lg border border-amber-100">
                                <CalendarCheck className="w-5 h-5 text-amber-600" />
                                <p className="text-xs text-amber-800 leading-snug">
                                  This plan is currently{" "}
                                  <span className="font-bold underline">
                                    queued
                                  </span>
                                  . It will replace your active benefits
                                  starting{" "}
                                  <span className="font-bold">
                                    {formatDate(pendingPlan.start_date)}
                                  </span>
                                  .
                                </p>
                              </div>
                            </div>
                          </div>
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
      {renewLoading && (
        // <div className="fixed inset-0 z-[99999] bg-black/60 flex items-center justify-center">
        //   <div className="h-12 w-12 animate-spin rounded-full border-4 border-white border-t-transparent" />
        // </div>
        //         <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-md">
        //   <div className="w-[360px] rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 p-8 text-center shadow-2xl">

        //     <div className="mx-auto mb-5 w-14 h-14 border-4 border-white/20 border-t-white rounded-full animate-spin" />

        //     <h2 className="text-white text-lg font-semibold">
        //       Verifying Payment
        //     </h2>

        //     <p className="text-white/70 text-sm mt-2">
        //       Please wait while we confirm your transaction
        //     </p>

        //     <div className="mt-5 h-1 bg-white/10 rounded-full overflow-hidden">
        //       <div className="h-full w-1/3 bg-white animate-[slide_1.2s_linear_infinite]" />
        //     </div>

        //     <p className="text-white/50 text-xs mt-5">
        //       Secured by Razorpay
        //     </p>
        //   </div>
        // </div>

        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="w-[360px] rounded-3xl bg-white p-8 text-center shadow-2xl border border-gray-100">
            <div className="relative flex justify-center mb-6">
              <div className="absolute w-16 h-16 rounded-full bg-red-100 animate-ping" />

              <div className="relative w-16 h-16 rounded-full bg-red-50 flex items-center justify-center">
                <div className="w-8 h-8 border-[3px] border-red-200 border-t-[#c9060a] rounded-full animate-spin" />
              </div>
            </div>

            <h2 className="text-lg font-semibold text-gray-900">
              Verifying Payment
            </h2>

            <p className="text-sm text-gray-500 mt-2">
              Please wait while we confirm your transaction.
            </p>

            <div className="mt-5 h-1 w-full bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full w-1/3 bg-[#c9060a] animate-[slide_1.2s_linear_infinite]" />
            </div>

            <p className="text-xs text-gray-400 mt-5">Secured by Razorpay</p>
          </div>
        </div>
      )}
      {renewSuccess && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <svg
                className="h-8 w-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={3}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>

            <h2 className="text-lg font-semibold text-gray-900 text-center">
              Renewal Successful
            </h2>

            <p className="mt-2 text-sm text-gray-500 text-center">
              Your subscription has been renewed successfully and your plan
              validity has been updated.
            </p>

            <button
              onClick={() => setRenewSuccess(false)}
              className="mt-6 w-full rounded-lg bg-[#c9060a] px-4 py-2.5 text-sm font-medium text-white hover:bg-red-700 transition cursor-pointer"
            >
              Continue
            </button>
          </div>
        </div>
      )}
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
