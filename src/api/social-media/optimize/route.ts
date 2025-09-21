import { NextRequest, NextResponse } from 'next/server';
import { BedrockAIService } from '../../../lib/services/bedrock-ai.service';

const bedrockAI = new BedrockAIService();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { content, platform, scheduledTime, userId, analysisType = 'full' } = body;

    if (!content || !platform) {
      return NextResponse.json(
        { error: 'Content and platform are required' },
        { status: 400 }
      );
    }

    const results: any = {
      content,
      platform,
      aiProvider: 'AWS Bedrock (Claude 3 Sonnet)',
      generatedAt: new Date().toISOString(),
    };

    // Generate hashtag recommendations
    if (analysisType === 'full' || analysisType === 'hashtags') {
      try {
        const existingHashtags = content.match(/#\w+/g) || [];
        const suggestedHashtags = await bedrockAI.generateHashtagRecommendations(
          content,
          platform,
          existingHashtags
        );
        results.hashtagRecommendations = suggestedHashtags;
      } catch (error) {
        console.error('Error generating hashtag recommendations:', error);
        results.hashtagRecommendations = ['#engagement', '#socialmedia'];
      }
    }

    // Predict engagement if scheduled time is provided
    if (scheduledTime && (analysisType === 'full' || analysisType === 'engagement')) {
      try {
        const engagementPrediction = await bedrockAI.predictEngagement(
          content,
          platform,
          new Date(scheduledTime)
        );
        results.engagementPrediction = engagementPrediction;
      } catch (error) {
        console.error('Error predicting engagement:', error);
        results.engagementPrediction = {
          prediction: 'medium',
          confidence: 50,
          factors: ['Unable to analyze'],
          suggestions: ['Try posting at peak hours'],
        };
      }
    }

    // Content analysis for optimization
    if (analysisType === 'full' || analysisType === 'content') {
      try {
        // Create a mock post for analysis
        const mockPost = {
          id: 'temp',
          platform,
          content,
          authorId: userId || 'user',
          authorName: 'User',
          createdAt: new Date(),
          engagement: { likes: 0, shares: 0, comments: 0, views: 0 },
          media: [],
          hashtags: content.match(/#\w+/g)?.map((h: string) => h.substring(1)) || [],
          mentions: content.match(/@\w+/g)?.map((m: string) => m.substring(1)) || [],
          url: '',
        };

        const contentAnalysis = await bedrockAI.analyzePostContent(mockPost);
        results.contentAnalysis = contentAnalysis;
      } catch (error) {
        console.error('Error analyzing content:', error);
        results.contentAnalysis = {
          sentiment: 'neutral',
          topics: ['general'],
          engagementPrediction: 'medium',
          recommendedActions: ['Add engaging visual content'],
          optimalTime: '15:00',
          suggestedHashtags: ['#content'],
        };
      }
    }

    // Generate optimization suggestions
    if (analysisType === 'full') {
      const optimizationSuggestions = [];

      // Character count optimization
      if (platform === 'twitter' && content.length > 240) {
        optimizationSuggestions.push({
          type: 'length',
          suggestion: 'Consider shortening your post for better Twitter engagement',
          priority: 'high',
        });
      }

      // Hashtag optimization
      const hashtagCount = (content.match(/#\w+/g) || []).length;
      if (hashtagCount === 0) {
        optimizationSuggestions.push({
          type: 'hashtags',
          suggestion: 'Add relevant hashtags to increase discoverability',
          priority: 'medium',
        });
      } else if (hashtagCount > 5 && platform !== 'instagram') {
        optimizationSuggestions.push({
          type: 'hashtags',
          suggestion: 'Consider reducing hashtags for better engagement on this platform',
          priority: 'medium',
        });
      }

      // Call-to-action suggestion
      if (!content.match(/\b(check|click|visit|follow|share|comment|like)\b/i)) {
        optimizationSuggestions.push({
          type: 'cta',
          suggestion: 'Add a call-to-action to encourage engagement',
          priority: 'low',
        });
      }

      results.optimizationSuggestions = optimizationSuggestions;
    }

    return NextResponse.json({
      success: true,
      data: results,
    });

  } catch (error) {
    console.error('Error optimizing content:', error);
    return NextResponse.json(
      { 
        error: 'Failed to optimize content',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const platform = searchParams.get('platform');
    
    if (!platform) {
      return NextResponse.json(
        { error: 'Platform parameter is required' },
        { status: 400 }
      );
    }

    // Return platform-specific content guidelines
    const guidelines = {
      twitter: {
        maxLength: 280,
        recommendedLength: '140-240',
        hashtagLimit: 3,
        bestTimes: ['09:00', '15:00', '19:00'],
        contentTips: [
          'Keep it concise and engaging',
          'Use trending hashtags',
          'Include images or videos',
          'Ask questions to encourage replies',
        ],
      },
      facebook: {
        maxLength: 63206,
        recommendedLength: '100-300',
        hashtagLimit: 5,
        bestTimes: ['12:00', '15:00', '18:00'],
        contentTips: [
          'Use compelling visuals',
          'Ask questions to encourage comments',
          'Share behind-the-scenes content',
          'Post when your audience is most active',
        ],
      },
      instagram: {
        maxLength: 2200,
        recommendedLength: '138-150',
        hashtagLimit: 30,
        bestTimes: ['11:00', '14:00', '17:00'],
        contentTips: [
          'High-quality visuals are essential',
          'Use relevant hashtags',
          'Tell a story in your caption',
          'Leverage Instagram Stories and Reels',
        ],
      },
      rednote: {
        maxLength: 1000,
        recommendedLength: '50-200',
        hashtagLimit: 10,
        bestTimes: ['12:00', '18:00', '21:00'],
        contentTips: [
          'Focus on lifestyle and aesthetic content',
          'Use beautiful, high-quality images',
          'Include location tags',
          'Share personal experiences and tips',
        ],
      },
      tiktok: {
        maxLength: 4000,
        recommendedLength: '100-300',
        hashtagLimit: 5,
        bestTimes: ['18:00', '20:00', '22:00'],
        contentTips: [
          'Create engaging video content',
          'Use trending sounds and effects',
          'Keep videos short and entertaining',
          'Post consistently',
        ],
      },
    };

    const platformGuidelines = guidelines[platform as keyof typeof guidelines];
    
    if (!platformGuidelines) {
      return NextResponse.json(
        { error: 'Unsupported platform' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        platform,
        guidelines: platformGuidelines,
        aiProvider: 'AWS Bedrock',
      },
    });

  } catch (error) {
    console.error('Error fetching platform guidelines:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch platform guidelines',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}