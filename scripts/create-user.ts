/**
 * FILE-REF: SCRIPT-001-20251129
 *
 * @file create-user.ts
 * @description Script to create admin user account
 * @category Script
 * @created 2025-11-29
 * @modified 2025-11-29
 *
 * @usage
 * Run: npx tsx scripts/create-user.ts
 *
 * This script creates the initial admin user account for the dashboard.
 * It will prompt for email and password, hash the password with bcrypt,
 * and create the user in the database.
 */

import { prisma } from "../lib/utils/db";
import bcrypt from "bcryptjs";
import * as readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(query: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(query, resolve);
  });
}

async function createUser() {
  console.log("\n🔧 Admin User Creation Script\n");

  try {
    // Get user input
    const email = await question("Enter email: ");
    const password = await question("Enter password: ");
    const name = await question("Enter name (optional): ");

    if (!email || !password) {
      console.error("❌ Email and password are required");
      process.exit(1);
    }

    // Check if user already exists
    const existing = await prisma.user.findUnique({
      where: { email },
    });

    if (existing) {
      console.log(`\n⚠️  User with email "${email}" already exists!`);
      const overwrite = await question("Do you want to update the password? (yes/no): ");

      if (overwrite.toLowerCase() !== "yes") {
        console.log("❌ Operation cancelled");
        rl.close();
        return;
      }

      // Update existing user
      const hashedPassword = await bcrypt.hash(password, 10);
      await prisma.user.update({
        where: { email },
        data: {
          password: hashedPassword,
          ...(name && { name }),
        },
      });

      console.log("\n✅ User password updated successfully!");
      console.log(`📧 Email: ${email}`);
      console.log(`👤 Name: ${name || existing.name || "N/A"}`);
      console.log(`🔑 Role: ${existing.role}`);
    } else {
      // Create new user
      const hashedPassword = await bcrypt.hash(password, 10);
      const username = email.split("@")[0]; // Use email prefix as username

      const user = await prisma.user.create({
        data: {
          email,
          username,
          password: hashedPassword,
          name: name || null,
          role: "ADMIN",
          isActive: true,
        },
      });

      console.log("\n✅ Admin user created successfully!");
      console.log(`📧 Email: ${user.email}`);
      console.log(`👤 Username: ${user.username}`);
      console.log(`👤 Name: ${user.name || "N/A"}`);
      console.log(`🔑 Role: ${user.role}`);
      console.log(`🆔 User ID: ${user.id}`);
    }

    console.log("\n🎉 You can now login at /login\n");
  } catch (error) {
    console.error("\n❌ Error creating user:", error);
    process.exit(1);
  } finally {
    rl.close();
    await prisma.$disconnect();
  }
}

createUser();
