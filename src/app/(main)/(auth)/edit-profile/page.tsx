"use client";

import { useAppSelector } from "@/redux/store/hooks";
import EditProfileForm from "./components/EditProfileForm";

export default function EditProfilePage() {
  const user = useAppSelector((state) => state.auth.user);

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-gray-500">
          Loading profile...
        </p>
      </div>
    );
  }

  return <EditProfileForm user={user} />;
}
