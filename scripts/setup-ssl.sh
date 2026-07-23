#!/bin/bash
set -e

echo "========================================="
echo "   Loopingon SSL & Host Nginx Setup Script"
echo "========================================="

DOMAIN="loopingon.com"
WWW_DOMAIN="www.loopingon.com"
EMAIL="snawarathne33@gmail.com"

echo "[1/4] Ensuring host Nginx and Certbot are installed..."
sudo apt-get update
sudo apt-get install -y nginx certbot python3-certbot-nginx

echo "[2/4] Writing Nginx configuration for $DOMAIN..."
cat <<EOF | sudo tee /etc/nginx/sites-available/loopingon.com
server {
    listen 80;
    server_name loopingon.com www.loopingon.com;

    location /api/ {
        proxy_pass http://127.0.0.1:4005/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    location / {
        proxy_pass http://127.0.0.1:3005/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF

sudo ln -sf /etc/nginx/sites-available/loopingon.com /etc/nginx/sites-enabled/

echo "[3/4] Starting and reloading host Nginx..."
sudo systemctl start nginx || true
sudo nginx -t
sudo systemctl reload nginx

echo "[4/4] Requesting Let's Encrypt Certificate..."
sudo certbot --nginx -d "\$DOMAIN" -d "\$WWW_DOMAIN" -m "\$EMAIL" --agree-tos --non-interactive || echo "Certbot failed, probably due to rate limits or DNS propagation. Fix DNS and run manually."

echo "========================================="
echo " SSL & Nginx Setup Complete!"
echo "========================================="
