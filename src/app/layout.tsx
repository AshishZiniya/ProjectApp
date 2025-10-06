import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import ClientLayout from '@/components/ClientLayout';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/next';
import ThemeToggle from '@/components/ui/ThemeToggle';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

export const metadata: Metadata = {
  title: {
    default: 'Task Manager - Project Management Made Simple',
    template: '%s | Task Manager',
  },
  description:
    'A comprehensive project management application built with Next.js and NestJS. Manage projects, tasks, users, and collaborate with your team efficiently.',
  keywords: [
    'project management',
    'task management',
    'team collaboration',
    'productivity',
    'project tracking',
    'task manager',
    'team management',
    'collaboration tools',
  ],
  authors: [{ name: 'Task Manager Team' }],
  creator: 'Task Manager',
  publisher: 'Task Manager Corp',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  ),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: 'Task Manager - Project Management Made Simple',
    description:
      'A comprehensive project management application. Manage projects, tasks, users, and collaborate with your team efficiently.',
    siteName: 'Task Manager',
    images: [
      {
        url: '/og-homepage.png',
        width: 1200,
        height: 630,
        alt: 'Task Manager - Project Management Made Simple',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Task Manager - Project Management Made Simple',
    description:
      'A comprehensive project management application. Manage projects, tasks, users, and collaborate with your team efficiently.',
    images: ['/og-homepage.png'],
    creator: '@taskmanager',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
    yandex: process.env.YANDEX_VERIFICATION,
    yahoo: process.env.YAHOO_SITE_VERIFICATION,
  },
  category: 'project management',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.className}>
      <head>
        {/* Preconnect to external domains for faster resource loading */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />

        {/* DNS prefetch for external APIs */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
      </head>
      <body className="bg-background text-foreground antialiased min-h-screen transition-colors duration-300">
        <div className="contents">
          <SpeedInsights />
          <Analytics />
          <ClientLayout>{children}</ClientLayout>
          <ThemeToggle />
        </div>
      </body>
    </html>
  );
}
