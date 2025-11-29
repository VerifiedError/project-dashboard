/**
 * FILE-REF: LIB-026-20251128
 *
 * @file debug.ts
 * @description Server actions for debug log management
 * @category Library
 * @created 2025-11-28
 * @modified 2025-11-28
 *
 * @changelog
 * - 2025-11-28 - Initial debug actions implementation (CHG-009)
 *
 * @dependencies
 * - @prisma/client
 * - LIB-020 (db.ts)
 * - LIB-025 (debug-logger.ts)
 *
 * @see Related files:
 * - DB-001 (schema.prisma)
 * - COMP-084 (DebugModal)
 */

"use server";

import { prisma } from "@/lib/utils/db";
import type { DebugLog, LogLevel, LogCategory } from "@/lib/utils/debug-logger";
import { LogLevel as PrismaLogLevel, LogCategory as PrismaLogCategory } from "@prisma/client";

// Map TypeScript enums to Prisma enums
const logLevelMap: Record<LogLevel, PrismaLogLevel> = {
  debug: "DEBUG",
  info: "INFO",
  warn: "WARN",
  error: "ERROR",
  critical: "CRITICAL",
};

const logCategoryMap: Record<LogCategory, PrismaLogCategory> = {
  encryption: "ENCRYPTION",
  "api-key": "API_KEY",
  database: "DATABASE",
  "api-integration": "API_INTEGRATION",
  auth: "AUTH",
  validation: "VALIDATION",
  system: "SYSTEM",
  ui: "UI",
};

interface SaveDebugLogResult {
  success: boolean;
  refId?: string;
  error?: string;
}

/**
 * Saves a debug log to the database
 */
export async function saveDebugLog(log: DebugLog): Promise<SaveDebugLogResult> {
  try {
    const prismaLog = await prisma.debugLog.create({
      data: {
        refId: log.refId,
        timestamp: log.timestamp,
        level: logLevelMap[log.level],
        category: logCategoryMap[log.category],
        message: log.message,
        details: log.details as object,
        stack: log.stack,
        userId: log.userId,
        component: log.context?.component,
        action: log.context?.action,
        file: log.context?.file,
        line: log.context?.line,
      },
    });

    return {
      success: true,
      refId: prismaLog.refId,
    };
  } catch (error) {
    console.error("Failed to save debug log:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

interface GetDebugLogResult {
  success: boolean;
  log?: {
    id: string;
    refId: string;
    timestamp: Date;
    level: string;
    category: string;
    message: string;
    details?: Record<string, unknown>;
    stack?: string;
    userId?: string;
    component?: string;
    action?: string;
    file?: string;
    line?: number;
    resolved: boolean;
    resolvedAt?: Date;
    resolvedBy?: string;
  };
  error?: string;
}

/**
 * Retrieves a debug log by reference ID
 */
export async function getDebugLog(refId: string): Promise<GetDebugLogResult> {
  try {
    const log = await prisma.debugLog.findUnique({
      where: { refId },
    });

    if (!log) {
      return {
        success: false,
        error: `Debug log not found: ${refId}`,
      };
    }

    return {
      success: true,
      log: {
        id: log.id,
        refId: log.refId,
        timestamp: log.timestamp,
        level: log.level,
        category: log.category,
        message: log.message,
        details: log.details as Record<string, unknown>,
        stack: log.stack ?? undefined,
        userId: log.userId ?? undefined,
        component: log.component ?? undefined,
        action: log.action ?? undefined,
        file: log.file ?? undefined,
        line: log.line ?? undefined,
        resolved: log.resolved,
        resolvedAt: log.resolvedAt ?? undefined,
        resolvedBy: log.resolvedBy ?? undefined,
      },
    };
  } catch (error) {
    console.error("Failed to retrieve debug log:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

interface ListDebugLogsOptions {
  level?: PrismaLogLevel;
  category?: PrismaLogCategory;
  userId?: string;
  resolved?: boolean;
  limit?: number;
  offset?: number;
}

interface ListDebugLogsResult {
  success: boolean;
  logs?: Array<{
    id: string;
    refId: string;
    timestamp: Date;
    level: string;
    category: string;
    message: string;
    userId?: string;
    component?: string;
    resolved: boolean;
  }>;
  total?: number;
  error?: string;
}

/**
 * Lists debug logs with filtering and pagination
 */
export async function listDebugLogs(
  options: ListDebugLogsOptions = {}
): Promise<ListDebugLogsResult> {
  try {
    const {
      level,
      category,
      userId,
      resolved,
      limit = 50,
      offset = 0,
    } = options;

    const where = {
      ...(level && { level }),
      ...(category && { category }),
      ...(userId && { userId }),
      ...(resolved !== undefined && { resolved }),
    };

    const [logs, total] = await Promise.all([
      prisma.debugLog.findMany({
        where,
        orderBy: { timestamp: "desc" },
        take: limit,
        skip: offset,
        select: {
          id: true,
          refId: true,
          timestamp: true,
          level: true,
          category: true,
          message: true,
          userId: true,
          component: true,
          resolved: true,
        },
      }),
      prisma.debugLog.count({ where }),
    ]);

    return {
      success: true,
      logs: logs.map((log) => ({
        id: log.id,
        refId: log.refId,
        timestamp: log.timestamp,
        level: log.level,
        category: log.category,
        message: log.message,
        userId: log.userId ?? undefined,
        component: log.component ?? undefined,
        resolved: log.resolved,
      })),
      total,
    };
  } catch (error) {
    console.error("Failed to list debug logs:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

interface MarkResolvedResult {
  success: boolean;
  error?: string;
}

/**
 * Marks a debug log as resolved
 */
export async function markDebugLogResolved(
  refId: string,
  resolvedBy: string
): Promise<MarkResolvedResult> {
  try {
    await prisma.debugLog.update({
      where: { refId },
      data: {
        resolved: true,
        resolvedAt: new Date(),
        resolvedBy,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Failed to mark debug log as resolved:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

interface DeleteOldLogsResult {
  success: boolean;
  deleted?: number;
  error?: string;
}

/**
 * Deletes debug logs older than specified days (for cleanup)
 */
export async function deleteOldDebugLogs(
  daysOld: number = 30
): Promise<DeleteOldLogsResult> {
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    const result = await prisma.debugLog.deleteMany({
      where: {
        timestamp: {
          lt: cutoffDate,
        },
        resolved: true, // Only delete resolved logs
      },
    });

    return {
      success: true,
      deleted: result.count,
    };
  } catch (error) {
    console.error("Failed to delete old debug logs:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

interface GetDebugStatsResult {
  success: boolean;
  stats?: {
    total: number;
    byLevel: Record<string, number>;
    byCategory: Record<string, number>;
    unresolved: number;
    last24Hours: number;
  };
  error?: string;
}

/**
 * Gets statistics about debug logs
 */
export async function getDebugLogStats(): Promise<GetDebugStatsResult> {
  try {
    const [
      total,
      byLevel,
      byCategory,
      unresolved,
      last24Hours,
    ] = await Promise.all([
      prisma.debugLog.count(),
      prisma.debugLog.groupBy({
        by: ["level"],
        _count: true,
      }),
      prisma.debugLog.groupBy({
        by: ["category"],
        _count: true,
      }),
      prisma.debugLog.count({
        where: { resolved: false },
      }),
      prisma.debugLog.count({
        where: {
          timestamp: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
          },
        },
      }),
    ]);

    const byLevelMap: Record<string, number> = {};
    byLevel.forEach((item) => {
      byLevelMap[item.level] = item._count;
    });

    const byCategoryMap: Record<string, number> = {};
    byCategory.forEach((item) => {
      byCategoryMap[item.category] = item._count;
    });

    return {
      success: true,
      stats: {
        total,
        byLevel: byLevelMap,
        byCategory: byCategoryMap,
        unresolved,
        last24Hours,
      },
    };
  } catch (error) {
    console.error("Failed to get debug log stats:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
