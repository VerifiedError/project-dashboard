# Project Dashboard - Complete Development Plan

**Project Name**: DevOps Resource Dashboard
**Purpose**: Centralized dashboard to track, monitor, and manage all development projects and associated resources (ngrok, Vercel, Neon, Upstash)
**Platform**: Vercel (Next.js)
**Start Date**: November 28, 2025
**Status**: ✅ Phase 1-6 Complete (incl. Authentication) | 🚧 In Active Development

---

## 🎯 Development Progress

### ✅ Completed Phases

**Phase 1: Foundation Setup** ✅ COMPLETE
- ✅ Next.js 14 project structure
- ✅ TypeScript & Tailwind CSS configuration
- ✅ Database schema (Prisma + Neon PostgreSQL)
- ✅ Environment configuration
- ✅ Git repository initialized
- **Changelog**: CHG-001

**Phase 2: Core UI Components** ✅ COMPLETE
- ✅ shadcn/ui components (Button, Card, Badge, Input, Label, Skeleton, Toast)
- ✅ Responsive Header with navigation
- ✅ Mobile hamburger menu
- ✅ Toast notification system (useToast hook)
- ✅ Root layout updated with Header & Toaster
- **Changelog**: CHG-002, CHG-003, CHG-004

**Phase 3: Project Management** ✅ COMPLETE
- ✅ Zod validation schemas (LIB-023)
- ✅ Project CRUD server actions (LIB-010)
- ✅ ProjectCard component with inline actions
- ✅ ProjectForm with dynamic tags
- ✅ Projects list page with stats
- ✅ Project detail page
- ✅ New project creation page
- **Changelog**: CHG-005

**Phase 4: ngrok Integration** ✅ COMPLETE
- ✅ ngrok API client (LIB-001)
- ✅ ngrok server actions with sync functionality (LIB-011)
- ✅ ngrok resource page with tunnel monitoring (PAGE-007)
- ✅ Sync button component with loading states (COMP-080)
- ✅ Real-time tunnel stats on dashboard
- ✅ Auto-sync with toast notifications
- **Changelog**: CHG-007

**Phase 5: Dashboard & Pages** ✅ COMPLETE
- ✅ Dashboard home page with stats
- ✅ Quick actions panel
- ✅ Recent changelog feed
- ✅ Connected services overview
- ✅ Settings page (API config + system settings)
- ✅ Resources overview page
- **Changelog**: CHG-006

**Phase 6: Authentication & Multi-User System** ✅ COMPLETE
- ✅ Iron-session based authentication
- ✅ Login page with email/password
- ✅ Route protection middleware
- ✅ Session management utilities (LIB-025)
- ✅ Auth server actions (login/logout) (LIB-026)
- ✅ Multi-user API key configuration
- ✅ User-specific resource isolation
- ✅ Debug panel with copy-to-clipboard (COMP-090)
- ✅ User creation scripts
- **Version**: 0.4.0

### 📊 Current Stats
- **Total Files Created**: 65+ (including auth system)
- **Changelog Entries**: 11 (CHG-001 through CHG-011) - ✅ Complete history seeded
- **Git Commits**: 8+
- **Lines of Code**: ~5,500+
- **Database Tables**: 8 models (fully seeded)
- **API Integrations**: 1/4 complete (ngrok ✅)
- **Authentication**: ✅ Multi-user login system implemented
- **Production Status**: ✅ Deployed to Vercel (dashboard.amikkelson.io)
- **Current Version**: 0.4.0

### 🚀 Next Phases

**Phase 7: Remaining API Integrations** 🔜 NEXT
- Vercel API client & sync
- Neon API client & sync
- Upstash API client & sync
- Auto-sync functionality for all services

**Phase 8: Polish & Testing** 🔜 PENDING
- Error boundaries
- Loading states
- Empty states
- Accessibility improvements
- Performance optimization
- Add logout button to header

**Phase 9: Advanced Features** 🔜 PENDING
- Auto-migration of environment variable API keys on first login
- Email notifications for resource events
- Webhook integrations
- API usage analytics

---

## Table of Contents
1. [Versioning Workflow](#versioning-workflow)
2. [Project Overview](#project-overview)
3. [Technical Architecture](#technical-architecture)
4. [Technology Stack](#technology-stack)
5. [API Integrations](#api-integrations)
6. [Database Schema](#database-schema)
7. [Code Reference System](#code-reference-system)
8. [Changelog System](#changelog-system)
9. [Mobile-First UI/UX Design](#mobile-first-uiux-design)
10. [Folder Structure](#folder-structure)
11. [Development Phases](#development-phases)
12. [Security Considerations](#security-considerations)
13. [Deployment Strategy](#deployment-strategy)
14. [Troubleshooting & Known Issues](#troubleshooting--known-issues)

---

## 1. Versioning Workflow

### Version Update Protocol
**IMPORTANT**: Every time you make an update to this project, you MUST follow this workflow:

1. **Update package.json version**
   - Increment the version number following semantic versioning (MAJOR.MINOR.PATCH)
   - Location: `package.json` line 3

2. **Update this CLAUDE.md file**
   - Update the "Current Stats" section with new file counts, changelog entries, etc.
   - Add completed phases to the "Completed Phases" section
   - Document new features or changes

3. **Create a changelog entry**
   - Add a new entry to the database via seed script or API
   - Use the next CHG-XXX number in sequence
   - Include all file changes with their FILE-REF numbers
   - Document the purpose and impact of changes

4. **Update the global version display**
   - The VersionBadge component (COMP-083) automatically reads from package.json
   - No manual update needed - it will show the new version immediately

### Version Display
The current version is always visible in the header (COMP-060) via the VersionBadge component (COMP-083), which reads directly from package.json as the single source of truth.

### Semantic Versioning Rules
- **MAJOR** (X.0.0): Breaking changes, major new features, architecture changes
- **MINOR** (0.X.0): New features, significant improvements, new integrations
- **PATCH** (0.0.X): Bug fixes, minor improvements, documentation updates

### Current Version: 0.4.0
- **0.1.0**: Initial setup and Phase 1-5 completion
- **0.2.0**: User authentication system, API key management, version display
- **0.3.0**: Version badge component, timezone configuration
- **0.3.1**: Placeholder pages for Vercel, Neon, Upstash resources (404 fix)
- **0.3.2**: ENCRYPTION_KEY diagnostic and production environment fix
- **0.4.0**: Complete authentication system with iron-session, login page, route protection middleware, multi-user API key configuration, debug panel with copy-to-clipboard, session management utilities

---

## 2. Project Overview

### Core Features
- **Project Management**: Create, view, edit, and delete projects
- **ngrok Tunnel Monitoring**: View active tunnels, connection stats, and tunnel details
- **Vercel Deployment Tracking**: Monitor deployments, build status, domains, and analytics
- **Neon Database Management**: View database instances, connection strings, usage metrics
- **Upstash Database Management**: Monitor Redis/Kafka instances, connection info, usage
- **Real-time Updates**: Auto-refresh data from all services
- **Changelog**: Automatic tracking of all system updates and changes
- **Mobile-First**: Optimized for mobile devices with responsive design

### User Flows
1. **Dashboard View**: See all resources at a glance with status indicators
2. **Add New Resource**: Quick-add forms for each resource type
3. **Detail View**: Deep dive into individual resources with metrics and logs
4. **Settings**: Manage API keys and service integrations
5. **Changelog**: View complete history of all system changes

---

## 2. Technical Architecture

### Architecture Pattern
**Monolithic Full-Stack Application** with:
- Server-side rendering (SSR) for initial load performance
- Client-side rendering (CSR) for interactive features
- API routes for backend logic and external API integration
- Edge functions for real-time data fetching

### Data Flow
```
┌─────────────────────────────────────────────────────────┐
│                     Frontend (Next.js)                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   Dashboard  │  │   Projects   │  │  Changelog   │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│              API Routes (/app/api/...)                   │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │
│  │  ngrok   │ │  Vercel  │ │   Neon   │ │  Upstash │  │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘  │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│                 Database Layer (Prisma)                  │
│              PostgreSQL (Neon for hosting)               │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│              External Services APIs                      │
│   [ngrok API] [Vercel API] [Neon API] [Upstash API]    │
└─────────────────────────────────────────────────────────┘
```

---

## 3. Technology Stack

### Frontend
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript 5+
- **Styling**: Tailwind CSS 3+ with custom design system
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **State Management**: React Context + Server Actions
- **Forms**: React Hook Form + Zod validation
- **Charts**: Recharts (for analytics visualizations)

### Backend
- **Runtime**: Node.js 20+ (Vercel serverless functions)
- **API**: Next.js API Routes
- **ORM**: Prisma 5+
- **Validation**: Zod
- **Authentication**: NextAuth.js v5 (if needed for multi-user)
- **Rate Limiting**: Upstash Rate Limit

### Database
- **Primary DB**: PostgreSQL (hosted on Neon)
- **ORM**: Prisma
- **Caching**: Upstash Redis (for API response caching)
- **Migrations**: Prisma Migrate

### External APIs
- **ngrok API**: REST API v2 (https://api.ngrok.com)
- **Vercel API**: REST API (https://api.vercel.com)
- **Neon API**: REST API (https://console.neon.tech/api/v2)
- **Upstash API**: REST API (https://api.upstash.com)

### Development Tools
- **Package Manager**: pnpm
- **Linting**: ESLint + Prettier
- **Type Checking**: TypeScript strict mode
- **Git Hooks**: Husky + lint-staged
- **Testing**: Vitest + React Testing Library (future phase)

### Deployment
- **Hosting**: Vercel
- **CI/CD**: Vercel Git integration (auto-deploy on push)
- **Environment Variables**: Vercel Environment Variables
- **Domain**: Custom domain (configured later)

---

## 4. API Integrations

### 4.1 ngrok API Integration

#### Authentication
- **Method**: Bearer token authentication
- **API Key**: Stored in environment variable `NGROK_API_KEY`
- **Base URL**: `https://api.ngrok.com`

#### Endpoints to Use
1. **List Tunnels**: `GET /tunnels`
   - Response: Array of active tunnels with URLs, protocols, connections
2. **Tunnel Details**: `GET /tunnels/{tunnel_id}`
   - Response: Detailed tunnel info including metrics
3. **List Edges**: `GET /edges/https` (for permanent domains)
4. **Connection Stats**: `GET /tunnel_sessions`

#### Data to Display
- Tunnel public URL
- Tunnel protocol (http, tcp, tls)
- Forwarding address
- Connection count
- Bytes transferred
- Status (active/inactive)
- Created/updated timestamps

#### Implementation File
- `lib/api/ngrok.ts` - API client
- `app/api/ngrok/route.ts` - Next.js API route
- `components/NgrokCard.tsx` - UI component

---

### 4.2 Vercel API Integration

#### Authentication
- **Method**: Bearer token authentication
- **API Key**: Stored in environment variable `VERCEL_API_TOKEN`
- **Base URL**: `https://api.vercel.com`
- **Team ID**: Optional `VERCEL_TEAM_ID` for team accounts

#### Endpoints to Use
1. **List Projects**: `GET /v9/projects`
   - Response: All projects in account/team
2. **Project Details**: `GET /v9/projects/{project_id}`
3. **List Deployments**: `GET /v6/deployments?projectId={project_id}`
4. **Deployment Details**: `GET /v13/deployments/{deployment_id}`
5. **Domains**: `GET /v5/projects/{project_id}/domains`
6. **Environment Variables**: `GET /v9/projects/{project_id}/env`

#### Data to Display
- Project name
- Framework (Next.js, React, etc.)
- Latest deployment status (ready, building, error)
- Production URL
- Preview URLs
- Build time
- Last deployed timestamp
- Git branch/commit info

#### Implementation File
- `lib/api/vercel.ts` - API client
- `app/api/vercel/route.ts` - Next.js API route
- `components/VercelCard.tsx` - UI component

---

### 4.3 Neon API Integration

#### Authentication
- **Method**: Bearer token authentication
- **API Key**: Stored in environment variable `NEON_API_KEY`
- **Base URL**: `https://console.neon.tech/api/v2`

#### Endpoints to Use
1. **List Projects**: `GET /projects`
   - Response: All Neon projects
2. **Project Details**: `GET /projects/{project_id}`
3. **List Branches**: `GET /projects/{project_id}/branches`
4. **Database Details**: `GET /projects/{project_id}/branches/{branch_id}/databases`
5. **Connection URI**: `GET /projects/{project_id}/connection_uri`
6. **Usage Metrics**: `GET /projects/{project_id}/consumption`

#### Data to Display
- Project name
- Database name
- PostgreSQL version
- Region
- Connection string (masked, click to reveal)
- Storage usage (GB)
- Compute hours used
- Active branches
- Status (active, suspended)

#### Implementation File
- `lib/api/neon.ts` - API client
- `app/api/neon/route.ts` - Next.js API route
- `components/NeonCard.tsx` - UI component

---

### 4.4 Upstash API Integration

#### Authentication
- **Method**: Bearer token authentication
- **API Key**: Stored in environment variable `UPSTASH_API_KEY`
- **Base URL**: `https://api.upstash.com`
- **Email**: Required for authentication

#### Endpoints to Use
1. **List Redis Databases**: `GET /v2/redis/databases`
   - Response: All Redis databases
2. **Database Details**: `GET /v2/redis/database/{id}`
3. **Database Stats**: `GET /v2/redis/stats/{id}`
4. **List Kafka Clusters**: `GET /v2/kafka/clusters`
5. **Cluster Details**: `GET /v2/kafka/cluster/{id}`

#### Data to Display
- Database/cluster name
- Type (Redis, Kafka)
- Region
- Endpoint URL
- Port
- TLS enabled
- Total commands/messages
- Storage used
- Status (active, paused)

#### Implementation File
- `lib/api/upstash.ts` - API client
- `app/api/upstash/route.ts` - Next.js API route
- `components/UpstashCard.tsx` - UI component

---

## 5. Database Schema

### Prisma Schema (`prisma/schema.prisma`)

```prisma
// This is your Prisma schema file

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// Projects - User's custom projects
model Project {
  id          String   @id @default(cuid())
  name        String
  description String?
  repository  String?  // GitHub/GitLab URL
  status      ProjectStatus @default(ACTIVE)
  tags        String[] // Array of tags for categorization
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Relations
  ngrokTunnels    NgrokTunnel[]
  vercelProjects  VercelProject[]
  neonDatabases   NeonDatabase[]
  upstashDatabases UpstashDatabase[]
  changelog       ChangelogEntry[]

  @@index([status])
  @@index([createdAt])
}

enum ProjectStatus {
  ACTIVE
  ARCHIVED
  PAUSED
}

// ngrok Tunnels
model NgrokTunnel {
  id              String   @id @default(cuid())
  ngrokId         String   @unique // ngrok's internal ID
  publicUrl       String
  protocol        String   // http, https, tcp, tls
  forwardingAddr  String   // localhost:3000
  region          String?
  connectionCount Int      @default(0)
  bytesTransferred BigInt  @default(0)
  status          TunnelStatus @default(ACTIVE)
  lastSyncedAt    DateTime @default(now())
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  // Relations
  projectId   String?
  project     Project? @relation(fields: [projectId], references: [id], onDelete: SetNull)

  @@index([status])
  @@index([lastSyncedAt])
}

enum TunnelStatus {
  ACTIVE
  INACTIVE
  ERROR
}

// Vercel Projects
model VercelProject {
  id              String   @id @default(cuid())
  vercelId        String   @unique // Vercel's project ID
  name            String
  framework       String?  // nextjs, react, vue, etc.
  productionUrl   String?
  gitProvider     String?  // github, gitlab, bitbucket
  gitRepo         String?
  latestDeployment Json?   // Store latest deployment info
  buildStatus     BuildStatus @default(READY)
  lastDeployedAt  DateTime?
  lastSyncedAt    DateTime @default(now())
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  // Relations
  projectId   String?
  project     Project? @relation(fields: [projectId], references: [id], onDelete: SetNull)

  @@index([buildStatus])
  @@index([lastSyncedAt])
}

enum BuildStatus {
  READY
  BUILDING
  ERROR
  QUEUED
  CANCELED
}

// Neon Databases
model NeonDatabase {
  id              String   @id @default(cuid())
  neonProjectId   String   @unique // Neon's project ID
  projectName     String
  databaseName    String
  region          String
  postgresVersion String
  connectionUri   String   // Encrypted
  storageUsageGB  Float    @default(0)
  computeHours    Float    @default(0)
  branchCount     Int      @default(1)
  status          DatabaseStatus @default(ACTIVE)
  lastSyncedAt    DateTime @default(now())
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  // Relations
  projectId   String?
  project     Project? @relation(fields: [projectId], references: [id], onDelete: SetNull)

  @@index([status])
  @@index([lastSyncedAt])
}

enum DatabaseStatus {
  ACTIVE
  SUSPENDED
  ERROR
}

// Upstash Databases
model UpstashDatabase {
  id              String   @id @default(cuid())
  upstashId       String   @unique // Upstash's database/cluster ID
  name            String
  type            UpstashType // REDIS or KAFKA
  region          String
  endpoint        String
  port            Int
  tlsEnabled      Boolean  @default(true)
  totalCommands   BigInt   @default(0)
  storageUsedMB   Float    @default(0)
  status          DatabaseStatus @default(ACTIVE)
  lastSyncedAt    DateTime @default(now())
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  // Relations
  projectId   String?
  project     Project? @relation(fields: [projectId], references: [id], onDelete: SetNull)

  @@index([type])
  @@index([status])
  @@index([lastSyncedAt])
}

enum UpstashType {
  REDIS
  KAFKA
}

// Changelog Entries
model ChangelogEntry {
  id          String   @id @default(cuid())
  refNumber   String   @unique // e.g., "CHG-001", "CHG-002"
  title       String
  description String
  category    ChangeCategory
  severity    ChangeSeverity @default(MINOR)
  fileChanges Json?    // Array of files changed with their ref numbers
  author      String   @default("System")
  createdAt   DateTime @default(now())

  // Relations
  projectId   String?
  project     Project? @relation(fields: [projectId], references: [id], onDelete: SetNull)

  @@index([category])
  @@index([createdAt(sort: Desc)])
}

enum ChangeCategory {
  FEATURE
  BUGFIX
  IMPROVEMENT
  REFACTOR
  DOCUMENTATION
  CONFIGURATION
  DATABASE
  API
  UI
}

enum ChangeSeverity {
  CRITICAL  // Breaking changes, major features
  MAJOR     // New features, significant improvements
  MINOR     // Small improvements, bug fixes
  PATCH     // Tiny fixes, typos
}

// API Keys Storage (encrypted)
model ApiKey {
  id          String   @id @default(cuid())
  service     ServiceType @unique
  keyValue    String   // Encrypted
  isActive    Boolean  @default(true)
  lastUsedAt  DateTime?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([service])
}

enum ServiceType {
  NGROK
  VERCEL
  NEON
  UPSTASH
}

// System Settings
model SystemSetting {
  id          String   @id @default(cuid())
  key         String   @unique
  value       String
  description String?
  updatedAt   DateTime @updatedAt

  @@index([key])
}
```

---

## 6. Code Reference System

### Reference Number Format
Each file will contain a reference number in the following format:

```
FILE-REF: {CATEGORY}-{SEQUENCE}-{DATE}
```

**Examples**:
- `FILE-REF: COMP-001-20251128` - First component file
- `FILE-REF: API-012-20251128` - 12th API file
- `FILE-REF: PAGE-003-20251128` - 3rd page file

### Categories
- **COMP**: Components (`components/`)
- **PAGE**: Pages (`app/` routes)
- **API**: API routes (`app/api/`)
- **LIB**: Library/utility files (`lib/`)
- **HOOK**: Custom React hooks (`hooks/`)
- **TYPE**: TypeScript type definitions (`types/`)
- **STYLE**: Styling files (`styles/`)
- **CONFIG**: Configuration files (root level)
- **DB**: Database files (`prisma/`)

### File Header Template
Every file will start with:

```typescript
/**
 * FILE-REF: {CATEGORY}-{SEQUENCE}-{DATE}
 *
 * @file {filename}
 * @description {Brief description of file purpose}
 * @category {Category name}
 * @created {Creation date}
 * @modified {Last modified date}
 *
 * @changelog
 * - {DATE} - {CHANGE_DESCRIPTION} (CHG-XXX)
 *
 * @dependencies
 * - {DEPENDENCY_1}
 * - {DEPENDENCY_2}
 *
 * @see Related files:
 * - {RELATED_FILE_REF}
 */
```

### Reference Tracking
- A master reference file `REFERENCES.md` will be maintained at root level
- Lists all file references with their paths and descriptions
- Auto-updated when new files are created
- Searchable index for quick file location

---

## 7. Changelog System

### Automatic Changelog Generation

#### Trigger Points
Changelog entries are created automatically when:
1. New resource is added (project, tunnel, deployment, database)
2. Resource is updated (status change, configuration change)
3. Resource is deleted
4. API integration is configured/updated
5. System settings are modified
6. Database schema is migrated
7. New feature is deployed

#### Changelog Entry Format
```typescript
{
  refNumber: "CHG-001",
  title: "Added ngrok tunnel tracking",
  description: "Integrated ngrok API to fetch and display active tunnels",
  category: "FEATURE",
  severity: "MAJOR",
  fileChanges: [
    { ref: "API-003-20251128", path: "app/api/ngrok/route.ts" },
    { ref: "LIB-005-20251128", path: "lib/api/ngrok.ts" },
    { ref: "COMP-012-20251128", path: "components/NgrokCard.tsx" }
  ],
  author: "System",
  createdAt: "2025-11-28T10:30:00Z"
}
```

#### Implementation
- **Server Action**: `lib/actions/changelog.ts`
- **Database**: `ChangelogEntry` model in Prisma
- **UI Component**: `components/ChangelogViewer.tsx`
- **API Route**: `app/api/changelog/route.ts`

#### UI Features
- **Timeline View**: Chronological list with visual timeline
- **Filter by Category**: FEATURE, BUGFIX, etc.
- **Filter by Severity**: CRITICAL, MAJOR, MINOR, PATCH
- **Search**: Full-text search across titles and descriptions
- **Date Range**: Filter by date range
- **File References**: Click to view file details
- **Export**: Export changelog as Markdown or JSON

#### Auto-Update Mechanism
1. Middleware intercepts all write operations (POST, PUT, DELETE)
2. Before completing operation, creates changelog entry
3. Uses transaction to ensure atomicity
4. Real-time update to UI using Server-Sent Events or polling

---

## 8. Mobile-First UI/UX Design

### Design Principles
1. **Touch-First**: All interactive elements ≥ 44x44px
2. **Progressive Enhancement**: Works on slow 3G connections
3. **Responsive Breakpoints**:
   - Mobile: 320px - 640px (default/primary design)
   - Tablet: 641px - 1024px
   - Desktop: 1025px+
4. **Performance**: First Contentful Paint < 1.5s on 3G
5. **Accessibility**: WCAG 2.1 AA compliance

### Mobile-Specific Features

#### Navigation
- **Bottom Tab Bar** (mobile): Quick access to main sections
  - Dashboard (home icon)
  - Projects (folder icon)
  - Resources (server icon)
  - Changelog (list icon)
  - Settings (gear icon)
- **Hamburger Menu** (tablet/desktop): Side navigation

#### Cards & Lists
- **Swipeable Cards**: Swipe left for delete, right for edit
- **Pull to Refresh**: Native-like refresh gesture
- **Infinite Scroll**: Load more items as user scrolls
- **Skeleton Loading**: Show placeholders while loading

#### Forms
- **Auto-fill**: Support for browser autofill
- **Input Types**: Use correct HTML5 input types (url, email, etc.)
- **Validation**: Real-time inline validation
- **Submit States**: Loading, success, error feedback

#### Performance Optimizations
- **Image Optimization**: Next.js Image component with responsive sizes
- **Code Splitting**: Route-based code splitting
- **Lazy Loading**: Defer non-critical components
- **Service Worker**: Cache static assets (future phase)

### Design System

#### Colors
```javascript
// Tailwind config
colors: {
  primary: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    500: '#0ea5e9',  // Main brand color
    600: '#0284c7',
    900: '#0c4a6e',
  },
  success: {
    500: '#10b981',  // Green for active/success
  },
  warning: {
    500: '#f59e0b',  // Orange for warnings
  },
  error: {
    500: '#ef4444',  // Red for errors
  },
  neutral: {
    50: '#fafafa',
    100: '#f5f5f5',
    800: '#262626',
    900: '#171717',
  }
}
```

#### Typography
- **Font Family**: Inter (system fallback)
- **Sizes**:
  - xs: 12px
  - sm: 14px
  - base: 16px (body text)
  - lg: 18px
  - xl: 20px (headings)
  - 2xl: 24px
  - 3xl: 30px

#### Spacing
- **Base Unit**: 4px (0.25rem)
- **Common Spacing**: 8px, 12px, 16px, 24px, 32px, 48px

#### Components (shadcn/ui)
- Button
- Card
- Badge
- Input
- Select
- Dialog
- Dropdown Menu
- Toast
- Skeleton
- Tabs
- Accordion
- Sheet (mobile drawer)

---

## 9. Folder Structure

```
project-dashboard/
├── app/                          # Next.js App Router
│   ├── (dashboard)/              # Dashboard layout group
│   │   ├── layout.tsx            # PAGE-001 - Main dashboard layout
│   │   ├── page.tsx              # PAGE-002 - Dashboard home
│   │   ├── projects/
│   │   │   ├── page.tsx          # PAGE-003 - Projects list
│   │   │   ├── [id]/
│   │   │   │   └── page.tsx      # PAGE-004 - Project detail
│   │   │   └── new/
│   │   │       └── page.tsx      # PAGE-005 - New project form
│   │   ├── resources/
│   │   │   ├── page.tsx          # PAGE-006 - All resources view
│   │   │   ├── ngrok/
│   │   │   │   └── page.tsx      # PAGE-007 - ngrok tunnels
│   │   │   ├── vercel/
│   │   │   │   └── page.tsx      # PAGE-008 - Vercel projects
│   │   │   ├── neon/
│   │   │   │   └── page.tsx      # PAGE-009 - Neon databases
│   │   │   └── upstash/
│   │   │       └── page.tsx      # PAGE-010 - Upstash databases
│   │   ├── changelog/
│   │   │   └── page.tsx          # PAGE-011 - Changelog viewer
│   │   └── settings/
│   │       └── page.tsx          # PAGE-012 - Settings
│   │
│   ├── api/                      # API Routes
│   │   ├── projects/
│   │   │   ├── route.ts          # API-001 - List/create projects
│   │   │   └── [id]/
│   │   │       └── route.ts      # API-002 - Update/delete project
│   │   ├── ngrok/
│   │   │   ├── route.ts          # API-003 - Fetch ngrok data
│   │   │   └── sync/
│   │   │       └── route.ts      # API-004 - Sync ngrok data
│   │   ├── vercel/
│   │   │   ├── route.ts          # API-005 - Fetch Vercel data
│   │   │   └── sync/
│   │   │       └── route.ts      # API-006 - Sync Vercel data
│   │   ├── neon/
│   │   │   ├── route.ts          # API-007 - Fetch Neon data
│   │   │   └── sync/
│   │   │       └── route.ts      # API-008 - Sync Neon data
│   │   ├── upstash/
│   │   │   ├── route.ts          # API-009 - Fetch Upstash data
│   │   │   └── sync/
│   │   │       └── route.ts      # API-010 - Sync Upstash data
│   │   ├── changelog/
│   │   │   └── route.ts          # API-011 - Changelog CRUD
│   │   └── settings/
│   │       └── route.ts          # API-012 - Settings CRUD
│   │
│   ├── layout.tsx                # PAGE-000 - Root layout
│   ├── globals.css               # STYLE-001 - Global styles
│   └── error.tsx                 # PAGE-013 - Error boundary
│
├── components/                   # React Components
│   ├── ui/                       # shadcn/ui components
│   │   ├── button.tsx            # COMP-001 - Button
│   │   ├── card.tsx              # COMP-002 - Card
│   │   ├── badge.tsx             # COMP-003 - Badge
│   │   ├── input.tsx             # COMP-004 - Input
│   │   └── ...                   # Other UI primitives
│   │
│   ├── dashboard/
│   │   ├── DashboardHeader.tsx   # COMP-020 - Dashboard header
│   │   ├── DashboardStats.tsx    # COMP-021 - Stats overview
│   │   └── QuickActions.tsx      # COMP-022 - Quick action buttons
│   │
│   ├── projects/
│   │   ├── ProjectCard.tsx       # COMP-030 - Project card
│   │   ├── ProjectForm.tsx       # COMP-031 - Project form
│   │   └── ProjectList.tsx       # COMP-032 - Project list
│   │
│   ├── resources/
│   │   ├── NgrokCard.tsx         # COMP-040 - ngrok tunnel card
│   │   ├── VercelCard.tsx        # COMP-041 - Vercel project card
│   │   ├── NeonCard.tsx          # COMP-042 - Neon database card
│   │   ├── UpstashCard.tsx       # COMP-043 - Upstash database card
│   │   └── ResourceGrid.tsx      # COMP-044 - Resource grid layout
│   │
│   ├── changelog/
│   │   ├── ChangelogEntry.tsx    # COMP-050 - Single entry
│   │   ├── ChangelogTimeline.tsx # COMP-051 - Timeline view
│   │   └── ChangelogFilters.tsx  # COMP-052 - Filter controls
│   │
│   ├── layout/
│   │   ├── Header.tsx            # COMP-060 - Site header
│   │   ├── MobileNav.tsx         # COMP-061 - Mobile navigation
│   │   ├── DesktopNav.tsx        # COMP-062 - Desktop navigation
│   │   └── Footer.tsx            # COMP-063 - Site footer
│   │
│   └── shared/
│       ├── LoadingSpinner.tsx    # COMP-070 - Loading state
│       ├── ErrorMessage.tsx      # COMP-071 - Error display
│       ├── EmptyState.tsx        # COMP-072 - Empty state
│       └── RefreshButton.tsx     # COMP-073 - Manual refresh
│
├── lib/                          # Library code
│   ├── api/                      # API clients
│   │   ├── ngrok.ts              # LIB-001 - ngrok API client
│   │   ├── vercel.ts             # LIB-002 - Vercel API client
│   │   ├── neon.ts               # LIB-003 - Neon API client
│   │   └── upstash.ts            # LIB-004 - Upstash API client
│   │
│   ├── actions/                  # Server Actions
│   │   ├── projects.ts           # LIB-010 - Project actions
│   │   ├── sync.ts               # LIB-011 - Sync actions
│   │   ├── changelog.ts          # LIB-012 - Changelog actions
│   │   └── settings.ts           # LIB-013 - Settings actions
│   │
│   ├── utils/
│   │   ├── db.ts                 # LIB-020 - Prisma client
│   │   ├── encryption.ts         # LIB-021 - Encrypt/decrypt utils
│   │   ├── format.ts             # LIB-022 - Formatting helpers
│   │   ├── validation.ts         # LIB-023 - Validation schemas
│   │   └── constants.ts          # LIB-024 - App constants
│   │
│   └── hooks/                    # Custom React hooks
│       ├── useProjects.ts        # HOOK-001 - Projects data hook
│       ├── useResources.ts       # HOOK-002 - Resources data hook
│       ├── useChangelog.ts       # HOOK-003 - Changelog data hook
│       └── useMediaQuery.ts      # HOOK-004 - Responsive hook
│
├── types/                        # TypeScript types
│   ├── project.ts                # TYPE-001 - Project types
│   ├── resources.ts              # TYPE-002 - Resource types
│   ├── changelog.ts              # TYPE-003 - Changelog types
│   └── api.ts                    # TYPE-004 - API response types
│
├── prisma/
│   ├── schema.prisma             # DB-001 - Database schema
│   ├── migrations/               # DB migrations
│   └── seed.ts                   # DB-002 - Seed data
│
├── public/
│   ├── favicon.ico
│   └── images/
│
├── .env.local                    # CONFIG-001 - Environment variables
├── .env.example                  # CONFIG-002 - Env template
├── next.config.js                # CONFIG-003 - Next.js config
├── tailwind.config.ts            # CONFIG-004 - Tailwind config
├── tsconfig.json                 # CONFIG-005 - TypeScript config
├── package.json                  # CONFIG-006 - Dependencies
├── .eslintrc.json                # CONFIG-007 - ESLint config
├── .prettierrc                   # CONFIG-008 - Prettier config
├── CLAUDE.md                     # This file - Project plan
├── REFERENCES.md                 # Master file reference index
└── README.md                     # Project documentation
```

---

## 10. Development Phases

### Phase 1: Foundation Setup (Week 1)
**Goal**: Set up project infrastructure and basic routing

#### Tasks
1. **Initialize Next.js Project**
   - Run `pnpm create next-app@latest`
   - Configure TypeScript, Tailwind CSS, App Router
   - Set up ESLint and Prettier
   - Files: CONFIG-001 through CONFIG-008

2. **Install Dependencies**
   ```bash
   pnpm add @prisma/client prisma zod react-hook-form @hookform/resolvers
   pnpm add lucide-react framer-motion recharts
   pnpm add @radix-ui/react-* (for shadcn components)
   pnpm add -D @types/node @types/react typescript
   ```

3. **Database Setup**
   - Create Neon database instance
   - Initialize Prisma
   - Create initial schema (DB-001)
   - Run migrations
   - Create seed file (DB-002)

4. **Environment Configuration**
   - Create `.env.local` template
   - Add placeholder API keys
   - Configure Vercel environment variables

5. **Project Structure**
   - Create all folders as per structure
   - Add README.md with setup instructions
   - Create REFERENCES.md file
   - Add .gitignore

6. **Design System**
   - Install shadcn/ui components
   - Create custom Tailwind theme (CONFIG-004)
   - Set up global styles (STYLE-001)

**Deliverables**:
- Working Next.js app with routing
- Database connected and migrated
- Design system configured
- Git repository initialized

---

### Phase 2: Core UI Components (Week 2)
**Goal**: Build reusable UI components and layout

#### Tasks
1. **Layout Components**
   - Header (COMP-060)
   - Mobile Navigation (COMP-061)
   - Desktop Navigation (COMP-062)
   - Footer (COMP-063)
   - Root layout (PAGE-000)
   - Dashboard layout (PAGE-001)

2. **shadcn/ui Integration**
   - Button (COMP-001)
   - Card (COMP-002)
   - Badge (COMP-003)
   - Input (COMP-004)
   - Dialog, Select, Dropdown, Toast, Skeleton, Tabs, Accordion, Sheet

3. **Shared Components**
   - LoadingSpinner (COMP-070)
   - ErrorMessage (COMP-071)
   - EmptyState (COMP-072)
   - RefreshButton (COMP-073)

4. **Dashboard Components**
   - DashboardHeader (COMP-020)
   - DashboardStats (COMP-021)
   - QuickActions (COMP-022)

5. **Responsive Testing**
   - Test on mobile (320px, 375px, 414px)
   - Test on tablet (768px, 1024px)
   - Test on desktop (1280px, 1920px)

**Deliverables**:
- Complete design system
- Responsive layout components
- Reusable UI components
- Mobile-first navigation

---

### Phase 3: Project Management (Week 3)
**Goal**: Implement project CRUD functionality

#### Tasks
1. **Database Models**
   - Project model implementation
   - Prisma client setup (LIB-020)

2. **Server Actions**
   - Create project action (LIB-010)
   - Update project action
   - Delete project action
   - List projects action

3. **API Routes**
   - Projects list/create (API-001)
   - Project detail/update/delete (API-002)

4. **UI Components**
   - ProjectCard (COMP-030)
   - ProjectForm (COMP-031)
   - ProjectList (COMP-032)

5. **Pages**
   - Projects list page (PAGE-003)
   - Project detail page (PAGE-004)
   - New project page (PAGE-005)

6. **Validation**
   - Zod schemas (LIB-023)
   - Form validation
   - Error handling

**Deliverables**:
- Full project CRUD functionality
- Form validation
- Error handling
- Responsive project UI

---

### Phase 4: ngrok Integration (Week 4)
**Goal**: Integrate ngrok API and display tunnels

#### Tasks
1. **API Client**
   - Create ngrok client (LIB-001)
   - Implement authentication
   - Add error handling
   - Add rate limiting

2. **Database Models**
   - NgrokTunnel model
   - Sync logic

3. **API Routes**
   - Fetch tunnels (API-003)
   - Sync tunnels (API-004)

4. **Server Actions**
   - Sync ngrok data
   - Link tunnel to project

5. **UI Components**
   - NgrokCard (COMP-040)
   - Tunnel status indicator
   - Connection stats display

6. **Pages**
   - ngrok tunnels page (PAGE-007)

7. **Changelog**
   - Auto-create changelog entry on sync

**Deliverables**:
- Working ngrok integration
- Tunnel display UI
- Automatic sync
- Changelog integration

---

### Phase 5: Vercel Integration (Week 5)
**Goal**: Integrate Vercel API and display deployments

#### Tasks
1. **API Client**
   - Create Vercel client (LIB-002)
   - Implement authentication
   - Handle team accounts

2. **Database Models**
   - VercelProject model
   - Deployment data structure

3. **API Routes**
   - Fetch projects (API-005)
   - Sync projects (API-006)

4. **Server Actions**
   - Sync Vercel data
   - Link deployment to project

5. **UI Components**
   - VercelCard (COMP-041)
   - Build status indicator
   - Deployment timeline

6. **Pages**
   - Vercel projects page (PAGE-008)

7. **Changelog**
   - Auto-create changelog entry

**Deliverables**:
- Working Vercel integration
- Deployment display UI
- Build status tracking
- Changelog integration

---

### Phase 6: Neon Integration (Week 6)
**Goal**: Integrate Neon API and display databases

#### Tasks
1. **API Client**
   - Create Neon client (LIB-003)
   - Implement authentication
   - Handle branches

2. **Database Models**
   - NeonDatabase model
   - Usage metrics storage

3. **API Routes**
   - Fetch databases (API-007)
   - Sync databases (API-008)

4. **Server Actions**
   - Sync Neon data
   - Link database to project
   - Encrypt connection strings (LIB-021)

5. **UI Components**
   - NeonCard (COMP-042)
   - Usage metrics display
   - Connection string reveal

6. **Pages**
   - Neon databases page (PAGE-009)

7. **Changelog**
   - Auto-create changelog entry

**Deliverables**:
- Working Neon integration
- Database display UI
- Usage metrics
- Secure connection string handling

---

### Phase 7: Upstash Integration (Week 7)
**Goal**: Integrate Upstash API and display databases

#### Tasks
1. **API Client**
   - Create Upstash client (LIB-004)
   - Implement authentication
   - Handle Redis and Kafka

2. **Database Models**
   - UpstashDatabase model
   - Type differentiation (Redis/Kafka)

3. **API Routes**
   - Fetch databases (API-009)
   - Sync databases (API-010)

4. **Server Actions**
   - Sync Upstash data
   - Link database to project

5. **UI Components**
   - UpstashCard (COMP-043)
   - Type indicator
   - Stats display

6. **Pages**
   - Upstash databases page (PAGE-010)

7. **Changelog**
   - Auto-create changelog entry

**Deliverables**:
- Working Upstash integration
- Database display UI
- Redis/Kafka differentiation
- Changelog integration

---

### Phase 8: Dashboard & Resources (Week 8)
**Goal**: Build main dashboard and unified resources view

#### Tasks
1. **Dashboard Page**
   - Dashboard home (PAGE-002)
   - Stats overview
   - Recent activity
   - Quick actions

2. **Resources Page**
   - All resources view (PAGE-006)
   - Unified grid (COMP-044)
   - Filter by type
   - Search functionality

3. **Custom Hooks**
   - useProjects (HOOK-001)
   - useResources (HOOK-002)
   - useMediaQuery (HOOK-004)

4. **Auto-Refresh**
   - Polling mechanism
   - Manual refresh button
   - Last synced timestamp

5. **Performance Optimization**
   - Implement code splitting
   - Add image optimization
   - Lazy load components

**Deliverables**:
- Complete dashboard
- Unified resources view
- Auto-refresh functionality
- Performance optimizations

---

### Phase 9: Changelog System (Week 9)
**Goal**: Build comprehensive changelog viewer

#### Tasks
1. **Changelog Components**
   - ChangelogEntry (COMP-050)
   - ChangelogTimeline (COMP-051)
   - ChangelogFilters (COMP-052)

2. **Changelog Page**
   - Timeline view (PAGE-011)
   - Filter UI
   - Search functionality
   - Export feature

3. **Server Actions**
   - Changelog CRUD (LIB-012)
   - Auto-creation logic
   - Search implementation

4. **API Routes**
   - Changelog endpoint (API-011)

5. **Custom Hook**
   - useChangelog (HOOK-003)

6. **Integration**
   - Hook into all write operations
   - Auto-create entries
   - Real-time updates

**Deliverables**:
- Working changelog system
- Timeline UI
- Auto-generation
- Search and filter

---

### Phase 10: Settings & Configuration (Week 10)
**Goal**: Build settings page and API key management

#### Tasks
1. **Settings Page**
   - Settings UI (PAGE-012)
   - API key forms
   - System settings

2. **API Key Management**
   - Encryption (LIB-021)
   - Secure storage
   - Validation

3. **Server Actions**
   - Settings CRUD (LIB-013)
   - API key CRUD

4. **API Routes**
   - Settings endpoint (API-012)

5. **Security**
   - Input sanitization
   - CSRF protection
   - Rate limiting

**Deliverables**:
- Settings page
- API key management
- Secure storage
- Validation

---

### Phase 11: Testing & Polish (Week 11)
**Goal**: Test, fix bugs, and polish UI

#### Tasks
1. **Testing**
   - Test all API integrations
   - Test on multiple devices
   - Test edge cases
   - Performance testing

2. **Bug Fixes**
   - Fix identified issues
   - Handle error states
   - Improve loading states

3. **UI Polish**
   - Animations
   - Transitions
   - Micro-interactions
   - Accessibility improvements

4. **Documentation**
   - Complete README.md
   - Update REFERENCES.md
   - API documentation
   - User guide

**Deliverables**:
- Bug-free application
- Polished UI
- Complete documentation
- Test coverage

---

### Phase 12: Deployment (Week 12)
**Goal**: Deploy to production and monitor

#### Tasks
1. **Pre-Deployment**
   - Environment variables setup
   - Database migration on production
   - Performance audit
   - Security audit

2. **Deployment**
   - Deploy to Vercel
   - Configure custom domain (if any)
   - Set up monitoring
   - Set up error tracking

3. **Post-Deployment**
   - Verify all integrations
   - Test production API keys
   - Monitor performance
   - Fix any deployment issues

4. **Launch**
   - Final testing
   - Create first changelog entry
   - Monitor initial usage

**Deliverables**:
- Production deployment
- Monitoring setup
- Working application
- Launch announcement

---

## 12. Security Considerations

### API Key Security
1. **Storage**
   - Encrypt all API keys using AES-256
   - Store encryption key in environment variable
   - Never log API keys

2. **Transmission**
   - Use HTTPS only (enforced by Vercel)
   - Never send keys to client
   - Use server-side API routes only

3. **Access Control**
   - Implement rate limiting
   - Add CORS restrictions
   - Use NextAuth.js for multi-user (future)

### Data Security
1. **Database**
   - Use Neon's built-in encryption
   - Enable SSL connections
   - Regular backups

2. **Input Validation**
   - Validate all user input with Zod
   - Sanitize HTML output
   - Prevent SQL injection (Prisma handles this)

3. **CSRF Protection**
   - Use Next.js built-in CSRF protection
   - Validate origin headers
   - Use SameSite cookies

### External API Security
1. **Rate Limiting**
   - Respect API rate limits
   - Implement client-side rate limiting
   - Cache responses with Upstash Redis

2. **Error Handling**
   - Never expose internal errors to client
   - Log errors securely
   - Implement retry logic

---

## 13. Deployment Strategy

### Environment Setup

#### Local Development
```bash
# .env.local
DATABASE_URL="postgresql://..."
NGROK_API_KEY="..."
VERCEL_API_TOKEN="..."
NEON_API_KEY="..."
UPSTASH_API_KEY="..."
UPSTASH_EMAIL="..."
ENCRYPTION_KEY="..." # Generate with: openssl rand -hex 32
```

#### Production (Vercel)
- Add all environment variables in Vercel dashboard
- Enable automatic deployments from Git
- Set up preview deployments for branches

### Database Migrations
```bash
# Local
pnpm prisma migrate dev

# Production
pnpm prisma migrate deploy
```

### Build & Deploy
```bash
# Local build test
pnpm build

# Deploy to Vercel (automatic on git push)
git push origin main
```

### Monitoring
- Vercel Analytics (built-in)
- Error tracking (Sentry - future phase)
- Uptime monitoring (BetterStack - future phase)

---

## 14. Troubleshooting & Known Issues

### Issue 1: API Keys Showing "Not Configured" in Production (RESOLVED)

**Date Identified**: November 29, 2025
**Status**: ✅ Fix Identified - Pending User Action

#### Symptoms
- API keys saved successfully in production database (confirmed via diagnostic)
- Settings page shows "Not configured" for all API services
- "View API Key" button fails with decryption error
- Debug report shows: `"Failed to decrypt data"` error

#### Root Cause
The `ENCRYPTION_KEY` environment variable was missing from Vercel's production environment variables. When users entered API keys through the settings UI:

1. Keys were encrypted using a local `ENCRYPTION_KEY`
2. Keys saved to production database successfully
3. When production tried to retrieve keys, it couldn't decrypt them because the `ENCRYPTION_KEY` wasn't available in Vercel

#### Diagnostic Process
Created diagnostic script (`scripts/check-api-keys.ts`) to:
- Query production database for saved API keys
- Verify encrypted data exists
- Check local ENCRYPTION_KEY status

**Findings**:
```
📊 Found 3 API key(s) in database:
1. Service: NEON (created: 2025-11-29T02:12:31.962Z)
2. Service: VERCEL (created: 2025-11-29T02:12:11.291Z)
3. Service: NGROK (created: 2025-11-29T02:11:15.394Z)

✅ Keys ARE in database
❌ ENCRYPTION_KEY missing from Vercel environment
```

#### Solution
Add `ENCRYPTION_KEY` to Vercel environment variables:

1. Navigate to Vercel Dashboard → project-dashboard → Settings → Environment Variables
2. Add new variable:
   - **Name**: `ENCRYPTION_KEY`
   - **Value**: `3d71b85398e1f8f95652f6da7bb1268ef5557676f661e4be8fef43455f299818`
   - **Environments**: Production, Preview, Development (all three)
3. Save and wait for automatic redeployment (1-2 minutes)
4. Verify at https://dashboard.amikkelson.io/settings

#### Prevention
- Added `ENCRYPTION_KEY` to `.env.example` template
- Updated deployment checklist to verify all environment variables
- Added diagnostic script for future troubleshooting (can be recreated if needed)

---

### Issue 2: 404 Errors on Resource Pages (RESOLVED)

**Date Identified**: November 29, 2025
**Status**: ✅ Fixed in v0.3.1

#### Symptoms
Console errors:
```
upstash?_rsc=h1jml:1  Failed to load resource: 404
vercel?_rsc=h1jml:1   Failed to load resource: 404
neon?_rsc=h1jml:1     Failed to load resource: 404
```

#### Root Cause
Resources overview page (`/app/resources/page.tsx`) linked to resource detail pages that didn't exist yet:
- `/resources/vercel` → 404
- `/resources/neon` → 404
- `/resources/upstash` → 404

#### Solution
Created placeholder "Coming Soon" pages:
- `app/resources/vercel/page.tsx` (PAGE-008-20251129)
- `app/resources/neon/page.tsx` (PAGE-009-20251129)
- `app/resources/upstash/page.tsx` (PAGE-010-20251129)

Each page includes:
- Service-specific branding and icons
- "Coming Soon" message
- Links back to resources and settings
- Consistent layout with other pages

**Git Commit**: `12e0b95 - Add placeholder pages for Vercel, Neon, and Upstash resources`

---

### Common Diagnostic Commands

#### Check Production Database for API Keys
```bash
npx tsx scripts/check-api-keys.ts
```

#### Verify Encryption Key Locally
```bash
grep ENCRYPTION_KEY .env.local
```

#### Test Production Settings Page
```bash
curl -s https://dashboard.amikkelson.io/settings | grep "Not configured"
```

#### Check Vercel Deployment Logs
```bash
vercel logs production --app project-dashboard
```

#### Verify Environment Variables in Vercel
Via Vercel Dashboard:
1. Go to project-dashboard → Settings → Environment Variables
2. Confirm presence of:
   - `DATABASE_URL`
   - `ENCRYPTION_KEY`
   - `NGROK_API_KEY`
   - `VERCEL_API_TOKEN`
   - `NEON_API_KEY`
   - `UPSTASH_API_KEY`

---

### Debugging API Key Issues

If API keys show "Not configured":

1. **Check if keys exist in database**:
   - Create diagnostic script (see Issue 1 above)
   - Run: `npx tsx scripts/check-api-keys.ts`
   - Should show number of keys and their services

2. **Verify ENCRYPTION_KEY**:
   - Local: `grep ENCRYPTION_KEY .env.local`
   - Vercel: Check dashboard environment variables
   - Must be identical in both places

3. **Check for encryption errors**:
   - Open browser dev tools → Console
   - Navigate to Settings page
   - Look for "Failed to decrypt data" errors

4. **Verify API key save process**:
   - Open Network tab in browser
   - Enter an API key and click Save
   - Check for 200 response
   - Check database to confirm save

---

## Environment Variables Template

Create `.env.example`:

```bash
# Database
DATABASE_URL="postgresql://user:password@host:5432/database"

# ngrok API
NGROK_API_KEY="your_ngrok_api_key"

# Vercel API
VERCEL_API_TOKEN="your_vercel_api_token"
VERCEL_TEAM_ID="your_team_id_optional"

# Neon API
NEON_API_KEY="your_neon_api_key"

# Upstash API
UPSTASH_API_KEY="your_upstash_api_key"
UPSTASH_EMAIL="your_upstash_email"

# Upstash Redis (for caching)
UPSTASH_REDIS_URL="your_redis_url"
UPSTASH_REDIS_TOKEN="your_redis_token"

# Security
ENCRYPTION_KEY="generate_with_openssl_rand_hex_32"

# Next.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate_with_openssl_rand_base64_32"
```

---

## Success Metrics

### Performance
- First Contentful Paint < 1.5s
- Time to Interactive < 3s
- Lighthouse Score > 90

### Functionality
- All 4 API integrations working
- Real-time data sync < 30s
- 100% mobile responsive

### Code Quality
- TypeScript strict mode: 0 errors
- ESLint: 0 errors, 0 warnings
- 100% file reference coverage

### User Experience
- Changelog auto-updates within 1s
- Search returns results < 200ms
- Forms validate in real-time

---

## Next Steps After Plan Approval

1. Review this plan with user
2. Clarify any questions
3. Get approval to proceed
4. Start Phase 1: Foundation Setup
5. Regular check-ins after each phase
6. Iterate based on feedback

---

## Notes & Assumptions

1. **Single User**: Initial version assumes single user (you). Multi-user support can be added later with NextAuth.js.

2. **API Rate Limits**: Will implement caching to respect API rate limits. Upstash Redis will cache API responses.

3. **Real-time Updates**: Initially using polling (30s interval). Can upgrade to WebSockets/SSE if needed.

4. **File References**: Will be manually added to each file during development and tracked in REFERENCES.md.

5. **Changelog Automation**: Middleware-based approach will automatically create entries for all write operations.

6. **Mobile-First**: All design and development starts with mobile (320px) and scales up.

7. **Cost**: Using free tiers where possible:
   - Vercel: Free tier (Hobby)
   - Neon: Free tier (1 project)
   - Upstash: Free tier (10K requests/day)
   - APIs: Within free tier limits

8. **Future Enhancements** (Post-MVP):
   - PWA support
   - Offline mode
   - Push notifications
   - WebSocket real-time updates
   - Advanced analytics
   - Multi-user support
   - API webhooks integration
   - Export/import functionality
   - Dark mode toggle
   - Custom themes

---

## Questions for User

Before proceeding, please confirm:

1. ✅ **Tech Stack**: Happy with Next.js 14, TypeScript, Tailwind CSS, Prisma?
2. ✅ **Database**: Use Neon PostgreSQL for hosting the project database?
3. ✅ **Single vs Multi-User**: Start with single-user (you only) or multi-user from day 1?
4. ✅ **API Keys**: Do you have API keys for ngrok, Vercel, Neon, Upstash? (Can be added later)
5. ✅ **Custom Domain**: Do you have a domain, or use Vercel's free subdomain?
6. ✅ **Timeline**: 12-week timeline acceptable, or need faster/slower pace?
7. ✅ **Priority**: Any service integration more important than others? (Can re-order phases)
8. ✅ **Design**: Want to see mockups/designs before development, or trust the mobile-first approach?

---

**END OF PLAN**

This plan will be updated as development progresses. All changes will be tracked in the changelog system once implemented.
