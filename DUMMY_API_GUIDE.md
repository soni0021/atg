# Dummy API Data Guide

This guide explains the dummy API data implementation for the Testing Platform.

## Overview

The Testing Platform now includes comprehensive dummy data that automatically serves as a fallback when the backend server is unavailable. This ensures that the frontend can function properly during development and testing without requiring a running backend.

## Files Structure

```
atg/
├── data/
│   ├── dummy-api-data.ts    # Main dummy data file
│   └── questions.ts         # Existing question database
├── app/api/
│   ├── subjects/route.ts    # Updated with dummy fallback
│   ├── chapters/[subject]/route.ts    # Updated with dummy fallback
│   ├── topics/[subject]/[chapter]/route.ts    # Updated with dummy fallback
│   ├── generate-questions/route.ts    # Updated with dummy fallback
│   └── generate-neet-paper/route.ts    # Updated with dummy fallback
└── test-dummy-api.js        # Test script
```

## API Endpoints with Dummy Data

### 1. Subjects API (`/api/subjects`)
**Endpoint:** `GET /api/subjects`

**Dummy Response:**
```json
[
  {
    "id": "physics",
    "name": "Physics",
    "description": "Study of matter, energy, and their interactions",
    "color": "#3B82F6",
    "icon": "⚛️",
    "totalChapters": 8,
    "totalTopics": 45
  },
  {
    "id": "chemistry",
    "name": "Chemistry",
    "description": "Study of substances, their properties, and reactions",
    "color": "#10B981",
    "icon": "🧪",
    "totalChapters": 6,
    "totalTopics": 38
  },
  {
    "id": "biology",
    "name": "Biology",
    "description": "Study of living organisms and life processes",
    "color": "#8B5CF6",
    "icon": "🧬",
    "totalChapters": 7,
    "totalTopics": 52
  },
  {
    "id": "mathematics",
    "name": "Mathematics",
    "description": "Study of numbers, quantities, shapes, and patterns",
    "color": "#F59E0B",
    "icon": "📐",
    "totalChapters": 5,
    "totalTopics": 32
  }
]
```

### 2. Chapters API (`/api/chapters/[subject]`)
**Endpoint:** `GET /api/chapters/{subject}`

**Example:** `GET /api/chapters/physics`

**Dummy Response:**
```json
[
  {
    "id": "mechanics",
    "name": "Mechanics",
    "description": "Study of motion and forces",
    "topics": ["Kinematics", "Newton's Laws", "Work and Energy", "Momentum", "Circular Motion"],
    "totalQuestions": 150,
    "difficulty": "medium"
  },
  {
    "id": "waves",
    "name": "Waves and Oscillations",
    "description": "Study of wave phenomena and simple harmonic motion",
    "topics": ["Simple Harmonic Motion", "Wave Properties", "Sound Waves", "Light Waves", "Interference"],
    "totalQuestions": 120,
    "difficulty": "medium"
  }
  // ... more chapters
]
```

### 3. Topics API (`/api/topics/[subject]/[chapter]`)
**Endpoint:** `GET /api/topics/{subject}/{chapter}`

**Example:** `GET /api/topics/physics/mechanics`

**Dummy Response:**
```json
[
  {
    "id": "kinematics",
    "name": "Kinematics",
    "description": "Study of motion without considering forces",
    "subtopics": ["Motion in a straight line", "Motion in a plane", "Projectile motion", "Circular motion"],
    "totalQuestions": 40,
    "difficulty": "medium"
  },
  {
    "id": "newtons-laws",
    "name": "Newton's Laws",
    "description": "Fundamental laws governing motion",
    "subtopics": ["First law", "Second law", "Third law", "Applications"],
    "totalQuestions": 35,
    "difficulty": "medium"
  }
  // ... more topics
]
```

### 4. Generate Questions API (`/api/generate-questions`)
**Endpoint:** `POST /api/generate-questions`

**Request Body:**
```json
{
  "subject": "physics",
  "chapters": ["mechanics", "waves"],
  "topics": ["kinematics", "shm"],
  "num_questions": 10,
  "marks_per_question": 4,
  "chapter_weights": [
    {"chapter": "mechanics", "num_questions": 6},
    {"chapter": "waves", "num_questions": 4}
  ]
}
```

**Dummy Response:**
```json
{
  "subject": "physics",
  "totalQuestions": 10,
  "totalMarks": 40,
  "questions": [
    {
      "id": "physics_q_1",
      "subject": "physics",
      "chapter": "mechanics",
      "topic": "kinematics",
      "difficulty": "medium",
      "question": "A particle moves with velocity v = 2t + 3 m/s. What is the displacement after 5 seconds?",
      "options": ["25 m", "30 m", "35 m", "40 m"],
      "correctAnswer": 2,
      "explanation": "Displacement = ∫v dt = ∫(2t + 3) dt = t² + 3t. At t = 5s, displacement = 25 + 15 = 40 m",
      "marks": 4,
      "timeToSolve": 120
    }
    // ... more questions
  ],
  "generatedAt": "2024-01-15T10:30:00.000Z"
}
```

### 5. Generate NEET Paper API (`/api/generate-neet-paper`)
**Endpoint:** `POST /api/generate-neet-paper`

**Request Body:**
```json
{
  "subjects": ["chemistry", "physics", "biology"]
}
```

**Dummy Response:**
```json
{
  "examName": "NEET Mock Test",
  "subjects": ["chemistry", "physics", "biology"],
  "totalQuestions": 180,
  "totalMarks": 720,
  "duration": 200,
  "sections": [
    {
      "subject": "chemistry",
      "questions": 60,
      "marks": 240,
      "timeLimit": 67
    }
    // ... more sections
  ],
  "questions": [
    // ... 180 questions
  ],
  "generatedAt": "2024-01-15T10:30:00.000Z",
  "instructions": [
    "This is a mock NEET examination",
    "Total time: 3 hours 20 minutes",
    "Each question carries 4 marks",
    "Negative marking: -1 for wrong answer",
    "No negative marking for unattempted questions"
  ]
}
```

## Available Subjects

The dummy data includes comprehensive data for:

1. **Physics** (8 chapters, 45 topics)
   - Mechanics, Waves, Electricity, Optics, Thermodynamics, Modern Physics, Fluid Mechanics, Electronics

2. **Chemistry** (6 chapters, 38 topics)
   - Physical Chemistry, Organic Chemistry, Inorganic Chemistry, Analytical Chemistry, Biochemistry, Polymer Chemistry

3. **Biology** (7 chapters, 52 topics)
   - Cell Biology, Genetics, Human Physiology, Ecology, Evolution, Microbiology, Biotechnology

4. **Mathematics** (5 chapters, 32 topics)
   - Algebra, Calculus, Geometry, Statistics, Number Theory

## How It Works

### Fallback Mechanism
1. Each API route first attempts to connect to the backend server
2. If the backend is unavailable (connection error, timeout, etc.), it automatically falls back to dummy data
3. The frontend receives a successful response with dummy data instead of an error
4. Console logs indicate when dummy data is being used

### Environment Configuration
- Set `BACKEND_URL` environment variable to point to your backend server
- If not set, defaults to `http://localhost:8000`
- When backend is unavailable, dummy data is served automatically

## Testing

### Run the Test Script
```bash
cd atg
node test-dummy-api.js
```

This will test all dummy data functions and show sample responses.

### Manual Testing
1. Start your Next.js development server
2. Visit API endpoints in your browser or use tools like Postman
3. The endpoints will work even without a backend server running

## Benefits

1. **Development Independence**: Frontend can be developed without backend dependency
2. **Testing**: Easy to test UI components with consistent data
3. **Demo**: Can demonstrate the application without backend setup
4. **Fallback**: Graceful degradation when backend is unavailable
5. **Consistency**: Predictable data structure for development

## Customization

### Adding More Dummy Data
1. Edit `atg/data/dummy-api-data.ts`
2. Add new subjects, chapters, or topics
3. Update the question templates for new subjects
4. Test with the provided test script

### Modifying Question Templates
The dummy questions are generated from templates. To add more variety:
1. Add more question templates in the `questionTemplates` object
2. Each template should include question, options, correctAnswer, and explanation
3. Questions are randomly selected from templates based on the subject

## Troubleshooting

### Common Issues
1. **Import Errors**: Ensure TypeScript paths are correctly configured
2. **Data Not Loading**: Check console logs for backend connection errors
3. **Inconsistent Data**: Verify that dummy data structure matches expected API response

### Debug Mode
Enable detailed logging by checking the console for messages like:
- "Error fetching subjects from backend, using dummy data"
- "Error generating questions from backend, using dummy data"

These messages indicate that dummy data is being served instead of backend data.

## Next Steps

1. **Backend Integration**: When your backend is ready, set the `BACKEND_URL` environment variable
2. **Data Enrichment**: Add more realistic dummy data as needed
3. **Testing**: Use the dummy data for comprehensive frontend testing
4. **Documentation**: Update API documentation to reflect the fallback behavior 