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
  return request<InvoiceResponse>("GET", "/subscription/plan-history");
};

/* ---------------- DIRECT DOWNLOAD PDF ---------------- */

export const downloadInvoicePdf = async (subscriptionId: number) => {
  const response = await api.get(
    `/subscription/plan-invoice/${subscriptionId}`,
    {
      responseType: "blob",
      headers: {
        Accept: "application/pdf",
      },
    }
  );

  console.log("===== INVOICE RESPONSE =====");
  console.log("Status:", response.status);
  console.log("Status Text:", response.statusText);
  console.log("Headers:", response.headers);
  console.log("Content-Type:", response.headers["content-type"]);
  console.log("Blob Size:", response.data.size);
  console.log("Request Headers:", {
    Accept: "application/pdf",
  });

  // Read response if backend returned JSON
  if (response.headers["content-type"]?.includes("application/json")) {
    const text = await response.data.text();

    console.log("JSON Response:", text);

    try {
      console.log("Parsed JSON:", JSON.parse(text));
    } catch (e) {
      console.log("Failed to parse JSON");
    }

    return;
  }

  const blob = new Blob([response.data], {
    type: "application/pdf",
  });


  console.log("Request Headers:", {
  Accept: "application/pdf",
});
  console.log("PDF Blob:", blob);

  const url = window.URL.createObjectURL(blob);

  console.log("Blob URL:", url);

  const link = document.createElement("a");
  link.href = url;
  link.download = `invoice-${subscriptionId}.pdf`;

  document.body.appendChild(link);

  console.log("Starting download...");

  link.click();

  document.body.removeChild(link);

  window.URL.revokeObjectURL(url);

  console.log("Download complete");
};