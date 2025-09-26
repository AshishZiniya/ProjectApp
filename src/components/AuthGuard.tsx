"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

interface AuthGuardProps {
  children: React.ReactNode;
  redirectTo?: string;
  requireAuth?: boolean;
}

export default function AuthGuard({
  children,
  redirectTo = "/auth/login",
  requireAuth = true,
}: AuthGuardProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Don't redirect while still loading
    if (loading) return;

    if (requireAuth) {
      // If authentication is required but user is not logged in
      if (!user) {
        // Store the current path to redirect back after login
        sessionStorage.setItem("redirectAfterLogin", pathname);
        router.push(redirectTo);
        return;
      }
    } else {
      // If authentication is not required (e.g., auth pages)
      if (user) {
        // If user is logged in, redirect to the stored path or projects page
        const redirectPath = sessionStorage.getItem("redirectAfterLogin") || "/projects";
        sessionStorage.removeItem("redirectAfterLogin");
        router.push(redirectPath);
        return;
      }
    }
  }, [user, loading, router, pathname, redirectTo, requireAuth]);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // If authentication is required and user is not logged in, don't render children
  if (requireAuth && !user) {
    return null;
  }

  // If authentication is not required and user is logged in, don't render children
  if (!requireAuth && user) {
    return null;
  }

  // Render children if authentication state matches requirements
  return <>{children}</>;
}