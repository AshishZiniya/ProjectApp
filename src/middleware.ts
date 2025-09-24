import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Auth middleware
 * - Since JWT is now handled by frontend, middleware only prevents access to auth pages when logged in.
 * - Backend guards protect API routes.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAuthRoute =
    pathname.startsWith("/auth/login") || pathname.startsWith("/auth/register");

  // For auth routes, allow access (frontend will handle redirects if logged in)
  if (isAuthRoute) {
    return NextResponse.next();
  }

  // For other routes, allow (backend will reject if not authenticated)
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
    "/auth/refresh",
  ],
};
