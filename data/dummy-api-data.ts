// Dummy API Data for Testing Platform
// This file contains mock responses for all API endpoints

// ===== SUBJECTS API =====
export const dummySubjects = [
  {
    id: "physics",
    name: "Physics",
    description: "Study of matter, energy, and their interactions",
    color: "#3B82F6",
    icon: "⚛️",
    totalChapters: 8,
    totalTopics: 45
  },
  {
    id: "chemistry",
    name: "Chemistry",
    description: "Study of substances, their properties, and reactions",
    color: "#10B981",
    icon: "🧪",
    totalChapters: 6,
    totalTopics: 38
  },
  {
    id: "biology",
    name: "Biology",
    description: "Study of living organisms and life processes",
    color: "#8B5CF6",
    icon: "🧬",
    totalChapters: 7,
    totalTopics: 52
  },
  {
    id: "mathematics",
    name: "Mathematics",
    description: "Study of numbers, quantities, shapes, and patterns",
    color: "#F59E0B",
    icon: "📐",
    totalChapters: 5,
    totalTopics: 32
  }
];

// ===== CHAPTERS API =====
export const dummyChapters = {
  physics: [
    {
      id: "mechanics",
      name: "Mechanics",
      description: "Study of motion and forces",
      topics: ["Kinematics", "Newton's Laws", "Work and Energy", "Momentum", "Circular Motion"],
      totalQuestions: 150,
      difficulty: "medium"
    },
    {
      id: "waves",
      name: "Waves and Oscillations",
      description: "Study of wave phenomena and simple harmonic motion",
      topics: ["Simple Harmonic Motion", "Wave Properties", "Sound Waves", "Light Waves", "Interference"],
      totalQuestions: 120,
      difficulty: "medium"
    },
    {
      id: "electricity",
      name: "Electricity and Magnetism",
      description: "Study of electric and magnetic fields",
      topics: ["Electric Field", "Electric Potential", "Current Electricity", "Magnetic Field", "Electromagnetic Induction"],
      totalQuestions: 180,
      difficulty: "hard"
    },
    {
      id: "optics",
      name: "Optics",
      description: "Study of light and its properties",
      topics: ["Reflection", "Refraction", "Lenses", "Optical Instruments", "Wave Optics"],
      totalQuestions: 100,
      difficulty: "medium"
    },
    {
      id: "thermodynamics",
      name: "Thermodynamics",
      description: "Study of heat and energy transfer",
      topics: ["Laws of Thermodynamics", "Heat Transfer", "Kinetic Theory", "Entropy", "Thermal Properties"],
      totalQuestions: 90,
      difficulty: "hard"
    },
    {
      id: "modern-physics",
      name: "Modern Physics",
      description: "Study of quantum mechanics and relativity",
      topics: ["Photoelectric Effect", "Atomic Structure", "Nuclear Physics", "Relativity", "Quantum Mechanics"],
      totalQuestions: 110,
      difficulty: "hard"
    },
    {
      id: "fluid-mechanics",
      name: "Fluid Mechanics",
      description: "Study of fluids and their behavior",
      topics: ["Fluid Properties", "Bernoulli's Principle", "Viscosity", "Surface Tension", "Fluid Dynamics"],
      totalQuestions: 80,
      difficulty: "medium"
    },
    {
      id: "electronics",
      name: "Electronics",
      description: "Study of electronic devices and circuits",
      topics: ["Semiconductors", "Diodes", "Transistors", "Logic Gates", "Digital Electronics"],
      totalQuestions: 95,
      difficulty: "hard"
    }
  ],
  chemistry: [
    {
      id: "physical",
      name: "Physical Chemistry",
      description: "Study of physical principles underlying chemical phenomena",
      topics: ["Atomic Structure", "Chemical Bonding", "Chemical Kinetics", "Thermodynamics", "Electrochemistry"],
      totalQuestions: 160,
      difficulty: "hard"
    },
    {
      id: "organic",
      name: "Organic Chemistry",
      description: "Study of carbon compounds and their reactions",
      topics: ["Hydrocarbons", "Alcohols and Ethers", "Aldehydes and Ketones", "Carboxylic Acids", "Amines"],
      totalQuestions: 200,
      difficulty: "medium"
    },
    {
      id: "inorganic",
      name: "Inorganic Chemistry",
      description: "Study of non-carbon compounds and elements",
      topics: ["Periodic Table", "Chemical Bonding", "Coordination Compounds", "Metallurgy", "Environmental Chemistry"],
      totalQuestions: 140,
      difficulty: "medium"
    },
    {
      id: "analytical",
      name: "Analytical Chemistry",
      description: "Study of methods for determining chemical composition",
      topics: ["Qualitative Analysis", "Quantitative Analysis", "Instrumental Methods", "Titrations", "Spectroscopy"],
      totalQuestions: 90,
      difficulty: "medium"
    },
    {
      id: "biochemistry",
      name: "Biochemistry",
      description: "Study of chemical processes in living organisms",
      topics: ["Biomolecules", "Enzymes", "Metabolism", "Nucleic Acids", "Proteins"],
      totalQuestions: 110,
      difficulty: "hard"
    },
    {
      id: "polymer",
      name: "Polymer Chemistry",
      description: "Study of large molecules and their properties",
      topics: ["Polymerization", "Polymer Properties", "Synthetic Polymers", "Natural Polymers", "Polymer Applications"],
      totalQuestions: 75,
      difficulty: "medium"
    }
  ],
  biology: [
    {
      id: "cell",
      name: "Cell Biology",
      description: "Study of cells and their functions",
      topics: ["Cell Theory", "Cell Organelles", "Cell Division", "Cell Transport", "Cell Communication"],
      totalQuestions: 130,
      difficulty: "medium"
    },
    {
      id: "genetics",
      name: "Genetics",
      description: "Study of heredity and variation",
      topics: ["Heredity", "Mendel's Laws", "Chromosomes", "DNA and RNA", "Genetic Disorders"],
      totalQuestions: 160,
      difficulty: "medium"
    },
    {
      id: "physiology",
      name: "Human Physiology",
      description: "Study of human body functions",
      topics: ["Digestive System", "Respiratory System", "Circulatory System", "Nervous System", "Endocrine System"],
      totalQuestions: 180,
      difficulty: "medium"
    },
    {
      id: "ecology",
      name: "Ecology",
      description: "Study of organisms and their environment",
      topics: ["Ecosystems", "Population Ecology", "Community Ecology", "Biodiversity", "Environmental Issues"],
      totalQuestions: 120,
      difficulty: "easy"
    },
    {
      id: "evolution",
      name: "Evolution",
      description: "Study of biological evolution and adaptation",
      topics: ["Natural Selection", "Speciation", "Evidence of Evolution", "Human Evolution", "Adaptation"],
      totalQuestions: 100,
      difficulty: "medium"
    },
    {
      id: "microbiology",
      name: "Microbiology",
      description: "Study of microorganisms",
      topics: ["Bacteria", "Viruses", "Fungi", "Protozoa", "Microbial Diseases"],
      totalQuestions: 110,
      difficulty: "medium"
    },
    {
      id: "biotechnology",
      name: "Biotechnology",
      description: "Study of biological applications in technology",
      topics: ["Genetic Engineering", "Recombinant DNA", "Biotechnology Applications", "Bioinformatics", "Ethical Issues"],
      totalQuestions: 85,
      difficulty: "hard"
    }
  ],
  mathematics: [
    {
      id: "algebra",
      name: "Algebra",
      description: "Study of mathematical symbols and rules",
      topics: ["Linear Equations", "Quadratic Equations", "Matrices", "Determinants", "Complex Numbers"],
      totalQuestions: 140,
      difficulty: "medium"
    },
    {
      id: "calculus",
      name: "Calculus",
      description: "Study of continuous change",
      topics: ["Limits", "Differentiation", "Integration", "Applications", "Series"],
      totalQuestions: 160,
      difficulty: "hard"
    },
    {
      id: "geometry",
      name: "Geometry",
      description: "Study of shapes and spatial relationships",
      topics: ["Coordinate Geometry", "Trigonometry", "3D Geometry", "Vectors", "Conic Sections"],
      totalQuestions: 120,
      difficulty: "medium"
    },
    {
      id: "statistics",
      name: "Statistics",
      description: "Study of data collection and analysis",
      topics: ["Descriptive Statistics", "Probability", "Random Variables", "Hypothesis Testing", "Regression"],
      totalQuestions: 100,
      difficulty: "medium"
    },
    {
      id: "number-theory",
      name: "Number Theory",
      description: "Study of properties of numbers",
      topics: ["Divisibility", "Prime Numbers", "Congruences", "Diophantine Equations", "Cryptography"],
      totalQuestions: 80,
      difficulty: "hard"
    }
  ]
};

// ===== TOPICS API =====
export const dummyTopics = {
  physics: {
    mechanics: [
      {
        id: "kinematics",
        name: "Kinematics",
        description: "Study of motion without considering forces",
        subtopics: ["Motion in a straight line", "Motion in a plane", "Projectile motion", "Circular motion"],
        totalQuestions: 40,
        difficulty: "medium"
      },
      {
        id: "newtons-laws",
        name: "Newton's Laws",
        description: "Fundamental laws governing motion",
        subtopics: ["First law", "Second law", "Third law", "Applications"],
        totalQuestions: 35,
        difficulty: "medium"
      },
      {
        id: "work-energy",
        name: "Work and Energy",
        description: "Study of work, energy, and power",
        subtopics: ["Work done by force", "Kinetic energy", "Potential energy", "Conservation of energy"],
        totalQuestions: 30,
        difficulty: "medium"
      },
      {
        id: "momentum",
        name: "Momentum",
        description: "Study of linear and angular momentum",
        subtopics: ["Linear momentum", "Conservation of momentum", "Collisions", "Angular momentum"],
        totalQuestions: 25,
        difficulty: "hard"
      },
      {
        id: "circular-motion",
        name: "Circular Motion",
        description: "Study of motion in circular paths",
        subtopics: ["Uniform circular motion", "Centripetal force", "Banking of roads", "Satellite motion"],
        totalQuestions: 20,
        difficulty: "hard"
      }
    ],
    waves: [
      {
        id: "shm",
        name: "Simple Harmonic Motion",
        description: "Study of oscillatory motion",
        subtopics: ["Time period and frequency", "Energy in SHM", "Damped oscillations", "Forced oscillations"],
        totalQuestions: 25,
        difficulty: "medium"
      },
      {
        id: "wave-properties",
        name: "Wave Properties",
        description: "Fundamental properties of waves",
        subtopics: ["Wave characteristics", "Wave equation", "Wave speed", "Wave energy"],
        totalQuestions: 20,
        difficulty: "medium"
      },
      {
        id: "sound-waves",
        name: "Sound Waves",
        description: "Study of sound and its properties",
        subtopics: ["Sound characteristics", "Doppler effect", "Resonance", "Musical instruments"],
        totalQuestions: 30,
        difficulty: "medium"
      },
      {
        id: "light-waves",
        name: "Light Waves",
        description: "Study of light as a wave",
        subtopics: ["Wave nature of light", "Polarization", "Diffraction", "Interference"],
        totalQuestions: 25,
        difficulty: "hard"
      },
      {
        id: "interference",
        name: "Interference",
        description: "Study of wave interference patterns",
        subtopics: ["Constructive interference", "Destructive interference", "Young's experiment", "Thin films"],
        totalQuestions: 20,
        difficulty: "hard"
      }
    ]
  },
  chemistry: {
    physical: [
      {
        id: "atomic-structure",
        name: "Atomic Structure",
        description: "Study of atom structure and properties",
        subtopics: ["Electronic configuration", "Quantum numbers", "Atomic orbitals", "Periodic trends"],
        totalQuestions: 35,
        difficulty: "hard"
      },
      {
        id: "chemical-bonding",
        name: "Chemical Bonding",
        description: "Study of how atoms combine",
        subtopics: ["Ionic bonding", "Covalent bonding", "Metallic bonding", "Hybridization"],
        totalQuestions: 40,
        difficulty: "hard"
      },
      {
        id: "chemical-kinetics",
        name: "Chemical Kinetics",
        description: "Study of reaction rates",
        subtopics: ["Rate of reaction", "Factors affecting rate", "Rate laws", "Activation energy"],
        totalQuestions: 30,
        difficulty: "hard"
      },
      {
        id: "thermodynamics",
        name: "Thermodynamics",
        description: "Study of energy changes in reactions",
        subtopics: ["First law", "Second law", "Entropy", "Free energy"],
        totalQuestions: 35,
        difficulty: "hard"
      },
      {
        id: "electrochemistry",
        name: "Electrochemistry",
        description: "Study of electrical aspects of reactions",
        subtopics: ["Electrochemical cells", "Electrolysis", "Conductivity", "Corrosion"],
        totalQuestions: 20,
        difficulty: "hard"
      }
    ],
    organic: [
      {
        id: "hydrocarbons",
        name: "Hydrocarbons",
        description: "Study of compounds containing only carbon and hydrogen",
        subtopics: ["Alkanes", "Alkenes", "Alkynes", "Aromatic hydrocarbons"],
        totalQuestions: 45,
        difficulty: "medium"
      },
      {
        id: "alcohols-ethers",
        name: "Alcohols and Ethers",
        description: "Study of oxygen-containing organic compounds",
        subtopics: ["Alcohols", "Ethers", "Preparation", "Reactions"],
        totalQuestions: 35,
        difficulty: "medium"
      },
      {
        id: "aldehydes-ketones",
        name: "Aldehydes and Ketones",
        description: "Study of carbonyl compounds",
        subtopics: ["Preparation", "Reactions", "Nucleophilic addition", "Oxidation-reduction"],
        totalQuestions: 40,
        difficulty: "medium"
      },
      {
        id: "carboxylic-acids",
        name: "Carboxylic Acids",
        description: "Study of organic acids",
        subtopics: ["Preparation", "Reactions", "Derivatives", "Acidity"],
        totalQuestions: 35,
        difficulty: "medium"
      },
      {
        id: "amines",
        name: "Amines",
        description: "Study of nitrogen-containing organic compounds",
        subtopics: ["Classification", "Preparation", "Reactions", "Basicity"],
        totalQuestions: 30,
        difficulty: "medium"
      }
    ]
  },
  biology: {
    cell: [
      {
        id: "cell-theory",
        name: "Cell Theory",
        description: "Fundamental principles of cell biology",
        subtopics: ["Cell organelles", "Cell membrane", "Cell division", "Cell communication"],
        totalQuestions: 35,
        difficulty: "medium"
      },
      {
        id: "cell-organelles",
        name: "Cell Organelles",
        description: "Study of cell structures and functions",
        subtopics: ["Nucleus", "Mitochondria", "Endoplasmic reticulum", "Golgi apparatus"],
        totalQuestions: 30,
        difficulty: "medium"
      },
      {
        id: "cell-division",
        name: "Cell Division",
        description: "Study of how cells reproduce",
        subtopics: ["Mitosis", "Meiosis", "Cell cycle", "Regulation"],
        totalQuestions: 35,
        difficulty: "medium"
      },
      {
        id: "cell-transport",
        name: "Cell Transport",
        description: "Study of movement across cell membranes",
        subtopics: ["Diffusion", "Osmosis", "Active transport", "Endocytosis"],
        totalQuestions: 25,
        difficulty: "medium"
      },
      {
        id: "cell-communication",
        name: "Cell Communication",
        description: "Study of cell signaling",
        subtopics: ["Signal transduction", "Receptors", "Hormones", "Neurotransmitters"],
        totalQuestions: 20,
        difficulty: "hard"
      }
    ],
    genetics: [
      {
        id: "heredity",
        name: "Heredity",
        description: "Study of inheritance patterns",
        subtopics: ["Mendel's laws", "Inheritance patterns", "Pedigree analysis", "Genetic disorders"],
        totalQuestions: 40,
        difficulty: "medium"
      },
      {
        id: "mendels-laws",
        name: "Mendel's Laws",
        description: "Fundamental laws of inheritance",
        subtopics: ["Law of segregation", "Law of independent assortment", "Monohybrid cross", "Dihybrid cross"],
        totalQuestions: 35,
        difficulty: "medium"
      },
      {
        id: "chromosomes",
        name: "Chromosomes",
        description: "Study of chromosome structure and function",
        subtopics: ["Chromosome structure", "Sex chromosomes", "Chromosomal disorders", "Linkage"],
        totalQuestions: 30,
        difficulty: "medium"
      },
      {
        id: "dna-rna",
        name: "DNA and RNA",
        description: "Study of genetic material",
        subtopics: ["DNA structure", "DNA replication", "Transcription", "Translation"],
        totalQuestions: 35,
        difficulty: "hard"
      },
      {
        id: "genetic-disorders",
        name: "Genetic Disorders",
        description: "Study of inherited diseases",
        subtopics: ["Single gene disorders", "Chromosomal disorders", "Multifactorial disorders", "Genetic counseling"],
        totalQuestions: 20,
        difficulty: "medium"
      }
    ]
  }
};

// ===== GENERATE QUESTIONS API =====
export const generateDummyQuestions = (request: {
  subject: string;
  chapters: string[];
  topics: string[];
  num_questions: number;
  marks_per_question: number;
  chapter_weights: { chapter: string; num_questions: number }[];
}) => {
  const { subject, num_questions, marks_per_question } = request;
  
  const questions = [];
  const questionTemplates = {
    physics: [
      {
        question: "A particle moves with velocity v = 2t + 3 m/s. What is the displacement after 5 seconds?",
        options: ["25 m", "30 m", "35 m", "40 m"],
        correctAnswer: 2,
        explanation: "Displacement = ∫v dt = ∫(2t + 3) dt = t² + 3t. At t = 5s, displacement = 25 + 15 = 40 m"
      },
      {
        question: "What is the SI unit of electric field?",
        options: ["N/C", "V/m", "J/C", "A/m"],
        correctAnswer: 0,
        explanation: "Electric field is force per unit charge, so its SI unit is N/C (Newton per Coulomb)"
      },
      {
        question: "The time period of a simple pendulum depends on:",
        options: ["Mass of bob", "Length of string", "Amplitude of oscillation", "Material of bob"],
        correctAnswer: 1,
        explanation: "Time period T = 2π√(l/g), so it depends only on length and acceleration due to gravity"
      }
    ],
    chemistry: [
      {
        question: "What is the oxidation state of Cr in K₂Cr₂O₇?",
        options: ["+3", "+6", "+4", "+5"],
        correctAnswer: 1,
        explanation: "In K₂Cr₂O₇, K has +1, O has -2. Let Cr be x. Then 2(+1) + 2x + 7(-2) = 0. Solving, x = +6"
      },
      {
        question: "Which of the following is a strong acid?",
        options: ["CH₃COOH", "HCl", "H₂CO₃", "HCN"],
        correctAnswer: 1,
        explanation: "HCl is a strong acid that completely dissociates in water"
      },
      {
        question: "What is the hybridization of carbon in CH₄?",
        options: ["sp", "sp²", "sp³", "sp³d"],
        correctAnswer: 2,
        explanation: "Carbon in CH₄ has 4 bonding pairs, so it uses sp³ hybridization"
      }
    ],
    biology: [
      {
        question: "Which organelle is responsible for protein synthesis?",
        options: ["Mitochondria", "Ribosomes", "Golgi apparatus", "Endoplasmic reticulum"],
        correctAnswer: 1,
        explanation: "Ribosomes are the sites of protein synthesis in cells"
      },
      {
        question: "What is the function of red blood cells?",
        options: ["Fight infection", "Transport oxygen", "Produce antibodies", "Clot blood"],
        correctAnswer: 1,
        explanation: "Red blood cells contain hemoglobin which transports oxygen from lungs to tissues"
      },
      {
        question: "Which of the following is a sex-linked trait?",
        options: ["Blood type", "Eye color", "Color blindness", "Height"],
        correctAnswer: 2,
        explanation: "Color blindness is a sex-linked trait carried on the X chromosome"
      }
    ]
  };

  const templates = questionTemplates[subject as keyof typeof questionTemplates] || questionTemplates.physics;

  for (let i = 0; i < num_questions; i++) {
    const template = templates[i % templates.length];
    questions.push({
      id: `${subject}_q_${i + 1}`,
      subject,
      chapter: request.chapters[Math.floor(Math.random() * request.chapters.length)],
      topic: request.topics[Math.floor(Math.random() * request.topics.length)],
      difficulty: ["easy", "medium", "hard"][Math.floor(Math.random() * 3)] as "easy" | "medium" | "hard",
      question: template.question,
      options: template.options,
      correctAnswer: template.correctAnswer,
      explanation: template.explanation,
      marks: marks_per_question,
      timeToSolve: Math.floor(Math.random() * 120) + 60 // 60-180 seconds
    });
  }

  return {
    subject,
    totalQuestions: num_questions,
    totalMarks: num_questions * marks_per_question,
    questions,
    generatedAt: new Date().toISOString()
  };
};

// ===== GENERATE NEET PAPER API =====
export const generateDummyNEETPaper = (subjects: string[] = ["chemistry", "physics", "biology"]) => {
  const neetPaper = {
    examName: "NEET Mock Test",
    subjects,
    totalQuestions: 180,
    totalMarks: 720,
    duration: 200, // minutes
    sections: subjects.map(subject => ({
      subject,
      questions: 60,
      marks: 240,
      timeLimit: 67 // minutes per section
    })),
    questions: [] as any[]
  };

  // Generate questions for each subject
  subjects.forEach(subject => {
    const subjectQuestions = generateDummyQuestions({
      subject,
      chapters: dummyChapters[subject as keyof typeof dummyChapters]?.map(c => c.id) || [],
      topics: [],
      num_questions: 60,
      marks_per_question: 4,
      chapter_weights: []
    });
    
    neetPaper.questions.push(...subjectQuestions.questions);
  });

  return {
    ...neetPaper,
    generatedAt: new Date().toISOString(),
    instructions: [
      "This is a mock NEET examination",
      "Total time: 3 hours 20 minutes",
      "Each question carries 4 marks",
      "Negative marking: -1 for wrong answer",
      "No negative marking for unattempted questions"
    ]
  };
};

// ===== API Response Functions =====
export const getDummySubjects = () => dummySubjects;
export const getDummyChapters = (subject: string) => dummyChapters[subject as keyof typeof dummyChapters] || [];
export const getDummyTopics = (subject: string, chapter: string) => {
  const subjectTopics = dummyTopics[subject as keyof typeof dummyTopics];
  return subjectTopics?.[chapter as keyof typeof subjectTopics] || [];
}; 