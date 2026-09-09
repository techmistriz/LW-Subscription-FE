"use client";

import { useEffect, useState } from "react";

import SubscribeSidebar from "@/features/auth/components/SubscribeSidebar";
import SidebarAdvertisement from "../advertisement/SidebarAdvertisement";
import LatestEditionSingle from "../../features/home/components/LatestEditionSingle";
import Author from "@/features/authors/components/Author";

import { getLatestSingleMagazines } from "@/lib/api/services/magazines";

import type { Magazine } from "@/types";

interface AuthorData {
  name: string;
  image: string;
  designation: string;
  company_name: string;
  place: string;
  description: string;
  linkedin?: string;
}

interface RightSidebarProps {
  showAuthor?: boolean;
  authorData?: AuthorData;
}

function RightSidebar({ showAuthor = false, authorData }: RightSidebarProps) {
  const [magazine, setMagazine] = useState<Magazine | null>(null);

  useEffect(() => {
    const loadLatest = async () => {
      const latest = await getLatestSingleMagazines();
      setMagazine(latest);
    };

    loadLatest();
  }, []);

  return (
    <aside className="space-y-8">
      {showAuthor && authorData && <Author data={authorData} />}

      {magazine && (
        <LatestEditionSingle
          magazine={magazine}
          showTitle={false}
          showUnderline={false}
        />
      )}

      <SubscribeSidebar />

      <SidebarAdvertisement />
    </aside>
  );
}

export default RightSidebar;
