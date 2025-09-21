# Complete DynamoDB Schema for CloudStro AI Social Media System

This document outlines the complete DynamoDB table structure using **meaningful column names** instead of generic PK/SK patterns. This approach improves readability, maintainability, and developer experience.

## Schema Philosophy

Instead of using generic `PK` (Partition Key) and `SK` (Sort Key) column names, we use descriptive business-oriented column names that clearly indicate the purpose and content of each field.

**Important DynamoDB Naming Rules:**
- Table names, index names, and attribute names cannot contain spaces
- Use hyphens (-) or underscores (_) instead of spaces
- Names must be between 3-255 characters for tables and indexes
- Names are case-sensitive

## DynamoDB Naming Conventions Used

| **Component** | **Naming Pattern** | **Examples** |
|---------------|-------------------|--------------|
| **Table Names** | `cloudstro-{purpose}` | `cloudstro-users`, `cloudstro-social-accounts` |
| **GSI Names** | `{field1}-{field2}-index` | `platform-accountStatus-index`, `email-index` |
| **Attribute Names** | `camelCase` or `snake_case` | `userId`, `platformAccountId`, `created_at` |
| **Composite Keys** | `{type}#{identifier}` | `twitter#user123`, `post123#2024-01-01T10:00:00Z` |

**Why These Conventions:**
- ✅ **No spaces** - DynamoDB requirement
- ✅ **Descriptive** - Clear purpose and content
- ✅ **Consistent** - Same pattern across all resources
- ✅ **Scalable** - Easy to extend with new platforms/features

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
- **Partition Key**: `userId` (string) - Direct user identifier
- **Sort Key**: `recordType` (string) - Always "USER_PROFILE"

**Global Secondary Indexes:**
- **email-index**: Email lookup
  - Partition Key: `email`
  - Sort Key: `userId`

**Table Structure:**
```typescript
{
  // Primary Key
  userId: string,                    // Partition Key - User identifier
  recordType: string,                // Sort Key - "USER_PROFILE"
  
  // User Details
  email: string,                     // User email address
  username: string,                  // Unique username
  fullName: string,                  // User's full name
  avatar?: string,                   // Profile picture URL
  
  // Account Settings
  subscription: "premium" | "basic" | "free",
  socialAccountsConnected: string[], // Array of connected platforms
  
  // AI Preferences
  aiPreferences: {
    contentStyle: string,            // "professional", "casual", etc.
    postingFrequency: string,        // "daily", "weekly", etc.
    preferredTimes: string[]         // ["09:00", "15:00", "19:00"]
  },
  
  // Metadata
  createdAt: Date,                   // Account creation timestamp
  updatedAt: Date,                   // Last update timestamp
  isActive: boolean,                 // Account status
  lastLoginAt: Date,                 // Last login timestamp
  
  // Additional Index Fields
  accountType: string,               // "USER_ACCOUNT"
  status: string                     // "active" | "inactive"
}
```

**Example Record:**
```json
{
  "userId": "user_12345",
  "recordType": "USER_PROFILE",
  "email": "user@example.com",
  "username": "johndoe",
  "fullName": "John Doe",
  "avatar": "https://...",
  "subscription": "premium",
  "socialAccountsConnected": ["twitter", "instagram"],
  "aiPreferences": {
    "contentStyle": "professional",
    "postingFrequency": "daily",
    "preferredTimes": ["09:00", "15:00", "19:00"]
  },
  "createdAt": "2025-09-20T10:00:00Z",
  "updatedAt": "2025-09-20T10:00:00Z",
  "isActive": true,
  "lastLoginAt": "2025-09-20T10:00:00Z",
  "accountType": "USER_ACCOUNT",
  "status": "active"
}
```

## 2. cloudstro-social-accounts (Social Media Connections)

**Primary Key Structure:**
- **Partition Key**: `userId` (string) - User identifier
- **Sort Key**: `platformAccountId` (string) - Format: "{platform}#{accountId}"

**Global Secondary Indexes:**
- **platform-accountStatus-index**: Platform-based queries
  - Partition Key: `platform`
  - Sort Key: `accountStatus`

**Table Structure:**
```typescript
{
  // Primary Key
  userId: string,                    // Partition Key - User identifier
  platformAccountId: string,         // Sort Key - Platform#AccountId (e.g., "twitter#user123")
  
  // Account Details
  id: string,                        // Unique account identifier
  platform: string,                 // Platform name (twitter, facebook, etc.)
  accountId: string,                 // Platform-specific account ID
  accountName: string,               // Display name
  accountHandle: string,             // @username or handle
  profilePicture?: string,           // Profile picture URL
  
  // Account Metrics
  followerCount: number,             // Number of followers
  followingCount: number,            // Number of following
  
  // Authentication
  accessToken: string,               // OAuth access token (encrypted)
  refreshToken?: string,             // OAuth refresh token (encrypted, optional)
  tokenExpiresAt: Date,              // Token expiration timestamp
  
  // Status & Sync
  isActive: boolean,                 // Account status
  connectedAt: Date,                 // Connection timestamp
  lastSyncAt: Date,                  // Last sync timestamp
  syncStatus: "active" | "error" | "paused",
  permissions: string[],             // ["read", "write"]
  
  // Platform Specific
  platformSpecificData: any,         // Platform-specific fields
  
  // Metadata
  createdAt: Date,                   // Account creation timestamp
  updatedAt: Date,                   // Last update timestamp
  
  // Additional Index Fields
  accountStatus: string,             // "active" | "inactive"
  accountType: string                // "social_media"
}
```

**Example Record:**
```json
{
  "userId": "user_12345",
  "platformAccountId": "twitter#987654321",
  "id": "user_12345#twitter#987654321",
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
  "syncStatus": "active",
  "permissions": ["read", "write"],
  "platformSpecificData": {
    "twitterUserId": "987654321",
    "verifiedAccount": true
  },
  "createdAt": "2025-09-20T10:00:00Z",
  "updatedAt": "2025-09-20T10:00:00Z",
  "accountStatus": "active",
  "accountType": "social_media"
}
```

## 3. cloudstro-social-posts (Aggregated Posts)

**Primary Key Structure:**
- **Partition Key**: `userId` (string) - User identifier
- **Sort Key**: `postId` (string) - Format: "{platform}#{postId}"

**Global Secondary Indexes:**
- **platform-createdAtISO-index**: Platform-based queries
  - Partition Key: `platform`
  - Sort Key: `createdAtISO`

**Table Structure:**
```typescript
{
  // Primary Key
  userId: string,                    // Partition Key - User identifier
  postId: string,                    // Sort Key - Platform#PostId (e.g., "twitter#1234567890")
  
  // Post Details
  id: string,                        // Platform-specific post ID
  platform: string,                 // Platform name
  content: string,                   // Post content/text
  authorId: string,                  // Author's platform ID
  authorName: string,                // Author's display name
  authorHandle: string,              // Author's handle/username
  url?: string,                      // Direct link to post
  
  // Engagement Data
  engagement: {
    likes: number,
    shares: number,
    comments: number,
    views?: number
  },
  engagementRate: number,            // Calculated engagement rate
  
  // Content Analysis
  media?: Array<{
    type: string,                    // "image", "video", "gif"
    url: string,                     // Media URL
    thumbnailUrl?: string,           // Thumbnail URL
    altText?: string                 // Alt text description
  }>,
  hashtags: string[],                // Extracted hashtags
  mentions: string[],                // Extracted mentions
  
  // AI Analysis
  sentiment?: "positive" | "negative" | "neutral",
  aiAnalysis?: {
    topics: string[],                // AI-detected topics
    engagementPrediction: string,    // "high", "medium", "low"
    recommendedActions: string[]     // AI recommendations
  },
  
  // Metadata
  createdAt: Date,                   // Post creation timestamp
  fetchedAt: Date,                   // When we retrieved this post
  isOwn: boolean,                    // Whether user created this post
  
  // Additional Index Fields
  createdAtISO: string,              // ISO string for sorting
  postType: string,                  // "social_media_post"
  hasMedia: boolean,                 // Whether post contains media
  engagementScore: number            // Calculated engagement score for sorting
}
```

**Example Record:**
```json
{
  "userId": "user_12345",
  "postId": "twitter#1234567890",
  "id": "1234567890",
  "platform": "twitter",
  "content": "Great day for social media analytics! #AI #SocialMedia",
  "authorId": "987654321",
  "authorName": "John Doe",
  "authorHandle": "@johndoe",
  "url": "https://twitter.com/johndoe/status/1234567890",
  "engagement": {
    "likes": 150,
    "shares": 25,
    "comments": 12,
    "views": 5000
  },
  "engagementRate": 3.74,
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
  "sentiment": "positive",
  "aiAnalysis": {
    "topics": ["technology", "analytics"],
    "engagementPrediction": "high",
    "recommendedActions": ["repost", "engage"]
  },
  "createdAt": "2025-09-20T10:00:00Z",
  "fetchedAt": "2025-09-20T10:30:00Z",
  "isOwn": true,
  "createdAtISO": "2025-09-20T10:00:00Z",
  "postType": "social_media_post",
  "hasMedia": true,
  "engagementScore": 187
}
```

## 4. cloudstro-social-engagement (Engagement Tracking)

**Primary Key Structure:**
- **Partition Key**: `userId` (string) - User identifier
- **Sort Key**: `engagementId` (string) - Format: "{postId}#{timestamp}"

**Table Structure:**
```typescript
{
  // Primary Key
  userId: string,                    // Partition Key - User identifier
  engagementId: string,              // Sort Key - PostId#Timestamp (e.g., "post123#2024-01-01T10:00:00Z")
  
  // Engagement Details
  postId: string,                    // Reference to the post
  platform: string,                 // Platform name
  likes: number,                     // Like count
  shares: number,                    // Share/retweet count
  comments: number,                  // Comment count
  views?: number,                    // View count (optional)
  
  // Performance Metrics
  clickThroughRate?: number,         // CTR if applicable
  reachRate?: number,                // Reach percentage
  
  // Time Analysis
  timestamp: Date,                   // When engagement was measured
  hourOfDay: number,                 // Hour (0-23)
  dayOfWeek: string,                 // "Monday", "Tuesday", etc.
  
  // Content Analysis
  contentType: string,               // "text_post", "image_post", "video_post"
  hasHashtags: boolean,              // Whether post has hashtags
  hashtagCount: number,              // Number of hashtags
  characterCount: number,            // Post character count
  
  // Velocity Tracking
  engagementVelocity?: {
    first30min: number,              // Engagement in first 30 minutes
    firstHour: number,               // Engagement in first hour
    first24hours: number             // Engagement in first 24 hours
  },
  
  // Metadata
  timestampISO: string,              // ISO string for filtering
  engagementType: string             // "social_media_engagement"
}
```

**Example Record:**
```json
{
  "userId": "user_12345",
  "engagementId": "1234567890#2025-09-20T10:00:00Z",
  "postId": "1234567890",
  "platform": "twitter",
  "likes": 150,
  "shares": 25,
  "comments": 12,
  "views": 5000,
  "clickThroughRate": 2.5,
  "reachRate": 15.3,
  "timestamp": "2025-09-20T10:00:00Z",
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
  },
  "timestampISO": "2025-09-20T10:00:00Z",
  "engagementType": "social_media_engagement"
}
```

## 5. cloudstro-ai-insights (AI Recommendations)

**Primary Key Structure:**
- **Partition Key**: `userId` (string) - User identifier
- **Sort Key**: `insightId` (string) - Unique insight identifier

**Global Secondary Indexes:**
- **insightType-confidenceScore-index**: Query insights by type and confidence
  - Partition Key: `insightType`
  - Sort Key: `confidenceScore`

**Table Structure:**
```typescript
{
  // Primary Key
  userId: string,                    // Partition Key - User identifier
  insightId: string,                 // Sort Key - Unique insight identifier
  
  // Insight Details
  type: string,                      // Insight type (optimal_timing, content_strategy, etc.)
  platform?: string,                // Target platform (optional)
  confidence: number,                // AI confidence score (0.0 - 1.0)
  recommendation: string,            // AI recommendation text
  reasoning: string,                 // AI reasoning explanation
  data: any,                         // Additional structured data
  
  // Validity & Status
  generatedAt: Date,                 // When insight was generated
  validUntil: Date,                  // Expiration date
  isActive: boolean,                 // Whether insight is still valid
  used?: boolean,                    // Whether user has acted on this insight
  
  // Metadata
  metadata: {
    aiModel: string,                 // AI model used (e.g., "claude-3-sonnet")
    dataPoints: number,              // Number of data points analyzed
    version: string                  // Schema version
  },
  
  // Additional Index Fields
  insightType: string,               // Same as type (for indexing)
  confidenceScore: number,           // Same as confidence (for indexing)
  generatedAtISO: string,            // ISO string for sorting
  validUntilISO: string,             // ISO string for filtering
  recordType: string,                // "ai_insight"
  TTL: number                        // DynamoDB TTL (Unix timestamp)
}
```

**Example Record:**
```json
{
  "userId": "user_12345",
  "insightId": "optimal_timing_1632140400_abc123",
  "type": "optimal_timing",
  "platform": "twitter",
  "confidence": 0.92,
  "recommendation": "Post at 9 AM, 3 PM, and 7 PM for maximum engagement",
  "reasoning": "Analysis of 150 posts shows highest engagement during these times",
  "data": {
    "optimalTimes": ["09:00", "15:00", "19:00"],
    "timezone": "UTC",
    "expectedEngagementIncrease": "23%",
    "basedOnPosts": 150
  },
  "generatedAt": "2025-09-20T10:00:00Z",
  "validUntil": "2025-09-27T10:00:00Z",
  "isActive": true,
  "used": false,
  "metadata": {
    "aiModel": "claude-3-sonnet",
    "dataPoints": 500,
    "version": "1.0"
  },
  "insightType": "optimal_timing",
  "confidenceScore": 0.92,
  "generatedAtISO": "2025-09-20T10:00:00Z",
  "validUntilISO": "2025-09-27T10:00:00Z",
  "recordType": "ai_insight",
  "TTL": 1663651200
}
```

## Access Patterns & Queries

### User Management
```typescript
// Get user profile
{ userId: "user_12345", recordType: "USER_PROFILE" }

// Find user by email
// Using email-index GSI
{ email: "user@example.com" }
```

### Social Account Management
```typescript
// Get all social accounts for user
{
  KeyConditionExpression: 'userId = :userId',
  ExpressionAttributeValues: { ':userId': 'user_12345' }
}

// Get specific platform account
{
  KeyConditionExpression: 'userId = :userId AND platformAccountId = :platformAccount',
  ExpressionAttributeValues: { 
    ':userId': 'user_12345',
    ':platformAccount': 'twitter#987654321'
  }
}

// Get all accounts for a platform (using GSI)
{
  IndexName: 'platform-accountStatus-index',
  KeyConditionExpression: 'platform = :platform AND accountStatus = :status',
  ExpressionAttributeValues: { 
    ':platform': 'twitter',
    ':status': 'active'
  }
}
```

### Posts & Analytics
```typescript
// Get user's posts from all platforms
{
  KeyConditionExpression: 'userId = :userId',
  ExpressionAttributeValues: { ':userId': 'user_12345' }
}

// Get user's posts from specific platform
{
  KeyConditionExpression: 'userId = :userId',
  FilterExpression: 'platform = :platform',
  ExpressionAttributeValues: { 
    ':userId': 'user_12345',
    ':platform': 'twitter'
  }
}

// Get recent posts across platforms (using GSI)
{
  IndexName: 'platform-createdAtISO-index',
  KeyConditionExpression: 'platform = :platform AND createdAtISO > :date',
  FilterExpression: 'userId = :userId',
  ExpressionAttributeValues: { 
    ':platform': 'twitter',
    ':date': '2025-09-19T00:00:00Z',
    ':userId': 'user_12345'
  }
}
```

### Engagement Tracking
```typescript
// Get engagement history for a specific post
{
  KeyConditionExpression: 'userId = :userId AND begins_with(engagementId, :postPrefix)',
  ExpressionAttributeValues: { 
    ':userId': 'user_12345',
    ':postPrefix': 'post123#'
  }
}

// Get engagement data within date range
{
  KeyConditionExpression: 'userId = :userId',
  FilterExpression: 'timestampISO BETWEEN :start AND :end',
  ExpressionAttributeValues: { 
    ':userId': 'user_12345',
    ':start': '2025-01-01T00:00:00Z',
    ':end': '2025-01-31T23:59:59Z'
  }
}
```

### AI Insights
```typescript
// Get all insights for user
{
  KeyConditionExpression: 'userId = :userId',
  ExpressionAttributeValues: { ':userId': 'user_12345' }
}

// Get insights by type
{
  KeyConditionExpression: 'userId = :userId',
  FilterExpression: 'insightType = :type',
  ExpressionAttributeValues: { 
    ':userId': 'user_12345',
    ':type': 'optimal_timing'
  }
}

// Get active insights
{
  KeyConditionExpression: 'userId = :userId',
  FilterExpression: 'validUntilISO > :now AND isActive = :active',
  ExpressionAttributeValues: { 
    ':userId': 'user_12345',
    ':now': new Date().toISOString(),
    ':active': true
  }
}

// Get high-confidence insights (using GSI)
{
  IndexName: 'insightType-confidenceScore-index',
  KeyConditionExpression: 'insightType = :type AND confidenceScore > :confidence',
  ExpressionAttributeValues: { 
    ':type': 'content_strategy',
    ':confidence': 0.8
  }
}
```

## Benefits of Meaningful Column Names

### 1. **Improved Readability**
- Developers can immediately understand what each column contains
- No need to decode generic PK/SK patterns like `USER#12345` or `SOCIAL#twitter#123`
- Self-documenting schema

### 2. **Better Debugging**
- Console logs and error messages are more informative
- Example: `userId: "user_12345"` vs `PK: "USER#12345"`
- Query expressions are more intuitive

### 3. **Enhanced Maintainability**
- New team members can understand the schema quickly
- Reduced documentation requirements
- Less prone to errors when writing queries

### 4. **Business Alignment**
- Column names match business terminology
- Easier communication with non-technical stakeholders
- Better alignment with application logic

## Environment Variables Update

Update your `.env.example`:

```bash
# DynamoDB Table Names
DYNAMODB_USERS_TABLE=cloudstro-users
DYNAMODB_SOCIAL_ACCOUNTS_TABLE=cloudstro-social-accounts
DYNAMODB_SOCIAL_POSTS_TABLE=cloudstro-social-posts
DYNAMODB_SOCIAL_ENGAGEMENT_TABLE=cloudstro-social-engagement
DYNAMODB_AI_INSIGHTS_TABLE=cloudstro-ai-insights

# AWS Configuration
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key

# Social Media API Keys
TWITTER_CLIENT_ID=your-twitter-client-id
TWITTER_CLIENT_SECRET=your-twitter-client-secret
FACEBOOK_APP_ID=your-facebook-app-id
FACEBOOK_APP_SECRET=your-facebook-app-secret
INSTAGRAM_CLIENT_ID=your-instagram-client-id
INSTAGRAM_CLIENT_SECRET=your-instagram-client-secret

# RedNote API (replacing LinkedIn)
REDNOTE_CLIENT_ID=your-rednote-client-id
REDNOTE_CLIENT_SECRET=your-rednote-client-secret
REDNOTE_ACCESS_TOKEN=your-rednote-access-token

# TikTok API
TIKTOK_CLIENT_ID=your-tiktok-client-id
TIKTOK_CLIENT_SECRET=your-tiktok-client-secret

# AWS Bedrock
BEDROCK_REGION=us-east-1
BEDROCK_MODEL_ID=anthropic.claude-3-sonnet-20240229-v1:0
```

## Table Creation with AWS CDK/CloudFormation

### Example CDK Stack:
```typescript
import { Table, AttributeType, BillingMode } from 'aws-cdk-lib/aws-dynamodb';

// Social Accounts Table
const socialAccountsTable = new Table(this, 'SocialAccountsTable', {
  tableName: 'cloudstro-social-accounts',
  partitionKey: { name: 'userId', type: AttributeType.STRING },
  sortKey: { name: 'platformAccountId', type: AttributeType.STRING },
  billingMode: BillingMode.PAY_PER_REQUEST,
});

// Add GSI for platform queries
socialAccountsTable.addGlobalSecondaryIndex({
  indexName: 'platform-accountStatus-index',
  partitionKey: { name: 'platform', type: AttributeType.STRING },
  sortKey: { name: 'accountStatus', type: AttributeType.STRING },
});

// AI Insights Table
const aiInsightsTable = new Table(this, 'AIInsightsTable', {
  tableName: 'cloudstro-ai-insights',
  partitionKey: { name: 'userId', type: AttributeType.STRING },
  sortKey: { name: 'insightId', type: AttributeType.STRING },
  billingMode: BillingMode.PAY_PER_REQUEST,
  timeToLiveAttribute: 'TTL', // Enable TTL for automatic cleanup
});

// Add GSI for insight type queries
aiInsightsTable.addGlobalSecondaryIndex({
  indexName: 'insightType-confidenceScore-index',
  partitionKey: { name: 'insightType', type: AttributeType.STRING },
  sortKey: { name: 'confidenceScore', type: AttributeType.NUMBER },
});
```

## Migration from Generic PK/SK

If migrating from existing PK/SK structure:

```typescript
// Before (Generic Pattern)
const oldRecord = {
  PK: `USER#${userId}`,
  SK: `SOCIAL#${platform}#${accountId}`,
  ...accountData
};

// After (Meaningful Names)
const newRecord = {
  userId: userId,
  platformAccountId: `${platform}#${accountId}`,
  ...accountData
};
```

## Implementation Examples

### Repository Pattern with Meaningful Names:
```typescript
class SocialMediaRepository {
  async createAccount(userId: string, account: SocialMediaAccount) {
    await this.docClient.send(new PutCommand({
      TableName: this.accountsTable,
      Item: {
        userId: userId,
        platformAccountId: `${account.platform}#${account.accountId}`,
        ...account,
        accountStatus: account.isActive ? 'active' : 'inactive',
        accountType: 'social_media',
      },
    }));
  }

  async getUserAccounts(userId: string) {
    return await this.docClient.send(new QueryCommand({
      TableName: this.accountsTable,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: { ':userId': userId },
    }));
  }
}
```

This schema design provides:
1. **User-centric data organization** - All data partitioned by user
2. **Intuitive column names** - Clear, meaningful field names
3. **Efficient access patterns** - Optimized for common queries
4. **Scalability** - Supports growth as users connect more accounts
5. **AI-ready structure** - Built for advanced analytics and insights
6. **Cross-platform support** - Unified approach for all social media platforms

The meaningful column names make the database schema self-documenting and significantly improve the developer experience while maintaining all the performance benefits of DynamoDB's NoSQL design.