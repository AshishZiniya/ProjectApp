/**
 * Users Layout - Layout wrapper for all user-related pages
 *
 * This layout provides consistent structure and metadata for all pages
 * within the users section, including user listings, individual user
 * profiles, and user management.
 *
 * Features:
 * - User-specific styling and navigation
 * - SEO metadata for user pages
 * - Shared layout structure for all user routes
 * - Proper document structure for accessibility
 *
 * @version 1.0.0
 * @since 2024
 */

import { Metadata } from "next";
import { ReactNode } from "react";

/**
 * Props interface for the UsersLayout component
 */
interface UsersLayoutProps {
  children: ReactNode;
}

/**
 * Users Layout Component
 *
 * Provides the layout structure for all user-related pages with
 * consistent styling, navigation, and metadata configuration.
 *
 * @param children - Child components to be rendered within the layout
 * @returns JSX.Element - The rendered layout with children
 */
export default function UsersLayout({ children }: UsersLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main content area */}
      <main className="flex-1">{children}</main>
    </div>
  );
}

/**
 * Metadata for the Users section
 *
 * This metadata applies to all pages within the users section
 * and is used by Next.js for SEO, social media sharing, and
 * search engine optimization.
 */
export const metadata: Metadata = {
  title: {
    default: "Users | Task Manager",
    template: "%s | Users | Task Manager",
  },
  description:
    "Manage and view user profiles across your organization. Connect with team members and track user activity.",
  keywords: [
    "users",
    "profiles",
    "team members",
    "user management",
    "organization",
    "team collaboration",
    "user directory",
    "task manager users",
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
    canonical: "/users",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/users",
    title: "Users | Task Manager",
    description: "Manage and view user profiles across your organization.",
    siteName: "Task Manager",
    images: [
      {
        url: "/og-users.png",
        width: 1200,
        height: 630,
        alt: "Users - Task Manager",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Users | Task Manager",
    description: "Manage and view user profiles across your organization.",
    images: ["/og-users.png"],
    creator: "@taskmanager",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
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
  category: "user management",
};
