import MagazineDetailPage from "@/features/magazines/MagazineDetailPage";
import React from "react";

type Props = {
  params: Promise<{ slug: string }>;
};

export default function Page({ params }: Props) {
  return <MagazineDetailPage params={params} />;
}
