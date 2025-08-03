import { NextResponse } from 'next/server';
import { getDummyTopics } from '@/data/dummy-api-data';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ subject: string; chapter: string }> }
) {
  const { subject, chapter } = await params;
  
  try {
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
    console.error('Error fetching topics from backend, using dummy data:', error);
    
    // Fallback to dummy data
    const dummyTopics = getDummyTopics(subject, chapter);
    return NextResponse.json(dummyTopics, { status: 200 });
  }
}