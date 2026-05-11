"use client";

import { useState } from "react";

import { usePathname } from "next/navigation";

import RegisterModal from "../features/auth/PopupModal/Popup";

import { useAppSelector } from "@/redux/store/hooks";

const AuthGate = () => {
  const pathname = usePathname();

  /* ---------------- AUTH ---------------- */
  const { user, isInitialized } =
    useAppSelector(
      (state) => state.auth
    );

  const [showModal, setShowModal] =
    useState(true);

  /* ---------------- WAIT FOR REDUX RESTORE ---------------- */
  if (!isInitialized) return null;

  /* ---------------- SHOW ONLY ON HOME PAGE ---------------- */
  if (pathname !== "/") return null;

  /* ---------------- EXCLUDED ROUTES ---------------- */
  const excludedRoutes = [
    "/sign-in",
    "/register",
    "/password-reset",
  ];

  if (
    excludedRoutes.includes(pathname)
  )
    return null;

  /* ---------------- LOGGED IN ---------------- */
  if (user) return null;

  /* ---------------- MANUALLY CLOSED ---------------- */
  if (!showModal) return null;

  return (
    <>
      <div className="fixed inset-0 z-9998 bg-black/40 backdrop-blur-sm" />

      <RegisterModal
        onClose={() =>
          setShowModal(false)
        }
      />
    </>
  );
};

export default AuthGate;