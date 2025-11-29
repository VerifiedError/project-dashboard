/**
 * FILE-REF: COMP-084-20251129
 *
 * @file SyncButton.tsx
 * @description Generic client component for syncing external service data
 * @category Component
 * @created 2025-11-29
 * @modified 2025-11-29
 *
 * @changelog
 * - 2025-11-29 - Initial generic sync button component
 *
 * @dependencies
 * - Server actions for each service (ngrok, Vercel, Neon, Upstash)
 *
 * @see Related files:
 * - COMP-080 (NgrokSyncButton - service-specific version)
 * - LIB-011 (ngrok server actions)
 * - LIB-015 (vercel server actions)
 */

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { syncNgrokTunnels } from "@/lib/actions/ngrok";
import { syncVercelProjects } from "@/lib/actions/vercel";

type SyncAction = "ngrok" | "vercel" | "neon" | "upstash";

interface SyncButtonProps {
  syncAction: SyncAction;
  label?: string;
  variant?: "default" | "outline" | "ghost" | "link" | "destructive" | "secondary";
  size?: "default" | "sm" | "lg" | "icon";
}

export function SyncButton({
  syncAction,
  label = "Sync Now",
  variant = "outline",
  size = "sm",
}: SyncButtonProps) {
  const [isSyncing, setIsSyncing] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleSync = async () => {
    setIsSyncing(true);

    try {
      let result;

      switch (syncAction) {
        case "ngrok":
          result = await syncNgrokTunnels();
          if (result.success) {
            toast({
              title: "Sync complete",
              description: `Synced ${result.tunnelsCount} tunnel${result.tunnelsCount !== 1 ? 's' : ''}`,
            });
          }
          break;

        case "vercel":
          result = await syncVercelProjects();
          if (result.success) {
            toast({
              title: "Sync complete",
              description: result.message || `Synced ${result.synced} project${result.synced !== 1 ? 's' : ''}`,
            });
          }
          break;

        case "neon":
          // TODO: Implement Neon sync action
          toast({
            title: "Not implemented",
            description: "Neon sync is not implemented yet",
            variant: "destructive",
          });
          setIsSyncing(false);
          return;

        case "upstash":
          // TODO: Implement Upstash sync action
          toast({
            title: "Not implemented",
            description: "Upstash sync is not implemented yet",
            variant: "destructive",
          });
          setIsSyncing(false);
          return;

        default:
          toast({
            title: "Invalid sync action",
            description: "Unknown sync action specified",
            variant: "destructive",
          });
          setIsSyncing(false);
          return;
      }

      if (!result.success) {
        toast({
          title: "Sync failed",
          description: result.error || "Failed to sync data",
          variant: "destructive",
        });
      } else {
        router.refresh();
      }
    } catch (error) {
      toast({
        title: "Sync failed",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSyncing(false);
    }
  };

  // Determine which icon to show - use RefreshCw by default for consistency
  const displayIcon = <RefreshCw className={`mr-2 h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />;

  return (
    <Button
      onClick={handleSync}
      disabled={isSyncing}
      variant={variant}
      size={size}
    >
      {displayIcon}
      {isSyncing ? "Syncing..." : label}
    </Button>
  );
}
