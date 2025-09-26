/**
 * Projects Layout - Layout wrapper for all project-related pages
 *
 * This layout provides consistent structure and metadata for all pages
 * within the projects section, including the main projects dashboard,
 * individual project details, and project creation pages.
 *
 * Features:
 * - Consistent navigation and styling
 * - SEO metadata for project pages
 * - Shared layout structure for all project routes
 * - Proper document structure for accessibility
 *
 * @version 1.0.0
 * @since 2024
 */

import { Metadata } from "next";
import { ReactNode } from "react";

/**
 * Props interface for the ProjectsLayout component
 */
interface ProjectsLayoutProps {
  children: ReactNode;
}

/**
 * Projects Layout Component
 *
 * Provides the layout structure for all project-related pages with
 * consistent styling, navigation, and metadata configuration.
 *
 * @param children - Child components to be rendered within the layout
 * @returns JSX.Element - The rendered layout with children
 */
export default function ProjectsLayout({ children }: ProjectsLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main content area */}
      <main className="flex-1">{children}</main>
    </div>
  );
}

/**
 * Metadata for the Projects section
 *
 * This metadata applies to all pages within the projects section
 * and is used by Next.js for SEO, social media sharing, and
 * search engine optimization.
 */
export const metadata: Metadata = {
  title: {
    default: "Projects Dashboard | Task Manager",
    template: "%s | Projects | Task Manager",
  },
  description:
    "Manage and track all your projects in one comprehensive dashboard. Create, edit, and monitor project progress with ease.",
  keywords: [
    "projects",
    "dashboard",
    "project management",
    "task manager",
    "project tracking",
    "team collaboration",
    "productivity",
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
    canonical: "/projects",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/projects",
    title: "Projects Dashboard | Task Manager",
    description:
      "Manage and track all your projects in one comprehensive dashboard. Create, edit, and monitor project progress with ease.",
    siteName: "Task Manager",
    images: [
      {
        url: "/og-projects.png",
        width: 1200,
        height: 630,
        alt: "Projects Dashboard - Task Manager",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Projects Dashboard | Task Manager",
    description:
      "Manage and track all your projects in one comprehensive dashboard.",
    images: ["/og-projects.png"],
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
  category: "project management",
};
