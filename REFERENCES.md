# File Reference Index

This document tracks all files in the project with their unique reference numbers, descriptions, and relationships.

**Last Updated**: 2025-11-28
**Total Files**: 13

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

**Total Files Created**: 13
**Next Reference Number**:
- COMP-001-20251128
- PAGE-003-20251128
- API-001-20251128
- LIB-001-20251128
- HOOK-001-20251128
- TYPE-001-20251128
