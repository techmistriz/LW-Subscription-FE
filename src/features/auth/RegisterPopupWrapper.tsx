"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import RegisterModal from "../../features/auth/RegisterModal";

// ✅ REDUX
import { useAppSelector } from "@/redux/store/hooks";

const RegisterPopupWrapper = () => {
  const pathname = usePathname();
  const { user, loading } = useAppSelector((state) => state.auth);

  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (loading) return; // wait for auth to load

    const seen = sessionStorage.getItem("register_seen");

    // ✅ ONLY SHOW IF NOT LOGGED IN
    if (!user && !seen && pathname !== "/sign-in") {
      setShowModal(true);
      sessionStorage.setItem("register_seen", "true");
    }
  }, [pathname, user, loading]);

  if (!showModal) return null;

  return <RegisterModal onClose={() => setShowModal(false)} />;
};

export default RegisterPopupWrapper;