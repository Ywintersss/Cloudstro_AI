import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";
import { SocialMediaPost, PlatformMetrics } from '../../types/social-media';

export interface AIInsight {
  type: 'optimal_timing' | 'content_strategy' | 'engagement_prediction' | 'hashtag_optimization' | 'cross_platform_strategy';
  platform?: string;
  confidence: number;
  recommendation: string;
  data: any;
  reasoning: string;
}

export interface ContentAnalysis {
  sentiment: 'positive' | 'negative' | 'neutral';
  topics: string[];
  engagementPrediction: 'high' | 'medium' | 'low';
  recommendedActions: string[];
  optimalTime: string;
  suggestedHashtags: string[];
}

export class BedrockAIService {
  private bedrockClient: BedrockRuntimeClient;
  private claudeModelId: string;
  private titanModelId: string;

  constructor() {
    this.bedrockClient = new BedrockRuntimeClient({ 
      region: process.env.REGION_2,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      }
    });
    this.claudeModelId = "anthropic.claude-3-sonnet-20240229-v1:0";
    this.titanModelId = "amazon.titan-text-express-v1";
  }

  async analyzePostContent(post: SocialMediaPost): Promise<ContentAnalysis> {
    const prompt = `
Analyze this social media post for engagement optimization:

Platform: ${post.platform}
Content: "${post.content}"
Current Engagement: ${post.engagement.likes} likes, ${post.engagement.shares} shares, ${post.engagement.comments} comments
Hashtags: ${post.hashtags.join(', ')}
Posted at: ${post.createdAt.toISOString()}

Please provide:
1. Sentiment analysis (positive/negative/neutral)
2. Main topics/themes (max 5)
3. Engagement prediction (high/medium/low) with reasoning
4. Recommended actions to improve engagement
5. Optimal posting time based on content type
6. Suggested hashtags for better reach

Respond in JSON format:
{
  "sentiment": "positive|negative|neutral",
  "topics": ["topic1", "topic2"],
  "engagementPrediction": "high|medium|low",
  "reasoning": "explanation for prediction",
  "recommendedActions": ["action1", "action2"],
  "optimalTime": "HH:MM",
  "suggestedHashtags": ["#hashtag1", "#hashtag2"]
}`;

    try {
      const response = await this.invokeClaudeModel(prompt);
      return JSON.parse(response);
    } catch (error) {
      console.error('Error analyzing post content:', error);
      // Fallback analysis
      return {
        sentiment: 'neutral',
        topics: post.hashtags.slice(0, 3),
        engagementPrediction: 'medium',
        recommendedActions: ['Add more hashtags', 'Include visual content'],
        optimalTime: '15:00',
        suggestedHashtags: ['#engagement', '#socialmedia'],
      };
    }
  }

  async generateOptimalTimingInsights(posts: SocialMediaPost[], platform: string): Promise<AIInsight> {
    const postData = posts
      .filter(p => p.platform === platform)
      .map(p => ({
        hour: p.createdAt.getHours(),
        day: p.createdAt.getDay(),
        engagement: p.engagement.likes + p.engagement.shares + p.engagement.comments,
        content: p.content.substring(0, 100),
      }));

    const prompt = `
Analyze these ${platform} posts to determine optimal posting times:

Post Data:
${JSON.stringify(postData, null, 2)}

Please analyze:
1. Best hours of the day to post (considering engagement patterns)
2. Best days of the week
3. Content type vs timing correlations
4. Seasonal/weekly patterns
5. Confidence level of recommendations

Provide specific recommendations for maximizing engagement on ${platform}.

Respond in JSON format:
{
  "optimalHours": ["09:00", "15:00", "19:00"],
  "optimalDays": ["Monday", "Wednesday", "Friday"],
  "reasoning": "detailed explanation",
  "confidence": 85,
  "additionalInsights": ["insight1", "insight2"]
}`;

    try {
      const response = await this.invokeClaudeModel(prompt);
      const analysis = JSON.parse(response);
      
      return {
        type: 'optimal_timing',
        platform,
        confidence: analysis.confidence,
        recommendation: `Best times to post on ${platform}: ${analysis.optimalHours.join(', ')}`,
        data: analysis,
        reasoning: analysis.reasoning,
      };
    } catch (error) {
      console.error('Error generating timing insights:', error);
      return this.getFallbackTimingInsight(platform);
    }
  }

  async generateContentStrategyInsights(posts: SocialMediaPost[], metrics: PlatformMetrics[]): Promise<AIInsight[]> {
    const platformData = metrics.map(metric => ({
      platform: metric.platform,
      totalPosts: metric.totalPosts,
      avgEngagement: metric.averageEngagementRate,
      topHashtags: metric.topHashtags,
      trend: metric.engagementTrend,
    }));

    const topPosts = posts
      .sort((a, b) => {
        const aEng = a.engagement.likes + a.engagement.shares + a.engagement.comments;
        const bEng = b.engagement.likes + b.engagement.shares + b.engagement.comments;
        return bEng - aEng;
      })
      .slice(0, 10)
      .map(p => ({
        platform: p.platform,
        content: p.content.substring(0, 150),
        engagement: p.engagement.likes + p.engagement.shares + p.engagement.comments,
        hashtags: p.hashtags,
      }));

    const prompt = `
Analyze social media performance across platforms and generate strategic insights:

Platform Metrics:
${JSON.stringify(platformData, null, 2)}

Top Performing Posts:
${JSON.stringify(topPosts, null, 2)}

Generate insights for:
1. Content strategy recommendations per platform
2. Cross-platform optimization opportunities
3. Hashtag strategy improvements
4. Engagement rate improvement tactics
5. Content type recommendations

For each insight, provide:
- Platform (if specific)
- Confidence level (0-100)
- Specific recommendation
- Reasoning
- Expected impact

Respond in JSON format with array of insights:
{
  "insights": [
    {
      "type": "content_strategy",
      "platform": "twitter",
      "confidence": 90,
      "recommendation": "specific recommendation",
      "reasoning": "why this will work",
      "expectedImpact": "25% engagement increase"
    }
  ]
}`;

    try {
      const response = await this.invokeClaudeModel(prompt);
      const analysis = JSON.parse(response);
      
      return analysis.insights.map((insight: any) => ({
        type: insight.type,
        platform: insight.platform,
        confidence: insight.confidence,
        recommendation: insight.recommendation,
        data: { expectedImpact: insight.expectedImpact },
        reasoning: insight.reasoning,
      }));
    } catch (error) {
      console.error('Error generating content strategy insights:', error);
      return this.getFallbackContentInsights();
    }
  }

  async generateHashtagRecommendations(content: string, platform: string, existingHashtags: string[]): Promise<string[]> {
    const prompt = `
Generate optimal hashtags for this ${platform} post:

Content: "${content}"
Existing hashtags: ${existingHashtags.join(', ')}

Requirements:
- Maximum 10 hashtags for ${platform}
- Mix of popular and niche hashtags
- Relevant to content and trending topics
- Platform-specific best practices
- Avoid overused generic hashtags

Return only the hashtag list in JSON format:
{
  "hashtags": ["#hashtag1", "#hashtag2", "#hashtag3"]
}`;

    try {
      const response = await this.invokeClaudeModel(prompt);
      const result = JSON.parse(response);
      return result.hashtags || [];
    } catch (error) {
      console.error('Error generating hashtag recommendations:', error);
      return ['#engagement', '#socialmedia', '#content'];
    }
  }

  async predictEngagement(content: string, platform: string, scheduledTime: Date): Promise<{
    prediction: 'high' | 'medium' | 'low';
    confidence: number;
    factors: string[];
    suggestions: string[];
  }> {
    const hour = scheduledTime.getHours();
    const day = scheduledTime.getDay();
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    const prompt = `
Predict engagement for this social media post:

Platform: ${platform}
Content: "${content}"
Scheduled for: ${dayNames[day]} at ${hour}:00
Content length: ${content.length} characters

Analyze:
1. Content quality and appeal
2. Timing effectiveness
3. Platform-specific factors
4. Predicted engagement level (high/medium/low)
5. Key factors influencing prediction
6. Suggestions for improvement

Respond in JSON format:
{
  "prediction": "high|medium|low",
  "confidence": 85,
  "factors": ["factor1", "factor2"],
  "suggestions": ["suggestion1", "suggestion2"],
  "reasoning": "detailed explanation"
}`;

    try {
      const response = await this.invokeClaudeModel(prompt);
      const result = JSON.parse(response);
      return {
        prediction: result.prediction,
        confidence: result.confidence,
        factors: result.factors,
        suggestions: result.suggestions,
      };
    } catch (error) {
      console.error('Error predicting engagement:', error);
      return {
        prediction: 'medium',
        confidence: 50,
        factors: ['Unknown factors'],
        suggestions: ['Add more engaging content'],
      };
    }
  }

  async generateCrossPlataformStrategy(userPosts: SocialMediaPost[]): Promise<AIInsight> {
    const platformData = userPosts.reduce((acc, post) => {
      if (!acc[post.platform]) {
        acc[post.platform] = { posts: [], totalEngagement: 0 };
      }
      acc[post.platform].posts.push(post);
      acc[post.platform].totalEngagement += post.engagement.likes + post.engagement.shares + post.engagement.comments;
      return acc;
    }, {} as any);

    const prompt = `
Analyze cross-platform social media strategy:

Platform Performance:
${JSON.stringify(Object.keys(platformData).map(platform => ({
  platform,
  postCount: platformData[platform].posts.length,
  totalEngagement: platformData[platform].totalEngagement,
  avgEngagement: platformData[platform].totalEngagement / platformData[platform].posts.length,
  topContent: platformData[platform].posts
    .sort((a: any, b: any) => (b.engagement.likes + b.engagement.shares + b.engagement.comments) - (a.engagement.likes + a.engagement.shares + a.engagement.comments))
    .slice(0, 3)
    .map((p: any) => ({ content: p.content.substring(0, 100), engagement: p.engagement.likes + p.engagement.shares + p.engagement.comments }))
})), null, 2)}

Provide strategy recommendations for:
1. Content adaptation across platforms
2. Timing optimization per platform
3. Cross-platform content repurposing
4. Platform-specific strengths to leverage
5. Overall engagement improvement strategy

Respond in JSON format:
{
  "strategy": "overall strategic recommendation",
  "platformSpecific": {
    "twitter": "specific strategy for twitter",
    "facebook": "specific strategy for facebook"
  },
  "crossPlatformOpportunities": ["opportunity1", "opportunity2"],
  "confidence": 88,
  "expectedImpact": "30% overall engagement increase"
}`;

    try {
      const response = await this.invokeClaudeModel(prompt);
      const analysis = JSON.parse(response);
      
      return {
        type: 'cross_platform_strategy',
        confidence: analysis.confidence,
        recommendation: analysis.strategy,
        data: {
          platformSpecific: analysis.platformSpecific,
          opportunities: analysis.crossPlatformOpportunities,
          expectedImpact: analysis.expectedImpact,
        },
        reasoning: 'Based on cross-platform performance analysis and content optimization opportunities',
      };
    } catch (error) {
      console.error('Error generating cross-platform strategy:', error);
      return this.getFallbackCrossPlatformInsight();
    }
  }

  private async invokeClaudeModel(prompt: string): Promise<string> {
    const command = new InvokeModelCommand({
      modelId: this.claudeModelId,
      contentType: "application/json",
      accept: "application/json",
      body: JSON.stringify({
        anthropic_version: "bedrock-2023-05-31",
        max_tokens: 4000,
        messages: [
          {
            role: "user",
            content: prompt
          }
        ]
      }),
    });

    const response = await this.bedrockClient.send(command);
    const responseBody = JSON.parse(Buffer.from(response.body).toString("utf-8"));
    return responseBody.content[0].text;
  }

  private getFallbackTimingInsight(platform: string): AIInsight {
    const timingData = {
      twitter: { hours: ['09:00', '15:00', '19:00'], confidence: 75 },
      facebook: { hours: ['12:00', '15:00', '18:00'], confidence: 70 },
      instagram: { hours: ['11:00', '14:00', '17:00'], confidence: 80 },
      rednote: { hours: ['12:00', '18:00', '21:00'], confidence: 65 },
      tiktok: { hours: ['18:00', '20:00', '22:00'], confidence: 70 },
    };

    const data = timingData[platform as keyof typeof timingData] || { hours: ['12:00', '18:00'], confidence: 60 };

    return {
      type: 'optimal_timing',
      platform,
      confidence: data.confidence,
      recommendation: `Based on general patterns, post on ${platform} at ${data.hours.join(', ')} for better engagement`,
      data: { optimalHours: data.hours },
      reasoning: 'Fallback recommendation based on platform best practices',
    };
  }

  private getFallbackContentInsights(): AIInsight[] {
    return [
      {
        type: 'content_strategy',
        confidence: 70,
        recommendation: 'Focus on visual content with engaging captions to increase engagement rates',
        data: { expectedImpact: '15-20% engagement increase' },
        reasoning: 'Visual content consistently performs better across all social media platforms',
      },
      {
        type: 'hashtag_optimization',
        confidence: 75,
        recommendation: 'Use a mix of 3-5 relevant hashtags per post, combining trending and niche tags',
        data: { expectedImpact: '10-15% reach increase' },
        reasoning: 'Balanced hashtag strategy improves discoverability without appearing spammy',
      },
    ];
  }

  private getFallbackCrossPlatformInsight(): AIInsight {
    return {
      type: 'cross_platform_strategy',
      confidence: 65,
      recommendation: 'Adapt content format for each platform while maintaining consistent brand message',
      data: {
        platformSpecific: {
          twitter: 'Keep posts concise and use trending hashtags',
          facebook: 'Use longer form content with engaging visuals',
          instagram: 'Focus on high-quality images and Stories',
          rednote: 'Create lifestyle-oriented content with beautiful imagery',
        },
        opportunities: ['Repurpose high-performing content', 'Cross-promote between platforms'],
        expectedImpact: '20-25% overall engagement improvement',
      },
      reasoning: 'Platform-specific optimization while maintaining brand consistency',
    };
  }
}