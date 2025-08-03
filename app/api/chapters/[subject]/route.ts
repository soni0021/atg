import { NextResponse } from 'next/server';
import { getDummyChapters } from '@/data/dummy-api-data';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ subject: string }> }
) {
  const { subject } = await params;
  
  try {
    const response = await fetch(`${BACKEND_URL}/chapters/${encodeURIComponent(subject)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const chapters = await response.json();
    
    return NextResponse.json(chapters, { status: 200 });
  } catch (error) {
    console.error('Error fetching chapters from backend, using dummy data:', error);
    
    // Fallback to dummy data
    const dummyChapters = getDummyChapters(subject);
    return NextResponse.json(dummyChapters, { status: 200 });
  }
}