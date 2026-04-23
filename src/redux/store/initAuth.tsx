"use client";

import { useEffect } from "react";
import { useAppDispatch } from "./hooks";
import { loadUserFromStorage } from "./slices/authSlice";
import { loadSubscriptionFromStorage } from "./slices/subscriptionSlice";

export default function InitAuth({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(loadUserFromStorage());
    dispatch(loadSubscriptionFromStorage());
  }, [dispatch]);

  return <>{children}</>;
}
