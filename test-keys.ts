import { prisma } from "./lib/utils/db";
import { decrypt } from "./lib/utils/encryption";

async function checkKeys() {
  console.log("🔍 Checking API keys in database...\n");

  // Check for user
  const user = await prisma.user.findUnique({
    where: { id: "temp-user-id" },
  });
  console.log("User:", user ? `✅ ${user.username}` : "❌ Not found");

  // Get all API keys
  const keys = await prisma.apiKey.findMany({
    where: { userId: "temp-user-id" },
  });

  console.log(`\n📦 Found ${keys.length} API keys:\n`);

  for (const key of keys) {
    try {
      const decrypted = decrypt(key.keyValue);
      const masked = decrypted.substring(0, 8) + "..." + decrypted.substring(decrypted.length - 4);
      console.log(`  ${key.service}: ${masked} (${key.isActive ? "✅ Active" : "❌ Inactive"})`);
    } catch (e) {
      console.log(`  ${key.service}: ❌ Failed to decrypt`);
    }
  }

  await prisma.$disconnect();
}

checkKeys().catch(console.error);
