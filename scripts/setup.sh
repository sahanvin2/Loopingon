#!/usr/bin/env bash
set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

log()  { echo -e "${GREEN}[SETUP]${NC} $1"; }
warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
err()  { echo -e "${RED}[ERROR]${NC} $1"; }
info() { echo -e "${CYAN}[INFO]${NC} $1"; }

PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$PROJECT_ROOT"

log "Starting Loopingon project setup..."

if ! command -v node &> /dev/null; then
    err "Node.js is not installed. Please install Node.js >= 22"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 22 ]; then
    err "Node.js version >= 22 is required. Current: $(node -v)"
    exit 1
fi
info "Node.js version: $(node -v)"

if ! command -v npm &> /dev/null; then
    err "npm is not installed"
    exit 1
fi
info "npm version: $(npm -v)"

if ! command -v docker &> /dev/null; then
    warn "Docker is not installed. Only npm-related tasks will be available."
    HAS_DOCKER=false
else
    info "Docker version: $(docker --version)"
    HAS_DOCKER=true
fi

log "Installing npm dependencies..."
npm ci

log "Generating Prisma client..."
cd apps/server
npx prisma generate
cd "$PROJECT_ROOT"

if [ ! -f "apps/server/.env" ]; then
    if [ -f ".env.example" ]; then
        log "Creating apps/server/.env from .env.example..."
        cp .env.example apps/server/.env
        warn "Please update apps/server/.env with your actual configuration values"
    else
        log "Creating default apps/server/.env..."
        cat > apps/server/.env << 'EOF'
DATABASE_URL=postgresql://loopingon:loopingon_dev@localhost:5432/loopingon
REDIS_URL=redis://localhost:6379
JWT_ACCESS_SECRET=dev-access-secret-change-in-production
JWT_REFRESH_SECRET=dev-refresh-secret-change-in-production
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
EMAIL_FROM=noreply@loopingon.com
FRONTEND_URL=http://localhost:3000
API_URL=http://localhost:4000
PLATFORM_NAME=Loopingon
PLATFORM_COMMISSION_RATE=20
PAYHERE_MERCHANT_ID=
PAYHERE_MERCHANT_SECRET=
NODE_ENV=development
EOF
        warn "Created default .env. Please update with your actual values."
    fi
fi

if [ ! -f "apps/web/.env" ]; then
    log "Creating apps/web/.env..."
    cat > apps/web/.env << 'EOF'
NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_PAYHERE_MERCHANT_ID=
NEXT_PUBLIC_CLOUDFLARE_SITE_KEY=
EOF
fi

if [ "$HAS_DOCKER" = true ]; then
    log "Starting PostgreSQL and Redis with Docker Compose..."
    docker compose -f docker/docker-compose.yml up -d postgres redis

    log "Waiting for PostgreSQL to be ready..."
    for i in $(seq 1 30); do
        if docker compose -f docker/docker-compose.yml exec -T postgres pg_isready -U loopingon -d loopingon > /dev/null 2>&1; then
            log "PostgreSQL is ready"
            break
        fi
        if [ $i -eq 30 ]; then
            err "PostgreSQL did not become ready in time"
            exit 1
        fi
        sleep 2
    done

    log "Waiting for Redis to be ready..."
    for i in $(seq 1 15); do
        if docker compose -f docker/docker-compose.yml exec -T redis redis-cli ping > /dev/null 2>&1; then
            log "Redis is ready"
            break
        fi
        if [ $i -eq 15 ]; then
            err "Redis did not become ready in time"
            exit 1
        fi
        sleep 1
    done
else
    warn "Docker not available. Ensure PostgreSQL and Redis are running manually."
fi

log "Running Prisma migrations..."
cd apps/server
npx prisma migrate dev --name init 2>/dev/null || npx prisma db push
cd "$PROJECT_ROOT"

log "Seeding database..."
cd apps/server
npx prisma db seed
cd "$PROJECT_ROOT"

log "=============================================="
log "Setup complete! Here's how to get started:"
log ""
log "  Start development servers:"
log "    npm run dev"
log ""
log "  Alternatively, start everything with Docker:"
log "    npm run docker:dev"
log ""
log "  Useful commands:"
log "    npm run db:studio    - Open Prisma Studio"
log "    npm run db:migrate   - Run database migrations"
log "    npm run db:seed      - Seed the database"
log "    npm run lint         - Run linting"
log "    npm run typecheck    - Run type checking"
log "    npm run test         - Run tests"
log ""
log "  URLs:"
log "    Web:      http://localhost:3000"
log "    API:      http://localhost:4000"
log "    API Docs: http://localhost:4000/api-docs"
log "    Studio:   http://localhost:5555"
log ""
log "  Admin login:"
log "    Email:    admin@loopingon.com"
log "    Password: Admin@123456"
log "=============================================="
