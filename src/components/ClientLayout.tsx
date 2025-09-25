"use client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Toaster from "@/components/ui/Toaster";
import TopLoader from "@/components/ui/TopLoader";
import ErrorBoundary from "@/components/ErrorBoundary";
import { Suspense } from "react";
import { usePathname } from "next/navigation";

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isAuthPage = pathname.startsWith("/auth");

  return (
    <ErrorBoundary>
      <TopLoader />
      {!isAuthPage && <Navbar />}
      <Suspense fallback={<TopLoader />}>
        <main className={`flex-1 ${!isAuthPage ? "mt-16" : ""}`}>
          {children}
        </main>
      </Suspense>
      {!isAuthPage && <Footer />}
      <Toaster />
    </ErrorBoundary>
  );
}
