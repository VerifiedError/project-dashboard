/**
 * FILE-REF: PAGE-014-20251129
 *
 * @file page.tsx
 * @description Login page for dashboard authentication
 * @category Page
 * @created 2025-11-29
 * @modified 2025-11-29
 *
 * @changelog
 * - 2025-11-29 - Initial login page
 *
 * @dependencies
 * - lib/actions/auth
 * - components/ui/*
 *
 * @see Related files:
 * - LIB-026 (auth.ts)
 */

import { LoginForm } from "@/components/auth/LoginForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { checkAuth } from "@/lib/actions/auth";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  // If already logged in, redirect to dashboard
  const isAuth = await checkAuth();
  if (isAuth) {
    redirect("/");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Welcome Back</CardTitle>
          <CardDescription className="text-center">
            Login to access your DevOps Dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </div>
  );
}
