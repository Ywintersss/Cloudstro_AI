# Complete DynamoDB Schema for CloudStro AI Social Media System

This document outlines the complete DynamoDB table structure that integrates with your existing user system and supports cross-platform social media management.

## Table Overview

```
1. cloudstro-users              (Main user table)
2. cloudstro-social-accounts    (Social media account connections)
3. cloudstro-social-posts       (Aggregated social media posts)
4. cloudstro-social-engagement  (Engagement tracking over time)
5. cloudstro-ai-insights        (AI-generated recommendations)
```

## 1. cloudstro-users (Main User Table)

**Primary Key Structure:**
- `PK`: `USER#{userId}` (Partition Key)
- `SK`: `PROFILE` (Sort Key)

**Global Secondary Indexes:**
- `GSI1`: Email lookup
  - `GSI1PK`: `EMAIL#{email}`
  - `GSI1SK`: `USER#{userId}`

**Attributes:**
```json
{
  "PK": "USER#12345",
  "SK": "PROFILE",
  "userId": "12345",
  "email": "user@example.com",
  "username": "johndoe",
  "fullName": "John Doe",
  "avatar": "https://...",
  "subscription": "premium|basic|free",
  "socialAccountsConnected": ["twitter", "instagram"],
  "aiPreferences": {
    "contentStyle": "professional",
    "postingFrequency": "daily",
    "preferredTimes": ["09:00", "15:00", "19:00"]
  },
  "createdAt": "2025-09-20T10:00:00Z",
  "updatedAt": "2025-09-20T10:00:00Z",
  "isActive": true,
  "lastLoginAt": "2025-09-20T10:00:00Z"
}
```

## 2. cloudstro-social-accounts (Social Media Connections)

**Primary Key Structure:**
- `PK`: `USER#{userId}` (Partition Key)
- `SK`: `SOCIAL#{platform}#{accountId}` (Sort Key)

**Global Secondary Indexes:**
- `GSI1`: Platform-based queries
  - `GSI1PK`: `PLATFORM#{platform}`
  - `GSI1SK`: `USER#{userId}`
- `GSI2`: Account status queries
  - `GSI2PK`: `STATUS#{isActive}`
  - `GSI2SK`: `USER#{userId}#{platform}`

**Attributes:**
```json
{
  "PK": "USER#12345",
  "SK": "SOCIAL#twitter#987654321",
  "userId": "12345",
  "platform": "twitter",
  "accountId": "987654321",
  "accountName": "John Doe",
  "accountHandle": "@johndoe",
  "profilePicture": "https://...",
  "followerCount": 1500,
  "followingCount": 300,
  "accessToken": "encrypted_token",
  "refreshToken": "encrypted_refresh_token",
  "tokenExpiresAt": "2025-12-20T10:00:00Z",
  "isActive": true,
  "connectedAt": "2025-09-20T10:00:00Z",
  "lastSyncAt": "2025-09-20T10:00:00Z",
  "syncStatus": "active|error|paused",
  "permissions": ["read", "write"],
  "platformSpecificData": {
    "twitterUserId": "987654321",
    "verifiedAccount": true
  }
}
```

## 3. cloudstro-social-posts (Aggregated Posts)

**Primary Key Structure:**
- `PK`: `USER#{userId}` (Partition Key)
- `SK`: `POST#{platform}#{postId}#{timestamp}` (Sort Key)

**Global Secondary Indexes:**
- `GSI1`: Platform-based queries
  - `GSI1PK`: `PLATFORM#{platform}`
  - `GSI1SK`: `{timestamp}#{userId}`
- `GSI2`: Author-based queries
  - `GSI2PK`: `AUTHOR#{platform}#{authorId}`
  - `GSI2SK`: `{timestamp}`
- `GSI3`: Content type queries
  - `GSI3PK`: `CONTENT#{hasMedia}#{platform}`
  - `GSI3SK`: `{engagementScore}#{timestamp}`

**Attributes:**
```json
{
  "PK": "USER#12345",
  "SK": "POST#twitter#1234567890#2025-09-20T10:00:00Z",
  "userId": "12345",
  "postId": "1234567890",
  "platform": "twitter",
  "content": "Great day for social media analytics! #AI #SocialMedia",
  "authorId": "987654321",
  "authorName": "John Doe",
  "authorHandle": "@johndoe",
  "createdAt": "2025-09-20T10:00:00Z",
  "fetchedAt": "2025-09-20T10:30:00Z",
  "engagement": {
    "likes": 150,
    "shares": 25,
    "comments": 12,
    "views": 5000,
    "engagementRate": 3.74,
    "lastUpdated": "2025-09-20T10:30:00Z"
  },
  "media": [
    {
      "type": "image",
      "url": "https://...",
      "thumbnailUrl": "https://...",
      "altText": "Screenshot of analytics"
    }
  ],
  "hashtags": ["AI", "SocialMedia"],
  "mentions": ["@cloudstro"],
  "url": "https://twitter.com/johndoe/status/1234567890",
  "isOwn": true,
  "sentiment": "positive",
  "aiAnalysis": {
    "topics": ["technology", "analytics"],
    "engagementPrediction": "high",
    "recommendedActions": ["repost", "engage"]
  }
}
```

## 4. cloudstro-social-engagement (Engagement Tracking)

**Primary Key Structure:**
- `PK`: `USER#{userId}` (Partition Key)
- `SK`: `ENGAGEMENT#{postId}#{timestamp}` (Sort Key)

**Global Secondary Indexes:**
- `GSI1`: Time-based analytics
  - `GSI1PK`: `TIMEFRAME#{userId}#{platform}`
  - `GSI1SK`: `{date}#{hour}`

**Attributes:**
```json
{
  "PK": "USER#12345",
  "SK": "ENGAGEMENT#1234567890#2025-09-20T10:00:00Z",
  "userId": "12345",
  "postId": "1234567890",
  "platform": "twitter",
  "timestamp": "2025-09-20T10:00:00Z",
  "engagementData": {
    "likes": 150,
    "shares": 25,
    "comments": 12,
    "views": 5000,
    "clickThroughRate": 2.5,
    "reachRate": 15.3
  },
  "hourOfDay": 10,
  "dayOfWeek": "Friday",
  "contentType": "image_post",
  "hasHashtags": true,
  "hashtagCount": 2,
  "characterCount": 65,
  "engagementVelocity": {
    "first30min": 45,
    "firstHour": 78,
    "first24hours": 187
  }
}
```

## 5. cloudstro-ai-insights (AI Recommendations)

**Primary Key Structure:**
- `PK`: `USER#{userId}` (Partition Key)
- `SK`: `INSIGHT#{type}#{date}` (Sort Key)

**Global Secondary Indexes:**
- `GSI1`: Insight type queries
  - `GSI1PK`: `INSIGHT_TYPE#{type}`
  - `GSI1SK`: `{confidence}#{timestamp}`

**Attributes:**
```json
{
  "PK": "USER#12345",
  "SK": "INSIGHT#optimal_timing#2025-09-20",
  "userId": "12345",
  "insightType": "optimal_timing",
  "generatedAt": "2025-09-20T10:00:00Z",
  "validUntil": "2025-09-27T10:00:00Z",
  "confidence": 92,
  "data": {
    "recommendations": [
      {
        "platform": "twitter",
        "optimalTimes": ["09:00", "15:00", "19:00"],
        "timezone": "UTC",
        "expectedEngagementIncrease": "23%",
        "basedOnPosts": 150
      }
    ]
  },
  "metadata": {
    "aiModel": "cloudstro-engagement-v2",
    "dataPoints": 500,
    "analysisMethod": "time_series_analysis"
  }
}
```

## Access Patterns & Queries

### User Management
```typescript
// Get user profile
PK = "USER#12345" AND SK = "PROFILE"

// Find user by email
GSI1PK = "EMAIL#user@example.com"
```

### Social Account Management
```typescript
// Get all social accounts for user
PK = "USER#12345" AND begins_with(SK, "SOCIAL#")

// Get specific platform accounts
PK = "USER#12345" AND begins_with(SK, "SOCIAL#twitter#")

// Get all Twitter accounts across users
GSI1PK = "PLATFORM#twitter"
```

### Posts & Analytics
```typescript
// Get user's posts from all platforms
PK = "USER#12345" AND begins_with(SK, "POST#")

// Get user's posts from specific platform
PK = "USER#12345" AND begins_with(SK, "POST#twitter#")

// Get recent posts across all users for a platform
GSI1PK = "PLATFORM#twitter" AND GSI1SK > "2025-09-19T00:00:00Z"

// Get engagement data for analysis
PK = "USER#12345" AND begins_with(SK, "ENGAGEMENT#")
```

### AI Insights
```typescript
// Get latest insights for user
PK = "USER#12345" AND begins_with(SK, "INSIGHT#")

// Get specific type of insights
PK = "USER#12345" AND begins_with(SK, "INSIGHT#optimal_timing#")
```

## Environment Variables Update

Update your `.env.example`:

```bash
# DynamoDB Table Names
DYNAMODB_USERS_TABLE=cloudstro-users
DYNAMODB_SOCIAL_ACCOUNTS_TABLE=cloudstro-social-accounts
DYNAMODB_SOCIAL_POSTS_TABLE=cloudstro-social-posts
DYNAMODB_SOCIAL_ENGAGEMENT_TABLE=cloudstro-social-engagement
DYNAMODB_AI_INSIGHTS_TABLE=cloudstro-ai-insights

# RedNote API (replacing LinkedIn)
REDNOTE_CLIENT_ID=your-rednote-client-id
REDNOTE_CLIENT_SECRET=your-rednote-client-secret
REDNOTE_ACCESS_TOKEN=your-rednote-access-token
```

## Table Creation Scripts

### AWS CLI Commands:
```bash
# Create Users Table
aws dynamodb create-table \
  --table-name cloudstro-users \
  --attribute-definitions \
    AttributeName=PK,AttributeType=S \
    AttributeName=SK,AttributeType=S \
    AttributeName=GSI1PK,AttributeType=S \
    AttributeName=GSI1SK,AttributeType=S \
  --key-schema \
    AttributeName=PK,KeyType=HASH \
    AttributeName=SK,KeyType=RANGE \
  --global-secondary-indexes \
    IndexName=GSI1,KeySchema=[{AttributeName=GSI1PK,KeyType=HASH},{AttributeName=GSI1SK,KeyType=RANGE}],Projection={ProjectionType=ALL},ProvisionedThroughput={ReadCapacityUnits=5,WriteCapacityUnits=5} \
  --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5

# Create Social Accounts Table
aws dynamodb create-table \
  --table-name cloudstro-social-accounts \
  --attribute-definitions \
    AttributeName=PK,AttributeType=S \
    AttributeName=SK,AttributeType=S \
    AttributeName=GSI1PK,AttributeType=S \
    AttributeName=GSI1SK,AttributeType=S \
    AttributeName=GSI2PK,AttributeType=S \
    AttributeName=GSI2SK,AttributeType=S \
  --key-schema \
    AttributeName=PK,KeyType=HASH \
    AttributeName=SK,KeyType=RANGE \
  --global-secondary-indexes \
    IndexName=GSI1,KeySchema=[{AttributeName=GSI1PK,KeyType=HASH},{AttributeName=GSI1SK,KeyType=RANGE}],Projection={ProjectionType=ALL},ProvisionedThroughput={ReadCapacityUnits=5,WriteCapacityUnits=5} \
    IndexName=GSI2,KeySchema=[{AttributeName=GSI2PK,KeyType=HASH},{AttributeName=GSI2SK,KeyType=RANGE}],Projection={ProjectionType=ALL},ProvisionedThroughput={ReadCapacityUnits=5,WriteCapacityUnits=5} \
  --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5

# Similar commands for other tables...
```

This structure provides:
1. **User-centric design** - All data partitioned by user
2. **Efficient queries** - GSIs for common access patterns
3. **Scalability** - Handles growth as users connect more accounts
4. **Analytics ready** - Structure supports AI insights and recommendations
5. **Security** - Encrypted tokens and proper access controls
6. **RedNote integration** - Full support for Chinese social media platform

The schema integrates seamlessly with your existing user system while providing comprehensive social media management capabilities.