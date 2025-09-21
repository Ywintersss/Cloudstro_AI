import { NextRequest, NextResponse } from 'next/server';
import { SocialMediaManager } from '../../../../lib/services/social-media-manager';
import { BedrockAIService } from '../../../../lib/services/bedrock-ai.service';
import { AIInsightsRepository } from '../../../../lib/repositories/ai-insights.repository';
import { SocialMediaAccount } from '../../../../types/social-media';

const socialMediaManager = new SocialMediaManager();
const bedrockAI = new BedrockAIService();
const aiInsightsRepo = new AIInsightsRepository();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, timeRange = 30 } = body; // timeRange in days

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Mock accounts - in real implementation, fetch from DynamoDB
    const mockAccounts: SocialMediaAccount[] = [
      {
        id: '1',
        platform: 'twitter',
        accountId: 'example_user',
        accountName: 'Example User',
        accountHandle: 'example_user',
        accessToken: 'mock_token',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    // Fetch posts from the specified time range
    const posts = await socialMediaManager.getAllPosts(mockAccounts, 200);
    
    // Filter posts by time range
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - timeRange);
    const recentPosts = posts.filter(post => post.createdAt >= cutoffDate);

    // Calculate basic engagement metrics
    const metrics = socialMediaManager.calculateEngagementMetrics(recentPosts);
    
    // Use AWS Bedrock for AI-powered insights
    const aiInsights = [];
    
    // Generate optimal timing insights for each platform
    const platforms = [...new Set(recentPosts.map(post => post.platform))];
    for (const platform of platforms) {
      try {
        const timingInsight = await bedrockAI.generateOptimalTimingInsights(recentPosts, platform);
        aiInsights.push(timingInsight);
        
        // Store timing insights in DynamoDB
        if (timingInsight && typeof timingInsight === 'object' && 'type' in timingInsight) {
          await aiInsightsRepo.saveInsight(userId, timingInsight as any);
        }
      } catch (error) {
        console.error(`Error generating timing insights for ${platform}:`, error);
      }
    }

    // Generate content strategy insights
    try {
      const contentInsights = await bedrockAI.generateContentStrategyInsights(recentPosts, metrics);
      aiInsights.push(...contentInsights);
      
      // Store content strategy insights in DynamoDB
      if (Array.isArray(contentInsights) && contentInsights.length > 0) {
        for (const insight of contentInsights) {
          if (insight && typeof insight === 'object' && 'type' in insight) {
            await aiInsightsRepo.saveInsight(userId, insight as any);
          }
        }
      }
    } catch (error) {
      console.error('Error generating content strategy insights:', error);
    }

    // Generate cross-platform strategy
    try {
      const crossPlatformInsight = await bedrockAI.generateCrossPlataformStrategy(recentPosts);
      aiInsights.push(crossPlatformInsight);
      
      // Store cross-platform strategy in DynamoDB
      if (crossPlatformInsight && typeof crossPlatformInsight === 'object' && 'type' in crossPlatformInsight) {
        await aiInsightsRepo.saveInsight(userId, crossPlatformInsight as any);
      }
    } catch (error) {
      console.error('Error generating cross-platform strategy:', error);
    }

    // Analyze top performing posts with AI
    const topPosts = recentPosts
      .sort((a, b) => {
        const aEng = a.engagement.likes + a.engagement.shares + a.engagement.comments;
        const bEng = b.engagement.likes + b.engagement.shares + b.engagement.comments;
        return bEng - aEng;
      })
      .slice(0, 5);

    const postAnalyses = [];
    for (const post of topPosts) {
      try {
        const analysis = await bedrockAI.analyzePostContent(post);
        postAnalyses.push({
          postId: post.id,
          platform: post.platform,
          content: post.content.substring(0, 100) + '...',
          engagement: post.engagement,
          analysis,
        });
      } catch (error) {
        console.error(`Error analyzing post ${post.id}:`, error);
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        metrics,
        aiInsights,
        topPostsAnalysis: postAnalyses,
        analyzedPosts: recentPosts.length,
        timeRange: `${timeRange} days`,
        generatedAt: new Date().toISOString(),
        aiProvider: 'AWS Bedrock (Claude 3 Sonnet)',
      },
    });

  } catch (error) {
    console.error('Error analyzing social media performance:', error);
    return NextResponse.json(
      { 
        error: 'Failed to analyze social media performance',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}