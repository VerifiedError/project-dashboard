/**
 * FILE-REF: COMP-091-20251129
 *
 * @file AddEnvVarDialog.tsx
 * @description Dialog for adding environment variables to Vercel project
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
import { addEnvVariable } from "@/lib/actions/vercel";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

interface AddEnvVarDialogProps {
  projectId: string;
}

export function AddEnvVarDialog({ projectId }: AddEnvVarDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [key, setKey] = useState("");
  const [value, setValue] = useState("");
  const [targets, setTargets] = useState<("production" | "preview" | "development")[]>(["production"]);
  const { toast } = useToast();

  const toggleTarget = (target: "production" | "preview" | "development") => {
    setTargets((prev) =>
      prev.includes(target) ? prev.filter((t) => t !== target) : [...prev, target]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!key || !value || targets.length === 0) {
      toast({
        title: "Error",
        description: "Please fill in all fields and select at least one target environment",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const result = await addEnvVariable(projectId, {
        key,
        value,
        target: targets,
        type: "encrypted",
      });

      if (result.success) {
        toast({
          title: "Success",
          description: result.message || "Environment variable added successfully",
        });
        setOpen(false);
        setKey("");
        setValue("");
        setTargets(["production"]);
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to add environment variable",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add environment variable",
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
          Add Variable
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add Environment Variable</DialogTitle>
            <DialogDescription>
              Add a new environment variable to your Vercel project. The variable will be encrypted.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="key">Key</Label>
              <Input
                id="key"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                placeholder="DATABASE_URL"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="value">Value</Label>
              <Input
                id="value"
                type="password"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Enter value..."
                required
              />
            </div>
            <div className="grid gap-2">
              <Label>Target Environments</Label>
              <div className="flex gap-2">
                <Badge
                  variant={targets.includes("production") ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => toggleTarget("production")}
                >
                  Production
                </Badge>
                <Badge
                  variant={targets.includes("preview") ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => toggleTarget("preview")}
                >
                  Preview
                </Badge>
                <Badge
                  variant={targets.includes("development") ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => toggleTarget("development")}
                >
                  Development
                </Badge>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Adding..." : "Add Variable"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
