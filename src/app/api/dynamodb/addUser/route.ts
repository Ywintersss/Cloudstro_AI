import { NextRequest, NextResponse } from 'next/server';
import { UserRepository } from '../../../../lib/repositories/user.repository';
import bcrypt from 'bcryptjs';

const userRepository = new UserRepository();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, username, fullName, password, subscription = 'free' } = body;

    console.log("hit")
    console.log(process.env.REGION_1 as string);
    console.log(process.env.MY_AWS_ACCESS_KEY_ID as string);
    console.log(process.env.MY_AWS_SECRET_ACCESS_KEY as string);

    if (!email || !username || !fullName || !password) {
      return NextResponse.json(
        { error: 'Email, username, full name, and password are required' },
        { status: 400 }
      );
    }

    // Basic password validation
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await userRepository.getUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Hash password before storing
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log("everything ok here")

    const user = await userRepository.createUser({
      email,
      username,
      fullName,
      password: hashedPassword,
      subscription,
      socialAccountsConnected: [],
      aiPreferences: {
        contentStyle: 'professional',
        postingFrequency: 'daily',
        preferredTimes: ['09:00', '15:00', '19:00'],
      },
      isActive: true,
      lastLoginAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      data: {
        userId: user.userId,
        email: user.email,
        username: user.username,
        fullName: user.fullName,
        subscription: user.subscription,
        createdAt: user.createdAt,
      },
    });

  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { 
        error: 'Failed to create user',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}