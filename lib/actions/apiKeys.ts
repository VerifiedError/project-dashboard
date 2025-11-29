/**
 * FILE-REF: LIB-014-20251128
 *
 * @file apiKeys.ts
 * @description Server actions for API key management
 * @category Library
 * @created 2025-11-28
 * @modified 2025-11-28
 *
 * @changelog
 * - 2025-11-28 - Initial API key management actions (CHG-008)
 *
 * @dependencies
 * - @prisma/client
 * - lib/utils/db
 * - lib/utils/encryption
 *
 * @see Related files:
 * - DB-001 (schema.prisma)
 * - LIB-020 (db.ts)
 * - LIB-021 (encryption.ts)
 */

"use server";

import { prisma } from "@/lib/utils/db";
import { encrypt, decrypt } from "@/lib/utils/encryption";
import { ServiceType } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { debugLogger } from "@/lib/utils/debug-logger";
import { getCurrentUserId } from "@/lib/utils/session";

export interface ApiKeyResult {
  success: boolean;
  error?: string;
}

export interface ApiKeysListResult {
  success: boolean;
  keys?: Array<{
    service: ServiceType;
    isActive: boolean;
    lastUsedAt: Date | null;
    createdAt: Date;
  }>;
  error?: string;
}

/**
 * Save or update an API key for a service
 * @param service - The service type (NGROK, VERCEL, NEON, UPSTASH)
 * @param keyValue - The API key value (will be encrypted)
 */
export async function saveApiKey(
  service: ServiceType,
  keyValue: string
): Promise<ApiKeyResult> {
  try {
    const userId = await getCurrentUserId();

    if (!userId) {
      return {
        success: false,
        error: "You must be logged in to save API keys",
      };
    }

    if (!keyValue || keyValue.trim().length === 0) {
      return {
        success: false,
        error: "API key cannot be empty",
      };
    }

    // Encrypt the API key
    const encryptedKey = encrypt(keyValue.trim());

    // Check if API key already exists
    const existingKey = await prisma.apiKey.findFirst({
      where: {
        userId,
        service,
      },
    });

    if (existingKey) {
      // Update existing key
      await prisma.apiKey.update({
        where: { id: existingKey.id },
        data: {
          keyValue: encryptedKey,
          isActive: true,
          updatedAt: new Date(),
        },
      });
    } else {
      // Create new key
      await prisma.apiKey.create({
        data: {
          userId,
          service,
          keyValue: encryptedKey,
          isActive: true,
        },
      });
    }

    // Revalidate pages that might show API key status
    revalidatePath("/settings");
    revalidatePath("/resources");

    return { success: true };
  } catch (error) {
    console.error("Failed to save API key:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to save API key",
    };
  }
}

/**
 * Get an API key for a service (decrypted)
 * @param service - The service type
 */
export async function getApiKey(
  service: ServiceType
): Promise<{ success: boolean; keyValue?: string; error?: string; debugRefId?: string }> {
  try {
    const userId = await getCurrentUserId();

    if (!userId) {
      return {
        success: false,
        error: "You must be logged in to view API keys",
      };
    }

    const apiKey = await prisma.apiKey.findFirst({
      where: {
        userId,
        service,
      },
    });

    if (!apiKey) {
      return {
        success: false,
        error: "API key not found",
      };
    }

    // Decrypt the API key
    const decryptedKey = decrypt(apiKey.keyValue);

    // Update last used timestamp
    await prisma.apiKey.update({
      where: { id: apiKey.id },
      data: { lastUsedAt: new Date() },
    });

    return {
      success: true,
      keyValue: decryptedKey,
    };
  } catch (error) {
    console.error("Failed to get API key:", error);

    // Log this error with comprehensive context
    const debugLog = await debugLogger.error("api-key", "Failed to get/decrypt API key", {
      error: error instanceof Error ? error : new Error(String(error)),
      details: {
        service,
        userId,
        hasEncryptionKey: !!process.env.ENCRYPTION_KEY,
        errorType: error instanceof Error ? error.name : typeof error,
        errorMessage: error instanceof Error ? error.message : String(error),
      },
      context: {
        component: "ApiKeyDialog",
        action: "getApiKey (View Key button)",
        file: "lib/actions/apiKeys.ts",
      },
    }).catch((logError) => {
      console.error("Failed to log debug error:", logError);
      return null;
    });

    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to get API key",
      debugRefId: debugLog?.refId,
    };
  }
}

/**
 * Get all API keys for the current user (without decrypted values)
 */
export async function getApiKeys(): Promise<ApiKeysListResult> {
  try {
    const userId = await getCurrentUserId();

    if (!userId) {
      return {
        success: false,
        error: "You must be logged in to view API keys",
      };
    }

    const keys = await prisma.apiKey.findMany({
      where: {
        userId,
      },
      select: {
        service: true,
        isActive: true,
        lastUsedAt: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return {
      success: true,
      keys,
    };
  } catch (error) {
    console.error("Failed to get API keys:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to get API keys",
    };
  }
}

/**
 * Delete an API key for a service
 * @param service - The service type
 */
export async function deleteApiKey(
  service: ServiceType
): Promise<ApiKeyResult> {
  try {
    const userId = await getCurrentUserId();

    if (!userId) {
      return {
        success: false,
        error: "You must be logged in to delete API keys",
      };
    }

    const existingKey = await prisma.apiKey.findFirst({
      where: {
        userId,
        service,
      },
    });

    if (!existingKey) {
      return {
        success: false,
        error: "API key not found",
      };
    }

    await prisma.apiKey.delete({
      where: {
        id: existingKey.id,
      },
    });

    // Revalidate pages
    revalidatePath("/settings");
    revalidatePath("/resources");

    return { success: true };
  } catch (error) {
    console.error("Failed to delete API key:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete API key",
    };
  }
}

/**
 * Test if an API key is configured for a service
 * @param service - The service type
 */
export async function hasApiKey(
  service: ServiceType
): Promise<boolean> {
  try {
    const userId = await getCurrentUserId();

    if (!userId) {
      return false;
    }

    const count = await prisma.apiKey.count({
      where: {
        userId,
        service,
        isActive: true,
      },
    });

    return count > 0;
  } catch (error) {
    console.error("Failed to check API key:", error);
    return false;
  }
}
