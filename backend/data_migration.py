import asyncio
import json
import os
from pathlib import Path
from database import prisma, connect_database, disconnect_database
from typing import Dict, List, Any

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

def clean_topic_name(topic_name: str) -> str:
    """Clean and format topic names"""
    # Remove numbering like "4.1" from the beginning
    import re
    cleaned = re.sub(r'^\d+\.\d+\s*', '', topic_name)
    return cleaned.strip()

def determine_question_type(question_data: Dict[str, Any]) -> str:
    """Determine question type from question data"""
    if question_data.get("type") == "mcq":
        return "MCQ"
    return "MCQ"  # Default for now

async def create_subject():
    """Create chemistry subject"""
    try:
        subject = await prisma.subject.upsert(
            where={"name": "chemistry"},
            data={
                "create": {
                    "name": "chemistry",
                    "displayName": "Chemistry"
                },
                "update": {}
            }
        )
        print(f"Subject created/updated: {subject.displayName}")
        return subject
    except Exception as e:
        print(f"Error creating subject: {e}")
        raise

async def create_chapter(subject_id: str, chapter_name: str):
    """Create a chapter for the subject"""
    try:
        chapter = await prisma.chapter.upsert(
            where={"name_subjectId": {"name": chapter_name.lower().replace(" ", "_"), "subjectId": subject_id}},
            data={
                "create": {
                    "name": chapter_name.lower().replace(" ", "_"),
                    "displayName": chapter_name,
                    "subjectId": subject_id
                },
                "update": {
                    "displayName": chapter_name
                }
            }
        )
        print(f"Chapter created/updated: {chapter.displayName}")
        return chapter
    except Exception as e:
        print(f"Error creating chapter {chapter_name}: {e}")
        raise

async def create_topic(chapter_id: str, topic_name: str):
    """Create a topic for the chapter"""
    cleaned_name = clean_topic_name(topic_name)
    try:
        topic = await prisma.topic.upsert(
            where={"name_chapterId": {"name": cleaned_name.lower().replace(" ", "_"), "chapterId": chapter_id}},
            data={
                "create": {
                    "name": cleaned_name.lower().replace(" ", "_"),
                    "displayName": cleaned_name,
                    "chapterId": chapter_id
                },
                "update": {
                    "displayName": cleaned_name
                }
            }
        )
        print(f"Topic created/updated: {topic.displayName}")
        return topic
    except Exception as e:
        print(f"Error creating topic {topic_name}: {e}")
        raise

async def create_question(question_data: Dict[str, Any], chapter_id: str, topic_id: str):
    """Create a question"""
    try:
        question = await prisma.question.upsert(
            where={"questionId": question_data["id"]},
            data={
                "create": {
                    "questionId": question_data["id"],
                    "type": determine_question_type(question_data),
                    "question": question_data["question"],
                    "options": question_data.get("options", []),
                    "tableHTML": question_data.get("tableHTML"),
                    "imageMarkdown": question_data.get("imageMarkdown"),
                    "answer": question_data["answer"],
                    "explanation": question_data.get("explanation"),
                    "chapterId": chapter_id,
                    "topicId": topic_id
                },
                "update": {
                    "question": question_data["question"],
                    "options": question_data.get("options", []),
                    "tableHTML": question_data.get("tableHTML"),
                    "imageMarkdown": question_data.get("imageMarkdown"),
                    "answer": question_data["answer"],
                    "explanation": question_data.get("explanation")
                }
            }
        )
        return question
    except Exception as e:
        print(f"Error creating question {question_data['id']}: {e}")
        raise

async def load_chemistry_data():
    """Load all chemistry JSON files into the database"""
    # Path to JSON data
    json_data_path = Path("../json data")
    
    if not json_data_path.exists():
        print(f"JSON data directory not found: {json_data_path}")
        return
    
    # Create chemistry subject
    subject = await create_subject()
    
    # Process each JSON file
    for filename, chapter_name in CHEMISTRY_CHAPTERS.items():
        file_path = json_data_path / filename
        
        if not file_path.exists():
            print(f"File not found: {file_path}")
            continue
            
        print(f"Processing {filename}...")
        
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            # Create chapter
            chapter = await create_chapter(subject.id, chapter_name)
            
            # Process topics and questions
            topics_created = {}
            question_count = 0
            
            for topic_data in data:
                topic_name = topic_data["topic"]
                
                # Create topic if not already created
                if topic_name not in topics_created:
                    topic = await create_topic(chapter.id, topic_name)
                    topics_created[topic_name] = topic
                else:
                    topic = topics_created[topic_name]
                
                # Create questions for this topic
                for question_data in topic_data["questions"]:
                    await create_question(question_data, chapter.id, topic.id)
                    question_count += 1
            
            print(f"Completed {filename}: {len(topics_created)} topics, {question_count} questions")
            
        except Exception as e:
            print(f"Error processing {filename}: {e}")
            continue
    
    print("Chemistry data migration completed!")

async def main():
    """Main migration function"""
    try:
        await connect_database()
        await load_chemistry_data()
    except Exception as e:
        print(f"Migration failed: {e}")
    finally:
        await disconnect_database()

if __name__ == "__main__":
    asyncio.run(main()) 