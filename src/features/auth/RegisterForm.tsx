// "use client";

// import { useState, FormEvent, ChangeEvent, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { toast } from "sonner";

// import Banner from "../../components/Common/Banner";
// import { registerUser, sendOtp } from "@/lib/api/auth/auth";
// import { verifyPayment } from "./services/payment";
// import { getPlans } from "./services/plans";

// import { useAppDispatch, useAppSelector } from "@/redux/store/hooks";
// import { setUser } from "@/redux/store/slices/authSlice";
// import { setSubscription } from "@/redux/store/slices/subscriptionSlice";
// import SubscriptionSummarySkeleton from "@/components/Skeletons/SubscriptionSummary";
// import axiosInstance from "@/lib/api/axios";

// /* ------------------ Load Razorpay SDK ------------------ */
// const loadRazorpay = () =>
//   new Promise<boolean>((resolve) => {
//     if ((window as any).Razorpay) return resolve(true);

//     const script = document.createElement("script");
//     script.src = "https://checkout.razorpay.com/v1/checkout.js";
//     script.onload = () => resolve(true);
//     script.onerror = () => resolve(false);

//     document.body.appendChild(script);
//   });

// export default function RegisterForm() {
//   const router = useRouter();
//   const dispatch = useAppDispatch();

//   const { user, token } = useAppSelector((state) => state.auth);
//   const subscriptionData = useAppSelector((state) => state.subscription.data);

//   const [form, setForm] = useState({
//     first_name: "",
//     last_name: "",
//     email: "",
//     contact: "",
//     otp: "",
//     dob: "",
//     organisation: "",
//     address: "",
//     city: "",
//     pincode: "",
//     state: "",
//     country: "India",
//     password: "",
//     password_confirmation: "",
//     plan: "",
//     auto_renew: false,
//   });

//   const [plans, setPlans] = useState<any[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [plansLoading, setPlansLoading] = useState(true);
//   const [processingPayment, setProcessingPayment] = useState(false);
//   const [checkingAuth, setCheckingAuth] = useState(true);

//   const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string[] }>(
//     {},
//   );

//   const [isOtpSent, setIsOtpSent] = useState(false);
//   const [otpTimer, setOtpTimer] = useState(0);

//   /* ------------------ Preselect Plan ------------------ */
//   useEffect(() => {
//     if (!plans.length) return;

//     if (subscriptionData?.plan_id) {
//       setForm((prev) => ({
//         ...prev,
//         plan: String(subscriptionData.plan_id),
//       }));
//       return;
//     }

//     const stored = sessionStorage.getItem("subscription");
//     if (stored) {
//       try {
//         const parsed = JSON.parse(stored);
//         if (parsed?.plan_id) {
//           setForm((prev) => ({
//             ...prev,
//             plan: String(parsed.plan_id),
//           }));
//         }
//       } catch {
//         console.warn("Invalid subscription in sessionStorage");
//       }
//     }
//   }, [subscriptionData, plans]);

//   // Auth Redirect
//   useEffect(() => {
//     if (user && token) {
//       router.replace("/dashboard");
//     } else {
//       setCheckingAuth(false);
//     }
//   }, [user, token, router]);

//   /* ------------------ Fetch Plans ------------------ */
//   useEffect(() => {
//     const fetchPlans = async () => {
//       setPlansLoading(true);
//       try {
//         const data = await getPlans();
//         setPlans(data);
//       } catch {
//         toast.error("Failed to load plans");
//       } finally {
//         setPlansLoading(false);
//       }
//     };

//     fetchPlans();
//   }, []);

//   const handleChange = (
//     e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
//   ) => {
//     const { name, value, type } = e.target;

//     if (name === "contact") {
//       const digits = value.replace(/\D/g, "").slice(0, 10);
//       return setForm((prev) => ({ ...prev, contact: digits }));
//     }

//     setForm((prev) => ({
//       ...prev,
//       [name]:
//         type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
//     }));

//     if (fieldErrors[name]) {
//       setFieldErrors((prev) => ({ ...prev, [name]: [] }));
//     }
//   };

//   /* ------------------ OTP Handler ------------------ */
//   const handleSendOtp = async () => {
//     if (form.contact.length !== 10) {
//       return toast.error("Enter valid number");
//     }

//     try {
//       const res = await sendOtp(form.contact);

//       if (!res?.status) throw new Error(res?.message);

//       setIsOtpSent(true);
//       setOtpTimer(60);
//       toast.success("OTP sent");
      
//       const otp = res?.data?.otp || res?.otp;
//       if (otp && process.env.NODE_ENV === "development") {
//         console.log("OTP:", otp);
//         toast.success(`Demo OTP: ${otp}`);
//       }
//     } catch (err: any) {
//       toast.error(err.message);
//     }
//   };

//   useEffect(() => {
//     if (otpTimer <= 0) return;

//     const interval = setInterval(() => {
//       setOtpTimer((prev) => prev - 1);
//     }, 1000);

//     return () => clearInterval(interval);
//   }, [otpTimer]);

//   /* ------------------ Razorpay Payment Handler ------------------ */
//   const handleRazorpayPayment = async (payment: any, selectedPlan: any, registrationToken: string) => {
//     console.log("Starting Razorpay with payment:", payment);
    
//     const isLoaded = await loadRazorpay();
//     if (!isLoaded) throw new Error("Razorpay SDK failed to load");

//     const rzp = new (window as any).Razorpay({
//       key: payment.razorpay_key,
//       amount: payment.amount,
//       currency: payment.currency,
//       order_id: payment.order_id,
//       name: "Lexwitness",
//       description: selectedPlan.name,

//       handler: async (response: any) => {
//         setProcessingPayment(true);
//         console.log("Razorpay handler response:", response);

//         try {
//           // Make sure token is set in headers
//           axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${registrationToken}`;

//           const verifyPayload = {
//             purchase_type: "NEW",
//             membership_plan_id: Number(selectedPlan.id),
//             razorpay_payment_id: response.razorpay_payment_id,
//             razorpay_order_id: response.razorpay_order_id,
//             razorpay_signature: response.razorpay_signature,
//           };

//           console.log("Verify payload:", verifyPayload);

//           const verifyRes = await verifyPayment(verifyPayload);
          
//           console.log("Verify response:", verifyRes);

//           if (!verifyRes?.status) {
//             throw new Error(verifyRes?.message || "Verification failed");
//           }

//           // Get user data from verification response
//           const verifiedUser = verifyRes.data?.user;
//           const newToken = verifyRes.data?.token || registrationToken;
          
//           if (verifiedUser) {
//             dispatch(setUser({ user: verifiedUser, token: newToken }));
            
//             if (verifiedUser.active_subscription) {
//               dispatch(setSubscription(verifiedUser.active_subscription));
//             }
//           }

//           toast.success("Payment successful! Registration completed.");
//           router.replace("/thankyou");
          
//         } catch (err: any) {
//           console.error("Payment verification error:", err);
//           toast.error(err.message || "Payment verification failed");
//         } finally {
//           setProcessingPayment(false);
//         }
//       },

//       prefill: {
//         name: `${form.first_name} ${form.last_name}`,
//         email: form.email,
//         contact: form.contact,
//       },

//       theme: { color: "#c9060a" },
      
//       modal: {
//         ondismiss: () => {
//           console.log("Payment modal closed");
//           toast.info("Payment cancelled");
//           setProcessingPayment(false);
//         }
//       }
//     });

//     rzp.open();
//   };

// /* ------------------ Cancel Pending Payment ------------------ */
// const cancelPendingPayment = async (email?: string, contact?: string) => {
//   try {
//     // Try to cancel any pending payment for this user
//     const response = await axiosInstance.post("/payment/cancel-pending", {
//       email: email || form.email,
//       contact: contact || form.contact
//     });
//     return response.data;
//   } catch (error: any) {
//     console.log("No pending payment found or cancel failed:", error.response?.data);
//     return null;
//   }
// };

// /* ------------------ Form Submit ------------------ */
// const handleSubmit = async (e: FormEvent) => {
//   e.preventDefault();

//   setLoading(true);
//   setFieldErrors({});

//   try {
//     const selectedPlan = plans.find((p) => String(p.id) === form.plan);

//     if (!selectedPlan) {
//       throw new Error("Please select a plan");
//     }

//     // Format date for API
//     let formattedDob = "";
//     if (form.dob) {
//       const [year, month, day] = form.dob.split("-");
//       formattedDob = `${day}-${month}-${year}`;
//     }

//     let res;
//     try {
//       res = await registerUser({
//         ...form,
//         otp: form.otp,
//         dob: formattedDob,
//         membership_plan_id: selectedPlan.id,
//       });
//     } catch (error: any) {
//       // Check if error is about pending payment
//       if (error.message === "Pending payment already exists" || 
//           error.response?.data?.message === "Pending payment already exists") {
        
//         console.log("Pending payment detected, attempting to cancel...");
        
//         // Show toast message to user
//         toast.info("Cleaning up previous payment session...");
        
//         // Cancel pending payment
//         await cancelPendingPayment(form.email, form.contact);
        
//         // Wait a moment for backend to process
//         await new Promise(resolve => setTimeout(resolve, 1000));
        
//         // Retry registration
//         res = await registerUser({
//           ...form,
//           otp: form.otp,
//           dob: formattedDob,
//           membership_plan_id: selectedPlan.id,
//         });
//       } else {
//         throw error;
//       }
//     }

//     console.log("Registration response:", res);

//     if (!res?.status) {
//       if (res?.errors) setFieldErrors(res.errors);
//       throw new Error(res?.message || "Registration failed");
//     }

//     const { token, user: userData, payment } = res.data;

//     // Set token in axios headers
//     axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;

//     dispatch(setUser({ user: userData, token }));

//     /* ---------- FREE PLAN ---------- */
//     if (!payment?.amount || payment.amount <= 0) {
//       if (userData?.active_subscription) {
//         dispatch(setSubscription(userData.active_subscription));
//       }
//       toast.success("Registration Successful");
//       router.replace("/thankyou");
//       return;
//     }

//     /* ---------- PAID PLAN ---------- */
//     await handleRazorpayPayment(payment, selectedPlan, token);
    
//   } catch (err: any) {
//     console.error("Submit error:", err);
//     toast.error(err.message || "Registration failed");
//   } finally {
//     setLoading(false);
//   }
// };

//   const getError = (name: string) => fieldErrors[name]?.[0];

//   if (checkingAuth || processingPayment) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-white">
//         <div className="text-center">
//           <div className="w-10 h-10 border-4 border-[#c9060a] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
//           <p className="text-sm font-medium text-gray-600 tracking-widest uppercase">
//             {processingPayment ? "Processing Payment..." : "Authenticating..."}
//           </p>
//         </div>
//       </div>
//     );
//   }

//   const selectedPlan = plans.find((p) => String(p.id) === form.plan);
//   const price = Number(selectedPlan?.price || 0);
//   const gst = price * 0.18;
//   const total = price + gst;
//   const selectedPlanObj = plans.find((p) => String(p.id) === form.plan);
//   const otherPlans = plans.filter((p) => String(p.id) !== form.plan);

//   return (
//     <main className="bg-gray-50">
//       <Banner title={"Subscribe"} />

//       <section className="py-16 px-4 max-w-6xl m-auto">
//         <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10">
//           {/* LEFT: FORM SECTION */}
//           <div className="lg:col-span-7 bg-white p-8 border border-gray-200 shadow-sm rounded-xl">
//             <h2 className="text-xl font-bold mb-6 text-gray-800 uppercase tracking-tight border-b pb-4">
//               Personal Details
//             </h2>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <Input
//                 label="First Name *"
//                 name="first_name"
//                 value={form.first_name}
//                 onChange={handleChange}
//                 error={getError("first_name")}
//               />
//               <Input
//                 label="Last Name *"
//                 name="last_name"
//                 value={form.last_name}
//                 onChange={handleChange}
//                 error={getError("last_name")}
//               />
//               <Input
//                 label="Email *"
//                 type="email"
//                 name="email"
//                 value={form.email}
//                 onChange={handleChange}
//                 error={getError("email")}
//               />

//               <div className="space-y-1">
//                 <label className="text-[11px] font-bold text-gray-500 uppercase">
//                   Contact Us *
//                 </label>

//                 <div className="flex gap-2">
//                   <input
//                     name={isOtpSent ? "otp" : "contact"}
//                     value={isOtpSent ? form.otp : form.contact}
//                     onChange={handleChange}
//                     placeholder={isOtpSent ? "Enter OTP" : "10 digit mobile"}
//                     className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-[#c9060a] outline-none bg-gray-50"
//                   />

//                   <button
//                     type="button"
//                     onClick={handleSendOtp}
//                     disabled={otpTimer > 0}
//                     className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase whitespace-nowrap transition-all ${
//                       otpTimer > 0
//                         ? "bg-gray-300 cursor-not-allowed text-gray-600"
//                         : "bg-[#c9060a] text-white cursor-pointer"
//                     }`}
//                   >
//                     {otpTimer > 0
//                       ? `Resend ${otpTimer}s`
//                       : isOtpSent
//                       ? "Resend"
//                       : "Get OTP"}
//                   </button>
//                 </div>

//                 {isOtpSent && (
//                   <p className="text-[10px] text-gray-500 font-medium mt-1">
//                     OTP sent to{" "}
//                     <span className="text-[#c9060a] font-bold">
//                       +91 {form.contact}
//                     </span>
//                   </p>
//                 )}

//                 {getError("contact") && (
//                   <p className="text-red-500 text-[10px] uppercase font-bold">
//                     {getError("contact")}
//                   </p>
//                 )}
//               </div>

//               <Input
//                 label="Date of Birth *"
//                 type="date"
//                 name="dob"
//                 value={form.dob}
//                 onChange={handleChange}
//                 error={getError("dob")}
//               />
//               <Input
//                 label="Organisation Name"
//                 name="organisation"
//                 value={form.organisation}
//                 onChange={handleChange}
//               />

//               <div className="md:col-span-2">
//                 <Input
//                   label="Address *"
//                   name="address"
//                   value={form.address}
//                   onChange={handleChange}
//                   error={getError("address")}
//                 />
//               </div>

//               <Input
//                 label="City *"
//                 name="city"
//                 value={form.city}
//                 onChange={handleChange}
//                 error={getError("city")}
//               />
//               <Input
//                 label="Pincode *"
//                 name="pincode"
//                 value={form.pincode}
//                 onChange={handleChange}
//                 error={getError("pincode")}
//               />
//               <Input
//                 label="State *"
//                 name="state"
//                 value={form.state}
//                 onChange={handleChange}
//                 error={getError("state")}
//               />
//               <Input
//                 label="Country *"
//                 name="country"
//                 value={form.country}
//                 onChange={handleChange}
//                 error={getError("country")}
//               />

//               <Input
//                 label="Password *"
//                 type="password"
//                 name="password"
//                 onChange={handleChange}
//                 error={getError("password")}
//               />
//               <Input
//                 label="Confirm Password *"
//                 type="password"
//                 name="password_confirmation"
//                 onChange={handleChange}
//                 error={getError("password_confirmation")}
//               />
//             </div>
//           </div>

//           {/* RIGHT: PLAN SELECTION */}
//           <div className="lg:col-span-5">
//             {plansLoading ? (
//               <SubscriptionSummarySkeleton />
//             ) : (
//               <div className="bg-white p-8 border border-gray-200 shadow-sm rounded-xl sticky top-10 space-y-6">
//                 <h2 className="text-xl font-bold text-gray-800 uppercase tracking-tight border-b pb-4">
//                   Subscription Summary
//                 </h2>

//                 <div className="space-y-4 max-h-105 overflow-y-auto pr-2 custom-scrollbar">
//                   {selectedPlanObj && (
//                     <div>
//                       <h3 className="text-[11px] font-bold uppercase text-[#c9060a] mb-2 tracking-wider">
//                         Your Plan
//                       </h3>
//                       <div className="p-4 rounded-xl border-2 border-[#c9060a] bg-red-50 shadow-md">
//                         <div className="flex justify-between items-center">
//                           <span className="font-bold text-sm uppercase">
//                             {selectedPlanObj.name}
//                           </span>
//                           <span className="text-sm font-bold text-[#c9060a]">
//                             {Number(selectedPlanObj.price) === 0
//                               ? "0.00"
//                               : `₹${selectedPlanObj.price}`}
//                           </span>
//                         </div>
//                       </div>
//                     </div>
//                   )}

//                   {otherPlans.length > 0 && (
//                     <div>
//                       <h3 className="text-[11px] font-bold uppercase text-gray-400 mb-2 tracking-wider">
//                         Other Plans
//                       </h3>
//                       <div className="space-y-3">
//                         {otherPlans.map((plan) => (
//                           <div
//                             key={plan.id}
//                             onClick={() =>
//                               setForm((prev) => ({
//                                 ...prev,
//                                 plan: String(plan.id),
//                               }))
//                             }
//                             className="cursor-pointer p-4 rounded-xl border-2 border-gray-100 hover:border-gray-200 transition-all"
//                           >
//                             <div className="flex justify-between items-center">
//                               <span className="font-bold text-sm uppercase">
//                                 {plan.name}
//                               </span>
//                               <span className="text-sm font-bold text-[#333]">
//                                 ₹{plan.price}
//                               </span>
//                             </div>
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   )}
//                 </div>

//                 {form.plan && (
//                   <div className="bg-gray-50 p-5 rounded-xl space-y-3 border border-gray-100">
//                     <div className="flex justify-between text-sm">
//                       <span className="text-gray-500 font-medium">
//                         Base Price
//                       </span>
//                       <span className="font-bold">₹{price}</span>
//                     </div>

//                     {price > 0 && (
//                       <div className="flex justify-between text-sm">
//                         <span className="text-gray-500 font-medium">
//                           GST (18%)
//                         </span>
//                         <span className="font-bold text-red-600">
//                           + ₹{gst.toFixed(2)}
//                         </span>
//                       </div>
//                     )}

//                     <div className="pt-3 border-t border-gray-200 flex justify-between items-center">
//                       <span className="text-xs font-bold uppercase text-gray-800">
//                         Total Payable
//                       </span>
//                       <span className="text-xl font-bold text-[#c9060a]">
//                         ₹{price === 0 ? total : total.toFixed(2)}
//                       </span>
//                     </div>
//                   </div>
//                 )}

//                 <form onSubmit={handleSubmit} className="pt-2">
//                   <button
//                     type="submit"
//                     disabled={loading || !form.plan || !form.otp}
//                     className="w-full bg-[#c9060a] text-white py-3 cursor-pointer font-bold uppercase tracking-widest hover:bg-[#333] transition-all disabled:opacity-50 shadow-lg shadow-red-100"
//                   >
//                     {loading
//                       ? "Processing..."
//                       : Number(selectedPlan?.price) === 0
//                       ? "Subscribe Now"
//                       : "Pay Now"}
//                   </button>

//                   <p className="text-center text-[10px] text-gray-400 mt-3 italic font-bold uppercase tracking-tighter">
//                     Please verify your contact number to proceed
//                   </p>
//                 </form>
//               </div>
//             )}
//           </div>
//         </div>
//       </section>
//     </main>
//   );
// }

// function Input({ label, error, type = "text", ...props }: any) {
//   return (
//     <div className="space-y-1">
//       <label className="text-[11px] font-bold text-gray-500 uppercase ml-1">
//         {label.replace(" *", "")}
//         {label.includes("*") && <span className="text-[#c9060a] ml-1">*</span>}
//       </label>
//       <input
//         type={type}
//         {...props}
//         className={`w-full border ${error ? "border-red-500" : "border-gray-200"} bg-gray-50 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-[#c9060a] outline-none transition-all`}
//       />
//       {error && (
//         <p className="text-red-500 text-[10px] font-bold mt-1 uppercase">
//           {error}
//         </p>
//       )}
//     </div>
//   );
// }