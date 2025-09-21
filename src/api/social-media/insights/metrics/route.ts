import { NextRequest, NextResponse } from 'next/server';
import { AIInsightsRepository, AIInsightRecord } from '../../../../lib/repositories/ai-insights.repository';

const aiInsightsRepo = new AIInsightsRepository();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const days = parseInt(searchParams.get('days') || '30');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Get insight metrics for the specified time period
    const metrics = await aiInsightsRepo.getInsightMetrics(userId, days);

    // Get active insights
    const activeInsights = await aiInsightsRepo.getActiveInsights(userId);

    // Get recent insights for trend analysis
    const recentInsights = await aiInsightsRepo.getUserInsights(userId, 50);

    // Calculate additional metrics
    const insightTypes = recentInsights.reduce((acc: Record<string, number>, insight: AIInsightRecord) => {
      acc[insight.type] = (acc[insight.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const platformDistribution = recentInsights.reduce((acc: Record<string, number>, insight: AIInsightRecord) => {
      if (insight.platform) {
        acc[insight.platform] = (acc[insight.platform] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    const averageConfidence = recentInsights.length > 0 
      ? recentInsights.reduce((sum: number, insight: AIInsightRecord) => sum + insight.confidence, 0) / recentInsights.length 
      : 0;

    return NextResponse.json({
      success: true,
      data: {
        timeframe: `${days} days`,
        baseMetrics: metrics,
        overview: {
          totalInsights: recentInsights.length,
          activeInsights: activeInsights.length,
          averageConfidence: Math.round(averageConfidence * 100) / 100,
          insightTypes,
          platformDistribution
        },
        trends: {
          dailyInsights: calculateDailyTrends(recentInsights, days),
          topPerformingTypes: Object.entries(insightTypes)
            .sort(([,a], [,b]) => (b as number) - (a as number))
            .slice(0, 5),
          confidenceDistribution: calculateConfidenceDistribution(recentInsights)
        },
        generatedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Error retrieving AI insight metrics:', error);
    return NextResponse.json(
      { 
        error: 'Failed to retrieve AI insight metrics',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

function calculateDailyTrends(insights: AIInsightRecord[], days: number) {
  const dailyCount: Record<string, number> = {};
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  insights.forEach(insight => {
    const date = new Date(insight.generatedAt);
    if (date >= cutoffDate) {
      const dateKey = date.toISOString().split('T')[0];
      dailyCount[dateKey] = (dailyCount[dateKey] || 0) + 1;
    }
  });

  return Object.entries(dailyCount)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, count]) => ({ date, count }));
}

function calculateConfidenceDistribution(insights: AIInsightRecord[]) {
  const ranges = {
    'High (0.8-1.0)': 0,
    'Medium (0.6-0.8)': 0,
    'Low (0.4-0.6)': 0,
    'Very Low (0.0-0.4)': 0
  };

  insights.forEach(insight => {
    const confidence = insight.confidence;
    if (confidence >= 0.8) ranges['High (0.8-1.0)']++;
    else if (confidence >= 0.6) ranges['Medium (0.6-0.8)']++;
    else if (confidence >= 0.4) ranges['Low (0.4-0.6)']++;
    else ranges['Very Low (0.0-0.4)']++;
  });

  return ranges;
}