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

/* ---------------- RESPONSE TYPE ---------------- */

export interface InvoiceResponse {
  status: boolean;
  data: Invoice[];
  meta: {
    paging: {
      current_page: number;
      per_page: number;
      total: number;
      last_page: number;
    };
  };
  message: string;
}

/* ---------------- GET INVOICES ---------------- */

export const getUserInvoices = async () => {
  return request<InvoiceResponse>(
    "GET",
    "/subscription/plan-history"
  );
};


/* ---------------- DIRECT DOWNLOAD PDF ---------------- */

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
    const blob = new Blob([response.data], {
      type: "application/pdf",
    });

    // Create temp URL
    const url = window.URL.createObjectURL(blob);

    // Create hidden anchor
    const link = document.createElement("a");

    link.href = url;

    // Dynamic filename
    link.download = `invoice-${subscriptionId}.pdf`;

    // Append to body
    document.body.appendChild(link);

    // Trigger download
    link.click();

    // Cleanup
    document.body.removeChild(link);

    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Invoice download failed:", error);

    throw error;
  }
};