import { NextRequest, NextResponse } from 'next/server';
import { generateDummyQuestions } from '@/data/dummy-api-data';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000';

interface ChapterWeight {
  chapter: string;
  num_questions: number;
}

interface QuestionRequest {
  subject: string;
  chapters: string[];
  topics: string[];
  num_questions: number;
  marks_per_question: number;
  chapter_weights: ChapterWeight[];
}

export async function POST(request: NextRequest) {
  let body: QuestionRequest;
  
  try {
    body = await request.json();
    
    // Add logging to debug what we're sending to backend
    console.log('API Route - Request body:', JSON.stringify(body, null, 2));
    
    const response = await fetch(`${BACKEND_URL}/generate-questions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }

    const questions = await response.json();
    
    console.log('API Route - Response from backend:', {
      questionCount: questions.questions?.length || 0,
      subject: questions.subject,
      sampleQuestion: questions.questions?.[0]
    });
    
    return NextResponse.json(questions, { status: 200 });
  } catch (error) {
    console.error('Error generating questions from backend, using dummy data:', error);
    
    // Fallback to dummy data
    const dummyQuestions = generateDummyQuestions(body);
    return NextResponse.json(dummyQuestions, { status: 200 });
  }
}