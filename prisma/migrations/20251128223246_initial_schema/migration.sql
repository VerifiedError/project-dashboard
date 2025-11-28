-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('ACTIVE', 'ARCHIVED', 'PAUSED');

-- CreateEnum
CREATE TYPE "TunnelStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'ERROR');

-- CreateEnum
CREATE TYPE "BuildStatus" AS ENUM ('READY', 'BUILDING', 'ERROR', 'QUEUED', 'CANCELED');

-- CreateEnum
CREATE TYPE "DatabaseStatus" AS ENUM ('ACTIVE', 'SUSPENDED', 'ERROR');

-- CreateEnum
CREATE TYPE "UpstashType" AS ENUM ('REDIS', 'KAFKA');

-- CreateEnum
CREATE TYPE "ChangeCategory" AS ENUM ('FEATURE', 'BUGFIX', 'IMPROVEMENT', 'REFACTOR', 'DOCUMENTATION', 'CONFIGURATION', 'DATABASE', 'API', 'UI');

-- CreateEnum
CREATE TYPE "ChangeSeverity" AS ENUM ('CRITICAL', 'MAJOR', 'MINOR', 'PATCH');

-- CreateEnum
CREATE TYPE "ServiceType" AS ENUM ('NGROK', 'VERCEL', 'NEON', 'UPSTASH');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "email" TEXT,
    "name" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "repository" TEXT,
    "status" "ProjectStatus" NOT NULL DEFAULT 'ACTIVE',
    "tags" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NgrokTunnel" (
    "id" TEXT NOT NULL,
    "ngrokId" TEXT NOT NULL,
    "publicUrl" TEXT NOT NULL,
    "protocol" TEXT NOT NULL,
    "forwardingAddr" TEXT NOT NULL,
    "region" TEXT,
    "connectionCount" INTEGER NOT NULL DEFAULT 0,
    "bytesTransferred" BIGINT NOT NULL DEFAULT 0,
    "status" "TunnelStatus" NOT NULL DEFAULT 'ACTIVE',
    "lastSyncedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "projectId" TEXT,

    CONSTRAINT "NgrokTunnel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VercelProject" (
    "id" TEXT NOT NULL,
    "vercelId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "framework" TEXT,
    "productionUrl" TEXT,
    "gitProvider" TEXT,
    "gitRepo" TEXT,
    "latestDeployment" JSONB,
    "buildStatus" "BuildStatus" NOT NULL DEFAULT 'READY',
    "lastDeployedAt" TIMESTAMP(3),
    "lastSyncedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "projectId" TEXT,

    CONSTRAINT "VercelProject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NeonDatabase" (
    "id" TEXT NOT NULL,
    "neonProjectId" TEXT NOT NULL,
    "projectName" TEXT NOT NULL,
    "databaseName" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "postgresVersion" TEXT NOT NULL,
    "connectionUri" TEXT NOT NULL,
    "storageUsageGB" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "computeHours" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "branchCount" INTEGER NOT NULL DEFAULT 1,
    "status" "DatabaseStatus" NOT NULL DEFAULT 'ACTIVE',
    "lastSyncedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "projectId" TEXT,

    CONSTRAINT "NeonDatabase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UpstashDatabase" (
    "id" TEXT NOT NULL,
    "upstashId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "UpstashType" NOT NULL,
    "region" TEXT NOT NULL,
    "endpoint" TEXT NOT NULL,
    "port" INTEGER NOT NULL,
    "tlsEnabled" BOOLEAN NOT NULL DEFAULT true,
    "totalCommands" BIGINT NOT NULL DEFAULT 0,
    "storageUsedMB" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "status" "DatabaseStatus" NOT NULL DEFAULT 'ACTIVE',
    "lastSyncedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "projectId" TEXT,

    CONSTRAINT "UpstashDatabase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChangelogEntry" (
    "id" TEXT NOT NULL,
    "refNumber" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" "ChangeCategory" NOT NULL,
    "severity" "ChangeSeverity" NOT NULL DEFAULT 'MINOR',
    "fileChanges" JSONB,
    "author" TEXT NOT NULL DEFAULT 'System',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT,
    "projectId" TEXT,

    CONSTRAINT "ChangelogEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApiKey" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "service" "ServiceType" NOT NULL,
    "keyValue" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastUsedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ApiKey_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SystemSetting" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "description" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SystemSetting_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_username_idx" ON "User"("username");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "Project_userId_idx" ON "Project"("userId");

-- CreateIndex
CREATE INDEX "Project_status_idx" ON "Project"("status");

-- CreateIndex
CREATE INDEX "Project_createdAt_idx" ON "Project"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "NgrokTunnel_ngrokId_key" ON "NgrokTunnel"("ngrokId");

-- CreateIndex
CREATE INDEX "NgrokTunnel_status_idx" ON "NgrokTunnel"("status");

-- CreateIndex
CREATE INDEX "NgrokTunnel_lastSyncedAt_idx" ON "NgrokTunnel"("lastSyncedAt");

-- CreateIndex
CREATE UNIQUE INDEX "VercelProject_vercelId_key" ON "VercelProject"("vercelId");

-- CreateIndex
CREATE INDEX "VercelProject_buildStatus_idx" ON "VercelProject"("buildStatus");

-- CreateIndex
CREATE INDEX "VercelProject_lastSyncedAt_idx" ON "VercelProject"("lastSyncedAt");

-- CreateIndex
CREATE UNIQUE INDEX "NeonDatabase_neonProjectId_key" ON "NeonDatabase"("neonProjectId");

-- CreateIndex
CREATE INDEX "NeonDatabase_status_idx" ON "NeonDatabase"("status");

-- CreateIndex
CREATE INDEX "NeonDatabase_lastSyncedAt_idx" ON "NeonDatabase"("lastSyncedAt");

-- CreateIndex
CREATE UNIQUE INDEX "UpstashDatabase_upstashId_key" ON "UpstashDatabase"("upstashId");

-- CreateIndex
CREATE INDEX "UpstashDatabase_type_idx" ON "UpstashDatabase"("type");

-- CreateIndex
CREATE INDEX "UpstashDatabase_status_idx" ON "UpstashDatabase"("status");

-- CreateIndex
CREATE INDEX "UpstashDatabase_lastSyncedAt_idx" ON "UpstashDatabase"("lastSyncedAt");

-- CreateIndex
CREATE UNIQUE INDEX "ChangelogEntry_refNumber_key" ON "ChangelogEntry"("refNumber");

-- CreateIndex
CREATE INDEX "ChangelogEntry_userId_idx" ON "ChangelogEntry"("userId");

-- CreateIndex
CREATE INDEX "ChangelogEntry_category_idx" ON "ChangelogEntry"("category");

-- CreateIndex
CREATE INDEX "ChangelogEntry_createdAt_idx" ON "ChangelogEntry"("createdAt" DESC);

-- CreateIndex
CREATE INDEX "ApiKey_service_idx" ON "ApiKey"("service");

-- CreateIndex
CREATE INDEX "ApiKey_userId_idx" ON "ApiKey"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ApiKey_userId_service_key" ON "ApiKey"("userId", "service");

-- CreateIndex
CREATE UNIQUE INDEX "SystemSetting_key_key" ON "SystemSetting"("key");

-- CreateIndex
CREATE INDEX "SystemSetting_key_idx" ON "SystemSetting"("key");

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NgrokTunnel" ADD CONSTRAINT "NgrokTunnel_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VercelProject" ADD CONSTRAINT "VercelProject_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NeonDatabase" ADD CONSTRAINT "NeonDatabase_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UpstashDatabase" ADD CONSTRAINT "UpstashDatabase_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChangelogEntry" ADD CONSTRAINT "ChangelogEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChangelogEntry" ADD CONSTRAINT "ChangelogEntry_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApiKey" ADD CONSTRAINT "ApiKey_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
