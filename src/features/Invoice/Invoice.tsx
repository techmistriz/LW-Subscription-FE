"use client";

import React, { useState } from "react";
import {
  CalendarDays,
  CreditCard,
  Download,
  FileText,
  Receipt,
} from "lucide-react";

import { downloadInvoicePdf } from "@/lib/api/invoice/invoice";

type Plan = {
  id: number;
  name: string;
  price: string;
  duration_unit: string;
  duration_value: number;
  print_editions: number;
};

type Transaction = {
  id: number;
  subscription_id: number;
  order_number: string;
  transaction_id: string;
  payment_amount: string;
  payment_status: string;
  transaction_date: string;
} | null;

type Invoice = {
  id: number;
  user_id: number;
  membership_plan_id: number;
  start_date: string;
  end_date: string;
  total_amount: string;
  subtotal_amount: string;
  tax_amount: string;
  tax_percent: number;
  status: string;
  purchase_type: string;
  previous_subscription_id: number | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  plan: Plan;
  transaction: Transaction;
};

interface Props {
  invoices: Invoice[];
}

export default function InvoicePage({ invoices }: Props) {
  const [downloadingId, setDownloadingId] = useState<number | null>(null);

  const downloadInvoice = async (invoice: Invoice) => {
    try {
      setDownloadingId(invoice.id);

      await downloadInvoicePdf(invoice.id);
    } catch (error) {
      console.error(error);
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7] py-10 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-10">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
              Invoice History
            </h1>

            <p className="text-gray-500 mt-2 text-sm lg:text-base">
              Manage your subscriptions and download payment invoices.
            </p>
          </div>

         <div className="bg-white border border-gray-200 rounded-2xl px-5 py-4 shadow-sm flex items-center gap-6 min-w-[180px]">
  <div>
    <p className="text-sm text-gray-500">
      Total Invoices
    </p>

  </div>
    <h2 className="text-2xl font-bold text-gray-900 ">
      {invoices.length}
    </h2>

 
</div>
        </div>

        {/* Invoice Cards */}
        {/* Invoice Cards */}
        <div className="space-y-4">
          {invoices.map((invoice) => (
            <div
              key={invoice.id}
              className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className="p-5">
                {/* Top Section */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
                  {/* Left */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#c9060a]/10 flex items-center justify-center shrink-0">
                      <Receipt className="w-6 h-6 text-[#c9060a]" />
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-lg font-semibold text-gray-900">
                          {invoice.plan.name}
                        </h2>

                        <span
                          className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                            invoice.status === "ACTIVE"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {invoice.status}
                        </span>
                      </div>

                      <p className="text-sm text-gray-500 mt-1">
                        Invoice #{invoice.id}
                      </p>

                      <div className="flex flex-wrap items-center gap-4 mt-3 text-sm">
                        <div className="flex items-center gap-1 text-gray-600">
                          <CalendarDays className="w-4 h-4" />

                          {invoice.start_date}
                        </div>

                        <div className="text-gray-400">—</div>

                        <div className="text-gray-600">{invoice.end_date}</div>
                      </div>
                    </div>
                  </div>

                  {/* Right */}
                  <div className="flex flex-col lg:items-end gap-3">
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">
                        Total Paid
                      </p>

                      <h3 className="text-2xl font-bold text-[#c9060a]">
                        ₹{invoice.total_amount}
                      </h3>
                    </div>

                    <button
                      onClick={() => downloadInvoice(invoice)}
                      disabled={downloadingId === invoice.id}
                      className="inline-flex items-center justify-center gap-2 bg-[#c9060a] hover:bg-[#ab0509] disabled:opacity-60 disabled:cursor-not-allowed text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
                    >
                      <Download className="w-4 h-4" />

                      {downloadingId === invoice.id
                        ? "Downloading..."
                        : "Download"}
                    </button>
                  </div>
                </div>

                {/* Bottom Compact Details */}
                <div className="mt-5 pt-5 border-t border-gray-100 grid grid-cols-2 lg:grid-cols-5 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500 text-xs mb-1">Purchase</p>

                    <p className="font-medium text-gray-900">
                      {invoice.purchase_type}
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-500 text-xs mb-1">Duration</p>

                    <p className="font-medium text-gray-900">
                      {invoice.plan.duration_value} {invoice.plan.duration_unit}
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-500 text-xs mb-1">Subtotal</p>

                    <p className="font-medium text-gray-900">
                      ₹{invoice.subtotal_amount}
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-500 text-xs mb-1">GST</p>

                    <p className="font-medium text-gray-900">
                      ₹{invoice.tax_amount}
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-500 text-xs mb-1">Payment</p>

                    <p className="font-medium text-green-600">
                      {invoice.transaction?.payment_status || "N/A"}
                    </p>
                  </div>
                </div>

                {/* Transaction IDs */}
                {invoice.transaction && (
                  <div className="mt-4 flex flex-col lg:flex-row lg:items-center gap-3 text-xs text-gray-500">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-700">Order:</span>

                      <span className="break-all">
                        {invoice.transaction.order_number}
                      </span>
                    </div>

                    <div className="hidden lg:block text-gray-300">•</div>

                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-700">TXN:</span>

                      <span className="break-all">
                        {invoice.transaction.transaction_id}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Empty */}
        {invoices.length === 0 && (
          <div className="bg-white border border-gray-200 rounded-3xl py-20 px-6 text-center shadow-sm">
            <div className="w-20 h-20 mx-auto rounded-full bg-gray-100 flex items-center justify-center">
              <Receipt className="w-10 h-10 text-gray-400" />
            </div>

            <h2 className="text-2xl font-semibold text-gray-900 mt-6">
              No invoices found
            </h2>

            <p className="text-gray-500 mt-2">
              Your billing invoices will appear here once payments are made.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
