# DevOps Resource Dashboard

A centralized, mobile-first dashboard to track and manage all your development resources including ngrok tunnels, Vercel deployments, Neon databases, and Upstash instances.

## Features

- 🔗 **ngrok Tunnel Monitoring** - Track active tunnels with real-time stats
- ▲ **Vercel Deployment Tracking** - Monitor builds and deployments
- 🗄️ **Neon Database Management** - View PostgreSQL instances and usage
- ⚡ **Upstash Database Tracking** - Monitor Redis and Kafka instances
- 📊 **Project Organization** - Group resources by project
- 📝 **Auto Changelog** - Automatic tracking of all system changes
- 📱 **Mobile-First Design** - Optimized for mobile devices

## Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript 5+
- **Styling**: Tailwind CSS 3+
- **UI Components**: shadcn/ui (Radix UI)
- **Icons**: Lucide React
- **Animations**: Framer Motion

### Backend
- **Runtime**: Node.js 20+
- **API**: Next.js API Routes + Server Actions
- **ORM**: Prisma 6+
- **Validation**: Zod

### Database
- **Primary**: PostgreSQL (Neon)
- **Caching**: Upstash Redis

### Deployment
- **Hosting**: Vercel
- **CI/CD**: Auto-deploy on push

## Getting Started

### Prerequisites

- Node.js 20+ and pnpm
- PostgreSQL database (Neon recommended)
- API keys for services you want to track

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd project-dashboard
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Add your API keys to `.env.local`:
   - `DATABASE_URL` - Your PostgreSQL connection string
   - `NGROK_API_KEY` - Your ngrok API key
   - `VERCEL_API_TOKEN` - Your Vercel API token
   - `NEON_API_KEY` - Your Neon API key
   - `UPSTASH_API_KEY` - Your Upstash API key
   - `ENCRYPTION_KEY` - Generate with: `openssl rand -hex 32`

5. Initialize the database:
```bash
pnpm db:push
```

6. Run the development server:
```bash
pnpm dev
```

7. Open [http://localhost:3000](http://localhost:3000) in your browser

## Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm db:push` - Push Prisma schema to database
- `pnpm db:migrate` - Run database migrations
- `pnpm db:studio` - Open Prisma Studio

## Project Structure

```
project-dashboard/
├── app/                    # Next.js app directory
│   ├── (dashboard)/        # Dashboard routes
│   ├── api/                # API routes
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Homepage
├── components/             # React components
│   ├── ui/                 # shadcn/ui components
│   ├── dashboard/          # Dashboard components
│   ├── projects/           # Project components
│   └── resources/          # Resource components
├── lib/                    # Library code
│   ├── api/                # API clients
│   ├── actions/            # Server actions
│   └── utils/              # Utilities
├── prisma/                 # Prisma schema
│   └── schema.prisma       # Database schema
├── types/                  # TypeScript types
└── public/                 # Static assets
```

## Code Reference System

Every file in this project includes a unique reference number for tracking:

- **Format**: `FILE-REF: {CATEGORY}-{SEQUENCE}-{DATE}`
- **Example**: `FILE-REF: COMP-001-20251128`
- **Categories**: COMP (Components), PAGE (Pages), API (API Routes), LIB (Libraries), etc.
- **Tracking**: All references are documented in `REFERENCES.md`

## Changelog

The dashboard features an automatic changelog system that tracks all changes:

- **Auto-Generated**: Changes are automatically logged
- **Categories**: FEATURE, BUGFIX, IMPROVEMENT, REFACTOR, etc.
- **Severity Levels**: CRITICAL, MAJOR, MINOR, PATCH
- **File Tracking**: Links to specific file changes with reference numbers

## Contributing

This is a personal project, but feel free to fork and customize for your own use!

## License

MIT

## Support

For issues or questions, please refer to the `CLAUDE.md` file for the complete project plan and architecture.

---

**Built with ❤️ using Next.js and TypeScript**
