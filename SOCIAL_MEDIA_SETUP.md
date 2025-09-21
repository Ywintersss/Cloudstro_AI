# Social Media Cross-Platform Integration

This system provides comprehensive cross-platform social media integration for your AI engagement booster hackathon project. It supports Twitter, Facebook, Instagram, LinkedIn, and TikTok platforms.

## Features

✅ **Multi-Platform Support**: Connect and manage accounts across 5 major social platforms
✅ **Unified API**: Standardized interface for all platforms with consistent data structures
✅ **Real-time Analytics**: Track engagement metrics and optimal posting times
✅ **AI-Powered Insights**: Get recommendations for content strategy and timing
✅ **OAuth Authentication**: Secure account connection with proper token management
✅ **DynamoDB Storage**: Scalable data storage for accounts, posts, and analytics
✅ **Cross-Platform Posting**: Publish content to multiple platforms simultaneously

## API Endpoints

### 1. Get Social Media Posts
```
GET /api/social-media/posts?userId={userId}&platform={platform}&count={count}
```
- Fetch posts from connected social media accounts
- Supports filtering by platform and limiting results

### 2. Search Posts
```
GET /api/social-media/search?query={query}&platforms={platforms}&count={count}
```
- Search for posts across platforms (mainly Twitter)
- Useful for competitor analysis and trend research

### 3. Analytics & Insights
```
POST /api/social-media/analytics
Body: { "userId": "user123", "timeRange": 30 }
```
- Get comprehensive analytics including:
  - Engagement metrics by platform
  - Optimal posting times
  - AI-powered recommendations
  - Top-performing hashtags

### 4. Cross-Platform Posting
```
POST /api/social-media/posts
Body: {
  "content": "Your post content",
  "platforms": ["twitter", "facebook"],
  "mediaUrl": "optional-image-url",
  "userId": "user123"
}
```

### 5. OAuth Authentication
```
GET /api/auth/oauth?platform={platform}&userId={userId}
```
- Initiate OAuth flow for connecting social media accounts
- Returns authorization URL for user to complete authentication

## Setup Instructions

### 1. Environment Variables
Copy `.env.example` to `.env.local` and fill in your API credentials:

```bash
# Twitter API (https://developer.twitter.com/)
TWITTER_API_KEY=your-api-key
TWITTER_API_SECRET=your-api-secret
TWITTER_BEARER_TOKEN=your-bearer-token

# Facebook/Instagram (https://developers.facebook.com/)
FACEBOOK_APP_ID=your-app-id
FACEBOOK_APP_SECRET=your-app-secret

# LinkedIn (https://www.linkedin.com/developers/)
LINKEDIN_CLIENT_ID=your-client-id
LINKEDIN_CLIENT_SECRET=your-client-secret

# TikTok (https://developers.tiktok.com/) - Requires approval
TIKTOK_CLIENT_KEY=your-client-key
TIKTOK_CLIENT_SECRET=your-client-secret
```

### 2. DynamoDB Tables
Create these tables in your AWS account:

#### social-media-accounts
```
Partition Key: PK (String)
Sort Key: SK (String)
GSI1: GSI1PK (String), GSI1SK (String)
```

#### social-media-posts
```
Partition Key: PK (String)
Sort Key: SK (String)
GSI1: GSI1PK (String), GSI1SK (String)
GSI2: GSI2PK (String), GSI2SK (String)
```

#### social-media-engagement
```
Partition Key: PK (String)
Sort Key: SK (String)
GSI1: GSI1PK (String), GSI1SK (String)
```

### 3. Platform-Specific Setup

#### Twitter
1. Create a Twitter Developer account
2. Create a new app with OAuth 2.0 enabled
3. Set redirect URI: `{your-domain}/api/auth/callback/twitter`
4. Required scopes: `tweet.read tweet.write users.read offline.access`

#### Facebook/Instagram
1. Create a Facebook App
2. Add Facebook Login and Instagram Basic Display products
3. Set redirect URI: `{your-domain}/api/auth/callback/facebook`
4. Required permissions: `pages_show_list`, `pages_read_engagement`, `pages_manage_posts`

#### LinkedIn
1. Create a LinkedIn App
2. Add Sign In with LinkedIn and Share on LinkedIn products
3. Set redirect URI: `{your-domain}/api/auth/callback/linkedin`
4. Required scopes: `r_liteprofile`, `w_member_social`

#### TikTok
1. Apply for TikTok for Developers (requires approval)
2. Create an app and request content publishing permissions
3. Set redirect URI: `{your-domain}/api/auth/callback/tiktok`

## Usage Examples

### Frontend Integration

```typescript
// Connect a social media account
const connectAccount = async (platform: string, userId: string) => {
  const response = await fetch(`/api/auth/oauth?platform=${platform}&userId=${userId}`);
  const data = await response.json();
  window.location.href = data.authUrl;
};

// Fetch user's posts
const fetchPosts = async (userId: string) => {
  const response = await fetch(`/api/social-media/posts?userId=${userId}`);
  const data = await response.json();
  return data.data;
};

// Get analytics insights
const getAnalytics = async (userId: string) => {
  const response = await fetch('/api/social-media/analytics', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, timeRange: 30 })
  });
  const data = await response.json();
  return data.data;
};

// Post to multiple platforms
const crossPost = async (content: string, platforms: string[], userId: string) => {
  const response = await fetch('/api/social-media/posts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content, platforms, userId })
  });
  const data = await response.json();
  return data.results;
};
```

## Data Structures

### SocialMediaPost
```typescript
interface SocialMediaPost {
  id: string;
  platform: 'twitter' | 'facebook' | 'instagram' | 'linkedin' | 'tiktok';
  content: string;
  authorId: string;
  authorName: string;
  authorHandle?: string;
  createdAt: Date;
  engagement: {
    likes: number;
    shares: number;
    comments: number;
    views?: number;
  };
  media?: MediaItem[];
  hashtags: string[];
  mentions: string[];
  url: string;
}
```

### Analytics Response
```typescript
interface AnalyticsResponse {
  metrics: PlatformMetrics[];
  optimalTiming: { [platform: string]: string[] };
  recommendations: AIRecommendation[];
  analyzedPosts: number;
}
```

## AI Recommendations

The system provides intelligent recommendations based on your social media performance:

- **Optimal Posting Times**: Best hours to post for maximum engagement
- **Content Strategy**: Suggestions for improving engagement rates
- **Hashtag Optimization**: Top-performing hashtags for your content
- **Platform-Specific Tips**: Tailored advice for each social platform

## Rate Limits & Considerations

- **Twitter**: 300 requests per 15 minutes for most endpoints
- **Facebook**: 200 calls per hour per user
- **Instagram**: 200 requests per hour
- **LinkedIn**: 500 requests per day for basic access
- **TikTok**: Varies by endpoint, requires special approval

## Security Features

- OAuth 2.0 authentication for all platforms
- Secure token storage in DynamoDB
- State parameter validation
- PKCE for Twitter OAuth
- Encrypted credentials in environment variables

## Next Steps

1. Set up your API credentials for each platform
2. Create the DynamoDB tables
3. Test OAuth flows with your accounts
4. Integrate with your AI content generation system
5. Add scheduling capabilities for optimal timing
6. Implement A/B testing for content variations

This comprehensive social media integration system provides the foundation for your AI engagement booster, allowing you to analyze performance across platforms and optimize your social media strategy with data-driven insights.