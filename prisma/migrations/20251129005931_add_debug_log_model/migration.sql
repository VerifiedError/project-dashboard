-- CreateEnum
CREATE TYPE "LogLevel" AS ENUM ('DEBUG', 'INFO', 'WARN', 'ERROR', 'CRITICAL');

-- CreateEnum
CREATE TYPE "LogCategory" AS ENUM ('ENCRYPTION', 'API_KEY', 'DATABASE', 'API_INTEGRATION', 'AUTH', 'VALIDATION', 'SYSTEM', 'UI');

-- CreateTable
CREATE TABLE "DebugLog" (
    "id" TEXT NOT NULL,
    "refId" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "level" "LogLevel" NOT NULL,
    "category" "LogCategory" NOT NULL,
    "message" TEXT NOT NULL,
    "details" JSONB,
    "stack" TEXT,
    "userId" TEXT,
    "component" TEXT,
    "action" TEXT,
    "file" TEXT,
    "line" INTEGER,
    "resolved" BOOLEAN NOT NULL DEFAULT false,
    "resolvedAt" TIMESTAMP(3),
    "resolvedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DebugLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DebugLog_refId_key" ON "DebugLog"("refId");

-- CreateIndex
CREATE INDEX "DebugLog_refId_idx" ON "DebugLog"("refId");

-- CreateIndex
CREATE INDEX "DebugLog_level_idx" ON "DebugLog"("level");

-- CreateIndex
CREATE INDEX "DebugLog_category_idx" ON "DebugLog"("category");

-- CreateIndex
CREATE INDEX "DebugLog_timestamp_idx" ON "DebugLog"("timestamp" DESC);

-- CreateIndex
CREATE INDEX "DebugLog_userId_idx" ON "DebugLog"("userId");

-- CreateIndex
CREATE INDEX "DebugLog_resolved_idx" ON "DebugLog"("resolved");
