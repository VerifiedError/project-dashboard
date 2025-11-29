/**
 * FILE-REF: CONFIG-009-20251129
 *
 * @file middleware.ts
 * @description Next.js middleware for authentication and route protection
 * @category Config
 * @created 2025-11-29
 * @modified 2025-11-29
 *
 * @changelog
 * - 2025-11-29 - Initial authentication middleware (temporarily disabled)
 * - 2025-11-29 - Disabled iron-session in middleware (not Edge Runtime compatible)
 *
 * @dependencies
 * - next/server
 *
 * @see Related files:
 * - LIB-025 (session.ts)
 * - LIB-026 (auth.ts)
 *
 * NOTE: iron-session is not compatible with Next.js Edge Runtime.
 * Authentication checking is now handled in individual pages/layouts using Server Components.
 * This middleware currently only handles basic redirects.
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // For now, just allow all requests through
  // Authentication will be handled in Server Components which can use Node.js runtime
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
