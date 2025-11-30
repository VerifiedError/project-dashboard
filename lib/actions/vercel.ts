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
 * - 2025-11-29 - Added management actions (env vars, domains, deployments, project settings)
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
  listVercelEnvVars,
  createVercelEnvVar,
  deleteVercelEnvVar,
  listVercelDomains,
  addVercelDomain,
  removeVercelDomain,
  updateVercelProject,
  deleteVercelProject,
  redeployVercelDeployment,
  deleteVercelDeployment,
  getVercelDeploymentEvents,
} from "@/lib/api/vercel";
import { BuildStatus, Prisma } from "@prisma/client";
import { getCurrentUserId } from "@/lib/utils/session";
import { revalidatePath } from "next/cache";

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
            : Prisma.JsonNull,
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
            : Prisma.JsonNull,
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

// ============================================================================
// DETAILED PROJECT DATA
// ============================================================================

/**
 * Get detailed project data including env vars, domains, and deployments from Vercel API
 */
export async function getDetailedVercelProject(vercelId: string) {
  try {
    const userId = await getCurrentUserId();

    if (!userId) {
      return {
        success: false,
        error: "You must be logged in",
      };
    }

    // Fetch all data in parallel
    const [project, envVars, domains, deployments] = await Promise.all([
      getVercelProject(vercelId),
      listVercelEnvVars(vercelId),
      listVercelDomains(vercelId),
      listVercelDeployments(vercelId, 20),
    ]);

    return {
      success: true,
      data: {
        project,
        envVars,
        domains,
        deployments,
      },
    };
  } catch (error) {
    console.error(`Failed to get detailed project data for ${vercelId}:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch project details",
    };
  }
}

// ============================================================================
// ENVIRONMENT VARIABLES MANAGEMENT
// ============================================================================

/**
 * Add environment variable to Vercel project
 */
export async function addEnvVariable(
  projectId: string,
  data: {
    key: string;
    value: string;
    target: ("production" | "preview" | "development")[];
    type?: "encrypted" | "plain" | "secret";
  }
) {
  try {
    const userId = await getCurrentUserId();

    if (!userId) {
      return {
        success: false,
        error: "You must be logged in",
      };
    }

    await createVercelEnvVar(projectId, data);

    revalidatePath(`/resources/vercel/${projectId}`);

    return {
      success: true,
      message: "Environment variable added successfully",
    };
  } catch (error) {
    console.error(`Failed to add env var to ${projectId}:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to add environment variable",
    };
  }
}

/**
 * Remove environment variable from Vercel project
 */
export async function removeEnvVariable(projectId: string, envId: string) {
  try {
    const userId = await getCurrentUserId();

    if (!userId) {
      return {
        success: false,
        error: "You must be logged in",
      };
    }

    await deleteVercelEnvVar(projectId, envId);

    revalidatePath(`/resources/vercel/${projectId}`);

    return {
      success: true,
      message: "Environment variable removed successfully",
    };
  } catch (error) {
    console.error(`Failed to remove env var ${envId}:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to remove environment variable",
    };
  }
}

// ============================================================================
// DOMAIN MANAGEMENT
// ============================================================================

/**
 * Add domain to Vercel project
 */
export async function addDomain(
  projectId: string,
  domain: string,
  gitBranch?: string
) {
  try {
    const userId = await getCurrentUserId();

    if (!userId) {
      return {
        success: false,
        error: "You must be logged in",
      };
    }

    const result = await addVercelDomain(projectId, domain, gitBranch);

    revalidatePath(`/resources/vercel/${projectId}`);

    return {
      success: true,
      message: "Domain added successfully",
      domain: result,
    };
  } catch (error) {
    console.error(`Failed to add domain ${domain} to ${projectId}:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to add domain",
    };
  }
}

/**
 * Remove domain from Vercel project
 */
export async function removeDomain(projectId: string, domain: string) {
  try {
    const userId = await getCurrentUserId();

    if (!userId) {
      return {
        success: false,
        error: "You must be logged in",
      };
    }

    await removeVercelDomain(projectId, domain);

    revalidatePath(`/resources/vercel/${projectId}`);

    return {
      success: true,
      message: "Domain removed successfully",
    };
  } catch (error) {
    console.error(`Failed to remove domain ${domain} from ${projectId}:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to remove domain",
    };
  }
}

// ============================================================================
// DEPLOYMENT MANAGEMENT
// ============================================================================

/**
 * Redeploy a deployment
 */
export async function redeployment(
  deploymentId: string,
  projectName: string,
  target?: "production" | "staging"
) {
  try {
    const userId = await getCurrentUserId();

    if (!userId) {
      return {
        success: false,
        error: "You must be logged in",
      };
    }

    const result = await redeployVercelDeployment(deploymentId, projectName, target);

    revalidatePath(`/resources/vercel`);

    return {
      success: true,
      message: "Redeployment triggered successfully",
      deployment: result,
    };
  } catch (error) {
    console.error(`Failed to redeploy ${deploymentId}:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to trigger redeployment",
    };
  }
}

/**
 * Delete a deployment
 */
export async function removeDeployment(deploymentId: string) {
  try {
    const userId = await getCurrentUserId();

    if (!userId) {
      return {
        success: false,
        error: "You must be logged in",
      };
    }

    await deleteVercelDeployment(deploymentId);

    revalidatePath(`/resources/vercel`);

    return {
      success: true,
      message: "Deployment deleted successfully",
    };
  } catch (error) {
    console.error(`Failed to delete deployment ${deploymentId}:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete deployment",
    };
  }
}

/**
 * Get deployment logs
 */
export async function getDeploymentLogs(deploymentId: string) {
  try {
    const userId = await getCurrentUserId();

    if (!userId) {
      return {
        success: false,
        error: "You must be logged in",
      };
    }

    const logs = await getVercelDeploymentEvents(deploymentId);

    return {
      success: true,
      logs,
    };
  } catch (error) {
    console.error(`Failed to get deployment logs for ${deploymentId}:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch deployment logs",
    };
  }
}

// ============================================================================
// PROJECT SETTINGS MANAGEMENT
// ============================================================================

/**
 * Update Vercel project settings
 */
export async function updateProjectSettings(
  projectId: string,
  data: {
    name?: string;
    buildCommand?: string | null;
    devCommand?: string | null;
    installCommand?: string | null;
    outputDirectory?: string | null;
    rootDirectory?: string | null;
    framework?: string | null;
  }
) {
  try {
    const userId = await getCurrentUserId();

    if (!userId) {
      return {
        success: false,
        error: "You must be logged in",
      };
    }

    const result = await updateVercelProject(projectId, data);

    // Also update in local database
    const dbProject = await prisma.vercelProject.findFirst({
      where: { vercelId: projectId },
    });

    if (dbProject && data.name) {
      await prisma.vercelProject.update({
        where: { id: dbProject.id },
        data: { name: data.name },
      });
    }

    revalidatePath(`/resources/vercel`);
    revalidatePath(`/resources/vercel/${projectId}`);

    return {
      success: true,
      message: "Project settings updated successfully",
      project: result,
    };
  } catch (error) {
    console.error(`Failed to update project ${projectId}:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update project settings",
    };
  }
}

/**
 * Delete Vercel project (DANGEROUS)
 */
export async function removeProject(projectId: string) {
  try {
    const userId = await getCurrentUserId();

    if (!userId) {
      return {
        success: false,
        error: "You must be logged in",
      };
    }

    await deleteVercelProject(projectId);

    // Also remove from local database
    await prisma.vercelProject.deleteMany({
      where: { vercelId: projectId },
    });

    revalidatePath(`/resources/vercel`);

    return {
      success: true,
      message: "Project deleted successfully",
    };
  } catch (error) {
    console.error(`Failed to delete project ${projectId}:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete project",
    };
  }
}
