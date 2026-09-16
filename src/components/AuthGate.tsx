"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import RegisterModal from "./overlay/PopupModal/Popup";

const POPUP_COOKIE = "register_seen";

const AuthGate = () => {
  const pathname = usePathname();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (pathname !== "/") {
      return;
    }

    const hasSeen = document.cookie
      .split("; ")
      .some((cookie) => cookie.startsWith(`${POPUP_COOKIE}=`));

    if (!hasSeen) {
      const timer = window.setTimeout(() => {
        setShowModal(true);
      }, 0);

      return () => window.clearTimeout(timer);
    }
  }, [pathname]);

  const handleClose = () => {
    document.cookie = `${POPUP_COOKIE}=true; path=/; SameSite=Lax`;
    setShowModal(false);
  };

  if (pathname !== "/" || !showModal) {
    return null;
  }

  return (
    <>
      <div className="fixed inset-0 z-[9998] bg-black/40 backdrop-blur-sm" />

      <RegisterModal onClose={handleClose} />
    </>
  );
};

export default AuthGate;
