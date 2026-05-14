"use client";

import InvoicePage from "@/features/Invoice/Invoice";
import {
  getUserInvoices,
  Invoice,
} from "@/lib/api/invoice/invoice";

import { useEffect, useState } from "react";

export default function Page() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchInvoices = async () => {
    try {
      const res = await getUserInvoices();

      console.log("Invoice", res);

      if (res.data?.status) {
        setInvoices(res.data.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  fetchInvoices();
}, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading invoices...
      </div>
    );
  }

  return <InvoicePage invoices={invoices} />;
}