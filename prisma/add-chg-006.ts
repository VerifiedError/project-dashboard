/**
 * FILE-REF: DB-006-20251128
 *
 * @file add-chg-006.ts
 * @description Script to add CHG-006 changelog entry
 * @category Database
 * @created 2025-11-28
 * @modified 2025-11-28
 */

import { PrismaClient, ChangeCategory, ChangeSeverity } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("📝 Adding CHG-006 changelog entry...");

  const entry = await prisma.changelogEntry.create({
    data: {
      refNumber: "CHG-006",
      title: "Dashboard home page, settings, and resources overview",
      description:
        "Completely redesigned home page with comprehensive dashboard showing project stats, quick actions panel, recent changelog feed, and connected services overview. Created settings page with API configuration status for all services (ngrok, Vercel, Neon, Upstash) and system settings panel. Built resources overview page with resource type cards and empty state. All pages are fully responsive and integrate with existing project and changelog data.",
      category: ChangeCategory.UI,
      severity: ChangeSeverity.MAJOR,
      fileChanges: [
        { ref: "PAGE-002", path: "app/page.tsx" },
        { ref: "PAGE-012", path: "app/settings/page.tsx" },
        { ref: "PAGE-006", path: "app/resources/page.tsx" },
        { ref: "DB-006", path: "prisma/add-chg-006.ts" },
      ],
      author: "Claude Code",
    },
  });

  console.log("✅ CHG-006 entry created:", entry.refNumber);
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
