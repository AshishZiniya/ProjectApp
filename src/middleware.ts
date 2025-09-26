import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import type { UserRole } from "@/types";

// JWT secret - in production, this should come from environment variables
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// Permission definitions (moved from utils/auth.ts)
const PERMISSIONS = {
  VIEW_USERS: ["ADMIN", "SUPERADMIN"] as UserRole[],
  MANAGE_USERS: ["ADMIN", "SUPERADMIN"] as UserRole[],
  ADD_ADMIN: ["ADMIN", "SUPERADMIN"] as UserRole[],
  VIEW_PROJECTS: ["USER", "ADMIN", "SUPERADMIN"] as UserRole[],
  MANAGE_PROJECTS: ["USER", "ADMIN", "SUPERADMIN"] as UserRole[],
  VIEW_TASKS: ["USER", "ADMIN", "SUPERADMIN"] as UserRole[],
  MANAGE_TASKS: ["USER", "ADMIN", "SUPERADMIN"] as UserRole[],
  SYSTEM_ADMIN: ["SUPERADMIN"] as UserRole[],
} as const;

type Permission = keyof typeof PERMISSIONS;

interface JWTPayload {
  userId: string;
  email: string;
  role: UserRole;
  iat: number;
  exp: number;
}

/**
 * Check if a user role has a specific permission
 */
function hasPermission(userRole: UserRole, permission: Permission): boolean {
  const allowedRoles = PERMISSIONS[permission];
  return allowedRoles.includes(userRole);
}

/**
 * Verify JWT token and return user payload
 */
function verifyToken(token: string): JWTPayload | null {
  try {
    const payload = jwt.verify(token, JWT_SECRET) as JWTPayload;
    return payload;
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
}

/**
 * Enhanced auth middleware with authorization
 * - Handles client-side authentication redirects
 * - Prevents access to auth pages when logged in
 * - Redirects to login for protected routes when not authenticated
 * - Enforces role-based access control for admin routes
 */
export async function middleware(request: NextRequest) {
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

  const isAdminRoute = pathname.startsWith("/admin");
  const isUsersRoute = pathname.startsWith("/users");

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

  // For admin routes, verify token and check permissions
  if (isAdminRoute && accessToken) {
    const userPayload = verifyToken(accessToken);

    if (!userPayload) {
      // Invalid token, redirect to login
      const loginUrl = new URL("/auth/login", request.url);
      const response = NextResponse.redirect(loginUrl);
      response.cookies.delete("accessToken");
      return response;
    }

    // Check if user has admin permissions
    const hasAdminPermission = hasPermission(userPayload.role, "ADD_ADMIN");

    if (!hasAdminPermission) {
      // User doesn't have admin permissions, redirect to projects with error
      const projectsUrl = new URL("/projects", request.url);
      projectsUrl.searchParams.set("error", "access_denied");
      projectsUrl.searchParams.set("message", "You don't have permission to access admin features.");
      return NextResponse.redirect(projectsUrl);
    }
  }

  // For users routes, verify token and check permissions
  if (isUsersRoute && accessToken) {
    const userPayload = verifyToken(accessToken);

    if (!userPayload) {
      // Invalid token, redirect to login
      const loginUrl = new URL("/auth/login", request.url);
      const response = NextResponse.redirect(loginUrl);
      response.cookies.delete("accessToken");
      return response;
    }

    // Check if user has users view permissions
    const hasUsersPermission = hasPermission(userPayload.role, "VIEW_USERS");

    if (!hasUsersPermission) {
      // User doesn't have users permissions, redirect to projects with error
      const projectsUrl = new URL("/projects", request.url);
      projectsUrl.searchParams.set("error", "access_denied");
      projectsUrl.searchParams.set("message", "You don't have permission to access user management features.");
      return NextResponse.redirect(projectsUrl);
    }
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
