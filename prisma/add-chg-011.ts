/**
 * Add changelog entry CHG-011 for version 0.4.0
 * Complete authentication system implementation
 */

import { PrismaClient, ChangeCategory, ChangeSeverity } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Adding CHG-011: Version 0.4.0 - Authentication System...");

  const entry = await prisma.changelogEntry.create({
    data: {
      refNumber: "CHG-011",
      title: "Version 0.4.0 - Complete Authentication & Multi-User System",
      description: "Implemented complete authentication system with iron-session, login page with email/password authentication, route protection middleware, session management utilities, multi-user API key configuration, debug panel with copy-to-clipboard functionality, and user creation scripts. All API key functions now automatically use authenticated user context. Includes admin user account creation and session-based security.",
      category: ChangeCategory.FEATURE,
      severity: ChangeSeverity.MAJOR,
      author: "System",
      fileChanges: [
        { ref: "LIB-025", path: "lib/utils/session.ts" },
        { ref: "LIB-026", path: "lib/actions/auth.ts" },
        { ref: "PAGE-014", path: "app/login/page.tsx" },
        { ref: "COMP-091", path: "components/auth/LoginForm.tsx" },
        { ref: "CONFIG-009", path: "middleware.ts" },
        { ref: "COMP-090", path: "components/debug/DebugPanel.tsx" },
        { ref: "SCRIPT-001", path: "scripts/create-user.ts" },
        { ref: "SCRIPT-002", path: "scripts/create-admin.ts" },
        { ref: "CONFIG-006", path: "package.json (v0.4.0)" },
      ],
    },
  });

  console.log("✅ Created changelog entry:", entry.refNumber);
  console.log("   Title:", entry.title);
  console.log("   Category:", entry.category);
  console.log("   Severity:", entry.severity);
}

main()
  .catch((e) => {
    console.error("❌ Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
