"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import RegisterModal from "./RegisterModal";

const RegisterPopupWrapper = () => {
  const pathname = usePathname();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const seen = sessionStorage.getItem("register_seen");

    if (!seen && pathname !== "/sign-in") {
      setShowModal(true);
      sessionStorage.setItem("register_seen", "true");
    }
  }, [pathname]);

  if (!showModal) return null;

  return <RegisterModal onClose={() => setShowModal(false)} />;
};

export default RegisterPopupWrapper;