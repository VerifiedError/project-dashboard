/**
 * FILE-REF: PAGE-014-20251128
 *
 * @file page.tsx
 * @description Project edit page
 * @category Page
 * @created 2025-11-28
 * @modified 2025-11-28
 *
 * @changelog
 * - 2025-11-28 - Initial project edit page
 *
 * @dependencies
 * - LIB-010 (projects.ts)
 * - COMP-031 (ProjectForm.tsx)
 *
 * @see Related files:
 * - PAGE-004 (project detail page)
 * - PAGE-005 (new project page)
 */

import { getProject } from "@/lib/actions/projects";
import { ProjectForm } from "@/components/projects/ProjectForm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { notFound } from "next/navigation";

export default async function EditProjectPage({
  params,
}: {
  params: { id: string };
}) {
  const result = await getProject(params.id);

  if (!result.success || !result.project) {
    notFound();
  }

  const project = result.project;

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-3xl">
      {/* Back Button */}
      <Button variant="ghost" asChild className="mb-6">
        <Link href={`/projects/${params.id}`}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Project
        </Link>
      </Button>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-primary-600 bg-clip-text text-transparent">
          Edit Project
        </h1>
        <p className="text-muted-foreground">
          Update project details and settings
        </p>
      </div>

      {/* Form */}
      <ProjectForm project={project} />
    </div>
  );
}
