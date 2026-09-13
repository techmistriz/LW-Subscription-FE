import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Under Maintenance",
  description:
    "Lex Witness is temporarily unavailable while we make improvements.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function MaintenancePage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f8f8f8] px-6 py-12 text-center">
      <section
        className="w-full max-w-xl rounded-2xl border border-gray-200 bg-white px-6 py-12 shadow-sm sm:px-12"
        aria-labelledby="maintenance-title"
      >
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#c9060a]">
          Lex Witness
        </p>
        <h1
          id="maintenance-title"
          className="mt-5 text-3xl font-semibold text-gray-900 sm:text-4xl"
        >
          We’ll be back shortly
        </h1>
        <p className="mt-4 text-base leading-7 text-gray-600">
          We’re carrying out some scheduled maintenance to improve your
          experience. Please check back in a little while.
        </p>
      </section>
    </main>
  );
}
