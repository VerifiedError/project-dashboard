/**
 * FILE-REF: COMP-090-20251129
 *
 * @file DebugPanel.tsx
 * @description Collapsible debug panel with copy-to-clipboard functionality
 * @category Component
 * @created 2025-11-29
 * @modified 2025-11-29
 *
 * @changelog
 * - 2025-11-29 - Initial debug panel component
 *
 * @dependencies
 * - components/ui/card
 * - components/ui/button
 * - lucide-react
 *
 * @see Related files:
 * - PAGE-007 (ngrok page)
 */

"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight, Copy, CheckCircle } from "lucide-react";

interface DebugPanelProps {
  title?: string;
  data: Record<string, unknown>;
  defaultOpen?: boolean;
}

export function DebugPanel({ title = "Debug Information", data, defaultOpen = false }: DebugPanelProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const debugLog = `
=== ${title} ===
Generated: ${new Date().toISOString()}

${JSON.stringify(data, null, 2)}

=== Environment Info ===
User Agent: ${typeof navigator !== 'undefined' ? navigator.userAgent : 'N/A'}
Screen: ${typeof window !== 'undefined' ? `${window.innerWidth}x${window.innerHeight}` : 'N/A'}
Timestamp: ${Date.now()}
    `.trim();

    try {
      await navigator.clipboard.writeText(debugLog);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy debug log:", err);
    }
  };

  return (
    <Card className="border-dashed border-2 border-muted-foreground/30 bg-muted/30">
      <CardHeader className="cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            <CardTitle className="text-sm font-mono">{title}</CardTitle>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleCopy();
            }}
            className="h-8"
          >
            {copied ? (
              <>
                <CheckCircle className="h-3 w-3 mr-2" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="h-3 w-3 mr-2" />
                Copy Debug Log
              </>
            )}
          </Button>
        </div>
        <CardDescription className="text-xs">
          Click to {isOpen ? "collapse" : "expand"} diagnostic information. Use the copy button to share with support.
        </CardDescription>
      </CardHeader>
      {isOpen && (
        <CardContent>
          <pre className="text-xs bg-background p-4 rounded border overflow-auto max-h-96">
            {JSON.stringify(data, null, 2)}
          </pre>
          <div className="mt-4 grid gap-2 text-xs">
            <div className="flex gap-2">
              <span className="font-semibold min-w-[120px]">Total Keys:</span>
              <span>{Object.keys(data).length}</span>
            </div>
            <div className="flex gap-2">
              <span className="font-semibold min-w-[120px]">Generated:</span>
              <span>{new Date().toLocaleString()}</span>
            </div>
            <div className="flex gap-2">
              <span className="font-semibold min-w-[120px]">Browser:</span>
              <span className="font-mono truncate">
                {typeof navigator !== 'undefined' ? navigator.userAgent : 'N/A'}
              </span>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
