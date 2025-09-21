#!/bin/bash

# EC2 Deployment Script for CloudStro AI
# Run this script on your EC2 instance

set -e

echo "🚀 Starting CloudStro AI EC2 Deployment..."

# Update system packages
echo "📦 Updating system packages..."
sudo yum update -y

# Install Node.js 18
echo "📦 Installing Node.js 18..."
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs

# Install Docker
echo "🐳 Installing Docker..."
sudo yum install -y docker
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -a -G docker ec2-user

# Install Docker Compose
echo "🐳 Installing Docker Compose..."
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Install PM2 globally
echo "⚡ Installing PM2..."
sudo npm install -g pm2

# Setup PM2 to start on boot
sudo pm2 startup systemd -u ec2-user --hp /home/ec2-user
sudo systemctl enable pm2-ec2-user

# Create application directory
echo "📁 Creating application directory..."
sudo mkdir -p /var/www/cloudstro-ai
sudo chown ec2-user:ec2-user /var/www/cloudstro-ai
cd /var/www/cloudstro-ai

# Configuration
REPO_URL="https://github.com/Ywintersss/Cloudstro_AI.git"
PRODUCTION_BRANCH="${PRODUCTION_BRANCH:-tongli}"  # Default to 'production', can be overridden

# Clone repository and checkout production branch
echo "📥 Cloning repository and checking out $PRODUCTION_BRANCH branch..."
git clone $REPO_URL .
git checkout $PRODUCTION_BRANCH

echo "✅ Using branch: $(git branch --show-current)"

# Create environment file
echo "🔧 Setting up environment variables..."
cp .env.example .env.production

echo "⚠️  IMPORTANT: Please edit /var/www/cloudstro-ai/.env.production with your actual environment variables"

# Install dependencies
echo "📦 Installing dependencies..."
npm ci --only=production

# Build the application
echo "🔨 Building application..."
npm run build

# Setup log directories
echo "📝 Setting up log directories..."
sudo mkdir -p /var/log/pm2
sudo chown ec2-user:ec2-user /var/log/pm2

# Install and configure Nginx
echo "🌐 Installing and configuring Nginx..."
sudo yum install -y nginx
sudo cp nginx.conf /etc/nginx/nginx.conf

# Create SSL directory (you'll need to add your certificates)
sudo mkdir -p /etc/nginx/ssl
echo "⚠️  IMPORTANT: Add your SSL certificates to /etc/nginx/ssl/"

# Enable and start Nginx
sudo systemctl enable nginx
sudo systemctl start nginx

# Start application with PM2
echo "🚀 Starting application with PM2..."
pm2 start ecosystem.config.json --env production
pm2 save

# Setup log rotation
echo "📝 Setting up log rotation..."
sudo tee /etc/logrotate.d/pm2 > /dev/null <<EOF
/var/log/pm2/*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    create 0644 ec2-user ec2-user
    postrotate
        pm2 reloadLogs
    endscript
}
EOF

echo "✅ Deployment completed!"
echo ""
echo "📋 Next steps:"
echo "1. Edit /var/www/cloudstro-ai/.env.production with your environment variables"
echo "2. Add SSL certificates to /etc/nginx/ssl/"
echo "3. Update nginx.conf with your domain name"
echo "4. Restart services: sudo systemctl restart nginx && pm2 restart all"
echo "5. Check status: pm2 status && sudo systemctl status nginx"
echo ""
echo "🌐 Your application should be available at: http://your-ec2-ip"
echo ""
echo "🔧 To deploy a different branch in the future:"
echo "   PRODUCTION_BRANCH=your-branch-name ./deploy-ec2.sh"
echo "   Example: PRODUCTION_BRANCH=staging ./deploy-ec2.sh"