/**
 * FILE-REF: DB-002-20251128
 *
 * @file seed.ts
 * @description Database seed file with initial data and changelog entries
 * @category Database
 * @created 2025-11-28
 * @modified 2025-11-28
 *
 * @changelog
 * - 2025-11-28 - Initial seed file with Phase 1 changelog entries (CHG-002)
 */

import { PrismaClient, ChangeCategory, ChangeSeverity, UserRole } from "@prisma/client";
import { hashPassword } from "../lib/utils/auth";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...");

  // Clear existing data (be careful in production!)
  await prisma.changelogEntry.deleteMany();
  await prisma.systemSetting.deleteMany();
  await prisma.user.deleteMany();

  console.log("👤 Creating initial user account...");

  // Create user: addison with fixed ID for development
  // Using "temp-user-id" to match the hardcoded userId in API key functions
  const user = await prisma.user.create({
    data: {
      id: "temp-user-id",
      username: "addison",
      password: hashPassword("ac783dac783d"),
      email: "addison@dashboard.local",
      name: "Addison Mikkelson",
      role: UserRole.ADMIN,
      isActive: true,
    },
  });

  console.log("📝 Creating initial changelog entries...");

  // CHG-001: Initial project setup
  await prisma.changelogEntry.create({
    data: {
      refNumber: "CHG-001",
      title: "Initial project setup and foundation",
      description:
        "Set up Next.js 14 with TypeScript, Tailwind CSS, and Prisma. Created comprehensive database schema, environment configuration, and project documentation. Implemented code reference tracking system.",
      category: ChangeCategory.CONFIGURATION,
      severity: ChangeSeverity.MAJOR,
      fileChanges: [
        { ref: "CONFIG-001", path: ".env.local" },
        { ref: "CONFIG-002", path: ".env.example" },
        { ref: "CONFIG-003", path: "next.config.js" },
        { ref: "CONFIG-004", path: "tailwind.config.ts" },
        { ref: "CONFIG-005", path: "tsconfig.json" },
        { ref: "CONFIG-006", path: "package.json" },
        { ref: "CONFIG-007", path: ".eslintrc.json" },
        { ref: "CONFIG-008", path: ".prettierrc" },
        { ref: "STYLE-001", path: "app/globals.css" },
        { ref: "PAGE-000", path: "app/layout.tsx" },
        { ref: "PAGE-002", path: "app/page.tsx" },
        { ref: "DB-001", path: "prisma/schema.prisma" },
      ],
      author: "Claude Code",
    },
  });

  // CHG-002: Database utilities and changelog system
  await prisma.changelogEntry.create({
    data: {
      refNumber: "CHG-002",
      title: "Database utilities and changelog system implementation",
      description:
        "Created Prisma client singleton, application constants, and complete changelog server actions. Set up automatic changelog tracking system that will record all future changes to the application.",
      category: ChangeCategory.FEATURE,
      severity: ChangeSeverity.MAJOR,
      fileChanges: [
        { ref: "LIB-020", path: "lib/utils/db.ts" },
        { ref: "LIB-024", path: "lib/utils/constants.ts" },
        { ref: "LIB-012", path: "lib/actions/changelog.ts" },
        { ref: "DB-002", path: "prisma/seed.ts" },
      ],
      author: "Claude Code",
    },
  });

  console.log("⚙️ Creating system settings...");

  // System settings
  await prisma.systemSetting.create({
    data: {
      key: "app_version",
      value: "0.3.0",
      description: "Current application version",
    },
  });

  await prisma.systemSetting.create({
    data: {
      key: "user_timezone",
      value: "America/Chicago",
      description: "User's preferred timezone for displaying dates and times (CST - Sioux Falls, SD)",
    },
  });

  await prisma.systemSetting.create({
    data: {
      key: "last_sync_ngrok",
      value: new Date().toISOString(),
      description: "Last sync time for ngrok resources",
    },
  });

  await prisma.systemSetting.create({
    data: {
      key: "last_sync_vercel",
      value: new Date().toISOString(),
      description: "Last sync time for Vercel resources",
    },
  });

  await prisma.systemSetting.create({
    data: {
      key: "last_sync_neon",
      value: new Date().toISOString(),
      description: "Last sync time for Neon resources",
    },
  });

  await prisma.systemSetting.create({
    data: {
      key: "last_sync_upstash",
      value: new Date().toISOString(),
      description: "Last sync time for Upstash resources",
    },
  });

  console.log("✅ Seed completed successfully!");
  console.log("📊 Summary:");
  console.log(`  - 1 user created (${user.username})`);
  console.log("  - 2 changelog entries created");
  console.log("  - 5 system settings created");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Seed failed:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
