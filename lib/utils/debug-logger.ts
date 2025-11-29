/**
 * FILE-REF: LIB-025-20251128
 *
 * @file debug-logger.ts
 * @description Debug logging utility with reference ID generation and structured error tracking
 * @category Library
 * @created 2025-11-28
 * @modified 2025-11-28
 *
 * @changelog
 * - 2025-11-28 - Initial debug logger implementation (CHG-009)
 *
 * @dependencies
 * - crypto (Node.js built-in)
 *
 * @see Related files:
 * - LIB-026 (debug actions)
 * - COMP-084 (DebugModal)
 */

import { randomBytes } from "crypto";

export type LogLevel = "debug" | "info" | "warn" | "error" | "critical";

export type LogCategory =
  | "encryption"
  | "api-key"
  | "database"
  | "api-integration"
  | "auth"
  | "validation"
  | "system"
  | "ui";

export interface DebugLog {
  id: string;
  refId: string; // e.g., "DBG-20251128-A1B2C3"
  timestamp: Date;
  level: LogLevel;
  category: LogCategory;
  message: string;
  details?: Record<string, unknown>;
  stack?: string;
  userId?: string;
  context?: {
    component?: string;
    action?: string;
    file?: string;
    line?: number;
  };
}

export interface ClaudeCodeFormattedDebug {
  summary: string;
  refId: string;
  timestamp: string;
  level: LogLevel;
  category: LogCategory;
  errorMessage: string;
  technicalDetails: {
    stack?: string;
    context?: Record<string, unknown>;
    userId?: string;
    component?: string;
    action?: string;
    file?: string;
  };
  reproductionSteps?: string[];
  relevantCode?: string;
  suggestedFixes?: string[];
}

class DebugLogger {
  private static instance: DebugLogger;

  private constructor() {}

  static getInstance(): DebugLogger {
    if (!DebugLogger.instance) {
      DebugLogger.instance = new DebugLogger();
    }
    return DebugLogger.instance;
  }

  /**
   * Generates a unique reference ID for debug logs
   * Format: DBG-YYYYMMDD-XXXXXX (where X is random hex)
   */
  generateRefId(): string {
    const date = new Date();
    const dateStr = date.toISOString().split("T")[0].replace(/-/g, "");
    const randomHex = randomBytes(3).toString("hex").toUpperCase();
    return `DBG-${dateStr}-${randomHex}`;
  }

  /**
   * Creates a debug log entry
   */
  async log(
    level: LogLevel,
    category: LogCategory,
    message: string,
    options?: {
      details?: Record<string, unknown>;
      error?: Error;
      userId?: string;
      context?: {
        component?: string;
        action?: string;
        file?: string;
        line?: number;
      };
    }
  ): Promise<DebugLog> {
    const refId = this.generateRefId();
    const log: DebugLog = {
      id: randomBytes(16).toString("hex"),
      refId,
      timestamp: new Date(),
      level,
      category,
      message,
      details: options?.details,
      stack: options?.error?.stack,
      userId: options?.userId,
      context: options?.context,
    };

    // Log to console in development
    if (process.env.NODE_ENV === "development") {
      this.consoleLog(log);
    }

    // Save to database (will be implemented in next step)
    try {
      await this.saveToDatabase(log);
    } catch (error) {
      // Fallback: log to console if database save fails
      console.error("Failed to save debug log to database:", error);
      console.error("Original log:", log);
    }

    return log;
  }

  /**
   * Convenience methods for different log levels
   */
  async debug(
    category: LogCategory,
    message: string,
    options?: Parameters<typeof this.log>[3]
  ) {
    return this.log("debug", category, message, options);
  }

  async info(
    category: LogCategory,
    message: string,
    options?: Parameters<typeof this.log>[3]
  ) {
    return this.log("info", category, message, options);
  }

  async warn(
    category: LogCategory,
    message: string,
    options?: Parameters<typeof this.log>[3]
  ) {
    return this.log("warn", category, message, options);
  }

  async error(
    category: LogCategory,
    message: string,
    options?: Parameters<typeof this.log>[3]
  ) {
    return this.log("error", category, message, options);
  }

  async critical(
    category: LogCategory,
    message: string,
    options?: Parameters<typeof this.log>[3]
  ) {
    return this.log("critical", category, message, options);
  }

  /**
   * Formats debug log for Claude Code
   */
  formatForClaudeCode(log: DebugLog): ClaudeCodeFormattedDebug {
    return {
      summary: `[${log.level.toUpperCase()}] ${log.category}: ${log.message}`,
      refId: log.refId,
      timestamp: log.timestamp.toISOString(),
      level: log.level,
      category: log.category,
      errorMessage: log.message,
      technicalDetails: {
        stack: log.stack,
        context: log.details,
        userId: log.userId,
        component: log.context?.component,
        action: log.context?.action,
        file: log.context?.file,
      },
      reproductionSteps: this.generateReproductionSteps(log),
      relevantCode: this.extractRelevantCode(log),
      suggestedFixes: this.generateSuggestedFixes(log),
    };
  }

  /**
   * Generates reproduction steps based on log context
   */
  private generateReproductionSteps(log: DebugLog): string[] {
    const steps: string[] = [];

    if (log.context?.component) {
      steps.push(`1. Navigate to component: ${log.context.component}`);
    }

    if (log.context?.action) {
      steps.push(`2. Perform action: ${log.context.action}`);
    }

    if (log.details) {
      steps.push(`3. With parameters: ${JSON.stringify(log.details, null, 2)}`);
    }

    steps.push(`4. Error occurred: ${log.message}`);

    return steps;
  }

  /**
   * Extracts relevant code snippet from stack trace
   */
  private extractRelevantCode(log: DebugLog): string | undefined {
    if (!log.stack) return undefined;

    const lines = log.stack.split("\n");
    const relevantLines = lines.slice(0, 5); // First 5 lines usually most relevant

    return relevantLines.join("\n");
  }

  /**
   * Generates suggested fixes based on error patterns
   */
  private generateSuggestedFixes(log: DebugLog): string[] {
    const fixes: string[] = [];

    // Encryption-specific fixes
    if (log.category === "encryption") {
      if (log.message.includes("decrypt")) {
        fixes.push(
          "1. Verify ENCRYPTION_KEY is set in environment variables"
        );
        fixes.push(
          "2. Check if the key used to encrypt matches the current ENCRYPTION_KEY"
        );
        fixes.push(
          "3. Consider re-encrypting the data with the current ENCRYPTION_KEY"
        );
      }
    }

    // API key specific fixes
    if (log.category === "api-key") {
      fixes.push("1. Verify API key is valid and active");
      fixes.push("2. Check API key permissions and scopes");
      fixes.push("3. Ensure userId exists in database");
    }

    // Database specific fixes
    if (log.category === "database") {
      if (log.message.includes("foreign key")) {
        fixes.push("1. Verify referenced record exists in parent table");
        fixes.push("2. Check database constraints in schema.prisma");
        fixes.push("3. Run database seed script if in development");
      }
    }

    // Generic fixes
    if (fixes.length === 0) {
      fixes.push("1. Review error stack trace for specific error location");
      fixes.push("2. Check input validation and data types");
      fixes.push("3. Verify all required environment variables are set");
    }

    return fixes;
  }

  /**
   * Console log formatting for development
   */
  private consoleLog(log: DebugLog) {
    const colors = {
      debug: "\x1b[36m", // Cyan
      info: "\x1b[34m", // Blue
      warn: "\x1b[33m", // Yellow
      error: "\x1b[31m", // Red
      critical: "\x1b[35m", // Magenta
    };

    const reset = "\x1b[0m";
    const color = colors[log.level];

    console.log(
      `${color}[${log.refId}] ${log.level.toUpperCase()}${reset} [${log.category}] ${log.message}`
    );

    if (log.context) {
      console.log("Context:", log.context);
    }

    if (log.details) {
      console.log("Details:", log.details);
    }

    if (log.stack) {
      console.log("Stack:", log.stack);
    }
  }

  /**
   * Save log to database
   */
  private async saveToDatabase(log: DebugLog): Promise<void> {
    // Import saveDebugLog dynamically to avoid circular dependencies
    const { saveDebugLog } = await import("@/lib/actions/debug");
    await saveDebugLog(log);
  }
}

// Export singleton instance
export const debugLogger = DebugLogger.getInstance();

/**
 * Helper function to create formatted debug info for Claude Code
 */
export function createClaudeDebugInfo(log: DebugLog): string {
  const formatted = debugLogger.formatForClaudeCode(log);

  return `
# Debug Report: ${formatted.refId}

## Summary
${formatted.summary}

## Details
- **Timestamp**: ${formatted.timestamp}
- **Level**: ${formatted.level.toUpperCase()}
- **Category**: ${formatted.category}
- **User ID**: ${formatted.technicalDetails.userId || "N/A"}
- **Component**: ${formatted.technicalDetails.component || "N/A"}
- **Action**: ${formatted.technicalDetails.action || "N/A"}

## Error Message
\`\`\`
${formatted.errorMessage}
\`\`\`

## Stack Trace
\`\`\`
${formatted.technicalDetails.stack || "No stack trace available"}
\`\`\`

## Technical Context
\`\`\`json
${JSON.stringify(formatted.technicalDetails.context, null, 2)}
\`\`\`

## Reproduction Steps
${formatted.reproductionSteps?.map((step) => step).join("\n") || "No reproduction steps available"}

## Suggested Fixes
${formatted.suggestedFixes?.map((fix) => fix).join("\n") || "No suggested fixes available"}

---
**Reference ID**: ${formatted.refId}
**Use this ID to retrieve full debug log from the database**
`;
}
