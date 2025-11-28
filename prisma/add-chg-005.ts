/**
 * FILE-REF: DB-005-20251128
 *
 * @file add-chg-005.ts
 * @description Script to add CHG-005 changelog entry
 * @category Database
 * @created 2025-11-28
 * @modified 2025-11-28
 */

import { PrismaClient, ChangeCategory, ChangeSeverity } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("📝 Adding CHG-005 changelog entry...");

  const entry = await prisma.changelogEntry.create({
    data: {
      refNumber: "CHG-005",
      title: "Project management system with full CRUD",
      description:
        "Implemented complete project management functionality with create, read, update, and delete operations. Created validation schemas with Zod, server actions for all CRUD operations with revalidation, ProjectCard component with inline delete/archive, ProjectForm component with tags and status management, projects list page with stats dashboard, new project page, and detailed project view page with resource counts and recent changelog. Features include form validation, toast notifications, responsive design, and project status management (Active/Paused/Archived).",
      category: ChangeCategory.FEATURE,
      severity: ChangeSeverity.MAJOR,
      fileChanges: [
        { ref: "LIB-023", path: "lib/utils/validation.ts" },
        { ref: "LIB-010", path: "lib/actions/projects.ts" },
        { ref: "COMP-030", path: "components/projects/ProjectCard.tsx" },
        { ref: "COMP-031", path: "components/projects/ProjectForm.tsx" },
        { ref: "PAGE-003", path: "app/projects/page.tsx" },
        { ref: "PAGE-004", path: "app/projects/[id]/page.tsx" },
        { ref: "PAGE-005", path: "app/projects/new/page.tsx" },
        { ref: "DB-005", path: "prisma/add-chg-005.ts" },
      ],
      author: "Claude Code",
    },
  });

  console.log("✅ CHG-005 entry created:", entry.refNumber);
  console.log("📋 Details:", {
    title: entry.title,
    category: entry.category,
    severity: entry.severity,
    filesChanged: entry.fileChanges,
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
