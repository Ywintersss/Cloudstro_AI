# Branch Management & Deployment Guide

This guide explains how to manage different branches and deploy them to your EC2 instance.

## 🌿 Branch Strategy

### Recommended Branch Structure:

```
main/master     → Development branch (latest features)
develop         → Integration branch for testing
staging         → Pre-production testing
production      → Production-ready code
hotfix/*        → Emergency fixes for production
feature/*       → New feature development
```

## 🚀 Deployment Options

### 1. Manual Deployment Script

#### Deploy Production Branch:
```bash
# Default deployment (production branch)
./deploy-ec2.sh

# Specify branch explicitly
PRODUCTION_BRANCH=production ./deploy-ec2.sh

# Deploy different branch
PRODUCTION_BRANCH=staging ./deploy-ec2.sh
```

#### Update Existing Deployment:
```bash
# Update to latest production
./update-deployment.sh production production

# Deploy staging branch to staging environment
./update-deployment.sh staging staging

# Deploy specific branch
./update-deployment.sh feature/new-ui development
```

### 2. GitHub Actions Workflow

#### Trigger via Push:
```bash
# Automatically deploys when pushing to these branches:
git push origin production    # → production environment
git push origin staging      # → staging environment
git push origin main         # → development environment
```

#### Manual Trigger via GitHub UI:
1. Go to GitHub → Actions → "Deploy to EC2"
2. Click "Run workflow"
3. Select:
   - Branch to deploy: `production`, `staging`, `main`, etc.
   - Environment: `production` or `staging`
4. Click "Run workflow"

#### Trigger via GitHub CLI:
```bash
# Deploy production branch to production
gh workflow run deploy-ec2.yml \
  --field branch=production \
  --field environment=production

# Deploy staging branch to staging environment
gh workflow run deploy-ec2.yml \
  --field branch=staging \
  --field environment=staging
```

### 3. SSH Direct Deployment

```bash
# Connect to EC2 and update manually
ssh -i your-key.pem ec2-user@your-ec2-ip

# Switch to different branch
cd /var/www/cloudstro-ai
git fetch origin
git checkout staging
git pull origin staging
npm ci --only=production
npm run build
pm2 restart all
```

## 🔧 Environment Configuration

### Production Environment:
- **Branch**: `production`
- **Environment File**: `.env.production`
- **Domain**: `https://cloudstro-ai.com`
- **DynamoDB Tables**: Production tables
- **Monitoring**: Full CloudWatch monitoring
- **Demo Mode**: Disabled

### Staging Environment:
- **Branch**: `staging`
- **Environment File**: `.env.staging`
- **Domain**: `https://staging.cloudstro-ai.com`
- **DynamoDB Tables**: Staging tables (separate)
- **Monitoring**: Basic monitoring
- **Demo Mode**: Enabled

### Development Environment:
- **Branch**: `develop` or `main`
- **Environment File**: `.env.development`
- **Domain**: `https://dev.cloudstro-ai.com`
- **DynamoDB Tables**: Development tables
- **Monitoring**: Local logging
- **Demo Mode**: Enabled

## 📋 Deployment Checklist

### Before Deploying to Production:

- [ ] Code is tested and reviewed
- [ ] All tests pass in CI/CD
- [ ] Staging deployment is successful
- [ ] Database migrations are ready (if any)
- [ ] Environment variables are updated
- [ ] Backup is created
- [ ] Rollback plan is prepared

### Deployment Steps:

1. **Create/Switch Branch:**
   ```bash
   git checkout -b production
   git push origin production
   ```

2. **Deploy to Staging First:**
   ```bash
   ./update-deployment.sh staging staging
   ```

3. **Test Staging Environment:**
   ```bash
   curl https://staging.cloudstro-ai.com/api/health
   # Perform manual testing
   ```

4. **Deploy to Production:**
   ```bash
   ./update-deployment.sh production production
   ```

5. **Verify Production:**
   ```bash
   curl https://cloudstro-ai.com/api/health
   pm2 status
   ```

## 🔄 Rollback Procedures

### Quick Rollback:
```bash
# Rollback to previous commit
cd /var/www/cloudstro-ai
git checkout HEAD~1
npm ci --only=production
npm run build
pm2 restart all
```

### Rollback to Specific Commit:
```bash
# Find commit hash
git log --oneline -10

# Rollback to specific commit
git checkout abc1234
npm ci --only=production
npm run build
pm2 restart all
```

### Rollback from Backup:
```bash
# List available backups
ls -la /var/backups/cloudstro-ai/

# Restore from backup
cd /var/www
sudo rm -rf cloudstro-ai
sudo tar -xzf /var/backups/cloudstro-ai/backup_20250922_143000.tar.gz
sudo chown -R ec2-user:ec2-user cloudstro-ai
cd cloudstro-ai
pm2 restart all
```

## 🚨 Emergency Procedures

### Hotfix Deployment:
```bash
# Create hotfix branch from production
git checkout production
git checkout -b hotfix/critical-fix

# Make your fix and test
# ... make changes ...

# Deploy hotfix immediately
git add .
git commit -m "Hotfix: critical security patch"
git push origin hotfix/critical-fix

# Deploy to production
./update-deployment.sh hotfix/critical-fix production

# Merge back to main branches
git checkout production
git merge hotfix/critical-fix
git push origin production

git checkout main
git merge hotfix/critical-fix
git push origin main
```

### Service Recovery:
```bash
# If PM2 processes crashed
pm2 resurrect
pm2 restart all

# If Nginx is down
sudo systemctl restart nginx

# If system is unresponsive
sudo reboot

# Check logs for issues
pm2 logs
sudo journalctl -u nginx
```

## 📊 Monitoring Deployments

### Check Deployment Status:
```bash
# Application status
pm2 status
pm2 monit

# System status
systemctl status nginx
df -h
free -h

# Application health
curl http://localhost:3000/api/health
curl https://your-domain.com/api/health
```

### Logs to Monitor:
```bash
# Application logs
pm2 logs

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# System logs
sudo journalctl -f
```

## 🔐 Security Considerations

### Branch Protection:
- Protect `production` branch from direct pushes
- Require pull request reviews
- Enable status checks before merging

### Deployment Security:
- Use separate AWS credentials for different environments
- Rotate deployment keys regularly
- Monitor deployment activities
- Use least privilege access

### Environment Separation:
- Separate AWS accounts/resources for prod/staging
- Different database instances
- Isolated S3 buckets
- Separate monitoring and alerting

This approach gives you full control over which branch gets deployed to production while maintaining safety through staging environments and rollback procedures!