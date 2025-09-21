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

    await this.docClient.send(new PutCommand({
      TableName: this.accountsTable,
      Item: {
        PK: `USER#${userId}`,
        SK: `SOCIAL#${account.platform}#${account.accountId}`,
        ...accountWithMeta,
        GSI1PK: `PLATFORM#${account.platform}`,
        GSI1SK: `USER#${userId}`,
        GSI2PK: `STATUS#${account.isActive}`,
        GSI2SK: `USER#${userId}#${account.platform}`,
      },
    }));

    return accountWithMeta;
  }

  async getAccountsByUser(userId: string): Promise<SocialMediaAccount[]> {
    const response = await this.docClient.send(new QueryCommand({
      TableName: this.accountsTable,
      KeyConditionExpression: 'PK = :pk AND begins_with(SK, :sk)',
      ExpressionAttributeValues: {
        ':pk': `USER#${userId}`,
        ':sk': 'SOCIAL#',
      },
    }));

    return (response.Items || []) as SocialMediaAccount[];
  }

  async updateAccountToken(userId: string, platform: string, accountId: string, accessToken: string, refreshToken?: string): Promise<void> {
    await this.docClient.send(new UpdateCommand({
      TableName: this.accountsTable,
      Key: {
        PK: `USER#${userId}`,
        SK: `SOCIAL#${platform}#${accountId}`,
      },
      UpdateExpression: 'SET accessToken = :token, updatedAt = :now' + (refreshToken ? ', refreshToken = :refresh' : ''),
      ExpressionAttributeValues: {
        ':token': accessToken,
        ':now': new Date(),
        ...(refreshToken && { ':refresh': refreshToken }),
      },
    }));
  }

  async deleteAccount(userId: string, platform: string, accountId: string): Promise<void> {
    await this.docClient.send(new DeleteCommand({
      TableName: this.accountsTable,
      Key: {
        PK: `USER#${userId}`,
        SK: `SOCIAL#${platform}#${accountId}`,
      },
    }));
  }

  // Social Media Posts CRUD operations
  async savePost(userId: string, post: SocialMediaPost): Promise<void> {
    await this.docClient.send(new PutCommand({
      TableName: this.postsTable,
      Item: {
        PK: `USER#${userId}`,
        SK: `POST#${post.platform}#${post.id}`,
        ...post,
        GSI1PK: `PLATFORM#${post.platform}`,
        GSI1SK: post.createdAt.toISOString(),
        GSI2PK: `AUTHOR#${post.authorId}`,
        GSI2SK: post.createdAt.toISOString(),
      },
    }));
  }

  async getPostsByUser(userId: string, limit: number = 50): Promise<SocialMediaPost[]> {
    const response = await this.docClient.send(new QueryCommand({
      TableName: this.postsTable,
      KeyConditionExpression: 'PK = :pk AND begins_with(SK, :sk)',
      ExpressionAttributeValues: {
        ':pk': `USER#${userId}`,
        ':sk': 'POST#',
      },
      ScanIndexForward: false, // Sort by newest first
      Limit: limit,
    }));

    return (response.Items || []) as SocialMediaPost[];
  }

  async getPostsByPlatform(userId: string, platform: string, limit: number = 50): Promise<SocialMediaPost[]> {
    const response = await this.docClient.send(new QueryCommand({
      TableName: this.postsTable,
      IndexName: 'GSI1',
      KeyConditionExpression: 'GSI1PK = :pk',
      FilterExpression: 'begins_with(PK, :userPk)',
      ExpressionAttributeValues: {
        ':pk': `PLATFORM#${platform}`,
        ':userPk': `USER#${userId}`,
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
        PK: `USER#${userId}`,
        SK: `ENGAGEMENT#${engagement.postId}#${engagement.timestamp.toISOString()}`,
        ...engagement,
        GSI1PK: `POST#${engagement.postId}`,
        GSI1SK: engagement.timestamp.toISOString(),
      },
    }));
  }

  async getEngagementHistory(userId: string, postId: string): Promise<SocialMediaEngagement[]> {
    const response = await this.docClient.send(new QueryCommand({
      TableName: this.engagementTable,
      KeyConditionExpression: 'PK = :pk AND begins_with(SK, :sk)',
      ExpressionAttributeValues: {
        ':pk': `USER#${userId}`,
        ':sk': `ENGAGEMENT#${postId}#`,
      },
      ScanIndexForward: false,
    }));

    return (response.Items || []) as SocialMediaEngagement[];
  }

  // Analytics queries
  async getEngagementMetrics(userId: string, startDate: Date, endDate: Date): Promise<SocialMediaEngagement[]> {
    const response = await this.docClient.send(new QueryCommand({
      TableName: this.engagementTable,
      KeyConditionExpression: 'PK = :pk AND SK BETWEEN :start AND :end',
      ExpressionAttributeValues: {
        ':pk': `USER#${userId}`,
        ':start': `ENGAGEMENT#${startDate.toISOString()}`,
        ':end': `ENGAGEMENT#${endDate.toISOString()}zzz`, // Add 'zzz' to ensure we get all items
      },
    }));

    return (response.Items || []) as SocialMediaEngagement[];
  }

  async getTopPerformingPosts(userId: string, platform?: string, limit: number = 10): Promise<SocialMediaPost[]> {
    let queryParams: any = {
      TableName: this.postsTable,
      KeyConditionExpression: 'PK = :pk AND begins_with(SK, :sk)',
      ExpressionAttributeValues: {
        ':pk': `USER#${userId}`,
        ':sk': platform ? `POST#${platform}#` : 'POST#',
      },
      Limit: limit * 2, // Get more items to sort by engagement
    };

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