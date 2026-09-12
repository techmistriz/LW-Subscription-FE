// "use client";

// import { useEffect } from "react";
// import { useSearchParams, useRouter } from "next/navigation";
// import { useAppDispatch, useAppSelector } from "@/store/hooks";
// import { toast } from "sonner";
// import Banner from "@/components/common/Banner";
// import { routes } from "@/config/routes";
// import {
//   verifyEmail,
//   clearEmailVerificationState,
// } from "@/store/slices/authSlice";

// export default function VerifyEmail() {
//   const searchParams = useSearchParams();
//   const router = useRouter();
//   const dispatch = useAppDispatch();

//   const token = searchParams.get("token");

//   const { emailVerificationLoading, emailVerificationSuccess, emailVerificationError } =
//     useAppSelector((state) => state.auth);

//   useEffect(() => {
//     if (!token) {
//       return;
//     }

//     dispatch(verifyEmail({ token }));

//     return () => {
//       dispatch(clearEmailVerificationState());
//     };
//   }, [token, dispatch]);

//   useEffect(() => {
//     if (emailVerificationSuccess) {
//       toast.success("Email verified successfully!");
//     }

//     if (emailVerificationError) {
//       toast.error(emailVerificationError);
//     }
//   }, [emailVerificationSuccess, emailVerificationError]);

//   const handleLogin = () => {
//     router.push(routes.login);
//   };

//   return (
//     <main>
//       <Banner title="Email Verification" />

//       <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
//         <div className="bg-white -mt-50 p-8 rounded-xl shadow-md w-full max-w-md">
//           <div className="text-center">
//             {/* Loading */}
//             {emailVerificationLoading && (
//               <>
//                 <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#c9060a]/10">
//                   <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#c9060a]/20 border-t-[#c9060a]" />
//                 </div>

//                 <h2 className="text-xl font-bold mb-3 text-gray-900">
//                   Verifying Your Email
//                 </h2>

//                 <p className="text-sm text-gray-500">
//                   Please wait while we verify your email address.
//                 </p>
//               </>
//             )}

//             {/* Success */}
//             {!emailVerificationLoading && emailVerificationSuccess && (
//               <>
//                 <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     className="h-8 w-8 text-green-600"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                     stroke="currentColor"
//                     strokeWidth={2}
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
//                     />
//                   </svg>
//                 </div>

//                 <h2 className="text-xl font-bold mb-3 text-gray-900">
//                   Email Verified Successfully
//                 </h2>

//                 <p className="text-sm text-gray-500 mb-6">
//                   Your email address has been verified successfully.
//                   You can now log in to your account.
//                 </p>

//                 <button
//                   type="button"
//                   onClick={handleLogin}
//                   className="w-full bg-[#c9060a] cursor-pointer text-white py-2.5 rounded transition hover:bg-[#a80508]"
//                 >
//                   Continue to Login
//                 </button>
//               </>
//             )}

//             {/* Error */}
//             {!emailVerificationLoading &&
//               !emailVerificationSuccess &&
//               emailVerificationError && (
//                 <>
//                   <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
//                     <svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       className="h-8 w-8 text-[#c9060a]"
//                       fill="none"
//                       viewBox="0 0 24 24"
//                       stroke="currentColor"
//                       strokeWidth={2}
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         d="M12 9v3.75m0 3.75h.008M10.29 3.86l-7.82 13.5A1.75 1.75 0 003.98 20h16.04a1.75 1.75 0 001.51-2.64l-7.82-13.5a1.75 1.75 0 00-3.02 0z"
//                       />
//                     </svg>
//                   </div>

//                   <h2 className="text-xl font-bold mb-3 text-gray-900">
//                     Verification Failed
//                   </h2>

//                   <p className="text-sm text-gray-500 mb-6">
//                     {emailVerificationError}
//                   </p>

//                   <button
//                     type="button"
//                     onClick={handleLogin}
//                     className="w-full bg-[#c9060a] cursor-pointer text-white py-2.5 rounded transition hover:bg-[#a80508]"
//                   >
//                     Go to Login
//                   </button>
//                 </>
//               )}

//             {/* No token */}
//             {!emailVerificationLoading &&
//               !emailVerificationSuccess &&
//               !emailVerificationError &&
//               !token && (
//                 <>
//                   <h2 className="text-xl font-bold mb-3 text-gray-900">
//                     Invalid Verification Link
//                   </h2>

//                   <p className="text-sm text-gray-500 mb-6">
//                     This email verification link is invalid or incomplete.
//                   </p>

//                   <button
//                     type="button"
//                     onClick={handleLogin}
//                     className="w-full bg-[#c9060a] cursor-pointer text-white py-2.5 rounded transition hover:bg-[#a80508]"
//                   >
//                     Go to Login
//                   </button>
//                 </>
//               )}
//           </div>
//         </div>
//       </div>
//     </main>
//   );
// }