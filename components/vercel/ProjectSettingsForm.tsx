/**
 * FILE-REF: COMP-094-20251129
 *
 * @file ProjectSettingsForm.tsx
 * @description Form for updating Vercel project settings
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { updateProjectSettings } from "@/lib/actions/vercel";
import { useToast } from "@/hooks/use-toast";

interface ProjectSettingsFormProps {
  projectId: string;
  initialData: {
    name: string;
    framework?: string | null;
  };
}

export function ProjectSettingsForm({ projectId, initialData }: ProjectSettingsFormProps) {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(initialData.name);
  const [buildCommand, setBuildCommand] = useState("");
  const [devCommand, setDevCommand] = useState("");
  const [installCommand, setInstallCommand] = useState("");
  const [outputDirectory, setOutputDirectory] = useState("");
  const [rootDirectory, setRootDirectory] = useState("");
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await updateProjectSettings(projectId, {
        name,
        buildCommand: buildCommand || null,
        devCommand: devCommand || null,
        installCommand: installCommand || null,
        outputDirectory: outputDirectory || null,
        rootDirectory: rootDirectory || null,
      });

      if (result.success) {
        toast({
          title: "Success",
          description: result.message || "Project settings updated successfully",
        });
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to update project settings",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update project settings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Settings</CardTitle>
        <CardDescription>
          Update your project configuration. Leave fields empty to use default values.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Project Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="my-project"
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="framework">Framework</Label>
            <Input
              id="framework"
              value={initialData.framework || ""}
              disabled
              placeholder="Auto-detected"
            />
            <p className="text-xs text-muted-foreground">
              Framework is auto-detected and cannot be changed
            </p>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="buildCommand">Build Command</Label>
            <Input
              id="buildCommand"
              value={buildCommand}
              onChange={(e) => setBuildCommand(e.target.value)}
              placeholder="npm run build"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="devCommand">Development Command</Label>
            <Input
              id="devCommand"
              value={devCommand}
              onChange={(e) => setDevCommand(e.target.value)}
              placeholder="npm run dev"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="installCommand">Install Command</Label>
            <Input
              id="installCommand"
              value={installCommand}
              onChange={(e) => setInstallCommand(e.target.value)}
              placeholder="npm install"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="outputDirectory">Output Directory</Label>
            <Input
              id="outputDirectory"
              value={outputDirectory}
              onChange={(e) => setOutputDirectory(e.target.value)}
              placeholder=".next"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="rootDirectory">Root Directory</Label>
            <Input
              id="rootDirectory"
              value={rootDirectory}
              onChange={(e) => setRootDirectory(e.target.value)}
              placeholder="./"
            />
          </div>

          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
