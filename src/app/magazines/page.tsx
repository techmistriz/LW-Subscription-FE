import { Suspense } from "react";
import MagazinesClient from "./MagazinesClient";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <MagazinesClient />
    </Suspense>
  );
}
