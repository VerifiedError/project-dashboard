/**
 * FILE-REF: LIB-016-20251129
 *
 * @file neon.ts
 * @description Server actions for Neon integration and synchronization
 * @category Library
 * @created 2025-11-29
 * @modified 2025-11-29
 *
 * @changelog
 * - 2025-11-29 - Initial Neon server actions with full management capabilities
 *
 * @dependencies
 * - LIB-003 (neon.ts - API client)
 * - @prisma/client
 *
 * @see Related files:
 * - LIB-003 (neon API client)
 */

"use server";

import { prisma } from "@/lib/utils/db";
import {
  listNeonProjects,
  getNeonProject,
  createNeonProject as apiCreateNeonProject,
  updateNeonProject as apiUpdateNeonProject,
  deleteNeonProject as apiDeleteNeonProject,
  listNeonBranches,
  createNeonBranch as apiCreateNeonBranch,
  updateNeonBranch as apiUpdateNeonBranch,
  deleteNeonBranch as apiDeleteNeonBranch,
  listNeonDatabases,
  createNeonDatabase as apiCreateNeonDatabase,
  updateNeonDatabase as apiUpdateNeonDatabase,
  deleteNeonDatabase as apiDeleteNeonDatabase,
  listNeonEndpoints,
  createNeonEndpoint as apiCreateNeonEndpoint,
  updateNeonEndpoint as apiUpdateNeonEndpoint,
  deleteNeonEndpoint as apiDeleteNeonEndpoint,
  startNeonEndpoint as apiStartNeonEndpoint,
  suspendNeonEndpoint as apiSuspendNeonEndpoint,
  listNeonRoles,
  createNeonRole as apiCreateNeonRole,
  deleteNeonRole as apiDeleteNeonRole,
  resetNeonRolePassword as apiResetNeonRolePassword,
  listNeonOperations,
  getNeonConnectionURI as apiGetNeonConnectionURI,
} from "@/lib/api/neon";
import { DatabaseStatus } from "@prisma/client";
import { getCurrentUserId } from "@/lib/utils/session";
import { revalidatePath } from "next/cache";

interface SyncResult {
  success: boolean;
  message?: string;
  error?: string;
  synced?: number;
}

// ============================================================================
// SYNC FUNCTIONALITY
// ============================================================================

/**
 * Sync all Neon projects from the API to the database
 */
export async function syncNeonProjects(): Promise<SyncResult> {
  try {
    const userId = await getCurrentUserId();

    if (!userId) {
      return {
        success: false,
        error: "You must be logged in to sync Neon projects",
      };
    }

    // Fetch all projects from Neon API
    const projects = await listNeonProjects();

    let syncedCount = 0;

    for (const project of projects) {
      // Get main branch info
      const branches = await listNeonBranches(project.id);
      const mainBranch = branches.find(b => b.primary) || branches[0];

      // Get databases if main branch exists
      let databases: any[] = [];
      if (mainBranch) {
        databases = await listNeonDatabases(project.id, mainBranch.id);
      }

      // Calculate totals
      const totalDatabases = databases.length;
      const totalBranches = branches.length;
      const storageGB = mainBranch ? mainBranch.logical_size / (1024 * 1024 * 1024) : 0;

      // Determine status
      let status = DatabaseStatus.ACTIVE;
      if (mainBranch?.current_state === "init") {
        status = DatabaseStatus.ERROR;
      }

      // Upsert the project in our database
      await prisma.neonDatabase.upsert({
        where: { neonProjectId: project.id },
        update: {
          projectName: project.name,
          region: project.region_id,
          postgresVersion: project.pg_version.toString(),
          branchCount: totalBranches,
          storageUsageGB: storageGB,
          computeHours: project.cpu_used_sec / 3600,
          status,
          lastSyncedAt: new Date(),
        },
        create: {
          neonProjectId: project.id,
          projectName: project.name,
          databaseName: databases[0]?.name || "neondb",
          region: project.region_id,
          postgresVersion: project.pg_version.toString(),
          connectionUri: "", // Will be set when user requests it
          branchCount: totalBranches,
          storageUsageGB: storageGB,
          computeHours: project.cpu_used_sec / 3600,
          status,
          lastSyncedAt: new Date(),
        },
      });

      syncedCount++;
    }

    return {
      success: true,
      message: `Successfully synced ${syncedCount} Neon project(s)`,
      synced: syncedCount,
    };
  } catch (error) {
    console.error("Failed to sync Neon projects:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to sync Neon projects",
    };
  }
}

/**
 * Get all Neon projects from the database
 */
export async function getNeonProjects() {
  try {
    const userId = await getCurrentUserId();

    if (!userId) {
      return {
        success: false,
        error: "You must be logged in to view Neon projects",
      };
    }

    const projects = await prisma.neonDatabase.findMany({
      orderBy: {
        lastSyncedAt: "desc",
      },
    });

    return {
      success: true,
      projects,
    };
  } catch (error) {
    console.error("Failed to get Neon projects:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to get Neon projects",
    };
  }
}

/**
 * Get a single Neon project by ID
 */
export async function getNeonProjectById(id: string) {
  try {
    const userId = await getCurrentUserId();

    if (!userId) {
      return {
        success: false,
        error: "You must be logged in to view Neon projects",
      };
    }

    const project = await prisma.neonDatabase.findUnique({
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
    console.error(`Failed to get Neon project ${id}:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to get Neon project",
    };
  }
}

// ============================================================================
// DETAILED PROJECT DATA
// ============================================================================

/**
 * Get detailed project data including branches, databases, endpoints from Neon API
 */
export async function getDetailedNeonProject(neonProjectId: string) {
  try {
    const userId = await getCurrentUserId();

    if (!userId) {
      return {
        success: false,
        error: "You must be logged in",
      };
    }

    // Fetch all data in parallel
    const [project, branches, operations] = await Promise.all([
      getNeonProject(neonProjectId),
      listNeonBranches(neonProjectId),
      listNeonOperations(neonProjectId),
    ]);

    // Get main branch details
    const mainBranch = branches.find(b => b.primary) || branches[0];
    let databases: any[] = [];
    let endpoints: any[] = [];
    let roles: any[] = [];

    if (mainBranch) {
      [databases, endpoints, roles] = await Promise.all([
        listNeonDatabases(neonProjectId, mainBranch.id),
        listNeonEndpoints(neonProjectId, mainBranch.id),
        listNeonRoles(neonProjectId, mainBranch.id),
      ]);
    }

    return {
      success: true,
      data: {
        project,
        branches,
        databases,
        endpoints,
        roles,
        operations: operations.slice(0, 20), // Latest 20 operations
      },
    };
  } catch (error) {
    console.error(`Failed to get detailed project data for ${neonProjectId}:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch project details",
    };
  }
}

// ============================================================================
// PROJECT MANAGEMENT
// ============================================================================

/**
 * Create a new Neon project
 */
export async function createNeonProjectAction(data: {
  name?: string;
  region_id?: string;
  pg_version?: number;
}) {
  try {
    const userId = await getCurrentUserId();

    if (!userId) {
      return {
        success: false,
        error: "You must be logged in",
      };
    }

    const result = await apiCreateNeonProject(data);

    revalidatePath("/resources/neon");

    return {
      success: true,
      message: "Project created successfully",
      project: result,
    };
  } catch (error) {
    console.error("Failed to create Neon project:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create project",
    };
  }
}

/**
 * Update Neon project settings
 */
export async function updateNeonProjectSettings(
  projectId: string,
  data: {
    name?: string;
    default_endpoint_settings?: {
      autoscaling_limit_min_cu?: number;
      autoscaling_limit_max_cu?: number;
      suspend_timeout_seconds?: number;
    };
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

    const result = await apiUpdateNeonProject(projectId, data);

    // Also update in local database if name changed
    const dbProject = await prisma.neonDatabase.findFirst({
      where: { neonProjectId: projectId },
    });

    if (dbProject && data.name) {
      await prisma.neonDatabase.update({
        where: { id: dbProject.id },
        data: { projectName: data.name },
      });
    }

    revalidatePath("/resources/neon");
    revalidatePath(`/resources/neon/${projectId}`);

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
 * Delete Neon project (DANGEROUS)
 */
export async function removeNeonProject(projectId: string) {
  try {
    const userId = await getCurrentUserId();

    if (!userId) {
      return {
        success: false,
        error: "You must be logged in",
      };
    }

    await apiDeleteNeonProject(projectId);

    // Also remove from local database
    await prisma.neonDatabase.deleteMany({
      where: { neonProjectId: projectId },
    });

    revalidatePath("/resources/neon");

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

// ============================================================================
// BRANCH MANAGEMENT
// ============================================================================

/**
 * Create a new branch
 */
export async function createBranch(
  projectId: string,
  data: {
    name?: string;
    parent_id?: string;
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

    const result = await apiCreateNeonBranch(projectId, data);

    revalidatePath(`/resources/neon/${projectId}`);

    return {
      success: true,
      message: "Branch created successfully",
      branch: result,
    };
  } catch (error) {
    console.error("Failed to create branch:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create branch",
    };
  }
}

/**
 * Update branch
 */
export async function updateBranch(
  projectId: string,
  branchId: string,
  data: { name?: string }
) {
  try {
    const userId = await getCurrentUserId();

    if (!userId) {
      return {
        success: false,
        error: "You must be logged in",
      };
    }

    const result = await apiUpdateNeonBranch(projectId, branchId, data);

    revalidatePath(`/resources/neon/${projectId}`);

    return {
      success: true,
      message: "Branch updated successfully",
      branch: result,
    };
  } catch (error) {
    console.error(`Failed to update branch ${branchId}:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update branch",
    };
  }
}

/**
 * Delete branch
 */
export async function removeBranch(projectId: string, branchId: string) {
  try {
    const userId = await getCurrentUserId();

    if (!userId) {
      return {
        success: false,
        error: "You must be logged in",
      };
    }

    await apiDeleteNeonBranch(projectId, branchId);

    revalidatePath(`/resources/neon/${projectId}`);

    return {
      success: true,
      message: "Branch deleted successfully",
    };
  } catch (error) {
    console.error(`Failed to delete branch ${branchId}:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete branch",
    };
  }
}

// ============================================================================
// DATABASE MANAGEMENT
// ============================================================================

/**
 * Create a new database
 */
export async function createDatabase(
  projectId: string,
  branchId: string,
  data: {
    name: string;
    owner_name: string;
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

    const result = await apiCreateNeonDatabase(projectId, branchId, data);

    revalidatePath(`/resources/neon/${projectId}`);

    return {
      success: true,
      message: "Database created successfully",
      database: result,
    };
  } catch (error) {
    console.error("Failed to create database:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create database",
    };
  }
}

/**
 * Update database
 */
export async function updateDatabase(
  projectId: string,
  branchId: string,
  databaseId: string,
  data: {
    name?: string;
    owner_name?: string;
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

    const result = await apiUpdateNeonDatabase(projectId, branchId, databaseId, data);

    revalidatePath(`/resources/neon/${projectId}`);

    return {
      success: true,
      message: "Database updated successfully",
      database: result,
    };
  } catch (error) {
    console.error(`Failed to update database ${databaseId}:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update database",
    };
  }
}

/**
 * Delete database
 */
export async function removeDatabase(
  projectId: string,
  branchId: string,
  databaseId: string
) {
  try {
    const userId = await getCurrentUserId();

    if (!userId) {
      return {
        success: false,
        error: "You must be logged in",
      };
    }

    await apiDeleteNeonDatabase(projectId, branchId, databaseId);

    revalidatePath(`/resources/neon/${projectId}`);

    return {
      success: true,
      message: "Database deleted successfully",
    };
  } catch (error) {
    console.error(`Failed to delete database ${databaseId}:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete database",
    };
  }
}

// ============================================================================
// ENDPOINT MANAGEMENT
// ============================================================================

/**
 * Create a new endpoint
 */
export async function createEndpoint(
  projectId: string,
  branchId: string,
  data: {
    type: string;
    autoscaling_limit_min_cu?: number;
    autoscaling_limit_max_cu?: number;
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

    const result = await apiCreateNeonEndpoint(projectId, branchId, data);

    revalidatePath(`/resources/neon/${projectId}`);

    return {
      success: true,
      message: "Endpoint created successfully",
      endpoint: result,
    };
  } catch (error) {
    console.error("Failed to create endpoint:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create endpoint",
    };
  }
}

/**
 * Update endpoint settings
 */
export async function updateEndpointSettings(
  projectId: string,
  branchId: string,
  endpointId: string,
  data: {
    autoscaling_limit_min_cu?: number;
    autoscaling_limit_max_cu?: number;
    suspend_timeout_seconds?: number;
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

    const result = await apiUpdateNeonEndpoint(projectId, branchId, endpointId, data);

    revalidatePath(`/resources/neon/${projectId}`);

    return {
      success: true,
      message: "Endpoint updated successfully",
      endpoint: result,
    };
  } catch (error) {
    console.error(`Failed to update endpoint ${endpointId}:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update endpoint",
    };
  }
}

/**
 * Delete endpoint
 */
export async function removeEndpoint(
  projectId: string,
  branchId: string,
  endpointId: string
) {
  try {
    const userId = await getCurrentUserId();

    if (!userId) {
      return {
        success: false,
        error: "You must be logged in",
      };
    }

    await apiDeleteNeonEndpoint(projectId, branchId, endpointId);

    revalidatePath(`/resources/neon/${projectId}`);

    return {
      success: true,
      message: "Endpoint deleted successfully",
    };
  } catch (error) {
    console.error(`Failed to delete endpoint ${endpointId}:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete endpoint",
    };
  }
}

/**
 * Start endpoint
 */
export async function startEndpoint(
  projectId: string,
  branchId: string,
  endpointId: string
) {
  try {
    const userId = await getCurrentUserId();

    if (!userId) {
      return {
        success: false,
        error: "You must be logged in",
      };
    }

    const result = await apiStartNeonEndpoint(projectId, branchId, endpointId);

    revalidatePath(`/resources/neon/${projectId}`);

    return {
      success: true,
      message: "Endpoint started successfully",
      endpoint: result,
    };
  } catch (error) {
    console.error(`Failed to start endpoint ${endpointId}:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to start endpoint",
    };
  }
}

/**
 * Suspend endpoint
 */
export async function suspendEndpoint(
  projectId: string,
  branchId: string,
  endpointId: string
) {
  try {
    const userId = await getCurrentUserId();

    if (!userId) {
      return {
        success: false,
        error: "You must be logged in",
      };
    }

    const result = await apiSuspendNeonEndpoint(projectId, branchId, endpointId);

    revalidatePath(`/resources/neon/${projectId}`);

    return {
      success: true,
      message: "Endpoint suspended successfully",
      endpoint: result,
    };
  } catch (error) {
    console.error(`Failed to suspend endpoint ${endpointId}:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to suspend endpoint",
    };
  }
}

// ============================================================================
// ROLE MANAGEMENT
// ============================================================================

/**
 * Create a new role
 */
export async function createRole(
  projectId: string,
  branchId: string,
  data: { name: string }
) {
  try {
    const userId = await getCurrentUserId();

    if (!userId) {
      return {
        success: false,
        error: "You must be logged in",
      };
    }

    const result = await apiCreateNeonRole(projectId, branchId, data);

    revalidatePath(`/resources/neon/${projectId}`);

    return {
      success: true,
      message: "Role created successfully",
      role: result,
    };
  } catch (error) {
    console.error("Failed to create role:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create role",
    };
  }
}

/**
 * Delete role
 */
export async function removeRole(
  projectId: string,
  branchId: string,
  roleName: string
) {
  try {
    const userId = await getCurrentUserId();

    if (!userId) {
      return {
        success: false,
        error: "You must be logged in",
      };
    }

    await apiDeleteNeonRole(projectId, branchId, roleName);

    revalidatePath(`/resources/neon/${projectId}`);

    return {
      success: true,
      message: "Role deleted successfully",
    };
  } catch (error) {
    console.error(`Failed to delete role ${roleName}:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete role",
    };
  }
}

/**
 * Reset role password
 */
export async function resetRolePassword(
  projectId: string,
  branchId: string,
  roleName: string
) {
  try {
    const userId = await getCurrentUserId();

    if (!userId) {
      return {
        success: false,
        error: "You must be logged in",
      };
    }

    const result = await apiResetNeonRolePassword(projectId, branchId, roleName);

    revalidatePath(`/resources/neon/${projectId}`);

    return {
      success: true,
      message: "Password reset successfully",
      role: result,
    };
  } catch (error) {
    console.error(`Failed to reset password for role ${roleName}:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to reset password",
    };
  }
}

// ============================================================================
// CONNECTION URI
// ============================================================================

/**
 * Get connection URI for a database
 */
export async function getConnectionUri(
  projectId: string,
  branchId: string,
  databaseName: string,
  roleName: string
) {
  try {
    const userId = await getCurrentUserId();

    if (!userId) {
      return {
        success: false,
        error: "You must be logged in",
      };
    }

    const uri = await apiGetNeonConnectionURI(projectId, branchId, databaseName, roleName);

    return {
      success: true,
      uri,
    };
  } catch (error) {
    console.error("Failed to get connection URI:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to get connection URI",
    };
  }
}
