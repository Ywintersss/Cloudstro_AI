import { NextRequest, NextResponse } from 'next/server';
import { SocialMediaManager } from '../../../../lib/services/social-media-manager';

const socialMediaManager = new SocialMediaManager();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');
    const platforms = searchParams.get('platforms')?.split(',') || ['twitter'];
    const count = parseInt(searchParams.get('count') || '50');

    if (!query) {
      return NextResponse.json(
        { error: 'Search query is required' },
        { status: 400 }
      );
    }

    const posts = await socialMediaManager.searchPosts(query, platforms, count);

    return NextResponse.json({
      success: true,
      data: posts,
      query,
      platforms,
      count: posts.length,
    });

  } catch (error) {
    console.error('Error searching social media posts:', error);
    return NextResponse.json(
      { 
        error: 'Failed to search social media posts',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}