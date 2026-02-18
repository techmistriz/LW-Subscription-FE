import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import ScrollProvider from "./providers";
import { getCategories } from "@/lib/api/services/categories";
import LoaderOverlay from "@/components/LoaderOverlay/LoaderOverlay";

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
  const categories = await getCategories();

  return (
    <html lang="en" className={poppins.variable}>
      <body className="antialiased">
        <ScrollProvider>
          <Header categories={categories} />
        {/* <LoaderOverlay/> */}
          {children}
          <Footer />
          <ScrollToTop />
        </ScrollProvider>
      </body>
    </html>
  );
}
