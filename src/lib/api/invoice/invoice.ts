// lib/api/services/invoices.ts

import api from "../axios";
import { request } from "../request";

/* ---------------- TYPES ---------------- */

export interface Plan {
  id: number;
  name: string;
  price: string;
  duration_unit: string;
  duration_value: number;
  print_editions: number;
}

export interface Transaction {
  id: number;
  subscription_id: number;
  order_number: string;
  transaction_id: string;
  payment_amount: string;
  payment_status: string;
  transaction_date: string;
}

export interface Invoice {
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
  transaction: Transaction | null;
}

/* ---------------- GET INVOICES ---------------- */

export const getUserInvoices = async () => {
  return request<Invoice[]>(
    "GET",
    "/subscription/plan-history"
  );
};

/* ---------------- OPEN PDF PREVIEW ---------------- */

export const downloadInvoicePdf = async (
  subscriptionId: number
) => {
  try {
    const response = await api.get(
      `/subscription/plan-invoice/${subscriptionId}`,
      {
        responseType: "blob",
      }
    );

    // Create PDF blob
    const file = new Blob([response.data], {
      type: "application/pdf",
    });

    // Create temporary URL
    const fileURL = window.URL.createObjectURL(file);

    // Open browser PDF viewer
    window.open(fileURL, "_blank");

    // Cleanup memory later
    setTimeout(() => {
      window.URL.revokeObjectURL(fileURL);
    }, 1000);
  } catch (error) {
    console.error("Invoice preview failed:", error);
    throw error;
  }
};