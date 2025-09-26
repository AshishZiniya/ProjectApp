import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Auth middleware
 * - Handles client-side authentication redirects
 * - Prevents access to auth pages when logged in
 * - Redirects to login for protected routes when not authenticated
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get("accessToken")?.value;

  const isAuthRoute =
    pathname.startsWith("/auth/login") ||
    pathname.startsWith("/auth/register") ||
    pathname.startsWith("/auth/forgot-password") ||
    pathname.startsWith("/auth/reset-password");

  const isProtectedRoute =
    pathname.startsWith("/users") ||
    pathname.startsWith("/projects") ||
    pathname.startsWith("/tasks") ||
    pathname.startsWith("/comments") ||
    pathname.startsWith("/admin");

  // If user is logged in and trying to access auth pages, redirect to projects
  if (isAuthRoute && accessToken) {
    return NextResponse.redirect(new URL("/projects", request.url));
  }

  // If user is not logged in and trying to access protected routes, redirect to login
  if (isProtectedRoute && !accessToken) {
    const loginUrl = new URL("/auth/login", request.url);
    // Store the current path to redirect back after login
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // For all other cases, allow access
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/users/:path*",
    "/projects/:path*",
    "/tasks/:path*",
    "/comments/:path*",
    "/admin/:path*",
    "/auth/login",
    "/auth/register",
    "/auth/forgot-password",
    "/auth/reset-password",
    "/auth/refresh",
  ],
};
