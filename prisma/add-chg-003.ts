/**
 * FILE-REF: DB-003-20251128
 *
 * @file add-chg-003.ts
 * @description Script to add CHG-003 changelog entry
 * @category Database
 * @created 2025-11-28
 * @modified 2025-11-28
 */

import { PrismaClient, ChangeCategory, ChangeSeverity } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("📝 Adding CHG-003 changelog entry...");

  const entry = await prisma.changelogEntry.create({
    data: {
      refNumber: "CHG-003",
      title: "Changelog viewer page and components",
      description:
        "Created complete changelog viewing system with timeline view, entry display component, and live database integration. Includes PAGE-011 (changelog page), COMP-050 (ChangelogEntry component), and COMP-003 (Badge component). Successfully tested with live data from Neon PostgreSQL database.",
      category: ChangeCategory.FEATURE,
      severity: ChangeSeverity.MAJOR,
      fileChanges: [
        { ref: "PAGE-011", path: "app/changelog/page.tsx" },
        { ref: "COMP-050", path: "components/changelog/ChangelogEntry.tsx" },
        { ref: "COMP-003", path: "components/ui/badge.tsx" },
        { ref: "DB-003", path: "prisma/add-chg-003.ts" },
      ],
      author: "Claude Code",
    },
  });

  console.log("✅ CHG-003 entry created:", entry.refNumber);
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
