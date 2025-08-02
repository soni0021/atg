'use client'

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Atom, TestTube, Dna, Plus, Minus, Brain, Target, Settings, ChevronDown, ChevronRight, BookOpen } from "lucide-react";

interface Subject {
  name: string;
  displayName: string;
}

interface Chapter {
  name: string;
  displayName: string;
}

interface Topic {
  name: string;
  displayName: string;
}

export default function CustomTest() {
  const router = useRouter();
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [selectedChapters, setSelectedChapters] = useState<{[key: string]: string[]}>({});
  const [selectedTopics, setSelectedTopics] = useState<{[key: string]: {[chapterId: string]: string[]}}>({});
  const [expandedChapters, setExpandedChapters] = useState<{[key: string]: string[]}>({});
  const [totalQuestions, setTotalQuestions] = useState(100);
  const [chapterWeightage, setChapterWeightage] = useState<{[key: string]: number}>({});
  
  // API data state
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [chapters, setChapters] = useState<{[key: string]: Chapter[]}>({});
  const [topics, setTopics] = useState<{[key: string]: {[key: string]: Topic[]}}>({});
  const [loading, setLoading] = useState(true);
  const [generatingTest, setGeneratingTest] = useState(false);

  // Load subjects on component mount
  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      const response = await fetch('/api/subjects');
      if (response.ok) {
        const subjectsData = await response.json();
        setSubjects(subjectsData);
      }
    } catch (error) {
      console.error('Error fetching subjects:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchChapters = async (subjectName: string) => {
    try {
      const response = await fetch(`/api/chapters/${encodeURIComponent(subjectName)}`);
      if (response.ok) {
        const chaptersData = await response.json();
        setChapters(prev => ({
          ...prev,
          [subjectName]: chaptersData
        }));
      }
    } catch (error) {
      console.error('Error fetching chapters:', error);
    }
  };

  const fetchTopics = async (subjectName: string, chapterName: string) => {
    try {
      const response = await fetch(`/api/topics/${encodeURIComponent(subjectName)}/${encodeURIComponent(chapterName)}`);
      if (response.ok) {
        const topicsData = await response.json();
        setTopics(prev => ({
          ...prev,
          [subjectName]: {
            ...prev[subjectName],
            [chapterName]: topicsData
          }
        }));
      }
    } catch (error) {
      console.error('Error fetching topics:', error);
    }
  };

  const getSubjectIcon = (subjectName: string) => {
    switch (subjectName.toLowerCase()) {
      case 'physics': return Atom;
      case 'chemistry': return TestTube;
      case 'biology': return Dna;
      default: return BookOpen;
    }
  };

  const getSubjectColor = (subjectName: string) => {
    switch (subjectName.toLowerCase()) {
      case 'physics': return 'physics';
      case 'chemistry': return 'chemistry';
      case 'biology': return 'biology';
      default: return 'primary';
    }
  };

  const handleSubjectChange = (subjectName: string, checked: boolean) => {
    if (checked) {
      setSelectedSubjects([...selectedSubjects, subjectName]);
      // Fetch chapters when subject is selected
      fetchChapters(subjectName);
    } else {
      setSelectedSubjects(selectedSubjects.filter(name => name !== subjectName));
      // Clean up chapters and topics when subject is deselected
      const newChapters = {...selectedChapters};
      delete newChapters[subjectName];
      setSelectedChapters(newChapters);
      const newTopics = {...selectedTopics};
      delete newTopics[subjectName];
      setSelectedTopics(newTopics);
      const newExpanded = {...expandedChapters};
      delete newExpanded[subjectName];
      setExpandedChapters(newExpanded);
    }
  };

  const handleChapterChange = (subjectName: string, chapterName: string, checked: boolean) => {
    const currentChapters = selectedChapters[subjectName] || [];
    if (checked) {
      setSelectedChapters({
        ...selectedChapters,
        [subjectName]: [...currentChapters, chapterName]
      });
      // Fetch topics when chapter is selected
      fetchTopics(subjectName, chapterName);
    } else {
      setSelectedChapters({
        ...selectedChapters,
        [subjectName]: currentChapters.filter(name => name !== chapterName)
      });
      // Remove topics when chapter is deselected
      const currentTopics = selectedTopics[subjectName] || {};
      const newTopics = {...currentTopics};
      delete newTopics[chapterName];
      setSelectedTopics({
        ...selectedTopics,
        [subjectName]: newTopics
      });
    }
  };

  const handleTopicChange = (subjectName: string, chapterName: string, topicName: string, checked: boolean) => {
    const currentTopics = selectedTopics[subjectName]?.[chapterName] || [];
    if (checked) {
      setSelectedTopics({
        ...selectedTopics,
        [subjectName]: {
          ...selectedTopics[subjectName],
          [chapterName]: [...currentTopics, topicName]
        }
      });
    } else {
      setSelectedTopics({
        ...selectedTopics,
        [subjectName]: {
          ...selectedTopics[subjectName],
          [chapterName]: currentTopics.filter(t => t !== topicName)
        }
      });
    }
  };

  const toggleChapterExpansion = (subjectName: string, chapterName: string) => {
    const currentExpanded = expandedChapters[subjectName] || [];
    if (currentExpanded.includes(chapterName)) {
      setExpandedChapters({
        ...expandedChapters,
        [subjectName]: currentExpanded.filter(name => name !== chapterName)
      });
    } else {
      setExpandedChapters({
        ...expandedChapters,
        [subjectName]: [...currentExpanded, chapterName]
      });
    }
  };

  const updateWeightage = (chapterName: string, value: number) => {
    setChapterWeightage({
      ...chapterWeightage,
      [chapterName]: value
    });
  };

  const getTotalWeightage = () => {
    return Object.values(chapterWeightage).reduce((sum, weight) => sum + weight, 0);
  };

  const getSelectedChaptersCount = () => {
    return Object.values(selectedChapters).flat().length;
  };

  const getSelectedTopicsCount = () => {
    return Object.values(selectedTopics).reduce((total, subjectTopics) => {
      return total + Object.values(subjectTopics).reduce((chapterTotal, topics) => {
        return chapterTotal + topics.length;
      }, 0);
    }, 0);
  };

  const generateTest = async () => {
    try {
      setGeneratingTest(true);
      
      if (selectedSubjects.length === 0) {
        alert('Please select at least one subject.');
        return;
      }

      // Use the first selected subject
      const primarySubject = selectedSubjects[0];
      const allSelectedChapters = selectedChapters[primarySubject] || [];
      
      if (allSelectedChapters.length === 0) {
        alert('Please select at least one chapter.');
        return;
      }

      // Build chapter weights array - if no weights set, distribute equally
      let chapterWeights = Object.entries(chapterWeightage)
        .filter(([chapterName, weight]) => allSelectedChapters.includes(chapterName) && weight > 0)
        .map(([chapterName, weight]) => ({
          chapter: chapterName,
          num_questions: Math.round((weight / 100) * totalQuestions)
        }));

      // If no weights are set, distribute questions equally among selected chapters
      if (chapterWeights.length === 0) {
        const questionsPerChapter = Math.floor(totalQuestions / allSelectedChapters.length);
        const remainder = totalQuestions % allSelectedChapters.length;
        
        chapterWeights = allSelectedChapters.map((chapterName, index) => ({
          chapter: chapterName,
          num_questions: questionsPerChapter + (index < remainder ? 1 : 0)
        }));
      }

      // Get all selected topics (flattened from all chapters)
      const allSelectedTopics = Object.values(selectedTopics[primarySubject] || {}).flat();

      // Get previously used questions to avoid repetition
      const usedQuestions = JSON.parse(localStorage.getItem('usedQuestions') || '[]');

      const requestBody = {
        subject: primarySubject,
        chapters: allSelectedChapters,
        topics: allSelectedTopics,
        num_questions: totalQuestions,
        marks_per_question: 4,
        chapter_weights: chapterWeights,
        exclude_questions: usedQuestions // Add this to exclude used questions
      };

      console.log('Sending request:', requestBody);
      console.log('Selected topics:', allSelectedTopics);
      console.log('Selected chapters:', allSelectedChapters);

      const response = await fetch('/api/generate-questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        const testData = await response.json();
        console.log('Received test data:', testData);
        console.log('Test data size:', JSON.stringify(testData).length);
        
        // Store the question IDs as used questions
        const newUsedQuestions = testData.questions?.map((q: any) => q.id) || [];
        const allUsedQuestions = [...usedQuestions, ...newUsedQuestions];
        localStorage.setItem('usedQuestions', JSON.stringify(allUsedQuestions));
        
        // Store data in sessionStorage instead of URL (URL has length limits)
        sessionStorage.setItem('customTestData', JSON.stringify(testData));
        
        // Navigate to test interface
        router.push('/test-interface?source=custom');
      } else {
        const errorData = await response.json();
        console.error('Failed to generate test:', errorData);
        alert(`Failed to generate test: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error generating test:', error);
      alert('Error generating test. Please try again.');
    } finally {
      setGeneratingTest(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen py-6 md:py-8 bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading subjects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-6 md:py-8 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-3 py-2 md:px-4 md:py-2 mb-3 md:mb-4">
            <Brain className="w-3 h-3 md:w-4 md:h-4 text-primary" />
            <span className="text-xs md:text-sm font-medium text-primary">Custom Test Builder</span>
          </div>
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4 text-gray-900">
            Create Your Perfect Test
          </h1>
          <p className="text-sm md:text-xl text-gray-600 max-w-2xl mx-auto px-4">
            Customize your practice session by selecting subjects, chapters, topics and question distribution
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
          {/* Configuration Panel */}
          <div className="lg:col-span-2 space-y-4 md:space-y-6">
            {/* Subject Selection */}
            <Card className="shadow-sm border-0 bg-white">
              <CardHeader className="pb-3 md:pb-4">
                <CardTitle className="flex items-center gap-2 md:gap-3 text-lg md:text-xl">
                  <div className="w-6 h-6 md:w-8 md:h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Target className="w-3 h-3 md:w-4 md:h-4 text-primary" />
                  </div>
                  Select Subjects
                </CardTitle>
                <CardDescription className="text-gray-600 text-sm md:text-base">Choose the subjects you want to practice</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
                  {subjects.map((subject) => {
                    const Icon = getSubjectIcon(subject.name);
                    const isSelected = selectedSubjects.includes(subject.name);
                    const subjectChapters = chapters[subject.name] || [];
                    return (
                      <div
                        key={subject.name}
                        className={`p-3 md:p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                          isSelected 
                            ? "border-primary bg-primary/5 shadow-md" 
                            : "border-gray-200 bg-white hover:border-primary/30 hover:shadow-sm"
                        }`}
                        onClick={() => handleSubjectChange(subject.name, !isSelected)}
                      >
                        <div className="flex items-center space-x-3">
                          <Checkbox 
                            checked={isSelected}
                            onChange={() => {}}
                            className="pointer-events-none"
                          />
                          <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center bg-${getSubjectColor(subject.name)} shadow-sm`}>
                            <Icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900 text-sm md:text-base">{subject.displayName}</div>
                            <div className="text-xs md:text-sm text-gray-500">{subjectChapters.length} chapters</div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Chapter and Topic Selection */}
            {selectedSubjects.map((subjectName) => {
              const subject = subjects.find(s => s.name === subjectName);
              const subjectChapters = chapters[subjectName] || [];
              if (!subject) return null;

              const Icon = getSubjectIcon(subject.name);

              return (
                <Card key={subjectName} className="shadow-sm border-0 bg-white">
                  <CardHeader className="pb-3 md:pb-4">
                    <CardTitle className="flex items-center gap-2 md:gap-3 text-lg md:text-xl">
                      <div className={`w-6 h-6 md:w-8 md:h-8 rounded-lg bg-${getSubjectColor(subject.name)} flex items-center justify-center`}>
                        <Icon className="w-3 h-3 md:w-4 md:h-4 text-white" />
                      </div>
                      {subject.displayName} - Chapters & Topics
                    </CardTitle>
                    <CardDescription className="text-gray-600 text-sm md:text-base">Select chapters and their weightage</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3 md:space-y-4">
                    {subjectChapters.map((chapter) => {
                      const isChapterSelected = selectedChapters[subjectName]?.includes(chapter.name);
                      const isExpanded = expandedChapters[subjectName]?.includes(chapter.name);
                      const selectedChapterTopics = selectedTopics[subjectName]?.[chapter.name] || [];
                      const chapterTopics = topics[subjectName]?.[chapter.name] || [];
                      
                      return (
                        <div key={chapter.name} className="border border-gray-100 rounded-xl overflow-hidden">
                          {/* Chapter Header */}
                          <div className={`p-3 md:p-4 transition-all duration-200 ${
                            isChapterSelected ? 'bg-primary/5 border-l-4 border-primary' : 'bg-gray-50'
                          }`}>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2 md:space-x-3 flex-1">
                                <Checkbox
                                  checked={isChapterSelected}
                                  onCheckedChange={(checked) => 
                                    handleChapterChange(subjectName, chapter.name, checked as boolean)
                                  }
                                  className="w-4 h-4 md:w-5 md:h-5"
                                />
                                <div className="flex items-center space-x-2 md:space-x-3">
                                  <BookOpen className="w-4 h-4 md:w-5 md:h-5 text-gray-500" />
                                  <div>
                                    <div className="font-semibold text-gray-900 text-sm md:text-base">{chapter.displayName}</div>
                                    <div className="text-xs md:text-sm text-gray-500">{chapterTopics.length} topics</div>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="flex items-center space-x-2 md:space-x-4">
                                {/* Weightage Controls */}
                                {isChapterSelected && (
                                  <div className="flex items-center space-x-2 md:space-x-3 bg-white rounded-lg px-2 py-1 md:px-3 md:py-2 border border-gray-200">
                                    <Label className="text-xs md:text-sm font-medium text-gray-700">Weight:</Label>
                                    <div className="flex items-center space-x-1 md:space-x-2">
                                      <Button
                                        variant="outline"
                                        size="icon"
                                        className="w-6 h-6 md:w-7 md:h-7"
                                        onClick={() => updateWeightage(chapter.name, Math.max(0, (chapterWeightage[chapter.name] || 0) - 5))}
                                      >
                                        <Minus className="w-3 h-3" />
                                      </Button>
                                      <span className="w-8 md:w-12 text-center text-xs md:text-sm font-semibold text-gray-900">
                                        {chapterWeightage[chapter.name] || 0}%
                                      </span>
                                      <Button
                                        variant="outline"
                                        size="icon"
                                        className="w-6 h-6 md:w-7 md:h-7"
                                        onClick={() => updateWeightage(chapter.name, Math.min(100, (chapterWeightage[chapter.name] || 0) + 5))}
                                      >
                                        <Plus className="w-3 h-3" />
                                      </Button>
                                    </div>
                                  </div>
                                )}
                                
                                {/* Expand/Collapse Button */}
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => toggleChapterExpansion(subjectName, chapter.name)}
                                  className="p-1 md:p-2 h-auto text-gray-500 hover:text-gray-700"
                                >
                                  {isExpanded ? (
                                    <ChevronDown className="w-4 h-4 md:w-5 md:h-5" />
                                  ) : (
                                    <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
                                  )}
                                </Button>
                              </div>
                            </div>
                          </div>
                          
                          {/* Topics Section */}
                          {isExpanded && (
                            <div className="border-t border-gray-100 bg-white">
                              <div className="p-3 md:p-4">
                                <div className="flex items-center justify-between mb-3 md:mb-4">
                                  <h4 className="font-medium text-gray-900 text-sm md:text-base">Select Topics:</h4>
                                  <Badge variant="secondary" className="text-xs">
                                    {selectedChapterTopics.length} of {chapterTopics.length} selected
                                  </Badge>
                                </div>
                                
                                <div className="grid grid-cols-1 gap-2 md:gap-3">
                                  {chapterTopics.map((topic) => {
                                    const isTopicSelected = selectedChapterTopics.includes(topic.name);
                                    return (
                                      <div
                                        key={topic.name}
                                        className={`flex items-center space-x-2 md:space-x-3 p-2 md:p-3 rounded-lg border transition-all duration-200 cursor-pointer ${
                                          isTopicSelected 
                                            ? 'border-primary bg-primary/5' 
                                            : 'border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-gray-100'
                                        }`}
                                        onClick={() => handleTopicChange(subjectName, chapter.name, topic.name, !isTopicSelected)}
                                      >
                                        <Checkbox
                                          checked={isTopicSelected}
                                          onChange={() => {}}
                                          className="pointer-events-none"
                                        />
                                        <span className={`text-xs md:text-sm font-medium ${
                                          isTopicSelected ? 'text-primary' : 'text-gray-700'
                                        }`}>
                                          {topic.displayName}
                                        </span>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>
              );
            })}

            {/* Total Questions */}
            <Card className="shadow-sm border-0 bg-white">
              <CardHeader className="pb-3 md:pb-4">
                <CardTitle className="flex items-center gap-2 md:gap-3 text-lg md:text-xl">
                  <div className="w-6 h-6 md:w-8 md:h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Settings className="w-3 h-3 md:w-4 md:h-4 text-primary" />
                  </div>
                  Test Configuration
                </CardTitle>
                <CardDescription className="text-gray-600 text-sm md:text-base">Set the total number of questions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 md:space-y-4">
                <div className="space-y-3 md:space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm md:text-base font-medium text-gray-900">Total Questions</Label>
                    <span className="text-xl md:text-2xl font-bold text-primary">{totalQuestions}</span>
                  </div>
                  <Slider
                    value={[totalQuestions]}
                    onValueChange={(value) => setTotalQuestions(value[0])}
                    max={200}
                    min={10}
                    step={5}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs md:text-sm text-gray-500">
                    <span>10 questions</span>
                    <span>200 questions</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Summary Panel */}
          <div className="space-y-4 md:space-y-6">
            <Card className="shadow-sm border-0 bg-white sticky top-20 md:top-24">
              <CardHeader className="pb-3 md:pb-4">
                <CardTitle className="text-lg md:text-xl">Test Summary</CardTitle>
                <CardDescription className="text-gray-600 text-sm md:text-base">Review your test configuration</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 md:space-y-6">
                <div className="space-y-3 md:space-y-4">
                  <div className="flex items-center justify-between p-2 md:p-3 bg-gray-50 rounded-lg">
                    <span className="text-xs md:text-sm font-medium text-gray-700">Subjects</span>
                    <span className="text-base md:text-lg font-bold text-gray-900">{selectedSubjects.length}</span>
                  </div>
                  <div className="flex items-center justify-between p-2 md:p-3 bg-gray-50 rounded-lg">
                    <span className="text-xs md:text-sm font-medium text-gray-700">Chapters</span>
                    <span className="text-base md:text-lg font-bold text-gray-900">{getSelectedChaptersCount()}</span>
                  </div>
                  <div className="flex items-center justify-between p-2 md:p-3 bg-gray-50 rounded-lg">
                    <span className="text-xs md:text-sm font-medium text-gray-700">Topics</span>
                    <span className="text-base md:text-lg font-bold text-gray-900">{getSelectedTopicsCount()}</span>
                  </div>
                  <div className="flex items-center justify-between p-2 md:p-3 bg-gray-50 rounded-lg">
                    <span className="text-xs md:text-sm font-medium text-gray-700">Total Questions</span>
                    <span className="text-base md:text-lg font-bold text-gray-900">{totalQuestions}</span>
                  </div>
                  <div className={`flex items-center justify-between p-2 md:p-3 rounded-lg ${
                    getTotalWeightage() === 100 ? 'bg-green-50' : 'bg-red-50'
                  }`}>
                    <span className="text-xs md:text-sm font-medium text-gray-700">Total Weightage</span>
                    <span className={`text-base md:text-lg font-bold ${
                      getTotalWeightage() === 100 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {getTotalWeightage()}%
                    </span>
                  </div>
                </div>

                {getTotalWeightage() !== 100 && getSelectedChaptersCount() > 0 && (
                  <div className="p-3 md:p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-xs md:text-sm text-blue-700 font-medium">
                      💡 Optional: Set chapter weightage (current: {getTotalWeightage()}%). If not set to 100%, questions will be distributed equally among selected chapters.
                    </p>
                  </div>
                )}

                {/* Used Questions Info */}
                <div className="p-3 md:p-4 bg-gray-50 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs md:text-sm text-gray-700 font-medium">
                        📚 Question Bank Status
                      </p>
                      <p className="text-xs text-gray-600">
                        {JSON.parse(localStorage.getItem('usedQuestions') || '[]').length} questions used previously
                      </p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        localStorage.removeItem('usedQuestions');
                        alert('Used questions cleared! You can now see previously attempted questions again.');
                      }}
                    >
                      Clear History
                    </Button>
                  </div>
                </div>

                <Button 
                  variant="default" 
                  className="w-full h-10 md:h-12 text-sm md:text-lg font-semibold" 
                  size="lg"
                  disabled={selectedSubjects.length === 0 || getSelectedChaptersCount() === 0 || generatingTest}
                  onClick={generateTest}
                >
                  {generatingTest ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Generating Test...
                    </>
                  ) : (
                    'Generate Test'
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}