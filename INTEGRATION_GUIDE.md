# Frontend-Backend Integration Guide

This Next.js frontend is now integrated with the Python FastAPI backend for test generation.

## Setup Instructions

### 1. Backend Setup
Make sure your Python backend is running:
```bash
cd backend
python main_simple.py
# or 
python main.py
```
The backend should be running on `http://localhost:8000`

### 2. Frontend Environment
Create a `.env.local` file in the root directory:
```
BACKEND_URL=http://localhost:8000
```

### 3. API Endpoints Created

The following API routes have been created in the `app/api/` directory:

- **GET /api/subjects** - Fetches all available subjects
- **GET /api/chapters/[subject]** - Fetches chapters for a specific subject  
- **GET /api/topics/[subject]/[chapter]** - Fetches topics for a specific chapter
- **POST /api/generate-questions** - Generates custom test questions
- **POST /api/generate-neet-paper** - Generates NEET paper (180 questions)

### 4. Frontend Pages Updated

#### Custom Test Page (`/custom-test`)
- Now fetches real subjects, chapters, and topics from the backend
- Generates actual questions based on user selection
- Supports chapter weightage and topic filtering

#### NEET Test Page (`/neet-test`) 
- Generates real NEET paper with 180 questions
- Distribution: 45 Chemistry, 45 Physics, 90 Biology questions
- Uses actual question data from the backend database

### 5. Backend API Structure

The integration uses the `main_simple.py` backend which provides:

- **Subjects API**: Returns list of available subjects
- **Chapters API**: Returns chapters for a given subject
- **Topics API**: Returns topics for a given subject and chapter
- **Question Generation**: Creates custom tests based on parameters
- **NEET Paper Generation**: Creates standardized NEET test papers

### 6. Question Data Format

Questions from the backend include:
```typescript
interface Question {
  id: string;
  subject: string;
  chapter: string;
  topic: string;
  question: string;
  options: string[];
  answer: string;
  marks: number;
  type: string;
  imageMarkdown?: string;
  tableHTML?: string;
  explanation?: string;
}
```

### 7. Usage

1. Start the Python backend server
2. Run the Next.js frontend: `npm run dev`
3. Navigate to `/custom-test` or `/neet-test`
4. The app will fetch real data from your backend database

### 8. Troubleshooting

- Ensure backend is running on port 8000
- Check CORS settings in backend if you encounter cross-origin issues
- Verify database connection in the backend
- Check browser network tab for API call errors