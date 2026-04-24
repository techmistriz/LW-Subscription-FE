"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import RegisterModal from "../features/auth/RegisterModal";
import { useAppSelector } from "@/redux/store/hooks";

const AuthGate = () => {
  const pathname = usePathname();

  /*----------------- USE isInitialized instead of loading -----------------*/
  const { user, isInitialized } = useAppSelector((state) => state.auth);

  const [showModal, setShowModal] = useState(true);

  /*----------------- Wait until Redux restores auth from sessionStorage -----------------*/
  if (!isInitialized) return null;

  /*----------------- Routes where modal should NOT appear -----------------*/
  const excludedRoutes = ["/sign-in", "/register", "/password-reset"];
  if (excludedRoutes.includes(pathname)) return null;

  /*----------------- If logged in → allow app -----------------*/
  if (user) return null;

  /*----------------- If modal manually closed → don't show again -----------------*/
  if (!showModal) return null;

  return (
    <>
      <div className="fixed inset-0 z-9998 bg-black/40 backdrop-blur-sm" />
      <RegisterModal onClose={() => setShowModal(false)} />
    </>
  );
};

export default AuthGate;
