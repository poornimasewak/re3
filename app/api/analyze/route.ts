import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Lazy initialize OpenAI client to avoid build-time errors
function getOpenAIClient() {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is not configured');
  }
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

export async function POST(request: NextRequest) {
  try {
    // Check if API key is configured
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'OpenAI API key not configured. Please add OPENAI_API_KEY to your .env.local file.' 
        },
        { status: 401 }
      );
    }

    const { image, barcode } = await request.json();

    if (!image) {
      return NextResponse.json(
        { success: false, error: 'Image is required' },
        { status: 400 }
      );
    }

    // Ensure image is in base64 format with proper prefix
    const base64Image = image.startsWith('data:image') 
      ? image 
      : `data:image/jpeg;base64,${image}`;

    console.log('Analyzing product with barcode:', barcode || 'none');

    const openai = getOpenAIClient();
    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an environmental expert analyzing products for sustainability. Provide detailed, accurate information about recycling, reuse, and environmental impact. Always respond with valid JSON."
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Analyze this product for sustainability and environmental impact.

${barcode ? `Barcode Number: ${barcode}` : 'Barcode: Not detected'}

Please provide a comprehensive analysis in JSON format with the following structure:
{
  "product_name": "Full product name",
  "brand": "Brand name",
  "category": "Product category (e.g., Food, Electronics, Packaging)",
  "sustainability_score": 0-100 (where 100 is most eco-friendly),
  "recycling_instructions": "Detailed step-by-step recycling instructions",
  "material_composition": "Main materials used",
  "environmental_impact": "Carbon footprint, plastic content, manufacturing impact",
  "reuse_suggestions": ["Creative idea 1", "Creative idea 2", "Creative idea 3"],
  "eco_alternatives": ["Alternative product 1", "Alternative product 2"],
  "recyclable": true/false,
  "biodegradable": true/false,
  "certifications": ["Eco certifications if any"]
}

Be specific and practical with your recommendations. If you cannot identify the product clearly, provide general guidance based on what you can see.`
            },
            {
              type: "image_url",
              image_url: {
                url: base64Image,
              }
            }
          ]
        }
      ],
      max_tokens: parseInt(process.env.OPENAI_MAX_TOKENS || '1500'),
      temperature: 0.7,
    });

    const responseText = completion.choices[0].message.content;

    if (!responseText) {
      throw new Error('No response from OpenAI');
    }

    // Parse JSON response - handle both pure JSON and JSON within text
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Failed to parse JSON from response');
    }

    const analysis = JSON.parse(jsonMatch[0]);

    // Validate required fields
    const requiredFields = ['product_name', 'brand', 'category', 'sustainability_score'];
    const missingFields = requiredFields.filter(field => !(field in analysis));
    
    if (missingFields.length > 0) {
      console.warn('Missing fields in analysis:', missingFields);
    }

    console.log('Analysis complete:', analysis.product_name);

    return NextResponse.json({
      success: true,
      data: analysis,
      timestamp: new Date().toISOString(),
    });

  } catch (error: any) {
    console.error('OpenAI API Error:', error);

    // Handle specific OpenAI errors
    if (error.status === 401) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid API key. Please check your OpenAI configuration in Settings.' 
        },
        { status: 401 }
      );
    }

    if (error.status === 429) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Rate limit exceeded. Please try again in a moment.' 
        },
        { status: 429 }
      );
    }

    if (error.status === 413 || error.message?.includes('too large')) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Image too large. Please capture a smaller image.' 
        },
        { status: 413 }
      );
    }

    // Generic error
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to analyze product. Please try again.',
        details: process.env.NODE_ENV === 'development' ? error.response?.data : undefined
      },
      { status: 500 }
    );
  }
}

// Handle OPTIONS for CORS
export async function OPTIONS() {
  return NextResponse.json({}, { status: 200 });
}

