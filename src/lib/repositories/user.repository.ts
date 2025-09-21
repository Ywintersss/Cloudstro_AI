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

export interface User {
  userId: string;
  email: string;
  username: string;
  fullName: string;
  avatar?: string;
  subscription: 'premium' | 'basic' | 'free';
  socialAccountsConnected: string[];
  aiPreferences: {
    contentStyle: string;
    postingFrequency: string;
    preferredTimes: string[];
  };
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  lastLoginAt: Date;
}

export class UserRepository {
  private docClient: DynamoDBDocumentClient;
  private usersTable: string;

  constructor() {
    this.docClient = ddbDocClient;
    this.usersTable = process.env.DYNAMODB_USERS_TABLE || 'cloudstro-users';
  }

  async createUser(userData: Omit<User, 'userId' | 'createdAt' | 'updatedAt'>): Promise<User> {
    const now = new Date();
    const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const user: User = {
      ...userData,
      userId,
      createdAt: now,
      updatedAt: now,
    };

    await this.docClient.send(new PutCommand({
      TableName: this.usersTable,
      Item: {
        PK: `USER#${userId}`,
        SK: 'PROFILE',
        ...user,
        GSI1PK: `EMAIL#${userData.email}`,
        GSI1SK: `USER#${userId}`,
      },
    }));

    return user;
  }

  async getUserById(userId: string): Promise<User | null> {
    const response = await this.docClient.send(new GetCommand({
      TableName: this.usersTable,
      Key: {
        PK: `USER#${userId}`,
        SK: 'PROFILE',
      },
    }));

    if (!response.Item) return null;

    return {
      userId: response.Item.userId,
      email: response.Item.email,
      username: response.Item.username,
      fullName: response.Item.fullName,
      avatar: response.Item.avatar,
      subscription: response.Item.subscription,
      socialAccountsConnected: response.Item.socialAccountsConnected || [],
      aiPreferences: response.Item.aiPreferences || {
        contentStyle: 'professional',
        postingFrequency: 'daily',
        preferredTimes: ['09:00', '15:00', '19:00']
      },
      createdAt: new Date(response.Item.createdAt),
      updatedAt: new Date(response.Item.updatedAt),
      isActive: response.Item.isActive,
      lastLoginAt: new Date(response.Item.lastLoginAt),
    } as User;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const response = await this.docClient.send(new QueryCommand({
      TableName: this.usersTable,
      IndexName: 'GSI1',
      KeyConditionExpression: 'GSI1PK = :email',
      ExpressionAttributeValues: {
        ':email': `EMAIL#${email}`,
      },
    }));

    if (!response.Items || response.Items.length === 0) return null;

    const item = response.Items[0];
    return {
      userId: item.userId,
      email: item.email,
      username: item.username,
      fullName: item.fullName,
      avatar: item.avatar,
      subscription: item.subscription,
      socialAccountsConnected: item.socialAccountsConnected || [],
      aiPreferences: item.aiPreferences || {
        contentStyle: 'professional',
        postingFrequency: 'daily',
        preferredTimes: ['09:00', '15:00', '19:00']
      },
      createdAt: new Date(item.createdAt),
      updatedAt: new Date(item.updatedAt),
      isActive: item.isActive,
      lastLoginAt: new Date(item.lastLoginAt),
    } as User;
  }

  async updateUser(userId: string, updates: Partial<User>): Promise<void> {
    const updateExpressions: string[] = [];
    const expressionAttributeNames: Record<string, string> = {};
    const expressionAttributeValues: Record<string, any> = {};

    if (updates.username) {
      updateExpressions.push('#username = :username');
      expressionAttributeNames['#username'] = 'username';
      expressionAttributeValues[':username'] = updates.username;
    }

    if (updates.fullName) {
      updateExpressions.push('#fullName = :fullName');
      expressionAttributeNames['#fullName'] = 'fullName';
      expressionAttributeValues[':fullName'] = updates.fullName;
    }

    if (updates.avatar) {
      updateExpressions.push('avatar = :avatar');
      expressionAttributeValues[':avatar'] = updates.avatar;
    }

    if (updates.subscription) {
      updateExpressions.push('subscription = :subscription');
      expressionAttributeValues[':subscription'] = updates.subscription;
    }

    if (updates.aiPreferences) {
      updateExpressions.push('aiPreferences = :aiPreferences');
      expressionAttributeValues[':aiPreferences'] = updates.aiPreferences;
    }

    if (updates.socialAccountsConnected) {
      updateExpressions.push('socialAccountsConnected = :socialAccounts');
      expressionAttributeValues[':socialAccounts'] = updates.socialAccountsConnected;
    }

    if (updates.isActive !== undefined) {
      updateExpressions.push('isActive = :isActive');
      expressionAttributeValues[':isActive'] = updates.isActive;
    }

    // Always update the updatedAt timestamp
    updateExpressions.push('updatedAt = :updatedAt');
    expressionAttributeValues[':updatedAt'] = new Date().toISOString();

    if (updateExpressions.length === 1) return; // Only updatedAt, no real changes

    await this.docClient.send(new UpdateCommand({
      TableName: this.usersTable,
      Key: {
        PK: `USER#${userId}`,
        SK: 'PROFILE',
      },
      UpdateExpression: `SET ${updateExpressions.join(', ')}`,
      ExpressionAttributeNames: Object.keys(expressionAttributeNames).length > 0 ? expressionAttributeNames : undefined,
      ExpressionAttributeValues: expressionAttributeValues,
    }));
  }

  async updateLastLogin(userId: string): Promise<void> {
    await this.docClient.send(new UpdateCommand({
      TableName: this.usersTable,
      Key: {
        PK: `USER#${userId}`,
        SK: 'PROFILE',
      },
      UpdateExpression: 'SET lastLoginAt = :lastLogin, updatedAt = :updatedAt',
      ExpressionAttributeValues: {
        ':lastLogin': new Date().toISOString(),
        ':updatedAt': new Date().toISOString(),
      },
    }));
  }

  async addConnectedSocialAccount(userId: string, platform: string): Promise<void> {
    // Get current user to check existing connected accounts
    const user = await this.getUserById(userId);
    if (!user) throw new Error('User not found');

    const connectedAccounts = user.socialAccountsConnected || [];
    if (!connectedAccounts.includes(platform)) {
      connectedAccounts.push(platform);
      
      await this.updateUser(userId, {
        socialAccountsConnected: connectedAccounts,
      });
    }
  }

  async removeConnectedSocialAccount(userId: string, platform: string): Promise<void> {
    const user = await this.getUserById(userId);
    if (!user) throw new Error('User not found');

    const connectedAccounts = (user.socialAccountsConnected || []).filter(p => p !== platform);
    
    await this.updateUser(userId, {
      socialAccountsConnected: connectedAccounts,
    });
  }

  async deleteUser(userId: string): Promise<void> {
    await this.docClient.send(new DeleteCommand({
      TableName: this.usersTable,
      Key: {
        PK: `USER#${userId}`,
        SK: 'PROFILE',
      },
    }));
  }

  async getAllUsers(limit: number = 50): Promise<User[]> {
    const response = await this.docClient.send(new ScanCommand({
      TableName: this.usersTable,
      FilterExpression: 'SK = :sk',
      ExpressionAttributeValues: {
        ':sk': 'PROFILE',
      },
      Limit: limit,
    }));

    return (response.Items || []).map(item => ({
      userId: item.userId,
      email: item.email,
      username: item.username,
      fullName: item.fullName,
      avatar: item.avatar,
      subscription: item.subscription,
      socialAccountsConnected: item.socialAccountsConnected || [],
      aiPreferences: item.aiPreferences || {
        contentStyle: 'professional',
        postingFrequency: 'daily',
        preferredTimes: ['09:00', '15:00', '19:00']
      },
      createdAt: new Date(item.createdAt),
      updatedAt: new Date(item.updatedAt),
      isActive: item.isActive,
      lastLoginAt: new Date(item.lastLoginAt),
    })) as User[];
  }

  async getUserStats(userId: string): Promise<{
    connectedPlatforms: number;
    totalPosts: number;
    totalEngagement: number;
    joinedDate: Date;
  }> {
    const user = await this.getUserById(userId);
    if (!user) throw new Error('User not found');

    // These would typically come from other tables/services
    // For now, return basic data from user profile
    return {
      connectedPlatforms: user.socialAccountsConnected.length,
      totalPosts: 0, // Would query from posts table
      totalEngagement: 0, // Would query from engagement table
      joinedDate: user.createdAt,
    };
  }
}