#!/bin/bash

# Stop the application gracefully
echo "Stopping CloudStro AI application..."

# Stop PM2 processes
if command -v pm2 &> /dev/null; then
    pm2 stop all
    echo "PM2 processes stopped"
fi

# Stop Docker containers if running
if command -v docker &> /dev/null; then
    docker-compose down || true
    echo "Docker containers stopped"
fi

echo "Application stopped successfully"