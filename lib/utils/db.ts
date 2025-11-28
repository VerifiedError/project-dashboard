/**
 * FILE-REF: LIB-020-20251128
 *
 * @file db.ts
 * @description Prisma client singleton for database connections
 * @category Library
 * @created 2025-11-28
 * @modified 2025-11-28
 *
 * @changelog
 * - 2025-11-28 - Initial Prisma client setup (CHG-002)
 *
 * @dependencies
 * - @prisma/client
 *
 * @see Related files:
 * - DB-001 (schema.prisma)
 */

import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
