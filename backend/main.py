from fastapi import FastAPI, HTTPException, Response, Depends
from pydantic import BaseModel, ConfigDict
from typing import List, Dict, Optional
import json
import os
from fpdf import FPDF
import io
from fastapi.middleware.cors import CORSMiddleware
from database import prisma, connect_database, disconnect_database
import asyncio
from contextlib import asynccontextmanager
import re

# Application lifespan manager
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    await connect_database()
    yield
    # Shutdown
    await disconnect_database()

app = FastAPI(
    title="ATG API", 
    description="Automatic Test Generator API with Database Integration",
    lifespan=lifespan
)

origins = [
    "http://localhost",
    "http://localhost:3000",
    "http://localhost:8080", 
    "http://localhost:3001",
    "*"  # In production, be more specific!
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class QuestionFilter(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
    subject: str
    chapters: List[str]
    topics: List[str]
    num_questions: int
    marks_per_question: int
    chapter_weights: Dict[str, int]

class ChapterWeight(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
    chapter: str
    num_questions: int

class QuestionRequest(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
    subject: str
    chapters: List[str]
    topics: List[str]
    num_questions: int
    marks_per_question: int
    chapter_weights: List[ChapterWeight]

class QuestionResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
    id: str
    question: str
    options: List[str]
    answer: str
    marks: int
    chapter: str
    topic: str
    type: str

# API endpoints
@app.get("/")
def read_root():
    return {"message": "ATG API is running with Database Integration"}

@app.get("/subjects")
async def get_subjects():
    """Get all available subjects"""
    try:
        subjects = await prisma.subject.find_many()
        return [{"name": subject.name, "displayName": subject.displayName} for subject in subjects]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch subjects: {str(e)}")

@app.get("/chapters/{subject}")
async def get_chapters(subject: str):
    """Get all chapters for a specific subject"""
    try:
        # Find the subject first
        subject_record = await prisma.subject.find_unique(
            where={"name": subject}
        )
        
        if not subject_record:
            raise HTTPException(status_code=404, detail="Subject not found")
        
        # Get chapters for this subject
        chapters = await prisma.chapter.find_many(
            where={"subjectId": subject_record.id},
            order_by={"displayName": "asc"}
        )
        
        return [{"name": chapter.name, "displayName": chapter.displayName} for chapter in chapters]
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch chapters: {str(e)}")

@app.get("/topics/{subject}/{chapter}")
async def get_topics(subject: str, chapter: str):
    """Get all topics for a specific chapter"""
    try:
        # Find the subject
        subject_record = await prisma.subject.find_unique(
            where={"name": subject}
        )
        
        if not subject_record:
            raise HTTPException(status_code=404, detail="Subject not found")
        
        # Find the chapter
        chapter_record = await prisma.chapter.find_unique(
            where={"name_subjectId": {"name": chapter, "subjectId": subject_record.id}}
        )
        
        if not chapter_record:
            raise HTTPException(status_code=404, detail="Chapter not found")
        
        # Get topics for this chapter
        topics = await prisma.topic.find_many(
            where={"chapterId": chapter_record.id},
            order_by={"displayName": "asc"}
        )
        
        return [{"name": topic.name, "displayName": topic.displayName} for topic in topics]
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch topics: {str(e)}")

@app.post("/generate-questions")
async def generate_questions(request: QuestionRequest):
    """Generate questions based on the request parameters"""
    try:
        # Find the subject
        subject_record = await prisma.subject.find_unique(
            where={"name": request.subject}
        )
        
        if not subject_record:
            raise HTTPException(status_code=404, detail="Subject not found")
        
        # Build query filters
        where_clause = {"chapter": {"subjectId": subject_record.id}}
        
        # Filter by chapters if specified
        if request.chapters:
            where_clause["chapter"] = {
                "subjectId": subject_record.id,
                "name": {"in": request.chapters}
            }
        
        # Filter by topics if specified
        if request.topics:
            where_clause["topic"] = {"name": {"in": request.topics}}
        
        # Get questions based on chapter weights
        all_questions = []
        
        for chapter_weight in request.chapter_weights:
            if chapter_weight.num_questions > 0:
                chapter_questions = await prisma.question.find_many(
                    where={
                        "chapter": {
                            "subjectId": subject_record.id,
                            "name": chapter_weight.chapter
                        }
                    },
                    include={
                        "chapter": True,
                        "topic": True
                    },
                    take=chapter_weight.num_questions
                )
                all_questions.extend(chapter_questions)
        
        # If no chapter weights specified, get random questions
        if not any(cw.num_questions > 0 for cw in request.chapter_weights):
            all_questions = await prisma.question.find_many(
                where=where_clause,
                include={
                    "chapter": True,
                    "topic": True
                },
                take=request.num_questions
            )
        
        # Format questions for response
        formatted_questions = []
        for i, q in enumerate(all_questions[:request.num_questions], 1):
            formatted_questions.append({
                "id": q.questionId,
                "question": q.question,
                "options": q.options,
                "answer": q.answer,
                "marks": request.marks_per_question,
                "chapter": q.chapter.displayName,
                "topic": q.topic.displayName if q.topic else "",
                "type": q.type,
                "imageMarkdown": q.imageMarkdown,
                "tableHTML": q.tableHTML,
                "explanation": q.explanation
            })
        
        return {
            "questions": formatted_questions,
            "total_marks": len(formatted_questions) * request.marks_per_question,
            "subject": request.subject,
            "generated_at": "2025-01-28"
        }
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate questions: {str(e)}")

def clean_text_for_pdf(text):
    """Clean text by removing LaTeX notation and problematic characters for PDF rendering"""
    if not text:
        return ""
    
    # Remove LaTeX math delimiters
    text = re.sub(r'\$+', '', text)
    
    # Replace common LaTeX commands with readable text
    text = re.sub(r'\\mathsf\{([^}]+)\}', r'\1', text)
    text = re.sub(r'\\mathrm\{([^}]+)\}', r'\1', text)
    text = re.sub(r'\\text\{([^}]+)\}', r'\1', text)
    text = re.sub(r'\\frac\{([^}]+)\}\{([^}]+)\}', r'(\1/\2)', text)
    text = re.sub(r'\\Delta', 'Delta', text)
    text = re.sub(r'\\to', '->', text)
    
    # Remove remaining LaTeX commands
    text = re.sub(r'\\[a-zA-Z]+\{[^}]*\}', '', text)
    text = re.sub(r'\\[a-zA-Z]+', '', text)
    
    # Clean up extra spaces and problematic characters
    text = re.sub(r'\s+', ' ', text)
    text = text.replace('{}', '')
    
    # Ensure safe encoding for PDF
    text = text.encode('latin-1', 'ignore').decode('latin-1')
    
    return text.strip()

@app.post("/display-questions")
async def display_questions(request: QuestionRequest):
    """Display questions in HTML format for web viewing"""
    try:
        # Generate the questions
        questions_response = await generate_questions(request)
        questions = questions_response["questions"]
        
        # Create HTML content
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <title>Question Paper: {request.subject.capitalize()}</title>
            <style>
                body {{ font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }}
                .header {{ text-align: center; margin-bottom: 30px; }}
                .info {{ background: #f5f5f5; padding: 15px; border-radius: 5px; margin-bottom: 20px; }}
                .question {{ margin-bottom: 25px; padding: 15px; border-left: 3px solid #007bff; }}
                .question-text {{ font-weight: bold; margin-bottom: 10px; }}
                .question-image {{ text-align: center; margin: 15px 0; }}
                .question-image img {{ max-width: 100%; height: auto; border: 1px solid #ddd; border-radius: 4px; }}
                .question-table {{ margin: 15px 0; overflow-x: auto; }}
                .question-table table {{ width: 100%; border-collapse: collapse; }}
                .question-table th, .question-table td {{ padding: 8px; border: 1px solid #ddd; text-align: left; }}
                .question-table th {{ background-color: #f8f9fa; font-weight: bold; }}
                .options {{ margin-left: 20px; }}
                .option {{ margin: 5px 0; }}
                .meta {{ font-style: italic; color: #666; font-size: 0.9em; margin-top: 10px; }}
            </style>
        </head>
        <body>
            <div class="header">
                <h1>Question Paper: {request.subject.capitalize()}</h1>
            </div>
            
            <div class="info">
                <p><strong>Total Questions:</strong> {len(questions)}</p>
                <p><strong>Marks per Question:</strong> {request.marks_per_question}</p>
                <p><strong>Total Marks:</strong> {questions_response['total_marks']}</p>
                <p><strong>Generated on:</strong> {questions_response['generated_at']}</p>
            </div>
        """
        
        # Add questions
        for i, q in enumerate(questions, 1):
            question_text = clean_text_for_pdf(q['question'])  # Clean LaTeX for display
            
            html_content += f"""
            <div class="question">
                <div class="question-text">{i}. {question_text}</div>
            """
            
            # Add image if available
            if q.get('imageMarkdown'):
                # Convert markdown image to HTML
                image_html = q['imageMarkdown'].replace('![](images/', '<img src="http://localhost:8000/images/').replace(')', '" alt="Question Image" style="max-width: 100%; height: auto; border: 1px solid #ddd; border-radius: 4px; margin: 10px 0;" />')
                html_content += f'<div class="question-image">{image_html}</div>'
            
            # Add table if available
            if q.get('tableHTML'):
                html_content += f'<div class="question-table">{q["tableHTML"]}</div>'
            
            # Add options for MCQ
            if q['type'] == 'MCQ' and q['options']:
                html_content += '<div class="options">'
                for j, option in enumerate(q['options']):
                    option_text = clean_text_for_pdf(option)
                    html_content += f'<div class="option">({chr(97+j)}) {option_text}</div>'
                html_content += '</div>'
            
            # Add metadata
            html_content += f"""
                <div class="meta">
                    Chapter: {q['chapter']} | Topic: {q['topic']} | Marks: {q['marks']}
                </div>
            </div>
            """
        
        html_content += """
        </body>
        </html>
        """
        
        return Response(content=html_content, media_type='text/html')
    
    except Exception as e:
        print(f"Display Questions Error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to display questions: {str(e)}")

@app.post("/generate-pdf")
async def generate_pdf(request: QuestionRequest):
    """Generate PDF question paper"""
    try:
        # First generate the questions
        questions_response = await generate_questions(request)
        questions = questions_response["questions"]
        
        # Create PDF with minimal configuration
        pdf = FPDF('P', 'mm', 'A4')  # Portrait, millimeters, A4
        pdf.set_auto_page_break(auto=True, margin=15)
        pdf.add_page()
        
        # Set margins
        pdf.set_margins(20, 20, 20)
        
        # Calculate available width (A4 width = 210mm, minus margins = 170mm)
        page_width = 170
        
        # Add title with explicit width
        pdf.set_font("Arial", "B", 12)
        title = f"Question Paper: {request.subject.capitalize()}"
        pdf.cell(page_width, 10, title, 0, 1, "C")
        pdf.ln(5)
        
        # Add basic details with explicit width
        pdf.set_font("Arial", "", 10)
        pdf.cell(page_width, 8, f"Total Questions: {len(questions)}", 0, 1)
        pdf.cell(page_width, 8, f"Marks per Question: {request.marks_per_question}", 0, 1)
        pdf.cell(page_width, 8, f"Total Marks: {questions_response['total_marks']}", 0, 1)
        pdf.ln(5)
        
        # Add questions with explicit width
        pdf.set_font("Arial", "B", 10)
        pdf.cell(page_width, 8, "Questions:", 0, 1)
        pdf.ln(3)
        
        pdf.set_font("Arial", "", 9)
        for i, q in enumerate(questions, 1):
            # Check if we need a new page
            if pdf.get_y() > 250:
                pdf.add_page()
            
            # Question text - keep it simple with explicit width
            question_text = f"{i}. {q['question']}"
            # Clean LaTeX notation and problematic characters
            question_text = clean_text_for_pdf(question_text)
            if len(question_text) > 120:
                question_text = question_text[:120] + "..."
            
            # Use explicit width instead of 0
            pdf.multi_cell(page_width, 6, question_text, 0, 'L')
            pdf.ln(2)
            
            # Simple options with explicit width
            if q['type'] == 'MCQ' and q['options']:
                pdf.set_font("Arial", "", 8)
                for j, option in enumerate(q['options'][:4]):  # Limit to 4 options
                    option_text = f"   ({chr(97+j)}) {option}"
                    # Clean LaTeX notation from options too
                    option_text = clean_text_for_pdf(option_text)
                    if len(option_text) > 80:
                        option_text = option_text[:80] + "..."
                    pdf.multi_cell(page_width, 5, option_text, 0, 'L')
                pdf.ln(2)
            
            # Simple info with explicit width
            pdf.set_font("Arial", "I", 7)
            info = f"[{q['marks']} marks]"
            pdf.cell(page_width, 4, info, 0, 1)
            pdf.ln(3)
            pdf.set_font("Arial", "", 9)
        
        # Generate PDF
        pdf_output = io.BytesIO()
        pdf_string = pdf.output(dest='S')
        pdf_output.write(pdf_string)
        pdf_output.seek(0)
        
        headers = {
            'Content-Disposition': 'attachment; filename="question_paper.pdf"'
        }
        return Response(content=pdf_output.getvalue(), headers=headers, media_type='application/pdf')
    
    except Exception as e:
        print(f"PDF Generation Error: {str(e)}")  # For debugging
        raise HTTPException(status_code=500, detail=f"Failed to generate PDF: {str(e)}")

@app.get("/stats/{subject}")
async def get_subject_stats(subject: str):
    """Get statistics for a subject"""
    try:
        subject_record = await prisma.subject.find_unique(
            where={"name": subject}
        )
        
        if not subject_record:
            raise HTTPException(status_code=404, detail="Subject not found")
        
        # Count chapters
        chapter_count = await prisma.chapter.count(
            where={"subjectId": subject_record.id}
        )
        
        # Count topics
        topic_count = await prisma.topic.count(
            where={"chapter": {"subjectId": subject_record.id}}
        )
        
        # Count questions
        question_count = await prisma.question.count(
            where={"chapter": {"subjectId": subject_record.id}}
        )
        
        return {
            "subject": subject_record.displayName,
            "chapters": chapter_count,
            "topics": topic_count,
            "questions": question_count
        }
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get stats: {str(e)}")

@app.get("/images/{image_name}")
async def serve_image(image_name: str):
    """Serve images for questions"""
    try:
        # Look for images in various possible locations
        possible_paths = [
            f"images/{image_name}",
            f"../images/{image_name}",
            f"../../images/{image_name}",
            f"physicsjson/images/{image_name}",
            f"biojson/images/{image_name}",
            f"json data/images/{image_name}"
        ]
        
        for path in possible_paths:
            if os.path.exists(path):
                with open(path, "rb") as f:
                    image_data = f.read()
                
                # Determine content type based on file extension
                content_type = "image/jpeg"
                if image_name.lower().endswith('.png'):
                    content_type = "image/png"
                elif image_name.lower().endswith('.gif'):
                    content_type = "image/gif"
                elif image_name.lower().endswith('.webp'):
                    content_type = "image/webp"
                
                return Response(content=image_data, media_type=content_type)
        
        # If image not found, return a placeholder or 404
        raise HTTPException(status_code=404, detail="Image not found")
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to serve image: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
