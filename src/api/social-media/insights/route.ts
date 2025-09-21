import { NextRequest, NextResponse } from 'next/server';
import { AIInsightsRepository } from '../../../lib/repositories/ai-insights.repository';

const aiInsightsRepo = new AIInsightsRepository();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const type = searchParams.get('type');
    const platform = searchParams.get('platform');
    const limit = parseInt(searchParams.get('limit') || '10');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    let insights;

    if (type) {
      // Get insights by type
      insights = await aiInsightsRepo.getUserInsightsByType(userId, type, limit);
    } else if (platform) {
      // Get insights by platform
      insights = await aiInsightsRepo.getInsightsByPlatform(userId, platform, limit);
    } else {
      // Get all recent insights
      insights = await aiInsightsRepo.getUserInsights(userId, limit);
    }

    return NextResponse.json({
      success: true,
      insights,
      count: insights.length,
      retrievedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error retrieving AI insights:', error);
    return NextResponse.json(
      { 
        error: 'Failed to retrieve AI insights',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, insightId } = body;

    if (!userId || !insightId) {
      return NextResponse.json(
        { error: 'User ID and Insight ID are required' },
        { status: 400 }
      );
    }

    // Mark insight as used
    await aiInsightsRepo.markInsightAsUsed(userId, insightId);

    return NextResponse.json({
      success: true,
      message: 'Insight marked as used successfully',
      updatedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error marking AI insight as used:', error);
    return NextResponse.json(
      { 
        error: 'Failed to mark AI insight as used',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}