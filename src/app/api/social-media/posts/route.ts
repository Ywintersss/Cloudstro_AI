import { NextRequest, NextResponse } from 'next/server';
import { SocialMediaManager } from '../../../../lib/services/social-media-manager';
import { PostRepository } from '../../../../lib/repositories/post.repository';
import { SocialMediaRepository } from '../../../../lib/repositories/social-media.repository';
import { MockDataService } from '../../../../lib/services/mock-data.service';
import { mockConfig } from '../../../../config/development';
import { SocialMediaAccount } from '../../../../types/social-media';

const socialMediaManager = new SocialMediaManager();
const postRepository = new PostRepository();
const socialMediaRepository = new SocialMediaRepository();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const platform = searchParams.get('platform');
    const accountId = searchParams.get('accountId');
    const count = parseInt(searchParams.get('count') || '50');
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // First, try to get posts from DynamoDB
    let posts;
    try {
      if (platform) {
        posts = await postRepository.getPostsByPlatform(userId, platform, count);
      } else {
        posts = await postRepository.getPostsByUser(userId, count);
      }
      
      // If we have posts in DynamoDB, return them
      if (posts && posts.length > 0) {
        return NextResponse.json({
          success: true,
          data: posts,
          count: posts.length,
          source: 'dynamodb',
        });
      }
    } catch (error) {
      console.log('DynamoDB posts not available, falling back to mock data:', error);
    }

    // Fallback to mock/API data if no posts in DynamoDB
    try {
      // Get user's connected accounts
      const accounts = await socialMediaRepository.getAccountsByUser(userId);
      
      if (platform && accountId) {
        // Get posts from specific platform
        posts = await socialMediaManager.getPostsByPlatform(platform, accountId, count);
      } else {
        // Get posts from all connected accounts
        posts = await socialMediaManager.getAllPosts(accounts, count);
      }

      return NextResponse.json({
        success: true,
        data: posts,
        count: posts.length,
        source: 'api',
      });
    } catch (error) {
      console.error('Error fetching posts:', error);
      return NextResponse.json(
        { error: 'Failed to fetch posts' },
        { status: 500 }
      );
    }

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
    const { 
      content, 
      platforms, 
      mediaUrl, 
      userId, 
      action = 'post', // 'post' or 'populate_demo'
      postsPerPlatform = 15 
    } = body;

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Handle demo data population
    if (action === 'populate_demo') {
      if (!mockConfig.enabled) {
        return NextResponse.json(
          { error: 'Demo mode not enabled' },
          { status: 403 }
        );
      }

      const targetPlatforms = platforms || ['twitter', 'facebook', 'youtube', 'tiktok'];
      const savedPosts = [];
      let totalPosts = 0;

      // Generate and save posts for each platform
      for (const platform of targetPlatforms) {
        try {
          console.log(`Generating ${postsPerPlatform} posts for ${platform}...`);
          const mockPosts = MockDataService.generateMockPosts(platform, postsPerPlatform);
          
          for (const post of mockPosts) {
            try {
              const savedPost = await postRepository.createPost(userId, post);
              savedPosts.push(savedPost);
              totalPosts++;
            } catch (error) {
              console.error(`Failed to save post for ${platform}:`, error);
            }
          }
        } catch (error) {
          console.error(`Failed to generate posts for ${platform}:`, error);
        }
      }

      return NextResponse.json({
        success: true,
        message: 'Demo posts created successfully in DynamoDB',
        totalPosts,
        platforms: targetPlatforms.length,
        postsPerPlatform,
        storedInDB: true,
        samplePosts: savedPosts.slice(0, 5), // Return first 5 for verification
      });
    }

    // Handle actual posting to social media
    if (!content || !platforms) {
      return NextResponse.json(
        { error: 'Content and platforms are required for posting' },
        { status: 400 }
      );
    }

    // Get user's connected accounts
    const accounts = await socialMediaRepository.getAccountsByUser(userId);
    const results = await socialMediaManager.postToMultiplePlatforms(
      content,
      platforms,
      accounts,
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
    console.error('Error in POST /api/social-media/posts:', error);
    return NextResponse.json(
      { 
        error: 'Failed to process request',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}