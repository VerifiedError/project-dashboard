/**
 * FILE-REF: COMP-084-20251128
 *
 * @file DebugModal.tsx
 * @description Debug modal for displaying errors with Claude Code-optimized copy functionality
 * @category Component
 * @created 2025-11-28
 * @modified 2025-11-28
 *
 * @changelog
 * - 2025-11-28 - Initial debug modal implementation (CHG-009)
 *
 * @dependencies
 * - react
 * - LIB-025 (debug-logger.ts)
 * - LIB-026 (debug actions)
 * - COMP-006 (dialog.tsx)
 *
 * @see Related files:
 * - COMP-081 (ApiKeyDialog)
 * - PAGE-013 (debug log viewer)
 */

"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  AlertCircle,
  AlertTriangle,
  Info,
  Bug,
  Copy,
  Check,
  ExternalLink,
} from "lucide-react";
import type { DebugLog } from "@/lib/utils/debug-logger";
import { createClaudeDebugInfo } from "@/lib/utils/debug-logger";
import { getDebugLog } from "@/lib/actions/debug";

interface DebugModalProps {
  isOpen: boolean;
  onClose: () => void;
  debugLog: DebugLog | null;
  onViewFullLog?: (refId: string) => void;
}

export function DebugModal({
  isOpen,
  onClose,
  debugLog,
  onViewFullLog,
}: DebugModalProps) {
  const [copied, setCopied] = useState(false);
  const [fullLog, setFullLog] = useState<DebugLog | null>(null);
  const [isLoadingFullLog, setIsLoadingFullLog] = useState(false);
  const { toast } = useToast();

  // Load full log from database when modal opens
  useEffect(() => {
    if (isOpen && debugLog?.refId && !fullLog) {
      setIsLoadingFullLog(true);
      getDebugLog(debugLog.refId)
        .then((result) => {
          if (result.success && result.log) {
            setFullLog({
              id: result.log.id,
              refId: result.log.refId,
              timestamp: result.log.timestamp,
              level: result.log.level.toLowerCase() as DebugLog["level"],
              category: result.log.category
                .toLowerCase()
                .replace("_", "-") as DebugLog["category"],
              message: result.log.message,
              details: result.log.details,
              stack: result.log.stack,
              userId: result.log.userId,
              context: {
                component: result.log.component,
                action: result.log.action,
                file: result.log.file,
                line: result.log.line,
              },
            });
          }
        })
        .catch((error) => {
          console.error("Failed to load full debug log:", error);
        })
        .finally(() => {
          setIsLoadingFullLog(false);
        });
    }
  }, [isOpen, debugLog?.refId, fullLog]);

  const handleCopy = async () => {
    if (!debugLog) return;

    const logToCopy = fullLog || debugLog;
    const claudeDebugInfo = createClaudeDebugInfo(logToCopy);

    try {
      await navigator.clipboard.writeText(claudeDebugInfo);
      setCopied(true);
      toast({
        title: "Copied to clipboard",
        description: "Debug information copied in Claude Code format",
      });

      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: "Could not copy to clipboard",
        variant: "destructive",
      });
      console.error("Copy failed:", error);
    }
  };

  const getIcon = () => {
    if (!debugLog) return <Info className="h-5 w-5" />;

    switch (debugLog.level) {
      case "critical":
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case "warn":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case "debug":
        return <Bug className="h-5 w-5 text-blue-500" />;
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const getLevelColor = () => {
    if (!debugLog) return "default";

    switch (debugLog.level) {
      case "critical":
        return "destructive";
      case "error":
        return "destructive";
      case "warn":
        return "secondary";
      case "debug":
        return "outline";
      default:
        return "default";
    }
  };

  const handleClose = () => {
    setFullLog(null);
    setCopied(false);
    onClose();
  };

  const displayLog = fullLog || debugLog;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            {getIcon()}
            <DialogTitle>Debug Information</DialogTitle>
          </div>
          <DialogDescription>
            Reference ID: <code className="font-mono text-xs">{debugLog?.refId}</code>
          </DialogDescription>
        </DialogHeader>

        {displayLog && (
          <div className="space-y-4 py-4">
            {/* Level and Category */}
            <div className="flex gap-2 items-center">
              <Badge variant={getLevelColor()}>
                {displayLog.level.toUpperCase()}
              </Badge>
              <Badge variant="outline">{displayLog.category}</Badge>
              {displayLog.timestamp && (
                <span className="text-xs text-muted-foreground ml-auto">
                  {new Date(displayLog.timestamp).toLocaleString()}
                </span>
              )}
            </div>

            {/* Error Message */}
            <div>
              <h4 className="text-sm font-semibold mb-2">Error Message</h4>
              <div className="bg-muted p-3 rounded-md">
                <p className="text-sm font-mono">{displayLog.message}</p>
              </div>
            </div>

            {/* Context */}
            {displayLog.context && (
              <div>
                <h4 className="text-sm font-semibold mb-2">Context</h4>
                <div className="bg-muted p-3 rounded-md text-sm space-y-1">
                  {displayLog.context.component && (
                    <div>
                      <span className="font-semibold">Component:</span>{" "}
                      <code className="text-xs">{displayLog.context.component}</code>
                    </div>
                  )}
                  {displayLog.context.action && (
                    <div>
                      <span className="font-semibold">Action:</span>{" "}
                      <code className="text-xs">{displayLog.context.action}</code>
                    </div>
                  )}
                  {displayLog.context.file && (
                    <div>
                      <span className="font-semibold">File:</span>{" "}
                      <code className="text-xs">
                        {displayLog.context.file}
                        {displayLog.context.line && `:${displayLog.context.line}`}
                      </code>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Stack Trace */}
            {displayLog.stack && (
              <div>
                <h4 className="text-sm font-semibold mb-2">Stack Trace</h4>
                <div className="bg-muted p-3 rounded-md max-h-[200px] overflow-y-auto">
                  <pre className="text-xs font-mono whitespace-pre-wrap">
                    {displayLog.stack}
                  </pre>
                </div>
              </div>
            )}

            {/* Additional Details */}
            {displayLog.details && Object.keys(displayLog.details).length > 0 && (
              <div>
                <h4 className="text-sm font-semibold mb-2">Additional Details</h4>
                <div className="bg-muted p-3 rounded-md max-h-[200px] overflow-y-auto">
                  <pre className="text-xs font-mono whitespace-pre-wrap">
                    {JSON.stringify(displayLog.details, null, 2)}
                  </pre>
                </div>
              </div>
            )}

            {/* User Info */}
            {displayLog.userId && (
              <div>
                <h4 className="text-sm font-semibold mb-2">User</h4>
                <div className="bg-muted p-3 rounded-md">
                  <code className="text-xs">{displayLog.userId}</code>
                </div>
              </div>
            )}

            {/* Loading indicator */}
            {isLoadingFullLog && (
              <div className="text-sm text-muted-foreground text-center py-2">
                Loading full debug information...
              </div>
            )}
          </div>
        )}

        <DialogFooter className="gap-2 sm:gap-0">
          <div className="flex gap-2 w-full sm:w-auto">
            {onViewFullLog && debugLog?.refId && (
              <Button
                type="button"
                variant="outline"
                onClick={() => onViewFullLog(debugLog.refId)}
                className="flex-1 sm:flex-none"
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                View Full Log
              </Button>
            )}
            <Button
              type="button"
              variant="outline"
              onClick={handleCopy}
              className="flex-1 sm:flex-none"
            >
              {copied ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="mr-2 h-4 w-4" />
                  Copy for Claude
                </>
              )}
            </Button>
            <Button
              type="button"
              onClick={handleClose}
              className="flex-1 sm:flex-none"
            >
              Close
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
