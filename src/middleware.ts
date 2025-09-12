import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("accessToken")?.value;

  // Not logged in: only allow access to login/register
  if (!token) {
    if (
      pathname.startsWith("/auth/login") ||
      pathname.startsWith("/auth/register")
    ) {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // Logged in: prevent access to login/register
  if (
    pathname.startsWith("/auth/login") ||
    pathname.startsWith("/auth/register")
  ) {
    return NextResponse.redirect(new URL("/projects", request.url));
  }

  // Decode token to get role
  let role: string | undefined;
  try {
    const payload = JSON.parse(
      Buffer.from(token.split(".")[1], "base64").toString()
    );
    role = payload.role;
  } catch {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // Admin: full access
  if (role === "ADMIN") {
    return NextResponse.next();
  }

  // User: block /users, allow all else
  if (role === "USER") {
    if (pathname.startsWith("/users")) {
      return NextResponse.redirect(new URL("/projects", request.url));
    }
    return NextResponse.next();
  }

  // Fallback: redirect to login
  return NextResponse.redirect(new URL("/auth/login", request.url));
}

export const config = {
  matcher: [
    "/users/:path*",
    "/projects/:path*",
    "/tasks/:path*",
    "/auth/login",
    "/auth/register",
  ],
};
