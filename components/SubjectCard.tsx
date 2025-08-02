'use client'

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon, Atom, TestTube, Dna } from "lucide-react";

interface SubjectCardProps {
  title: string;
  description: string;
  iconName: string;
  color: "physics" | "chemistry" | "biology";
  questionsCount: number;
  onStartTest: () => void;
}

const SubjectCard = ({ title, description, iconName, color, questionsCount, onStartTest }: SubjectCardProps) => {
  const getIconComponent = (name: string): LucideIcon => {
    switch (name) {
      case "Atom": return Atom;
      case "TestTube": return TestTube;
      case "Dna": return Dna;
      default: return Atom;
    }
  };

  const Icon = getIconComponent(iconName);

  const getGradientClass = () => {
    switch (color) {
      case "physics": return "bg-physics";
      case "chemistry": return "bg-chemistry";
      case "biology": return "bg-biology";
      default: return "bg-primary";
    }
  };

  return (
    <Card className="group hover:shadow-strong transition-bounce cursor-pointer card-gradient border-0 h-full">
      <CardHeader className="text-center pb-3 md:pb-4">
        <div className={`w-12 h-12 md:w-16 md:h-16 rounded-full ${getGradientClass()} flex items-center justify-center mx-auto mb-3 md:mb-4 group-hover:scale-110 transition-bounce shadow-soft`}>
          <Icon className="w-6 h-6 md:w-8 md:h-8 text-white" />
        </div>
        <CardTitle className="text-lg md:text-xl font-bold text-foreground">{title}</CardTitle>
        <CardDescription className="text-sm md:text-base text-muted-foreground leading-relaxed">{description}</CardDescription>
      </CardHeader>
      
      <CardContent className="text-center px-4 md:px-6">
        <div className="bg-muted rounded-lg p-3 md:p-4 mb-3 md:mb-4">
          <div className="text-xl md:text-2xl font-bold text-primary">{questionsCount.toLocaleString()}</div>
          <div className="text-xs md:text-sm text-muted-foreground">Questions Available</div>
        </div>
      </CardContent>
      
      <CardFooter className="px-4 md:px-6 pb-4 md:pb-6">
        <Button 
          variant={color} 
          className="w-full text-sm md:text-base h-10 md:h-11" 
          size="lg"
          onClick={onStartTest}
        >
          Start {title} Test
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SubjectCard;