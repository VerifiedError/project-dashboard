/**
 * FILE-REF: DB-007-20251128
 *
 * @file add-chg-007.ts
 * @description Script to add CHG-007 changelog entry
 * @category Database
 * @created 2025-11-28
 * @modified 2025-11-28
 */

import { PrismaClient, ChangeCategory, ChangeSeverity } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("📝 Adding CHG-007 changelog entry...");

  const entry = await prisma.changelogEntry.create({
    data: {
      refNumber: "CHG-007",
      title: "ngrok API integration with tunnel monitoring",
      description:
        "Complete ngrok integration with API client, server actions, and dedicated resource page. Implemented automatic tunnel syncing, status tracking, and real-time stats display. Added ngrok tunnel cards showing public URL, protocol, forwarding address, region, and connection counts. Integrated stats into dashboard and resources overview pages. Includes sync button with loading states and toast notifications.",
      category: ChangeCategory.API,
      severity: ChangeSeverity.MAJOR,
      fileChanges: [
        { ref: "LIB-001", path: "lib/api/ngrok.ts" },
        { ref: "LIB-011", path: "lib/actions/ngrok.ts" },
        { ref: "PAGE-007", path: "app/resources/ngrok/page.tsx" },
        { ref: "COMP-080", path: "components/resources/NgrokSyncButton.tsx" },
        { ref: "PAGE-002", path: "app/page.tsx" },
        { ref: "PAGE-006", path: "app/resources/page.tsx" },
        { ref: "DB-007", path: "prisma/add-chg-007.ts" },
      ],
      author: "Claude Code",
    },
  });

  console.log("✅ CHG-007 entry created:", entry.refNumber);
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
