/**
 * FILE-REF: PAGE-004-20251128
 *
 * @file page.tsx
 * @description Project detail page
 * @category Page
 * @created 2025-11-28
 * @modified 2025-11-28
 *
 * @changelog
 * - 2025-11-28 - Initial project detail page (CHG-005)
 *
 * @dependencies
 * - LIB-010 (projects.ts)
 * - COMP-030 (ProjectCard.tsx)
 * - COMP-050 (ChangelogEntry.tsx)
 *
 * @see Related files:
 * - PAGE-003 (projects list page)
 * - PAGE-005 (new project page)
 */

import { getProject } from "@/lib/actions/projects";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ExternalLink, Edit, FolderKanban, Server, Database, Globe } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatRelativeTime } from "@/lib/utils/cn";

export default async function ProjectDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const result = await getProject(params.id);

  if (!result.success || !result.project) {
    notFound();
  }

  const project = result.project;

  const totalResources =
    project.ngrokTunnels.length +
    project.vercelProjects.length +
    project.neonDatabases.length +
    project.upstashDatabases.length;

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-7xl">
      {/* Back Button */}
      <Button variant="ghost" asChild className="mb-6">
        <Link href="/projects">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Projects
        </Link>
      </Button>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <FolderKanban className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary-600 bg-clip-text text-transparent">
              {project.name}
            </h1>
          </div>
          {project.description && (
            <p className="text-muted-foreground text-lg mb-4">{project.description}</p>
          )}
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">{project.status}</Badge>
            {project.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          {project.repository && (
            <Button asChild variant="outline">
              <a href={project.repository} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" />
                Repository
              </a>
            </Button>
          )}
          <Button asChild>
            <Link href={`/projects/${project.id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Resources</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalResources}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ngrok Tunnels</CardTitle>
            <Globe className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{project.ngrokTunnels.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Deployments</CardTitle>
            <Globe className="h-4 w-4 text-black" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{project.vercelProjects.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Databases</CardTitle>
            <Database className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {project.neonDatabases.length + project.upstashDatabases.length}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Project Info */}
        <Card>
          <CardHeader>
            <CardTitle>Project Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Created</p>
              <p className="text-sm font-medium">
                {formatRelativeTime(project.createdAt)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Last Updated</p>
              <p className="text-sm font-medium">
                {formatRelativeTime(project.updatedAt)}
              </p>
            </div>
            {project.repository && (
              <div>
                <p className="text-sm text-muted-foreground">Repository</p>
                <a
                  href={project.repository}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-primary hover:underline flex items-center gap-1"
                >
                  {project.repository}
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Changelog */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Changes</CardTitle>
            <CardDescription>
              Latest updates to this project
            </CardDescription>
          </CardHeader>
          <CardContent>
            {project.changelog.length === 0 ? (
              <p className="text-sm text-muted-foreground">No changes yet</p>
            ) : (
              <div className="space-y-3">
                {project.changelog.slice(0, 5).map((entry) => (
                  <div key={entry.id} className="text-sm border-l-2 border-primary pl-3 py-1">
                    <p className="font-medium">{entry.title}</p>
                    <p className="text-muted-foreground text-xs">
                      {formatRelativeTime(entry.createdAt)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Resources Section */}
      {totalResources === 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>No Resources Yet</CardTitle>
            <CardDescription>
              Connect resources to this project to track them here
            </CardDescription>
          </CardHeader>
        </Card>
      )}
    </div>
  );
}
