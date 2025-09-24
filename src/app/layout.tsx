// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Toaster from "@/components/ui/Toaster";
import TopLoader from "@/components/ui/TopLoader";
import ErrorBoundary from "@/components/ErrorBoundary";
import { Suspense } from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Project Management App",
  description:
    "A full-stack project management application built with NestJS and Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ErrorBoundary>
          <TopLoader />
          <Navbar />
          <Suspense fallback={<TopLoader />}>
            <main className="flex-grow mt-16">{children}</main>
          </Suspense>
          <Footer />
          <Toaster />
        </ErrorBoundary>
      </body>
    </html>
  );
}
