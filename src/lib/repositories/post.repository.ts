import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, QueryCommand, GetCommand, UpdateCommand, DeleteCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';
import { ddbDocClient } from '../dynamodb';
import { SocialMediaPost } from '../../types/social-media';

export class PostRepository {
  private docClient: DynamoDBDocumentClient;
  private tableName = process.env.DYNAMODB_SOCIAL_POSTS_TABLE || 'cloudstro-social-posts';

  constructor() {
    this.docClient = ddbDocClient;
  }

  async createPost(userId: string, post: Omit<SocialMediaPost, 'id'>): Promise<SocialMediaPost> {
    const postId = `${post.platform}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const timestamp = new Date().toISOString();

    const postItem: SocialMediaPost = {
      ...post,
      id: postId,
    };

    // Clean the data to remove undefined values
    const cleanPost = this.cleanPostData(post);

    const command = new PutCommand({
      TableName: this.tableName,
      Item: {
        userId, // PK
        postId, // SK
        platform: cleanPost.platform,
        content: cleanPost.content,
        authorId: cleanPost.authorId,
        authorName: cleanPost.authorName,
        authorHandle: cleanPost.authorHandle || '',
        createdAt: cleanPost.createdAt.toISOString(),
        engagement: cleanPost.engagement,
        media: cleanPost.media || [],
        hashtags: cleanPost.hashtags || [],
        mentions: cleanPost.mentions || [],
        url: cleanPost.url,
        isRepost: cleanPost.isRepost || false,
        originalPostId: cleanPost.originalPostId || null,
        storedAt: timestamp,
        updatedAt: timestamp,
        // Add AI analysis fields
        aiAnalyzed: false,
        sentimentScore: null,
        topics: [],
        engagementPrediction: null,
      },
    });

    await this.docClient.send(command);
    return postItem;
  }

  private cleanPostData(post: any): any {
    // Remove undefined values and ensure all required fields are present
    return {
      platform: post.platform,
      content: post.content || '',
      authorId: post.authorId || '',
      authorName: post.authorName || '',
      authorHandle: post.authorHandle || '',
      createdAt: post.createdAt || new Date(),
      engagement: post.engagement || { likes: 0, shares: 0, comments: 0 },
      media: post.media || [],
      hashtags: post.hashtags || [],
      mentions: post.mentions || [],
      url: post.url || '',
      isRepost: post.isRepost || false,
      originalPostId: post.originalPostId || null,
    };
  }

  async getPostsByUser(userId: string, limit: number = 50): Promise<SocialMediaPost[]> {
    const command = new QueryCommand({
      TableName: this.tableName,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId,
      },
      ScanIndexForward: false, // Get newest first
      Limit: limit,
    });

    const result = await this.docClient.send(command);
    return (result.Items || []).map(this.mapItemToPost);
  }

  async getPostsByPlatform(userId: string, platform: string, limit: number = 50): Promise<SocialMediaPost[]> {
    const command = new QueryCommand({
      TableName: this.tableName,
      KeyConditionExpression: 'userId = :userId',
      FilterExpression: 'platform = :platform',
      ExpressionAttributeValues: {
        ':userId': userId,
        ':platform': platform,
      },
      ScanIndexForward: false,
      Limit: limit,
    });

    const result = await this.docClient.send(command);
    return (result.Items || []).map(this.mapItemToPost);
  }

  async searchPosts(userId: string, query: string, platforms?: string[]): Promise<SocialMediaPost[]> {
    // For demo purposes, we'll do a scan with filters
    // In production, you'd use ElasticSearch or similar for text search
    const filterExpressions = ['userId = :userId'];
    const expressionAttributeValues: any = { ':userId': userId };

    if (platforms && platforms.length > 0) {
      filterExpressions.push('platform IN (' + platforms.map((_, i) => `:platform${i}`).join(',') + ')');
      platforms.forEach((platform, i) => {
        expressionAttributeValues[`:platform${i}`] = platform;
      });
    }

    if (query) {
      filterExpressions.push('(contains(content, :query) OR contains(hashtags, :query))');
      expressionAttributeValues[':query'] = query.toLowerCase();
    }

    const command = new ScanCommand({
      TableName: this.tableName,
      FilterExpression: filterExpressions.join(' AND '),
      ExpressionAttributeValues: expressionAttributeValues,
      Limit: 100,
    });

    const result = await this.docClient.send(command);
    return (result.Items || []).map(this.mapItemToPost);
  }

  async updatePostEngagement(userId: string, postId: string, engagement: any): Promise<void> {
    const command = new UpdateCommand({
      TableName: this.tableName,
      Key: {
        userId,
        postId,
      },
      UpdateExpression: 'SET engagement = :engagement, updatedAt = :updatedAt',
      ExpressionAttributeValues: {
        ':engagement': engagement,
        ':updatedAt': new Date().toISOString(),
      },
    });

    await this.docClient.send(command);
  }

  async updatePostAIAnalysis(userId: string, postId: string, analysis: {
    sentimentScore?: number;
    topics?: string[];
    engagementPrediction?: number;
  }): Promise<void> {
    const command = new UpdateCommand({
      TableName: this.tableName,
      Key: {
        userId,
        postId,
      },
      UpdateExpression: 'SET aiAnalyzed = :analyzed, sentimentScore = :sentiment, topics = :topics, engagementPrediction = :prediction, updatedAt = :updatedAt',
      ExpressionAttributeValues: {
        ':analyzed': true,
        ':sentiment': analysis.sentimentScore || null,
        ':topics': analysis.topics || [],
        ':prediction': analysis.engagementPrediction || null,
        ':updatedAt': new Date().toISOString(),
      },
    });

    await this.docClient.send(command);
  }

  async deletePost(userId: string, postId: string): Promise<void> {
    const command = new DeleteCommand({
      TableName: this.tableName,
      Key: {
        userId,
        postId,
      },
    });

    await this.docClient.send(command);
  }

  async getPostsForAIAnalysis(userId: string, limit: number = 10): Promise<SocialMediaPost[]> {
    const command = new QueryCommand({
      TableName: this.tableName,
      KeyConditionExpression: 'userId = :userId',
      FilterExpression: 'aiAnalyzed = :analyzed',
      ExpressionAttributeValues: {
        ':userId': userId,
        ':analyzed': false,
      },
      Limit: limit,
    });

    const result = await this.docClient.send(command);
    return (result.Items || []).map(this.mapItemToPost);
  }

  private mapItemToPost(item: any): SocialMediaPost {
    return {
      id: item.postId,
      platform: item.platform,
      content: item.content,
      authorId: item.authorId,
      authorName: item.authorName,
      authorHandle: item.authorHandle,
      createdAt: new Date(item.createdAt),
      engagement: item.engagement,
      media: item.media || [],
      hashtags: item.hashtags || [],
      mentions: item.mentions || [],
      url: item.url,
      isRepost: item.isRepost || false,
      originalPostId: item.originalPostId,
    };
  }
}