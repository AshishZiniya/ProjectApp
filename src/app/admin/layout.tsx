/**
 * Admin Layout - Layout wrapper for all admin-related pages
 *
 * This layout provides consistent structure and metadata for all pages
 * within the admin section, including admin dashboard, user management,
 * and administrative functions.
 *
 * Features:
 * - Admin-specific navigation and styling
 * - SEO metadata for admin pages
 * - Shared layout structure for all admin routes
 * - Proper document structure for accessibility
 *
 * @version 1.0.0
 * @since 2024
 */

import { Metadata } from "next";
import { ReactNode } from "react";

/**
 * Props interface for the AdminLayout component
 */
interface AdminLayoutProps {
  children: ReactNode;
}

/**
 * Admin Layout Component
 *
 * Provides the layout structure for all admin-related pages with
 * consistent styling, navigation, and metadata configuration.
 *
 * @param children - Child components to be rendered within the layout
 * @returns JSX.Element - The rendered layout with children
 */
export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main content area */}
      <main className="flex-1">{children}</main>
    </div>
  );
}

/**
 * Metadata for the Admin section
 *
 * This metadata applies to all pages within the admin section
 * and is used by Next.js for SEO, social media sharing, and
 * search engine optimization.
 */
export const metadata: Metadata = {
  title: {
    default: "Admin Dashboard | Task Manager",
    template: "%s | Admin | Task Manager",
  },
  description:
    "Administrative dashboard for managing users, projects, and system settings. Access powerful tools for platform administration.",
  keywords: [
    "admin",
    "dashboard",
    "administration",
    "user management",
    "system settings",
    "task manager admin",
    "platform management",
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
    canonical: "/admin",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/admin",
    title: "Admin Dashboard | Task Manager",
    description:
      "Administrative dashboard for managing users, projects, and system settings.",
    siteName: "Task Manager",
    images: [
      {
        url: "/og-admin.png",
        width: 1200,
        height: 630,
        alt: "Admin Dashboard - Task Manager",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Admin Dashboard | Task Manager",
    description:
      "Administrative dashboard for managing users, projects, and system settings.",
    images: ["/og-admin.png"],
    creator: "@taskmanager",
  },
  robots: {
    index: false, // Admin pages should not be indexed
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
  category: "administration",
};
