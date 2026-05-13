"use client";

import { useParams, usePathname, useSearchParams } from "next/navigation";

import { useEffect, useState } from "react";

import { toTitleCase } from "@/lib/utils/helper/toTitleCase";

import Banner from "@/components/Common/Banner";
import RightSidebar from "@/components/RightSidebar/RightSidebar";

import { getAuthors } from "@/lib/api/services/author";

interface ScreenLayoutProps {
  children: React.ReactNode;
}

export default function ScreenLayout({ children }: ScreenLayoutProps) {
  const [authorData, setAuthorData] = useState<any>(null);

  const params = useParams();

  const pathname = usePathname();

  const searchParams = useSearchParams();

  const isArchive = pathname.includes("/archive");

  const isAuthorPage = pathname.startsWith("/author");

  const mode = searchParams.get("mode");

  const hasSearch = searchParams.has("search") || mode === "search";

  /* ---------------- Load Author ---------------- */
  useEffect(() => {
    const loadAuthor = async () => {
      if (!isAuthorPage || !params.author) return;

      try {
        const authors = await getAuthors();

        const matched = authors.find((a) => a.slug === params.author);
        console.log(authors);
        setAuthorData(matched ?? null);
      } catch (error) {
        console.error("Failed to load author:", error);
      }
    };

    loadAuthor();
  }, [isAuthorPage, params.author]);

  /* ---------------- Title ---------------- */
  const slug = (params.category || params.author || params.slug) as string;

  let pageTitle = slug ? toTitleCase(slug.replace(/-/g, " ")) : "";

  if (!pageTitle && isArchive) {
    pageTitle = "Archive";
  }

  return (
    <section className="bg-white">
      {/* Banner */}
      {!(isArchive && hasSearch) && (
        <Banner title={pageTitle || "Lex Witness"} />
      )}

      <div className="max-w-6xl mx-auto px-4 py-2 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main */}
        <div className="lg:col-span-9 space-y-6">{children}</div>

        {/* Sidebar */}
        {/* Sidebar */}
        <aside className={`lg:col-span-3 ${isArchive ? "lg:mt-12" : ""}`}>
          <RightSidebar showAuthor={isAuthorPage} authorData={authorData} />
        </aside>
      </div>
    </section>
  );
}
