"use client";

import { useParams, usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { toTitleCase } from "@/utils/toTitleCase";

import Banner from "@/components/common/Banner";
import RightSidebar from "@/components/common/RightSidebar";

import { getAuthors } from "@/lib/api/services/author";

interface ScreenLayoutProps {
  children: React.ReactNode;
}

interface AuthorData {
  name: string;
  image: string;
  designation: string;
  company_name: string;
  place: string;
  description: string;
  linkedin?: string;
}

export default function ScreenLayout({ children }: ScreenLayoutProps) {
  const [authorData, setAuthorData] = useState<AuthorData | undefined>(
    undefined,
  );

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

        if (!matched) {
          setAuthorData(undefined);
          return;
        }

        setAuthorData({
          name: matched.name,
          image: matched.image ?? matched.avatar ?? "",
          designation: matched.title ?? "",
          company_name: "",
          place: "",
          description:
            matched.description ?? matched.bio ?? matched.excerpt ?? "",
          linkedin: matched.linkedin,
        });
      } catch (error) {
        console.error("Failed to load author:", error);
        setAuthorData(undefined);
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
      {!(isArchive && hasSearch) && (
        <Banner title={pageTitle || "Lex Witness"} />
      )}

      <div className="max-w-6xl mx-auto px-4 py-2 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-9 space-y-6">{children}</div>

        <aside className={`lg:col-span-3 ${isArchive ? "lg:mt-12" : ""}`}>
          <RightSidebar showAuthor={isAuthorPage} authorData={authorData} />
        </aside>
      </div>
    </section>
  );
}
