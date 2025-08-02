import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000';

interface NEETRequest {
  subjects?: string[];
}

export async function POST(request: NextRequest) {
  try {
    const body: NEETRequest = await request.json();
    
    // Default to all NEET subjects if not specified
    const requestBody = {
      subjects: body.subjects || ["chemistry", "physics", "biology"]
    };
    
    const response = await fetch(`${BACKEND_URL}/generate-neet-paper`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }

    const neetPaper = await response.json();
    
    return NextResponse.json(neetPaper, { status: 200 });
  } catch (error) {
    console.error('Error generating NEET paper:', error);
    return NextResponse.json(
      { error: 'Failed to generate NEET paper', details: error.message },
      { status: 500 }
    );
  }
}

// Also support GET for testing
export async function GET() {
  try {
    const response = await fetch(`${BACKEND_URL}/test-neet`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }

    const neetPaper = await response.json();
    
    return NextResponse.json(neetPaper, { status: 200 });
  } catch (error) {
    console.error('Error generating test NEET paper:', error);
    return NextResponse.json(
      { error: 'Failed to generate test NEET paper', details: error.message },
      { status: 500 }
    );
  }
}