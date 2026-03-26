// "use client";

// import RegisterModal from "./register/RegisterModal";
// import { useAuth } from "@/features/authContext";

// const AuthGate = () => {
//   const { user, loading } = useAuth();



//   //  wait until auth is ready
//   if (loading) return null;

//   //  allow full app
//   if (user) return null;

//   //  block everything
//   return (
//     <>
//       <div className="fixed inset-0 z-[9998] bg-black/40 backdrop-blur-sm" />
//       <RegisterModal />
//     </>
//   );
// };

// export default AuthGate;



"use client";

// import { useEffect, useState } from "react";
// import RegisterModal from "./register/RegisterModal";
// import { usePathname } from "next/navigation";

// const AuthGate = () => {
//   const [isAllowed, setIsAllowed] = useState<boolean | null>(null);
//   const pathname = usePathname();

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     const user = localStorage.getItem("user");

//     const isLoggedIn = !!token || !!user;

//     // Exclude certain routes (sign-in, register, password-reset)
//     const excludedRoutes = ["/sign-in", "/password-reset",];
//     if (excludedRoutes.includes(pathname)) {
//       setIsAllowed(true); // allow these pages
//       return;
//     }

//     setIsAllowed(isLoggedIn);
//   }, [pathname]);

//   // prevent flicker
//   if (isAllowed === null) return null;

//   // allow full app
//   if (isAllowed) return null;

//   //  block everything
//   return (
//     <>
//       <div className="fixed inset-0 z-[9998] bg-black/40 backdrop-blur-sm" />
//       <RegisterModal
//         onClose={() => setIsAllowed(true)}
//       />
//     </>
//   );
// };

// export default AuthGate;




"use client";

import { useAuth } from "@/features/authContext";
import { usePathname } from "next/navigation";
import RegisterModal from "./register/RegisterModal";

const AuthGate = () => {
  const { user, loading } = useAuth();
  const pathname = usePathname();

  //wait until auth is ready
  if (loading) return null;

  //  exclude pages where modal shouldn't appear
  const excludedRoutes = ["/sign-in", "/register", "/password-reset"];
  if (excludedRoutes.includes(pathname)) return null;

  //  allow full app
  if (user) return null;

  // block everything
  return (
    <>
      <div className="fixed inset-0 z-[9998] bg-black/40 backdrop-blur-sm" />
     <RegisterModal onClose={() => {}} />
    </>
  );
};

export default AuthGate;