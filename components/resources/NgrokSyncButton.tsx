/**
 * FILE-REF: COMP-080-20251128
 *
 * @file NgrokSyncButton.tsx
 * @description Client component for syncing ngrok tunnels
 * @category Component
 * @created 2025-11-28
 * @modified 2025-11-28
 *
 * @changelog
 * - 2025-11-28 - Initial ngrok sync button (CHG-007)
 *
 * @dependencies
 * - LIB-011 (ngrok server actions)
 *
 * @see Related files:
 * - PAGE-007 (ngrok resource page)
 */

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { syncNgrokTunnels } from "@/lib/actions/ngrok";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

export function NgrokSyncButton() {
  const [isSyncing, setIsSyncing] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleSync = async () => {
    setIsSyncing(true);

    try {
      const result = await syncNgrokTunnels();

      if (result.success) {
        toast({
          title: "Sync complete",
          description: `Synced ${result.tunnelsCount} tunnel${result.tunnelsCount !== 1 ? 's' : ''}`,
        });
        router.refresh();
      } else {
        toast({
          title: "Sync failed",
          description: result.error || "Failed to sync tunnels",
          variant: "destructive",
        });
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

  return (
    <Button
      onClick={handleSync}
      disabled={isSyncing}
      variant="outline"
      size="sm"
    >
      <RefreshCw className={`mr-2 h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
      {isSyncing ? "Syncing..." : "Sync Now"}
    </Button>
  );
}
