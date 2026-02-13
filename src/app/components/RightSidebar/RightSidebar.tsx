"use client";

import { useEffect, useState } from "react";
import SubscribeForm from "../../(auth)/subscribe/sidebarForm";
import Advertisement from "../Advertisement/advertisement";
import LatestEditionSingle from "../LatestEdition/LatestEditionSingle";
import { getLatestSingleMagazines } from "@/lib/api/magazines";
import type { Magazine } from "@/lib/types.ts";
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
      <SubscribeForm />
      <Advertisement />
    </aside>
  );
}

export default RightSidebar;
