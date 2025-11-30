/**
 * FILE-REF: COMP-095-20251129
 *
 * @file DeploymentActions.tsx
 * @description Action buttons for deployment management (redeploy, delete, view logs)
 * @category Component
 * @created 2025-11-29
 * @modified 2025-11-29
 *
 * @changelog
 * - 2025-11-29 - Initial implementation
 *
 * @dependencies
 * - LIB-015 (vercel actions)
 *
 * @see Related files:
 * - PAGE-014 (Vercel project detail page)
 */

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RotateCw, Trash2, FileText } from "lucide-react";
import { redeployment, removeDeployment, getDeploymentLogs } from "@/lib/actions/vercel";
import { useToast } from "@/hooks/use-toast";
import { DeleteConfirmDialog } from "./DeleteConfirmDialog";

interface DeploymentActionsProps {
  deploymentId: string;
  projectName: string;
  target: "production" | "preview";
}

export function DeploymentActions({ deploymentId, projectName, target }: DeploymentActionsProps) {
  const [redeploying, setRedeploying] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [viewingLogs, setViewingLogs] = useState(false);
  const { toast } = useToast();

  const handleRedeploy = async () => {
    setRedeploying(true);

    try {
      const result = await redeployment(deploymentId, projectName, target === "production" ? "production" : "staging");

      if (result.success) {
        toast({
          title: "Success",
          description: result.message || "Redeployment triggered successfully",
        });
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to trigger redeployment",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to trigger redeployment",
        variant: "destructive",
      });
    } finally {
      setRedeploying(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);

    try {
      const result = await removeDeployment(deploymentId);

      if (result.success) {
        toast({
          title: "Success",
          description: result.message || "Deployment deleted successfully",
        });
        setDeleteDialogOpen(false);
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to delete deployment",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete deployment",
        variant: "destructive",
      });
    } finally {
      setDeleting(false);
    }
  };

  const handleViewLogs = async () => {
    setViewingLogs(true);

    try {
      const result = await getDeploymentLogs(deploymentId);

      if (result.success) {
        console.log("Deployment logs:", result.logs);
        toast({
          title: "Logs Retrieved",
          description: "Check browser console for deployment logs",
        });
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to fetch deployment logs",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to fetch deployment logs",
        variant: "destructive",
      });
    } finally {
      setViewingLogs(false);
    }
  };

  return (
    <>
      <div className="flex gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={handleRedeploy}
          disabled={redeploying}
        >
          <RotateCw className={`h-4 w-4 mr-2 ${redeploying ? "animate-spin" : ""}`} />
          {redeploying ? "Redeploying..." : "Redeploy"}
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={handleViewLogs}
          disabled={viewingLogs}
        >
          <FileText className="h-4 w-4 mr-2" />
          {viewingLogs ? "Loading..." : "Logs"}
        </Button>
        <Button
          size="sm"
          variant="destructive"
          onClick={() => setDeleteDialogOpen(true)}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
        </Button>
      </div>

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDelete}
        title="Delete Deployment"
        description="Are you sure you want to delete this deployment? This action cannot be undone."
        loading={deleting}
      />
    </>
  );
}
