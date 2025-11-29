/**
 * FILE-REF: COMP-050-20251128
 *
 * @file ChangelogEntry.tsx
 * @description Component for displaying individual changelog entries
 * @category Component
 * @created 2025-11-28
 * @modified 2025-11-28
 *
 * @changelog
 * - 2025-11-28 - Initial changelog entry component (CHG-003)
 *
 * @dependencies
 * - components/ui/card
 * - components/ui/badge
 * - lucide-react
 *
 * @see Related files:
 * - PAGE-011 (page.tsx)
 * - LIB-012 (changelog.ts)
 */

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, FileText } from "lucide-react";
import type { ChangelogEntry as ChangelogEntryType } from "@prisma/client";
import { formatChangelogDate, DEFAULT_TIMEZONE, type TimezoneValue } from "@/lib/utils/timezone";

interface ChangelogEntryProps {
  entry: ChangelogEntryType;
  timezone?: TimezoneValue;
}

// Category colors
const categoryColors = {
  FEATURE: "bg-blue-500/10 text-blue-700 border-blue-200",
  BUGFIX: "bg-red-500/10 text-red-700 border-red-200",
  IMPROVEMENT: "bg-green-500/10 text-green-700 border-green-200",
  REFACTOR: "bg-purple-500/10 text-purple-700 border-purple-200",
  DOCUMENTATION: "bg-gray-500/10 text-gray-700 border-gray-200",
  CONFIGURATION: "bg-yellow-500/10 text-yellow-700 border-yellow-200",
  DATABASE: "bg-indigo-500/10 text-indigo-700 border-indigo-200",
  API: "bg-cyan-500/10 text-cyan-700 border-cyan-200",
  UI: "bg-pink-500/10 text-pink-700 border-pink-200",
} as const;

// Severity colors
const severityColors = {
  CRITICAL: "bg-red-600 text-white",
  MAJOR: "bg-orange-600 text-white",
  MINOR: "bg-blue-600 text-white",
  PATCH: "bg-gray-600 text-white",
} as const;

export function ChangelogEntry({ entry, timezone = DEFAULT_TIMEZONE }: ChangelogEntryProps) {
  // Parse file changes if they exist
  const fileChanges = entry.fileChanges
    ? (entry.fileChanges as { ref: string; path: string }[])
    : [];

  // Format date with timezone
  const dateInfo = formatChangelogDate(entry.createdAt, timezone);

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          {/* Title and ref number */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <code className="text-xs font-mono bg-muted px-2 py-0.5 rounded">
                {entry.refNumber}
              </code>
              <Badge
                variant="outline"
                className={severityColors[entry.severity as keyof typeof severityColors]}
              >
                {entry.severity}
              </Badge>
            </div>
            <h3 className="text-lg font-semibold leading-tight">{entry.title}</h3>
          </div>

          {/* Category badge */}
          <Badge
            variant="outline"
            className={categoryColors[entry.category as keyof typeof categoryColors]}
          >
            {entry.category}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Description */}
        <p className="text-sm text-muted-foreground leading-relaxed">
          {entry.description}
        </p>

        {/* File changes */}
        {fileChanges.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium">
              <FileText className="h-4 w-4" />
              <span>Files Changed ({fileChanges.length})</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {fileChanges.map((file, index) => (
                <div
                  key={index}
                  className="flex items-start gap-2 text-xs bg-muted/50 p-2 rounded"
                >
                  <code className="font-mono text-primary">{file.ref}</code>
                  <span className="text-muted-foreground truncate" title={file.path}>
                    {file.path}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Metadata footer */}
        <div className="flex flex-wrap items-center gap-4 pt-2 border-t text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <User className="h-3.5 w-3.5" />
            <span>{entry.author}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            <time dateTime={entry.createdAt.toISOString()} title={dateInfo.full}>
              {dateInfo.relative} ({dateInfo.timezone})
            </time>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
