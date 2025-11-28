/**
 * FILE-REF: PAGE-000-20251128
 *
 * @file layout.tsx
 * @description Root layout component for the entire application
 * @category Page
 * @created 2025-11-28
 * @modified 2025-11-28
 *
 * @changelog
 * - 2025-11-28 - Initial root layout with metadata (CHG-001)
 *
 * @dependencies
 * - next
 * - Inter font from next/font/google
 *
 * @see Related files:
 * - STYLE-001 (globals.css)
 */

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DevOps Resource Dashboard",
  description: "Centralized dashboard to track and manage all development resources",
  keywords: ["ngrok", "vercel", "neon", "upstash", "dashboard", "devops"],
  authors: [{ name: "DevOps Dashboard" }],
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
