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

# Biology chapters mapping from JSON filenames to chapter names
BIOLOGY_CHAPTERS = {
    "the living world.json": "The Living World",
    "Biological Classification.json": "Biological Classification",
    "Plant Kingdom.json": "Plant Kingdom",
    "Animal Kingdom.json": "Animal Kingdom",
    "Morphology of Flowering Plants.json": "Morphology of Flowering Plants",
    "Anatomy of Flowering Plants.json": "Anatomy of Flowering Plants",
    "Structural Organisation In Animals.json": "Structural Organisation in Animals",
    "Cell Unit Of Life.json": "Cell: The Unit of Life",
    "Cell Cycle and Cell Division.json": "Cell Cycle and Cell Division",
    "Photosynthesis in Higher Plants.json": "Photosynthesis in Higher Plants",
    "Respiration in Plants.json": "Respiration in Plants",
    "Plant Growth and Development.json": "Plant Growth and Development",
    "Body Fluids and Circulation.json": "Body Fluids and Circulation",
    "Excretory Products and their Elimination.json": "Excretory Products and their Elimination",
    "Locomotion and Movement.json": "Locomotion and Movement",
    "Neural Control and Coordination.json": "Neural Control and Coordination",
    "Principles of Inheritance and Variation.json": "Principles of Inheritance and Variation",
    "Molecular Basis of Inheritance.json": "Molecular Basis of Inheritance",
    "Evolution.json": "Evolution",
    "Human Health and Disease.json": "Human Health and Disease",
    "Microbes in Human Welfare.json": "Microbes in Human Welfare",
    "Biotechnology and its Applications.json": "Biotechnology and its Applications",
    "Organisms and Populations.json": "Organisms and Populations",
    "Ecosystem.json": "Ecosystem",
    "Biodiversity and Conservation.json": "Biodiversity and Conservation",
    "1. Sexual Reproduction in Flowering Plants.json": "Sexual Reproduction in Flowering Plants",
    "Reproductive Health.json": "Reproductive Health",
}

def clean_topic_name(topic_name: str) -> str:
    """Clean and format topic names"""
    # Remove numbering like "1.1" from the beginning and clean up extra text
    cleaned = re.sub(r'^\d+\.\d+\s*', '', topic_name)
    # Remove "TOPPER'S CHOICE - " prefix if present
    cleaned = re.sub(r'^TOPPER\'S CHOICE\s*-\s*', '', cleaned)
    return cleaned.strip()

def clean_text_for_db(text: str) -> str:
    """Clean text for database storage"""
    if not text:
        return text
    return text.strip()

async def load_biology_data():
    """Load all biology JSON files into the database"""
    # Path to biology JSON data
    json_data_path = Path("../biojson")
    
    if not json_data_path.exists():
        print(f"Biology JSON data directory not found: {json_data_path}")
        return
    
    # Create biology subject
    subject_id = await create_subject("biology", "Biology")
    print(f"Subject created: Biology (ID: {subject_id})")
    
    total_questions = 0
    total_topics = 0
    total_chapters = 0
    
    # Process each biology JSON file
    for filename, chapter_name in BIOLOGY_CHAPTERS.items():
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
                    topic_key = cleaned_topic_name.lower().replace(" ", "_").replace(",", "").replace("-", "_").replace("(", "").replace(")", "").replace("'", "")
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
    
    print(f"\n🎉 Biology data migration completed!")
    print(f"📊 Biology Statistics:")
    print(f"   - Chapters: {total_chapters}")
    print(f"   - Topics: {total_topics}")
    print(f"   - Questions: {total_questions}")

async def main():
    """Main migration function for biology only"""
    try:
        print("🧬 Starting Biology data migration...")
        await connect_database()
        await load_biology_data()
        print("\n✅ Biology migration completed successfully!")
    except Exception as e:
        print(f"Migration failed: {e}")
    finally:
        await disconnect_database()

if __name__ == "__main__":
    asyncio.run(main()) 