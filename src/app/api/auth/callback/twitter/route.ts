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
    const tokenResponse = await axios.post('https://api.twitter.com/2/oauth2/token', {
      grant_type: 'authorization_code',
      code,
      redirect_uri: `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/callback/twitter`,
      code_verifier: 'challenge', // In production, use the same verifier used in the initial request
    }, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${process.env.TWITTER_API_KEY}:${process.env.TWITTER_API_SECRET}`).toString('base64')}`,
      },
    });

    const { access_token, refresh_token } = tokenResponse.data;

    // Get user info
    const userResponse = await axios.get('https://api.twitter.com/2/users/me', {
      headers: {
        'Authorization': `Bearer ${access_token}`,
      },
    });

    const userInfo = userResponse.data.data;

    // Save account to database
    await repository.createAccount(userId, {
      platform: 'twitter',
      accountId: userInfo.id,
      accountName: userInfo.name,
      accountHandle: userInfo.username,
      accessToken: access_token,
      refreshToken: refresh_token,
      isActive: true,
    });

    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?success=twitter_connected`);

  } catch (error) {
    console.error('Twitter OAuth callback error:', error);
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?error=oauth_failed`);
  }
}