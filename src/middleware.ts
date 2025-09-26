import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { hasPermission } from '@/utils/auth';
import type { UserRole } from '@/types';

/**
 * Enhanced auth middleware with authorization
 * - Handles client-side authentication redirects
 * - Prevents access to auth pages when logged in
 * - Redirects to login for protected routes when not authenticated
 * - Enforces role-based access control for admin routes
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Define route categories for better maintainability
  const isAuthRoute =
    pathname.startsWith('/auth/login') ||
    pathname.startsWith('/auth/register') ||
    pathname.startsWith('/auth/forgot-password') ||
    pathname.startsWith('/auth/reset-password');

  const isProtectedRoute =
    pathname.startsWith('/projects') ||
    pathname.startsWith('/tasks') ||
    pathname.startsWith('/comments') ||
    pathname.startsWith('/users') ||
    pathname.startsWith('/admin');

  const isAdminRoute = pathname.startsWith('/admin');
  const isUsersRoute = pathname.startsWith('/users');

  // Get NextAuth session token with error handling and secret validation
  let user: { id: string; email?: string | null; name?: string | null; role?: UserRole } | null = null;
  try {
    const secret = process.env.NEXTAUTH_SECRET;
    if (!secret) {
      console.error('NEXTAUTH_SECRET is not defined');
    } else {
      const token = await getToken({
        req: request,
        secret,
      });

      if (token && token.sub) {
        user = {
          id: token.sub,
          email: token.email ?? null,
          name: token.name ?? null,
          role: token.role as UserRole,
        };
      }
    }
  } catch (error) {
    // Log error but continue with user = null for security
    console.error('Middleware session check failed:', error);
  }

  // If user is logged in and trying to access auth pages, redirect to projects
  if (isAuthRoute && user) {
    return NextResponse.redirect(new URL('/projects', request.url));
  }

  // If user is not logged in and trying to access protected routes, redirect to login
  if (isProtectedRoute && !user) {
    const loginUrl = new URL('/auth/login', request.url);
    // Store the current path to redirect back after login
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // For admin routes, check permissions
  if (isAdminRoute && user?.role) {
    const hasAdminPermission = hasPermission(user.role, "ADD_ADMIN");
    if (!hasAdminPermission) {
      const projectsUrl = new URL("/projects", request.url);
      projectsUrl.searchParams.set("error", "access_denied");
      projectsUrl.searchParams.set("message", "You don't have permission to access admin features.");
      return NextResponse.redirect(projectsUrl);
    }
  }

  // For users routes, check permissions
  if (isUsersRoute && user?.role) {
    const hasUsersPermission = hasPermission(user.role, "VIEW_USERS");
    if (!hasUsersPermission) {
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
    '/users/:path*',
    '/projects/:path*',
    '/tasks/:path*',
    '/comments/:path*',
    '/admin/:path*',
    '/auth/login',
    '/auth/register',
    '/auth/forgot-password',
    '/auth/reset-password',
    '/auth/refresh',
  ],
};
