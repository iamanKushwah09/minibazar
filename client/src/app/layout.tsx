import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "./providers";
import Header from "../components/Header";
import Footer from "../components/Footer";
import RouteLoader from "../components/RouteLoader";
import { Suspense } from "react";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Shivanya Masale",
  description: "Discover the latest Indian spices from Shivanya Masale of Companies. Quality, care, and health in every product.",
  keywords: "shivanya masale, Indian spices, masale, ecommerce",
  icons: {
    icon: "/logo-v2.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="overflow-x-hidden">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col overflow-x-hidden w-full`}
      >
        <Providers>
          <Suspense fallback={null}>
            <RouteLoader />
          </Suspense>
          <Header />
          <main className="flex-1 pt-[88px] md:pt-[120px] min-w-0 w-full overflow-x-hidden flex flex-col">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
