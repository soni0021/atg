export interface Question {
  id: string;
  subject: string;
  chapter: string;
  topic: string;
  subtopic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  timeToSolve: number; // in seconds
}

export const questionDatabase: Question[] = [
  // Physics Questions
  {
    id: "phy_001",
    subject: "physics",
    chapter: "mechanics",
    topic: "Kinematics",
    subtopic: "Motion in a straight line",
    difficulty: "medium",
    question: "A particle moves along a straight line such that its displacement is given by s = t³ - 6t² + 9t + 4. Find the velocity of the particle when acceleration is zero.",
    options: [
      "3 m/s",
      "-3 m/s", 
      "6 m/s",
      "0 m/s"
    ],
    correctAnswer: 1,
    explanation: "Given s = t³ - 6t² + 9t + 4. Velocity v = ds/dt = 3t² - 12t + 9. Acceleration a = dv/dt = 6t - 12. When a = 0, 6t - 12 = 0, so t = 2s. At t = 2s, v = 3(4) - 12(2) + 9 = 12 - 24 + 9 = -3 m/s",
    timeToSolve: 120
  },
  {
    id: "phy_002",
    subject: "physics",
    chapter: "mechanics",
    topic: "Newton's Laws",
    subtopic: "Force and motion",
    difficulty: "easy",
    question: "A force of 10 N acts on a body of mass 2 kg. What is the acceleration produced?",
    options: [
      "5 m/s²",
      "20 m/s²",
      "0.2 m/s²",
      "2 m/s²"
    ],
    correctAnswer: 0,
    explanation: "Using Newton's second law: F = ma. Given F = 10 N, m = 2 kg. Therefore, a = F/m = 10/2 = 5 m/s²",
    timeToSolve: 60
  },
  {
    id: "phy_003",
    subject: "physics",
    chapter: "waves",
    topic: "Simple Harmonic Motion",
    subtopic: "Time period and frequency",
    difficulty: "hard",
    question: "A simple pendulum has a time period of 2 seconds on Earth. What will be its time period on a planet where acceleration due to gravity is 4 times that of Earth?",
    options: [
      "1 second",
      "4 seconds",
      "8 seconds",
      "0.5 seconds"
    ],
    correctAnswer: 0,
    explanation: "Time period T = 2π√(l/g). When gravity becomes 4g, T' = 2π√(l/4g) = (1/2) × 2π√(l/g) = T/2 = 2/2 = 1 second",
    timeToSolve: 90
  },

  // Chemistry Questions
  {
    id: "chem_001",
    subject: "chemistry",
    chapter: "physical",
    topic: "Atomic Structure",
    subtopic: "Electronic configuration",
    difficulty: "medium",
    question: "What is the electronic configuration of Cr³⁺ (Z = 24)?",
    options: [
      "[Ar] 3d³",
      "[Ar] 3d⁵",
      "[Ar] 4s¹ 3d²",
      "[Ar] 3d¹ 4s²"
    ],
    correctAnswer: 0,
    explanation: "Cr has configuration [Ar] 4s¹ 3d⁵ (exceptional case). When it loses 3 electrons, it first loses the 4s¹ electron and then 2 electrons from 3d⁵, giving Cr³⁺: [Ar] 3d³",
    timeToSolve: 90
  },
  {
    id: "chem_002",
    subject: "chemistry",
    chapter: "organic",
    topic: "Hydrocarbons",
    subtopic: "Alkanes",
    difficulty: "easy",
    question: "What is the IUPAC name of CH₃-CH₂-CH(CH₃)-CH₃?",
    options: [
      "2-methylbutane",
      "3-methylbutane", 
      "Pentane",
      "2-methylpentane"
    ],
    correctAnswer: 0,
    explanation: "The longest carbon chain has 4 carbons (butane). Methyl group is attached to carbon-2. Hence, the name is 2-methylbutane.",
    timeToSolve: 75
  },
  {
    id: "chem_003",
    subject: "chemistry",
    chapter: "inorganic",
    topic: "Periodic Table",
    subtopic: "Periodic trends",
    difficulty: "medium",
    question: "Which of the following has the highest first ionization energy?",
    options: [
      "Nitrogen",
      "Oxygen",
      "Fluorine",
      "Neon"
    ],
    correctAnswer: 3,
    explanation: "Neon has the highest first ionization energy as it has a complete octet, making it very stable and difficult to remove an electron from.",
    timeToSolve: 60
  },

  // Biology Questions
  {
    id: "bio_001",
    subject: "biology",
    chapter: "cell",
    topic: "Cell Theory",
    subtopic: "Cell organelles",
    difficulty: "easy",
    question: "Which organelle is known as the 'powerhouse of the cell'?",
    options: [
      "Nucleus",
      "Mitochondria",
      "Ribosomes",
      "Golgi apparatus"
    ],
    correctAnswer: 1,
    explanation: "Mitochondria are called the 'powerhouse of the cell' because they produce ATP (energy) through cellular respiration.",
    timeToSolve: 30
  },
  {
    id: "bio_002",
    subject: "biology",
    chapter: "genetics",
    topic: "Heredity",
    subtopic: "Mendel's laws",
    difficulty: "medium",
    question: "In a dihybrid cross between two heterozygous individuals (AaBb × AaBb), what is the phenotypic ratio in F₂ generation?",
    options: [
      "3:1",
      "1:2:1",
      "9:3:3:1",
      "1:1:1:1"
    ],
    correctAnswer: 2,
    explanation: "In a dihybrid cross between two heterozygous individuals, the phenotypic ratio in F₂ generation is 9:3:3:1 according to Mendel's law of independent assortment.",
    timeToSolve: 120
  },
  {
    id: "bio_003",
    subject: "biology",
    chapter: "physiology",
    topic: "Respiration",
    subtopic: "Human respiratory system",
    difficulty: "hard",
    question: "What is the partial pressure of oxygen in alveolar air?",
    options: [
      "159 mmHg",
      "104 mmHg",
      "40 mmHg",
      "46 mmHg"
    ],
    correctAnswer: 1,
    explanation: "The partial pressure of oxygen in alveolar air is approximately 104 mmHg, which is lower than atmospheric air (159 mmHg) due to mixing with CO₂ and water vapor.",
    timeToSolve: 90
  },

  // Additional questions for more variety
  {
    id: "phy_004",
    subject: "physics",
    chapter: "electricity",
    topic: "Electric Field",
    subtopic: "Electric field due to point charges",
    difficulty: "medium",
    question: "Two point charges +4μC and -2μC are separated by a distance of 3cm. Find the electric field at the midpoint.",
    options: [
      "2.4 × 10⁷ N/C",
      "1.2 × 10⁸ N/C",
      "4.8 × 10⁷ N/C",
      "6.0 × 10⁷ N/C"
    ],
    correctAnswer: 0,
    explanation: "At midpoint, both charges create fields in same direction. E₁ = k×4×10⁻⁶/(1.5×10⁻²)² and E₂ = k×2×10⁻⁶/(1.5×10⁻²)². Total E = E₁ + E₂ = 2.4 × 10⁷ N/C",
    timeToSolve: 150
  },
  {
    id: "chem_004",
    subject: "chemistry",
    chapter: "physical",
    topic: "Chemical Bonding",
    subtopic: "Hybridization",
    difficulty: "hard",
    question: "What is the hybridization of central atom in SF₆?",
    options: [
      "sp³",
      "sp³d",
      "sp³d²",
      "sp³d³"
    ],
    correctAnswer: 2,
    explanation: "SF₆ has 6 bonding pairs around sulfur. To accommodate 6 pairs, sulfur uses sp³d² hybridization with octahedral geometry.",
    timeToSolve: 90
  }
];

export const getQuestionsByFilters = (filters: {
  subjects: string[];
  chapters: { [key: string]: string[] };
  totalQuestions: number;
  weightage: { [key: string]: number };
}) => {
  const { subjects, chapters, totalQuestions, weightage } = filters;
  
  // Filter questions based on selected subjects and chapters
  let filteredQuestions = questionDatabase.filter(q => {
    const isSubjectSelected = subjects.includes(q.subject);
    const isChapterSelected = chapters[q.subject]?.includes(q.chapter);
    return isSubjectSelected && isChapterSelected;
  });

  // Calculate questions per chapter based on weightage
  const selectedQuestions: Question[] = [];
  const chapterIds = Object.keys(weightage);
  
  chapterIds.forEach(chapterId => {
    const chapterWeight = weightage[chapterId];
    const questionsForChapter = Math.round((chapterWeight / 100) * totalQuestions);
    
    const chapterQuestions = filteredQuestions.filter(q => q.chapter === chapterId);
    
    // Randomly select questions from this chapter
    const shuffled = [...chapterQuestions].sort(() => Math.random() - 0.5);
    selectedQuestions.push(...shuffled.slice(0, Math.min(questionsForChapter, shuffled.length)));
  });

  // If we don't have enough questions, fill with remaining
  if (selectedQuestions.length < totalQuestions) {
    const remaining = filteredQuestions.filter(q => !selectedQuestions.includes(q));
    const shuffled = [...remaining].sort(() => Math.random() - 0.5);
    selectedQuestions.push(...shuffled.slice(0, totalQuestions - selectedQuestions.length));
  }

  return selectedQuestions.slice(0, totalQuestions);
};