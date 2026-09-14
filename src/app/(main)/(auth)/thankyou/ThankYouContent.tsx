"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PageLoader from "@/components/feedback/Loader/PageLoader";
import { routes } from "@/config/routes";

interface RegistrationSuccess {
  email: string;
  first_name?: string;
  last_name?: string;
  planName?: string;
}

export default function ThankYouContent() {
  const router = useRouter();

  const [registration, setRegistration] = useState<RegistrationSuccess | null>(
    null,
  );

  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });

    try {
      const storedData = sessionStorage.getItem("registration_success");

      if (storedData) {
        const parsedData = JSON.parse(storedData) as RegistrationSuccess;

        setRegistration(parsedData);
      }
    } catch (error) {
      console.error("[ThankYou] Failed to read registration data:", error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  if (!isLoaded) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center">
        <PageLoader />
      </div>
    );
  }

  if (!registration) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold text-[#333]">
            Registration details not found
          </h1>

          <p className="mb-6 text-gray-600">
            Please return to the registration page and try again.
          </p>

          <button
            onClick={() => router.push(routes.home)}
            className="cursor-pointer bg-[#c6090a] px-8 py-3 text-lg font-medium text-white transition hover:bg-[#333]"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const email = registration.email || "your registered email";
  const planName = registration.planName || "Your Plan";

  return (
    <div className="min-h-[85vh] bg-white flex items-center justify-center px-4 pb-24 mt-5 md:mt-5">
      <div className="w-full max-w-2xl rounded-2xl border border-gray-200 bg-white px-8 py-14 text-center shadow-sm">
        {/* Success Icon */}
        <div className="mb-6 text-6xl text-green-500">✔</div>

        {/* Title */}
        <h1 className="mb-4 text-3xl font-bold text-[#333] sm:text-4xl">
          Thank You
        </h1>

        {/* Subscription Success */}
        <p className="mb-3 text-lg leading-relaxed text-gray-700">
          Your <span className="font-semibold">{planName}</span> has been
          activated successfully.
        </p>

        {/* Email Verification Message */}
        <div className="mx-auto mb-8 mt-6 rounded-lg border border-red-100 bg-red-50 px-5 py-4">
          <p className="text-sm leading-6 text-gray-700">
            Please check your email address{" "}
            <span className="font-semibold text-[#c8050b]">{email}</span> and
            click the verification link to verify your account.
          </p>
        </div>

        {/* Additional Information */}
        <p className="mb-8 text-sm leading-6 text-gray-500">
          You will need to verify your email before you can log in and access
          your subscription.
        </p>

        {/* Home Button */}
        <button
          onClick={() => router.push(routes.home)}
          className="cursor-pointer bg-[#c6090a] px-8 py-3 text-lg font-medium text-white transition hover:bg-[#333]"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}
