"use client";
import { Suspense, lazy } from "react";
import { usePathname } from "next/navigation";
import SessionProvider from "@/components/SessionProvider";

// Lazy load components that are not critical for initial render
const Navbar = lazy(() => import("@/components/Navbar"));
const Footer = lazy(() => import("@/components/Footer"));
const Toaster = lazy(() => import("@/components/ui/Toaster"));
const TopLoader = lazy(() => import("@/components/ui/TopLoader"));
const ErrorBoundary = lazy(() => import("@/components/ErrorBoundary"));

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isAuthPage = pathname.startsWith("/auth");

  return (
    <ErrorBoundary>
      <SessionProvider>
        <TopLoader />
        {/* Authentication is now handled entirely in middleware */}
        {!isAuthPage && <Navbar />}
        <Suspense fallback={<TopLoader />}>
          <main className={`flex-1 ${!isAuthPage ? "mt-20" : ""}`}>
            {children}
          </main>
        </Suspense>
        {!isAuthPage && <Footer />}
        <Toaster />
      </SessionProvider>
    </ErrorBoundary>
  );
}
