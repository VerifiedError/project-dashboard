/**
 * FILE-REF: LIB-027-20251128
 *
 * @file timezone.ts
 * @description Timezone formatting utilities for user-specific timezone display
 * @category Library
 * @created 2025-11-28
 * @modified 2025-11-28
 *
 * @changelog
 * - 2025-11-28 - Initial timezone utility (CHG-010)
 *
 * @dependencies
 * - None (uses native Intl API)
 *
 * @see Related files:
 * - LIB-013 (settings.ts)
 * - COMP-050 (ChangelogEntry.tsx)
 */

/**
 * Common US timezones
 */
export const TIMEZONES = [
  { value: "America/New_York", label: "Eastern Time (ET)" },
  { value: "America/Chicago", label: "Central Time (CT)" },
  { value: "America/Denver", label: "Mountain Time (MT)" },
  { value: "America/Los_Angeles", label: "Pacific Time (PT)" },
  { value: "America/Anchorage", label: "Alaska Time (AKT)" },
  { value: "Pacific/Honolulu", label: "Hawaii Time (HT)" },
  { value: "UTC", label: "UTC (Coordinated Universal Time)" },
] as const;

export type TimezoneValue = typeof TIMEZONES[number]["value"];

/**
 * Default timezone (Central Time - Sioux Falls, SD)
 */
export const DEFAULT_TIMEZONE: TimezoneValue = "America/Chicago";

/**
 * Format a date according to the user's timezone preference
 */
export function formatDateInTimezone(
  date: Date | string,
  timezone: TimezoneValue = DEFAULT_TIMEZONE,
  options?: {
    dateStyle?: "full" | "long" | "medium" | "short";
    timeStyle?: "full" | "long" | "medium" | "short";
    includeTime?: boolean;
    includeSeconds?: boolean;
  }
): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;

  const {
    dateStyle,
    timeStyle,
    includeTime = true,
    includeSeconds = false,
  } = options || {};

  // If styles are provided, use them
  if (dateStyle || timeStyle) {
    return new Intl.DateTimeFormat("en-US", {
      dateStyle,
      timeStyle,
      timeZone: timezone,
    }).format(dateObj);
  }

  // Default format: "Nov 28, 2025 at 7:20 PM" or "Nov 28, 2025 at 7:20:45 PM"
  const dateOptions: Intl.DateTimeFormatOptions = {
    timeZone: timezone,
    year: "numeric",
    month: "short",
    day: "numeric",
  };

  const timeOptions: Intl.DateTimeFormatOptions = {
    timeZone: timezone,
    hour: "numeric",
    minute: "2-digit",
    ...(includeSeconds && { second: "2-digit" }),
    hour12: true,
  };

  const formattedDate = new Intl.DateTimeFormat("en-US", dateOptions).format(
    dateObj
  );
  const formattedTime = new Intl.DateTimeFormat("en-US", timeOptions).format(
    dateObj
  );

  return includeTime ? `${formattedDate} at ${formattedTime}` : formattedDate;
}

/**
 * Format a date as a relative time string (e.g., "2 hours ago", "3 days ago")
 */
export function formatRelativeTime(
  date: Date | string,
  timezone: TimezoneValue = DEFAULT_TIMEZONE
): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  const now = new Date();

  // Get the date in the user's timezone
  const dateInTz = new Date(
    dateObj.toLocaleString("en-US", { timeZone: timezone })
  );
  const nowInTz = new Date(now.toLocaleString("en-US", { timeZone: timezone }));

  const diffMs = nowInTz.getTime() - dateInTz.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);

  if (diffSeconds < 60) {
    return "just now";
  } else if (diffMinutes < 60) {
    return `${diffMinutes} ${diffMinutes === 1 ? "minute" : "minutes"} ago`;
  } else if (diffHours < 24) {
    return `${diffHours} ${diffHours === 1 ? "hour" : "hours"} ago`;
  } else if (diffDays < 7) {
    return `${diffDays} ${diffDays === 1 ? "day" : "days"} ago`;
  } else if (diffWeeks < 4) {
    return `${diffWeeks} ${diffWeeks === 1 ? "week" : "weeks"} ago`;
  } else if (diffMonths < 12) {
    return `${diffMonths} ${diffMonths === 1 ? "month" : "months"} ago`;
  } else {
    return `${diffYears} ${diffYears === 1 ? "year" : "years"} ago`;
  }
}

/**
 * Get the short timezone abbreviation (e.g., "CST", "EST")
 */
export function getTimezoneAbbreviation(
  timezone: TimezoneValue = DEFAULT_TIMEZONE,
  date: Date = new Date()
): string {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    timeZoneName: "short",
  });

  const parts = formatter.formatToParts(date);
  const timeZonePart = parts.find((part) => part.type === "timeZoneName");

  return timeZonePart?.value || timezone;
}

/**
 * Format a date for display in changelog entries
 */
export function formatChangelogDate(
  date: Date | string,
  timezone: TimezoneValue = DEFAULT_TIMEZONE
): {
  full: string;
  relative: string;
  timezone: string;
} {
  return {
    full: formatDateInTimezone(date, timezone, {
      includeTime: true,
      includeSeconds: false,
    }),
    relative: formatRelativeTime(date, timezone),
    timezone: getTimezoneAbbreviation(timezone),
  };
}
