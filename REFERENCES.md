# File Reference Index

This document tracks all files in the project with their unique reference numbers, descriptions, and relationships.

**Last Updated**: 2025-11-28
**Total Files**: 25

---

## Configuration Files

### CONFIG-001-20251128
- **File**: `.env.local`
- **Category**: Configuration
- **Description**: Local environment variables (DO NOT COMMIT)
- **Created**: 2025-11-28
- **Dependencies**: None

### CONFIG-002-20251128
- **File**: `.env.example`
- **Category**: Configuration
- **Description**: Environment variables template
- **Created**: 2025-11-28
- **Dependencies**: None

### CONFIG-003-20251128
- **File**: `next.config.js`
- **Category**: Configuration
- **Description**: Next.js configuration file
- **Created**: 2025-11-28
- **Dependencies**: None

### CONFIG-004-20251128
- **File**: `tailwind.config.ts`
- **Category**: Configuration
- **Description**: Tailwind CSS configuration with custom design system
- **Created**: 2025-11-28
- **Dependencies**: None

### CONFIG-005-20251128
- **File**: `tsconfig.json`
- **Category**: Configuration
- **Description**: TypeScript configuration
- **Created**: 2025-11-28
- **Dependencies**: None

### CONFIG-006-20251128
- **File**: `package.json`
- **Category**: Configuration
- **Description**: Project dependencies and scripts
- **Created**: 2025-11-28
- **Dependencies**: None

### CONFIG-007-20251128
- **File**: `.eslintrc.json`
- **Category**: Configuration
- **Description**: ESLint configuration
- **Created**: 2025-11-28
- **Dependencies**: None

### CONFIG-008-20251128
- **File**: `.prettierrc`
- **Category**: Configuration
- **Description**: Prettier configuration
- **Created**: 2025-11-28
- **Dependencies**: None

---

## Style Files

### STYLE-001-20251128
- **File**: `app/globals.css`
- **Category**: Styles
- **Description**: Global styles and CSS variables
- **Created**: 2025-11-28
- **Dependencies**: Tailwind CSS

---

## Page Files

### PAGE-000-20251128
- **File**: `app/layout.tsx`
- **Category**: Page
- **Description**: Root layout component for the entire application
- **Created**: 2025-11-28
- **Dependencies**: Inter font, globals.css
- **Related**: STYLE-001

### PAGE-002-20251128
- **File**: `app/page.tsx`
- **Category**: Page
- **Description**: Dashboard home page (temporary landing page)
- **Created**: 2025-11-28
- **Dependencies**: None
- **Related**: PAGE-000

### PAGE-011-20251128
- **File**: `app/changelog/page.tsx`
- **Category**: Page
- **Description**: Changelog viewer page displaying all system changes
- **Created**: 2025-11-28
- **Dependencies**: LIB-012, COMP-050, COMP-002
- **Related**: LIB-012, COMP-050

---

## Component Files

### COMP-001-20251128
- **File**: `components/ui/button.tsx`
- **Category**: Component
- **Description**: Button component with variants
- **Created**: 2025-11-28
- **Dependencies**: @radix-ui/react-slot, class-variance-authority
- **Related**: LIB-022

### COMP-002-20251128
- **File**: `components/ui/card.tsx`
- **Category**: Component
- **Description**: Card component for displaying content containers
- **Created**: 2025-11-28
- **Dependencies**: react
- **Related**: LIB-022

### COMP-003-20251128
- **File**: `components/ui/badge.tsx`
- **Category**: Component
- **Description**: Badge component for labels and tags
- **Created**: 2025-11-28
- **Dependencies**: class-variance-authority
- **Related**: LIB-022

### COMP-050-20251128
- **File**: `components/changelog/ChangelogEntry.tsx`
- **Category**: Component
- **Description**: Component for displaying individual changelog entries
- **Created**: 2025-11-28
- **Dependencies**: COMP-002, COMP-003, lucide-react
- **Related**: PAGE-011, LIB-012

---

## Database Files

### DB-001-20251128
- **File**: `prisma/schema.prisma`
- **Category**: Database
- **Description**: Complete database schema with all models
- **Created**: 2025-11-28
- **Models**:
  - Project
  - NgrokTunnel
  - VercelProject
  - NeonDatabase
  - UpstashDatabase
  - ChangelogEntry
  - ApiKey
  - SystemSetting

### DB-002-20251128
- **File**: `prisma/seed.ts`
- **Category**: Database
- **Description**: Database seed file for initial data (CHG-001, CHG-002)
- **Created**: 2025-11-28
- **Dependencies**: @prisma/client, LIB-020
- **Related**: DB-001

### DB-003-20251128
- **File**: `prisma/add-chg-003.ts`
- **Category**: Database
- **Description**: Script to add CHG-003 changelog entry
- **Created**: 2025-11-28
- **Dependencies**: @prisma/client
- **Related**: DB-001, PAGE-011, COMP-050

---

## Library Files

### LIB-012-20251128
- **File**: `lib/actions/changelog.ts`
- **Category**: Library
- **Description**: Server actions for changelog CRUD operations
- **Created**: 2025-11-28
- **Dependencies**: @prisma/client, LIB-020, LIB-024
- **Related**: PAGE-011, DB-001

### LIB-020-20251128
- **File**: `lib/utils/db.ts`
- **Category**: Library
- **Description**: Prisma client singleton for database operations
- **Created**: 2025-11-28
- **Dependencies**: @prisma/client
- **Related**: DB-001

### LIB-022-20251128
- **File**: `lib/utils/cn.ts`
- **Category**: Library
- **Description**: Utility functions for className merging and formatting
- **Created**: 2025-11-28
- **Dependencies**: clsx, tailwind-merge
- **Related**: COMP-001, COMP-002, COMP-003

### LIB-024-20251128
- **File**: `lib/utils/constants.ts`
- **Category**: Library
- **Description**: Application constants and configuration values
- **Created**: 2025-11-28
- **Dependencies**: None
- **Related**: LIB-012

---

## Reference Number Format

```
FILE-REF: {CATEGORY}-{SEQUENCE}-{DATE}
```

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

### Sequence
- Incremental number within each category
- Starts at 001 for each category

### Date
- Format: YYYYMMDD
- Date when file was created

---

## Upcoming Files (Planned)

### Components (COMP-001 onwards)
- Button, Card, Badge, Input (shadcn/ui components)
- DashboardHeader, DashboardStats, QuickActions
- ProjectCard, ProjectForm, ProjectList
- NgrokCard, VercelCard, NeonCard, UpstashCard
- ChangelogEntry, ChangelogTimeline, ChangelogFilters
- Header, MobileNav, DesktopNav, Footer
- LoadingSpinner, ErrorMessage, EmptyState, RefreshButton

### Pages (PAGE-003 onwards)
- Projects list page
- Project detail page
- New project page
- Resources pages (ngrok, Vercel, Neon, Upstash)
- Changelog page
- Settings page

### API Routes (API-001 onwards)
- Projects CRUD
- ngrok sync
- Vercel sync
- Neon sync
- Upstash sync
- Changelog CRUD
- Settings CRUD

### Library Files (LIB-001 onwards)
- API clients (ngrok, Vercel, Neon, Upstash)
- Server actions (projects, sync, changelog, settings)
- Utils (db, encryption, format, validation, constants)

### Hooks (HOOK-001 onwards)
- useProjects
- useResources
- useChangelog
- useMediaQuery

### Types (TYPE-001 onwards)
- Project types
- Resource types
- Changelog types
- API response types

---

## Notes

- All file references are automatically added to this index when files are created
- Related files are cross-referenced using their FILE-REF numbers
- This index is manually updated until the automatic changelog system is implemented

---

**Total Files Created**: 25
**Next Reference Number**:
- COMP-004-20251128 (next component)
- COMP-051-20251128 (next changelog component)
- PAGE-003-20251128 (projects list page)
- API-001-20251128 (first API route)
- LIB-001-20251128 (first API client)
- LIB-013-20251128 (next library file)
- HOOK-001-20251128 (first custom hook)
- TYPE-001-20251128 (first type definition)
- DB-004-20251128 (next database file)
