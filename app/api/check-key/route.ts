import { NextResponse } from 'next/server';

/**
 * API route to check if OpenAI API key is configured
 */
export async function GET() {
  const hasApiKey = !!process.env.OPENAI_API_KEY;
  
  return NextResponse.json({
    valid: hasApiKey,
    message: hasApiKey 
      ? 'API key is configured' 
      : 'API key not found. Please add OPENAI_API_KEY to .env.local',
  });
}


