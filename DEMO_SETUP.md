# Hackathon Demo Mode Setup 🚀

This CloudStro AI application includes a comprehensive mock data system for hackathon demonstrations when real social media API credentials are not available.

## Quick Demo Setup

### 1. Environment Configuration
The app is already configured for demo mode with these environment variables in `.env`:

```bash
DEMO_MODE=true
USE_MOCK_TWITTER=true
USE_MOCK_FACEBOOK=true
USE_MOCK_YOUTUBE=true
USE_MOCK_TIKTOK=true
```

### 2. Demo Data Features

#### 🎭 Mock Social Media Data
- **Realistic Posts**: Generated with varied content, engagement metrics, and timestamps
- **Multiple Platforms**: Twitter, Facebook, YouTube, TikTok support
- **Rich Media**: Sample images and video thumbnails using placeholder services
- **Authentic Engagement**: Randomized likes, shares, comments, and views

#### 📊 Analytics & Insights
- **Platform Metrics**: Follower counts, engagement rates, growth trends
- **AI-Powered Insights**: Automated suggestions for optimal posting times and content
- **Performance Analytics**: Top performing content identification
- **Demographic Data**: Sample audience insights

#### 🔗 Demo Accounts
- **Auto-Generated Accounts**: Creates mock social media accounts for all platforms
- **Realistic Tokens**: Simulated access tokens and refresh tokens
- **Account Management**: Full CRUD operations with DynamoDB storage

### 3. Using the Demo

#### In the Dashboard:
1. **Login/Signup**: Use any email/password (or the demo account)
2. **Demo Setup Panel**: Click the prominent blue demo setup card
3. **Create Demo Accounts**: Generates mock social media connections
4. **Generate Sample Data**: Creates posts, analytics, and insights
5. **Multi-Platform Data**: Populates all platforms at once

#### Demo Login Credentials:
```
Email: demo@cloudstro.ai
Username: demo_user
Password: demo123
```

### 4. API Endpoints for Demo Data

#### GET `/api/social-media/demo`
- Query params: `platform`, `count`
- Returns: Sample posts, metrics, insights for a platform

#### POST `/api/social-media/demo`
- Body: `{ platforms: ['twitter', 'facebook', 'youtube', 'tiktok'] }`
- Returns: Multi-platform demo data

#### POST `/api/social-media/accounts`
- Body: `{ userId: 'user_id' }`
- Creates: Mock social media accounts in DynamoDB

### 5. What You'll See

#### Dashboard Features:
- ✅ **Real-time Posts Feed**: Sample posts from all connected platforms
- ✅ **Engagement Analytics**: Charts and metrics showing platform performance  
- ✅ **AI Insights**: Suggestions for optimal posting strategies
- ✅ **Content Analysis**: Hashtag performance and audience engagement
- ✅ **Cross-Platform Management**: Unified view of all social media accounts

#### Sample Data Includes:
- **250+ Unique Posts** across all platforms
- **Realistic Engagement Metrics** (10-10,000 likes range)
- **Trending Hashtags** relevant to AI, tech, marketing
- **Time-based Analytics** showing optimal posting windows
- **Growth Trends** with percentage changes
- **Audience Demographics** for realistic presentation

### 6. For Judges/Viewers

This demo showcases:
- **Full-Stack Integration**: Next.js, DynamoDB, AWS services
- **Cross-Platform Social Media Management**
- **AI-Powered Content Analytics**
- **Real-time Dashboard with Live Data**
- **Professional UI/UX Design**
- **Scalable Architecture** ready for production

The mock data system demonstrates the application's capabilities without requiring actual social media API approvals, making it perfect for hackathon presentations while showing the complete intended functionality.

---

**Note**: All data in demo mode is simulated. In production, this would connect to real social media APIs with proper authentication and live data feeds.