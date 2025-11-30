/**
 * FILE-REF: COMP-098-20251129
 *
 * @file RelativeTime.tsx
 * @description Client-side relative time component to prevent hydration mismatches
 * @category Component
 * @created 2025-11-29
 * @modified 2025-11-29
 *
 * @changelog
 * - 2025-11-29 - Created to fix React hydration error #418
 *
 * @dependencies
 * - None
 *
 * @see Related files:
 * - PAGE-008 (Vercel list page)
 */

"use client";

import { useEffect, useState } from "react";

interface RelativeTimeProps {
  date: Date | null;
  prefix?: string;
}

/**
 * Format timestamp to relative time (client-side only to avoid hydration mismatch)
 */
function formatRelativeTime(date: Date | null): string {
  if (!date) return "Never";

  const now = new Date();
  const diff = now.getTime() - new Date(date).getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return `${seconds}s ago`;
}

export function RelativeTime({ date, prefix = "" }: RelativeTimeProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Show static text during SSR to match initial HTML
    return <span className="text-sm text-muted-foreground">{prefix}Loading...</span>;
  }

  return (
    <span className="text-sm text-muted-foreground">
      {prefix}{formatRelativeTime(date)}
    </span>
  );
}
