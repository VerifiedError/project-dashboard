/**
 * FILE-REF: PAGE-009-20251129
 *
 * @file page.tsx
 * @description Neon databases resource page with full management
 * @category Page
 * @created 2025-11-29
 * @modified 2025-11-29
 *
 * @changelog
 * - 2025-11-29 - Created placeholder page
 * - 2025-11-29 - Implemented full Neon integration with sync and project cards
 *
 * @dependencies
 * - LIB-016 (neon actions)
 * - LIB-003 (neon API client)
 *
 * @see Related files:
 * - LIB-016 (neon server actions)
 * - LIB-003 (neon API client)
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Database, Layers, HardDrive, Clock, MapPin } from "lucide-react";
import { getNeonProjects } from "@/lib/actions/neon";
import { SyncButton } from "@/components/shared/SyncButton";
import { RelativeTime } from "@/components/shared/RelativeTime";
import { DatabaseStatus } from "@prisma/client";
import Link from "next/link";

/**
 * Map DatabaseStatus enum to badge variant and color
 */
function getDatabaseStatusBadge(status: DatabaseStatus) {
  switch (status) {
    case DatabaseStatus.ACTIVE:
      return { variant: "default" as const, className: "bg-green-600", label: "Active" };
    case DatabaseStatus.SUSPENDED:
      return { variant: "secondary" as const, className: "bg-yellow-600 text-white", label: "Suspended" };
    case DatabaseStatus.ERROR:
      return { variant: "destructive" as const, className: "", label: "Error" };
    default:
      return { variant: "outline" as const, className: "", label: "Unknown" };
  }
}

/**
 * Format storage size
 */
function formatStorage(gb: number): string {
  if (gb < 1) {
    return `${Math.round(gb * 1024)} MB`;
  }
  return `${gb.toFixed(2)} GB`;
}

/**
 * Format compute hours
 */
function formatComputeHours(hours: number): string {
  if (hours < 1) {
    return `${Math.round(hours * 60)} min`;
  }
  return `${hours.toFixed(2)} hrs`;
}

export default async function NeonPage() {
  const result = await getNeonProjects();

  if (!result.success) {
    return (
      <div className="container mx-auto p-4 md:p-8 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-black to-gray-600 bg-clip-text text-transparent">
            Neon Databases
          </h1>
          <p className="text-muted-foreground">
            Serverless Postgres databases
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-red-600">Error</CardTitle>
            <CardDescription>{result.error}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Please make sure your Neon API key is configured in Settings.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const projects = result.projects || [];

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-7xl">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-black to-gray-600 bg-clip-text text-transparent">
              Neon Databases
            </h1>
            <p className="text-muted-foreground">
              {projects.length} database project{projects.length !== 1 ? "s" : ""} found
            </p>
          </div>
          <SyncButton
            syncAction="neon"
            label="Sync Neon"
          />
        </div>
      </div>

      {projects.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No Projects Found</CardTitle>
            <CardDescription>
              No Neon database projects found. Click "Sync Neon" to fetch your projects from Neon.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => {
            const statusBadge = getDatabaseStatusBadge(project.status);

            return (
              <Link key={project.id} href={`/resources/neon/${project.neonProjectId}`}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{project.projectName}</CardTitle>
                        <CardDescription>{project.databaseName}</CardDescription>
                      </div>
                      <Badge variant={statusBadge.variant} className={statusBadge.className}>
                        {statusBadge.label}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {/* Region & PostgreSQL Version */}
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground truncate">
                        {project.region} · PostgreSQL {project.postgresVersion}
                      </span>
                    </div>

                    {/* Branches */}
                    <div className="flex items-center gap-2">
                      <Layers className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {project.branchCount} {project.branchCount === 1 ? "branch" : "branches"}
                      </span>
                    </div>

                    {/* Storage Usage */}
                    <div className="flex items-center gap-2">
                      <HardDrive className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {formatStorage(project.storageUsageGB)} storage
                      </span>
                    </div>

                    {/* Compute Hours */}
                    <div className="flex items-center gap-2">
                      <Database className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {formatComputeHours(project.computeHours)} compute
                      </span>
                    </div>

                    {/* Last Synced */}
                    {project.lastSyncedAt && (
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <RelativeTime date={project.lastSyncedAt} prefix="Synced " />
                      </div>
                    )}
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
