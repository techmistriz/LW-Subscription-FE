"use client";

import { useSearchParams } from "next/navigation";
import MagazinesPage from "./MagazinesPage";

export default function MagazinesClient() {
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;

  return <MagazinesPage currentPage={currentPage} />;
}
