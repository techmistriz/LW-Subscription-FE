import api from "@/network/axios";
import { request } from "@/network/request";
import type { Invoice } from "@/types/invoice";

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

export const getUserInvoices = async () => {
  return request<InvoiceResponse>("GET", "/subscription/plan-history");
};

export const downloadInvoicePdf = async (subscriptionId: number) => {
  const response = await api.get(
    `/subscription/plan-invoice/${subscriptionId}`,
    {
      responseType: "blob",
      headers: { Accept: "application/pdf" },
    },
  );

  if (response.headers["content-type"]?.includes("application/json")) {
    const text = await response.data.text();
    throw new Error(JSON.parse(text)?.message || "Invoice not available");
  }

  const blob = new Blob([response.data], { type: "application/pdf" });
  const url = window.URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `invoice-${subscriptionId}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};
