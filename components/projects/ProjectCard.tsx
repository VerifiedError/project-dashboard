/**
 * FILE-REF: COMP-030-20251128
 *
 * @file ProjectCard.tsx
 * @description Card component for displaying project information
 * @category Component
 * @created 2025-11-28
 * @modified 2025-11-28
 *
 * @changelog
 * - 2025-11-28 - Initial project card component (CHG-005)
 *
 * @dependencies
 * - next/link
 * - lucide-react
 * - COMP-002 (card.tsx)
 * - COMP-003 (badge.tsx)
 *
 * @see Related files:
 * - LIB-010 (projects.ts)
 * - PAGE-003 (projects page)
 */

"use client";

import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FolderKanban, ExternalLink, Trash2, Archive, Play, Pause } from "lucide-react";
import { Project } from "@prisma/client";
import { formatRelativeTime } from "@/lib/utils/cn";
import { deleteProject, updateProject } from "@/lib/actions/projects";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

interface ProjectCardProps {
  project: Project & {
    _count?: {
      ngrokTunnels: number;
      vercelProjects: number;
      neonDatabases: number;
      upstashDatabases: number;
    };
  };
  onUpdate?: () => void;
}

const statusColors = {
  ACTIVE: "bg-green-500/10 text-green-700 border-green-200",
  PAUSED: "bg-yellow-500/10 text-yellow-700 border-yellow-200",
  ARCHIVED: "bg-gray-500/10 text-gray-700 border-gray-200",
} as const;

const statusIcons = {
  ACTIVE: Play,
  PAUSED: Pause,
  ARCHIVED: Archive,
} as const;

export function ProjectCard({ project, onUpdate }: ProjectCardProps) {
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const totalResources =
    (project._count?.ngrokTunnels || 0) +
    (project._count?.vercelProjects || 0) +
    (project._count?.neonDatabases || 0) +
    (project._count?.upstashDatabases || 0);

  const StatusIcon = statusIcons[project.status];

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${project.name}"?`)) {
      return;
    }

    setIsDeleting(true);
    const result = await deleteProject(project.id);

    if (result.success) {
      toast({
        title: "Project deleted",
        description: `"${project.name}" has been deleted successfully.`,
      });
      onUpdate?.();
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to delete project",
        variant: "destructive",
      });
    }
    setIsDeleting(false);
  };

  const handleArchive = async () => {
    setIsUpdating(true);
    const newStatus = project.status === "ARCHIVED" ? "ACTIVE" : "ARCHIVED";

    const result = await updateProject({
      id: project.id,
      status: newStatus,
    });

    if (result.success) {
      toast({
        title: newStatus === "ARCHIVED" ? "Project archived" : "Project restored",
        description: `"${project.name}" has been ${newStatus === "ARCHIVED" ? "archived" : "restored"}.`,
      });
      onUpdate?.();
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to update project",
        variant: "destructive",
      });
    }
    setIsUpdating(false);
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <FolderKanban className="h-5 w-5 text-primary" />
            <CardTitle className="text-xl">
              <Link href={`/projects/${project.id}`} className="hover:underline">
                {project.name}
              </Link>
            </CardTitle>
          </div>
          <Badge variant="outline" className={statusColors[project.status]}>
            <StatusIcon className="h-3 w-3 mr-1" />
            {project.status}
          </Badge>
        </div>
        {project.description && (
          <CardDescription className="line-clamp-2">{project.description}</CardDescription>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Tags */}
        {project.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {project.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex flex-col">
            <span className="text-muted-foreground">Resources</span>
            <span className="font-semibold">{totalResources}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-muted-foreground">Created</span>
            <span className="font-semibold">{formatRelativeTime(project.createdAt)}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex gap-2">
        <Button asChild variant="outline" size="sm" className="flex-1">
          <Link href={`/projects/${project.id}`}>
            View Details
          </Link>
        </Button>

        {project.repository && (
          <Button
            asChild
            variant="ghost"
            size="sm"
          >
            <a
              href={project.repository}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
        )}

        <Button
          variant="ghost"
          size="sm"
          onClick={handleArchive}
          disabled={isUpdating}
        >
          <Archive className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleDelete}
          disabled={isDeleting}
        >
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      </CardFooter>
    </Card>
  );
}
