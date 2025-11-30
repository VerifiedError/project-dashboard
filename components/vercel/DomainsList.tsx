/**
 * FILE-REF: COMP-097-20251129
 *
 * @file DomainsList.tsx
 * @description List of domains with delete action and verification status
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
import { Trash2, ExternalLink, CheckCircle, XCircle } from "lucide-react";
import { removeDomain } from "@/lib/actions/vercel";
import { useToast } from "@/hooks/use-toast";
import { DeleteConfirmDialog } from "./DeleteConfirmDialog";

interface Domain {
  name: string;
  verified: boolean;
  gitBranch?: string | null;
  createdAt?: number;
}

interface DomainsListProps {
  projectId: string;
  domains: Domain[];
}

export function DomainsList({ projectId, domains }: DomainsListProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const { toast } = useToast();

  const handleDelete = async () => {
    if (!selectedDomain) return;

    setDeleting(true);

    try {
      const result = await removeDomain(projectId, selectedDomain);

      if (result.success) {
        toast({
          title: "Success",
          description: result.message || "Domain removed successfully",
        });
        setDeleteDialogOpen(false);
        setSelectedDomain(null);
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to remove domain",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to remove domain",
        variant: "destructive",
      });
    } finally {
      setDeleting(false);
    }
  };

  if (domains.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Domains</CardTitle>
          <CardDescription>No custom domains configured for this project.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <>
      <div className="space-y-3">
        {domains.map((domain) => (
          <Card key={domain.name}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <a
                      href={`https://${domain.name}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold hover:underline flex items-center gap-1"
                    >
                      {domain.name}
                      <ExternalLink className="h-4 w-4" />
                    </a>
                    {domain.verified ? (
                      <Badge variant="default" className="bg-green-600">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    ) : (
                      <Badge variant="destructive">
                        <XCircle className="h-3 w-3 mr-1" />
                        Not Verified
                      </Badge>
                    )}
                  </div>
                  {domain.gitBranch && (
                    <div>
                      <Badge variant="outline" className="text-xs">
                        Branch: {domain.gitBranch}
                      </Badge>
                    </div>
                  )}
                  {domain.createdAt && (
                    <p className="text-xs text-muted-foreground">
                      Added {new Date(domain.createdAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => {
                    setSelectedDomain(domain.name);
                    setDeleteDialogOpen(true);
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDelete}
        title="Remove Domain"
        description={`Are you sure you want to remove ${selectedDomain}? This action cannot be undone.`}
        loading={deleting}
      />
    </>
  );
}
