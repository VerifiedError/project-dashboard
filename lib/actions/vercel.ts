/**
 * FILE-REF: LIB-015-20251129
 *
 * @file vercel.ts
 * @description Server actions for Vercel integration and synchronization
 * @category Library
 * @created 2025-11-29
 * @modified 2025-11-29
 *
 * @changelog
 * - 2025-11-29 - Initial Vercel server actions
 *
 * @dependencies
 * - LIB-002 (vercel.ts - API client)
 * - @prisma/client
 *
 * @see Related files:
 * - LIB-002 (vercel API client)
 */

"use server";

import { prisma } from "@/lib/utils/db";
import {
  listVercelProjects,
  getVercelProject,
  listVercelDeployments,
} from "@/lib/api/vercel";
import { BuildStatus } from "@prisma/client";
import { getCurrentUserId } from "@/lib/utils/session";

interface SyncResult {
  success: boolean;
  message?: string;
  error?: string;
  synced?: number;
}

/**
 * Map Vercel deployment state to our BuildStatus enum
 */
function mapDeploymentState(state: string): BuildStatus {
  switch (state.toUpperCase()) {
    case "READY":
      return BuildStatus.READY;
    case "BUILDING":
      return BuildStatus.BUILDING;
    case "ERROR":
    case "FAILED":
      return BuildStatus.ERROR;
    case "QUEUED":
      return BuildStatus.QUEUED;
    case "CANCELED":
    case "CANCELLED":
      return BuildStatus.CANCELED;
    default:
      return BuildStatus.READY;
  }
}

/**
 * Sync all Vercel projects from the API to the database
 */
export async function syncVercelProjects(): Promise<SyncResult> {
  try {
    const userId = await getCurrentUserId();

    if (!userId) {
      return {
        success: false,
        error: "You must be logged in to sync Vercel projects",
      };
    }

    // Fetch all projects from Vercel API
    const projects = await listVercelProjects();

    let syncedCount = 0;

    for (const project of projects) {
      // Get deployments for this project
      const deployments = await listVercelDeployments(project.id, 1);
      const latestDeployment = deployments[0];

      // Determine git provider and repo
      let gitProvider = null;
      let gitRepo = null;

      if (project.link) {
        gitProvider = project.link.type;
        if (project.link.org && project.link.repo) {
          gitRepo = `${project.link.org}/${project.link.repo}`;
        } else if (project.link.repo) {
          gitRepo = project.link.repo;
        }
      }

      // Upsert the project in our database
      await prisma.vercelProject.upsert({
        where: { vercelId: project.id },
        update: {
          name: project.name,
          framework: project.framework,
          gitProvider,
          gitRepo,
          buildStatus: latestDeployment
            ? mapDeploymentState(latestDeployment.state)
            : BuildStatus.READY,
          latestDeployment: latestDeployment
            ? {
                id: latestDeployment.uid,
                url: latestDeployment.url,
                state: latestDeployment.state,
                target: latestDeployment.target,
                createdAt: latestDeployment.created,
                ready: latestDeployment.ready,
                meta: latestDeployment.meta,
              }
            : null,
          productionUrl: latestDeployment?.target === "production" ? latestDeployment.url : null,
          lastDeployedAt: latestDeployment ? new Date(latestDeployment.created) : null,
          lastSyncedAt: new Date(),
        },
        create: {
          vercelId: project.id,
          name: project.name,
          framework: project.framework,
          gitProvider,
          gitRepo,
          buildStatus: latestDeployment
            ? mapDeploymentState(latestDeployment.state)
            : BuildStatus.READY,
          latestDeployment: latestDeployment
            ? {
                id: latestDeployment.uid,
                url: latestDeployment.url,
                state: latestDeployment.state,
                target: latestDeployment.target,
                createdAt: latestDeployment.created,
                ready: latestDeployment.ready,
                meta: latestDeployment.meta,
              }
            : null,
          productionUrl: latestDeployment?.target === "production" ? latestDeployment.url : null,
          lastDeployedAt: latestDeployment ? new Date(latestDeployment.created) : null,
          lastSyncedAt: new Date(),
        },
      });

      syncedCount++;
    }

    return {
      success: true,
      message: `Successfully synced ${syncedCount} Vercel project(s)`,
      synced: syncedCount,
    };
  } catch (error) {
    console.error("Failed to sync Vercel projects:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to sync Vercel projects",
    };
  }
}

/**
 * Get all Vercel projects from the database
 */
export async function getVercelProjects() {
  try {
    const userId = await getCurrentUserId();

    if (!userId) {
      return {
        success: false,
        error: "You must be logged in to view Vercel projects",
      };
    }

    const projects = await prisma.vercelProject.findMany({
      orderBy: {
        lastDeployedAt: "desc",
      },
    });

    return {
      success: true,
      projects,
    };
  } catch (error) {
    console.error("Failed to get Vercel projects:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to get Vercel projects",
    };
  }
}

/**
 * Get a single Vercel project by ID
 */
export async function getVercelProjectById(id: string) {
  try {
    const userId = await getCurrentUserId();

    if (!userId) {
      return {
        success: false,
        error: "You must be logged in to view Vercel projects",
      };
    }

    const project = await prisma.vercelProject.findUnique({
      where: { id },
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
    console.error(`Failed to get Vercel project ${id}:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to get Vercel project",
    };
  }
}
