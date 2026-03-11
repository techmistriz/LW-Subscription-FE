"use client";

import { useParams, usePathname, useSearchParams } from "next/navigation";
import { toTitleCase } from "@/lib/utils/helper/toTitleCase";
import Banner from "@/components/Common/Banner";
import RightSidebar from "@/components/RightSidebar/RightSidebar";

export default function ScreenLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const isArchive = pathname.includes("/archive");
  const mode = searchParams.get("mode");
  const hasSearch = searchParams.has("search") || mode === "search";
  // Determine Title logic
  const slug = (params.category || params.author || params.slug) as string;
  let pageTitle = slug ? toTitleCase(slug.replace(/-/g, " ")) : "";

  if (!pageTitle && isArchive) {
    pageTitle = "Archive";
  }

  return (
    <section className="bg-white">
      {/* Hide banner if archive search */}
      {!(isArchive && hasSearch) && (
        <Banner title={pageTitle || "Lex Witness"} />
      )}

      <div className="max-w-6xl mx-auto px-4 py-2 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-9 space-y-6">{children}</div>

        {/* Sidebar */}
        <aside className={`lg:col-span-3 ${isArchive ? "lg:mt-12" : "mt-0"}`}>
          <RightSidebar />
        </aside>
      </div>
    </section>
  );
}
