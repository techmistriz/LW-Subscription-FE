"use client";

import { useEffect, useState } from "react";
import SubscribeSidebar from "../Auth/SubscribeSidebar";
import SidebarAdvertisement from "../SidebarAdvertisment/SidebarAdvertisement";
import LatestEditionSingle from "../LatestEdition/LatestEditionSingle";
import { getLatestSingleMagazines } from "@/lib/api/services/magazines";
import type { Magazine } from "@/types";
function RightSidebar() {
  const [magazine, setMagazine] = useState<Magazine | null>(null);

  useEffect(() => {
    const loadLatest = async () => {
      const latest = await getLatestSingleMagazines();
      setMagazine(latest);
    };

    loadLatest();
  }, []);

  return (
    <aside className="lg:col-span-3 space-y-8">
      {magazine && <LatestEditionSingle magazine={magazine} />}
      <SubscribeSidebar />
      <SidebarAdvertisement />
    </aside>
  );
}

export default RightSidebar;
