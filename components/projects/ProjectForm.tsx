/**
 * FILE-REF: COMP-031-20251128
 *
 * @file ProjectForm.tsx
 * @description Form component for creating and editing projects
 * @category Component
 * @created 2025-11-28
 * @modified 2025-11-28
 *
 * @changelog
 * - 2025-11-28 - Initial project form component (CHG-005)
 *
 * @dependencies
 * - react-hook-form
 * - @hookform/resolvers/zod
 * - COMP-004 (input.tsx)
 * - COMP-005 (label.tsx)
 * - COMP-001 (button.tsx)
 *
 * @see Related files:
 * - LIB-010 (projects.ts)
 * - LIB-023 (validation.ts)
 */

"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { createProject, updateProject } from "@/lib/actions/projects";
import { createProjectSchema, type CreateProjectInput } from "@/lib/utils/validation";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Project, ProjectStatus } from "@prisma/client";
import { X, Plus, Loader2 } from "lucide-react";

interface ProjectFormProps {
  project?: Project;
  onSuccess?: () => void;
}

export function ProjectForm({ project, onSuccess }: ProjectFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tagInput, setTagInput] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<CreateProjectInput>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      name: project?.name || "",
      description: project?.description || "",
      repository: project?.repository || "",
      status: project?.status || ProjectStatus.ACTIVE,
      tags: project?.tags || [],
    },
  });

  const tags = watch("tags") || [];

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setValue("tags", [...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setValue(
      "tags",
      tags.filter((tag) => tag !== tagToRemove)
    );
  };

  const onSubmit = async (data: CreateProjectInput) => {
    setIsSubmitting(true);

    try {
      let result;
      if (project) {
        result = await updateProject({ id: project.id, ...data });
      } else {
        result = await createProject(data);
      }

      if (result.success) {
        toast({
          title: project ? "Project updated" : "Project created",
          description: `"${data.name}" has been ${project ? "updated" : "created"} successfully.`,
        });

        if (onSuccess) {
          onSuccess();
        } else if (!project) {
          router.push("/projects");
        }
      } else {
        toast({
          title: "Error",
          description: result.error || `Failed to ${project ? "update" : "create"} project`,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{project ? "Edit Project" : "Create New Project"}</CardTitle>
        <CardDescription>
          {project ? "Update project information" : "Add a new project to track"}
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">
              Project Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              {...register("name")}
              placeholder="My Awesome Project"
              disabled={isSubmitting}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              {...register("description")}
              placeholder="Brief description of the project..."
              disabled={isSubmitting}
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description.message}</p>
            )}
          </div>

          {/* Repository URL */}
          <div className="space-y-2">
            <Label htmlFor="repository">Repository URL</Label>
            <Input
              id="repository"
              type="url"
              {...register("repository")}
              placeholder="https://github.com/username/repo"
              disabled={isSubmitting}
            />
            {errors.repository && (
              <p className="text-sm text-destructive">{errors.repository.message}</p>
            )}
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <select
              id="status"
              {...register("status")}
              disabled={isSubmitting}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="ACTIVE">Active</option>
              <option value="PAUSED">Paused</option>
              <option value="ARCHIVED">Archived</option>
            </select>
            {errors.status && (
              <p className="text-sm text-destructive">{errors.status.message}</p>
            )}
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label htmlFor="tag-input">Tags</Label>
            <div className="flex gap-2">
              <Input
                id="tag-input"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addTag();
                  }
                }}
                placeholder="Add a tag..."
                disabled={isSubmitting}
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={addTag}
                disabled={isSubmitting || !tagInput.trim()}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="gap-1">
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      disabled={isSubmitting}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}

            {errors.tags && (
              <p className="text-sm text-destructive">{errors.tags.message}</p>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {project ? "Update Project" : "Create Project"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
