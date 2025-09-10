// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Toaster from "@/components/ui/Toaster";
import { Suspense } from "react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

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
        <Suspense fallback={<LoadingSpinner />}>
          <Navbar />
          <main className="flex-grow mt-18">{children}</main>
          <Footer />
          <Toaster />
        </Suspense>
      </body>
    </html>
  );
}
