import { NextRequest, NextResponse } from 'next/server';
import { DashboardAnalyticsService } from '../../../../lib/services/dashboard-analytics.service';
import jwt from 'jsonwebtoken';

const dashboardAnalytics = new DashboardAnalyticsService();

// Helper function to verify authentication
async function verifyAuth(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value;

    if (!token) {
      return { success: false, error: 'No authentication token found' };
    }

    const jwtSecret = process.env.JWT_SECRET || 'your-secret-key';
    const decoded = jwt.verify(token, jwtSecret) as any;

    return {
      success: true,
      user: {
        userId: decoded.userId,
        email: decoded.email,
        username: decoded.username,
        subscription: decoded.subscription,
      }
    };
  } catch (error) {
    return { success: false, error: 'Invalid authentication token' };
  }
}

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const authResult = await verifyAuth(request);
    
    const { searchParams } = new URL(request.url);
    const timeRange = parseInt(searchParams.get('timeRange') || '30');
    
    let analytics;
    
    if (!authResult.success) {
      // If not authenticated, provide demo analytics data
      analytics = {
        totalPosts: 24,
        engagementRate: 4.2,
        topHashtags: ['#CloudStro', '#AI', '#SocialMedia', '#Analytics', '#Tech'],
        bestPostingTime: '3:00 PM',
        bestPostingDay: 'Wednesday',
        averageEngagement: 156,
        totalReach: 12500,
        regionStats: [
          { region: 'Asia-Pacific', percentage: 45 },
          { region: 'North America', percentage: 30 },
          { region: 'Europe', percentage: 20 },
          { region: 'Others', percentage: 5 }
        ],
        platformStats: [
          { platform: 'Twitter', posts: 8, engagement: 180 },
          { platform: 'Facebook', posts: 6, engagement: 145 },
          { platform: 'YouTube', posts: 5, engagement: 220 },
          { platform: 'TikTok', posts: 5, engagement: 165 }
        ],
        recentActivity: [
          { date: '2025-09-20', posts: 3, engagement: 245 },
          { date: '2025-09-19', posts: 2, engagement: 189 },
          { date: '2025-09-18', posts: 4, engagement: 312 },
          { date: '2025-09-17', posts: 1, engagement: 98 },
          { date: '2025-09-16', posts: 3, engagement: 205 }
        ]
      };
    } else {
      // If authenticated, get real user analytics
      const userId = authResult.user!.userId;
      analytics = await dashboardAnalytics.getDashboardAnalytics(userId, timeRange);
    }

    return NextResponse.json({
      success: true,
      data: analytics,
      isDemoData: !authResult.success
    });

  } catch (error) {
    console.error('Dashboard analytics error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard analytics' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const authResult = await verifyAuth(request);
    if (!authResult.success) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { action, timeRange = 30 } = body;
    const userId = authResult.user!.userId;

    switch (action) {
      case 'getPostsCount':
        const postsCount = await dashboardAnalytics.getPostsCount(userId);
        return NextResponse.json({
          success: true,
          data: { totalPosts: postsCount }
        });

      case 'getEngagementTrend':
        const trend = await dashboardAnalytics.getEngagementTrend(userId, timeRange);
        return NextResponse.json({
          success: true,
          data: trend
        });

      case 'getFullAnalytics':
        const analytics = await dashboardAnalytics.getDashboardAnalytics(userId, timeRange);
        return NextResponse.json({
          success: true,
          data: analytics
        });

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('Dashboard analytics POST error:', error);
    return NextResponse.json(
      { error: 'Failed to process analytics request' },
      { status: 500 }
    );
  }
}