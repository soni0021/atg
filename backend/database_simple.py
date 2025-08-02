import asyncpg
import os
from dotenv import load_dotenv
import json
from typing import List, Dict, Any, Optional

# Load environment variables
load_dotenv()

# Global database connection pool
connection_pool = None

async def connect_database():
    """Connect to the database"""
    global connection_pool
    try:
        database_url = os.getenv("DATABASE_URL")
        if not database_url:
            raise ValueError("DATABASE_URL not found in environment variables")
        
        connection_pool = await asyncpg.create_pool(database_url)
        print("Database connected successfully")
        
        # Create tables if they don't exist
        await create_tables()
        
    except Exception as e:
        print(f"Failed to connect to database: {e}")
        raise

async def disconnect_database():
    """Disconnect from the database"""
    global connection_pool
    try:
        if connection_pool:
            await connection_pool.close()
        print("Database disconnected successfully")
    except Exception as e:
        print(f"Failed to disconnect from database: {e}")

async def create_tables():
    """Create database tables"""
    global connection_pool
    
    # SQL to create tables
    create_tables_sql = """
    -- Create subjects table
    CREATE TABLE IF NOT EXISTS subjects (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::text,
        name VARCHAR UNIQUE NOT NULL,
        display_name VARCHAR NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
    );

    -- Create chapters table
    CREATE TABLE IF NOT EXISTS chapters (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::text,
        name VARCHAR NOT NULL,
        display_name VARCHAR NOT NULL,
        subject_id VARCHAR NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(name, subject_id)
    );

    -- Create topics table
    CREATE TABLE IF NOT EXISTS topics (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::text,
        name VARCHAR NOT NULL,
        display_name VARCHAR NOT NULL,
        chapter_id VARCHAR NOT NULL REFERENCES chapters(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(name, chapter_id)
    );

    -- Create question_types enum
    DO $$ BEGIN
        CREATE TYPE question_type AS ENUM ('MCQ', 'SHORT_ANSWER', 'LONG_ANSWER', 'NUMERICAL', 'ASSERTION_REASON');
    EXCEPTION
        WHEN duplicate_object THEN null;
    END $$;

    -- Create difficulties enum
    DO $$ BEGIN
        CREATE TYPE difficulty AS ENUM ('EASY', 'MEDIUM', 'HARD');
    EXCEPTION
        WHEN duplicate_object THEN null;
    END $$;

    -- Create questions table
    CREATE TABLE IF NOT EXISTS questions (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::text,
        question_id VARCHAR UNIQUE NOT NULL,
        type question_type NOT NULL,
        question TEXT NOT NULL,
        options TEXT[],
        table_html TEXT,
        image_markdown TEXT,
        answer VARCHAR NOT NULL,
        explanation TEXT,
        difficulty difficulty DEFAULT 'MEDIUM',
        marks INTEGER DEFAULT 1,
        chapter_id VARCHAR NOT NULL REFERENCES chapters(id) ON DELETE CASCADE,
        topic_id VARCHAR REFERENCES topics(id) ON DELETE SET NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
    );
    """
    
    async with connection_pool.acquire() as conn:
        await conn.execute(create_tables_sql)
        print("Database tables created successfully")

def get_connection_pool():
    """Get the database connection pool"""
    return connection_pool

# Database operations
async def create_subject(name: str, display_name: str) -> str:
    """Create a subject and return its ID"""
    async with connection_pool.acquire() as conn:
        result = await conn.fetchrow(
            """
            INSERT INTO subjects (name, display_name) 
            VALUES ($1, $2) 
            ON CONFLICT (name) DO UPDATE SET display_name = $2
            RETURNING id
            """,
            name, display_name
        )
        return result['id']

async def create_chapter(name: str, display_name: str, subject_id: str) -> str:
    """Create a chapter and return its ID"""
    async with connection_pool.acquire() as conn:
        result = await conn.fetchrow(
            """
            INSERT INTO chapters (name, display_name, subject_id) 
            VALUES ($1, $2, $3) 
            ON CONFLICT (name, subject_id) DO UPDATE SET display_name = $2
            RETURNING id
            """,
            name, display_name, subject_id
        )
        return result['id']

async def create_topic(name: str, display_name: str, chapter_id: str) -> str:
    """Create a topic and return its ID"""
    async with connection_pool.acquire() as conn:
        result = await conn.fetchrow(
            """
            INSERT INTO topics (name, display_name, chapter_id) 
            VALUES ($1, $2, $3) 
            ON CONFLICT (name, chapter_id) DO UPDATE SET display_name = $2
            RETURNING id
            """,
            name, display_name, chapter_id
        )
        return result['id']

async def create_question(question_data: Dict[str, Any], chapter_id: str, topic_id: str) -> str:
    """Create a question and return its ID"""
    async with connection_pool.acquire() as conn:
        result = await conn.fetchrow(
            """
            INSERT INTO questions (
                question_id, type, question, options, table_html, 
                image_markdown, answer, explanation, chapter_id, topic_id
            ) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
            ON CONFLICT (question_id) DO UPDATE SET 
                question = $3, options = $4, table_html = $5,
                image_markdown = $6, answer = $7, explanation = $8
            RETURNING id
            """,
            question_data["id"],
            "MCQ",  # Default type
            question_data["question"],
            question_data.get("options", []),
            question_data.get("tableHTML"),
            question_data.get("imageMarkdown"),
            question_data["answer"],
            question_data.get("explanation"),
            chapter_id,
            topic_id
        )
        return result['id']

async def get_subjects() -> List[Dict[str, str]]:
    """Get all subjects"""
    async with connection_pool.acquire() as conn:
        rows = await conn.fetch("SELECT name, display_name FROM subjects ORDER BY display_name")
        return [{"name": row["name"], "displayName": row["display_name"]} for row in rows]

async def get_chapters(subject_name: str) -> List[Dict[str, str]]:
    """Get chapters for a subject"""
    async with connection_pool.acquire() as conn:
        rows = await conn.fetch(
            """
            SELECT c.name, c.display_name 
            FROM chapters c 
            JOIN subjects s ON c.subject_id = s.id 
            WHERE s.name = $1 
            ORDER BY c.display_name
            """,
            subject_name
        )
        return [{"name": row["name"], "displayName": row["display_name"]} for row in rows]

async def get_topics(subject_name: str, chapter_name: str) -> List[Dict[str, str]]:
    """Get topics for a chapter"""
    async with connection_pool.acquire() as conn:
        rows = await conn.fetch(
            """
            SELECT t.name, t.display_name 
            FROM topics t 
            JOIN chapters c ON t.chapter_id = c.id 
            JOIN subjects s ON c.subject_id = s.id 
            WHERE s.name = $1 AND c.name = $2 
            ORDER BY t.display_name
            """,
            subject_name, chapter_name
        )
        return [{"name": row["name"], "displayName": row["display_name"]} for row in rows]

async def get_questions(subject_name: str, chapters: List[str] = None, topics: List[str] = None, limit: int = None) -> List[Dict[str, Any]]:
    """Get questions with filters"""
    async with connection_pool.acquire() as conn:
        base_query = """
            SELECT 
                q.question_id, q.type, q.question, q.options, q.answer, 
                q.explanation, q.marks, c.display_name as chapter_name,
                t.display_name as topic_name
            FROM questions q 
            JOIN chapters c ON q.chapter_id = c.id 
            JOIN subjects s ON c.subject_id = s.id 
            LEFT JOIN topics t ON q.topic_id = t.id 
            WHERE s.name = $1
        """
        
        params = [subject_name]
        param_count = 1
        
        if chapters:
            param_count += 1
            base_query += f" AND c.name = ANY(${param_count})"
            params.append(chapters)
        
        if topics:
            param_count += 1
            base_query += f" AND t.name = ANY(${param_count})"
            params.append(topics)
        
        base_query += " ORDER BY RANDOM()"
        
        if limit:
            param_count += 1
            base_query += f" LIMIT ${param_count}"
            params.append(limit)
        
        rows = await conn.fetch(base_query, *params)
        
        return [{
            "questionId": row["question_id"],
            "type": row["type"],
            "question": row["question"],
            "options": row["options"] or [],
            "answer": row["answer"],
            "explanation": row["explanation"],
            "marks": row["marks"],
            "chapter": row["chapter_name"],
            "topic": row["topic_name"] or ""
        } for row in rows]

async def get_stats(subject_name: str) -> Dict[str, Any]:
    """Get statistics for a subject"""
    async with connection_pool.acquire() as conn:
        # Get subject info
        subject_row = await conn.fetchrow(
            "SELECT display_name FROM subjects WHERE name = $1",
            subject_name
        )
        
        if not subject_row:
            return None
        
        # Count chapters
        chapter_count = await conn.fetchval(
            """
            SELECT COUNT(*) 
            FROM chapters c 
            JOIN subjects s ON c.subject_id = s.id 
            WHERE s.name = $1
            """,
            subject_name
        )
        
        # Count topics
        topic_count = await conn.fetchval(
            """
            SELECT COUNT(*) 
            FROM topics t 
            JOIN chapters c ON t.chapter_id = c.id 
            JOIN subjects s ON c.subject_id = s.id 
            WHERE s.name = $1
            """,
            subject_name
        )
        
        # Count questions
        question_count = await conn.fetchval(
            """
            SELECT COUNT(*) 
            FROM questions q 
            JOIN chapters c ON q.chapter_id = c.id 
            JOIN subjects s ON c.subject_id = s.id 
            WHERE s.name = $1
            """,
            subject_name
        )
        
        return {
            "subject": subject_row["display_name"],
            "chapters": chapter_count,
            "topics": topic_count,
            "questions": question_count
        } 