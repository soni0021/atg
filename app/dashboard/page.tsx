import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  BarChart3, 
  TrendingUp, 
  Target, 
  Clock, 
  Award, 
  BookOpen, 
  Brain, 
  CheckCircle,
  AlertTriangle,
  Calendar,
  Play
} from "lucide-react";

export default function Dashboard() {
  // Mock data - in real app this would come from backend
  const stats = {
    totalTests: 24,
    totalQuestions: 2400,
    averageScore: 78,
    timeSpent: "48h 30m",
    streakDays: 12,
    rank: 45
  };

  const subjectPerformance = [
    { subject: "Physics", attempted: 800, correct: 620, percentage: 77.5, trend: "up", color: "physics" },
    { subject: "Chemistry", attempted: 750, correct: 600, percentage: 80, trend: "up", color: "chemistry" },
    { subject: "Biology", attempted: 850, correct: 650, percentage: 76.5, trend: "down", color: "biology" }
  ];

  const recentTests = [
    { id: 1, name: "Physics - Mechanics", score: 85, total: 100, date: "2024-01-20", duration: "45m" },
    { id: 2, name: "Chemistry - Organic", score: 72, total: 80, date: "2024-01-19", duration: "38m" },
    { id: 3, name: "Biology - Genetics", score: 90, total: 100, date: "2024-01-18", duration: "52m" },
    { id: 4, name: "NEET Mock Test #5", score: 420, total: 720, date: "2024-01-17", duration: "3h" }
  ];

  const weakAreas = [
    { topic: "Electromagnetic Induction", subject: "Physics", accuracy: 45, questions: 20 },
    { topic: "Organic Reactions", subject: "Chemistry", accuracy: 52, questions: 35 },
    { topic: "Plant Physiology", subject: "Biology", accuracy: 38, questions: 28 }
  ];

  const studyRecommendations = [
    { 
      title: "Focus on Electromagnetic Induction",
      description: "Your accuracy in this topic is 45%. Practice more conceptual questions.",
      priority: "high",
      estimatedTime: "2-3 hours"
    },
    {
      title: "Strengthen Organic Chemistry",
      description: "Review reaction mechanisms and practice more problems.",
      priority: "medium", 
      estimatedTime: "1-2 hours"
    },
    {
      title: "Plant Physiology Concepts",
      description: "Focus on photosynthesis and respiration processes.",
      priority: "high",
      estimatedTime: "2 hours"
    }
  ];

  return (
    <div className="min-h-screen py-8 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Your Dashboard
              </h1>
              <p className="text-xl text-muted-foreground">
                Track your progress and improve your NEET preparation
              </p>
            </div>
            <Button variant="hero" className="hidden md:flex">
              <Play className="w-4 h-4 mr-2" />
              Quick Practice
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <Card className="shadow-soft border-0">
            <CardContent className="p-4 text-center">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-2">
                <BarChart3 className="w-4 h-4 text-primary" />
              </div>
              <div className="text-2xl font-bold text-primary">{stats.totalTests}</div>
              <div className="text-xs text-muted-foreground">Tests Taken</div>
            </CardContent>
          </Card>

          <Card className="shadow-soft border-0">
            <CardContent className="p-4 text-center">
              <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center mx-auto mb-2">
                <Brain className="w-4 h-4 text-secondary" />
              </div>
              <div className="text-2xl font-bold text-secondary">{stats.totalQuestions}</div>
              <div className="text-xs text-muted-foreground">Questions Solved</div>
            </CardContent>
          </Card>

          <Card className="shadow-soft border-0">
            <CardContent className="p-4 text-center">
              <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center mx-auto mb-2">
                <Target className="w-4 h-4 text-accent" />
              </div>
              <div className="text-2xl font-bold text-accent">{stats.averageScore}%</div>
              <div className="text-xs text-muted-foreground">Avg Score</div>
            </CardContent>
          </Card>

          <Card className="shadow-soft border-0">
            <CardContent className="p-4 text-center">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center mx-auto mb-2">
                <Clock className="w-4 h-4 text-blue-500" />
              </div>
              <div className="text-2xl font-bold text-blue-500">{stats.timeSpent}</div>
              <div className="text-xs text-muted-foreground">Study Time</div>
            </CardContent>
          </Card>

          <Card className="shadow-soft border-0">
            <CardContent className="p-4 text-center">
              <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center mx-auto mb-2">
                <Award className="w-4 h-4 text-orange-500" />
              </div>
              <div className="text-2xl font-bold text-orange-500">{stats.streakDays}</div>
              <div className="text-xs text-muted-foreground">Day Streak</div>
            </CardContent>
          </Card>

          <Card className="shadow-soft border-0">
            <CardContent className="p-4 text-center">
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center mx-auto mb-2">
                <TrendingUp className="w-4 h-4 text-purple-500" />
              </div>
              <div className="text-2xl font-bold text-purple-500">#{stats.rank}</div>
              <div className="text-xs text-muted-foreground">Overall Rank</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Subject Performance */}
            <Card className="shadow-soft border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  Subject Performance
                </CardTitle>
                <CardDescription>Your accuracy across different subjects</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {subjectPerformance.map((subject) => (
                  <div key={subject.subject} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-4 h-4 ${subject.color}-gradient rounded-full`}></div>
                        <span className="font-medium">{subject.subject}</span>
                        <Badge variant={subject.trend === "up" ? "secondary" : "destructive"} className="text-xs">
                          {subject.trend === "up" ? "↗" : "↘"} {subject.percentage}%
                        </Badge>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {subject.correct}/{subject.attempted}
                      </span>
                    </div>
                    <Progress value={subject.percentage} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Recent Tests */}
            <Card className="shadow-soft border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-primary" />
                  Recent Tests
                </CardTitle>
                <CardDescription>Your latest practice sessions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentTests.map((test) => (
                    <div key={test.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-smooth">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <CheckCircle className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium">{test.name}</div>
                          <div className="text-sm text-muted-foreground flex items-center gap-2">
                            <Calendar className="w-3 h-3" />
                            {test.date}
                            <Clock className="w-3 h-3 ml-2" />
                            {test.duration}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-lg">
                          {test.score}/{test.total}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {Math.round((test.score / test.total) * 100)}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Weak Areas */}
            <Card className="shadow-soft border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-destructive" />
                  Areas to Improve
                </CardTitle>
                <CardDescription>Topics that need more attention</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {weakAreas.map((area, index) => (
                  <div key={index} className="p-3 rounded-lg border">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium text-sm">{area.topic}</div>
                      <Badge variant="destructive" className="text-xs">
                        {area.accuracy}%
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground mb-2">{area.subject}</div>
                    <Progress value={area.accuracy} className="h-1" />
                    <div className="text-xs text-muted-foreground mt-1">
                      {area.questions} questions attempted
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Study Recommendations */}
            <Card className="shadow-soft border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-accent" />
                  Study Recommendations
                </CardTitle>
                <CardDescription>AI-powered suggestions for you</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {studyRecommendations.map((rec, index) => (
                  <div key={index} className="p-4 rounded-lg border-l-4 border-l-primary bg-primary/5">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium text-sm">{rec.title}</div>
                      <Badge variant={rec.priority === "high" ? "destructive" : "secondary"} className="text-xs">
                        {rec.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{rec.description}</p>
                    <div className="text-xs text-primary font-medium">
                      Est. time: {rec.estimatedTime}
                    </div>
                  </div>
                ))}
                
                <Button variant="outline" className="w-full mt-4">
                  Get Detailed Study Plan
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}