/**
 * FILE-REF: PAGE-006-20251128
 *
 * @file page.tsx
 * @description Resources overview page
 * @category Page
 * @created 2025-11-28
 * @modified 2025-11-28
 *
 * @changelog
 * - 2025-11-28 - Initial resources page (CHG-006)
 * - 2025-11-28 - Added real ngrok stats (CHG-007)
 *
 * @dependencies
 * - LIB-011 (ngrok.ts)
 *
 * @see Related files:
 * - PAGE-002 (home page)
 * - PAGE-007 (ngrok page)
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Server, Globe, TrendingUp, Database, Zap, Plus } from "lucide-react";
import Link from "next/link";
import { getNgrokStats } from "@/lib/actions/ngrok";

export default async function ResourcesPage() {
  const ngrokStatsResult = await getNgrokStats();
  const ngrokStats = ngrokStatsResult.success ? ngrokStatsResult.stats : { total: 0, active: 0, inactive: 0 };

  const resourceTypes = [
    {
      name: "ngrok Tunnels",
      icon: Globe,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      count: ngrokStats.active,
      description: "Active tunnel connections",
      href: "/resources/ngrok",
    },
    {
      name: "Vercel Deployments",
      icon: TrendingUp,
      color: "text-black",
      bgColor: "bg-gray-50",
      count: 0,
      description: "Production and preview deployments",
      href: "/resources/vercel",
    },
    {
      name: "Neon Databases",
      icon: Database,
      color: "text-green-600",
      bgColor: "bg-green-50",
      count: 0,
      description: "PostgreSQL database instances",
      href: "/resources/neon",
    },
    {
      name: "Upstash Databases",
      icon: Zap,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      count: 0,
      description: "Redis and Kafka instances",
      href: "/resources/upstash",
    },
  ];

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-primary-600 bg-clip-text text-transparent">
          Resources
        </h1>
        <p className="text-muted-foreground">
          Manage all your development resources in one place
        </p>
      </div>

      {/* Resource Types Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        {resourceTypes.map((resource) => {
          const Icon = resource.icon;
          return (
            <Card key={resource.name} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className={`w-12 h-12 rounded-lg ${resource.bgColor} flex items-center justify-center mb-3`}>
                  <Icon className={`h-6 w-6 ${resource.color}`} />
                </div>
                <CardTitle className="text-lg">{resource.name}</CardTitle>
                <CardDescription>{resource.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-3xl font-bold">{resource.count}</div>
                    <p className="text-xs text-muted-foreground">Total</p>
                  </div>
                  <Button asChild variant="ghost" size="sm">
                    <Link href={resource.href}>
                      View
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Empty State */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Server className="h-5 w-5" />
            <CardTitle>No Resources Yet</CardTitle>
          </div>
          <CardDescription>
            Connect your first resource to get started
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Resources are automatically synced when you configure API keys in settings.
              Each resource will be associated with a project for better organization.
            </p>
            <div className="flex gap-2">
              <Button asChild>
                <Link href="/settings">
                  Configure API Keys
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/projects/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Project
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
