from fastapi import FastAPI, HTTPException, Response
from pydantic import BaseModel, ConfigDict
from typing import List, Dict, Optional
import json
import os
import re
from fpdf import FPDF
import io
from fastapi.middleware.cors import CORSMiddleware
from database_simple import (
    connect_database, disconnect_database, get_subjects, get_chapters, 
    get_topics, get_questions, get_stats
)
import asyncio
from contextlib import asynccontextmanager
from datetime import datetime

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

class NEETRequest(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
    subjects: List[str] = ["chemistry", "physics", "biology"]  # Optional, defaults to all NEET subjects

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
    text = re.sub(r'\\rightleftharpoons', '<->', text)
    text = re.sub(r'\\rightarrow', '->', text)
    text = re.sub(r'\\leftarrow', '<-', text)
    text = re.sub(r'\\leftrightarrow', '<->', text)
    text = re.sub(r'\\rightleftarrows', '<->', text)
    
    # Remove remaining LaTeX commands
    text = re.sub(r'\\[a-zA-Z]+\{[^}]*\}', '', text)
    text = re.sub(r'\\[a-zA-Z]+', '', text)
    
    # Replace Unicode arrows and special characters
    text = text.replace('⇌', '<->')
    text = text.replace('→', '->')
    text = text.replace('←', '<-')
    text = text.replace('↔', '<->')
    text = text.replace('⇄', '<->')
    text = text.replace('⇒', '=>')
    text = text.replace('⇐', '<=')
    text = text.replace('⇔', '<=>')
    text = text.replace('Δ', 'Delta')
    text = text.replace('α', 'alpha')
    text = text.replace('β', 'beta')
    text = text.replace('γ', 'gamma')
    text = text.replace('π', 'pi')
    text = text.replace('σ', 'sigma')
    text = text.replace('θ', 'theta')
    text = text.replace('λ', 'lambda')
    text = text.replace('μ', 'mu')
    text = text.replace('ν', 'nu')
    text = text.replace('ω', 'omega')
    text = text.replace('°', ' degrees')
    text = text.replace('±', '+/-')
    text = text.replace('×', 'x')
    text = text.replace('÷', '/')
    text = text.replace('√', 'sqrt')
    text = text.replace('∞', 'infinity')
    
    # Clean up extra spaces and problematic characters
    text = re.sub(r'\s+', ' ', text)
    text = text.replace('{}', '')
    
    # Ensure safe encoding for PDF
    try:
        text = text.encode('latin-1', 'ignore').decode('latin-1')
    except:
        # Fallback: remove all non-ASCII characters
        text = ''.join(char for char in text if ord(char) < 128)
    
    return text.strip()

# API endpoints
@app.get("/")
def read_root():
    return {"message": "ATG API is running with Database Integration"}

@app.get("/test-db")
async def test_database():
    """Test database connection and data availability"""
    try:
        subjects = await get_subjects()
        result = {
            "database_connected": True,
            "total_subjects": len(subjects),
            "subjects": subjects
        }
        
        # Test each subject for question counts
        for subject in subjects:
            try:
                stats = await get_stats(subject["name"])
                result[f"{subject['name']}_stats"] = stats
            except Exception as e:
                result[f"{subject['name']}_error"] = str(e)
        
        return result
    except Exception as e:
        return {"database_connected": False, "error": str(e)}

@app.get("/subjects")
async def get_subjects_endpoint():
    """Get all available subjects"""
    try:
        subjects = await get_subjects()
        return subjects
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch subjects: {str(e)}")

@app.get("/chapters/{subject}")
async def get_chapters_endpoint(subject: str):
    """Get all chapters for a specific subject"""
    try:
        chapters = await get_chapters(subject)
        return chapters
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch chapters: {str(e)}")

@app.get("/topics/{subject}/{chapter}")
async def get_topics_endpoint(subject: str, chapter: str):
    """Get all topics for a specific chapter"""
    try:
        topics = await get_topics(subject, chapter)
        return topics
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch topics: {str(e)}")

@app.post("/generate-questions")
async def generate_questions(request: QuestionRequest):
    """Generate questions based on the request parameters"""
    try:
        # Get questions based on chapter weights
        all_questions = []
        
        for chapter_weight in request.chapter_weights:
            if chapter_weight.num_questions > 0:
                chapter_questions = await get_questions(
                    subject_name=request.subject,
                    chapters=[chapter_weight.chapter],
                    topics=request.topics if request.topics else None,
                    limit=chapter_weight.num_questions
                )
                all_questions.extend(chapter_questions)
        
        # If no chapter weights specified, get random questions
        if not any(cw.num_questions > 0 for cw in request.chapter_weights):
            all_questions = await get_questions(
                subject_name=request.subject,
                chapters=request.chapters if request.chapters else None,
                topics=request.topics if request.topics else None,
                limit=request.num_questions
            )
        
        # Format questions for response
        formatted_questions = []
        for i, q in enumerate(all_questions[:request.num_questions], 1):
            formatted_questions.append({
                "id": q["questionId"],
                "question": q["question"],
                "options": q["options"],
                "answer": q["answer"],
                "marks": request.marks_per_question,
                "chapter": q["chapter"],
                "topic": q["topic"],
                "type": q["type"],
                "imageMarkdown": q.get("imageMarkdown"),
                "tableHTML": q.get("tableHTML"),
                "explanation": q.get("explanation")
            })
        
        return {
            "questions": formatted_questions,
            "total_marks": len(formatted_questions) * request.marks_per_question,
            "subject": request.subject,
            "generated_at": "2025-01-28"
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate questions: {str(e)}")

@app.post("/generate-pdf")
async def generate_pdf(request: QuestionRequest):
    """Generate PDF question paper"""
    try:
        # First generate the questions
        questions_response = await generate_questions(request)
        questions = questions_response["questions"]
        
        # Create PDF
        pdf = FPDF()
        pdf.add_page()
        pdf.set_font("Arial", "B", 16)
        
        # Add title
        pdf.cell(0, 10, f"Question Paper: {request.subject.capitalize()}", 0, 1, "C")
        pdf.ln(10)
        
        # Add details
        pdf.set_font("Arial", "", 12)
        pdf.cell(0, 10, f"Total Questions: {len(questions)}", 0, 1)
        pdf.cell(0, 10, f"Marks per Question: {request.marks_per_question}", 0, 1)
        pdf.cell(0, 10, f"Total Marks: {questions_response['total_marks']}", 0, 1)
        pdf.ln(10)
        
        # Add chapter weights
        if request.chapter_weights:
            pdf.cell(0, 10, "Chapter Distribution:", 0, 1)
            for weight in request.chapter_weights:
                if weight.num_questions > 0:
                    pdf.cell(0, 10, f"  {weight.chapter}: {weight.num_questions} questions", 0, 1)
            pdf.ln(10)
        
        # Add questions
        pdf.set_font("Arial", "B", 12)
        pdf.cell(0, 10, "Questions:", 0, 1)
        pdf.ln(5)
        
        pdf.set_font("Arial", "", 11)
        for i, q in enumerate(questions, 1):
            # Question text
            question_text = f"{i}. {q['question']}"
            # Remove any problematic characters for PDF
            question_text = question_text.encode('latin-1', 'ignore').decode('latin-1')
            pdf.multi_cell(0, 8, question_text)
            pdf.ln(3)
            
            # Options for MCQ
            if q['type'] == 'MCQ' and q['options']:
                for option in q['options']:
                    option_text = f"   {option}"
                    option_text = option_text.encode('latin-1', 'ignore').decode('latin-1')
                    pdf.multi_cell(0, 6, option_text)
                pdf.ln(3)
            
            # Chapter and topic info
            pdf.set_font("Arial", "I", 9)
            pdf.cell(0, 5, f"[{q['chapter']} - {q['topic']}] [{q['marks']} mark(s)]", 0, 1)
            pdf.ln(5)
            pdf.set_font("Arial", "", 11)
        
        # Output PDF as bytes
        pdf_output = io.BytesIO()
        pdf_output.write(pdf.output(dest='S').encode('latin-1'))
        pdf_output.seek(0)
        
        headers = {
            'Content-Disposition': 'attachment; filename="question_paper.pdf"'
        }
        return Response(content=pdf_output.getvalue(), headers=headers, media_type='application/pdf')
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate PDF: {str(e)}")

@app.get("/stats/{subject}")
async def get_subject_stats(subject: str):
    """Get statistics for a subject"""
    try:
        stats = await get_stats(subject)
        if not stats:
            raise HTTPException(status_code=404, detail="Subject not found")
        return stats
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get stats: {str(e)}")

@app.get("/test-neet")
async def test_neet_paper():
    """Test endpoint to generate NEET paper via GET for browser testing"""
    try:
        # First check what subjects are available
        subjects = await get_subjects()
        print(f"Available subjects: {subjects}")
        
        # Filter to only use available subjects
        available_subject_names = [s["name"] for s in subjects]
        requested_subjects = ["chemistry", "physics", "biology"]
        valid_subjects = [s for s in requested_subjects if s in available_subject_names]
        
        print(f"Valid subjects for NEET: {valid_subjects}")
        
        if not valid_subjects:
            return {
                "error": "No valid subjects found",
                "available_subjects": available_subject_names,
                "requested_subjects": requested_subjects
            }
        
        request = NEETRequest(subjects=valid_subjects)
        return await generate_neet_paper(request)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate test NEET paper: {str(e)}")

@app.post("/generate-neet-paper")
async def generate_neet_paper(request: NEETRequest):
    """Generate NEET paper with specific distribution: 45 Chemistry, 45 Physics, 90 Biology"""
    try:
        # NEET paper specifications
        neet_distribution = {
            "chemistry": 45,
            "physics": 45, 
            "biology": 90
        }
        
        all_questions = []
        paper_stats = {
            "chemistry": {"questions": 0, "marks": 0},
            "physics": {"questions": 0, "marks": 0}, 
            "biology": {"questions": 0, "marks": 0}
        }
        
        # Generate questions for each subject
        for subject in request.subjects:
            if subject not in neet_distribution:
                print(f"Warning: Subject {subject} not in NEET distribution")
                continue
                
            num_questions = neet_distribution[subject]
            print(f"Generating {num_questions} questions for {subject}")
            
            # Get random questions from all chapters of this subject
            subject_questions = await get_questions(
                subject_name=subject,
                chapters=None,  # Get from all chapters
                topics=None,    # Get from all topics
                limit=num_questions
            )
            
            print(f"Retrieved {len(subject_questions)} questions for {subject}")
            
            # Format questions for response
            for i, q in enumerate(subject_questions):
                formatted_question = {
                    "id": q["questionId"],
                    "question": q["question"],
                    "options": q["options"],
                    "answer": q["answer"],
                    "explanation": q["explanation"],
                    "marks": 4,  # NEET standard: 4 marks per question
                    "chapter": q["chapter"],
                    "topic": q["topic"],
                    "type": q["type"],
                    "subject": subject.title()
                }
                all_questions.append(formatted_question)
                
                # Update stats
                paper_stats[subject]["questions"] += 1
                paper_stats[subject]["marks"] += 4
        
        # Calculate totals
        total_questions = sum(stats["questions"] for stats in paper_stats.values())
        total_marks = sum(stats["marks"] for stats in paper_stats.values())
        
        print(f"Total questions generated: {total_questions}")
        print(f"Total marks: {total_marks}")
        
        if total_questions == 0:
            raise HTTPException(status_code=404, detail="No questions found for NEET paper generation. Please check if subjects have questions in the database.")
        
        return {
            "questions": all_questions,
            "total_questions": total_questions,
            "total_marks": total_marks,
            "subject_breakdown": paper_stats,
            "paper_type": "NEET",
            "subject": "NEET", # Add subject field for consistency
            "generated_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate NEET paper: {str(e)}")

@app.post("/generate-neet-pdf")
async def generate_neet_pdf(request: NEETRequest):
    """Generate NEET paper PDF with specific distribution: 45 Chemistry, 45 Physics, 90 Biology"""
    try:
        # Generate NEET questions first
        neet_data = await generate_neet_paper(request)
        questions = neet_data["questions"]
        
        # Create PDF
        pdf = FPDF()
        pdf.add_page()
        pdf.set_font('Arial', 'B', 16)
        
        # Title
        pdf.cell(0, 10, 'NEET Question Paper', 0, 1, 'C')
        pdf.ln(5)
        
        # Paper info
        pdf.set_font('Arial', '', 12)
        pdf.cell(0, 10, f'Total Questions: {neet_data["total_questions"]} | Total Marks: {neet_data["total_marks"]}', 0, 1, 'C')
        pdf.cell(0, 10, f'Chemistry: {neet_data["subject_breakdown"]["chemistry"]["questions"]} Q | Physics: {neet_data["subject_breakdown"]["physics"]["questions"]} Q | Biology: {neet_data["subject_breakdown"]["biology"]["questions"]} Q', 0, 1, 'C')
        pdf.ln(10)
        
        # Questions
        pdf.set_font('Arial', '', 10)
        current_subject = ""
        
        for i, question in enumerate(questions, 1):
            # Add subject header if changed
            if question["subject"] != current_subject:
                current_subject = question["subject"]
                pdf.set_font('Arial', 'B', 12)
                pdf.cell(0, 10, f'{current_subject.upper()} SECTION', 0, 1, 'L')
                pdf.ln(3)
                pdf.set_font('Arial', '', 10)
            
            # Question number and text
            pdf.set_font('Arial', 'B', 10)
            pdf.cell(0, 8, f'Q{i}. ({question["marks"]} marks)', 0, 1, 'L')
            
            pdf.set_font('Arial', '', 10)
            # Handle long question text
            question_text = question["question"][:200] + "..." if len(question["question"]) > 200 else question["question"]
            # Clean the text for PDF rendering
            question_text = clean_text_for_pdf(question_text)
            pdf.multi_cell(0, 6, question_text)
            pdf.ln(2)
            
            # Options for MCQ
            if question["options"]:
                for j, option in enumerate(question["options"][:4]):  # Limit to 4 options
                    option_text = option[:100] + "..." if len(option) > 100 else option
                    # Clean the option text for PDF rendering
                    option_text = clean_text_for_pdf(option_text)
                    pdf.cell(0, 5, f'  {chr(97+j)}) {option_text}', 0, 1, 'L')
            
            pdf.ln(3)
            
            # Check if we need a new page
            if pdf.get_y() > 250:
                pdf.add_page()
        
        # Create response
        pdf_output = pdf.output(dest='S').encode('latin-1')
        
        return Response(
            content=pdf_output,
            media_type="application/pdf",
            headers={"Content-Disposition": "attachment; filename=neet_paper.pdf"}
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate NEET PDF: {str(e)}")

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