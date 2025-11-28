/**
 * FILE-REF: PAGE-007-20251128
 *
 * @file page.tsx
 * @description ngrok tunnels resource page
 * @category Page
 * @created 2025-11-28
 * @modified 2025-11-28
 *
 * @changelog
 * - 2025-11-28 - Initial ngrok resource page (CHG-007)
 *
 * @dependencies
 * - LIB-001 (ngrok API client)
 * - LIB-011 (ngrok server actions)
 *
 * @see Related files:
 * - PAGE-006 (resources overview)
 */

import { getNgrokTunnels, getNgrokStats, checkNgrokStatus } from "@/lib/actions/ngrok";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Globe, ExternalLink, AlertCircle, CheckCircle2, XCircle } from "lucide-react";
import Link from "next/link";
import { NgrokSyncButton } from "@/components/resources/NgrokSyncButton";
import { formatRelativeTime } from "@/lib/utils/cn";

export default async function NgrokPage() {
  const [tunnelsResult, statsResult, statusResult] = await Promise.all([
    getNgrokTunnels(),
    getNgrokStats(),
    checkNgrokStatus(),
  ]);

  const tunnels = (tunnelsResult.success ? tunnelsResult.tunnels : []) ?? [];
  const stats = statsResult.success ? statsResult.stats : { total: 0, active: 0, inactive: 0 };
  const status = statusResult.success ? statusResult : { configured: false, connected: false };

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              ngrok Tunnels
            </h1>
            <p className="text-muted-foreground">
              Monitor and manage your ngrok tunnel connections
            </p>
          </div>
          <NgrokSyncButton />
        </div>

        {/* Status Banner */}
        {!status.configured && (
          <div className="mb-6 p-4 border border-yellow-200 bg-yellow-50 rounded-lg flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-yellow-900">ngrok Not Configured</h3>
              <p className="text-sm text-yellow-800 mt-1">
                Add your ngrok API key in settings to start tracking tunnels.
              </p>
              <Button asChild variant="outline" size="sm" className="mt-3">
                <Link href="/settings">
                  Configure API Key
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tunnels</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              All time tracked
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.active}</div>
            <p className="text-xs text-muted-foreground">
              Currently running
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inactive</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.inactive}</div>
            <p className="text-xs text-muted-foreground">
              No longer active
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tunnels List */}
      {tunnels.length === 0 ? (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              <CardTitle>No Tunnels Found</CardTitle>
            </div>
            <CardDescription>
              {status.configured
                ? "Start an ngrok tunnel to see it here. Use the sync button to fetch latest data."
                : "Configure your ngrok API key to start tracking tunnels."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Tunnels are automatically synced from your ngrok account when you click the sync button.
                Each tunnel will show its public URL, protocol, forwarding address, and status.
              </p>
              <div className="flex gap-2">
                {status.configured ? (
                  <NgrokSyncButton />
                ) : (
                  <Button asChild>
                    <Link href="/settings">
                      Configure API Key
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {tunnels.map((tunnel) => (
            <Card key={tunnel.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <code className="text-xs font-mono bg-muted px-1.5 py-0.5 rounded">
                        {tunnel.ngrokId.slice(0, 12)}...
                      </code>
                      <Badge
                        variant={tunnel.status === "ACTIVE" ? "default" : "outline"}
                        className={tunnel.status === "ACTIVE" ? "bg-green-600" : ""}
                      >
                        {tunnel.status}
                      </Badge>
                      {tunnel.project && (
                        <Badge variant="outline" className="text-xs">
                          {tunnel.project.name}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mb-1">
                      <Globe className="h-4 w-4 text-blue-600" />
                      <a
                        href={tunnel.publicUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-sm hover:underline flex items-center gap-1"
                      >
                        {tunnel.publicUrl}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 md:grid-cols-2">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Protocol</p>
                    <p className="text-sm font-medium uppercase">{tunnel.protocol}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Forwarding To</p>
                    <p className="text-sm font-mono">{tunnel.forwardingAddr}</p>
                  </div>
                  {tunnel.region && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Region</p>
                      <p className="text-sm">{tunnel.region}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Last Synced</p>
                    <p className="text-sm">{formatRelativeTime(tunnel.lastSyncedAt)}</p>
                  </div>
                  {tunnel.connectionCount > 0 && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Connections</p>
                      <p className="text-sm font-medium">{tunnel.connectionCount.toLocaleString()}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Created</p>
                    <p className="text-sm">{formatRelativeTime(tunnel.createdAt)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
