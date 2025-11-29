/**
 * FILE-REF: LIB-025-20251129
 *
 * @file session.ts
 * @description Session management utilities using iron-session
 * @category Library
 * @created 2025-11-29
 * @modified 2025-11-29
 *
 * @changelog
 * - 2025-11-29 - Initial session management utilities
 *
 * @dependencies
 * - iron-session
 *
 * @see Related files:
 * - LIB-026 (auth.ts)
 */

import { getIronSession, IronSession, SessionOptions } from "iron-session";
import { cookies } from "next/headers";

export interface SessionData {
  userId: string;
  email: string;
  username: string;
  isLoggedIn: boolean;
}

const sessionOptions: SessionOptions = {
  password: process.env.SESSION_SECRET || "complex_password_at_least_32_characters_long_for_security",
  cookieName: "dashboard_session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  },
};

/**
 * Get the current session
 */
export async function getSession(): Promise<IronSession<SessionData>> {
  const cookieStore = await cookies();
  const session = await getIronSession<SessionData>(cookieStore, sessionOptions);

  if (!session.isLoggedIn) {
    session.isLoggedIn = false;
  }

  return session;
}

/**
 * Get the current user ID from session
 * Returns null if not logged in
 */
export async function getCurrentUserId(): Promise<string | null> {
  const session = await getSession();
  return session.isLoggedIn ? session.userId : null;
}

/**
 * Get the current user email from session
 * Returns null if not logged in
 */
export async function getCurrentUserEmail(): Promise<string | null> {
  const session = await getSession();
  return session.isLoggedIn ? session.email : null;
}

/**
 * Check if user is logged in
 */
export async function isAuthenticated(): Promise<boolean> {
  const session = await getSession();
  return session.isLoggedIn === true && !!session.userId;
}
