# Loopingon - Where Sri Lankan Craft Meets the World

A premium multi-vendor marketplace connecting Sri Lankan artisans, handloom weavers, handicraft makers, and cottage industry producers with local and global buyers.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 15, React 19, TypeScript, Tailwind CSS 3.4, Radix UI (shadcn/ui), Framer Motion, Zustand, TanStack React Query |
| Backend | Node.js 22, Express.js 4.21, TypeScript, tsx (dev runner) |
| Database | PostgreSQL 16 (with pgvector), Prisma ORM 5.22 |
| Cache/Queue | Redis 7 (ioredis cache, BullMQ job queues) |
| Auth | JWT (access + refresh), Argon2 hashing, Google/Facebook OAuth, TOTP 2FA |
| Storage | DigitalOcean Spaces (S3-compatible via @aws-sdk/client-s3) |
| Payments | PayHere (Sri Lanka), Payable |
| Notifications | Nodemailer (email), Twilio (SMS/WhatsApp) |
| AI | OpenAI API integration |
| DevOps | Docker Compose, Nginx reverse proxy, GitHub Actions CI/CD, Turborepo |
| Testing | Jest, ts-jest, Supertest |

## Prerequisites

- **Node.js >= 22**
- **Docker & Docker Compose** (for PostgreSQL and Redis)
- **npm** (project uses npm@11.x workspaces)

## Quick Setup (Automated)

Run the setup script (requires Bash — use Git Bash or WSL on Windows):

```bash
bash scripts/setup.sh
```

This installs dependencies, starts Docker services, runs migrations, seeds the database, and prints admin credentials.

## Manual Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Generate Prisma client

```bash
npm run db:generate
```

### 3. Configure environment

Copy `.env.example` to `apps/server/.env` if it doesn't exist. Dev defaults are preconfigured:

```bash
cp .env.example apps/server/.env
```

Key environment variables:

| Variable | Default | Description |
|----------|---------|-------------|
| `DATABASE_URL` | `postgresql://loopingon:loopingon_dev@localhost:5433/loopingon` | PostgreSQL connection |
| `REDIS_URL` | `redis://localhost:6379` | Redis connection |
| `JWT_ACCESS_SECRET` / `JWT_REFRESH_SECRET` | dev secrets | JWT signing keys |
| `SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASS` | (blank) | Email service (optional) |
| `PAYHERE_MERCHANT_ID` / `PAYHERE_MERCHANT_SECRET` | (blank) | Payment gateway (optional) |
| `SPACES_ENDPOINT` / `SPACES_KEY` / `SPACES_SECRET` | (blank) | File storage (optional) |
| `OPENAI_API_KEY` | (blank) | AI features (optional) |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | (blank) | OAuth login (optional) |
| `PLATFORM_COMMISSION_RATE` | `20` | Commission percentage |

Frontend env (`apps/web/.env`):

| Variable | Default | Description |
|----------|---------|-------------|
| `NEXT_PUBLIC_API_URL` | `http://localhost:4000/api/v1` | API base URL |
| `NEXT_PUBLIC_APP_URL` | `http://localhost:3000` | Frontend URL |
| `NEXT_PUBLIC_PAYHERE_MERCHANT_ID` | (blank) | Payment gateway |
| `NEXT_PUBLIC_CLOUDFLARE_SITE_KEY` | (blank) | Turnstile captcha |

Third-party services (email, OAuth, payments, storage, AI) are optional for local development. The app runs without them.

### 4. Start Docker services

```bash
# Start only infrastructure (PostgreSQL + Redis):
docker compose -f docker/docker-compose.yml up -d postgres redis

# Or start everything (including app containers + nginx):
npm run docker:dev
```

### 5. Set up the database

```bash
npm run db:push   # Push schema to the database
npm run db:seed   # Seed with sample data
```

> **Note**: If you see an error about `uuid_ossp` extension not found, run:
> ```bash
> docker exec loopingon-postgres psql -U loopingon -d loopingon -c 'CREATE EXTENSION IF NOT EXISTS "uuid-ossp";'
> ```

### 6. Run the project

```bash
# Run both server and frontend concurrently:
npm run dev

# Or run individually:
cd apps/server && npm run dev    # Express API on port 4000
cd apps/web && npm run dev       # Next.js on port 3000
```

## URLs After Startup

| Service | URL |
|---------|-----|
| Web Frontend | http://localhost:3000 |
| API Server | http://localhost:4000 |
| API Documentation (Swagger) | http://localhost:4000/api-docs |
| Prisma Studio | http://localhost:5555 (`npm run db:studio`) |

## Admin Credentials

Email: `admin@loopingon.com`  
Password: `Admin@123456`

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Run all apps in dev mode (parallel) |
| `npm run build` | Build all apps |
| `npm run start` | Start production servers |
| `npm run lint` | Lint all apps |
| `npm run typecheck` | TypeScript type-check all apps |
| `npm run test` | Run all tests |
| `npm run format` | Format code with Prettier |
| `npm run db:migrate` | Run Prisma migrations |
| `npm run db:push` | Push schema directly (no migration file) |
| `npm run db:seed` | Seed the database |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:studio` | Open Prisma Studio (port 5555) |
| `npm run docker:dev` | Start all Docker dev services |
| `npm run docker:prod` | Start all Docker prod services |
| `npm run docker:down` | Stop Docker dev services |

## Project Structure

```
loopingon/
├── apps/
│   ├── server/                 # Express.js Backend (Port 4000)
│   │   ├── src/
│   │   │   ├── config/         # App, DB, email, JWT, payment, Redis, storage configs
│   │   │   ├── middleware/     # Auth, RBAC, rate limiter, error handler, upload, validator
│   │   │   ├── routes/         # 25 route files (auth, user, vendor, product, cart, order, ...)
│   │   │   ├── services/       # Business logic services
│   │   │   ├── utils/          # JWT, email, OTP, password, slug, commission, pagination, ...
│   │   │   ├── validators/     # Zod validation schemas
│   │   │   ├── workers/        # BullMQ workers (analytics, email, image, notification, payout)
│   │   │   ├── types/          # TypeScript type definitions
│   │   │   ├── app.ts          # Express app factory
│   │   │   └── index.ts        # Server entry point
│   │   ├── prisma/
│   │   │   ├── schema.prisma   # Database schema (PostgreSQL + pgvector)
│   │   │   ├── seed.ts         # Database seeder
│   │   │   └── migrations/     # Prisma migrations
│   │   └── tests/              # Test suite
│   │
│   └── web/                    # Next.js 15 Frontend (Port 3000)
│       ├── src/
│       │   ├── app/            # App Router pages
│       │   │   ├── (shop)/     # Product browsing, cart, checkout
│       │   │   ├── (auth)/     # Sign in/up, forgot password, 2FA
│       │   │   ├── (dashboard)/# Customer dashboard (orders, wishlist, reviews, ...)
│       │   │   ├── (vendor)/   # Vendor dashboard (products, orders, analytics, ...)
│       │   │   ├── (admin)/    # Admin dashboard (20+ pages)
│       │   │   ├── (marketing)/# About, blog, careers, contact, help center
│       │   │   └── (legal)/    # Privacy, terms, cookies, returns, shipping
│       │   ├── components/     # UI components (shared, forms, product, cart, checkout, ...)
│       │   ├── hooks/          # Custom React hooks
│       │   ├── lib/            # API client, constants, utils, validators
│       │   ├── providers/      # Auth, cart, query, theme, toast providers
│       │   ├── stores/         # Zustand stores (auth, cart, search, UI)
│       │   └── styles/         # Global CSS
│       └── public/             # Static assets
│
├── docker/
│   ├── docker-compose.yml      # Dev: postgres, redis, server, web, worker, nginx
│   ├── docker-compose.prod.yml # Production compose with healthchecks and logging
│   └── nginx/                  # Nginx reverse proxy config
│
├── scripts/
│   ├── setup.sh                # Automated dev setup
│   └── deploy.sh               # Production deployment with rollback
│
├── .github/workflows/
│   ├── ci.yml                  # CI: lint → typecheck → test (PostgreSQL + Redis)
│   ├── cd-production.yml       # Production deployment
│   ├── cd-staging.yml          # Staging deployment
│   └── db-backup.yml           # Scheduled database backup
│
├── turbo.json                  # Turborepo pipeline config
├── .env.example                # Full environment variable reference
└── package.json                # Root workspace config
```

## Architecture

- **Monorepo**: Turborepo with npm workspaces (`apps/*`)
- **Database**: PostgreSQL 16 with pgvector extension for AI/vector search, pg_trgm for text search, pgcrypto for encryption
- **Job Queue**: BullMQ backed by Redis handles background jobs (email, image processing, analytics, payouts, notifications, sitemap)
- **Auth**: JWT access tokens (15min) + refresh tokens (7d), Argon2 password hashing, optional Google/Facebook OAuth, TOTP 2FA
- **Frontend**: Next.js App Router with route groups for logical separation, server components, streaming/Suspense
- **CI/CD**: GitHub Actions with PostgreSQL/Redis service containers, staging and production deployment workflows, automated database backups

## Troubleshooting

### PostgreSQL port conflict

If you have a local PostgreSQL installation on port 5432, it will conflict with Docker. Update `apps/server/.env` to use port 5433:

```
DATABASE_URL=postgresql://loopingon:loopingon_dev@localhost:5433/loopingon
```

Then change the Docker port mapping. Or stop the local PostgreSQL service.

### uuid_ossp extension

PostgreSQL 16 uses `uuid-ossp` (with hyphens) as the extension name, while older versions used `uuid_ossp`. If Prisma fails with this error, create the extension manually:

```bash
docker exec loopingon-postgres psql -U loopingon -d loopingon -c 'CREATE EXTENSION IF NOT EXISTS "uuid-ossp";'
```

### Connection authentication

If you see "Authentication failed" errors, the Docker container's `pg_hba.conf` may need the final line changed from `scram-sha-256` to `trust` for local development:

```bash
docker exec loopingon-postgres sed -i 's/scram-sha-256/trust/' /var/lib/postgresql/data/pg_hba.conf
docker exec loopingon-postgres psql -U loopingon -c 'SELECT pg_reload_conf();'
```

### Prisma seed command

If `npm run db:seed` fails with a missing seed configuration, ensure `apps/server/package.json` has:

```json
"prisma": {
  "seed": "tsx prisma/seed.ts"
}
```

## License

See [LICENSE](./LICENSE)
