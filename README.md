# Loopingon - Where Sri Lankan Craft Meets the World

A premium multi-vendor marketplace connecting Sri Lankan artisans, handloom weavers, handicraft makers, and cottage industry producers with local and global buyers.

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS, ShadCN UI, Framer Motion
- **Backend**: Node.js 22, Express.js 4.19+, TypeScript
- **Database**: PostgreSQL 16, Prisma ORM 5+, Redis
- **Storage**: DigitalOcean Spaces (S3-compatible)
- **AI**: OpenAI API integration

## Getting Started

### Prerequisites
- Node.js 22+
- Docker & Docker Compose
- PostgreSQL 16 (or use Docker)

### Installation

```bash
npm install
npm run db:generate
npm run docker:dev  # Start PostgreSQL and Redis
npm run db:migrate
npm run db:seed
npm run dev
```

## Project Structure

```
loopingon/
  apps/
    web/        # Next.js Frontend
    server/     # Express.js Backend
  docker/       # Docker configuration
  scripts/      # Utility scripts
  docs/         # Documentation
```
