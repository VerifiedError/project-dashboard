/**
 * FILE-REF: LIB-024-20251128
 *
 * @file constants.ts
 * @description Application constants and configuration values
 * @category Library
 * @created 2025-11-28
 * @modified 2025-11-28
 *
 * @changelog
 * - 2025-11-28 - Initial constants setup (CHG-002)
 */

export const APP_NAME = "DevOps Resource Dashboard";
export const APP_DESCRIPTION = "Centralized dashboard for development resources";

// Changelog reference number format
export const CHANGELOG_REF_PREFIX = "CHG-";

// File reference categories
export const FILE_REF_CATEGORIES = {
  COMPONENT: "COMP",
  PAGE: "PAGE",
  API: "API",
  LIBRARY: "LIB",
  HOOK: "HOOK",
  TYPE: "TYPE",
  STYLE: "STYLE",
  CONFIG: "CONFIG",
  DATABASE: "DB",
} as const;

// Sync intervals (in milliseconds)
export const SYNC_INTERVALS = {
  NGROK: 30000, // 30 seconds
  VERCEL: 60000, // 1 minute
  NEON: 300000, // 5 minutes
  UPSTASH: 300000, // 5 minutes
} as const;

// Status display colors
export const STATUS_COLORS = {
  ACTIVE: "success",
  INACTIVE: "warning",
  ERROR: "error",
  READY: "success",
  BUILDING: "info",
  QUEUED: "warning",
  SUSPENDED: "warning",
} as const;
