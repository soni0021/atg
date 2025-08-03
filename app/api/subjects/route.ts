import { NextResponse } from 'next/server';
import { getDummySubjects } from '@/data/dummy-api-data';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000';

export async function GET() {
  try {
    const response = await fetch(`${BACKEND_URL}/subjects`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const subjects = await response.json();
    
    return NextResponse.json(subjects, { status: 200 });
  } catch (error) {
    console.error('Error fetching subjects from backend, using dummy data:', error);
    
    // Fallback to dummy data
    const dummySubjects = getDummySubjects();
    return NextResponse.json(dummySubjects, { status: 200 });
  }
}