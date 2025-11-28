/**
 * FILE-REF: PAGE-002-20251128
 *
 * @file page.tsx
 * @description Dashboard home page with stats and overview
 * @category Page
 * @created 2025-11-28
 * @modified 2025-11-28
 *
 * @changelog
 * - 2025-11-28 - Initial homepage placeholder (CHG-001)
 * - 2025-11-28 - Updated with full dashboard (CHG-006)
 * - 2025-11-28 - Added real ngrok stats (CHG-007)
 *
 * @dependencies
 * - LIB-010 (projects.ts)
 * - LIB-011 (ngrok.ts)
 * - LIB-012 (changelog.ts)
 *
 * @see Related files:
 * - PAGE-000 (layout.tsx)
 * - PAGE-003 (projects page)
 * - PAGE-007 (ngrok page)
 */

import Link from "next/link";
import { getProjectStats } from "@/lib/actions/projects";
import { getChangelogEntries } from "@/lib/actions/changelog";
import { getNgrokStats } from "@/lib/actions/ngrok";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FolderKanban,
  Plus,
  TrendingUp,
  Activity,
  Server,
  Database,
  Globe,
  Zap,
  ArrowRight,
  List,
} from "lucide-react";
import { formatRelativeTime } from "@/lib/utils/cn";

export default async function Home() {
  const [statsResult, changelogResult, ngrokStatsResult] = await Promise.all([
    getProjectStats(),
    getChangelogEntries({ limit: 5 }),
    getNgrokStats(),
  ]);

  const stats = statsResult.success ? statsResult.stats : null;
  const recentChanges = changelogResult.success ? changelogResult.entries : [];
  const ngrokStats = ngrokStatsResult.success ? ngrokStatsResult.stats : { total: 0, active: 0, inactive: 0 };

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-7xl">
      {/* Hero Section */}
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-primary to-primary-600 bg-clip-text text-transparent">
          DevOps Dashboard
        </h1>
        <p className="text-lg text-muted-foreground">
          Centralized monitoring and management for all your development resources
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
            <FolderKanban className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total || 0}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.active || 0} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ngrok Tunnels</CardTitle>
            <Globe className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ngrokStats.active}</div>
            <p className="text-xs text-muted-foreground">
              {ngrokStats.active === 0 ? 'Ready to connect' : `${ngrokStats.inactive} inactive`}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Deployments</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              Vercel projects
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Databases</CardTitle>
            <Database className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              Neon + Upstash
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Get started with common tasks
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button asChild className="w-full justify-start" variant="outline">
              <Link href="/projects/new">
                <Plus className="mr-2 h-4 w-4" />
                Create New Project
              </Link>
            </Button>
            <Button asChild className="w-full justify-start" variant="outline">
              <Link href="/projects">
                <FolderKanban className="mr-2 h-4 w-4" />
                View All Projects
              </Link>
            </Button>
            <Button asChild className="w-full justify-start" variant="outline">
              <Link href="/resources">
                <Server className="mr-2 h-4 w-4" />
                Manage Resources
              </Link>
            </Button>
            <Button asChild className="w-full justify-start" variant="outline">
              <Link href="/settings">
                <Activity className="mr-2 h-4 w-4" />
                Configure Settings
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Recent Changes */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Changes</CardTitle>
                <CardDescription>
                  Latest updates to the system
                </CardDescription>
              </div>
              <Button asChild variant="ghost" size="sm">
                <Link href="/changelog">
                  <List className="mr-2 h-4 w-4" />
                  View All
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {recentChanges.length === 0 ? (
              <p className="text-sm text-muted-foreground">No changes yet</p>
            ) : (
              <div className="space-y-3">
                {recentChanges.map((entry) => (
                  <div key={entry.id} className="flex items-start gap-3 border-l-2 border-primary pl-3 py-1">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <code className="text-xs font-mono bg-muted px-1.5 py-0.5 rounded">
                          {entry.refNumber}
                        </code>
                        <Badge variant="outline" className="text-xs">
                          {entry.category}
                        </Badge>
                      </div>
                      <p className="text-sm font-medium line-clamp-1">{entry.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatRelativeTime(entry.createdAt)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Services Overview */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Connected Services</CardTitle>
          <CardDescription>
            Integrate with your development tools and services
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-center gap-3 p-4 border rounded-lg">
              <Globe className="h-8 w-8 text-blue-600" />
              <div>
                <h3 className="font-semibold">ngrok</h3>
                <p className="text-xs text-muted-foreground">Tunnel monitoring</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 border rounded-lg">
              <TrendingUp className="h-8 w-8 text-black" />
              <div>
                <h3 className="font-semibold">Vercel</h3>
                <p className="text-xs text-muted-foreground">Deployments</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 border rounded-lg">
              <Database className="h-8 w-8 text-green-600" />
              <div>
                <h3 className="font-semibold">Neon</h3>
                <p className="text-xs text-muted-foreground">PostgreSQL</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 border rounded-lg">
              <Zap className="h-8 w-8 text-purple-600" />
              <div>
                <h3 className="font-semibold">Upstash</h3>
                <p className="text-xs text-muted-foreground">Redis & Kafka</p>
              </div>
            </div>
          </div>

          <div className="mt-4 flex justify-center">
            <Button asChild variant="outline">
              <Link href="/settings">
                Configure API Keys
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
