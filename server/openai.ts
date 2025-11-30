import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Smart model selection - try GPT-4 first, fallback to GPT-3.5
async function callAI(messages: Array<{ role: string; content: string }>, options: any = {}) {
  try {
    return await openai.chat.completions.create({
      model: "gpt-4",
      messages: messages as any,
      ...options,
    });
  } catch (error: any) {
    // If GPT-4 not available, fall back to GPT-3.5-turbo
    if (error?.error?.code === "model_not_found" || error?.message?.includes("does not exist")) {
      return await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: messages as any,
        ...options,
      });
    }
    throw error;
  }
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
      content: "You are a helpful tech tutor on TechHive. Provide clear, practical answers with examples when helpful.",
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
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: 'You are a tech quiz expert. Generate multiple choice questions in JSON format: {"question": "text", "options": ["a", "b", "c", "d"], "correctAnswer": 0}',
      },
      {
        role: "user",
        content: `Generate a ${difficulty} difficulty quiz question about ${topic}. Return only valid JSON.`,
      },
    ],
  });

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
    const response = await Promise.race([
      callAI([
        max_tokens: 1500,
        messages: [
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
        ],
      }),
      new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 15000)),
    ]);

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
    const response = await Promise.race([
      callAI([
        max_tokens: 1200,
        messages: [
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
        ],
      }),
      new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 15000)),
    ]);

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
    ...history.map((msg) => ({
      role: msg.role,
      content: msg.content,
    })),
    {
      role: "user",
      content: message,
    },
  ];

  const response = await callAI(messages as any, { max_completion_tokens: 1024 });

  return response.choices[0].message.content || "I'm here to help! What would you like to learn?";
}
