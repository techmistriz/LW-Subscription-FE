import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import Script from "next/script";

import "./globals.css";

import Header from "@/components/layout/Header/Header";
import Footer from "@/components/layout/Footer/Footer";
import ScrollToTop from "@/components/navigation/ScrollToTop";
import ScrollProvider from "./providers";
import AuthGate from "@/components/AuthGate";
import { ReduxProvider } from "@/store/providers";
import InitAuth from "@/store/initAuth";
import { Toaster } from "sonner";
import { siteConfig } from "@/config/site";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),

  title: {
    default: "Lex Witness | India's 1st Magazine on Legal & Corporate Affairs",
    template: "%s | Lex Witness",
  },

  description:
    "Lex Witness brings you the latest legal news, corporate affairs, legal insights, analysis, magazines and industry updates.",

  applicationName: siteConfig.name,

  authors: [
    {
      name: siteConfig.name,
    },
  ],

  creator: siteConfig.name,
  publisher: siteConfig.name,

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  alternates: {
    canonical: siteConfig.url,
  },

  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    title: "Lex Witness | India's 1st Magazine on Legal & Corporate Affairs",
    description:
      "Latest legal news, corporate affairs, legal insights, analysis, magazines and industry updates.",
    url: siteConfig.url,
    images: [
      {
        url: siteConfig.defaultOgImage,
        width: 1200,
        height: 630,
        alt: "Lex Witness",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Lex Witness | India's 1st Magazine on Legal & Corporate Affairs",
    description:
      "Latest legal news, corporate affairs, legal insights, analysis, magazines and industry updates.",
    images: [siteConfig.defaultOgImage],
  },

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
      <body
        className="antialiased min-h-screen flex flex-col overflow-x-hidden"
        suppressHydrationWarning
      >
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
