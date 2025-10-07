'use client';
import { Suspense, lazy } from 'react';
import { usePathname } from 'next/navigation';
import SessionProvider from '@/components/SessionProvider';

// Lazy load components that are not critical for initial render
const Navbar = lazy(() => import('@/components/Navbar'));
const Footer = lazy(() => import('@/components/Footer'));
const Toaster = lazy(() => import('@/components/ui/Toaster'));
const TopLoader = lazy(() => import('@/components/ui/TopLoader'));
const ErrorBoundary = lazy(() => import('@/components/ErrorBoundary'));

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isAuthPage = pathname.startsWith('/auth');

  return (
    <ErrorBoundary>
      <SessionProvider>
        <TopLoader />
        {/* Authentication is now handled entirely in middleware */}
        {!isAuthPage && <Navbar />}
        <Suspense
          fallback={
            <main
              className={`flex-1 w-full ${!isAuthPage ? 'mt-20' : ''} animated-bg`}
            >
              <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
              </div>
            </main>
          }
        >
          <main className={`flex-1 w-full ${!isAuthPage ? 'mt-28' : ''} animated-bg`}>
            {children}
          </main>
        </Suspense>
        {!isAuthPage && <Footer />}
        <Toaster />
      </SessionProvider>
    </ErrorBoundary>
  );
}
