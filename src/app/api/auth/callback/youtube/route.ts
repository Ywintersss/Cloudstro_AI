import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { SocialMediaRepository } from '../../../../../lib/repositories/social-media.repository';

const repository = new SocialMediaRepository();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');

    if (error) {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?error=${error}`);
    }

    if (!code || !state) {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?error=missing_code_or_state`);
    }

    // Extract user ID from state
    const [platform, userId] = state.split('_');
    
    if (!userId) {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?error=invalid_state`);
    }

    // Exchange code for access token
    const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', {
      client_id: process.env.YOUTUBE_CLIENT_ID,
      client_secret: process.env.YOUTUBE_CLIENT_SECRET,
      redirect_uri: `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/callback/youtube`,
      code,
      grant_type: 'authorization_code',
    });

    const { access_token, refresh_token } = tokenResponse.data;

    // Get user channel information
    const channelResponse = await axios.get('https://www.googleapis.com/youtube/v3/channels', {
      params: {
        part: 'id,snippet',
        mine: true,
      },
      headers: {
        Authorization: `Bearer ${access_token}`,
      }
    });

    const channels = channelResponse.data.items || [];
    
    if (channels.length === 0) {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?error=no_youtube_channel`);
    }

    // Save the YouTube channel account
    const channel = channels[0];
    await repository.createAccount(userId, {
      platform: 'youtube',
      accountId: channel.id,
      accountName: channel.snippet.title,
      accessToken: access_token,
      refreshToken: refresh_token,
      isActive: true,
    });

    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?success=youtube_connected`);

  } catch (error) {
    console.error('YouTube OAuth callback error:', error);
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?error=oauth_failed`);
  }
}