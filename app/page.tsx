'use client'

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import SubjectCard from "@/components/SubjectCard";
import { Brain, TestTube, Atom, Dna, BarChart3, Target, Clock, Trophy, ArrowRight, Sparkles } from "lucide-react";

export default function Home() {
  const subjects = [
    {
      title: "Physics",
      description: "Master mechanics, waves, electricity, and modern physics concepts",
      iconName: "Atom",
      color: "physics" as const,
      questionsCount: 15000,
      onStartTest: () => console.log("Starting Physics test"),
    },
    {
      title: "Chemistry", 
      description: "Excel in organic, inorganic, and physical chemistry topics",
      iconName: "TestTube",
      color: "chemistry" as const,
      questionsCount: 18000,
      onStartTest: () => console.log("Starting Chemistry test"),
    },
    {
      title: "Biology",
      description: "Understand life sciences, botany, zoology, and human physiology",
      iconName: "Dna",
      color: "biology" as const,
      questionsCount: 20000,
      onStartTest: () => console.log("Starting Biology test"),
    },
  ];

  const features = [
    {
      icon: Target,
      title: "Custom Test Builder",
      description: "Create personalized tests by selecting subjects, chapters, topics, and weightage distribution for focused practice."
    },
    {
      icon: Clock,
      title: "Realistic NEET Simulation",
      description: "Experience actual NEET exam conditions with precise timing, marking scheme, and question patterns."
    },
    {
      icon: BarChart3,
      title: "Detailed Analytics",
      description: "Track your performance with comprehensive reports, identify weak areas, and get study recommendations."
    },
    {
      icon: Trophy,
      title: "Progress Tracking",
      description: "Monitor your improvement over time with detailed statistics and achievement milestones."
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-white text-gray-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-gray-50/50" />
        <div className="container mx-auto px-4 py-12 md:py-20 relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6 md:mb-8 animate-bounce-subtle">
              <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-primary" />
              <span className="text-xs md:text-sm font-medium text-primary">Your Intelligent Learning Companion</span>
            </div>
            
            <h1 className="text-3xl md:text-5xl lg:text-7xl font-bold mb-4 md:mb-6 animate-float text-gray-900 leading-tight">
              Transform Your
              <span className="block text-primary mt-2">
                NEET Journey
              </span>
            </h1>
            
            <p className="text-base md:text-xl lg:text-2xl text-gray-700 mb-6 md:mb-8 max-w-3xl mx-auto leading-relaxed px-4">
              Experience personalized learning with AI-driven insights, adaptive testing, and comprehensive analytics. 
              Join 50,000+ students who&apos;ve achieved their medical dreams with MentorBox.
            </p>
            
            <div className="grid md:grid-cols-3 gap-4 md:gap-6 max-w-4xl mx-auto px-4">
              {/* Start Custom Test Card */}
              <div className="group relative bg-white rounded-xl shadow-soft hover:shadow-medium transition-smooth border border-gray-100 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-smooth"></div>
                <div className="relative p-4 md:p-6 text-center">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-3 md:mb-4 group-hover:scale-110 transition-bounce">
                    <Brain className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                  </div>
                  <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-2">Custom Test</h3>
                  <p className="text-xs md:text-sm text-gray-600 mb-3 md:mb-4">Create personalized tests with your preferred subjects </p>
                  <Button variant="default" size="sm" className="w-full text-sm md:text-base" asChild>
                    <Link href="/custom-test">
                      Start Custom Test
                      <ArrowRight className="w-3 h-3 md:w-4 md:h-4 ml-2" />
                    </Link>
                  </Button>
                </div>
              </div>

              {/* NEET Mock Test Card */}
              <div className="group relative bg-white rounded-xl shadow-soft hover:shadow-medium transition-smooth border border-gray-100 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-primary/5 opacity-0 group-hover:opacity-100 transition-smooth"></div>
                <div className="relative p-4 md:p-6 text-center">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-secondary/10 flex items-center justify-center mx-auto mb-3 md:mb-4 group-hover:scale-110 transition-bounce">
                    <TestTube className="w-5 h-5 md:w-6 md:h-6 text-secondary" />
                  </div>
                  <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-2">NEET Mock Test</h3>
                  <p className="text-xs md:text-sm text-gray-600 mb-3 md:mb-4">Experience the actual NEET exam environment and timing</p>
                  <Button variant="secondary" size="sm" className="w-full text-sm md:text-base" asChild>
                    <Link href="/neet-test">Take Mock Test</Link>
                  </Button>
                </div>
              </div>

              {/* Dashboard Card */}
              <div className="group relative bg-white rounded-xl shadow-soft hover:shadow-medium transition-smooth border border-gray-100 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-smooth"></div>
                <div className="relative p-4 md:p-6 text-center">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-accent/10 flex items-center justify-center mx-auto mb-3 md:mb-4 group-hover:scale-110 transition-bounce">
                    <BarChart3 className="w-5 h-5 md:w-6 md:h-6 text-accent" />
                  </div>
                  <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-2">Dashboard</h3>
                  <p className="text-xs md:text-sm text-gray-600 mb-3 md:mb-4">Track your progress and view detailed analytics</p>
                  <Button variant="outline" size="sm" className="w-full text-sm md:text-base border-accent text-accent hover:bg-accent hover:text-white" asChild>
                    <Link href="/dashboard">View Dashboard</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-16 h-16 md:w-20 md:h-20 bg-primary/10 rounded-full animate-float" style={{animationDelay: '0s'}} />
        <div className="absolute top-40 right-20 w-12 h-12 md:w-16 md:h-16 bg-secondary/10 rounded-full animate-float" style={{animationDelay: '2s'}} />
        <div className="absolute bottom-20 left-1/4 w-8 h-8 md:w-12 md:h-12 bg-accent/10 rounded-full animate-float" style={{animationDelay: '4s'}} />
      </section>

      {/* Subjects Section */}
      <section className="py-12 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4 text-primary">
              Choose Your Subject
            </h2>
            <p className="text-base md:text-xl text-gray-600 max-w-2xl mx-auto px-4">
              Practice with thousands of carefully curated questions across all NEET subjects
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
            {subjects.map((subject, index) => (
              <div key={subject.title} className="animate-bounce-subtle" style={{animationDelay: `${index * 0.2}s`}}>
                <SubjectCard {...subject} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 md:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4 text-primary">
              Why Choose MentorBox?
            </h2>
            <p className="text-base md:text-xl text-gray-600 max-w-2xl mx-auto px-4">
              Advanced features designed to maximize your NEET preparation efficiency
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {features.map((feature, index) => (
              <Card key={feature.title} className="text-center card-gradient border-0 shadow-soft hover:shadow-medium transition-smooth">
                <CardHeader className="pb-3 md:pb-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-3 md:mb-4">
                    <feature.icon className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                  </div>
                  <CardTitle className="text-base md:text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-xs md:text-sm leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}