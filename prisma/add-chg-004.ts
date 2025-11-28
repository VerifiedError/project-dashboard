/**
 * FILE-REF: DB-004-20251128
 *
 * @file add-chg-004.ts
 * @description Script to add CHG-004 changelog entry
 * @category Database
 * @created 2025-11-28
 * @modified 2025-11-28
 */

import { PrismaClient, ChangeCategory, ChangeSeverity } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("📝 Adding CHG-004 changelog entry...");

  const entry = await prisma.changelogEntry.create({
    data: {
      refNumber: "CHG-004",
      title: "Core UI components and navigation",
      description:
        "Created essential shadcn/ui components including Input, Label, Skeleton, Toast (with Toaster and useToast hook). Built Header component with responsive navigation (desktop + mobile menu). Updated root layout to include Header and Toaster components. Navigation includes Dashboard, Projects, Resources, Changelog, and Settings links with active state highlighting.",
      category: ChangeCategory.UI,
      severity: ChangeSeverity.MAJOR,
      fileChanges: [
        { ref: "COMP-004", path: "components/ui/input.tsx" },
        { ref: "COMP-005", path: "components/ui/label.tsx" },
        { ref: "COMP-006", path: "components/ui/skeleton.tsx" },
        { ref: "COMP-007", path: "components/ui/toast.tsx" },
        { ref: "COMP-008", path: "components/ui/toaster.tsx" },
        { ref: "COMP-060", path: "components/layout/Header.tsx" },
        { ref: "HOOK-001", path: "hooks/use-toast.ts" },
        { ref: "PAGE-000", path: "app/layout.tsx" },
        { ref: "DB-004", path: "prisma/add-chg-004.ts" },
      ],
      author: "Claude Code",
    },
  });

  console.log("✅ CHG-004 entry created:", entry.refNumber);
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
