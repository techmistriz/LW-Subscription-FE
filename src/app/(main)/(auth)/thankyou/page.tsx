"use client";

import { Suspense } from "react";
import PageLoader from "@/components/feedback/Loader/PageLoader";
import ThankYouContent from "./ThankYouContent";

export default function ThankYouPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[85vh] flex items-center justify-center">
          <PageLoader />
        </div>
      }
    >
      <ThankYouContent />
    </Suspense>
  );
}
