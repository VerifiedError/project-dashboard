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
 * - 2025-11-28 - Added Header and Toaster components (CHG-004)
 *
 * @dependencies
 * - next
 * - Inter font from next/font/google
 * - COMP-060 (Header.tsx)
 * - COMP-008 (Toaster.tsx)
 *
 * @see Related files:
 * - STYLE-001 (globals.css)
 * - COMP-060 (Header.tsx)
 * - COMP-008 (Toaster.tsx)
 */

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Toaster } from "@/components/ui/toaster";

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
        <div className="relative flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">{children}</main>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
