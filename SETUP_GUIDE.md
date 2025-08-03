# Testing Platform - Setup Guide

This guide will help you set up and run the Testing Platform project locally.

## Prerequisites

Before you begin, make sure you have the following installed:

- **Node.js** (version 18 or higher)
- **npm** (comes with Node.js)
- **Git** (for cloning the repository)

### Installing Node.js

#### On macOS (using Homebrew):
```bash
brew install node
```

#### On Windows:
Download and install from [nodejs.org](https://nodejs.org/)

#### On Linux (Ubuntu/Debian):
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

#### Using Node Version Manager (nvm) - Recommended:
```bash
# Install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Restart terminal or run:
source ~/.bashrc

# Install Node.js
nvm install 18
nvm use 18
```

## Project Setup

### Step 1: Navigate to Project Directory
```bash
cd atg
```

### Step 2: Install Dependencies
```bash
npm install
```

This will install all the required dependencies including:
- Next.js 15
- React 18
- TypeScript
- Tailwind CSS
- shadcn/ui components
- And many other packages

### Step 3: Environment Configuration (Optional)

The project works with dummy data by default, but you can configure a backend server:

Create a `.env.local` file in the `atg` directory:
```bash
# Backend URL (optional - dummy data will be used if not set)
BACKEND_URL=http://localhost:8000

# Next.js configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Step 4: Start Development Server
```bash
npm run dev
```

The application will be available at: **http://localhost:3000**

## Project Structure

```
atg/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   ├── subjects/      # Subjects API
│   │   ├── chapters/      # Chapters API
│   │   ├── topics/        # Topics API
│   │   ├── generate-questions/  # Question generation API
│   │   └── generate-neet-paper/ # NEET paper generation API
│   ├── dashboard/         # Dashboard page
│   ├── custom-test/       # Custom test creation
│   ├── neet-test/         # NEET test interface
│   ├── test-interface/    # Test taking interface
│   └── test-analysis/     # Test analysis and results
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── Header.tsx        # Application header
│   ├── Footer.tsx        # Application footer
│   └── SubjectCard.tsx   # Subject selection cards
├── data/                 # Data files
│   ├── dummy-api-data.ts # Dummy API data
│   └── questions.ts      # Question database
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions
└── public/               # Static assets
```

## Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run linting
npm run lint
```

## Testing the Application

### 1. Test Dummy API Data
```bash
node test-dummy-api.js
```

This will test all the dummy data functions and show sample responses.

### 2. Test API Endpoints
Visit these URLs in your browser to test the API endpoints:

- **Subjects**: http://localhost:3000/api/subjects
- **Physics Chapters**: http://localhost:3000/api/chapters/physics
- **Physics Mechanics Topics**: http://localhost:3000/api/topics/physics/mechanics

### 3. Test Question Generation
Use a tool like Postman or curl to test question generation:

```bash
curl -X POST http://localhost:3000/api/generate-questions \
  -H "Content-Type: application/json" \
  -d '{
    "subject": "physics",
    "chapters": ["mechanics", "waves"],
    "topics": ["kinematics", "shm"],
    "num_questions": 5,
    "marks_per_question": 4,
    "chapter_weights": [
      {"chapter": "mechanics", "num_questions": 3},
      {"chapter": "waves", "num_questions": 2}
    ]
  }'
```

## Features Available

### 1. Subject Selection
- Browse available subjects (Physics, Chemistry, Biology, Mathematics)
- View subject details and statistics

### 2. Chapter Navigation
- Select chapters within each subject
- View chapter descriptions and topic lists

### 3. Topic Selection
- Browse topics within chapters
- View subtopics and question counts

### 4. Custom Test Creation
- Create custom tests with specific subjects, chapters, and topics
- Set question counts and marks per question
- Configure chapter weightage

### 5. NEET Test Generation
- Generate complete NEET mock papers
- 180 questions across Physics, Chemistry, and Biology
- Proper time limits and marking scheme

### 6. Test Interface
- Take tests with a user-friendly interface
- Timer functionality
- Question navigation

### 7. Test Analysis
- View test results and performance
- Detailed question-wise analysis
- Performance insights

## Troubleshooting

### Common Issues

#### 1. Port Already in Use
If port 3000 is already in use:
```bash
# Kill the process using port 3000
lsof -ti:3000 | xargs kill -9

# Or use a different port
npm run dev -- -p 3001
```

#### 2. Node Version Issues
Make sure you're using Node.js 18 or higher:
```bash
node --version
```

If you need to update:
```bash
nvm install 18
nvm use 18
```

#### 3. Dependency Issues
If you encounter dependency issues:
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### 4. TypeScript Errors
If you see TypeScript errors:
```bash
# Check TypeScript configuration
npx tsc --noEmit

# Fix auto-fixable issues
npm run lint -- --fix
```

### Getting Help

1. Check the console for error messages
2. Look at the browser's developer tools console
3. Check the Network tab for API request issues
4. Review the dummy data guide: `DUMMY_API_GUIDE.md`

## Next Steps

1. **Explore the Application**: Navigate through different pages and features
2. **Test API Endpoints**: Use the provided test script and manual testing
3. **Customize Data**: Modify dummy data in `data/dummy-api-data.ts`
4. **Add Backend**: Set up a backend server and configure `BACKEND_URL`
5. **Deploy**: Build and deploy the application

## Development Tips

1. **Hot Reload**: The development server supports hot reloading - changes will appear immediately
2. **TypeScript**: The project uses TypeScript for better development experience
3. **Tailwind CSS**: Use Tailwind classes for styling
4. **shadcn/ui**: Use the pre-built UI components for consistent design
5. **Dummy Data**: All features work with dummy data, so you can develop without a backend

## Support

If you encounter any issues:
1. Check the troubleshooting section above
2. Review the console logs for error messages
3. Test individual API endpoints
4. Verify that all dependencies are installed correctly

Happy coding! 🚀 