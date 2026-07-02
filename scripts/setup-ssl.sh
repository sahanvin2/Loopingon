#!/bin/bash
set -e

echo "========================================="
echo "   Kandyam SSL & Nginx Setup Script"
echo "========================================="

DOMAIN="kandyam.com"
WWW_DOMAIN="www.kandyam.com"
EMAIL="snawarathne10@gmail.com"

# The directory where docker-compose expects the SSL certs to be
SSL_DIR="$(pwd)/docker/nginx/ssl"

echo "[1/4] Ensuring SSL directory exists..."
mkdir -p "$SSL_DIR"

echo "[2/4] Stopping Nginx if it's currently running (to free port 80)..."
# In case they have an old standalone nginx or docker nginx running, we must stop it
sudo systemctl stop nginx || true
docker compose -f docker/docker-compose.prod.yml stop nginx || true

echo "[3/4] Requesting Let's Encrypt Certificate..."
# Install certbot if not present
if ! command -v certbot &> /dev/null; then
    echo "Installing certbot..."
    sudo apt-get update
    sudo apt-get install -y certbot
fi

# Run certbot in standalone mode to spin up its own temporary webserver on port 80
sudo certbot certonly --standalone \
    -d "$DOMAIN" -d "$WWW_DOMAIN" \
    -m "$EMAIL" \
    --agree-tos \
    --non-interactive

echo "[4/4] Copying certificates to Docker Nginx directory..."
# Certbot saves them in /etc/letsencrypt/live/kandyam.com/
sudo cp /etc/letsencrypt/live/$DOMAIN/fullchain.pem "$SSL_DIR/server.crt"
sudo cp /etc/letsencrypt/live/$DOMAIN/privkey.pem "$SSL_DIR/server.key"

# Fix permissions so Docker can read them
sudo chmod 644 "$SSL_DIR/server.crt"
sudo chmod 644 "$SSL_DIR/server.key"

echo "========================================="
echo " SSL Certificates Generated Successfully!"
echo "========================================="

