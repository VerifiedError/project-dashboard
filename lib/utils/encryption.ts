/**
 * FILE-REF: LIB-021-20251128
 *
 * @file encryption.ts
 * @description Encryption/decryption utilities for sensitive data
 * @category Library
 * @created 2025-11-28
 * @modified 2025-11-28
 *
 * @changelog
 * - 2025-11-28 - Initial encryption utilities (CHG-008)
 *
 * @dependencies
 * - crypto (Node.js built-in)
 *
 * @see Related files:
 * - LIB-014 (apiKeys.ts)
 */

import crypto from "crypto";

// Algorithm for encryption
const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 16; // For AES, this is always 16
const AUTH_TAG_LENGTH = 16;

/**
 * Get encryption key from environment variable
 * If not set, generates a temporary one (NOT recommended for production)
 */
function getEncryptionKey(): Buffer {
  const key = process.env.ENCRYPTION_KEY;

  if (!key) {
    console.warn(
      "WARNING: ENCRYPTION_KEY not set in environment. Using temporary key. " +
      "Generate one with: openssl rand -hex 32"
    );
    // Generate a temporary key (will be different each time server restarts)
    return crypto.randomBytes(32);
  }

  // Convert hex string to buffer
  return Buffer.from(key, "hex");
}

/**
 * Encrypt a string value
 * @param text - The plain text to encrypt
 * @returns The encrypted text in format: iv:authTag:encryptedData (all hex)
 */
export function encrypt(text: string): string {
  try {
    const key = getEncryptionKey();
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");

    const authTag = cipher.getAuthTag();

    // Return as: iv:authTag:encryptedData
    return `${iv.toString("hex")}:${authTag.toString("hex")}:${encrypted}`;
  } catch (error) {
    console.error("Encryption failed:", error);
    throw new Error("Failed to encrypt data");
  }
}

/**
 * Decrypt an encrypted string
 * @param encryptedText - The encrypted text in format: iv:authTag:encryptedData
 * @returns The decrypted plain text
 */
export function decrypt(encryptedText: string): string {
  try {
    const key = getEncryptionKey();
    const parts = encryptedText.split(":");

    if (parts.length !== 3) {
      throw new Error("Invalid encrypted data format");
    }

    const iv = Buffer.from(parts[0], "hex");
    const authTag = Buffer.from(parts[1], "hex");
    const encrypted = parts[2];

    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
  } catch (error) {
    console.error("Decryption failed:", error);
    throw new Error("Failed to decrypt data");
  }
}

/**
 * Hash a value using SHA-256 (one-way)
 * Useful for storing non-reversible data like passwords
 * @param text - The text to hash
 * @returns The hashed value (hex string)
 */
export function hash(text: string): string {
  return crypto.createHash("sha256").update(text).digest("hex");
}

/**
 * Generate a random encryption key (for initial setup)
 * @returns A 32-byte key as hex string
 */
export function generateEncryptionKey(): string {
  return crypto.randomBytes(32).toString("hex");
}
