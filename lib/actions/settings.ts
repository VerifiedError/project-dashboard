/**
 * FILE-REF: LIB-013-20251128
 *
 * @file settings.ts
 * @description Server actions for system settings management
 * @category Library
 * @created 2025-11-28
 * @modified 2025-11-28
 *
 * @changelog
 * - 2025-11-28 - Added timezone setting actions (CHG-010)
 * - 2025-11-28 - Initial settings actions (CHG-006)
 *
 * @dependencies
 * - @prisma/client
 * - LIB-020 (db.ts)
 * - LIB-027 (timezone.ts)
 *
 * @see Related files:
 * - PAGE-012 (settings page)
 * - DB-001 (schema.prisma)
 */

"use server";

import { prisma } from "@/lib/utils/db";
import { DEFAULT_TIMEZONE, type TimezoneValue } from "@/lib/utils/timezone";

// Setting keys
const SETTING_KEYS = {
  TIMEZONE: "user_timezone",
} as const;

/**
 * Get a system setting by key
 */
export async function getSetting(key: string): Promise<{
  success: boolean;
  value?: string;
  error?: string;
}> {
  try {
    const setting = await prisma.systemSetting.findUnique({
      where: { key },
    });

    return {
      success: true,
      value: setting?.value,
    };
  } catch (error) {
    console.error("Failed to get setting:", error);
    return {
      success: false,
      error: "Failed to get setting",
    };
  }
}

/**
 * Set a system setting
 */
export async function setSetting(
  key: string,
  value: string,
  description?: string
): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    await prisma.systemSetting.upsert({
      where: { key },
      update: { value, description },
      create: { key, value, description },
    });

    return {
      success: true,
    };
  } catch (error) {
    console.error("Failed to set setting:", error);
    return {
      success: false,
      error: "Failed to save setting",
    };
  }
}

/**
 * Get user's timezone preference
 */
export async function getTimezone(): Promise<{
  success: boolean;
  timezone?: TimezoneValue;
  error?: string;
}> {
  try {
    const result = await getSetting(SETTING_KEYS.TIMEZONE);

    if (result.success && result.value) {
      return {
        success: true,
        timezone: result.value as TimezoneValue,
      };
    }

    // Return default if not set
    return {
      success: true,
      timezone: DEFAULT_TIMEZONE,
    };
  } catch (error) {
    console.error("Failed to get timezone:", error);
    return {
      success: false,
      error: "Failed to get timezone preference",
    };
  }
}

/**
 * Set user's timezone preference
 */
export async function setTimezone(
  timezone: TimezoneValue
): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const result = await setSetting(
      SETTING_KEYS.TIMEZONE,
      timezone,
      "User's preferred timezone for displaying dates and times"
    );

    return result;
  } catch (error) {
    console.error("Failed to set timezone:", error);
    return {
      success: false,
      error: "Failed to save timezone preference",
    };
  }
}

/**
 * Get all system settings
 */
export async function getAllSettings(): Promise<{
  success: boolean;
  settings?: Array<{
    key: string;
    value: string;
    description: string | null;
    updatedAt: Date;
  }>;
  error?: string;
}> {
  try {
    const settings = await prisma.systemSetting.findMany({
      orderBy: { key: "asc" },
    });

    return {
      success: true,
      settings,
    };
  } catch (error) {
    console.error("Failed to get settings:", error);
    return {
      success: false,
      error: "Failed to load settings",
    };
  }
}

/**
 * Initialize default settings if they don't exist
 */
export async function initializeDefaultSettings(): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    // Set default timezone if not exists
    const timezone = await getSetting(SETTING_KEYS.TIMEZONE);
    if (!timezone.value) {
      await setTimezone(DEFAULT_TIMEZONE);
    }

    return {
      success: true,
    };
  } catch (error) {
    console.error("Failed to initialize default settings:", error);
    return {
      success: false,
      error: "Failed to initialize settings",
    };
  }
}
