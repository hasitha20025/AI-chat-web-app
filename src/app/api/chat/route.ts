import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: 'Gemini API key not configured' }, { status: 500 });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(message);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ response: text });
  } catch (error: unknown) {
    console.error('Error calling Gemini API:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    // Check for specific API errors
    if (errorMessage.includes('API_KEY_INVALID')) {
      return NextResponse.json(
        { error: 'Invalid API key. Please check your Gemini API key.' },
        { status: 401 }
      );
    }
    
    if (errorMessage.includes('PERMISSION_DENIED')) {
      return NextResponse.json(
        { error: 'Permission denied. Please check your API key permissions.' },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { error: `API Error: ${errorMessage}` },
      { status: 500 }
    );
  }
}
