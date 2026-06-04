import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import Script from "next/script";

import "./globals.css";

import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import ScrollProvider from "./providers";
// import { getCategories } from "@/lib/api/services/categories";
import AuthGate from "@/components/AuthGate";
import { ReduxProvider } from "@/redux/provides";
import InitAuth from "@/redux/store/initAuth";
import { Toaster } from "sonner";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Lex Witness | India's 1st Magazine on Legal & Corporate Affairs",
  description: "Latest legal magazines and publications",
  icons: {
    icon: "/favicon.ico",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const categories = await getCategories();

  return (
    <html lang="en" className={poppins.variable}>
      <body className="antialiased min-h-screen flex flex-col overflow-x-hidden">
        {/* Razorpay Script */}
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="lazyOnload"
        />

        <ScrollProvider>
          <ReduxProvider>
            <InitAuth>
              {/* <Header categories={categories} /> */}
              <Header />

              {/* <LoaderOverlay/> */}

              <AuthGate />

              <main className="flex-1 min-h-[90vh] w-full">{children}</main>
              <Toaster richColors position="bottom-right" />

              <Footer />
              <ScrollToTop />
            </InitAuth>
          </ReduxProvider>
        </ScrollProvider>
      </body>
    </html>
  );
}
