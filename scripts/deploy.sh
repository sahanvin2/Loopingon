#!/usr/bin/env bash
set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log()   { echo -e "${GREEN}[DEPLOY]${NC} $1"; }
warn()  { echo -e "${YELLOW}[WARN]${NC} $1"; }
err()   { echo -e "${RED}[ERROR]${NC} $1"; }
info()  { echo -e "${BLUE}[INFO]${NC} $1"; }

PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$PROJECT_ROOT"

BRANCH="${1:-main}"
ENVIRONMENT="${2:-production}"
COMPOSE_FILE="docker/docker-compose.prod.yml"
HEALTH_URL="http://localhost:4000/health"
DEPLOY_TIMESTAMP=$(date +%Y%m%d_%H%M%S)

log "=== Loopingon Deploy Script ==="
info "Branch: $BRANCH"
info "Environment: $ENVIRONMENT"
info "Timestamp: $DEPLOY_TIMESTAMP"
info "Project Root: $PROJECT_ROOT"
echo ""

if [ "$ENVIRONMENT" = "production" ]; then
    warn "You are deploying to PRODUCTION!"
    read -rp "Are you sure you want to continue? (yes/no): " CONFIRM
    if [ "$CONFIRM" != "yes" ]; then
        err "Deployment cancelled"
        exit 1
    fi
fi

log "[1/7] Pulling latest code..."
git fetch origin "$BRANCH"
CURRENT_COMMIT=$(git rev-parse HEAD)
git checkout "$BRANCH"
git pull origin "$BRANCH"
NEW_COMMIT=$(git rev-parse HEAD)

if [ "$CURRENT_COMMIT" = "$NEW_COMMIT" ]; then
    warn "No new changes to deploy"
    exit 0
fi

info "Deploying commits from $CURRENT_COMMIT to $NEW_COMMIT"
echo ""

log "[2/7] Creating pre-deploy database backup..."
BACKUP_DIR="/opt/backups"
mkdir -p "$BACKUP_DIR"
BACKUP_FILE="$BACKUP_DIR/predeploy_${DEPLOY_TIMESTAMP}.sql.gz"

if docker compose -f "$COMPOSE_FILE" exec -T postgres pg_dump -U loopingon loopingon 2>/dev/null | gzip > "$BACKUP_FILE"; then
    info "Backup saved: $BACKUP_FILE ($(du -h "$BACKUP_FILE" | cut -f1))"
else
    warn "Database backup failed, continuing anyway..."
fi
echo ""

log "[3/7] Building Docker images..."
docker compose -f "$COMPOSE_FILE" build --parallel --pull
echo ""

log "[4/7] Stopping existing containers..."
docker compose -f "$COMPOSE_FILE" down --remove-orphans
echo ""

log "[5/7] Starting new containers..."
docker compose -f "$COMPOSE_FILE" up -d --remove-orphans
echo ""

log "[6/7] Running database migrations..."
sleep 5
for i in $(seq 1 5); do
    if docker compose -f "$COMPOSE_FILE" exec -T server npx prisma migrate deploy 2>/dev/null; then
        log "Migrations applied successfully"
        break
    fi
    if [ "$i" -eq 5 ]; then
        err "Migrations failed after 5 attempts"
        exit 1
    fi
    warn "Migration attempt $i failed, retrying in 5s..."
    sleep 5
done
echo ""

log "[7/7] Health check..."
sleep 3

curl -sf "$HEALTH_URL" > /dev/null 2>&1 || true

for i in $(seq 1 12); do
    if curl -sf "$HEALTH_URL" > /dev/null 2>&1; then
        RESPONSE=$(curl -sf "$HEALTH_URL")
        log "Health check passed: $RESPONSE"
        break
    fi
    if [ "$i" -eq 12 ]; then
        err "Health check failed after 60s!"
        warn "Rolling back to previous commit..."
        git checkout "$CURRENT_COMMIT"
        docker compose -f "$COMPOSE_FILE" up -d --remove-orphans
        sleep 10
        if curl -sf "$HEALTH_URL" > /dev/null 2>&1; then
            log "Rollback successful"
        else
            err "Rollback may have failed - manual intervention required"
        fi
        exit 1
    fi
    warn "Health check attempt $i/12... waiting 5s"
    sleep 5
done
echo ""

log "Cleaning up old images..."
docker image prune -af --filter "until=72h" 2>/dev/null || true

log "Cleaning up old backups (>14 days)..."
find "$BACKUP_DIR" -name "predeploy_*.sql.gz" -mtime +14 -delete 2>/dev/null || true
echo ""

log "=============================================="
log "Deployment complete!"
info "Previous commit: ${CURRENT_COMMIT:0:8}"
info "Current commit:  ${NEW_COMMIT:0:8}"
log "=============================================="

echo ""
docker compose -f "$COMPOSE_FILE" ps
echo ""

log "To check logs: docker compose -f $COMPOSE_FILE logs -f"
