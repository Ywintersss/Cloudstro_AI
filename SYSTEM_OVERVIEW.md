# 🎯 Complete DynamoDB Structure for CloudStro AI Social Media System

## 📊 **Database Architecture Overview**

Your CloudStro AI system now has a complete, scalable DynamoDB structure that integrates social media management with your user system and supports RedNote (小红书) instead of LinkedIn.

### **🗄️ Five Main Tables:**

```
1. cloudstro-users              → User profiles & authentication
2. cloudstro-social-accounts    → Connected social media accounts
3. cloudstro-social-posts       → Aggregated posts from all platforms
4. cloudstro-social-engagement  → Engagement tracking over time
5. cloudstro-ai-insights        → AI-generated recommendations
```

## 🔗 **Key Integration Points**

### **User-Centric Design**
- All data is partitioned by `USER#{userId}`
- Easy to scale as your user base grows
- Efficient queries for user-specific data

### **Social Media Platforms Supported**
- ✅ **Twitter** (X) - Full read/write support
- ✅ **Facebook** - Pages and personal accounts
- ✅ **Instagram** - Business accounts
- ✅ **RedNote** (小红书) - Chinese social media platform
- ✅ **TikTok** - Read support (posting requires approval)

### **Data Flow**
```
User Login → Connect Social Accounts → Fetch Posts → AI Analysis → Recommendations
```

## 📋 **Table Structures**

### **1. cloudstro-users**
```json
{
  "PK": "USER#12345",
  "SK": "PROFILE",
  "userId": "12345",
  "email": "user@example.com",
  "username": "johndoe",
  "fullName": "John Doe",
  "subscription": "premium",
  "socialAccountsConnected": ["twitter", "rednote"],
  "aiPreferences": {
    "contentStyle": "professional",
    "postingFrequency": "daily",
    "preferredTimes": ["09:00", "15:00", "19:00"]
  }
}
```

### **2. cloudstro-social-accounts**
```json
{
  "PK": "USER#12345",
  "SK": "SOCIAL#twitter#987654321",
  "platform": "twitter",
  "accountId": "987654321",
  "accountName": "John Doe",
  "accessToken": "encrypted_token",
  "isActive": true
}
```

### **3. cloudstro-social-posts**
```json
{
  "PK": "USER#12345",
  "SK": "POST#twitter#1234567890#2025-09-20T10:00:00Z",
  "platform": "twitter",
  "content": "Great AI insights! #AI #SocialMedia",
  "engagement": {
    "likes": 150,
    "shares": 25,
    "comments": 12,
    "views": 5000
  },
  "aiAnalysis": {
    "sentiment": "positive",
    "engagementPrediction": "high"
  }
}
```

## 🚀 **API Endpoints Ready**

### **User Management**
- `POST /api/dynamodb/addUser` - Create new user
- `GET /api/dynamodb/getUser` - Get user by ID or email
- `PUT /api/dynamodb/getUser` - Update user profile

### **Social Media Integration**
- `GET /api/social-media/posts` - Fetch posts from connected accounts
- `POST /api/social-media/posts` - Cross-platform posting
- `GET /api/social-media/search` - Search posts across platforms
- `POST /api/social-media/analytics` - AI insights and recommendations

### **OAuth Authentication**
- `GET /api/auth/oauth` - Generate OAuth URLs
- `GET /api/auth/callback/{platform}` - Handle OAuth callbacks

## 📈 **AI Features & Analytics**

### **Engagement Analysis**
- Track performance across all platforms
- Identify optimal posting times
- Analyze content that performs best

### **AI Recommendations**
```json
{
  "optimalTiming": {
    "twitter": ["09:00", "15:00", "19:00"],
    "rednote": ["12:00", "18:00", "21:00"]
  },
  "contentStrategy": {
    "topHashtags": ["#AI", "#TechNews"],
    "bestContentTypes": ["images", "videos"],
    "engagementPredictions": "high"
  }
}
```

## 🛠 **Setup Instructions**

### **1. Environment Variables**
```bash
# Copy .env.example to .env.local and configure:
DYNAMODB_USERS_TABLE=cloudstro-users
DYNAMODB_SOCIAL_ACCOUNTS_TABLE=cloudstro-social-accounts
DYNAMODB_SOCIAL_POSTS_TABLE=cloudstro-social-posts

# Social Media APIs
TWITTER_API_KEY=your-key
FACEBOOK_APP_ID=your-app-id
REDNOTE_CLIENT_ID=your-rednote-client-id
```

### **2. DynamoDB Tables**
Create tables with the exact structure provided in `DYNAMODB_SCHEMA.md`

### **3. Frontend Integration Example**
```typescript
// Create a new user
const createUser = async (userData) => {
  const response = await fetch('/api/dynamodb/addUser', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  });
  return response.json();
};

// Connect social media account
const connectSocialAccount = async (platform, userId) => {
  const response = await fetch(`/api/auth/oauth?platform=${platform}&userId=${userId}`);
  const data = await response.json();
  window.location.href = data.authUrl;
};

// Get AI insights
const getAIInsights = async (userId) => {
  const response = await fetch('/api/social-media/analytics', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, timeRange: 30 })
  });
  return response.json();
};
```

## 🔄 **Data Relationships**

```
User (1) ←→ (many) Social Accounts
User (1) ←→ (many) Posts
User (1) ←→ (many) AI Insights
Social Account (1) ←→ (many) Posts
Post (1) ←→ (many) Engagement Records
```

## 📊 **Query Patterns**

### **Common Queries**
1. Get user profile: `PK = USER#12345 AND SK = PROFILE`
2. Get user's social accounts: `PK = USER#12345 AND begins_with(SK, "SOCIAL#")`
3. Get user's posts: `PK = USER#12345 AND begins_with(SK, "POST#")`
4. Get platform analytics: `GSI1PK = PLATFORM#twitter`

### **Advanced Analytics**
- Engagement trends over time
- Cross-platform performance comparison
- AI-powered content optimization
- Optimal posting schedule generation

## 🎯 **RedNote (小红书) Integration**

### **Platform-Specific Features**
- Support for image-heavy content
- Chinese hashtag format: `#标签#`
- Note-style content structure
- Integration with Chinese social media ecosystem

### **API Limitations**
- RedNote API requires special approval
- Limited posting capabilities
- Focus on content analysis and reading

## 📱 **Mobile-Ready Structure**

The DynamoDB design supports:
- Fast mobile app queries
- Offline data caching
- Real-time synchronization
- Scalable to millions of users

## 🔐 **Security Features**

- Encrypted OAuth tokens
- User data isolation
- Secure API endpoints
- Proper access controls

This comprehensive structure gives you everything needed for a production-ready social media AI system that can scale with your hackathon success! 🚀

## 🎉 **Ready for Hackathon**

Your system now supports:
- ✅ Multi-platform social media integration
- ✅ User management with social account linking
- ✅ AI-powered analytics and recommendations
- ✅ Cross-platform posting capabilities
- ✅ RedNote integration for Chinese market
- ✅ Scalable database architecture
- ✅ Complete API endpoints
- ✅ OAuth authentication flows

Perfect for demonstrating a comprehensive AI-powered social media engagement booster! 🏆