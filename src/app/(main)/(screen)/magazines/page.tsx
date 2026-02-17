import { Suspense } from "react";
import MagazinesClient from "../../../../features/magazines/MagazinesClient";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <MagazinesClient />
    </Suspense>
  );
}
