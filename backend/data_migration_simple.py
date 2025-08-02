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

# Chemistry chapters mapping from JSON filenames to chapter names
CHEMISTRY_CHAPTERS = {
    "Alcohols, Phenols and Ethers.json": "Alcohols, Phenols and Ethers",
    "Aldehydes, Ketones and Carboxylic Acids.json": "Aldehydes, Ketones and Carboxylic Acids",
    "Amines .json": "Amines",
    "Biomolecules.json": "Biomolecules", 
    "Chemical Bonding and Molecular Structure.json": "Chemical Bonding and Molecular Structure",
    "Chemical Kinetics .json": "Chemical Kinetics",
    "Classification of Elements and Periodicity in Properties.json": "Classification of Elements and Periodicity in Properties",
    "Coordination Compounds .json": "Coordination Compounds",
    "Electrochemistry .json": "Electrochemistry",
    "Equilibrium.json": "Equilibrium",
    "Haloalkanes and Haloarenes.json": "Haloalkanes and Haloarenes",
    "Hydrocarbons.json": "Hydrocarbons",
    "Organic Chemistry - Some Basic Principles and Techniques.json": "Organic Chemistry - Some Basic Principles and Techniques",
    "Redox Reactions.json": "Redox Reactions",
    "Solutions .json": "Solutions",
    "some basic consept of chemistry.json": "Some Basic Concepts of Chemistry",
    "structor of atom.json": "Structure of Atom",
    "The d- and f-Block Elements.json": "The d- and f-Block Elements",
    "Thermodynamics.json": "Thermodynamics"
}

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
    # Remove numbering like "4.1" from the beginning
    cleaned = re.sub(r'^\d+\.\d+\s*', '', topic_name)
    return cleaned.strip()

def clean_text_for_db(text: str) -> str:
    """Clean text for database storage"""
    if not text:
        return text
    # Remove or replace problematic characters
    # Keep basic HTML and LaTeX math notation
    return text.strip()

async def load_subject_data(subject_name: str, display_name: str, chapters_mapping: Dict[str, str], data_directory: str):
    """Load data for a specific subject"""
    # Path to JSON data
    json_data_path = Path(data_directory)
    
    if not json_data_path.exists():
        print(f"JSON data directory not found: {json_data_path}")
        return
    
    # Create subject
    subject_id = await create_subject(subject_name, display_name)
    print(f"Subject created: {display_name} (ID: {subject_id})")
    
    total_questions = 0
    total_topics = 0
    total_chapters = 0
    
    # Process each JSON file
    for filename, chapter_name in chapters_mapping.items():
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
                    topic_key = cleaned_topic_name.lower().replace(" ", "_").replace(",", "").replace("-", "_")
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
    
    print(f"\n🎉 {display_name} data migration completed!")
    print(f"📊 {display_name} Statistics:")
    print(f"   - Chapters: {total_chapters}")
    print(f"   - Topics: {total_topics}")
    print(f"   - Questions: {total_questions}")
    
    return {
        "subject": display_name,
        "chapters": total_chapters,
        "topics": total_topics,
        "questions": total_questions
    }

async def load_chemistry_data():
    """Load all chemistry JSON files into the database"""
    return await load_subject_data("chemistry", "Chemistry", CHEMISTRY_CHAPTERS, "../json data")

async def load_physics_data():
    """Load all physics JSON files into the database"""
    return await load_subject_data("physics", "Physics", PHYSICS_CHAPTERS, "../physicsjson")

async def main():
    """Main migration function"""
    try:
        print("🚀 Starting multi-subject data migration...")
        await connect_database()
        
        # Load chemistry data
        print("\n" + "="*60)
        print("📚 LOADING CHEMISTRY DATA")
        print("="*60)
        chemistry_stats = await load_chemistry_data()
        
        # Load physics data
        print("\n" + "="*60)
        print("⚛️  LOADING PHYSICS DATA")
        print("="*60)
        physics_stats = await load_physics_data()
        
        # Print overall summary
        print("\n" + "="*60)
        print("🎊 MIGRATION COMPLETED SUCCESSFULLY!")
        print("="*60)
        print(f"📊 Overall Statistics:")
        print(f"🧪 Chemistry: {chemistry_stats['chapters']} chapters, {chemistry_stats['topics']} topics, {chemistry_stats['questions']} questions")
        print(f"⚛️  Physics: {physics_stats['chapters']} chapters, {physics_stats['topics']} topics, {physics_stats['questions']} questions")
        print(f"📈 Total: {chemistry_stats['chapters'] + physics_stats['chapters']} chapters, {chemistry_stats['topics'] + physics_stats['topics']} topics, {chemistry_stats['questions'] + physics_stats['questions']} questions")
        
    except Exception as e:
        print(f"Migration failed: {e}")
    finally:
        await disconnect_database()

if __name__ == "__main__":
    asyncio.run(main()) 