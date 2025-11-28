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
 * @param userId - User ID (required)
 */
export async function saveApiKey(
  service: ServiceType,
  keyValue: string,
  userId: string
): Promise<ApiKeyResult> {
  try {
    if (!keyValue || keyValue.trim().length === 0) {
      return {
        success: false,
        error: "API key cannot be empty",
      };
    }

    if (!userId) {
      return {
        success: false,
        error: "User ID is required",
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
 * @param userId - User ID (required)
 */
export async function getApiKey(
  service: ServiceType,
  userId: string
): Promise<{ success: boolean; keyValue?: string; error?: string }> {
  try {
    if (!userId) {
      return {
        success: false,
        error: "User ID is required",
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
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to get API key",
    };
  }
}

/**
 * Get all API keys for a user (without decrypted values)
 * @param userId - User ID (required)
 */
export async function getApiKeys(userId: string): Promise<ApiKeysListResult> {
  try {
    if (!userId) {
      return {
        success: false,
        error: "User ID is required",
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
 * @param userId - Optional user ID (for future multi-user support)
 */
export async function deleteApiKey(
  service: ServiceType,
  userId?: string
): Promise<ApiKeyResult> {
  try {
    await prisma.apiKey.delete({
      where: {
        userId_service: {
          userId: userId || null,
          service,
        },
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
 * @param userId - Optional user ID (for future multi-user support)
 */
export async function hasApiKey(
  service: ServiceType,
  userId?: string
): Promise<boolean> {
  try {
    const count = await prisma.apiKey.count({
      where: {
        userId: userId || null,
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
