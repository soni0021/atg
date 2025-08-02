import asyncio
import json
import os
from pathlib import Path
from database_simple import (
    connect_database, disconnect_database, create_subject, 
    create_chapter, create_topic, create_question
)
from typing import Dict, List, Any
import re

# Physics chapters mapping from JSON filenames to chapter names
PHYSICS_CHAPTERS = {
    "Units and Measurement.json": "Units and Measurement",
    "Motion in a Straight Line.json": "Motion in a Straight Line",
    "Motion in a Plane.json": "Motion in a Plane",
    "Law of Motion.json": "Laws of Motion",
    "WORK, ENERGY AND POWER.json": "Work, Energy and Power",
    "SYSTEM OF PARTICLES AND ROTATIONAL MOTION.json": "System of Particles and Rotational Motion",
    "Mechenical Properties of Solids.json": "Mechanical Properties of Solids",
    "MECHANICAL PROPERTIES OF FLUID.json": "Mechanical Properties of Fluids",
    "THERMODYNAMICS.json": "Thermodynamics",
    "KINETIC THEORY.json": "Kinetic Theory",
    "Thermal Properties of Matter.json": "Thermal Properties of Matter",
    "OSCILLATIONS.json": "Oscillations",
    "Waves.json": "Waves",
    "ELECTRIC CHARGES AND FIELDS.json": "Electric Charges and Fields"
}

def clean_topic_name(topic_name: str) -> str:
    """Clean and format topic names"""
    # Remove numbering like "1.1" from the beginning
    cleaned = re.sub(r'^\d+\.\d+\s*', '', topic_name)
    return cleaned.strip()

def clean_text_for_db(text: str) -> str:
    """Clean text for database storage"""
    if not text:
        return text
    return text.strip()

async def load_physics_data():
    """Load all physics JSON files into the database"""
    # Path to physics JSON data
    json_data_path = Path("../physicsjson")
    
    if not json_data_path.exists():
        print(f"Physics JSON data directory not found: {json_data_path}")
        return
    
    # Create physics subject
    subject_id = await create_subject("physics", "Physics")
    print(f"Subject created: Physics (ID: {subject_id})")
    
    total_questions = 0
    total_topics = 0
    total_chapters = 0
    
    # Process each physics JSON file
    for filename, chapter_name in PHYSICS_CHAPTERS.items():
        file_path = json_data_path / filename
        
        if not file_path.exists():
            print(f"File not found: {file_path}")
            continue
            
        print(f"Processing {filename}...")
        
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            # Create chapter
            chapter_key = chapter_name.lower().replace(" ", "_").replace(",", "").replace("-", "_")
            chapter_id = await create_chapter(chapter_key, chapter_name, subject_id)
            total_chapters += 1
            
            # Process topics and questions
            topics_created = {}
            question_count = 0
            
            for topic_data in data:
                topic_name = topic_data["topic"]
                cleaned_topic_name = clean_topic_name(topic_name)
                
                # Create topic if not already created
                if cleaned_topic_name not in topics_created:
                    topic_key = cleaned_topic_name.lower().replace(" ", "_").replace(",", "").replace("-", "_").replace("(", "").replace(")", "")
                    topic_id = await create_topic(topic_key, cleaned_topic_name, chapter_id)
                    topics_created[cleaned_topic_name] = topic_id
                    total_topics += 1
                else:
                    topic_id = topics_created[cleaned_topic_name]
                
                # Create questions for this topic
                for question_data in topic_data["questions"]:
                    try:
                        # Clean question data
                        cleaned_question_data = {
                            "id": question_data["id"],
                            "question": clean_text_for_db(question_data["question"]),
                            "options": [clean_text_for_db(opt) for opt in question_data.get("options", [])],
                            "tableHTML": clean_text_for_db(question_data.get("tableHTML")),
                            "imageMarkdown": clean_text_for_db(question_data.get("imageMarkdown")),
                            "answer": clean_text_for_db(question_data["answer"]),
                            "explanation": clean_text_for_db(question_data.get("explanation"))
                        }
                        
                        await create_question(cleaned_question_data, chapter_id, topic_id)
                        question_count += 1
                        total_questions += 1
                        
                        if question_count % 100 == 0:
                            print(f"  Processed {question_count} questions...")
                            
                    except Exception as e:
                        print(f"  Error processing question {question_data.get('id', 'unknown')}: {e}")
                        continue
            
            print(f"Completed {filename}: {len(topics_created)} topics, {question_count} questions")
            
        except Exception as e:
            print(f"Error processing {filename}: {e}")
            continue
    
    print(f"\n🎉 Physics data migration completed!")
    print(f"📊 Physics Statistics:")
    print(f"   - Chapters: {total_chapters}")
    print(f"   - Topics: {total_topics}")
    print(f"   - Questions: {total_questions}")

async def main():
    """Main migration function for physics only"""
    try:
        print("⚛️  Starting Physics data migration...")
        await connect_database()
        await load_physics_data()
        print("\n✅ Physics migration completed successfully!")
    except Exception as e:
        print(f"Migration failed: {e}")
    finally:
        await disconnect_database()

if __name__ == "__main__":
    asyncio.run(main()) 