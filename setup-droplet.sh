#!/bin/bash
set -e

echo "========================================="
echo "   Provisioning Fresh Ubuntu Droplet"
echo "========================================="

# 1. Update system and install Git and Curl
echo "Updating packages..."
apt-get update -y
apt-get install -y git curl apt-transport-https ca-certificates software-properties-common

# 2. Install Docker
if ! command -v docker &> /dev/null; then
    echo "Installing Docker..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    systemctl enable docker
    systemctl start docker
fi

# 3. Clone the repository
if [ ! -d "/opt/loopingon" ]; then
    echo "Cloning repository..."
    git clone https://github.com/sahanvin2/Loopingon.git /opt/loopingon
else
    echo "Repository already exists, pulling latest..."
    cd /opt/loopingon
    git fetch origin
    git reset --hard origin/main
fi

# 4. Create .env file
echo "Configuring .env file..."
cat <<EOF > /opt/loopingon/.env
CORS_ORIGIN=https://loopingon.com,https://www.loopingon.com,http://134.209.68.3
NEXT_PUBLIC_APP_URL=https://loopingon.com
NEXT_PUBLIC_API_URL=https://loopingon.com/api/v1
# Provide fallbacks for DB if they aren't generated yet
POSTGRES_USER=loopingon
POSTGRES_PASSWORD=loopingon_secret
POSTGRES_DB=loopingon
REDIS_PASSWORD=redis_secret
DATABASE_URL="postgresql://loopingon:loopingon_secret@postgres:5432/loopingon?schema=public"
DIRECT_URL="postgresql://loopingon:loopingon_secret@postgres:5432/loopingon?schema=public"
EOF

# 5. Run SSL Setup
echo "Running SSL setup..."
cd /opt/loopingon
sed -i 's/\r$//' scripts/setup-ssl.sh
chmod +x scripts/setup-ssl.sh
./scripts/setup-ssl.sh

# 6. Start Docker Compose
echo "Starting Database and Redis..."
docker compose -f docker/docker-compose.prod.yml up -d postgres redis

echo "Building and starting Server..."
docker compose -f docker/docker-compose.prod.yml build server worker
docker compose -f docker/docker-compose.prod.yml up -d server worker

echo "Waiting for server to be healthy..."
sleep 15

echo "Running Database Migrations and Seeding..."
docker compose -f docker/docker-compose.prod.yml exec -T server npx prisma db push --accept-data-loss
docker compose -f docker/docker-compose.prod.yml exec -T server npm run db:seed || true

echo "Seeding images..."
cat << 'SQL_EOF' > /tmp/seed_images.sql
INSERT INTO product_images (id, "productId", url, thumbnail, medium, large, "isPrimary", "sortOrder", "createdAt", "updatedAt") SELECT gen_random_uuid(), id, 'https://kandyam-media.sgp1.digitaloceanspaces.com/seed/products/' || slug || '.jpg', 'https://kandyam-media.sgp1.digitaloceanspaces.com/seed/products/' || slug || '.jpg', 'https://kandyam-media.sgp1.digitaloceanspaces.com/seed/products/' || slug || '.jpg', 'https://kandyam-media.sgp1.digitaloceanspaces.com/seed/products/' || slug || '.jpg', true, 0, NOW(), NOW() FROM products ON CONFLICT DO NOTHING;
SQL_EOF
docker cp /tmp/seed_images.sql loopingon-postgres-prod:/tmp/seed_images.sql
docker exec loopingon-postgres-prod psql -U loopingon -d loopingon -f /tmp/seed_images.sql || true

echo "Building and starting Web..."
docker compose -f docker/docker-compose.prod.yml build web
docker compose -f docker/docker-compose.prod.yml up -d web

echo "========================================="
echo "   Server Provisioning Complete!"
echo "========================================="
