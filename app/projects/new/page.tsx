/**
 * FILE-REF: PAGE-005-20251128
 *
 * @file page.tsx
 * @description New project creation page
 * @category Page
 * @created 2025-11-28
 * @modified 2025-11-28
 *
 * @changelog
 * - 2025-11-28 - Initial new project page (CHG-005)
 *
 * @dependencies
 * - COMP-031 (ProjectForm.tsx)
 *
 * @see Related files:
 * - PAGE-003 (projects list page)
 * - LIB-010 (projects.ts)
 */

import { ProjectForm } from "@/components/projects/ProjectForm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NewProjectPage() {
  return (
    <div className="container mx-auto p-4 md:p-8 max-w-3xl">
      {/* Back Button */}
      <Button variant="ghost" asChild className="mb-6">
        <Link href="/projects">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Projects
        </Link>
      </Button>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-primary-600 bg-clip-text text-transparent">
          Create New Project
        </h1>
        <p className="text-muted-foreground">
          Add a new project to start tracking resources and changes
        </p>
      </div>

      {/* Form */}
      <ProjectForm />
    </div>
  );
}
