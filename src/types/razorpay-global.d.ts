import type { RazorpayConstructor } from "./razorpay";

declare global {
  interface Window {
    Razorpay: RazorpayConstructor;
  }
}

export {};
