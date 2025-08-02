import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000';

export async function GET(
  request: Request,
  { params }: { params: { subject: string; chapter: string } }
) {
  try {
    const { subject, chapter } = await params;
    
    const response = await fetch(
      `${BACKEND_URL}/topics/${encodeURIComponent(subject)}/${encodeURIComponent(chapter)}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const topics = await response.json();
    
    return NextResponse.json(topics, { status: 200 });
  } catch (error) {
    console.error('Error fetching topics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch topics' },
      { status: 500 }
    );
  }
}