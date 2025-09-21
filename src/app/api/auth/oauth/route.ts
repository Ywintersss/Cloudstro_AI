import { NextRequest, NextResponse } from 'next/server';
import { SocialMediaRepository } from '../../../../lib/repositories/social-media.repository';

const repository = new SocialMediaRepository();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const platform = searchParams.get('platform');
    const userId = searchParams.get('userId');

    if (!platform || !userId) {
      return NextResponse.json(
        { error: 'Platform and user ID are required' },
        { status: 400 }
      );
    }

    let authUrl: string;

    switch (platform) {
      case 'twitter':
        authUrl = generateTwitterAuthUrl(userId);
        break;
      case 'facebook':
        authUrl = generateFacebookAuthUrl(userId);
        break;
      case 'youtube':
        authUrl = generateYouTubeAuthUrl(userId);
        break;
      case 'tiktok':
        authUrl = generateTikTokAuthUrl(userId);
        break;
      default:
        return NextResponse.json(
          { error: `Unsupported platform: ${platform}` },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      authUrl,
      platform,
    });

  } catch (error) {
    console.error('Error generating OAuth URL:', error);
    return NextResponse.json(
      { 
        error: 'Failed to generate OAuth URL',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

function generateTwitterAuthUrl(userId: string): string {
  const baseUrl = 'https://twitter.com/i/oauth2/authorize';
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: process.env.TWITTER_API_KEY || '',
    redirect_uri: `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/callback/twitter`,
    scope: 'tweet.read tweet.write users.read offline.access',
    state: `twitter_${userId}_${Date.now()}`,
    code_challenge: 'challenge', // In production, generate a proper PKCE challenge
    code_challenge_method: 'plain',
  });
  return `${baseUrl}?${params.toString()}`;
}

function generateFacebookAuthUrl(userId: string): string {
  const baseUrl = 'https://www.facebook.com/v18.0/dialog/oauth';
  const params = new URLSearchParams({
    client_id: process.env.FACEBOOK_APP_ID || '',
    redirect_uri: `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/callback/facebook`,
    scope: 'pages_show_list,pages_read_engagement,pages_manage_posts',
    state: `facebook_${userId}_${Date.now()}`,
    response_type: 'code',
  });
  return `${baseUrl}?${params.toString()}`;
}

function generateYouTubeAuthUrl(userId: string): string {
  const baseUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
  const params = new URLSearchParams({
    client_id: process.env.YOUTUBE_CLIENT_ID || '',
    redirect_uri: `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/callback/youtube`,
    scope: 'https://www.googleapis.com/auth/youtube.readonly https://www.googleapis.com/auth/youtube',
    response_type: 'code',
    access_type: 'offline',
    state: `youtube_${userId}_${Date.now()}`,
  });
  return `${baseUrl}?${params.toString()}`;
}

function generateTikTokAuthUrl(userId: string): string {
  const baseUrl = 'https://www.tiktok.com/auth/authorize/';
  const params = new URLSearchParams({
    client_key: process.env.TIKTOK_CLIENT_KEY || '',
    response_type: 'code',
    scope: 'user.info.basic,video.list',
    redirect_uri: `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/callback/tiktok`,
    state: `tiktok_${userId}_${Date.now()}`,
  });
  return `${baseUrl}?${params.toString()}`;
}