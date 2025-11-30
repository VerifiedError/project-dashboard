/**
 * FILE-REF: COMP-096-20251129
 *
 * @file EnvVarsList.tsx
 * @description List of environment variables with delete action
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, Eye, EyeOff } from "lucide-react";
import { removeEnvVariable } from "@/lib/actions/vercel";
import { useToast } from "@/hooks/use-toast";
import { DeleteConfirmDialog } from "./DeleteConfirmDialog";

interface EnvVar {
  id: string;
  key: string;
  value: string;
  type: string;
  target: string[];
}

interface EnvVarsListProps {
  projectId: string;
  envVars: EnvVar[];
}

export function EnvVarsList({ projectId, envVars }: EnvVarsListProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedEnvId, setSelectedEnvId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [revealedValues, setRevealedValues] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  const handleDelete = async () => {
    if (!selectedEnvId) return;

    setDeleting(true);

    try {
      const result = await removeEnvVariable(projectId, selectedEnvId);

      if (result.success) {
        toast({
          title: "Success",
          description: result.message || "Environment variable removed successfully",
        });
        setDeleteDialogOpen(false);
        setSelectedEnvId(null);
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to remove environment variable",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to remove environment variable",
        variant: "destructive",
      });
    } finally {
      setDeleting(false);
    }
  };

  const toggleReveal = (id: string) => {
    setRevealedValues((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  if (envVars.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Environment Variables</CardTitle>
          <CardDescription>No environment variables configured for this project.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <>
      <div className="space-y-3">
        {envVars.map((env) => {
          const isRevealed = revealedValues.has(env.id);

          return (
            <Card key={env.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-2">
                    <div>
                      <p className="font-mono font-semibold">{env.key}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="font-mono text-sm text-muted-foreground">
                          {isRevealed ? env.value : "•".repeat(20)}
                        </p>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => toggleReveal(env.id)}
                        >
                          {isRevealed ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {env.target.map((target) => (
                        <Badge key={target} variant="outline" className="text-xs">
                          {target}
                        </Badge>
                      ))}
                      <Badge variant="secondary" className="text-xs">
                        {env.type}
                      </Badge>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => {
                      setSelectedEnvId(env.id);
                      setDeleteDialogOpen(true);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDelete}
        title="Delete Environment Variable"
        description="Are you sure you want to delete this environment variable? This action cannot be undone."
        loading={deleting}
      />
    </>
  );
}
