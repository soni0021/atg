#!/usr/bin/env python3
"""
Setup script for ATG backend
This script sets up the database, runs migrations, and loads chemistry data
"""

import subprocess
import sys
import os
import asyncio
from pathlib import Path

def run_command(command, check=True):
    """Run a shell command"""
    print(f"Running: {command}")
    result = subprocess.run(command, shell=True, check=check, capture_output=True, text=True)
    if result.returncode != 0:
        print(f"Error: {result.stderr}")
        if check:
            sys.exit(1)
    else:
        print(f"Success: {result.stdout}")
    return result

def check_env_file():
    """Check if .env file exists and has DATABASE_URL"""
    env_file = Path(".env")
    if not env_file.exists():
        print("❌ .env file not found!")
        print("Please create a .env file with your Neon database URL:")
        print("DATABASE_URL='postgresql://username:password@your-neon-host/database?sslmode=require'")
        print("\nYou can copy from env.example and modify it.")
        sys.exit(1)
    
    with open(env_file, 'r') as f:
        content = f.read()
        if 'DATABASE_URL=' not in content:
            print("❌ DATABASE_URL not found in .env file!")
            print("Please add your Neon database URL to the .env file")
            sys.exit(1)
    
    print("✅ .env file found with DATABASE_URL")

def install_dependencies():
    """Install Python dependencies"""
    print("📦 Installing Python dependencies...")
    run_command("pip install -r requirements.txt")

def setup_prisma():
    """Setup Prisma client"""
    print("🔧 Setting up Prisma...")
    
    # Generate Prisma client
    run_command("prisma generate")
    
    # Push database schema
    print("📊 Pushing database schema...")
    run_command("prisma db push")

async def load_data():
    """Load chemistry data into database"""
    print("📚 Loading chemistry data into database...")
    try:
        from data_migration import main as migration_main
        await migration_main()
        print("✅ Chemistry data loaded successfully!")
    except Exception as e:
        print(f"❌ Error loading data: {e}")
        sys.exit(1)

def main():
    """Main setup function"""
    print("🚀 Setting up ATG Backend...")
    print("=" * 50)
    
    # Check environment
    check_env_file()
    
    # Install dependencies
    install_dependencies()
    
    # Setup Prisma
    setup_prisma()
    
    # Load data
    print("📚 Loading chemistry data...")
    asyncio.run(load_data())
    
    print("\n✅ Setup completed successfully!")
    print("You can now start the server with: python main.py")
    print("Or with: uvicorn main:app --reload")

if __name__ == "__main__":
    main() 