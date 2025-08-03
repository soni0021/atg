'use client'

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Target,
  TrendingUp,
  BookOpen,
  ArrowLeft,
  RotateCcw
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  explanation?: string;
}

interface TestResults {
  questions: Question[];
  answers: { [key: number]: number };
  correctAnswers: number;
  incorrectAnswers: number;
  unattempted: number;
  totalScore: number;
  maxScore: number;
  timeSpent: number;
  subject: string;
}

function TestAnalysisContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [results, setResults] = useState<TestResults | null>(null);
  const [selectedTab, setSelectedTab] = useState("overview");

  useEffect(() => {
    // Try to get results from localStorage
    const storedResults = localStorage.getItem('testResults');
    if (storedResults) {
      try {
        const parsedResults = JSON.parse(storedResults);
        setResults(parsedResults);
        // Clear the stored results after loading
        localStorage.removeItem('testResults');
      } catch (error) {
        console.error('Error parsing test results:', error);
      }
    }
  }, []);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getQuestionResult = (questionIndex: number) => {
    if (!results) return null;
    
    const userAnswer = results.answers[questionIndex];
    const question = results.questions[questionIndex];
    
    if (userAnswer === undefined) return 'unattempted';
    
    const selectedOption = question.options[userAnswer];
    const correctAnswer = question.answer;
    
    console.log(`Analysis Q${questionIndex + 1}: Comparing "${selectedOption}" with "${correctAnswer}"`);
    
    // More flexible answer comparison
    const normalizedUserAnswer = selectedOption?.trim().toLowerCase();
    const normalizedCorrectAnswer = correctAnswer?.trim().toLowerCase();
    
    console.log(`Raw comparison - User: "${selectedOption}" vs Correct: "${correctAnswer}"`);
    console.log(`Normalized - User: "${normalizedUserAnswer}" vs Correct: "${normalizedCorrectAnswer}"`);
    
    // Check if correct answer is just a letter (a, b, c, d)
    const isLetterAnswer = /^[a-d]$/i.test(normalizedCorrectAnswer);
    
    // Also check if correct answer contains just the letter (like "a)" or "a.")
    const isLetterWithPunctuation = /^[a-d][).\s]/i.test(normalizedCorrectAnswer);
    
    if (isLetterAnswer || isLetterWithPunctuation) {
      // Extract the letter from correct answer
      const correctLetter = normalizedCorrectAnswer.match(/[a-d]/i)?.[0]?.toLowerCase();
      
      // If correct answer is just a letter, check if user's answer starts with that letter
      const userAnswerStartsWithLetter = normalizedUserAnswer?.startsWith(`(${correctLetter})`) || 
                                       normalizedUserAnswer?.startsWith(`${correctLetter})`) ||
                                       normalizedUserAnswer?.startsWith(`${correctLetter}.`) ||
                                       normalizedUserAnswer?.startsWith(`${correctLetter} `);
      
      console.log(`Letter comparison: "${normalizedUserAnswer}" starts with letter "${correctLetter}" = ${userAnswerStartsWithLetter}`);
      return userAnswerStartsWithLetter ? 'correct' : 'incorrect';
    } else {
      // Direct text comparison for full answers
      const isExactMatch = normalizedUserAnswer === normalizedCorrectAnswer;
      console.log(`Text comparison: "${normalizedUserAnswer}" === "${normalizedCorrectAnswer}" = ${isExactMatch}`);
      return isExactMatch ? 'correct' : 'incorrect';
    }
  };

  const getSubjectColor = (subject: string) => {
    switch (subject?.toLowerCase()) {
      case 'physics': return 'physics';
      case 'chemistry': return 'chemistry';
      case 'biology': return 'biology';
      default: return 'primary';
    }
  };

  const getSubjectStats = () => {
    if (!results) return {};
    
    const stats: { [subject: string]: { correct: number; incorrect: number; unattempted: number; total: number } } = {};
    
    results.questions.forEach((question, index) => {
      const subject = question.subject;
      if (!stats[subject]) {
        stats[subject] = { correct: 0, incorrect: 0, unattempted: 0, total: 0 };
      }
      
      const result = getQuestionResult(index);
      if (result) {
        stats[subject][result]++;
        stats[subject].total++;
      }
    });
    
    return stats;
  };

  if (!results) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <CardContent className="space-y-4">
            <div className="text-6xl">📊</div>
            <h2 className="text-xl font-semibold">No Test Results Found</h2>
            <p className="text-muted-foreground">
              Complete a test to see your analysis here.
            </p>
            <div className="space-y-2">
              <Button onClick={() => router.push('/custom-test')} className="w-full">
                Take Custom Test
              </Button>
              <Button onClick={() => router.push('/neet-test')} variant="outline" className="w-full">
                Take NEET Test
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const accuracy = results.totalScore > 0 ? Math.round((results.correctAnswers / (results.correctAnswers + results.incorrectAnswers)) * 100) : 0;
  const subjectStats = getSubjectStats();

  return (
    <div className="min-h-screen bg-muted/30 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="ghost" onClick={() => router.push('/dashboard')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
          <h1 className="text-3xl font-bold mb-2">Test Analysis</h1>
          <p className="text-muted-foreground">
            Detailed analysis of your {results.subject} test performance
          </p>
        </div>

        {/* Overall Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Score</p>
                  <p className="text-2xl font-bold">{results.totalScore}</p>
                  <p className="text-xs text-muted-foreground">out of {results.maxScore}</p>
                </div>
                <Target className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Accuracy</p>
                  <p className="text-2xl font-bold text-green-600">{accuracy}%</p>
                  <p className="text-xs text-muted-foreground">{results.correctAnswers} correct</p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Attempted</p>
                  <p className="text-2xl font-bold">{results.correctAnswers + results.incorrectAnswers}</p>
                  <p className="text-xs text-muted-foreground">out of {results.questions.length}</p>
                </div>
                <BookOpen className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Time Taken</p>
                  <p className="text-2xl font-bold">{formatTime(results.timeSpent)}</p>
                  <p className="text-xs text-muted-foreground">duration</p>
                </div>
                <Clock className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Subject-wise Performance */}
        {Object.keys(subjectStats).length > 1 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Subject-wise Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                {Object.entries(subjectStats).map(([subject, stats]) => (
                  <div key={subject} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold capitalize">{subject}</h3>
                      <Badge variant="secondary" className={`bg-${getSubjectColor(subject)}/10 text-${getSubjectColor(subject)}`}>
                        {stats.total} questions
                      </Badge>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-green-600">Correct: {stats.correct}</span>
                        <span className="text-red-600">Wrong: {stats.incorrect}</span>
                        <span className="text-gray-600">Skipped: {stats.unattempted}</span>
                      </div>
                      <Progress 
                        value={(stats.correct / stats.total) * 100} 
                        className="h-2"
                      />
                      <p className="text-xs text-muted-foreground text-center">
                        {Math.round((stats.correct / stats.total) * 100)}% accuracy
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Detailed Analysis */}
        <Card>
          <CardHeader>
            <CardTitle>Detailed Question Analysis</CardTitle>
            <CardDescription>Review each question with correct answers and explanations</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={selectedTab} onValueChange={setSelectedTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="correct">Correct ({results.correctAnswers})</TabsTrigger>
                <TabsTrigger value="incorrect">Wrong ({results.incorrectAnswers})</TabsTrigger>
                <TabsTrigger value="unattempted">Skipped ({results.unattempted})</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="grid gap-4">
                  {results.questions.map((question, index) => {
                    const result = getQuestionResult(index);
                    const userAnswer = results.answers[index];
                    
                    return (
                      <Card key={question.id} className={`border-l-4 ${
                        result === 'correct' ? 'border-green-500' : 
                        result === 'incorrect' ? 'border-red-500' : 'border-gray-400'
                      }`}>
                        <CardContent className="pt-4">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold">Q{index + 1}.</span>
                              <Badge variant="outline" className="text-xs">
                                {question.chapter}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {question.topic}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2">
                              {result === 'correct' && <CheckCircle className="w-5 h-5 text-green-600" />}
                              {result === 'incorrect' && <XCircle className="w-5 h-5 text-red-600" />}
                              {result === 'unattempted' && <Clock className="w-5 h-5 text-gray-400" />}
                            </div>
                          </div>
                          
                          <p className="mb-3 text-sm">{question.question}</p>
                          
                          <div className="grid gap-2 mb-3">
                            {question.options.map((option, optionIndex) => {
                              const isCorrectAnswer = option?.trim().toLowerCase() === question.answer?.trim().toLowerCase();
                              const isUserAnswer = userAnswer === optionIndex;
                              
                              return (
                                <div
                                  key={optionIndex}
                                  className={`p-2 rounded text-xs border ${
                                    isCorrectAnswer 
                                      ? 'bg-green-100 border-green-300 text-green-800'
                                      : isUserAnswer && !isCorrectAnswer
                                      ? 'bg-red-100 border-red-300 text-red-800'
                                      : 'bg-gray-50 border-gray-200'
                                  }`}
                                >
                                  <span className="font-medium mr-2">
                                    {String.fromCharCode(65 + optionIndex)}.
                                  </span>
                                  {option}
                                  {isCorrectAnswer && <span className="ml-2 text-green-600">✓ Correct</span>}
                                  {isUserAnswer && !isCorrectAnswer && <span className="ml-2 text-red-600">✗ Your answer</span>}
                                </div>
                              );
                            })}
                          </div>
                          
                          {question.explanation && (
                            <div className="bg-blue-50 p-3 rounded text-xs">
                              <p className="font-medium text-blue-800 mb-1">Explanation:</p>
                              <p className="text-blue-700">{question.explanation}</p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </TabsContent>

              <TabsContent value="correct" className="space-y-4">
                {results.questions
                  .map((question, index) => ({ question, index, result: getQuestionResult(index) }))
                  .filter(({ result }) => result === 'correct')
                  .map(({ question, index }) => (
                    <Card key={question.id} className="border-l-4 border-green-500">
                      <CardContent className="pt-4">
                        <div className="flex items-start justify-between mb-2">
                          <span className="font-semibold text-green-600">Q{index + 1}. ✓ Correct</span>
                          <Badge variant="outline">{question.chapter}</Badge>
                        </div>
                        <p className="text-sm mb-2">{question.question}</p>
                        <div className="bg-green-100 p-2 rounded text-xs">
                          <span className="font-medium">Correct Answer: </span>
                          {question.answer}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </TabsContent>

              <TabsContent value="incorrect" className="space-y-4">
                {results.questions
                  .map((question, index) => ({ question, index, result: getQuestionResult(index) }))
                  .filter(({ result }) => result === 'incorrect')
                  .map(({ question, index }) => {
                    const userAnswer = results.answers[index];
                    return (
                      <Card key={question.id} className="border-l-4 border-red-500">
                        <CardContent className="pt-4">
                          <div className="flex items-start justify-between mb-2">
                            <span className="font-semibold text-red-600">Q{index + 1}. ✗ Incorrect</span>
                            <Badge variant="outline">{question.chapter}</Badge>
                          </div>
                          <p className="text-sm mb-3">{question.question}</p>
                          
                          <div className="space-y-2 mb-3">
                            <div className="bg-red-100 p-2 rounded text-xs">
                              <span className="font-medium text-red-800">Your Answer: </span>
                              <span className="text-red-700">{question.options[userAnswer]}</span>
                            </div>
                            <div className="bg-green-100 p-2 rounded text-xs">
                              <span className="font-medium text-green-800">Correct Answer: </span>
                              <span className="text-green-700">{question.answer}</span>
                            </div>
                            <div className="bg-yellow-50 p-2 rounded text-xs border border-yellow-200">
                              <span className="font-medium text-yellow-800">Comparison: </span>
                              <span className="text-yellow-700">
                                &quot;{question.options[userAnswer]?.trim()}&quot; vs &quot;{question.answer?.trim()}&quot;
                                {(() => {
                                  const userAnswerText = question.options[userAnswer]?.trim().toLowerCase();
                                  const correctAnswerText = question.answer?.trim().toLowerCase();
                                  const isLetterAnswer = /^[a-d]$/i.test(correctAnswerText);
                                  const isLetterWithPunctuation = /^[a-d][).\s]/i.test(correctAnswerText);
                                  
                                  if (isLetterAnswer || isLetterWithPunctuation) {
                                    const correctLetter = correctAnswerText.match(/[a-d]/i)?.[0]?.toLowerCase();
                                    const userAnswerStartsWithLetter = userAnswerText?.startsWith(`(${correctLetter})`) || 
                                                                     userAnswerText?.startsWith(`${correctLetter})`) ||
                                                                     userAnswerText?.startsWith(`${correctLetter}.`) ||
                                                                     userAnswerText?.startsWith(`${correctLetter} `);
                                    return userAnswerStartsWithLetter ? 
                                      " ✓ (Letter match)" : 
                                      " ✗ (Letter mismatch)";
                                  } else {
                                    return userAnswerText === correctAnswerText ? 
                                      " ✓ (Text match)" : 
                                      " ✗ (Text mismatch)";
                                  }
                                })()}
                              </span>
                            </div>
                          </div>
                          
                          {question.explanation && (
                            <div className="bg-blue-50 p-3 rounded text-xs">
                              <p className="font-medium text-blue-800 mb-1">Explanation:</p>
                              <p className="text-blue-700">{question.explanation}</p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
              </TabsContent>

              <TabsContent value="unattempted" className="space-y-4">
                {results.questions
                  .map((question, index) => ({ question, index, result: getQuestionResult(index) }))
                  .filter(({ result }) => result === 'unattempted')
                  .map(({ question, index }) => (
                    <Card key={question.id} className="border-l-4 border-gray-400">
                      <CardContent className="pt-4">
                        <div className="flex items-start justify-between mb-2">
                          <span className="font-semibold text-gray-600">Q{index + 1}. - Skipped</span>
                          <Badge variant="outline">{question.chapter}</Badge>
                        </div>
                        <p className="text-sm mb-2">{question.question}</p>
                        <div className="bg-green-100 p-2 rounded text-xs">
                          <span className="font-medium text-green-800">Correct Answer: </span>
                          <span className="text-green-700">{question.answer}</span>
                        </div>
                        {question.explanation && (
                          <div className="bg-blue-50 p-3 rounded text-xs mt-2">
                            <p className="font-medium text-blue-800 mb-1">Explanation:</p>
                            <p className="text-blue-700">{question.explanation}</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 mt-8">
          <Button onClick={() => router.push('/custom-test')} variant="outline">
            <RotateCcw className="w-4 h-4 mr-2" />
            Take Another Test
          </Button>
          <Button onClick={() => router.push('/dashboard')}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function TestAnalysis() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TestAnalysisContent />
    </Suspense>
  );
}