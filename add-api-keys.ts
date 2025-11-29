/**
 * Script to manually add API keys with proper encryption
 * Run with: npx tsx add-api-keys.ts
 */

import { PrismaClient, ServiceType } from "@prisma/client";
import { encrypt } from "./lib/utils/encryption";
import * as readline from "readline";

const prisma = new PrismaClient();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(prompt: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function main() {
  console.log("🔑 API Key Setup Wizard\n");
  console.log("This will encrypt and store your API keys securely.\n");

  const userId = "temp-user-id";

  // ngrok
  console.log("📡 ngrok API Key");
  const ngrokKey = await question("Enter your ngrok API key (or press Enter to skip): ");
  if (ngrokKey.trim()) {
    await prisma.apiKey.upsert({
      where: { userId_service: { userId, service: ServiceType.NGROK } },
      create: {
        userId,
        service: ServiceType.NGROK,
        keyValue: encrypt(ngrokKey.trim()),
        isActive: true,
      },
      update: {
        keyValue: encrypt(ngrokKey.trim()),
        isActive: true,
      },
    });
    console.log("✅ ngrok API key saved\n");
  }

  // Vercel
  console.log("🔺 Vercel API Token");
  const vercelKey = await question("Enter your Vercel API token (or press Enter to skip): ");
  if (vercelKey.trim()) {
    await prisma.apiKey.upsert({
      where: { userId_service: { userId, service: ServiceType.VERCEL } },
      create: {
        userId,
        service: ServiceType.VERCEL,
        keyValue: encrypt(vercelKey.trim()),
        isActive: true,
      },
      update: {
        keyValue: encrypt(vercelKey.trim()),
        isActive: true,
      },
    });
    console.log("✅ Vercel API token saved\n");
  }

  // Neon
  console.log("🐘 Neon API Key");
  const neonKey = await question("Enter your Neon API key (or press Enter to skip): ");
  if (neonKey.trim()) {
    await prisma.apiKey.upsert({
      where: { userId_service: { userId, service: ServiceType.NEON } },
      create: {
        userId,
        service: ServiceType.NEON,
        keyValue: encrypt(neonKey.trim()),
        isActive: true,
      },
      update: {
        keyValue: encrypt(neonKey.trim()),
        isActive: true,
      },
    });
    console.log("✅ Neon API key saved\n");
  }

  // Upstash
  console.log("⚡ Upstash API Key");
  const upstashKey = await question("Enter your Upstash API key (or press Enter to skip): ");
  if (upstashKey.trim()) {
    await prisma.apiKey.upsert({
      where: { userId_service: { userId, service: ServiceType.UPSTASH } },
      create: {
        userId,
        service: ServiceType.UPSTASH,
        keyValue: encrypt(upstashKey.trim()),
        isActive: true,
      },
      update: {
        keyValue: encrypt(upstashKey.trim()),
        isActive: true,
      },
    });
    console.log("✅ Upstash API key saved\n");
  }

  console.log("\n✨ All API keys have been securely saved!");
  console.log("\nNext steps:");
  console.log("1. Run 'npx tsx setup-and-test.ts' to test the integrations");
  console.log("2. Add ENCRYPTION_KEY to Vercel environment variables");
  console.log("3. Deploy to production\n");

  rl.close();
  await prisma.$disconnect();
}

main().catch((error) => {
  console.error("Error:", error);
  rl.close();
  process.exit(1);
});
