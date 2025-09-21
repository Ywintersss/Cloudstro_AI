import { 
  DynamoDBDocumentClient, 
  PutCommand, 
  GetCommand, 
  QueryCommand,
  UpdateCommand 
} from "@aws-sdk/lib-dynamodb";
import { ddbDocClient } from '../dynamodb';
import { AIInsight } from '../services/bedrock-ai.service';

export interface AIInsightRecord {
  userId: string;
  insightId: string;
  type: string;
  platform?: string;
  confidence: number;
  recommendation: string;
  data: any;
  reasoning: string;
  generatedAt: Date;
  validUntil: Date;
  isActive: boolean;
  metadata: {
    aiModel: string;
    dataPoints: number;
    version: string;
  };
}

export class AIInsightsRepository {
  private docClient: DynamoDBDocumentClient;
  private insightsTable: string;

  constructor() {
    this.docClient = ddbDocClient;
    this.insightsTable = process.env.DYNAMODB_AI_INSIGHTS_TABLE || 'cloudstro-ai-insights';
  }

  async saveInsight(userId: string, insight: AIInsight, validityDays: number = 7): Promise<string> {
    const now = new Date();
    const validUntil = new Date(now.getTime() + validityDays * 24 * 60 * 60 * 1000);
    const insightId = `${insight.type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const record: AIInsightRecord = {
      userId,
      insightId,
      type: insight.type,
      platform: insight.platform,
      confidence: insight.confidence,
      recommendation: insight.recommendation,
      data: insight.data,
      reasoning: insight.reasoning,
      generatedAt: now,
      validUntil,
      isActive: true,
      metadata: {
        aiModel: 'claude-3-sonnet',
        dataPoints: 0,
        version: '1.0',
      },
    };

    await this.docClient.send(new PutCommand({
      TableName: this.insightsTable,
      Item: {
        ...record, // This includes userId and insightId
        // Additional fields for indexing
        insightType: insight.type,
        confidenceScore: insight.confidence,
        generatedAtISO: now.toISOString(),
        validUntilISO: validUntil.toISOString(),
        recordType: 'ai_insight',
        TTL: Math.floor(validUntil.getTime() / 1000), // DynamoDB TTL
      },
    }));

    return insightId;
  }

  async getUserInsights(userId: string, limit: number = 20): Promise<AIInsightRecord[]> {
    const response = await this.docClient.send(new QueryCommand({
      TableName: this.insightsTable,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId,
      },
      ScanIndexForward: false, // Most recent first
      Limit: limit,
    }));

    return (response.Items || []).map(this.mapDynamoItemToInsight);
  }

  async getUserInsightsByType(userId: string, type: string, limit: number = 10): Promise<AIInsightRecord[]> {
    const response = await this.docClient.send(new QueryCommand({
      TableName: this.insightsTable,
      KeyConditionExpression: 'userId = :userId',
      FilterExpression: 'insightType = :type',
      ExpressionAttributeValues: {
        ':userId': userId,
        ':type': type,
      },
      ScanIndexForward: false,
      Limit: limit,
    }));

    return (response.Items || []).map(this.mapDynamoItemToInsight);
  }

  async getActiveInsights(userId: string): Promise<AIInsightRecord[]> {
    const now = new Date();
    const response = await this.docClient.send(new QueryCommand({
      TableName: this.insightsTable,
      KeyConditionExpression: 'userId = :userId',
      FilterExpression: 'validUntilISO > :now AND isActive = :active',
      ExpressionAttributeValues: {
        ':userId': userId,
        ':now': now.toISOString(),
        ':active': true,
      },
      ScanIndexForward: false,
    }));

    return (response.Items || []).map(this.mapDynamoItemToInsight);
  }

  async getInsightsByPlatform(userId: string, platform: string, limit: number = 10): Promise<AIInsightRecord[]> {
    const response = await this.docClient.send(new QueryCommand({
      TableName: this.insightsTable,
      KeyConditionExpression: 'userId = :userId',
      FilterExpression: 'platform = :platform',
      ExpressionAttributeValues: {
        ':userId': userId,
        ':platform': platform,
      },
      ScanIndexForward: false,
      Limit: limit,
    }));

    return (response.Items || []).map(this.mapDynamoItemToInsight);
  }

  async markInsightAsUsed(userId: string, insightId: string): Promise<void> {
    await this.docClient.send(new UpdateCommand({
      TableName: this.insightsTable,
      Key: {
        userId: userId,
        insightId: insightId,
      },
      UpdateExpression: 'SET #used = :used, updatedAt = :now',
      ExpressionAttributeNames: {
        '#used': 'used',
      },
      ExpressionAttributeValues: {
        ':used': true,
        ':now': new Date().toISOString(),
      },
    }));
  }

  async getInsightMetrics(userId: string, days: number = 30): Promise<{
    totalInsights: number;
    insightsByType: Record<string, number>;
    averageConfidence: number;
    usageRate: number;
  }> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const response = await this.docClient.send(new QueryCommand({
      TableName: this.insightsTable,
      KeyConditionExpression: 'userId = :userId',
      FilterExpression: 'generatedAtISO > :cutoff',
      ExpressionAttributeValues: {
        ':userId': userId,
        ':cutoff': cutoffDate.toISOString(),
      },
    }));

    const insights = (response.Items || []).map(this.mapDynamoItemToInsight);
    
    const insightsByType = insights.reduce((acc, insight) => {
      acc[insight.type] = (acc[insight.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const averageConfidence = insights.length > 0 
      ? insights.reduce((sum, insight) => sum + insight.confidence, 0) / insights.length 
      : 0;

    const usedInsights = insights.filter(i => (i as any).used).length;
    const usageRate = insights.length > 0 ? (usedInsights / insights.length) * 100 : 0;

    return {
      totalInsights: insights.length,
      insightsByType,
      averageConfidence: Math.round(averageConfidence),
      usageRate: Math.round(usageRate),
    };
  }

  private mapDynamoItemToInsight(item: any): AIInsightRecord {
    return {
      userId: item.userId,
      insightId: item.insightId,
      type: item.type,
      platform: item.platform,
      confidence: item.confidence,
      recommendation: item.recommendation,
      data: item.data,
      reasoning: item.reasoning,
      generatedAt: new Date(item.generatedAt),
      validUntil: new Date(item.validUntil),
      isActive: item.isActive,
      metadata: item.metadata || {
        aiModel: 'claude-3-sonnet',
        dataPoints: 0,
        version: '1.0',
      },
    };
  }
}