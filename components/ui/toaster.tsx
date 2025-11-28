/**
 * FILE-REF: COMP-008-20251128
 *
 * @file toaster.tsx
 * @description Toaster container component for toast notifications
 * @category Component
 * @created 2025-11-28
 * @modified 2025-11-28
 *
 * @changelog
 * - 2025-11-28 - Initial toaster component (CHG-004)
 *
 * @dependencies
 * - COMP-007 (toast.tsx)
 * - HOOK-001 (use-toast.ts)
 *
 * @see Related files:
 * - COMP-007 (toast.tsx)
 * - HOOK-001 (use-toast.ts)
 */

"use client";

import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast";
import { useToast } from "@/hooks/use-toast";

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && <ToastDescription>{description}</ToastDescription>}
            </div>
            {action}
            <ToastClose />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}
