"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import PopupModal from "./Popup";

/*----------------- REDUX -----------------*/
import { useAppSelector } from "@/store/hooks";

const PopupWrapper = () => {
  const pathname = usePathname();
  const { user, loading } = useAppSelector((state) => state.auth);

  const [isClosed, setIsClosed] = useState(false);

  const seen =
    typeof window !== "undefined"
      ? sessionStorage.getItem("register_seen")
      : null;

  const shouldShow =
    !loading && !user && !seen && pathname !== "/sign-in" && !isClosed;

  useEffect(() => {
    if (!loading && !user && pathname !== "/sign-in" && !seen) {
      sessionStorage.setItem("register_seen", "true");
    }
  }, [loading, user, pathname, seen]);

  if (!shouldShow) return null;

  return <PopupModal onClose={() => setIsClosed(true)} />;
};

export default PopupWrapper;
