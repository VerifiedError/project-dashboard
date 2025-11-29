/**
 * FILE-REF: PAGE-013-20251128
 *
 * @file page.tsx
 * @description Debug log viewer page for searching and viewing debug logs
 * @category Page
 * @created 2025-11-28
 * @modified 2025-11-28
 *
 * @changelog
 * - 2025-11-28 - Initial debug log viewer page (CHG-009)
 *
 * @dependencies
 * - next
 * - react
 * - LIB-026 (debug actions)
 * - COMP-084 (DebugModal)
 *
 * @see Related files:
 * - LIB-025 (debug-logger.ts)
 * - COMP-081 (ApiKeyDialog)
 */

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { DebugModal } from "@/components/shared/DebugModal";
import { Search, AlertCircle, Clock, Tag, User } from "lucide-react";
import { getDebugLog, listDebugLogs, getDebugLogStats } from "@/lib/actions/debug";
import type { DebugLog } from "@/lib/utils/debug-logger";

export default function DebugLogViewer() {
  const [refId, setRefId] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [selectedLog, setSelectedLog] = useState<DebugLog | null>(null);
  const [recentLogs, setRecentLogs] = useState<Array<{
    id: string;
    refId: string;
    timestamp: Date;
    level: string;
    category: string;
    message: string;
    userId?: string;
    component?: string;
    resolved: boolean;
  }> | null>(null);
  const [stats, setStats] = useState<{
    total: number;
    byLevel: Record<string, number>;
    byCategory: Record<string, number>;
    unresolved: number;
    last24Hours: number;
  } | null>(null);
  const [isLoadingRecent, setIsLoadingRecent] = useState(false);
  const { toast } = useToast();

  const handleSearch = async () => {
    if (!refId || refId.trim().length === 0) {
      toast({
        title: "Error",
        description: "Please enter a reference ID",
        variant: "destructive",
      });
      return;
    }

    setIsSearching(true);

    try {
      const result = await getDebugLog(refId.trim());

      if (result.success && result.log) {
        setSelectedLog({
          id: result.log.id,
          refId: result.log.refId,
          timestamp: result.log.timestamp,
          level: result.log.level.toLowerCase() as DebugLog["level"],
          category: result.log.category.toLowerCase().replace("_", "-") as DebugLog["category"],
          message: result.log.message,
          details: result.log.details,
          stack: result.log.stack,
          userId: result.log.userId,
          context: {
            component: result.log.component,
            action: result.log.action,
            file: result.log.file,
            line: result.log.line,
          },
        });
      } else {
        toast({
          title: "Not Found",
          description: result.error || `No debug log found with ID: ${refId}`,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to search for debug log",
        variant: "destructive",
      });
      console.error("Search error:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const loadRecentLogs = async () => {
    setIsLoadingRecent(true);

    try {
      const [logsResult, statsResult] = await Promise.all([
        listDebugLogs({ limit: 10 }),
        getDebugLogStats(),
      ]);

      if (logsResult.success && logsResult.logs) {
        setRecentLogs(logsResult.logs);
      }

      if (statsResult.success && statsResult.stats) {
        setStats(statsResult.stats);
      }
    } catch (error) {
      console.error("Failed to load recent logs:", error);
    } finally {
      setIsLoadingRecent(false);
    }
  };

  const handleLogClick = (log: typeof recentLogs extends (infer U)[] | null ? U : never) => {
    setSelectedLog({
      id: log.id,
      refId: log.refId,
      timestamp: log.timestamp,
      level: log.level.toLowerCase() as DebugLog["level"],
      category: log.category.toLowerCase().replace("_", "-") as DebugLog["category"],
      message: log.message,
      userId: log.userId,
      context: {
        component: log.component,
      },
    });
  };

  const getLevelBadgeVariant = (level: string): "destructive" | "secondary" | "outline" | "default" => {
    switch (level.toLowerCase()) {
      case "critical":
      case "error":
        return "destructive";
      case "warn":
        return "secondary";
      case "debug":
        return "outline";
      default:
        return "default";
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Debug Log Viewer</h1>
        <p className="text-muted-foreground">
          Search and view debug logs by reference ID
        </p>
      </div>

      {/* Search Section */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Search by Reference ID</CardTitle>
          <CardDescription>
            Enter a debug reference ID (e.g., DBG-20251128-A1B2C3) to view full details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <div className="flex-1">
              <Label htmlFor="refId" className="sr-only">
                Reference ID
              </Label>
              <Input
                id="refId"
                type="text"
                placeholder="DBG-20251128-A1B2C3"
                value={refId}
                onChange={(e) => setRefId(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                disabled={isSearching}
              />
            </div>
            <Button onClick={handleSearch} disabled={isSearching}>
              {isSearching ? (
                <>
                  <Search className="mr-2 h-4 w-4 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Search
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats Section */}
      {stats && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Logs</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Unresolved</CardTitle>
              <AlertCircle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.unresolved}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Last 24 Hours</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.last24Hours}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Critical Errors</CardTitle>
              <AlertCircle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {(stats.byLevel.CRITICAL || 0) + (stats.byLevel.ERROR || 0)}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Recent Logs Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Debug Logs</CardTitle>
              <CardDescription>Last 10 debug logs in the system</CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={loadRecentLogs}
              disabled={isLoadingRecent}
            >
              {isLoadingRecent ? "Loading..." : "Refresh"}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoadingRecent ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-6 w-full" />
                </div>
              ))}
            </div>
          ) : recentLogs && recentLogs.length > 0 ? (
            <div className="space-y-3">
              {recentLogs.map((log) => (
                <div
                  key={log.id}
                  className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-3 rounded-md border cursor-pointer hover:bg-accent transition-colors"
                  onClick={() => handleLogClick(log)}
                >
                  <div className="flex gap-2 items-center min-w-fit">
                    <Badge variant={getLevelBadgeVariant(log.level)}>
                      {log.level}
                    </Badge>
                    <Badge variant="outline">{log.category}</Badge>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{log.message}</p>
                    <div className="flex gap-3 text-xs text-muted-foreground mt-1">
                      <span className="flex items-center gap-1">
                        <Tag className="h-3 w-3" />
                        {log.refId}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(log.timestamp).toLocaleString()}
                      </span>
                      {log.userId && (
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {log.userId}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>No debug logs found.</p>
              <Button
                variant="link"
                onClick={loadRecentLogs}
                className="mt-2"
              >
                Load Recent Logs
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Debug Modal */}
      <DebugModal
        isOpen={!!selectedLog}
        onClose={() => setSelectedLog(null)}
        debugLog={selectedLog}
      />
    </div>
  );
}
