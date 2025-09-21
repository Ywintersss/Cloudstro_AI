#!/bin/bash

cd /var/www/cloudstro-ai

# Install dependencies
echo "Installing dependencies..."
npm ci --only=production

# Build the application
echo "Building application..."
npm run build

# Start the application with PM2
echo "Starting application with PM2..."
pm2 start ecosystem.config.json --env production
pm2 save

# Reload Nginx configuration
echo "Reloading Nginx..."
sudo systemctl reload nginx

echo "Application started successfully"