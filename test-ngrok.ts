import { prisma } from "./lib/utils/db";

async function checkNgrok() {
  console.log("🔍 Checking ngrok tunnels in database...\n");

  const tunnels = await prisma.ngrokTunnel.findMany({
    orderBy: { createdAt: "desc" },
  });

  console.log(`📦 Found ${tunnels.length} ngrok tunnels:\n`);

  for (const tunnel of tunnels) {
    console.log(`  • ${tunnel.publicUrl}`);
    console.log(`    Status: ${tunnel.status}`);
    console.log(`    Protocol: ${tunnel.protocol}`);
    console.log(`    Forwarding: ${tunnel.forwardingAddr}`);
    console.log(`    Last synced: ${tunnel.lastSyncedAt.toLocaleString()}\n`);
  }

  // Check stats
  const active = tunnels.filter(t => t.status === "ACTIVE").length;
  const inactive = tunnels.filter(t => t.status === "INACTIVE").length;

  console.log(`\n📊 Stats: ${active} active, ${inactive} inactive, ${tunnels.length} total`);

  await prisma.$disconnect();
}

checkNgrok().catch(console.error);
