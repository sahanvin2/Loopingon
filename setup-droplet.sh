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
chmod +x scripts/setup-ssl.sh
./scripts/setup-ssl.sh

# 6. Start Docker Compose
echo "Starting Docker Compose..."
docker compose -f docker/docker-compose.prod.yml pull || true
docker compose -f docker/docker-compose.prod.yml up -d

echo "========================================="
echo "   Server Provisioning Complete!"
echo "========================================="
