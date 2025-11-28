/**
 * FILE-REF: LIB-025-20251128
 *
 * @file version.ts
 * @description Version management utilities
 * @category Library
 * @created 2025-11-28
 * @modified 2025-11-28
 *
 * @changelog
 * - 2025-11-28 - Initial version utilities (CHG-009)
 *
 * @dependencies
 * - package.json
 *
 * @see Related files:
 * - COMP-083 (VersionBadge.tsx)
 */

import packageJson from "@/package.json";

/**
 * Get current application version from package.json
 * @returns Version string (e.g., "0.2.0")
 */
export async function getVersion(): Promise<string> {
  return packageJson.version;
}

/**
 * Get version from database (system setting)
 */
export async function getVersionFromDB(): Promise<string> {
  // This will be implemented when we add database connection to version
  // For now, use package.json as source of truth
  return packageJson.version;
}
