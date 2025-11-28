/**
 * FILE-REF: LIB-010-20251128
 *
 * @file projects.ts
 * @description Server actions for project CRUD operations
 * @category Library
 * @created 2025-11-28
 * @modified 2025-11-28
 *
 * @changelog
 * - 2025-11-28 - Initial project server actions (CHG-005)
 *
 * @dependencies
 * - @prisma/client
 * - LIB-020 (db.ts)
 * - LIB-023 (validation.ts)
 *
 * @see Related files:
 * - DB-001 (schema.prisma)
 * - LIB-020 (db.ts)
 */

"use server";

import { prisma } from "@/lib/utils/db";
import {
  createProjectSchema,
  updateProjectSchema,
  deleteProjectSchema,
  type CreateProjectInput,
  type UpdateProjectInput,
} from "@/lib/utils/validation";
import { revalidatePath } from "next/cache";

/**
 * Get all projects
 */
export async function getProjects() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        _count: {
          select: {
            ngrokTunnels: true,
            vercelProjects: true,
            neonDatabases: true,
            upstashDatabases: true,
          },
        },
      },
    });

    return {
      success: true,
      projects,
    };
  } catch (error) {
    console.error("Error fetching projects:", error);
    return {
      success: false,
      error: "Failed to fetch projects",
    };
  }
}

/**
 * Get a single project by ID
 */
export async function getProject(id: string) {
  try {
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        ngrokTunnels: {
          orderBy: { createdAt: "desc" },
        },
        vercelProjects: {
          orderBy: { createdAt: "desc" },
        },
        neonDatabases: {
          orderBy: { createdAt: "desc" },
        },
        upstashDatabases: {
          orderBy: { createdAt: "desc" },
        },
        changelog: {
          orderBy: { createdAt: "desc" },
          take: 10,
        },
      },
    });

    if (!project) {
      return {
        success: false,
        error: "Project not found",
      };
    }

    return {
      success: true,
      project,
    };
  } catch (error) {
    console.error("Error fetching project:", error);
    return {
      success: false,
      error: "Failed to fetch project",
    };
  }
}

/**
 * Create a new project
 */
export async function createProject(data: CreateProjectInput) {
  try {
    // Validate input
    const validated = createProjectSchema.parse(data);

    // Create project
    const project = await prisma.project.create({
      data: {
        name: validated.name,
        description: validated.description || null,
        repository: validated.repository || null,
        status: validated.status,
        tags: validated.tags,
      },
    });

    // Revalidate paths
    revalidatePath("/projects");
    revalidatePath("/");

    return {
      success: true,
      project,
    };
  } catch (error) {
    console.error("Error creating project:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create project",
    };
  }
}

/**
 * Update an existing project
 */
export async function updateProject(data: UpdateProjectInput) {
  try {
    // Validate input
    const validated = updateProjectSchema.parse(data);

    // Check if project exists
    const existingProject = await prisma.project.findUnique({
      where: { id: validated.id },
    });

    if (!existingProject) {
      return {
        success: false,
        error: "Project not found",
      };
    }

    // Update project
    const project = await prisma.project.update({
      where: { id: validated.id },
      data: {
        ...(validated.name && { name: validated.name }),
        ...(validated.description !== undefined && {
          description: validated.description,
        }),
        ...(validated.repository !== undefined && {
          repository: validated.repository || null,
        }),
        ...(validated.status && { status: validated.status }),
        ...(validated.tags && { tags: validated.tags }),
      },
    });

    // Revalidate paths
    revalidatePath("/projects");
    revalidatePath(`/projects/${validated.id}`);
    revalidatePath("/");

    return {
      success: true,
      project,
    };
  } catch (error) {
    console.error("Error updating project:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update project",
    };
  }
}

/**
 * Delete a project
 */
export async function deleteProject(id: string) {
  try {
    // Validate input
    const validated = deleteProjectSchema.parse({ id });

    // Check if project exists
    const existingProject = await prisma.project.findUnique({
      where: { id: validated.id },
    });

    if (!existingProject) {
      return {
        success: false,
        error: "Project not found",
      };
    }

    // Delete project
    await prisma.project.delete({
      where: { id: validated.id },
    });

    // Revalidate paths
    revalidatePath("/projects");
    revalidatePath("/");

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error deleting project:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete project",
    };
  }
}

/**
 * Get project stats
 */
export async function getProjectStats() {
  try {
    const [total, active, archived, paused] = await Promise.all([
      prisma.project.count(),
      prisma.project.count({ where: { status: "ACTIVE" } }),
      prisma.project.count({ where: { status: "ARCHIVED" } }),
      prisma.project.count({ where: { status: "PAUSED" } }),
    ]);

    return {
      success: true,
      stats: {
        total,
        active,
        archived,
        paused,
      },
    };
  } catch (error) {
    console.error("Error fetching project stats:", error);
    return {
      success: false,
      error: "Failed to fetch project stats",
    };
  }
}
