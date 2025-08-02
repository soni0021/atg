'use client'

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Clock, CheckCircle, XCircle, AlertCircle, BookOpen, Timer } from "lucide-react";
import { useRouter } from "next/navigation";
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

export default function NEETTest() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{[key: number]: number}>({});
  const [timeLeft, setTimeLeft] = useState(10800); // 3 hours in seconds
  const [isTestStarted, setIsTestStarted] = useState(false);
  const [isTestCompleted, setIsTestCompleted] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const generateNEETTest = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/generate-neet-paper', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subjects: ["chemistry", "physics", "biology"]
        }),
      });

      if (response.ok) {
        const neetData = await response.json();
        setQuestions(neetData.questions);
      } else {
        throw new Error('Failed to generate NEET test');
      }
    } catch (error) {
      console.error('Error generating NEET test:', error);
      setError('Failed to generate NEET test. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const physics = questions.filter(q => q.subject.toLowerCase() === "physics");
  const chemistry = questions.filter(q => q.subject.toLowerCase() === "chemistry"); 
  const biology = questions.filter(q => q.subject.toLowerCase() === "biology");

  // Timer effect
  useEffect(() => {
    if (isTestStarted && !isTestCompleted && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(time => {
          if (time <= 1) {
            setIsTestCompleted(true);
            return 0;
          }
          return time - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isTestStarted, isTestCompleted, timeLeft]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswer = (optionIndex: number) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion]: optionIndex
    }));
  };

  const goToQuestion = (index: number) => {
    setCurrentQuestion(index);
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const submitTest = () => {
    setIsTestCompleted(true);
  };

  const startTest = async () => {
    if (questions.length === 0) {
      await generateNEETTest();
    }
    if (questions.length > 0) {
      setIsTestStarted(true);
    }
  };

  const getQuestionStatus = (index: number) => {
    if (answers[index] !== undefined) return "answered";
    if (index === currentQuestion) return "current";
    return "unanswered";
  };

  const getSubjectColor = (subject: string) => {
    switch (subject.toLowerCase()) {
      case "physics": return "physics";
      case "chemistry": return "chemistry"; 
      case "biology": return "biology";
      default: return "primary";
    }
  };

  const answered = Object.keys(answers).length;
  const unanswered = questions.length - answered;

  if (!isTestStarted) {
    return (
      <div className="min-h-screen py-8 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="shadow-strong border-0">
              <CardHeader className="text-center">
                <div className="w-16 h-16 rounded-full hero-gradient flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-3xl mb-2">NEET Mock Test 2024</CardTitle>
                <CardDescription className="text-lg">
                  Complete simulation of NEET exam with official pattern and timing
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-3 gap-6">
                  <Card className="text-center">
                    <CardContent className="pt-6">
                      <div className="text-2xl font-bold text-primary mb-2">180</div>
                      <div className="text-sm text-muted-foreground">Total Questions</div>
                    </CardContent>
                  </Card>
                  <Card className="text-center">
                    <CardContent className="pt-6">
                      <div className="text-2xl font-bold text-accent mb-2">3:00:00</div>
                      <div className="text-sm text-muted-foreground">Duration</div>
                    </CardContent>
                  </Card>
                  <Card className="text-center">
                    <CardContent className="pt-6">
                      <div className="text-2xl font-bold text-secondary mb-2">720</div>
                      <div className="text-sm text-muted-foreground">Total Marks</div>
                    </CardContent>
                  </Card>
                </div>

                <div className="bg-muted/50 p-6 rounded-lg">
                  <h3 className="font-semibold mb-4">Subject Distribution:</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 physics-gradient rounded-full"></div>
                      <span>Physics - 45 Questions</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 chemistry-gradient rounded-full"></div>
                      <span>Chemistry - 45 Questions</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 biology-gradient rounded-full"></div>
                      <span>Biology - 90 Questions</span>
                    </div>
                  </div>
                </div>

                <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
                  <h4 className="font-semibold text-amber-800 mb-2 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    Important Instructions:
                  </h4>
                  <ul className="text-sm text-amber-700 space-y-1">
                    <li>• Each question carries 4 marks for correct answer</li>
                    <li>• 1 mark will be deducted for wrong answer</li>
                    <li>• No marks for unattempted questions</li>
                    <li>• Test will auto-submit after 3 hours</li>
                  </ul>
                </div>

                <Button 
                  variant="hero" 
                  size="lg" 
                  className="w-full text-lg py-6" 
                  onClick={startTest}
                  disabled={loading}
                >
                  <Timer className="w-5 h-5 mr-2" />
                  {loading ? 'Generating Test...' : 'Start NEET Test'}
                </Button>
                {error && (
                  <div className="text-red-600 text-center mt-4">
                    {error}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (isTestCompleted) {
    // Calculate detailed results
    let correctAnswers = 0;
    let incorrectAnswers = 0;
    let totalScore = 0;

    Object.entries(answers).forEach(([qIndex, answerIndex]) => {
      const question = questions[parseInt(qIndex)];
      if (question) {
        const userAnswer = question.options[answerIndex];
        const correctAnswer = question.answer;
        
        console.log(`NEET Q${parseInt(qIndex) + 1}: User answered "${userAnswer}", Correct answer is "${correctAnswer}"`);
        
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
          totalScore += 4;
          console.log(`✓ Correct! (${isLetterAnswer ? 'Letter match' : 'Text match'})`);
        } else {
          incorrectAnswers++;
          totalScore -= 1;
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
      maxScore: questions.length * 4,
      timeSpent: 10800 - timeLeft, // 3 hours - remaining time
      subject: 'NEET'
    };

    // Store results and redirect to analysis
    localStorage.setItem('testResults', JSON.stringify(results));
    router.push('/test-analysis');
    
    return null; // This component will unmount as we're navigating away
  }

  const question = questions[currentQuestion];

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Top Bar */}
      <div className="bg-white border-b shadow-soft sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="text-sm">
                Question {currentQuestion + 1} of {questions.length}
              </Badge>
              <Badge variant={getSubjectColor(question.subject) as any} className="text-sm">
                {question.subject}
              </Badge>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-red-50 px-3 py-1 rounded-lg">
                <Clock className="w-4 h-4 text-red-600" />
                <span className="font-mono text-sm font-medium text-red-600">
                  {formatTime(timeLeft)}
                </span>
              </div>
              <Button variant="destructive" onClick={submitTest}>
                Submit Test
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Question Panel */}
          <div className="lg:col-span-3">
            <Card className="shadow-soft border-0">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">Question {currentQuestion + 1}</CardTitle>
                    <CardDescription>
                      {question.chapter} • {question.topic}
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">{question.type}</Badge>
                    <Badge variant="secondary">+{question.marks} marks</Badge>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div className="text-lg leading-relaxed">
                  {question.question}
                </div>
                
                {question.imageMarkdown && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Image: {question.imageMarkdown}</p>
                  </div>
                )}
                
                {question.tableHTML && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div dangerouslySetInnerHTML={{ __html: question.tableHTML }} />
                  </div>
                )}
                
                <div className="space-y-3">
                  {question.options.map((option, index) => (
                    <button
                      key={index}
                      className={`w-full p-4 text-left rounded-lg border-2 transition-smooth ${
                        answers[currentQuestion] === index
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50 hover:bg-muted/50"
                      }`}
                      onClick={() => handleAnswer(index)}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-sm font-medium ${
                          answers[currentQuestion] === index
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-muted-foreground"
                        }`}>
                          {String.fromCharCode(65 + index)}
                        </div>
                        <span>{option}</span>
                      </div>
                    </button>
                  ))}
                </div>
                
                <div className="flex justify-between pt-4">
                  <Button 
                    variant="outline" 
                    onClick={prevQuestion}
                    disabled={currentQuestion === 0}
                  >
                    Previous
                  </Button>
                  <Button 
                    variant="default" 
                    onClick={nextQuestion}
                    disabled={currentQuestion === questions.length - 1}
                  >
                    Next
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Question Navigation Panel */}
          <div className="space-y-6">
            <Card className="shadow-soft border-0 sticky top-24">
              <CardHeader>
                <CardTitle className="text-lg">Question Palette</CardTitle>
                <CardDescription>Click to navigate</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-6 gap-2">
                  {questions.map((_, index) => {
                    const status = getQuestionStatus(index);
                    return (
                      <button
                        key={index}
                        className={`w-8 h-8 text-xs font-medium rounded transition-smooth ${
                          status === "current" 
                            ? "bg-primary text-primary-foreground" 
                            : status === "answered"
                            ? "bg-green-500 text-white"
                            : "bg-muted hover:bg-muted-foreground/20"
                        }`}
                        onClick={() => goToQuestion(index)}
                      >
                        {index + 1}
                      </button>
                    );
                  })}
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-green-500 rounded"></div>
                    <span>Answered ({answered})</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-muted border rounded"></div>
                    <span>Not Answered ({unanswered})</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-primary rounded"></div>
                    <span>Current</span>
                  </div>
                </div>
                
                <Progress value={(answered / questions.length) * 100} className="w-full" />
                <div className="text-center text-sm text-muted-foreground">
                  {answered} of {questions.length} completed
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}