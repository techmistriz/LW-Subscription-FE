import { toast } from "sonner";
import type { CheckoutData, PaymentVerificationResponse } from "@/types/api";
import type { PaymentDetails, User } from "@/types/models";
import type { RazorpayPaymentResponse } from "@/types/razorpay";

let sdkPromise: Promise<void> | undefined;

export function loadRazorpay(): Promise<void> {
  if (window.Razorpay) return Promise.resolve();
  if (sdkPromise) return sdkPromise;

  sdkPromise = new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      'script[src="https://checkout.razorpay.com/v1/checkout.js"]',
    );
    const script = existing ?? document.createElement("script");
    const timer = window.setTimeout(
      () =>
        reject(
          new Error("Payment checkout took too long to load. Please retry."),
        ),
      15000,
    );
    script.addEventListener(
      "load",
      () => {
        window.clearTimeout(timer);
        resolve();
      },
      { once: true },
    );
    script.addEventListener(
      "error",
      () => {
        window.clearTimeout(timer);
        script.remove();
        reject(new Error("Payment checkout could not load. Please retry."));
      },
      { once: true },
    );
    if (!existing) {
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }).catch((error) => {
    sdkPromise = undefined;
    throw error;
  });

  return sdkPromise;
}

const confirmationKey = (orderId: string) => `payment_confirmation:${orderId}`;

async function openCheckout(
  payment: PaymentDetails,
  user: Partial<User>,
): Promise<RazorpayPaymentResponse | null> {
  if (
    !payment.order_id ||
    !payment.razorpay_key ||
    payment.amount <= 0 ||
    (payment.gateway && payment.gateway !== "RAZORPAY")
  ) {
    throw new Error("Payment checkout is unavailable.");
  }

  // If verification timed out, retry that callback before opening another payment window.
  const saved = sessionStorage.getItem(confirmationKey(payment.order_id));
  if (saved) {
    try {
      return JSON.parse(saved) as RazorpayPaymentResponse;
    } catch {
      sessionStorage.removeItem(confirmationKey(payment.order_id));
    }
  }
  await loadRazorpay();

  return new Promise((resolve) => {
    let completed = false;
    const checkout = new window.Razorpay({
      key: payment.razorpay_key,
      amount: payment.amount,
      currency: payment.currency,
      order_id: payment.order_id,
      name: "Lex Witness",
      prefill: {
        name: `${user.first_name ?? ""} ${user.last_name ?? ""}`.trim(),
        email: user.email,
        contact: user.contact,
      },
      theme: { color: "#c8050b" },
      handler: async (response) => {
        completed = true;
        sessionStorage.setItem(
          confirmationKey(payment.order_id),
          JSON.stringify(response),
        );
        resolve(response);
      },
      modal: {
        ondismiss: () => {
          if (!completed) {
            toast.info(
              "Payment is pending. You can resume it from subscription history.",
            );
            resolve(null);
          }
        },
      },
    });
    checkout.on("payment.failed", (response) =>
      toast.error(
        response.error?.description ??
          "Payment failed. You can retry checkout.",
      ),
    );
    checkout.open();
  });
}

export async function completeCheckout(
  data: CheckoutData,
  user: Partial<User>,
  verify: (
    response: RazorpayPaymentResponse,
  ) => Promise<PaymentVerificationResponse>,
  onVerifying?: (verifying: boolean) => void,
) {
  if (!data.payment) {
    if (data.payment_confirmed) return data.subscription;
    throw new Error(
      "Payment checkout is unavailable. Your subscription is still pending.",
    );
  }
  const response = await openCheckout(data.payment, user);
  if (!response) return null;

  onVerifying?.(true);
  try {
    const result = await verify(response);
    if (!result.status || !result.data?.payment_confirmed) {
      if (result.data?.payment_status === "FAILED") {
        sessionStorage.removeItem(confirmationKey(data.payment.order_id));
      }
      throw new Error(
        result.message ||
          "Payment is awaiting confirmation. Please check your subscription before paying again.",
      );
    }
    sessionStorage.removeItem(confirmationKey(data.payment.order_id));
    return result.data.subscription;
  } finally {
    onVerifying?.(false);
  }
}
