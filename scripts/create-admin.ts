import { prisma } from "../lib/utils/db";
import bcrypt from "bcryptjs";

async function createAdmin() {
  const email = "a@a.com";
  const password = "ac783dac783d";
  const hashedPassword = await bcrypt.hash(password, 10);
  const username = email.split("@")[0];

  try {
    const existing = await prisma.user.findUnique({ where: { email } });

    if (existing) {
      await prisma.user.update({
        where: { email },
        data: { password: hashedPassword }
      });
      console.log("✅ User password updated!");
      console.log("📧 Email:", email);
      console.log("🆔 User ID:", existing.id);
    } else {
      const user = await prisma.user.create({
        data: {
          email,
          username,
          password: hashedPassword,
          name: "Admin User",
          role: "ADMIN",
          isActive: true
        }
      });
      console.log("✅ Admin user created successfully!");
      console.log("📧 Email:", user.email);
      console.log("👤 Username:", user.username);
      console.log("🆔 User ID:", user.id);
    }
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
