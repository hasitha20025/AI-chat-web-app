import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

// Initialize Google Generative AI
let genAI: GoogleGenerativeAI;
try {
  if (!process.env.GEMINI_API_KEY) {
    console.error('GEMINI_API_KEY environment variable is not set');
  } else {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }
} catch (error) {
  console.error('Error initializing GoogleGenerativeAI:', error);
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('image') as File;

    if (!file) {
      return NextResponse.json({ error: 'No image file provided' }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ 
        error: 'Gemini API key not configured. Please add GEMINI_API_KEY to your .env.local file.' 
      }, { status: 500 });
    }

    if (!genAI) {
      return NextResponse.json({ 
        error: 'Google Generative AI not properly initialized' 
      }, { status: 500 });
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Image = buffer.toString('base64');

    // Get the model
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // Create the prompt for damage detection
    const prompt = `Analyze this image and identify any types of damage to walls, surfaces, or structures. 

Please provide a detailed analysis in the following format:
1. **Damage Type**: Clearly identify the type of damage (e.g., cracks, water damage, mold, holes, paint peeling, etc.)
2. **Severity**: Rate the severity as Low, Medium, or High
3. **Description**: Provide a detailed description of what you observe
4. **Affected Area**: Describe the location and extent of the damage
5. **Immediate Concerns**: List any immediate safety or structural concerns

If no damage is visible, please state "No visible damage detected" and provide general maintenance recommendations.

Focus specifically on:
- Cracks in walls or ceilings
- Water stains or moisture damage
- Mold or mildew
- Holes or dents
- Paint or wallpaper issues
- Structural concerns
- Any other visible deterioration

Be specific and detailed in your analysis.`;

    // Prepare the image data for Gemini
    const imagePart = {
      inlineData: {
        data: base64Image,
        mimeType: file.type,
      },
    };

    // Generate content with image and prompt
    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    const analysisText = response.text();

    // Now generate prevention instructions based on the detected damage
    const preventionPrompt = `Based on the following damage analysis, provide comprehensive prevention instructions:

${analysisText}

Please provide detailed prevention and maintenance instructions in the following format:

**Prevention Instructions:**
1. **Immediate Actions**: What should be done right now
2. **Short-term Prevention** (1-3 months): Regular maintenance tasks
3. **Long-term Prevention** (6+ months): Preventive measures and upgrades
4. **Materials Needed**: List of tools and materials required
5. **Professional Help**: When to call experts
6. **Cost Estimate**: Rough cost estimates for repairs and prevention
7. **Warning Signs**: What to watch for in the future

Make the instructions practical, clear, and actionable for a homeowner.`;

    const preventionResult = await model.generateContent(preventionPrompt);
    const preventionResponse = await preventionResult.response;
    const preventionText = preventionResponse.text();

    return NextResponse.json({ 
      damageAnalysis: analysisText,
      preventionInstructions: preventionText,
      success: true
    });

  } catch (error: unknown) {
    console.error('Error analyzing image:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    // Handle specific API errors
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

    return NextResponse.json(
      { error: `Image analysis failed: ${errorMessage}` },
      { status: 500 }
    );
  }
}
