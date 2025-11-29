/**
 * FILE-REF: PAGE-011-20251128
 *
 * @file page.tsx
 * @description Changelog viewer page displaying all system changes
 * @category Page
 * @created 2025-11-28
 * @modified 2025-11-28
 *
 * @changelog
 * - 2025-11-28 - Initial changelog viewer page (CHG-003)
 *
 * @dependencies
 * - lib/actions/changelog
 * - components/changelog/ChangelogEntry
 *
 * @see Related files:
 * - LIB-012 (changelog.ts)
 * - COMP-050 (ChangelogEntry.tsx)
 */

import { getChangelogEntries } from "@/lib/actions/changelog";
import { getTimezone } from "@/lib/actions/settings";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChangelogEntry } from "@/components/changelog/ChangelogEntry";

// Force dynamic rendering - don't try to statically generate at build time
export const dynamic = 'force-dynamic';

export default async function ChangelogPage() {
  const { success, entries, total } = await getChangelogEntries({ limit: 500 });
  const timezoneResult = await getTimezone();

  // Ensure entries is always an array, even during build time
  const safeEntries = Array.isArray(entries) ? entries : [];
  // Ensure timezone is always defined with a fallback
  const timezone = timezoneResult.timezone || "America/Chicago";

  if (!success) {
    return (
      <div className="container mx-auto p-4 md:p-8">
        <h1 className="text-3xl font-bold mb-6">Changelog</h1>
        <Card>
          <CardHeader>
            <CardTitle>Error Loading Changelog</CardTitle>
            <CardDescription>Failed to load changelog entries</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-primary-600 bg-clip-text text-transparent">
          Changelog
        </h1>
        <p className="text-muted-foreground">
          Complete history of all changes to the DevOps Dashboard
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          Total entries: {total}
        </p>
      </div>

      {safeEntries.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground">No changelog entries yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {safeEntries.map((entry) => (
            <ChangelogEntry key={entry.id} entry={entry} timezone={timezone} />
          ))}
        </div>
      )}

      <div className="mt-8 text-center text-sm text-muted-foreground">
        <p>All changes are automatically tracked and logged</p>
      </div>
    </div>
  );
}
