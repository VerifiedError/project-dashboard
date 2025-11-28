/**
 * FILE-REF: COMP-006-20251128
 *
 * @file skeleton.tsx
 * @description Skeleton component for loading states
 * @category Component
 * @created 2025-11-28
 * @modified 2025-11-28
 *
 * @changelog
 * - 2025-11-28 - Initial skeleton component (CHG-004)
 *
 * @dependencies
 * - react
 *
 * @see Related files:
 * - LIB-022 (cn.ts)
 */

import { cn } from "@/lib/utils/cn";

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  );
}

export { Skeleton };
