/**
 * FILE-REF: COMP-092-20251129
 *
 * @file AddDomainDialog.tsx
 * @description Dialog for adding domains to Vercel project
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { addDomain } from "@/lib/actions/vercel";
import { useToast } from "@/hooks/use-toast";

interface AddDomainDialogProps {
  projectId: string;
}

export function AddDomainDialog({ projectId }: AddDomainDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [domain, setDomain] = useState("");
  const [gitBranch, setGitBranch] = useState("");
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!domain) {
      toast({
        title: "Error",
        description: "Please enter a domain name",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const result = await addDomain(projectId, domain, gitBranch || undefined);

      if (result.success) {
        toast({
          title: "Success",
          description: result.message || "Domain added successfully",
        });
        setOpen(false);
        setDomain("");
        setGitBranch("");
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to add domain",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add domain",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Domain
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add Domain</DialogTitle>
            <DialogDescription>
              Add a custom domain to your Vercel project. You'll need to configure DNS records after adding.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="domain">Domain Name</Label>
              <Input
                id="domain"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                placeholder="example.com or subdomain.example.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="gitBranch">Git Branch (Optional)</Label>
              <Input
                id="gitBranch"
                value={gitBranch}
                onChange={(e) => setGitBranch(e.target.value)}
                placeholder="main"
              />
              <p className="text-xs text-muted-foreground">
                Link this domain to a specific git branch for preview deployments
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Adding..." : "Add Domain"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
