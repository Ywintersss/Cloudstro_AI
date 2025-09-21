import { NextRequest, NextResponse } from 'next/server';
import { UserRepository } from '../../../../lib/repositories/user.repository';
import { SocialMediaRepository } from '../../../../lib/repositories/social-media.repository';

const userRepository = new UserRepository();
const socialMediaRepository = new SocialMediaRepository();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const email = searchParams.get('email');

    if (!userId && !email) {
      return NextResponse.json(
        { error: 'Either userId or email is required' },
        { status: 400 }
      );
    }

    let user;
    if (userId) {
      user = await userRepository.getUserById(userId);
    } else if (email) {
      user = await userRepository.getUserByEmail(email);
    }

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Get connected social media accounts
    const socialAccounts = await socialMediaRepository.getAccountsByUser(user.userId);
    
    // Get user stats
    const stats = await userRepository.getUserStats(user.userId);

    return NextResponse.json({
      success: true,
      data: {
        ...user,
        connectedAccounts: socialAccounts.map(account => ({
          platform: account.platform,
          accountName: account.accountName,
          accountHandle: account.accountHandle,
          isActive: account.isActive,
          connectedAt: account.createdAt,
        })),
        stats,
      },
    });

  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch user',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, ...updates } = body;

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    await userRepository.updateUser(userId, updates);

    const updatedUser = await userRepository.getUserById(userId);

    return NextResponse.json({
      success: true,
      data: updatedUser,
    });

  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { 
        error: 'Failed to update user',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}