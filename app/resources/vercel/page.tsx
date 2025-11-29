/**
 * FILE-REF: PAGE-008-20251129
 *
 * @file page.tsx
 * @description Vercel deployments resource page
 * @category Page
 * @created 2025-11-29
 * @modified 2025-11-29
 *
 * @changelog
 * - 2025-11-29 - Created placeholder page
 * - 2025-11-29 - Implemented full Vercel integration with sync and SyncButton component
 *
 * @dependencies
 * - LIB-015 (vercel actions)
 *
 * @see Related files:
 * - LIB-015 (vercel server actions)
 * - LIB-002 (vercel API client)
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, GitBranch, Clock } from "lucide-react";
import { getVercelProjects } from "@/lib/actions/vercel";
import { SyncButton } from "@/components/shared/SyncButton";
import { BuildStatus } from "@prisma/client";
import Link from "next/link";

/**
 * Map BuildStatus enum to badge variant and color
 */
function getBuildStatusBadge(status: BuildStatus) {
  switch (status) {
    case BuildStatus.READY:
      return { variant: "default" as const, className: "bg-green-600", label: "Ready" };
    case BuildStatus.BUILDING:
      return { variant: "secondary" as const, className: "bg-blue-600 text-white", label: "Building" };
    case BuildStatus.ERROR:
      return { variant: "destructive" as const, className: "", label: "Error" };
    case BuildStatus.QUEUED:
      return { variant: "outline" as const, className: "", label: "Queued" };
    case BuildStatus.CANCELED:
      return { variant: "outline" as const, className: "", label: "Canceled" };
    default:
      return { variant: "outline" as const, className: "", label: "Unknown" };
  }
}

/**
 * Format timestamp to relative time
 */
function formatRelativeTime(date: Date | null): string {
  if (!date) return "Never";

  const now = new Date();
  const diff = now.getTime() - new Date(date).getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return `${seconds}s ago`;
}

export default async function VercelPage() {
  const result = await getVercelProjects();

  if (!result.success) {
    return (
      <div className="container mx-auto p-4 md:p-8 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-black to-gray-600 bg-clip-text text-transparent">
            Vercel Deployments
          </h1>
          <p className="text-muted-foreground">
            Monitor and manage your Vercel deployments
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-red-600">Error</CardTitle>
            <CardDescription>{result.error}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Please make sure your Vercel API token is configured in Settings.
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
              Vercel Deployments
            </h1>
            <p className="text-muted-foreground">
              {projects.length} project{projects.length !== 1 ? "s" : ""} found
            </p>
          </div>
          <SyncButton
            syncAction="vercel"
            label="Sync Vercel"
          />
        </div>
      </div>

      {projects.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No Projects Found</CardTitle>
            <CardDescription>
              No Vercel projects found. Click "Sync Vercel" to fetch your projects from Vercel.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => {
            const statusBadge = getBuildStatusBadge(project.buildStatus);
            const latestDeployment = project.latestDeployment as any;

            return (
              <Card key={project.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{project.name}</CardTitle>
                      {project.framework && (
                        <CardDescription>{project.framework}</CardDescription>
                      )}
                    </div>
                    <Badge variant={statusBadge.variant} className={statusBadge.className}>
                      {statusBadge.label}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {/* Production URL */}
                  {project.productionUrl && (
                    <div className="flex items-center gap-2">
                      <ExternalLink className="h-4 w-4 text-muted-foreground" />
                      <a
                        href={`https://${project.productionUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline truncate"
                      >
                        {project.productionUrl}
                      </a>
                    </div>
                  )}

                  {/* Git Repository */}
                  {project.gitRepo && (
                    <div className="flex items-center gap-2">
                      <GitBranch className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground truncate">
                        {project.gitRepo}
                      </span>
                    </div>
                  )}

                  {/* Last Deployed */}
                  {project.lastDeployedAt && (
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        Deployed {formatRelativeTime(project.lastDeployedAt)}
                      </span>
                    </div>
                  )}

                  {/* Latest Deployment Target */}
                  {latestDeployment?.target && (
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {latestDeployment.target}
                      </Badge>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
