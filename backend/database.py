from prisma import Prisma
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Global Prisma client instance
prisma = Prisma()

async def connect_database():
    """Connect to the database"""
    try:
        await prisma.connect()
        print("Database connected successfully")
    except Exception as e:
        print(f"Failed to connect to database: {e}")
        raise

async def disconnect_database():
    """Disconnect from the database"""
    try:
        await prisma.disconnect()
        print("Database disconnected successfully")
    except Exception as e:
        print(f"Failed to disconnect from database: {e}")

def get_database():
    """Get the database instance"""
    return prisma 