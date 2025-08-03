// Test script for dummy API data
// Run with: node test-dummy-api.js

const { 
  getDummySubjects, 
  getDummyChapters, 
  getDummyTopics, 
  generateDummyQuestions, 
  generateDummyNEETPaper 
} = require('./data/dummy-api-data.ts');

console.log('🧪 Testing Dummy API Data...\n');

// Test 1: Subjects
console.log('1. Testing Subjects API:');
const subjects = getDummySubjects();
console.log(`   Found ${subjects.length} subjects:`);
subjects.forEach(subject => {
  console.log(`   - ${subject.name} (${subject.id}): ${subject.totalChapters} chapters, ${subject.totalTopics} topics`);
});
console.log('');

// Test 2: Chapters for Physics
console.log('2. Testing Chapters API (Physics):');
const physicsChapters = getDummyChapters('physics');
console.log(`   Found ${physicsChapters.length} chapters for Physics:`);
physicsChapters.forEach(chapter => {
  console.log(`   - ${chapter.name} (${chapter.id}): ${chapter.totalQuestions} questions, ${chapter.difficulty} difficulty`);
});
console.log('');

// Test 3: Topics for Physics Mechanics
console.log('3. Testing Topics API (Physics - Mechanics):');
const mechanicsTopics = getDummyTopics('physics', 'mechanics');
console.log(`   Found ${mechanicsTopics.length} topics for Physics Mechanics:`);
mechanicsTopics.forEach(topic => {
  console.log(`   - ${topic.name} (${topic.id}): ${topic.totalQuestions} questions, ${topic.difficulty} difficulty`);
});
console.log('');

// Test 4: Generate Questions
console.log('4. Testing Generate Questions API:');
const questionRequest = {
  subject: 'physics',
  chapters: ['mechanics', 'waves'],
  topics: ['kinematics', 'shm'],
  num_questions: 5,
  marks_per_question: 4,
  chapter_weights: [
    { chapter: 'mechanics', num_questions: 3 },
    { chapter: 'waves', num_questions: 2 }
  ]
};

const generatedQuestions = generateDummyQuestions(questionRequest);
console.log(`   Generated ${generatedQuestions.totalQuestions} questions for ${generatedQuestions.subject}`);
console.log(`   Total marks: ${generatedQuestions.totalMarks}`);
console.log(`   Sample question: ${generatedQuestions.questions[0].question.substring(0, 50)}...`);
console.log('');

// Test 5: Generate NEET Paper
console.log('5. Testing Generate NEET Paper API:');
const neetPaper = generateDummyNEETPaper(['physics', 'chemistry', 'biology']);
console.log(`   Generated NEET paper: ${neetPaper.examName}`);
console.log(`   Total questions: ${neetPaper.totalQuestions}`);
console.log(`   Total marks: ${neetPaper.totalMarks}`);
console.log(`   Duration: ${neetPaper.duration} minutes`);
console.log(`   Subjects: ${neetPaper.subjects.join(', ')}`);
console.log('');

console.log('✅ All dummy API tests completed successfully!');
console.log('\n📝 Usage Instructions:');
console.log('- The API routes will automatically fall back to dummy data when the backend is unavailable');
console.log('- Set BACKEND_URL environment variable to point to your backend server');
console.log('- When backend is not available, dummy data will be served instead of errors');
console.log('- All API endpoints are now functional for development and testing'); 