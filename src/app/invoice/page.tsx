"use client";

import PageLoader from "@/components/feedback/Loader/PageLoader";
import InvoicePage from "@/features/invoice/components/Invoice";
import { getUserInvoices } from "@/services/invoice.service";
import type { Invoice } from "@/types/invoice";
import { useEffect, useState } from "react";

export default function Page() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const res = await getUserInvoices();

        // console.log("Invoice", res);

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
      <div className="flex min-h-screen items-center justify-center">
        <PageLoader />
      </div>
    );
  }

  return <InvoicePage invoices={invoices} />;
}
