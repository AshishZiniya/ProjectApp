/**
 * Auth Layout - Layout wrapper for all authentication-related pages
 *
 * This layout provides consistent structure and metadata for all pages
 * within the auth section, including login, register, password reset,
 * and other authentication flows.
 *
 * Features:
 * - Auth-specific styling and branding
 * - SEO metadata for auth pages
 * - Shared layout structure for all auth routes
 * - Proper document structure for accessibility
 *
 * @version 1.0.0
 * @since 2024
 */

import { Metadata } from "next";
import { ReactNode } from "react";

/**
 * Props interface for the AuthLayout component
 */
interface AuthLayoutProps {
  children: ReactNode;
}

/**
 * Auth Layout Component
 *
 * Provides the layout structure for all authentication-related pages with
 * consistent styling, branding, and metadata configuration.
 *
 * @param children - Child components to be rendered within the layout
 * @returns JSX.Element - The rendered layout with children
 */
export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Main content area */}
      <main className="flex-1">{children}</main>
    </div>
  );
}

/**
 * Metadata for the Auth section
 *
 * This metadata applies to all pages within the auth section
 * and is used by Next.js for SEO, social media sharing, and
 * search engine optimization.
 */
export const metadata: Metadata = {
  title: {
    default: "Authentication | Task Manager",
    template: "%s | Auth | Task Manager",
  },
  description:
    "Secure authentication system for Task Manager. Login, register, and manage your account with confidence.",
  keywords: [
    "login",
    "register",
    "authentication",
    "sign in",
    "sign up",
    "password reset",
    "account management",
    "task manager auth",
  ],
  authors: [{ name: "Task Manager Team" }],
  creator: "Task Manager",
  publisher: "Task Manager Corp",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  ),
  alternates: {
    canonical: "/auth/login",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/auth/login",
    title: "Authentication | Task Manager",
    description:
      "Secure authentication system for Task Manager. Login, register, and manage your account.",
    siteName: "Task Manager",
    images: [
      {
        url: "/og-auth.png",
        width: 1200,
        height: 630,
        alt: "Authentication - Task Manager",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Authentication | Task Manager",
    description: "Secure authentication system for Task Manager.",
    images: ["/og-auth.png"],
    creator: "@taskmanager",
  },
  robots: {
    index: false, // Auth pages should not be indexed
    follow: false,
    googleBot: {
      index: false,
      follow: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
    yandex: process.env.YANDEX_VERIFICATION,
    yahoo: process.env.YAHOO_SITE_VERIFICATION,
  },
  category: "authentication",
};
