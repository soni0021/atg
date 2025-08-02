'use client'

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  SkipForward, 
  Flag,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Target,
  Timer
} from "lucide-react";

// Question interface matching the backend response
interface Question {
  id: string;
  subject: string;
  chapter: string;
  topic: string;
  question: string;
  options: string[];
  answer: string;
  marks: number;
  type: string;
  imageMarkdown?: string;
  tableHTML?: string;
  explanation?: string;
}

export default function TestInterface() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [testData, setTestData] = useState<any>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: number }>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<number>>(new Set());
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isTestStarted, setIsTestStarted] = useState(false);

  useEffect(() => {
    console.log('Test Interface - URL Search Params:', searchParams.toString());
    
    // Check if this is a custom test from sessionStorage
    const source = searchParams.get('source');
    if (source === 'custom') {
      try {
        const storedData = sessionStorage.getItem('customTestData');
        if (storedData) {
          const data = JSON.parse(storedData);
          console.log('Loaded test data from sessionStorage:', data);
          console.log('Questions found:', data.questions?.length || 0);
          console.log('First question sample:', data.questions?.[0]);
          
          if (data.questions && Array.isArray(data.questions) && data.questions.length > 0) {
            setTestData(data);
            setQuestions(data.questions);
            setTimeRemaining(data.questions.length * 90); // 1.5 minutes per question
            setCurrentQuestionIndex(0); // Ensure we start at question 0
            
            // Clear the stored data to free memory
            sessionStorage.removeItem('customTestData');
            return;
          } else {
            console.error('Invalid questions data:', data.questions);
          }
        }
      } catch (error) {
        console.error('Error loading test data from sessionStorage:', error);
      }
    }
    
    // Check for real test data in URL (fallback)
    const dataParam = searchParams.get('data');
    console.log('Data parameter found:', !!dataParam);
    
    if (dataParam) {
      try {
        console.log('Raw data param length:', dataParam.length);
        const data = JSON.parse(decodeURIComponent(dataParam));
        console.log('Parsed test data:', data);
        console.log('Questions found:', data.questions?.length || 0);
        
        setTestData(data);
        setQuestions(data.questions || []);
        setTimeRemaining((data.questions?.length || 50) * 90); // 1.5 minutes per question
        return;
      } catch (error) {
        console.error('Error parsing test data:', error);
        console.error('Raw data param (first 200 chars):', dataParam.substring(0, 200));
      }
    }

    // Fallback to old config format for backward compatibility
    const configParam = searchParams.get('config');
    console.log('Config parameter found:', !!configParam);
    
    if (configParam) {
      try {
        const config = JSON.parse(decodeURIComponent(configParam));
        console.log('Parsed config:', config);
        setTestData(config);
        // Generate mock questions based on config
        const generatedQuestions = generateMockQuestions(config);
        console.log('Generated mock questions:', generatedQuestions.length);
        setQuestions(generatedQuestions);
        setTimeRemaining(generatedQuestions.length * 90); // 1.5 minutes per question
      } catch (error) {
        console.error('Error parsing test config:', error);
      }
    }
    
    if (!dataParam && !configParam && source !== 'custom') {
      console.log('No data, config parameter, or custom source found');
    }
  }, [searchParams]);

  const generateMockQuestions = (config: any): Question[] => {
    return Array.from({ length: config.totalQuestions || 50 }, (_, i) => ({
      id: `mock_${i + 1}`,
      subject: config.subjects?.[i % config.subjects.length] || 'physics',
      chapter: 'Sample Chapter',
      topic: 'Sample Topic',
      question: `This is a sample question ${i + 1}. Which of the following options is correct?`,
      options: [
        "Option A - This could be the correct answer",
        "Option B - This might also be correct", 
        "Option C - Another possible answer",
        "Option D - The final option"
      ],
      answer: ["Option A - This could be the correct answer", "Option B - This might also be correct", "Option C - Another possible answer", "Option D - The final option"][Math.floor(Math.random() * 4)],
      marks: 4,
      type: 'MCQ'
    }));
  };

  const submitTest = useCallback(() => {
    // Calculate score
    let correctAnswers = 0;
    let incorrectAnswers = 0;
    let totalScore = 0;

    Object.entries(answers).forEach(([questionIndex, selectedOptionIndex]) => {
      const question = questions[parseInt(questionIndex)];
      if (question) {
        const userAnswer = question.options[selectedOptionIndex];
        const correctAnswer = question.answer;
        
        console.log(`Q${parseInt(questionIndex) + 1}: User answered "${userAnswer}", Correct answer is "${correctAnswer}"`);
        
        // More flexible answer comparison
        const normalizedUserAnswer = userAnswer?.trim().toLowerCase();
        const normalizedCorrectAnswer = correctAnswer?.trim().toLowerCase();
        
        console.log(`Raw comparison - User: "${userAnswer}" vs Correct: "${correctAnswer}"`);
        console.log(`Normalized - User: "${normalizedUserAnswer}" vs Correct: "${normalizedCorrectAnswer}"`);
        
        // Check if correct answer is just a letter (a, b, c, d)
        const isLetterAnswer = /^[a-d]$/i.test(normalizedCorrectAnswer);
        
        // Also check if correct answer contains just the letter (like "a)" or "a.")
        const isLetterWithPunctuation = /^[a-d][).\s]/i.test(normalizedCorrectAnswer);
        
        let isCorrect = false;
        
        if (isLetterAnswer || isLetterWithPunctuation) {
          // Extract the letter from correct answer
          const correctLetter = normalizedCorrectAnswer.match(/[a-d]/i)?.[0]?.toLowerCase();
          
          // If correct answer is just a letter, check if user's answer starts with that letter
          const userAnswerStartsWithLetter = normalizedUserAnswer?.startsWith(`(${correctLetter})`) || 
                                           normalizedUserAnswer?.startsWith(`${correctLetter})`) ||
                                           normalizedUserAnswer?.startsWith(`${correctLetter}.`) ||
                                           normalizedUserAnswer?.startsWith(`${correctLetter} `);
          isCorrect = userAnswerStartsWithLetter;
        } else {
          // Direct text comparison for full answers
          isCorrect = normalizedUserAnswer === normalizedCorrectAnswer;
        }
        
        if (isCorrect) {
          correctAnswers++;
          totalScore += question.marks || 4;
          console.log(`✓ Correct! (${isLetterAnswer ? 'Letter match' : 'Text match'})`);
        } else {
          incorrectAnswers++;
          totalScore -= 1; // -1 for wrong answer
          console.log(`✗ Wrong: "${userAnswer}" !== "${correctAnswer}" (${isLetterAnswer ? 'Letter mismatch' : 'Text mismatch'})`);
        }
      }
    });

    const results = {
      questions,
      answers,
      correctAnswers,
      incorrectAnswers,
      unattempted: questions.length - Object.keys(answers).length,
      totalScore,
      maxScore: questions.length * (questions[0]?.marks || 4),
      timeSpent: (questions.length * 90) - timeRemaining,
      flaggedQuestions: Array.from(flaggedQuestions),
      subject: testData?.subject || 'Custom Test'
    };

    // Store results and redirect to analysis page
    localStorage.setItem('testResults', JSON.stringify(results));
    router.push('/test-analysis');
  }, [questions, answers, timeRemaining, flaggedQuestions, router, testData]);

  useEffect(() => {
    if (isTestStarted && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            submitTest();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isTestStarted, timeRemaining, submitTest]);

  const startTest = () => {
    setIsTestStarted(true);
  };

  const selectAnswer = (optionIndex: number) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestionIndex]: optionIndex
    }));
  };

  const toggleFlag = () => {
    setFlaggedQuestions(prev => {
      const newFlagged = new Set(prev);
      if (newFlagged.has(currentQuestionIndex)) {
        newFlagged.delete(currentQuestionIndex);
      } else {
        newFlagged.add(currentQuestionIndex);
      }
      return newFlagged;
    });
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getQuestionStatus = (index: number) => {
    if (answers[index] !== undefined) return 'answered';
    if (flaggedQuestions.has(index)) return 'flagged';
    return 'unanswered';
  };

  const getSubjectColor = (subject: string) => {
    switch (subject) {
      case 'physics': return 'physics';
      case 'chemistry': return 'chemistry';
      case 'biology': return 'biology';
      default: return 'primary';
    }
  };

  if (!testData || questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <CardContent className="space-y-4">
            <div className="text-6xl">🤔</div>
            <h2 className="text-xl font-semibold">No Test Data Found</h2>
            <p className="text-muted-foreground">
              It looks like the test data didn't load properly. This could happen if:
            </p>
            <ul className="text-sm text-left text-muted-foreground space-y-1">
              <li>• The test data was too large to pass through the URL</li>
              <li>• There was an error generating questions</li>
              <li>• The session expired</li>
            </ul>
            <div className="space-y-2">
              <Button onClick={() => router.push('/custom-test')} className="w-full">
                Create New Test
              </Button>
              <Button onClick={() => window.location.reload()} variant="outline" className="w-full">
                Reload Page
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  // Debug logging
  console.log('Current question index:', currentQuestionIndex);
  console.log('Total questions:', questions.length);
  console.log('Current question:', currentQuestion);
  console.log('Current question subject:', currentQuestion?.subject);

  // Safety check to ensure we have a valid current question
  if (!currentQuestion && questions.length > 0) {
    console.error('Current question is undefined, but questions exist. Index:', currentQuestionIndex, 'Total:', questions.length);
    console.error('All questions:', questions);
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <CardContent className="space-y-4">
            <div className="text-6xl">⚠️</div>
            <h2 className="text-xl font-semibold">Question Loading Error</h2>
            <p className="text-muted-foreground">
              There was an issue loading the current question.
            </p>
            <Button onClick={() => setCurrentQuestionIndex(0)} className="w-full">
              Go to First Question
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isTestStarted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <Card className="max-w-2xl w-full mx-4 shadow-strong">
          <CardHeader className="text-center pb-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
              <Target className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-3xl mb-2">Test Ready!</CardTitle>
            <p className="text-muted-foreground">
              You&apos;re about to start your custom test with {questions.length} questions
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-3 gap-4 text-center">
              <div className="p-4 bg-primary/5 rounded-lg">
                <BookOpen className="w-6 h-6 text-primary mx-auto mb-2" />
                <div className="font-semibold">{questions.length}</div>
                <div className="text-sm text-muted-foreground">Questions</div>
              </div>
              <div className="p-4 bg-accent/5 rounded-lg">
                <Timer className="w-6 h-6 text-accent mx-auto mb-2" />
                <div className="font-semibold">{formatTime(timeRemaining)}</div>
                <div className="text-sm text-muted-foreground">Time Limit</div>
              </div>
              <div className="p-4 bg-secondary/5 rounded-lg">
                <Target className="w-6 h-6 text-secondary mx-auto mb-2" />
                <div className="font-semibold">+4, -1</div>
                <div className="text-sm text-muted-foreground">Marking</div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold">Test Instructions:</h4>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• Each correct answer awards +4 marks</li>
                <li>• Each incorrect answer deducts -1 mark</li>
                <li>• Unanswered questions carry no penalty</li>
                <li>• You can flag questions for review</li>
                <li>• Submit the test before time runs out</li>
              </ul>
            </div>

            <Button 
              onClick={startTest} 
              className="w-full" 
              size="lg"
              variant="hero"
            >
              Start Test
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background/90 backdrop-blur-md border-b shadow-soft">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                <span className="font-mono text-lg font-semibold">
                  {formatTime(timeRemaining)}
                </span>
              </div>
              <div className="text-sm text-muted-foreground">
                Question {currentQuestionIndex + 1} of {questions.length}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={toggleFlag}>
                <Flag className={`w-4 h-4 ${flaggedQuestions.has(currentQuestionIndex) ? 'text-yellow-500' : ''}`} />
                {flaggedQuestions.has(currentQuestionIndex) ? 'Unflag' : 'Flag'}
              </Button>
              <Button variant="destructive" size="sm" onClick={submitTest}>
                Submit Test
              </Button>
            </div>
          </div>
          
          <Progress 
            value={((currentQuestionIndex + 1) / questions.length) * 100} 
            className="mt-3"
          />
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Question Panel */}
          <div className="lg:col-span-3">
            <Card className="shadow-soft">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary" className={`bg-${getSubjectColor(currentQuestion?.subject || '')}/10 text-${getSubjectColor(currentQuestion?.subject || '')}`}>
                      {currentQuestion?.subject ? 
                        currentQuestion.subject.charAt(0).toUpperCase() + currentQuestion.subject.slice(1).toLowerCase() : 
                        'Unknown Subject'
                      }
                    </Badge>
                    <Badge variant="outline">
                      {currentQuestion?.chapter || 'Unknown Chapter'}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {currentQuestion?.topic || 'Unknown Topic'}
                    </Badge>
                  </div>
                  <Badge variant="outline">
                    {currentQuestion?.type || 'MCQ'}
                  </Badge>
                </div>
                <CardTitle className="text-xl leading-relaxed">
                  Q{currentQuestionIndex + 1}. {currentQuestion?.question || 'Question not available'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {currentQuestion?.imageMarkdown && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Image: {currentQuestion.imageMarkdown}</p>
                  </div>
                )}
                
                {currentQuestion?.tableHTML && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div dangerouslySetInnerHTML={{ __html: currentQuestion.tableHTML }} />
                  </div>
                )}

                <div className="grid gap-3">
                  {(currentQuestion?.options || []).map((option, index) => (
                    <button
                      key={index}
                      onClick={() => selectAnswer(index)}
                      className={`p-4 text-left border-2 rounded-lg transition-smooth ${
                        answers[currentQuestionIndex] === index
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className="flex items-center">
                        <span className="w-6 h-6 rounded-full border-2 border-current flex items-center justify-center mr-3 text-sm font-medium">
                          {String.fromCharCode(65 + index)}
                        </span>
                        {option}
                      </div>
                    </button>
                  ))}
                </div>

                <div className="flex justify-between pt-6">
                  <Button
                    variant="outline"
                    onClick={previousQuestion}
                    disabled={currentQuestionIndex === 0}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Previous
                  </Button>
                  
                  <Button
                    onClick={nextQuestion}
                    disabled={currentQuestionIndex === questions.length - 1}
                  >
                    Next
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Question Navigation */}
          <div className="space-y-4">
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="text-lg">Question Palette</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-5 gap-2">
                  {questions.map((_, index) => {
                    const status = getQuestionStatus(index);
                    return (
                      <button
                        key={index}
                        onClick={() => setCurrentQuestionIndex(index)}
                        className={`w-10 h-10 rounded-lg text-sm font-medium transition-smooth ${
                          index === currentQuestionIndex
                            ? 'bg-primary text-primary-foreground'
                            : status === 'answered'
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : status === 'flagged'
                            ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                            : 'bg-muted text-muted-foreground hover:bg-muted/80'
                        }`}
                      >
                        {index + 1}
                      </button>
                    );
                  })}
                </div>
                
                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-green-100"></div>
                    <span>Answered ({Object.keys(answers).length})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-yellow-100"></div>
                    <span>Flagged ({flaggedQuestions.size})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-muted"></div>
                    <span>Not Visited ({questions.length - Object.keys(answers).length - flaggedQuestions.size})</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}