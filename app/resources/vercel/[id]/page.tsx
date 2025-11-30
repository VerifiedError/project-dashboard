/**
 * FILE-REF: PAGE-014-20251129
 *
 * @file page.tsx
 * @description Vercel project detail page with full management capabilities
 * @category Page
 * @created 2025-11-29
 * @modified 2025-11-29
 *
 * @changelog
 * - 2025-11-29 - Initial comprehensive detail page implementation
 *
 * @dependencies
 * - LIB-015 (vercel actions)
 * - LIB-002 (vercel API client)
 * - COMP-091 to COMP-097 (Vercel components)
 *
 * @see Related files:
 * - PAGE-008 (Vercel projects list)
 */

import { getDetailedVercelProject } from "@/lib/actions/vercel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  ExternalLink,
  GitBranch,
  Clock,
  Layers,
  Database,
  Globe,
  Settings,
  Rocket
} from "lucide-react";
import Link from "next/link";
import { AddEnvVarDialog } from "@/components/vercel/AddEnvVarDialog";
import { AddDomainDialog } from "@/components/vercel/AddDomainDialog";
import { EnvVarsList } from "@/components/vercel/EnvVarsList";
import { DomainsList } from "@/components/vercel/DomainsList";
import { ProjectSettingsForm } from "@/components/vercel/ProjectSettingsForm";
import { DeploymentActions } from "@/components/vercel/DeploymentActions";

/**
 * Format timestamp to human-readable format
 */
function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleString();
}

/**
 * Format timestamp to relative time
 */
function formatRelativeTime(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return `${seconds}s ago`;
}

/**
 * Get deployment state badge
 */
function getDeploymentStateBadge(state: string) {
  switch (state.toUpperCase()) {
    case "READY":
      return <Badge className="bg-green-600">Ready</Badge>;
    case "BUILDING":
      return <Badge className="bg-blue-600 text-white">Building</Badge>;
    case "ERROR":
    case "FAILED":
      return <Badge variant="destructive">Error</Badge>;
    case "QUEUED":
      return <Badge variant="outline">Queued</Badge>;
    case "CANCELED":
    case "CANCELLED":
      return <Badge variant="outline">Canceled</Badge>;
    default:
      return <Badge variant="outline">{state}</Badge>;
  }
}

interface PageProps {
  params: { id: string };
}

export default async function VercelProjectDetailPage({ params }: PageProps) {
  const result = await getDetailedVercelProject(params.id);

  if (!result.success || !result.data) {
    return (
      <div className="container mx-auto p-4 md:p-8 max-w-7xl">
        <div className="mb-4">
          <Link href="/resources/vercel">
            <Button variant="ghost">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Vercel Projects
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-red-600">Error</CardTitle>
            <CardDescription>{result.error || "Failed to load project details"}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Failed to load project details. Please check your Vercel API token and try again.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { project, envVars, domains, deployments } = result.data;

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-7xl">
      {/* Header */}
      <div className="mb-6">
        <Link href="/resources/vercel">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Vercel Projects
          </Button>
        </Link>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">{project.name}</h1>
            {project.framework && (
              <p className="text-muted-foreground">Framework: {project.framework}</p>
            )}
          </div>
          {project.latestDeployments?.[0] && (
            <Link
              href={`https://${project.latestDeployments[0].url}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button>
                <ExternalLink className="h-4 w-4 mr-2" />
                View Live Site
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">
            <Layers className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="deployments">
            <Rocket className="h-4 w-4 mr-2" />
            Deployments
          </TabsTrigger>
          <TabsTrigger value="env">
            <Database className="h-4 w-4 mr-2" />
            Environment
          </TabsTrigger>
          <TabsTrigger value="domains">
            <Globe className="h-4 w-4 mr-2" />
            Domains
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* Project Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Project Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Project ID</p>
                  <p className="font-mono text-sm">{project.id}</p>
                </div>
                {project.framework && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Framework</p>
                    <p className="text-sm">{project.framework}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Git Repository */}
            {project.link && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Git Repository</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    <GitBranch className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      {project.link.type === "github" ? "GitHub" : project.link.type}
                    </span>
                  </div>
                  {project.link.org && project.link.repo && (
                    <p className="text-sm font-mono">
                      {project.link.org}/{project.link.repo}
                    </p>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Latest Deployment */}
            {project.latestDeployments?.[0] && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Latest Deployment</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    {getDeploymentStateBadge(project.latestDeployments[0].state)}
                    <Badge variant="outline">{project.latestDeployments[0].target}</Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    {formatRelativeTime(project.latestDeployments[0].createdAt)}
                  </div>
                  <a
                    href={`https://${project.latestDeployments[0].url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline truncate block"
                  >
                    {project.latestDeployments[0].url}
                  </a>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Quick Stats */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Deployments</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{deployments.length}</p>
                <p className="text-sm text-muted-foreground">Total deployments</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Environment Variables</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{envVars.length}</p>
                <p className="text-sm text-muted-foreground">Configured variables</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Domains</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{domains.length}</p>
                <p className="text-sm text-muted-foreground">
                  {domains.filter((d) => d.verified).length} verified
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Deployments Tab */}
        <TabsContent value="deployments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Deployments</CardTitle>
              <CardDescription>
                View and manage all deployments for this project
              </CardDescription>
            </CardHeader>
          </Card>

          {deployments.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground">No deployments found</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {deployments.map((deployment) => (
                <Card key={deployment.uid}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          {getDeploymentStateBadge(deployment.state)}
                          <Badge variant="outline">{deployment.target}</Badge>
                        </div>
                        <a
                          href={`https://${deployment.url}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:underline flex items-center gap-1"
                        >
                          {deployment.url}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                        {deployment.meta?.githubCommitMessage && (
                          <p className="text-sm text-muted-foreground">
                            {deployment.meta.githubCommitMessage}
                          </p>
                        )}
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatDate(deployment.created)}
                          </span>
                          {deployment.meta?.githubCommitSha && (
                            <span className="font-mono">
                              {deployment.meta.githubCommitSha.substring(0, 7)}
                            </span>
                          )}
                        </div>
                      </div>
                      <DeploymentActions
                        deploymentId={deployment.uid}
                        projectName={project.name}
                        target={deployment.target as "production" | "preview"}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Environment Variables Tab */}
        <TabsContent value="env" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Environment Variables</h3>
              <p className="text-sm text-muted-foreground">
                Manage environment variables for this project
              </p>
            </div>
            <AddEnvVarDialog projectId={params.id} />
          </div>

          <EnvVarsList projectId={params.id} envVars={envVars} />
        </TabsContent>

        {/* Domains Tab */}
        <TabsContent value="domains" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Custom Domains</h3>
              <p className="text-sm text-muted-foreground">
                Manage custom domains for this project
              </p>
            </div>
            <AddDomainDialog projectId={params.id} />
          </div>

          <DomainsList projectId={params.id} domains={domains} />
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-4">
          <ProjectSettingsForm
            projectId={params.id}
            initialData={{
              name: project.name,
              framework: project.framework,
            }}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
