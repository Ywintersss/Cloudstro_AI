# CloudStro AI - EC2 Deployment Guide

This guide will help you deploy CloudStro AI from AWS Amplify to EC2.

## 🚀 Quick Deployment

### Option 1: Automated Deployment Script

1. **Launch an EC2 instance** (Amazon Linux 2 recommended, t3.medium or larger)
2. **Copy the deployment script** to your EC2 instance:
   ```bash
   wget https://raw.githubusercontent.com/your-repo/cloudstro-ai/main/deploy-ec2.sh
   chmod +x deploy-ec2.sh
   
   # Deploy production branch (default)
   sudo ./deploy-ec2.sh
   
   # Deploy specific branch
   PRODUCTION_BRANCH=staging sudo ./deploy-ec2.sh
   ```

### Branch Management:
- **Production**: `PRODUCTION_BRANCH=production ./deploy-ec2.sh`
- **Staging**: `PRODUCTION_BRANCH=staging ./deploy-ec2.sh`
- **Development**: `PRODUCTION_BRANCH=main ./deploy-ec2.sh`

📖 **See [BRANCH_DEPLOYMENT_GUIDE.md](./BRANCH_DEPLOYMENT_GUIDE.md) for detailed branch management**

### Option 2: Docker Deployment

1. **Build and run with Docker Compose:**
   ```bash
   # Clone the repository
   git clone https://github.com/your-repo/cloudstro-ai.git
   cd cloudstro-ai
   
   # Copy environment variables
   cp .env.production.example .env.production
   # Edit .env.production with your actual values
   
   # Build and start
   docker-compose up -d
   ```

### Option 3: PM2 Deployment

1. **Manual setup with PM2:**
   ```bash
   # Install Node.js 18
   curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
   sudo yum install -y nodejs
   
   # Install PM2
   sudo npm install -g pm2
   
   # Clone and build
   git clone https://github.com/your-repo/cloudstro-ai.git
   cd cloudstro-ai
   npm ci --only=production
   npm run build
   
   # Start with PM2
   pm2 start ecosystem.config.json --env production
   pm2 save
   pm2 startup
   ```

## 🔧 Configuration Changes from Amplify

### Key Differences:

1. **Infrastructure Management**: You now manage the EC2 instance, security groups, and networking
2. **Environment Variables**: Managed through `.env.production` files instead of Amplify console
3. **Build Process**: Uses Next.js standalone output for optimized Docker deployment
4. **Process Management**: PM2 handles application lifecycle and auto-restart
5. **Reverse Proxy**: Nginx handles SSL termination and load balancing
6. **Monitoring**: CloudWatch agent for metrics and log aggregation

### Files Added for EC2 Deployment:

- `Dockerfile` - Multi-stage Docker build
- `docker-compose.yml` - Container orchestration
- `nginx.conf` - Reverse proxy configuration
- `ecosystem.config.json` - PM2 process management
- `.env.production.example` - Production environment template
- `deploy-ec2.sh` - Automated deployment script
- `.github/workflows/deploy-ec2.yml` - CI/CD pipeline
- `setup-monitoring.sh` - CloudWatch monitoring setup

## 🔒 Security Considerations

### SSL/TLS Setup:
```bash
# Using Let's Encrypt (recommended)
sudo amazon-linux-extras install epel
sudo yum install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

### Security Group Configuration:
- Port 80 (HTTP) - For Let's Encrypt and redirects
- Port 443 (HTTPS) - For application traffic
- Port 22 (SSH) - For management (restrict to your IP)

## 📊 Monitoring Setup

### CloudWatch Integration:
```bash
# Run the monitoring setup script
chmod +x setup-monitoring.sh
sudo ./setup-monitoring.sh
```

### Key Metrics to Monitor:
- Application uptime and response time
- Memory and CPU usage
- Nginx access logs and error rates
- DynamoDB read/write capacity
- AWS Bedrock API usage

## 🔄 CI/CD Pipeline

### GitHub Actions Setup:

1. **Add secrets to your GitHub repository:**
   - `AWS_ACCESS_KEY_ID`
   - `AWS_SECRET_ACCESS_KEY`
   - `EC2_HOST` (your EC2 instance IP)
   - `EC2_SSH_KEY` (private key for SSH access)
   - `DEPLOYMENT_BUCKET` (S3 bucket for deployments)

2. **AWS CodeDeploy Setup** (optional):
   ```bash
   # Create CodeDeploy application
   aws deploy create-application --application-name cloudstro-ai
   
   # Create deployment group
   aws deploy create-deployment-group \
     --application-name cloudstro-ai \
     --deployment-group-name production \
     --service-role-arn arn:aws:iam::account:role/CodeDeployServiceRole \
     --ec2-tag-filters Key=Environment,Value=Production,Type=KEY_AND_VALUE
   ```

## 🚨 Troubleshooting

### Common Issues:

1. **Application not starting:**
   ```bash
   pm2 logs
   pm2 restart all
   ```

2. **Nginx configuration errors:**
   ```bash
   sudo nginx -t
   sudo systemctl status nginx
   ```

3. **SSL certificate issues:**
   ```bash
   sudo certbot renew --dry-run
   ```

4. **Memory issues:**
   ```bash
   free -h
   pm2 monit
   ```

### Health Checks:
- Application: `curl http://localhost:3000/api/health`
- Nginx: `curl http://localhost/health`
- PM2: `pm2 status`

## 💡 Performance Optimization

### Recommended EC2 Instance Types:
- **Development**: t3.small (2 vCPU, 2 GB RAM)
- **Production**: t3.medium (2 vCPU, 4 GB RAM) or larger
- **High Traffic**: c5.large (2 vCPU, 4 GB RAM) with auto-scaling

### Cost Optimization:
- Use Spot Instances for development
- Enable detailed monitoring for production
- Set up auto-scaling based on CPU/memory usage
- Use CloudFront CDN for static assets

## 📝 Migration Checklist

- [ ] Remove `amplify.yml` configuration
- [ ] Update Next.js config for standalone output
- [ ] Configure environment variables in `.env.production`
- [ ] Set up EC2 security groups and networking
- [ ] Configure domain DNS to point to EC2 instance
- [ ] Set up SSL certificates
- [ ] Configure monitoring and alerting
- [ ] Test CI/CD pipeline
- [ ] Update documentation and team access

## 🆘 Support

For issues with this deployment setup, check:
1. CloudWatch Logs for application errors
2. Nginx error logs: `/var/log/nginx/error.log`
3. PM2 logs: `pm2 logs`
4. System logs: `sudo journalctl -u nginx`