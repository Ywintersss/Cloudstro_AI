#!/bin/bash

# Validate that the service is running properly
echo "Validating CloudStro AI service..."

# Check if PM2 processes are running
if ! pm2 list | grep -q "cloudstro-ai"; then
    echo "ERROR: PM2 process not found"
    exit 1
fi

# Check if Nginx is running
if ! systemctl is-active --quiet nginx; then
    echo "ERROR: Nginx is not running"
    exit 1
fi

# Check if the application responds to health check
sleep 10  # Wait for application to start
if ! curl -f http://localhost/health > /dev/null 2>&1; then
    echo "ERROR: Health check failed"
    exit 1
fi

echo "Service validation successful"
exit 0