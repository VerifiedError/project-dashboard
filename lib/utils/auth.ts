/**
 * FILE-REF: LIB-022-20251128
 *
 * @file auth.ts
 * @description Authentication utilities for password hashing and verification
 * @category Library
 * @created 2025-11-28
 * @modified 2025-11-28
 *
 * @changelog
 * - 2025-11-28 - Initial authentication utilities (CHG-009)
 *
 * @dependencies
 * - crypto (Node.js built-in)
 *
 * @see Related files:
 * - LIB-021 (encryption.ts)
 */

import crypto from "crypto";

/**
 * Hash a password using PBKDF2
 * @param password - Plain text password
 * @returns Hashed password in format: salt:hash
 */
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto
    .pbkdf2Sync(password, salt, 100000, 64, "sha512")
    .toString("hex");

  return `${salt}:${hash}`;
}

/**
 * Verify a password against a hash
 * @param password - Plain text password to verify
 * @param hashedPassword - Hashed password in format: salt:hash
 * @returns True if password matches
 */
export function verifyPassword(password: string, hashedPassword: string): boolean {
  try {
    const [salt, hash] = hashedPassword.split(":");
    const verifyHash = crypto
      .pbkdf2Sync(password, salt, 100000, 64, "sha512")
      .toString("hex");

    return hash === verifyHash;
  } catch (error) {
    console.error("Password verification failed:", error);
    return false;
  }
}

/**
 * Generate a random password
 * @param length - Length of password (default 16)
 * @returns Random password string
 */
export function generatePassword(length: number = 16): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
  let password = "";

  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return password;
}
