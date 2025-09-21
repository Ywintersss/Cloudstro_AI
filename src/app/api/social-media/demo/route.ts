import { NextRequest, NextResponse } from 'next/server';
import { SocialMediaManager } from '../../../../lib/services/social-media-manager';
import { MockDataService } from '../../../../lib/services/mock-data.service';
import { mockConfig } from '../../../../config/development';

const socialMediaManager = new SocialMediaManager();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const platform = searchParams.get('platform') || 'twitter';
    const count = parseInt(searchParams.get('count') || '10');

    // Check if this is development/demo mode
    if (!mockConfig.enabled) {
      return NextResponse.json(
        { error: 'Demo data only available in development mode' },
        { status: 403 }
      );
    }

    // Generate comprehensive demo data
    const demoData = {
      posts: MockDataService.generateMockPosts(platform, count),
      metrics: MockDataService.generateMockMetrics(platform),
      insights: MockDataService.generateAnalyticsInsights(platform),
      accounts: MockDataService.generateMockAccounts('demo_user'),
      summary: {
        totalPosts: Math.floor(Math.random() * 1000) + 100,
        totalEngagement: Math.floor(Math.random() * 50000) + 10000,
        avgEngagementRate: (Math.random() * 5 + 1).toFixed(2) + '%',
        topPlatform: platform,
        lastUpdated: new Date().toISOString()
      }
    };

    return NextResponse.json({
      message: 'Demo data generated successfully',
      data: demoData,
      platform,
      demoMode: true
    });

  } catch (error) {
    console.error('Error generating demo data:', error);
    return NextResponse.json(
      { error: 'Failed to generate demo data' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { platforms = ['twitter', 'facebook', 'youtube', 'tiktok'] } = await request.json();

    // Check if this is development/demo mode
    if (!mockConfig.enabled) {
      return NextResponse.json(
        { error: 'Demo data only available in development mode' },
        { status: 403 }
      );
    }

    // Generate data for multiple platforms
    const multiPlatformData: any = {};
    
    for (const platform of platforms) {
      multiPlatformData[platform] = {
        posts: MockDataService.generateMockPosts(platform, 5),
        metrics: MockDataService.generateMockMetrics(platform),
        insights: MockDataService.generateAnalyticsInsights(platform)
      };
    }

    return NextResponse.json({
      message: 'Multi-platform demo data generated successfully',
      data: multiPlatformData,
      platforms,
      demoMode: true
    });

  } catch (error) {
    console.error('Error generating multi-platform demo data:', error);
    return NextResponse.json(
      { error: 'Failed to generate demo data' },
      { status: 500 }
    );
  }
}