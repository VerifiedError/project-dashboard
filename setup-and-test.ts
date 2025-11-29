/**
 * Comprehensive setup and test script for all API integrations
 * This script will:
 * 1. Test ngrok API
 * 2. Test Vercel API (when implemented)
 * 3. Test Neon API (when implemented)
 * 4. Verify database connections
 * 5. Run sync operations
 */

import { PrismaClient } from "@prisma/client";
import { syncNgrokTunnels } from "./lib/actions/ngrok";

const prisma = new PrismaClient();

async function main() {
  console.log("🚀 Starting comprehensive API integration tests...\n");

  // Test 1: Database connection
  console.log("📊 Test 1: Database Connection");
  try {
    const userCount = await prisma.user.count();
    console.log(`  ✅ Database connected (${userCount} users found)\n`);
  } catch (error) {
    console.log(`  ❌ Database connection failed:`, error);
    return;
  }

  // Test 2: Check API keys
  console.log("🔑 Test 2: API Keys Check");
  const keys = await prisma.apiKey.findMany({
    where: { userId: "temp-user-id" },
    select: { service: true, isActive: true },
  });
  console.log(`  Found ${keys.length} API keys:`);
  keys.forEach(k => console.log(`    - ${k.service}: ${k.isActive ? "✅ Active" : "❌ Inactive"}`));
  console.log();

  // Test 3: ngrok sync
  console.log("🌐 Test 3: ngrok Tunnel Sync");
  try {
    const result = await syncNgrokTunnels();
    if (result.success) {
      console.log(`  ✅ Sync successful: ${result.count} tunnels synced`);

      // Show tunnel details
      const tunnels = await prisma.ngrokTunnel.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
      });

      if (tunnels.length > 0) {
        console.log(`\n  📡 Recent Tunnels:`);
        tunnels.forEach(t => {
          console.log(`    • ${t.publicUrl}`);
          console.log(`      Status: ${t.status}, Protocol: ${t.protocol}`);
        });
      }
    } else {
      console.log(`  ❌ Sync failed: ${result.error}`);
    }
  } catch (error) {
    console.log(`  ❌ Sync error:`, error);
  }
  console.log();

  // Test 4: Get stats
  console.log("📈 Test 4: Resource Statistics");
  const ngrokCount = await prisma.ngrokTunnel.count();
  const vercelCount = await prisma.vercelProject.count();
  const neonCount = await prisma.neonDatabase.count();
  const upstashCount = await prisma.upstashDatabase.count();

  console.log(`  ngrok Tunnels: ${ngrokCount}`);
  console.log(`  Vercel Projects: ${vercelCount}`);
  console.log(`  Neon Databases: ${neonCount}`);
  console.log(`  Upstash Databases: ${upstashCount}`);
  console.log();

  console.log("✨ Tests complete!");

  await prisma.$disconnect();
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
