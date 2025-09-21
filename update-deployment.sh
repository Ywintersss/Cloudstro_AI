#!/bin/bash

# Manual Deployment Script for CloudStro AI
# Usage: ./update-deployment.sh [branch_name] [environment]

set -e

# Configuration
BRANCH=${1:-production}
ENVIRONMENT=${2:-production}
APP_DIR="/var/www/cloudstro-ai"

echo "🚀 Updating CloudStro AI deployment..."
echo "Branch: $BRANCH"
echo "Environment: $ENVIRONMENT"
echo ""

# Check if application directory exists
if [ ! -d "$APP_DIR" ]; then
    echo "❌ Application directory not found: $APP_DIR"
    echo "Please run the initial deployment script first: ./deploy-ec2.sh"
    exit 1
fi

cd $APP_DIR

# Backup current version
echo "📦 Creating backup..."
BACKUP_DIR="/var/backups/cloudstro-ai"
sudo mkdir -p $BACKUP_DIR
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
sudo tar -czf "$BACKUP_DIR/backup_$TIMESTAMP.tar.gz" \
    --exclude=node_modules \
    --exclude=.next \
    --exclude=.git \
    .

echo "✅ Backup created: $BACKUP_DIR/backup_$TIMESTAMP.tar.gz"

# Stop application gracefully
echo "⏹️  Stopping application..."
pm2 stop all || true

# Update code
echo "📥 Fetching latest code..."
git fetch origin

echo "🔄 Switching to branch: $BRANCH"
git checkout $BRANCH
git pull origin $BRANCH

echo "✅ Current branch: $(git branch --show-current)"
echo "📝 Latest commit: $(git log -1 --oneline)"

# Install dependencies
echo "📦 Installing dependencies..."
npm ci --only=production

# Build application
echo "🔨 Building application..."
npm run build

# Update environment configuration if specified
if [ "$ENVIRONMENT" = "staging" ]; then
    echo "🔧 Using staging environment configuration..."
    if [ -f ".env.staging" ]; then
        cp .env.staging .env.production
    fi
elif [ "$ENVIRONMENT" = "development" ]; then
    echo "🔧 Using development environment configuration..."
    if [ -f ".env.development" ]; then
        cp .env.development .env.production
    fi
fi

# Start application
echo "🚀 Starting application..."
pm2 start ecosystem.config.json --env production
pm2 save

# Health check
echo "🏥 Performing health check..."
sleep 10

if curl -f http://localhost:3000/api/health > /dev/null 2>&1; then
    echo "✅ Health check passed!"
else
    echo "❌ Health check failed!"
    echo "🔄 Rolling back..."
    
    # Rollback to previous version
    pm2 stop all
    git checkout HEAD~1
    npm ci --only=production
    npm run build
    pm2 start ecosystem.config.json --env production
    
    echo "🔄 Rollback completed"
    exit 1
fi

# Reload Nginx
echo "🌐 Reloading Nginx..."
sudo systemctl reload nginx

# Display status
echo ""
echo "✅ Deployment completed successfully!"
echo ""
echo "📊 Current Status:"
echo "Branch: $(git branch --show-current)"
echo "Commit: $(git log -1 --oneline)"
echo "Environment: $ENVIRONMENT"
echo ""
echo "🔍 Check application status:"
echo "  PM2: pm2 status"
echo "  Logs: pm2 logs"
echo "  Health: curl http://localhost/api/health"
echo ""
echo "🗂️  Backup location: $BACKUP_DIR/backup_$TIMESTAMP.tar.gz"

# Show recent logs
echo ""
echo "📝 Recent application logs:"
pm2 logs --lines 10