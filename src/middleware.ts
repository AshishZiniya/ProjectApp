import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Auth middleware
 * - JWT is validated by the backend. We only gate routes by cookie presence.
 * - If no accessToken: allow auth pages, block protected pages.
 * - If accessToken exists: block auth pages, allow others.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get("accessToken")?.value;

  const isAuthRoute =
    pathname.startsWith("/auth/login") || pathname.startsWith("/auth/register");

  // Not logged in: only allow login/register
  if (!accessToken) {
    if (isAuthRoute) {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // Logged in: prevent access to login/register
  if (isAuthRoute) {
    return NextResponse.redirect(new URL("/projects", request.url));
  }

  // Logged in and not an auth route: allow
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/users/:path*",
    "/projects/:path*",
    "/tasks/:path*",
    "/comments/:path*",
    "/auth/login",
    "/auth/register",
    "/auth/refresh",
  ],
};
