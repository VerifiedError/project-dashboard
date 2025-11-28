/**
 * FILE-REF: LIB-011-20251128
 *
 * @file ngrok.ts
 * @description Server actions for ngrok tunnel management
 * @category Library
 * @created 2025-11-28
 * @modified 2025-11-28
 *
 * @changelog
 * - 2025-11-28 - Initial ngrok server actions (CHG-007)
 *
 * @dependencies
 * - LIB-001 (ngrok API client)
 * - LIB-020 (Prisma client)
 *
 * @see Related files:
 * - PAGE-007 (ngrok resource page)
 */

"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/utils/db";
import {
  listTunnelSessions,
  listEndpoints,
  isNgrokConfigured,
  testNgrokConnection,
} from "@/lib/api/ngrok";
import { TunnelStatus } from "@prisma/client";

export interface NgrokSyncResult {
  success: boolean;
  tunnelsCount: number;
  error?: string;
}

export interface NgrokTunnelsResult {
  success: boolean;
  tunnels: Array<{
    id: string;
    ngrokId: string;
    publicUrl: string;
    protocol: string;
    forwardingAddr: string;
    region: string | null;
    connectionCount: number;
    status: TunnelStatus;
    lastSyncedAt: Date;
    createdAt: Date;
    project: {
      id: string;
      name: string;
    } | null;
  }>;
  error?: string;
}

/**
 * Sync ngrok tunnels from API to database
 */
export async function syncNgrokTunnels(): Promise<NgrokSyncResult> {
  try {
    // Check if ngrok is configured
    if (!isNgrokConfigured()) {
      return {
        success: false,
        tunnelsCount: 0,
        error: "ngrok API key not configured"
      };
    }

    // Test connection
    const connectionTest = await testNgrokConnection();
    if (!connectionTest.success) {
      return {
        success: false,
        tunnelsCount: 0,
        error: connectionTest.error
      };
    }

    // Fetch tunnel sessions from ngrok API
    const sessions = await listTunnelSessions();

    // Fetch endpoints as well for additional data
    const endpoints = await listEndpoints();

    // Update database
    const updatedTunnels = [];

    for (const session of sessions) {
      const tunnelData = {
        ngrokId: session.id,
        publicUrl: session.public_url,
        protocol: session.proto,
        forwardingAddr: session.forwards_to,
        region: session.region || null,
        connectionCount: 0, // ngrok API v2 doesn't provide real-time metrics
        status: TunnelStatus.ACTIVE,
        lastSyncedAt: new Date(),
      };

      const tunnel = await prisma.ngrokTunnel.upsert({
        where: { ngrokId: session.id },
        update: {
          ...tunnelData,
          updatedAt: new Date(),
        },
        create: tunnelData,
      });

      updatedTunnels.push(tunnel);
    }

    // Mark tunnels as INACTIVE if they're not in the current session list
    const activeTunnelIds = sessions.map(s => s.id);
    await prisma.ngrokTunnel.updateMany({
      where: {
        ngrokId: {
          notIn: activeTunnelIds,
        },
        status: TunnelStatus.ACTIVE,
      },
      data: {
        status: TunnelStatus.INACTIVE,
        updatedAt: new Date(),
      },
    });

    revalidatePath("/resources/ngrok");
    revalidatePath("/");

    return {
      success: true,
      tunnelsCount: updatedTunnels.length,
    };
  } catch (error) {
    console.error("Failed to sync ngrok tunnels:", error);
    return {
      success: false,
      tunnelsCount: 0,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Get all ngrok tunnels from database
 */
export async function getNgrokTunnels(): Promise<NgrokTunnelsResult> {
  try {
    const tunnels = await prisma.ngrokTunnel.findMany({
      include: {
        project: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: [
        { status: "asc" }, // Active first
        { createdAt: "desc" },
      ],
    });

    return {
      success: true,
      tunnels,
    };
  } catch (error) {
    console.error("Failed to fetch ngrok tunnels:", error);
    return {
      success: false,
      tunnels: [],
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Get ngrok tunnel statistics
 */
export async function getNgrokStats() {
  try {
    const [total, active, inactive] = await Promise.all([
      prisma.ngrokTunnel.count(),
      prisma.ngrokTunnel.count({ where: { status: TunnelStatus.ACTIVE } }),
      prisma.ngrokTunnel.count({ where: { status: TunnelStatus.INACTIVE } }),
    ]);

    return {
      success: true,
      stats: {
        total,
        active,
        inactive,
      },
    };
  } catch (error) {
    console.error("Failed to fetch ngrok stats:", error);
    return {
      success: false,
      stats: { total: 0, active: 0, inactive: 0 },
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Link ngrok tunnel to a project
 */
export async function linkTunnelToProject(tunnelId: string, projectId: string | null) {
  try {
    await prisma.ngrokTunnel.update({
      where: { id: tunnelId },
      data: { projectId },
    });

    revalidatePath("/resources/ngrok");
    revalidatePath("/projects");

    return { success: true };
  } catch (error) {
    console.error("Failed to link tunnel to project:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Delete ngrok tunnel from database
 */
export async function deleteNgrokTunnel(tunnelId: string) {
  try {
    await prisma.ngrokTunnel.delete({
      where: { id: tunnelId },
    });

    revalidatePath("/resources/ngrok");
    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error("Failed to delete tunnel:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Check ngrok configuration status
 */
export async function checkNgrokStatus() {
  try {
    const configured = isNgrokConfigured();

    if (!configured) {
      return {
        success: true,
        configured: false,
        message: "API key not configured",
      };
    }

    const connectionTest = await testNgrokConnection();

    return {
      success: true,
      configured: true,
      connected: connectionTest.success,
      message: connectionTest.success ? "Connected" : connectionTest.error,
    };
  } catch (error) {
    return {
      success: false,
      configured: false,
      connected: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
