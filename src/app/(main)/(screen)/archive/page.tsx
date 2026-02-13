import { Suspense } from "react";
import ArchiveClient from "./ArchiveClient";

export default function ArchivePage() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Loading archive...</div>}>
      <ArchiveClient />
    </Suspense>
  );
}
