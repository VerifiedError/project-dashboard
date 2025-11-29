/**
 * FILE-REF: LIB-026-20251129
 *
 * @file auth.ts
 * @description Authentication server actions (login/logout)
 * @category Library
 * @created 2025-11-29
 * @modified 2025-11-29
 *
 * @changelog
 * - 2025-11-29 - Initial authentication actions
 *
 * @dependencies
 * - @prisma/client
 * - bcryptjs
 * - lib/utils/db
 * - lib/utils/session
 *
 * @see Related files:
 * - LIB-025 (session.ts)
 * - DB-001 (schema.prisma)
 */

"use server";

import { prisma } from "@/lib/utils/db";
import bcrypt from "bcryptjs";
import { getSession } from "@/lib/utils/session";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export interface LoginResult {
  success: boolean;
  error?: string;
  userId?: string;
}

/**
 * Login user with email and password
 */
export async function login(email: string, password: string): Promise<LoginResult> {
  try {
    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return {
        success: false,
        error: "Invalid email or password",
      };
    }

    // Check if user is active
    if (!user.isActive) {
      return {
        success: false,
        error: "Account is disabled",
      };
    }

    // Verify password
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return {
        success: false,
        error: "Invalid email or password",
      };
    }

    // Create session
    const session = await getSession();
    session.userId = user.id;
    session.email = user.email!;
    session.username = user.username;
    session.isLoggedIn = true;
    await session.save();

    return {
      success: true,
      userId: user.id,
    };
  } catch (error) {
    console.error("Login error:", error);
    return {
      success: false,
      error: "An error occurred during login",
    };
  }
}

/**
 * Logout current user
 */
export async function logout() {
  const session = await getSession();
  session.destroy();
  revalidatePath("/", "layout");
  redirect("/login");
}

/**
 * Get current user from session
 */
export async function getCurrentUser() {
  const session = await getSession();

  if (!session.isLoggedIn) {
    return null;
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: {
        id: true,
        username: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });

    return user;
  } catch (error) {
    console.error("Get current user error:", error);
    return null;
  }
}

/**
 * Check if user is authenticated (for use in components)
 */
export async function checkAuth(): Promise<boolean> {
  const session = await getSession();
  return session.isLoggedIn === true && !!session.userId;
}
