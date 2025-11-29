/**
 * FILE-REF: PAGE-008-20251129
 *
 * @file page.tsx
 * @description Vercel deployments resource page (Coming Soon)
 * @category Page
 * @created 2025-11-29
 * @modified 2025-11-29
 *
 * @changelog
 * - 2025-11-29 - Created placeholder page
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, Construction } from "lucide-react";
import Link from "next/link";

export default function VercelPage() {
  return (
    <div className="container mx-auto p-4 md:p-8 max-w-7xl">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-black to-gray-600 bg-clip-text text-transparent">
              Vercel Deployments
            </h1>
            <p className="text-muted-foreground">
              Monitor and manage your Vercel deployments
            </p>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Construction className="h-5 w-5 text-yellow-600" />
            <CardTitle>Coming Soon</CardTitle>
          </div>
          <CardDescription>
            Vercel deployment tracking is currently under development
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              This feature will allow you to track Vercel deployments, monitor build status,
              view production and preview URLs, and manage deployment settings.
            </p>
            <div className="flex gap-2">
              <Button asChild variant="outline">
                <Link href="/resources">
                  Back to Resources
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/settings">
                  Configure API Keys
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
