import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { 
  DynamoDBDocumentClient, 
  PutCommand, 
  GetCommand, 
  UpdateCommand, 
  DeleteCommand, 
  QueryCommand,
  ScanCommand 
} from "@aws-sdk/lib-dynamodb";
import { ddbDocClient } from '../dynamodb';
import { SocialMediaAccount, SocialMediaPost, SocialMediaEngagement } from '../../types/social-media';

export class SocialMediaRepository {
  private docClient: DynamoDBDocumentClient;
  private accountsTable: string;
  private postsTable: string;
  private engagementTable: string;

  constructor() {
    this.docClient = ddbDocClient;
    this.accountsTable = process.env.DYNAMODB_SOCIAL_ACCOUNTS_TABLE || 'cloudstro-social-accounts';
    this.postsTable = process.env.DYNAMODB_SOCIAL_POSTS_TABLE || 'cloudstro-social-posts';
    this.engagementTable = process.env.DYNAMODB_SOCIAL_ENGAGEMENT_TABLE || 'cloudstro-social-engagement';
  }

  // Social Media Accounts CRUD operations
  async createAccount(userId: string, account: Omit<SocialMediaAccount, 'id' | 'createdAt' | 'updatedAt'>): Promise<SocialMediaAccount> {
    const now = new Date();
    const accountWithMeta: SocialMediaAccount = {
      ...account,
      id: `${userId}#${account.platform}#${account.accountId}`,
      createdAt: now,
      updatedAt: now,
    };

    // Clean the account data for DynamoDB storage
    const cleanAccount = {
      id: accountWithMeta.id,
      platform: account.platform,
      accountId: account.accountId,
      accountName: account.accountName,
      accountHandle: account.accountHandle || '',
      accessToken: account.accessToken,
      refreshToken: account.refreshToken || '',
      tokenExpiresAt: account.tokenExpiresAt?.toISOString() || null,
      isActive: account.isActive,
    };

    await this.docClient.send(new PutCommand({
      TableName: this.accountsTable,
      Item: {
        userId: userId,
        platformAccountId: `${account.platform}#${account.accountId}`,
        ...cleanAccount,
        // Convert Date objects to ISO strings for DynamoDB
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
        // GSI indexes for querying
        platform: account.platform,
        accountStatus: account.isActive ? 'active' : 'inactive',
        accountType: 'social_media',
      },
    }));

    return accountWithMeta;
  }

  async getAccountsByUser(userId: string): Promise<SocialMediaAccount[]> {
    const response = await this.docClient.send(new QueryCommand({
      TableName: this.accountsTable,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId,
      },
    }));

    return (response.Items || []) as SocialMediaAccount[];
  }

  async updateAccountToken(userId: string, platform: string, accountId: string, accessToken: string, refreshToken?: string): Promise<void> {
    await this.docClient.send(new UpdateCommand({
      TableName: this.accountsTable,
      Key: {
        userId: userId,
        platformAccountId: `${platform}#${accountId}`,
      },
      UpdateExpression: 'SET accessToken = :token, updatedAt = :now' + (refreshToken ? ', refreshToken = :refresh' : ''),
      ExpressionAttributeValues: {
        ':token': accessToken,
        ':now': new Date().toISOString(),
        ...(refreshToken && { ':refresh': refreshToken }),
      },
    }));
  }

  async deleteAccount(userId: string, platform: string, accountId: string): Promise<void> {
    await this.docClient.send(new DeleteCommand({
      TableName: this.accountsTable,
      Key: {
        userId: userId,
        platformAccountId: `${platform}#${accountId}`,
      },
    }));
  }

  // Social Media Posts CRUD operations
  async savePost(userId: string, post: SocialMediaPost): Promise<void> {
    await this.docClient.send(new PutCommand({
      TableName: this.postsTable,
      Item: {
        userId: userId,
        postId: `${post.platform}#${post.id}`,
        ...post,
        // Additional fields for indexing
        platform: post.platform,
        createdAtISO: post.createdAt.toISOString(),
        authorId: post.authorId,
        postType: 'social_media_post',
      },
    }));
  }

  async getPostsByUser(userId: string, limit: number = 50): Promise<SocialMediaPost[]> {
    const response = await this.docClient.send(new QueryCommand({
      TableName: this.postsTable,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId,
      },
      ScanIndexForward: false, // Sort by newest first
      Limit: limit,
    }));

    return (response.Items || []) as SocialMediaPost[];
  }

  async getPostsByPlatform(userId: string, platform: string, limit: number = 50): Promise<SocialMediaPost[]> {
    const response = await this.docClient.send(new QueryCommand({
      TableName: this.postsTable,
      IndexName: 'platform-createdAtISO-index', // GSI with platform as partition key
      KeyConditionExpression: 'platform = :platform',
      FilterExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':platform': platform,
        ':userId': userId,
      },
      ScanIndexForward: false,
      Limit: limit,
    }));

    return (response.Items || []) as SocialMediaPost[];
  }

  // Engagement tracking
  async saveEngagementData(userId: string, engagement: SocialMediaEngagement): Promise<void> {
    await this.docClient.send(new PutCommand({
      TableName: this.engagementTable,
      Item: {
        userId: userId,
        engagementId: `${engagement.postId}#${engagement.timestamp.toISOString()}`,
        ...engagement,
        // Additional fields for indexing
        postId: engagement.postId,
        timestampISO: engagement.timestamp.toISOString(),
        engagementType: 'social_media_engagement',
      },
    }));
  }

  async getEngagementHistory(userId: string, postId: string): Promise<SocialMediaEngagement[]> {
    const response = await this.docClient.send(new QueryCommand({
      TableName: this.engagementTable,
      KeyConditionExpression: 'userId = :userId AND begins_with(engagementId, :postPrefix)',
      ExpressionAttributeValues: {
        ':userId': userId,
        ':postPrefix': `${postId}#`,
      },
      ScanIndexForward: false,
    }));

    return (response.Items || []) as SocialMediaEngagement[];
  }

  // Analytics queries
  async getEngagementMetrics(userId: string, startDate: Date, endDate: Date): Promise<SocialMediaEngagement[]> {
    const response = await this.docClient.send(new QueryCommand({
      TableName: this.engagementTable,
      KeyConditionExpression: 'userId = :userId',
      FilterExpression: 'timestampISO BETWEEN :start AND :end',
      ExpressionAttributeValues: {
        ':userId': userId,
        ':start': startDate.toISOString(),
        ':end': endDate.toISOString(),
      },
    }));

    return (response.Items || []) as SocialMediaEngagement[];
  }

  async getTopPerformingPosts(userId: string, platform?: string, limit: number = 10): Promise<SocialMediaPost[]> {
    let queryParams: any = {
      TableName: this.postsTable,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId,
      },
      Limit: limit * 2, // Get more items to sort by engagement
    };

    // Add platform filter if specified
    if (platform) {
      queryParams.FilterExpression = 'platform = :platform';
      queryParams.ExpressionAttributeValues[':platform'] = platform;
    }

    const response = await this.docClient.send(new QueryCommand(queryParams));
    const posts = (response.Items || []) as SocialMediaPost[];

    // Sort by total engagement (likes + shares + comments)
    return posts
      .sort((a, b) => {
        const aEngagement = a.engagement.likes + a.engagement.shares + a.engagement.comments;
        const bEngagement = b.engagement.likes + b.engagement.shares + b.engagement.comments;
        return bEngagement - aEngagement;
      })
      .slice(0, limit);
  }
}