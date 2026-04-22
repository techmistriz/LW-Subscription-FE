"use client";

import { useState } from "react";
import { useAuth } from "@/features/authContext";
import { usePathname } from "next/navigation";
import RegisterModal from "../features/auth/RegisterModal";

const AuthGate = () => {
  const { user, loading } = useAuth();
  const pathname = usePathname();

  const [showModal, setShowModal] = useState(true);

  if (loading) return null;

  // routes where modal should NOT appear
  const excludedRoutes = ["/sign-in", "/register", "/password-reset"];
  if (excludedRoutes.includes(pathname)) return null;

  // if logged in → allow app
  if (user) return null;

  // if modal closed → don't show again
  if (!showModal) return null;

  return (
    <>
      <div className="fixed inset-0 z-[9998] bg-black/40 backdrop-blur-sm" />

      <RegisterModal onClose={() => setShowModal(false)} />
    </>
  );
};

export default AuthGate;