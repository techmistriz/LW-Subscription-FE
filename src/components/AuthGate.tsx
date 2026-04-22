"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import RegisterModal from "../features/auth/RegisterModal";
import { useAppSelector } from "@/redux/store/hooks";

const AuthGate = () => {
  const pathname = usePathname();
  const { user, isInitialized } = useAppSelector((state) => state.auth);

  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!isInitialized) return;
    setShowModal(!user);
  }, [isInitialized, user]);

  const excludedRoutes = ["/sign-in", "/register", "/password-reset"];

  if (!isInitialized) return null;
  if (excludedRoutes.includes(pathname)) return null;
  if (user) return null;
  if (!showModal) return null;

  return (
    <>
      <div className="fixed inset-0 z-9998 bg-black/40 backdrop-blur-sm" />
      <RegisterModal onClose={() => setShowModal(false)} />
    </>
  );
};

export default AuthGate;