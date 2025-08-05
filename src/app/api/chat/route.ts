import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

// Initialize with better error handling
let genAI: GoogleGenerativeAI;
try {
  if (!process.env.GEMINI_API_KEY) {
    console.error('GEMINI_API_KEY environment variable is not set');
  } else {
    console.log('Initializing GoogleGenerativeAI with API key length:', process.env.GEMINI_API_KEY.length);
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }
} catch (error) {
  console.error('Error initializing GoogleGenerativeAI:', error);
}

export async function POST(request: NextRequest) {
  console.log('=== API Route Called ===');
  console.log('Environment check:');
 // console.log('- GEMINI_API_KEY exists:', !!process.env.GEMINI_API_KEY);
  console.log('- GEMINI_API_KEY length:', process.env.GEMINI_API_KEY?.length);
  console.log('- genAI initialized:', !!genAI);

  try {
    const { message } = await request.json();
    console.log('Received message:', message);

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      console.error('API key missing');
      return NextResponse.json({ 
        error: 'Gemini API key not configured. Please add GEMINI_API_KEY to your .env.local file.' 
      }, { status: 500 });
    }

    if (!genAI) {
      console.error('genAI not initialized');
      return NextResponse.json({ 
        error: 'Google Generative AI not properly initialized' 
      }, { status: 500 });
    }

    console.log('Getting model...');
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    console.log('Generating content...');
    const result = await model.generateContent(message);
    const response = await result.response;
    const text = response.text();

    console.log('Success! Response length:', text.length);
    return NextResponse.json({ response: text });
  } catch (error: unknown) {
    console.error('=== API ERROR ===');
    console.error('Error calling Gemini API:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Detailed error message:', errorMessage);
    console.error('Error type:', typeof error);
    console.error('Error constructor:', error?.constructor?.name);
    
    // More specific error handling
    if (errorMessage.includes('API_KEY_INVALID') || errorMessage.includes('invalid API key')) {
      return NextResponse.json(
        { error: 'Invalid API key. Please get a new key from https://aistudio.google.com/app/apikey' },
        { status: 401 }
      );
    }
    
    if (errorMessage.includes('PERMISSION_DENIED') || errorMessage.includes('permission')) {
      return NextResponse.json(
        { error: 'Permission denied. Please check your API key permissions and ensure Gemini API is enabled.' },
        { status: 403 }
      );
    }

    if (errorMessage.includes('quota') || errorMessage.includes('limit') || errorMessage.includes('exceeded')) {
      return NextResponse.json(
        { error: 'API quota exceeded. Please check your usage limits in Google AI Studio.' },
        { status: 429 }
      );
    }

    if (errorMessage.includes('billing') || errorMessage.includes('payment')) {
      return NextResponse.json(
        { error: 'Billing issue. Please check your Google Cloud billing settings.' },
        { status: 402 }
      );
    }

    // Return the actual error message for debugging
    return NextResponse.json(
      { error: `Gemini API Error: ${errorMessage}` },
      { status: 500 }
    );
  }
}
