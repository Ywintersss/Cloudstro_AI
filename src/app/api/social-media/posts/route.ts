import { NextRequest, NextResponse } from 'next/server';
import { SocialMediaManager } from '../../../../lib/services/social-media-manager';
import { SocialMediaAccount } from '../../../../types/social-media';

const socialMediaManager = new SocialMediaManager();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const platform = searchParams.get('platform');
    const accountId = searchParams.get('accountId');
    const count = parseInt(searchParams.get('count') || '50');
    const userId = searchParams.get('userId'); // For filtering user's accounts

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // In a real implementation, you'd fetch user's connected accounts from DynamoDB
    // For now, we'll use mock data
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
      // Add more mock accounts as needed
    ];

    let posts;

    if (platform && accountId) {
      // Get posts from specific platform
      posts = await socialMediaManager.getPostsByPlatform(platform, accountId, count);
    } else {
      // Get posts from all connected accounts
      posts = await socialMediaManager.getAllPosts(mockAccounts, count);
    }

    return NextResponse.json({
      success: true,
      data: posts,
      count: posts.length,
    });

  } catch (error) {
    console.error('Error fetching social media posts:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch social media posts',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { content, platforms, mediaUrl, userId } = body;

    if (!content || !platforms || !userId) {
      return NextResponse.json(
        { error: 'Content, platforms, and user ID are required' },
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

    const results = await socialMediaManager.postToMultiplePlatforms(
      content,
      platforms,
      mockAccounts,
      mediaUrl
    );

    const successful = results.filter(r => r.postId);
    const failed = results.filter(r => r.error);

    return NextResponse.json({
      success: true,
      results,
      summary: {
        total: results.length,
        successful: successful.length,
        failed: failed.length,
      },
    });

  } catch (error) {
    console.error('Error posting to social media:', error);
    return NextResponse.json(
      { 
        error: 'Failed to post to social media',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}