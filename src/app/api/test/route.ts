import { NextRequest, NextResponse } from 'next/server';


export async function GET(request: NextRequest) {
  try {
    console.log("API route hit!");
    console.log(process.env.TEST_VAR! as string);
    console.log(process.env.MY_SECRET_ACCESS_KEY! as string);
    console.log(process.env.BEDROCK_ARN! as string);

    return NextResponse.json({
      success: true,
      message: "API working perfectly!",
      body: process.env.TEST_VAR
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