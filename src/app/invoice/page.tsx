"use client";

import PageLoader from "@/components/feedback/Loader/PageLoader";
import InvoicePage from "@/features/invoice/components/Invoice";
import { getUserInvoices } from "@/services/invoice.service";
import type { Invoice } from "@/types/invoice";
import { useCallback, useEffect, useState } from "react";

async function fetchInvoices() {
  const res = await getUserInvoices();
  if (!res.status || !res.data?.status) throw new Error(res.message);
  return res.data.data;
}

export default function Page() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setInvoices(await fetchInvoices());
  }, []);

  useEffect(() => {
    let active = true;
    fetchInvoices()
      .then((data) => {
        if (active) setInvoices(data);
      })
      .catch(console.error)
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <PageLoader />
      </div>
    );
  }

  return <InvoicePage invoices={invoices} onRefresh={refresh} />;
}
