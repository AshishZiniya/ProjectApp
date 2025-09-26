/**
 * Tasks Layout - Layout wrapper for all task-related pages
 *
 * This layout provides consistent structure and metadata for all pages
 * within the tasks section, including task listings, individual task
 * details, and task creation.
 *
 * Features:
 * - Task-specific styling and navigation
 * - SEO metadata for task pages
 * - Shared layout structure for all task routes
 * - Proper document structure for accessibility
 *
 * @version 1.0.0
 * @since 2024
 */

import { Metadata } from "next";
import { ReactNode } from "react";

/**
 * Props interface for the TasksLayout component
 */
interface TasksLayoutProps {
  children: ReactNode;
}

/**
 * Tasks Layout Component
 *
 * Provides the layout structure for all task-related pages with
 * consistent styling, navigation, and metadata configuration.
 *
 * @param children - Child components to be rendered within the layout
 * @returns JSX.Element - The rendered layout with children
 */
export default function TasksLayout({ children }: TasksLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main content area */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}

/**
 * Metadata for the Tasks section
 *
 * This metadata applies to all pages within the tasks section
 * and is used by Next.js for SEO, social media sharing, and
 * search engine optimization.
 */
export const metadata: Metadata = {
  title: {
    default: "Tasks Dashboard | Task Manager",
    template: "%s | Tasks | Task Manager",
  },
  description: "Manage and track all your tasks efficiently. Create, assign, and monitor task progress with powerful collaboration tools.",
  keywords: [
    "tasks",
    "dashboard",
    "task management",
    "project tasks",
    "task tracking",
    "productivity",
    "team collaboration",
    "task manager",
  ],
  authors: [{ name: "Task Manager Team" }],
  creator: "Task Manager",
  publisher: "Task Manager Corp",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  alternates: {
    canonical: "/tasks",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/tasks",
    title: "Tasks Dashboard | Task Manager",
    description: "Manage and track all your tasks efficiently with powerful collaboration tools.",
    siteName: "Task Manager",
    images: [
      {
        url: "/og-tasks.png",
        width: 1200,
        height: 630,
        alt: "Tasks Dashboard - Task Manager",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tasks Dashboard | Task Manager",
    description: "Manage and track all your tasks efficiently with powerful collaboration tools.",
    images: ["/og-tasks.png"],
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
  category: "task management",
};