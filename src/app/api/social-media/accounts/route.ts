import { NextRequest, NextResponse } from 'next/server';
import { SocialMediaRepository } from '../../../../lib/repositories/social-media.repository';
import { MockDataService } from '../../../../lib/services/mock-data.service';
import { mockConfig } from '../../../../config/development';

const repository = new SocialMediaRepository();

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Check if this is development/demo mode
    if (!mockConfig.enabled) {
      return NextResponse.json(
        { error: 'Mock accounts only available in development mode' },
        { status: 403 }
      );
    }

    // Generate mock accounts for all platforms
    const mockAccounts = MockDataService.generateMockAccounts(userId);
    
    // Save mock accounts to database
    const savedAccounts = [];
    for (const account of mockAccounts) {
      try {
        const savedAccount = await repository.createAccount(userId, account);
        savedAccounts.push(savedAccount);
      } catch (error) {
        console.error(`Failed to save mock account for ${account.platform}:`, error);
        // Continue with other accounts even if one fails
      }
    }

    return NextResponse.json({
      message: 'Mock social media accounts created successfully',
      accounts: savedAccounts,
      count: savedAccounts.length
    });

  } catch (error) {
    console.error('Error creating mock accounts:', error);
    return NextResponse.json(
      { error: 'Failed to create mock accounts' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Get existing accounts for the user
    const accounts = await repository.getAccountsByUser(userId);
    
    return NextResponse.json({
      accounts,
      count: accounts.length,
      mockMode: mockConfig.enabled
    });

  } catch (error) {
    console.error('Error fetching accounts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch accounts' },
      { status: 500 }
    );
  }
}