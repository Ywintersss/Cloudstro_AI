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
    const tokenResponse = await axios.post('https://open-api.tiktok.com/platform/oauth/token/', {
      client_key: process.env.TIKTOK_CLIENT_KEY,
      client_secret: process.env.TIKTOK_CLIENT_SECRET,
      code,
      grant_type: 'authorization_code',
      redirect_uri: `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/callback/tiktok`,
    });

    const { access_token, refresh_token } = tokenResponse.data.data;

    // Get user information
    const userResponse = await axios.post('https://open-api.tiktok.com/platform/oauth/userinfo/', {
      access_token: access_token,
    });

    const userInfo = userResponse.data.data.user;

    // Save the TikTok account
    await repository.createAccount(userId, {
      platform: 'tiktok',
      accountId: userInfo.open_id,
      accountName: userInfo.display_name,
      accountHandle: userInfo.username,
      accessToken: access_token,
      refreshToken: refresh_token,
      isActive: true,
    });

    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?success=tiktok_connected`);

  } catch (error) {
    console.error('TikTok OAuth callback error:', error);
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?error=oauth_failed`);
  }
}