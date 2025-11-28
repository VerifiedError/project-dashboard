/**
 * FILE-REF: LIB-012-20251128
 *
 * @file changelog.ts
 * @description Server actions for changelog management and auto-tracking
 * @category Library
 * @created 2025-11-28
 * @modified 2025-11-28
 *
 * @changelog
 * - 2025-11-28 - Initial changelog actions setup (CHG-002)
 *
 * @dependencies
 * - @prisma/client
 * - lib/utils/db
 * - lib/utils/constants
 *
 * @see Related files:
 * - DB-001 (schema.prisma)
 * - LIB-020 (db.ts)
 */

"use server";

import { prisma } from "@/lib/utils/db";
import { CHANGELOG_REF_PREFIX } from "@/lib/utils/constants";
import { ChangeCategory, ChangeSeverity } from "@prisma/client";

interface CreateChangelogParams {
  title: string;
  description: string;
  category: ChangeCategory;
  severity?: ChangeSeverity;
  fileChanges?: Array<{ ref: string; path: string }>;
  projectId?: string;
  author?: string;
}

/**
 * Generate next changelog reference number
 */
async function getNextChangelogRef(): Promise<string> {
  const lastEntry = await prisma.changelogEntry.findFirst({
    orderBy: { createdAt: "desc" },
    select: { refNumber: true },
  });

  if (!lastEntry) {
    return `${CHANGELOG_REF_PREFIX}001`;
  }

  // Extract number from last ref (e.g., "CHG-001" -> 1)
  const lastNumber = parseInt(lastEntry.refNumber.replace(CHANGELOG_REF_PREFIX, ""), 10);
  const nextNumber = lastNumber + 1;

  // Pad with zeros (e.g., 1 -> "001")
  return `${CHANGELOG_REF_PREFIX}${nextNumber.toString().padStart(3, "0")}`;
}

/**
 * Create a new changelog entry
 */
export async function createChangelogEntry(params: CreateChangelogParams) {
  try {
    const refNumber = await getNextChangelogRef();

    const entry = await prisma.changelogEntry.create({
      data: {
        refNumber,
        title: params.title,
        description: params.description,
        category: params.category,
        severity: params.severity || ChangeSeverity.MINOR,
        fileChanges: params.fileChanges || [],
        projectId: params.projectId,
        author: params.author || "System",
      },
    });

    return { success: true, entry };
  } catch (error) {
    console.error("Failed to create changelog entry:", error);
    return { success: false, error: "Failed to create changelog entry" };
  }
}

/**
 * Get all changelog entries with optional filters
 */
export async function getChangelogEntries(filters?: {
  category?: ChangeCategory;
  severity?: ChangeSeverity;
  projectId?: string;
  limit?: number;
  offset?: number;
}) {
  try {
    const where: any = {};

    if (filters?.category) where.category = filters.category;
    if (filters?.severity) where.severity = filters.severity;
    if (filters?.projectId) where.projectId = filters.projectId;

    const entries = await prisma.changelogEntry.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: filters?.limit || 50,
      skip: filters?.offset || 0,
      include: {
        project: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    const total = await prisma.changelogEntry.count({ where });

    return { success: true, entries, total };
  } catch (error) {
    console.error("Failed to fetch changelog entries:", error);
    return { success: false, error: "Failed to fetch changelog entries" };
  }
}

/**
 * Get a single changelog entry by reference number
 */
export async function getChangelogByRef(refNumber: string) {
  try {
    const entry = await prisma.changelogEntry.findUnique({
      where: { refNumber },
      include: {
        project: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return { success: true, entry };
  } catch (error) {
    console.error("Failed to fetch changelog entry:", error);
    return { success: false, error: "Failed to fetch changelog entry" };
  }
}

/**
 * Helper function to log system changes automatically
 * This will be called whenever a significant change occurs
 */
export async function logSystemChange(
  title: string,
  description: string,
  category: ChangeCategory,
  fileRefs?: string[]
) {
  const fileChanges = fileRefs?.map((ref) => ({
    ref,
    path: `File ${ref}`,
  }));

  return createChangelogEntry({
    title,
    description,
    category,
    severity: ChangeSeverity.MINOR,
    fileChanges,
    author: "System",
  });
}
