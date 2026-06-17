$ErrorActionPreference = "Stop"

Write-Host "Installing npm dependencies..."
npm ci

Write-Host "Generating Prisma client..."
Set-Location apps/server
npx prisma generate
Set-Location ../..

if (-Not (Test-Path "apps/server/.env")) {
    if (Test-Path ".env.example") {
        Write-Host "Creating apps/server/.env from .env.example..."
        Copy-Item .env.example apps/server/.env
    } else {
        Write-Host "Creating default apps/server/.env..."
        @"
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
NODE_ENV=development
"@ | Out-File -FilePath "apps/server/.env" -Encoding utf8
    }
}

if (-Not (Test-Path "apps/web/.env")) {
    Write-Host "Creating apps/web/.env..."
    @"
NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
NEXT_PUBLIC_APP_URL=http://localhost:3000
"@ | Out-File -FilePath "apps/web/.env" -Encoding utf8
}

Write-Host "Starting PostgreSQL and Redis with Docker Compose..."
docker compose -f docker/docker-compose.yml up -d postgres redis

Write-Host "Waiting for PostgreSQL and Redis to be ready (10s)..."
Start-Sleep -Seconds 10

Write-Host "Running Prisma DB Push..."
Set-Location apps/server
npx prisma db push

Write-Host "Seeding database..."
npx prisma db seed
Set-Location ../..

Write-Host "Setup complete!"
