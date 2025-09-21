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
    const tokenResponse = await axios.post('https://graph.facebook.com/v18.0/oauth/access_token', {
      client_id: process.env.FACEBOOK_APP_ID,
      client_secret: process.env.FACEBOOK_APP_SECRET,
      redirect_uri: `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/callback/facebook`,
      code,
    });

    const { access_token } = tokenResponse.data;

    // Get user info and pages
    const [userResponse, pagesResponse] = await Promise.all([
      axios.get(`https://graph.facebook.com/v18.0/me?fields=id,name&access_token=${access_token}`),
      axios.get(`https://graph.facebook.com/v18.0/me/accounts?access_token=${access_token}`)
    ]);

    const userInfo = userResponse.data;
    const pages = pagesResponse.data.data || [];

    // Save main account
    await repository.createAccount(userId, {
      platform: 'facebook',
      accountId: userInfo.id,
      accountName: userInfo.name,
      accessToken: access_token,
      isActive: true,
    });

    // Save pages as separate accounts
    for (const page of pages) {
      await repository.createAccount(userId, {
        platform: 'facebook',
        accountId: page.id,
        accountName: page.name,
        accessToken: page.access_token,
        isActive: true,
      });
    }

    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?success=facebook_connected`);

  } catch (error) {
    console.error('Facebook OAuth callback error:', error);
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?error=oauth_failed`);
  }
}