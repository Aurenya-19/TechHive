// CodeVerse AI - Powered by Together.ai (Open Source Models - FREE tier, NO credit card)
// Uses Mistral 7B for excellent reasoning, coding, and knowledge

async function callAI(messages: Array<{ role: string; content: string }>, options: any = {}) {
  const apiKey = process.env.TOGETHER_API_KEY;

  if (!apiKey) {
    throw new Error("TOGETHER_API_KEY not set. Get free key at https://api.together.xyz/ (no credit card needed)");
  }

  try {
    const response = await fetch("https://api.together.xyz/inference", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "mistralai/Mistral-7B-Instruct-v0.3", // Powerful open model, excellent reasoning
        messages: messages.map((msg) => ({
          role: msg.role === "system" ? "system" : (msg.role as "user" | "assistant"),
          content: msg.content,
        })),
        max_tokens: options.max_tokens || options.max_completion_tokens || 2048,
        temperature: 0.7,
        top_p: 0.9,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("Together.ai error:", error);
      throw new Error(`Together.ai API error: ${response.status}`);
    }

    const data = await response.json();
    return {
      choices: [
        {
          message: {
            content: data.output?.choices?.[0]?.message?.content || "",
          },
        },
      ],
    };
  } catch (error: any) {
    console.error("AI Error:", error.message);
    throw error;
  }
}

export async function explainCode(code: string): Promise<string> {
  const response = await callAI([
    {
      role: "system",
      content:
        "You are an expert programming tutor. Explain code clearly with examples and best practices. Be comprehensive but concise.",
    },
    {
      role: "user",
      content: `Explain this code in detail:\n\n${code}`,
    },
  ]);

  return response.choices[0].message.content || "";
}

export async function debugCode(code: string, error: string): Promise<string> {
  const response = await callAI([
    {
      role: "system",
      content:
        "You are an expert debugger. Help fix errors with clear, step-by-step solutions. Explain the root cause and prevention strategies.",
    },
    {
      role: "user",
      content: `Fix this error:\n\nCode:\n${code}\n\nError:\n${error}\n\nProvide a complete solution with explanation.`,
    },
  ]);

  return response.choices[0].message.content || "";
}

export async function generateLearningPath(topic: string, skillLevel: string): Promise<string> {
  const response = await callAI([
    {
      role: "system",
      content:
        "You are a master learning architect. Create detailed, structured learning paths with phases, milestones, projects, and estimated timelines.",
    },
    {
      role: "user",
      content: `Create a comprehensive learning path for a ${skillLevel} developer learning ${topic}. Include: 
- Learning phases (with timelines)
- Key concepts to master
- Practical projects
- Resources and tools
- Success metrics`,
    },
  ]);

  return response.choices[0].message.content || "";
}

export async function answerTechQuestion(question: string, context: string = ""): Promise<string> {
  const response = await callAI([
    {
      role: "system",
      content:
        "You are an expert tech mentor on CodeVerse. Provide comprehensive, accurate answers with practical examples, best practices, and resources.",
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
      content:
        "You are a creative tech mentor. Suggest ambitious, achievable projects that combine interests and build real skills. Include detailed implementation roadmaps.",
    },
    {
      role: "user",
      content: `Suggest excellent projects for a ${skillLevel} developer interested in: ${interests.join(", ")}.
Include for each project:
- Overview and learning outcomes
- Required technologies
- Key features to implement
- Development milestones
- Resources and tools`,
    },
  ]);

  return response.choices[0].message.content || "";
}

export async function generateQuizQuestion(
  topic: string,
  difficulty: string
): Promise<{ question: string; options: string[]; correctAnswer: number }> {
  const response = await callAI([
    {
      role: "system",
      content:
        'You are a tech quiz expert. Generate challenging, educational quiz questions. Return ONLY valid JSON: {"question": "text", "options": ["a", "b", "c", "d"], "correctAnswer": 0}',
    },
    {
      role: "user",
      content: `Generate a ${difficulty} difficulty quiz question about ${topic}. Return ONLY the JSON object, nothing else.`,
    },
  ]);

  try {
    const text = response.choices[0].message.content || "{}";
    return JSON.parse(text);
  } catch {
    return {
      question: "What is the primary benefit of using version control?",
      options: [
        "Track and manage code changes over time",
        "Make code run faster",
        "Reduce file size",
        "Prevent all bugs",
      ],
      correctAnswer: 0,
    };
  }
}

export async function generateCourseLessons(
  courseTitle: string,
  courseDescription: string,
  numLessons: number = 10
): Promise<Array<{ title: string; description: string }>> {
  try {
    const response = await Promise.race([
      callAI([
        {
          role: "system",
          content:
            "You are a master course designer. Create structured, engaging lessons. Return lessons in this format only: Lesson Title|What students will learn (one per line, no numbering)",
        },
        {
          role: "user",
          content: `Design ${numLessons} lessons for: "${courseTitle}"\n\nCourse Overview: ${courseDescription}\n\nFormat each lesson as: Title|Description\nOne lesson per line.`,
        },
      ]),
      new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 25000)),
    ]);

    const lines = response.choices[0].message.content
      ?.split("\n")
      .filter((l: string) => l.trim() && l.includes("|")) || [];

    return lines
      .slice(0, numLessons)
      .map((line: string) => {
        const [title, description] = line.split("|").map((s: string) => s.trim());
        return {
          title: title || "Lesson",
          description: description || "Master key concepts",
        };
      })
      .filter((lesson) => lesson.title !== "");
  } catch (error) {
    console.error("Course lessons generation failed:", error);
    return Array.from({ length: numLessons }, (_, i) => ({
      title: `${courseTitle} - Module ${i + 1}`,
      description: "Master concepts and practical implementation",
    }));
  }
}

export async function generateRoadmapMilestones(
  roadmapName: string,
  roadmapDescription: string,
  numMilestones: number = 8
): Promise<Array<{ title: string; description: string }>> {
  try {
    const response = await Promise.race([
      callAI([
        {
          role: "system",
          content:
            "You are a learning roadmap architect. Create progressive milestones with clear objectives. Return milestones in this format only: Milestone Title|What you'll accomplish (one per line, no numbering)",
        },
        {
          role: "user",
          content: `Design ${numMilestones} learning milestones for: "${roadmapName}"\n\nRoadmap Overview: ${roadmapDescription}\n\nFormat each milestone as: Title|Description\nOne milestone per line.`,
        },
      ]),
      new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 25000)),
    ]);

    const lines = response.choices[0].message.content
      ?.split("\n")
      .filter((l: string) => l.trim() && l.includes("|")) || [];

    return lines
      .slice(0, numMilestones)
      .map((line: string) => {
        const [title, description] = line.split("|").map((s: string) => s.trim());
        return {
          title: title || "Milestone",
          description: description || "Progress through this phase",
        };
      })
      .filter((milestone) => milestone.title !== "");
  } catch (error) {
    console.error("Roadmap milestones generation failed:", error);
    return Array.from({ length: numMilestones }, (_, i) => ({
      title: `${roadmapName} - Phase ${i + 1}`,
      description: "Master advanced concepts and strategies",
    }));
  }
}

export async function chatWithCopilot(message: string, history: Array<{ role: string; content: string }> = []): Promise<string> {
  const messages = [
    {
      role: "system",
      content:
        "You are CodeMentor - an exceptionally knowledgeable tech AI assistant. Provide expert guidance on coding, learning, and tech careers. Be encouraging, practical, and comprehensive. Answer completely and thoroughly.",
    },
    ...history,
    {
      role: "user",
      content: message,
    },
  ];

  const response = await callAI(messages as any, { max_completion_tokens: 2048 });

  return (
    response.choices[0].message.content || "I'm here to help! Ask me anything about tech, programming, or learning strategies."
  );
}
