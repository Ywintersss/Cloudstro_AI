import { NextResponse } from "next/server";

export async function POST(req: Request) {
  console.log("API route hit!");
  console.log(req)
  try {
    const body = await req.json();
    console.log("Received body:", body);
    
    return NextResponse.json({
      success: true,
      message: "API working perfectly!",
      receivedData: body.input
    });
    
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ 
      error: "Something went wrong",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}