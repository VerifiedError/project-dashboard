/**
 * FILE-REF: COMP-083-20251128
 *
 * @file VersionBadge.tsx
 * @description Version display badge component
 * @category Component
 * @created 2025-11-28
 * @modified 2025-11-28
 *
 * @changelog
 * - 2025-11-28 - Initial version badge component (CHG-009)
 *
 * @see Related files:
 * - COMP-060 (Header.tsx)
 */

"use client";

import { Badge } from "@/components/ui/badge";
import packageJson from "@/package.json";

export function VersionBadge() {
  return (
    <Badge variant="outline" className="font-mono text-xs">
      v{packageJson.version}
    </Badge>
  );
}
