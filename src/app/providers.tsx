"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { Provider } from "react-redux";
import { store } from "@/redux/store/store";

export default function ScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, [pathname]);

  return(
<Provider store={store}>

    <>{children}</>
</Provider>
  )
}
