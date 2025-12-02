import { enrichCourseWithContent } from './courseContent';

// Massive content expansion - 200+ challenges, quests, and courses
export const massiveChallenges = Array.from({ length: 200 }, (_, i) => ({
  id: `challenge_${i + 1}`,
  arenaId: ["ai", "web", "mobile", "cybersecurity", "blockchain", "devops", "gamedev", "iot", "physics", "math", "quantum", "fpga", "verification", "compilers", "hpc", "biotech", "ar-vr"][i % 17],
  title: `Challenge ${i + 1}: ${["Build", "Optimize", "Secure", "Design", "Implement", "Debug", "Analyze", "Scale"][i % 8]} ${["AI Model", "Web App", "Mobile App", "Security System", "Smart Contract", "Pipeline", "Game", "IoT Device"][i % 8]}`,
  description: `Complete this advanced challenge to master ${["deep learning", "full-stack development", "mobile architecture", "network security", "blockchain protocols", "infrastructure", "game physics", "embedded systems"][i % 8]}`,
  difficulty: ["beginner", "intermediate", "advanced", "expert"][i % 4],
  points: Math.floor((i % 4 + 1) * 25),
  xpReward: Math.floor((i % 4 + 1) * 50),
  timeLimit: Math.floor(Math.random() * 180 + 30),
  testCases: Array.from({ length: 5 }, (_, j) => ({ input: `input_${j}`, expected: `output_${j}` })),
  hints: ["Think about edge cases", "Start with a simple solution", "Optimize after correctness"],
  resources: ["Documentation", "Tutorial", "Reference Material"],
  tags: ["practice", "real-world", "assessment"],
}));

export const massiveQuests = Array.from({ length: 100 }, (_, i) => ({
  id: `quest_${i + 1}`,
  title: `Daily Quest ${i + 1}: ${["Code", "Learn", "Build", "Debug", "Review", "Optimize"][i % 6]} for 30 minutes`,
  description: `Complete ${["5 challenges", "1 course module", "1 project", "3 code reviews", "2 discussions"][i % 5]} to earn XP and rewards`,
  type: ["daily", "weekly", "monthly"][i % 3],
  xpReward: [25, 50, 100, 200][i % 4],
  target: [5, 10, 20, 50][i % 4],
  category: ["practice", "learning", "community", "achievements"][i % 4],
  badge: `quest_badge_${i % 10}`,
  tags: ["activity", "progress"],
}));

export const massiveCourses = Array.from({ length: 85 }, (_, i) => ({
  id: `course_${i + 1}`,
  title: `Master ${["AI/ML", "Web Dev", "Mobile Apps", "Security", "Blockchain", "DevOps", "Game Dev", "IoT"][i % 8]} - Course ${i + 1}`,
  description: `Comprehensive course covering fundamentals to advanced topics with hands-on projects and real-world applications`,
  difficulty: ["beginner", "intermediate", "advanced"][i % 3],
  duration: 120 + Math.floor(Math.random() * 480),
  category: ["ai", "web", "mobile", "security", "blockchain", "devops", "gamedev", "iot"][i % 8],
  xpReward: 500 + (i % 3) * 250,
  enrollments: Math.floor(Math.random() * 10000 + 100),
  rating: Math.random() * 1 + 4,
  modules: Array.from({ length: 5 + (i % 4) }, (_, j) => ({
    title: `Module ${j + 1}: ${["Fundamentals", "Practical Skills", "Advanced Topics", "Project Work", "Assessment"][j % 5]}`,
    lessons: 3 + (j % 5)
  })),
  tags: ["course", "structured", "comprehensive"],
  content: {
    lectures: Array.from({ length: 12 }, (_, l) => ({
      title: `Lecture ${l + 1}: ${["Introduction to Core Concepts", "Building Your First Project", "Advanced Techniques", "Best Practices", "Real-World Applications"][l % 5]}`,
      duration: 30 + Math.floor(Math.random() * 60),
      videoUrl: `https://example.com/lecture-${l + 1}`
    })),
    notes: Array.from({ length: 8 }, (_, n) => 
      `# Topic ${n + 1}\n\nKey Points:\n• Concept explanation and theory\n• Practical examples\n• Common pitfalls and how to avoid them\n• Real-world applications\n\nPractice: Try implementing this concept in a small project.`
    ),
    flashcards: Array.from({ length: 15 }, (_, f) => ({
      front: `${["Define", "Explain", "What is", "How do you implement", "When should you use"][f % 5]} ${["the core concept", "this pattern", "this technique", "this framework", "this best practice"][f % 5]}?`,
      back: `Key insight: Understanding this concept is crucial for ${["building scalable systems", "writing clean code", "improving performance", "ensuring security", "collaborating effectively"][f % 5]}.`
    })),
    practice: Array.from({ length: 6 }, (_, p) => ({
      problem: `Project ${p + 1}: ${["Build a simple implementation", "Extend existing code", "Optimize performance", "Add new features", "Debug and refactor", "Create from scratch"][p % 6]}`,
      difficulty: ["beginner", "beginner", "intermediate", "intermediate", "advanced", "advanced"][p % 6],
      estimatedTime: 30 + (p * 15)
    })),
    quizzes: Array.from({ length: 5 }, (_, q) => ({
      question: `Question ${q + 1}: Which of the following best represents ${["the core concept", "best practice", "implementation pattern", "design principle", "optimization technique"][q % 5]}?`,
      options: [
        "Option A - Most common approach",
        "Option B - Also valid but less efficient",
        "Option C - Incorrect interpretation",
        "Option D - Edge case consideration"
      ],
      correct: q % 4
    }))
  }
}));

// Smart Roadmaps - Personalized Learning Paths
export const massiveRoadmaps = [
  {
    id: "roadmap_ai",
    name: "AI/ML Mastery Path",
    slug: "ai-ml-mastery",
    description: "Master artificial intelligence from fundamentals to production deployment",
    difficulty: "beginner",
    estimatedWeeks: 12,
    icon: "Brain",
    color: "purple",
    skills: ["Python", "TensorFlow", "PyTorch", "Deep Learning", "NLP", "Computer Vision"],
    milestones: [
      { title: "Foundations", description: "Learn ML fundamentals", duration: 2 },
      { title: "Deep Learning Basics", description: "Neural networks and backprop", duration: 2 },
      { title: "Advanced Topics", description: "CNNs, RNNs, Transformers", duration: 4 },
      { title: "Production Deployment", description: "Deploy ML models at scale", duration: 2 },
      { title: "Capstone Project", description: "Build your own AI product", duration: 2 },
    ],
  },
  {
    id: "roadmap_web",
    name: "Full-Stack Web Development",
    slug: "fullstack-web",
    description: "Build modern web applications with React, Node.js, and databases",
    difficulty: "beginner",
    estimatedWeeks: 10,
    icon: "Code",
    color: "blue",
    skills: ["JavaScript", "React", "Node.js", "PostgreSQL", "Docker", "REST APIs"],
    milestones: [
      { title: "Frontend Basics", description: "HTML, CSS, JavaScript", duration: 2 },
      { title: "React Mastery", description: "Components, hooks, state management", duration: 2 },
      { title: "Backend Development", description: "Node.js, APIs, databases", duration: 3 },
      { title: "DevOps & Deployment", description: "Docker, deployment, CI/CD", duration: 2 },
      { title: "Build a SaaS", description: "Create a production web app", duration: 1 },
    ],
  },
  {
    id: "roadmap_security",
    name: "Cybersecurity Professional",
    slug: "cybersecurity-pro",
    description: "Learn to secure systems, prevent attacks, and build secure applications",
    difficulty: "intermediate",
    estimatedWeeks: 14,
    icon: "Shield",
    color: "green",
    skills: ["Network Security", "Penetration Testing", "Cryptography", "Risk Management", "Incident Response"],
    milestones: [
      { title: "Security Fundamentals", description: "Network, encryption, authentication", duration: 3 },
      { title: "Penetration Testing", description: "Find and exploit vulnerabilities", duration: 3 },
      { title: "Secure Development", description: "Write secure code", duration: 2 },
      { title: "Risk Management", description: "Identify and mitigate risks", duration: 3 },
      { title: "Security Architecture", description: "Design secure systems", duration: 3 },
    ],
  },
  {
    id: "roadmap_mobile",
    name: "Mobile App Developer",
    slug: "mobile-dev",
    description: "Build iOS and Android apps that users love",
    difficulty: "intermediate",
    estimatedWeeks: 12,
    icon: "Smartphone",
    color: "cyan",
    skills: ["Swift", "Kotlin", "React Native", "Mobile UI", "APIs", "Performance"],
    milestones: [
      { title: "Swift Basics", description: "iOS fundamentals", duration: 2 },
      { title: "UIKit & SwiftUI", description: "Build iOS interfaces", duration: 2 },
      { title: "Android Development", description: "Kotlin and Android framework", duration: 3 },
      { title: "Cross-Platform", description: "React Native for iOS & Android", duration: 2 },
      { title: "App Deployment", description: "Publish to App Store", duration: 1 },
      { title: "Performance & Testing", description: "Optimize and test apps", duration: 2 },
    ],
  },
  {
    id: "roadmap_blockchain",
    name: "Web3 & Blockchain Developer",
    slug: "web3-blockchain",
    description: "Master smart contracts, DApps, and blockchain technology",
    difficulty: "advanced",
    estimatedWeeks: 14,
    icon: "Code",
    color: "orange",
    skills: ["Solidity", "Ethereum", "Web3.js", "Smart Contracts", "DeFi", "NFTs"],
    milestones: [
      { title: "Blockchain Basics", description: "Understand distributed ledgers", duration: 2 },
      { title: "Smart Contracts", description: "Write Solidity contracts", duration: 3 },
      { title: "DApp Development", description: "Build decentralized applications", duration: 3 },
      { title: "DeFi Protocol", description: "Create financial products", duration: 3 },
      { title: "Advanced Security", description: "Audit and secure contracts", duration: 2 },
      { title: "Production Deployment", description: "Deploy to mainnet", duration: 1 },
    ],
  },
  {
    id: "roadmap_devops",
    name: "DevOps & Cloud Engineering",
    slug: "devops-cloud",
    description: "Master infrastructure, automation, and cloud platforms",
    difficulty: "intermediate",
    estimatedWeeks: 12,
    icon: "Cpu",
    color: "teal",
    skills: ["Docker", "Kubernetes", "AWS", "Terraform", "CI/CD", "Monitoring"],
    milestones: [
      { title: "Docker & Containerization", description: "Container fundamentals", duration: 2 },
      { title: "Kubernetes Orchestration", description: "Container orchestration at scale", duration: 3 },
      { title: "Cloud Platforms", description: "AWS, GCP, Azure services", duration: 3 },
      { title: "Infrastructure as Code", description: "Terraform, CloudFormation", duration: 2 },
      { title: "CI/CD Pipelines", description: "Automate deployments", duration: 2 },
    ],
  },
  {
    id: "roadmap_quantum",
    name: "Quantum Computing Pioneer",
    slug: "quantum-computing",
    description: "Explore quantum algorithms and quantum programming",
    difficulty: "advanced",
    estimatedWeeks: 16,
    icon: "Zap",
    color: "indigo",
    skills: ["Qiskit", "Quantum Algorithms", "Linear Algebra", "Physics Basics", "Quantum Simulation"],
    milestones: [
      { title: "Quantum Physics Basics", description: "Qubits and superposition", duration: 3 },
      { title: "Quantum Gates", description: "Quantum operations and circuits", duration: 2 },
      { title: "Quantum Algorithms", description: "Shor's, Grover's algorithms", duration: 3 },
      { title: "Quantum Programming", description: "Qiskit framework", duration: 3 },
      { title: "Quantum Machine Learning", description: "ML on quantum computers", duration: 3 },
      { title: "Advanced Topics", description: "Error correction, optimization", duration: 2 },
    ],
  },
];

// COMPETITIONS - Global Contests & Tournaments (Dynamic Status Based on Current Date)
function generateDynamicCompetitions() {
  const now = new Date();
  
  // Base competitions with relative dates
  const baseCompetitions = [
    {
      title: "Global AI Challenge 2024",
      description: "Build an AI model that predicts tech trends. Top 10 get featured on DevPost.",
      type: "ml",
      difficulty: "hard",
      daysOffset: { start: -15, end: 15 },
      prizePool: 50000,
      prizes: ["$10,000 - 1st Place", "$5,000 - 2nd Place", "$2,500 - 3rd Place"],
      imageUrl: "https://images.unsplash.com/photo-1677442d019cecf3da12172d10e3066faf3d831f3?w=500",
      tags: ["AI", "Machine Learning", "Data Science"],
    },
    {
      title: "Web3 DApp Hackathon",
      description: "Create a decentralized application on Ethereum. Win ETH prizes + incubator spot.",
      type: "blockchain",
      difficulty: "extreme",
      daysOffset: { start: -10, end: 20 },
      prizePool: 100000,
      prizes: ["$20,000 + Incubator - 1st Place", "$10,000 - 2nd Place", "$5,000 - 3rd Place"],
      imageUrl: "https://images.unsplash.com/photo-1639322537228-f710d846310e?w=500",
      tags: ["Blockchain", "Smart Contracts", "Web3", "Ethereum"],
    },
    {
      title: "Cybersecurity CTF 2024",
      description: "Capture The Flag competition. Find vulnerabilities, exploit systems, defend networks.",
      type: "security",
      difficulty: "extreme",
      daysOffset: { start: -5, end: 25 },
      prizePool: 75000,
      prizes: ["$15,000 - Team 1st", "$8,000 - Team 2nd", "$4,000 - Team 3rd"],
      imageUrl: "https://images.unsplash.com/photo-1550751827-4bd582f6de8c?w=500",
      tags: ["Security", "CTF", "Hacking", "Defense"],
    },
    {
      title: "Full-Stack Web Dev Sprint",
      description: "Build a complete web application in 2 weeks. React + Node.js + Database required.",
      type: "web",
      difficulty: "medium",
      daysOffset: { start: -8, end: 22 },
      prizePool: 25000,
      prizes: ["$8,000 - 1st Place", "$4,000 - 2nd Place", "$2,000 - 3rd Place"],
      imageUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500",
      tags: ["Web Development", "React", "Node.js", "Full-Stack"],
    },
    {
      title: "Quantum Computing Challenge",
      description: "Solve quantum algorithms using Qiskit. Theoretical and practical problems.",
      type: "quantum",
      difficulty: "extreme",
      daysOffset: { start: 10, end: 40 },
      prizePool: 50000,
      prizes: ["$15,000 - 1st Place", "$8,000 - 2nd Place", "$4,000 - 3rd Place"],
      imageUrl: "https://images.unsplash.com/photo-1635070041078-e5b94039d226?w=500",
      tags: ["Quantum", "Physics", "Algorithms"],
    },
    {
      title: "Mobile App Innovation Sprint",
      description: "Create iOS/Android app solving real-world problems. 3-week sprint.",
      type: "mobile",
      difficulty: "hard",
      daysOffset: { start: 15, end: 36 },
      prizePool: 30000,
      prizes: ["$10,000 - 1st Place", "$5,000 - 2nd Place", "$2,500 - 3rd Place"],
      imageUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500",
      tags: ["Mobile", "iOS", "Android"],
    },
    {
      title: "DevOps & Cloud Architecture",
      description: "Design and deploy scalable cloud infrastructure. AWS/GCP/Azure.",
      type: "devops",
      difficulty: "hard",
      daysOffset: { start: 20, end: 51 },
      prizePool: 35000,
      prizes: ["$12,000 - 1st Place", "$6,000 - 2nd Place", "$3,000 - 3rd Place"],
      imageUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500",
      tags: ["DevOps", "Cloud", "Infrastructure"],
    },
    {
      title: "AI Code Generation Showdown",
      description: "Write code using AI assistants. Fastest and cleanest wins.",
      type: "ai",
      difficulty: "medium",
      daysOffset: { start: -30, end: -5 },
      prizePool: 40000,
      prizes: ["$12,000 - Winner", "$6,000 - Runner-up", "$3,000 - 3rd Place"],
      imageUrl: "https://images.unsplash.com/photo-1677442d019cecf3da12172d10e3066faf3d831f3?w=500",
      tags: ["AI", "Code Generation", "Programming"],
    },
    {
      title: "Open Source Contribution Rally",
      description: "Contribute to major open source projects. Most PRs merged wins.",
      type: "opensource",
      difficulty: "medium",
      daysOffset: { start: -60, end: -35 },
      prizePool: 50000,
      prizes: ["GitHub Sponsorship + $10,000", "$6,000", "$3,000"],
      imageUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500",
      tags: ["Open Source", "Community", "Contribution"],
    },
  ];
  
  return baseCompetitions.map((comp, idx) => {
    const startDate = new Date(now);
    startDate.setDate(startDate.getDate() + comp.daysOffset.start);
    
    const endDate = new Date(now);
    endDate.setDate(endDate.getDate() + comp.daysOffset.end);
    
    let status = "upcoming";
    let participantCount = 0;
    
    if (now >= startDate && now <= endDate) {
      status = "active";
      participantCount = Math.floor(Math.random() * 3000) + 100;
    } else if (now > endDate) {
      status = "ended";
      participantCount = Math.floor(Math.random() * 5000) + 1000;
    }
    
    const leaderboard = status !== "upcoming" ? [
      { rank: 1, username: `Winner${idx}`, score: Math.floor(Math.random() * 100) + 9000, submissions: Math.floor(Math.random() * 20) + 8 },
      { rank: 2, username: `Runner${idx}`, score: Math.floor(Math.random() * 100) + 8900, submissions: Math.floor(Math.random() * 20) + 6 },
      { rank: 3, username: `Third${idx}`, score: Math.floor(Math.random() * 100) + 8800, submissions: Math.floor(Math.random() * 20) + 5 },
    ] : [];
    
    return {
      id: `comp_${String(idx + 1).padStart(3, '0')}`,
      ...comp,
      status,
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      participantCount,
      maxParticipants: 10000,
      leaderboard,
    };
  });
}

export const massiveCompetitions = generateDynamicCompetitions();

// Fallback static competitions (for reference)
const staticCompetitions = [
  {
    id: "comp_001",
    title: "Global AI Challenge 2024",
    description: "Build an AI model that predicts tech trends. Top 10 get featured on DevPost.",
    type: "ml",
    difficulty: "hard",
    status: "active",
    startDate: "2024-12-01",
    endDate: "2024-12-31",
    participantCount: 1247,
    maxParticipants: 5000,
    prizePool: 50000,
    prizes: ["$10,000 - 1st Place", "$5,000 - 2nd Place", "$2,500 - 3rd Place"],
    imageUrl: "https://images.unsplash.com/photo-1677442d019cecf3da12172d10e3066faf3d831f3?w=500",
    tags: ["AI", "Machine Learning", "Data Science"],
    leaderboard: [
      { rank: 1, username: "AlexAI", score: 9850, submissions: 15 },
      { rank: 2, username: "DataMaster", score: 9720, submissions: 12 },
      { rank: 3, username: "MLWizard", score: 9580, submissions: 18 },
      { rank: 4, username: "NeuralNet", score: 9420, submissions: 10 },
      { rank: 5, username: "DeepLearner", score: 9210, submissions: 14 },
    ]
  },
  {
    id: "comp_002",
    title: "Web3 DApp Hackathon",
    description: "Create a decentralized application on Ethereum. Win ETH prizes + incubator spot.",
    type: "blockchain",
    difficulty: "extreme",
    status: "active",
    startDate: "2024-12-05",
    endDate: "2024-12-26",
    participantCount: 834,
    maxParticipants: 2000,
    prizePool: 100000,
    prizes: ["$20,000 + Incubator - 1st Place", "$10,000 - 2nd Place", "$5,000 - 3rd Place"],
    imageUrl: "https://images.unsplash.com/photo-1639322537228-f710d846310e?w=500",
    tags: ["Blockchain", "Smart Contracts", "Web3", "Ethereum"],
    leaderboard: [
      { rank: 1, username: "Web3Pro", score: 8950, submissions: 8 },
      { rank: 2, username: "SolidityMaster", score: 8720, submissions: 11 },
      { rank: 3, username: "BlockchainGuru", score: 8540, submissions: 9 },
    ]
  },
  {
    id: "comp_003",
    title: "Cybersecurity CTF 2024",
    description: "Capture The Flag competition. Find vulnerabilities, exploit systems, defend networks.",
    type: "security",
    difficulty: "extreme",
    status: "active",
    startDate: "2024-12-10",
    endDate: "2024-12-24",
    participantCount: 2156,
    maxParticipants: 5000,
    prizePool: 75000,
    prizes: ["$15,000 - Team 1st", "$8,000 - Team 2nd", "$4,000 - Team 3rd"],
    imageUrl: "https://images.unsplash.com/photo-1550751827-4bd582f6de8c?w=500",
    tags: ["Security", "CTF", "Hacking", "Defense"],
    leaderboard: [
      { rank: 1, username: "HackerTeam", score: 9200, submissions: 6 },
      { rank: 2, username: "SecurityExperts", score: 8890, submissions: 7 },
      { rank: 3, username: "DefenseForce", score: 8560, submissions: 8 },
    ]
  },
  {
    id: "comp_004",
    title: "Full-Stack Web Dev Sprint",
    description: "Build a complete web application in 2 weeks. React + Node.js + Database required.",
    type: "web",
    difficulty: "medium",
    status: "active",
    startDate: "2024-12-08",
    endDate: "2024-12-22",
    participantCount: 3421,
    maxParticipants: 10000,
    prizePool: 25000,
    prizes: ["$8,000 - 1st Place", "$4,000 - 2nd Place", "$2,000 - 3rd Place"],
    imageUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500",
    tags: ["Web Development", "React", "Node.js", "Full-Stack"],
    leaderboard: [
      { rank: 1, username: "WebWizard", score: 8750, submissions: 20 },
      { rank: 2, username: "FullStackDev", score: 8620, submissions: 19 },
      { rank: 3, username: "ReactMaster", score: 8480, submissions: 18 },
    ]
  },
  // UPCOMING COMPETITIONS
  {
    id: "comp_005",
    title: "Quantum Computing Challenge",
    description: "Solve quantum algorithms using Qiskit. Theoretical and practical problems.",
    type: "quantum",
    difficulty: "extreme",
    status: "upcoming",
    startDate: "2025-01-01",
    endDate: "2025-01-31",
    participantCount: 0,
    maxParticipants: 1000,
    prizePool: 50000,
    prizes: ["$15,000 - 1st Place", "$8,000 - 2nd Place", "$4,000 - 3rd Place"],
    imageUrl: "https://images.unsplash.com/photo-1635070041078-e5b94039d226?w=500",
    tags: ["Quantum", "Physics", "Algorithms"],
    leaderboard: []
  },
  {
    id: "comp_006",
    title: "Mobile App Innovation Sprint",
    description: "Create iOS/Android app solving real-world problems. 3-week sprint.",
    type: "mobile",
    difficulty: "hard",
    status: "upcoming",
    startDate: "2025-01-05",
    endDate: "2025-01-26",
    participantCount: 0,
    maxParticipants: 3000,
    prizePool: 30000,
    prizes: ["$10,000 - 1st Place", "$5,000 - 2nd Place", "$2,500 - 3rd Place"],
    imageUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500",
    tags: ["Mobile", "iOS", "Android"],
    leaderboard: []
  },
  {
    id: "comp_007",
    title: "DevOps & Cloud Architecture",
    description: "Design and deploy scalable cloud infrastructure. AWS/GCP/Azure.",
    type: "devops",
    difficulty: "hard",
    status: "upcoming",
    startDate: "2025-01-10",
    endDate: "2025-02-09",
    participantCount: 0,
    maxParticipants: 2000,
    prizePool: 35000,
    prizes: ["$12,000 - 1st Place", "$6,000 - 2nd Place", "$3,000 - 3rd Place"],
    imageUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500",
    tags: ["DevOps", "Cloud", "Infrastructure"],
    leaderboard: []
  },
  // PAST COMPETITIONS
  {
    id: "comp_008",
    title: "AI Code Generation Showdown",
    description: "Write code using AI assistants. Fastest and cleanest wins.",
    type: "ai",
    difficulty: "medium",
    status: "ended",
    startDate: "2024-11-01",
    endDate: "2024-11-30",
    participantCount: 5432,
    maxParticipants: 10000,
    prizePool: 40000,
    prizes: ["$12,000 - Winner", "$6,000 - Runner-up", "$3,000 - 3rd Place"],
    imageUrl: "https://images.unsplash.com/photo-1677442d019cecf3da12172d10e3066faf3d831f3?w=500",
    tags: ["AI", "Code Generation", "Programming"],
    leaderboard: [
      { rank: 1, username: "CodeGPT", score: 9850, submissions: 25 },
      { rank: 2, username: "AIAssistant", score: 9720, submissions: 23 },
      { rank: 3, username: "AutoCode", score: 9580, submissions: 22 },
    ]
  },
  {
    id: "comp_009",
    title: "Open Source Contribution Rally",
    description: "Contribute to major open source projects. Most PRs merged wins.",
    type: "opensource",
    difficulty: "medium",
    status: "ended",
    startDate: "2024-10-01",
    endDate: "2024-10-31",
    participantCount: 8234,
    maxParticipants: 15000,
    prizePool: 50000,
    prizes: ["GitHub Sponsorship + $10,000", "$6,000", "$3,000"],
    imageUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500",
    tags: ["Open Source", "Community", "Contribution"],
    leaderboard: [
      { rank: 1, username: "OpenSourceHero", score: 95, submissions: 48 },
      { rank: 2, username: "ContributorPro", score: 87, submissions: 42 },
      { rank: 3, username: "GitMaster", score: 79, submissions: 38 },
    ]
  },
];

// Tech News Feed - 500+ unlimited news items
export const massiveFeedItems = Array.from({ length: 500 }, (_, i) => {
  const categories = ["ai", "web", "devops", "blockchain", "iot", "cybersecurity", "gamedev", "mobile", "quantum", "biotech"];
  const sources = ["OpenAI", "React Blog", "TechCrunch", "GitHub", "Hacker News", "Dev.to", "Medium", "DZone", "InfoQ", "Ars Technica"];
  const titles = ["Breakthrough in AI Model Optimization", "Cloud Infrastructure Scaling Record", "Security Vulnerability Patched", "Open Source Milestone", "Developer Tools Update", "Performance Improvements", "New Framework Adoption", "Industry Best Practices", "Conference Insights", "Research Published", "Product Launch", "Community Initiative", "Educational Resource", "Bug Fix Release", "Integration Announcement"];
  const imageUrls = ["https://images.unsplash.com/photo-1677442d019cecf3da12172d10e3066faf3d831f3?w=800&h=400&fit=crop", "https://images.unsplash.com/photo-1633356122544-f134324ef6db?w=800&h=400&fit=crop", "https://images.unsplash.com/photo-1667482747897-7d0e5fce0d6d?w=800&h=400&fit=crop", "https://images.unsplash.com/photo-1639762681033-6461502e77bb?w=800&h=400&fit=crop", "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&h=400&fit=crop", "https://images.unsplash.com/photo-1550751827-4bd582f6de8c?w=800&h=400&fit=crop", "https://images.unsplash.com/photo-1538481143235-5d630029b5d1?w=800&h=400&fit=crop", "https://images.unsplash.com/photo-1512941691920-25bde6cbf335?w=800&h=400&fit=crop"];
  const category = categories[i % categories.length];
  const title = titles[i % titles.length];
  const source = sources[i % sources.length];
  const hours = Math.floor(Math.random() * 72);
  return {
    id: `feed_${i + 1}`,
    title: `${title} #${i + 1}`,
    description: `Breaking tech news: Latest ${category} updates and insights from the developer community`,
    content: `In this article, we explore the latest ${category} advancements. Industry experts share insights. Read on for exclusive analysis and commentary.`,
    category,
    source,
    sourceUrl: `https://${source.toLowerCase().replace(/\s/g, '')}.com`,
    imageUrl: imageUrls[i % imageUrls.length],
    tags: [category, "news", "trending", "tech"],
    likes: Math.floor(Math.random() * 3000 + 100),
    views: Math.floor(Math.random() * 20000 + 1000),
    createdAt: new Date(Date.now() - hours * 60 * 60 * 1000),
  };
});

// Massive AI-Driven Clans - 100+ community groups
export const massiveClans = Array.from({ length: 100 }, (_, i) => {
  const skills = ["AI/ML", "Web Dev", "Mobile", "Security", "DevOps", "Blockchain", "GameDev", "IoT", "Quantum", "Biotech"];
  const clanTypes = ["Research", "Builders", "Innovators", "Masters", "Warriors", "Explorers", "Visionaries", "Pioneers"];
  const skill = skills[i % skills.length];
  const type = clanTypes[i % clanTypes.length];
  return {
    id: `clan_${i + 1}`,
    name: `${skill} ${type} - Clan ${i + 1}`,
    description: `Join our community of ${skill} enthusiasts working together to master cutting-edge technologies. Share knowledge, collaborate on projects, and level up together.`,
    icon: ["Brain", "Code", "Smartphone", "Shield", "Cloud", "Link", "Gamepad2", "Wifi"][i % 8],
    memberCount: Math.floor(Math.random() * 500 + 10),
    xpBonus: Math.floor(Math.random() * 50 + 10),
    badgeReward: `clan_badge_${i % 20}`,
    category: skill.toLowerCase().replace(/\s/g, "-"),
    banner: ["https://images.unsplash.com/photo-1677442d019cecf3da12172d10e3066faf3d831f3?w=800&h=200&fit=crop", "https://images.unsplash.com/photo-1639762681033-6461502e77bb?w=800&h=200&fit=crop"][i % 2],
    perks: [`+${Math.floor(Math.random() * 30 + 10)}% XP on challenges`, "Access to exclusive resources", "Weekly knowledge sharing", "Mentorship from experienced members"],
    joinRequirement: i % 3 === 0 ? "Any level welcome" : `Level ${Math.floor(i / 10) + 1}+`,
    isActive: true,
    createdAt: new Date(Date.now() - Math.floor(Math.random() * 90) * 24 * 60 * 60 * 1000),
  };
});
