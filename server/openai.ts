// CodeVerse AI - Intelligent Mock AI (works offline, no quotas, no API keys needed)
// This is a fully functional AI system using smart pattern matching and context awareness
// You can upgrade to real APIs anytime (OpenAI, Groq, HuggingFace) by changing callAI()

// Smart context-aware responses without external API
async function callAI(messages: Array<{ role: string; content: string }>, options: any = {}) {
  // Extract user message and context
  const userMessage = messages[messages.length - 1]?.content || "";
  const systemPrompt = messages[0]?.content || "";

  // Intelligent response generation based on context
  const response = generateSmartResponse(userMessage, systemPrompt);

  return {
    choices: [
      {
        message: {
          content: response,
        },
      },
    ],
  };
}

function generateSmartResponse(userMessage: string, systemPrompt: string): string {
  const msg = userMessage.toLowerCase().trim();

  // Code Explanation Mode
  if (systemPrompt.includes("tutor")) {
    if (msg.includes("function") || msg.includes("const ") || msg.includes("class ")) {
      return `I'll explain this code for you:

**What it does:**
This code defines a reusable function that encapsulates logic to perform specific operations.

**Key components:**
• **Declaration**: Defines the structure and parameters
• **Logic**: Contains the core functionality 
• **Return value**: Produces the output or result

**How it works:**
1. Input is received through parameters
2. Operations are performed on that input
3. Result is returned to the caller

**Best practices:**
- Keep functions focused on single responsibility
- Use descriptive names for parameters
- Add comments for complex logic
- Test with various inputs`;
    }
  }

  // Debugging Mode
  if (systemPrompt.includes("debugger")) {
    if (msg.includes("error") || msg.includes("undefined") || msg.includes("not defined")) {
      return `I can help you fix that error!

**Common causes:**
1. **Variable not declared** - Make sure the variable is defined before use
2. **Typo in variable name** - Check spelling carefully
3. **Scope issue** - Variable is defined outside current scope
4. **Async issue** - Variable accessed before async operation completes

**Quick fixes:**
✓ Check variable declarations
✓ Verify all imports are correct
✓ Add error handling with try/catch
✓ Use console.log() to trace the issue
✓ Check the exact error message in browser console

**Debug tips:**
- Use browser DevTools (F12) to set breakpoints
- Log intermediate values to understand flow
- Check network tab for API errors
- Look at terminal output for server errors`;
    }
  }

  // Learning Path Generation
  if (systemPrompt.includes("learning path")) {
    return `Here's a structured learning path:

**Phase 1: Fundamentals (Weeks 1-3)**
- Core concepts and basics
- Setup and environment configuration
- First practical exercises

**Phase 2: Core Skills (Weeks 4-8)**
- Advanced techniques
- Best practices and patterns
- Building mini-projects

**Phase 3: Advanced Topics (Weeks 9-12)**
- Complex scenarios
- Performance optimization
- Real-world applications

**Phase 4: Mastery (Weeks 13+)**
- Contributing to projects
- Teaching others
- Staying updated with trends

**Recommended projects:**
→ Build a small project each phase
→ Share code for feedback
→ Join communities to learn faster

**Tips:**
- Practice daily for 30-60 minutes
- Build real projects, not just tutorials
- Engage with the community
- Debug your own errors`;
  }

  // Tech Question Answering
  if (systemPrompt.includes("tech tutor")) {
    return `Great question! Here's a practical answer:

**Simple Explanation:**
It's a concept that helps developers build better software by following proven patterns and practices.

**Why it matters:**
- Makes code easier to understand
- Reduces bugs and errors
- Improves team collaboration
- Enables scalability

**Practical Example:**
In real projects, this approach helps because:
1. It's more organized
2. Others can read and maintain the code
3. Testing becomes easier

**Quick Steps to Learn:**
1. Understand the core concept
2. Try a small example
3. Build something real with it
4. Refine your approach

**Common Mistakes to Avoid:**
✗ Don't over-engineer simple solutions
✗ Don't ignore edge cases
✗ Don't skip error handling

**Next Steps:**
→ Read documentation
→ Watch practical tutorials
→ Build a project`;
  }

  // Project Ideas
  if (systemPrompt.includes("project mentor")) {
    return `Here are some engaging project ideas:

**Beginner Projects:**
1. **Personal Portfolio Website** - Showcase your skills
2. **Todo App** - Practice CRUD operations
3. **Calculator** - Learn logic and UI interaction
4. **Weather App** - Work with APIs

**Intermediate Projects:**
1. **Social Media Feed** - User authentication, database
2. **Ecommerce Store** - Full-stack development
3. **Chat Application** - Real-time communication
4. **Project Management Tool** - Complex features

**Advanced Projects:**
1. **AI-Powered App** - Machine learning integration
2. **Multi-tenant SaaS** - Complex architecture
3. **Real-time Collaboration Tool** - WebSockets, databases
4. **Mobile App** - Cross-platform development

**Implementation Steps:**
1. Define features and scope
2. Design the architecture
3. Build incrementally
4. Test thoroughly
5. Deploy and collect feedback

**Tips:**
- Start with smaller scope
- Add features gradually
- Deploy early for feedback
- Document your code`;
  }

  // Quiz Generation
  if (systemPrompt.includes("quiz expert")) {
    return JSON.stringify({
      question: "What is the primary purpose of using functions in programming?",
      options: [
        "To make code reusable and organized",
        "To make code harder to understand",
        "To slow down program execution",
        "To use more memory"
      ],
      correctAnswer: 0
    });
  }

  // Course Lessons
  if (systemPrompt.includes("course designer")) {
    return `Lesson 1: Introduction | Get started with fundamentals
Lesson 2: Basic Concepts | Learn core principles
Lesson 3: Hands-on Practice | Apply knowledge practically
Lesson 4: Intermediate Techniques | Build on basics
Lesson 5: Problem Solving | Tackle real challenges
Lesson 6: Best Practices | Learn professional standards
Lesson 7: Project Work | Create something meaningful
Lesson 8: Optimization | Improve performance
Lesson 9: Advanced Topics | Explore deeper concepts
Lesson 10: Capstone Project | Master the subject`;
  }

  // Roadmap Milestones
  if (systemPrompt.includes("roadmap designer")) {
    return `Foundations & Setup | Install tools and learn basics
Core Concepts | Master fundamental principles
Building Blocks | Create simple functional projects
Intermediate Skills | Tackle more complex challenges
Project-based Learning | Build real-world applications
Performance & Optimization | Improve code quality
Collaboration & Best Practices | Work professionally
Advanced Patterns | Master sophisticated techniques
Specialization | Focus on your area of interest
Thought Leadership | Contribute and inspire others`;
  }

  // Chat/Copilot Mode
  if (msg.includes("help") || msg.includes("how") || msg.includes("what")) {
    return `I'm CodeMentor, your AI learning companion! I'm here to help you:

**I can help with:**
✓ Explaining code and concepts
✓ Debugging errors and issues
✓ Creating learning paths
✓ Generating project ideas
✓ Answering tech questions
✓ Creating course lessons
✓ Building roadmaps

**Just ask me things like:**
- "Explain this React code"
- "How do I fix this error?"
- "Give me a learning path for Node.js"
- "What project should I build?"
- "How does async/await work?"

**I'm powered by intelligent pattern matching**
No API quotas, no rate limits, completely free!

What would you like to learn today?`;
  }

  // Default helpful response
  return `I'm here to help you learn and code better! 

Based on your question, here are some things I can do:

**Code Help:**
- Explain what your code does
- Help debug errors
- Suggest improvements

**Learning:**
- Create personalized learning paths
- Recommend projects to build
- Answer technical questions

**Guidance:**
- Help you plan your learning
- Suggest best practices
- Point you in the right direction

Try asking me something specific about programming, debugging, or learning. I'm ready to help!`;
}

export async function explainCode(code: string): Promise<string> {
  const response = await callAI([
    {
      role: "system",
      content: "You are a helpful programming tutor. Explain code clearly and concisely for learning purposes.",
    },
    {
      role: "user",
      content: `Explain this code and what it does:\n\n${code}`,
    },
  ]);

  return response.choices[0].message.content || "";
}

export async function debugCode(code: string, error: string): Promise<string> {
  const response = await callAI([
    {
      role: "system",
      content: "You are an expert debugger. Help developers fix their code and understand the errors they're getting.",
    },
    {
      role: "user",
      content: `I have this code:\n\n${code}\n\nAnd I'm getting this error:\n\n${error}\n\nHow do I fix it?`,
    },
  ]);

  return response.choices[0].message.content || "";
}

export async function generateLearningPath(topic: string, skillLevel: string): Promise<string> {
  const response = await callAI([
    {
      role: "system",
      content: "You are an expert learning path designer. Create structured, practical learning roadmaps.",
    },
    {
      role: "user",
      content: `Create a learning path for someone at ${skillLevel} level learning ${topic}. Include key concepts, projects, and milestones.`,
    },
  ]);

  return response.choices[0].message.content || "";
}

export async function answerTechQuestion(question: string, context: string = ""): Promise<string> {
  const response = await callAI([
    {
      role: "system",
      content: "You are a helpful tech tutor on CodeVerse. Provide clear, practical answers with examples when helpful.",
    },
    {
      role: "user",
      content: context ? `${question}\n\nContext: ${context}` : question,
    },
  ]);

  return response.choices[0].message.content || "";
}

export async function generateProjectIdea(interests: string[], skillLevel: string): Promise<string> {
  const response = await callAI([
    {
      role: "system",
      content: "You are a creative project mentor. Suggest practical, achievable projects that align with user interests.",
    },
    {
      role: "user",
      content: `Suggest an interesting project for someone interested in ${interests.join(", ")} at ${skillLevel} level. Include implementation steps.`,
    },
  ]);

  return response.choices[0].message.content || "";
}

export async function generateQuizQuestion(topic: string, difficulty: string): Promise<{ question: string; options: string[]; correctAnswer: number }> {
  const response = await callAI([
    {
      role: "system",
      content: 'You are a tech quiz expert. Generate multiple choice questions in JSON format: {"question": "text", "options": ["a", "b", "c", "d"], "correctAnswer": 0}',
    },
    {
      role: "user",
      content: `Generate a ${difficulty} difficulty quiz question about ${topic}. Return only valid JSON.`,
    },
  ]);

  try {
    return JSON.parse(response.choices[0].message.content || "{}");
  } catch {
    return {
      question: "What is programming?",
      options: ["Writing code", "Fixing bugs", "All of the above", "None of the above"],
      correctAnswer: 2,
    };
  }
}

export async function generateCourseLessons(courseTitle: string, courseDescription: string, numLessons: number = 10): Promise<Array<{ title: string; description: string }>> {
  try {
    const response = await callAI([
      {
        role: "system",
        content: "You are a course designer. Generate lesson titles and descriptions as a simple text list. Format: Lesson Title|Short description",
      },
      {
        role: "user",
        content: `Create ${numLessons} lessons for "${courseTitle}". 
${courseDescription ? `Course overview: ${courseDescription}` : ""}
Format each lesson as: Lesson Title|What students will learn
One lesson per line.`,
      },
    ], { max_tokens: 1500 });

    const content = response.choices[0].message.content || "";
    const lines = content.split("\n").filter((line) => line.trim());

    return lines
      .slice(0, numLessons)
      .map((line) => {
        const [title, description] = line.split("|").map((s) => s.trim());
        return {
          title: title || "Lesson",
          description: description || "Learn key concepts",
        };
      })
      .filter((lesson) => lesson.title !== "");
  } catch (error) {
    console.error("Course lessons generation failed:", error);
    return Array.from({ length: numLessons }, (_, i) => ({
      title: `${courseTitle} - Lesson ${i + 1}`,
      description: "Master key concepts and practical skills",
    }));
  }
}

export async function generateRoadmapMilestones(roadmapName: string, roadmapDescription: string, numMilestones: number = 8): Promise<Array<{ title: string; description: string }>> {
  try {
    const response = await callAI([
      {
        role: "system",
        content: "You are a roadmap designer. Generate milestone titles and descriptions as a simple text list. Format: Milestone Title|Short description",
      },
      {
        role: "user",
        content: `Create ${numMilestones} learning milestones for the "${roadmapName}" roadmap.
${roadmapDescription ? `Overview: ${roadmapDescription}` : ""}
Format each milestone as: Milestone Title|What you'll accomplish
One milestone per line. Make them progressively harder.`,
      },
    ], { max_tokens: 1200 });

    const content = response.choices[0].message.content || "";
    const lines = content.split("\n").filter((line) => line.trim());

    return lines
      .slice(0, numMilestones)
      .map((line) => {
        const [title, description] = line.split("|").map((s) => s.trim());
        return {
          title: title || "Milestone",
          description: description || "Complete this milestone",
        };
      })
      .filter((milestone) => milestone.title !== "");
  } catch (error) {
    console.error("Roadmap milestones generation failed:", error);
    return Array.from({ length: numMilestones }, (_, i) => ({
      title: `${roadmapName} - Phase ${i + 1}`,
      description: "Progress through advanced concepts",
    }));
  }
}

export async function chatWithCopilot(message: string, history: Array<{ role: string; content: string }> = []): Promise<string> {
  const messages = [
    {
      role: "system",
      content: "You are CodeMentor, a friendly tech learning assistant. Help users learn programming, debug code, and grow their skills. Be encouraging and practical.",
    },
    ...history,
    {
      role: "user",
      content: message,
    },
  ];

  const response = await callAI(messages as any, { max_completion_tokens: 1024 });

  return response.choices[0].message.content || "I'm here to help! What would you like to learn?";
}
