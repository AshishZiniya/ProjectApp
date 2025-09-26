/**
 * Comments Layout - Layout wrapper for all comment-related pages
 *
 * This layout provides consistent structure and metadata for all pages
 * within the comments section, including comment listings, individual
 * comment views, and comment creation.
 *
 * Features:
 * - Comment-specific styling and navigation
 * - SEO metadata for comment pages
 * - Shared layout structure for all comment routes
 * - Proper document structure for accessibility
 *
 * @version 1.0.0
 * @since 2024
 */

import { Metadata } from "next";
import { ReactNode } from "react";

/**
 * Props interface for the CommentsLayout component
 */
interface CommentsLayoutProps {
  children: ReactNode;
}

/**
 * Comments Layout Component
 *
 * Provides the layout structure for all comment-related pages with
 * consistent styling, navigation, and metadata configuration.
 *
 * @param children - Child components to be rendered within the layout
 * @returns JSX.Element - The rendered layout with children
 */
export default function CommentsLayout({ children }: CommentsLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main content area */}
      <main className="flex-1">{children}</main>
    </div>
  );
}

/**
 * Metadata for the Comments section
 *
 * This metadata applies to all pages within the comments section
 * and is used by Next.js for SEO, social media sharing, and
 * search engine optimization.
 */
export const metadata: Metadata = {
  title: {
    default: "Comments | Task Manager",
    template: "%s | Comments | Task Manager",
  },
  description:
    "View and manage comments across all tasks and projects. Collaborate effectively with your team through contextual discussions.",
  keywords: [
    "comments",
    "collaboration",
    "task comments",
    "project discussions",
    "team communication",
    "feedback",
    "task manager comments",
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
    canonical: "/comments",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/comments",
    title: "Comments | Task Manager",
    description: "View and manage comments across all tasks and projects.",
    siteName: "Task Manager",
    images: [
      {
        url: "/og-comments.png",
        width: 1200,
        height: 630,
        alt: "Comments - Task Manager",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Comments | Task Manager",
    description: "View and manage comments across all tasks and projects.",
    images: ["/og-comments.png"],
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
  category: "collaboration",
};
