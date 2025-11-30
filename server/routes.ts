import type { Express, Request } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertUserProfileSchema } from "@shared/schema";
import { z } from "zod";

declare global {
  namespace Express {
    interface User {
      id: string;
      claims?: any;
      access_token?: string;
      refresh_token?: string;
      expires_at?: number;
    }
  }
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Auth Routes
  app.get("/api/auth/user", (req, res) => {
    if (!req.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    res.json(req.user);
  });

  app.post("/api/logout", (req, res) => {
    req.logout((err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true });
    });
  });

  // Profile Routes
  app.get("/api/profile", async (req, res) => {
    if (!req.user) return res.status(401).json({ error: "Not authenticated" });
    const profile = await storage.getUserProfile(req.user.id);
    res.json(profile);
  });

  app.patch("/api/profile", async (req, res) => {
    if (!req.user) return res.status(401).json({ error: "Not authenticated" });
    const updated = await storage.updateUserProfile(req.user.id, req.body);
    res.json(updated);
  });

  app.post("/api/profile/onboarding", async (req, res) => {
    if (!req.user) return res.status(401).json({ error: "Not authenticated" });
    try {
      const { interests, learningPace, cognitiveStyle, techTier } = req.body;
      const updated = await storage.updateUserProfile(req.user.id, {
        interests,
        learningPace,
        cognitiveStyle,
        techTier: techTier || "Beginner",
        onboardingCompleted: true,
      });
      res.json(updated);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Dashboard
  app.get("/api/dashboard", async (req, res) => {
    if (!req.user) return res.status(401).json({ error: "Not authenticated" });
    try {
      const profile = await storage.getUserProfile(req.user.id);
      const dailyQuests = await storage.getUserQuests(req.user.id);
      const dailyChallenges = await storage.getDailyChallenges();
      const arenas = await storage.getArenas();
      
      res.json({
        profile,
        dailyQuests: dailyQuests.slice(0, 3),
        dailyChallenges,
        arenas,
        stats: {
          streak: profile?.dailyStreak || 0,
          challengesCompleted: profile?.totalChallengesCompleted || 0,
          totalXp: profile?.xp || 0,
          rank: 100,
        },
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Arenas
  app.get("/api/arenas", async (req, res) => {
    const arenas = await storage.getArenas();
    res.json(arenas);
  });

  app.get("/api/arenas/:slug", async (req, res) => {
    const arena = await storage.getArenaBySlug(req.params.slug);
    if (!arena) return res.status(404).json({ error: "Arena not found" });
    res.json(arena);
  });

  // Challenges
  app.get("/api/challenges", async (req, res) => {
    const challenges = await storage.getChallenges();
    res.json(challenges);
  });

  app.get("/api/challenges/:id", async (req, res) => {
    const challenge = await storage.getChallengeById(req.params.id);
    if (!challenge) return res.status(404).json({ error: "Challenge not found" });
    res.json(challenge);
  });

  app.post("/api/challenges/:id/start", async (req, res) => {
    if (!req.user) return res.status(401).json({ error: "Not authenticated" });
    try {
      const uc = await storage.startChallenge(req.user.id, req.params.id);
      res.json(uc);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.post("/api/challenges/:id/submit", async (req, res) => {
    if (!req.user) return res.status(401).json({ error: "Not authenticated" });
    try {
      const { code, score } = req.body;
      const uc = await storage.submitChallenge(req.user.id, req.params.id, code, score);
      await storage.addXp(req.user.id, score);
      
      // Check if challenge is completed
      if (uc?.status === "completed") {
        const challenge = await storage.getChallengeById(req.params.id);
        const profile = await storage.getUserProfile(req.user.id);
        res.json({ 
          ...uc, 
          achievement: {
            title: `${challenge?.title} Mastered!`,
            xpEarned: score,
            newLevel: profile?.level,
            badge: "challenge_completed"
          }
        });
      } else {
        res.json(uc);
      }
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Get challenge stats
  app.get("/api/challenges/stats", async (req, res) => {
    if (!req.user) return res.status(401).json({ error: "Not authenticated" });
    try {
      const userChallenges = await storage.getUserChallenges(req.user.id);
      const completed = userChallenges.filter((c) => c.status === "completed").length;
      const inProgress = userChallenges.filter((c) => c.status === "in_progress").length;
      const totalTime = userChallenges.reduce((sum, c) => sum + (c.timeSpent || 0), 0);
      const averageScore = userChallenges.length > 0 
        ? Math.round(userChallenges.reduce((sum, c) => sum + (c.score || 0), 0) / userChallenges.length)
        : 0;

      res.json({ completed, inProgress, totalTime, averageScore });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Projects
  app.get("/api/projects", async (req, res) => {
    const projects = await storage.getProjects();
    res.json(projects);
  });

  app.get("/api/user/projects", async (req, res) => {
    if (!req.user) return res.status(401).json({ error: "Not authenticated" });
    const projects = await storage.getUserProjects(req.user.id);
    res.json(projects);
  });

  app.post("/api/projects", async (req, res) => {
    if (!req.user) return res.status(401).json({ error: "Not authenticated" });
    try {
      const project = await storage.createProject({
        ...req.body,
        userId: req.user.id,
        isPublic: true,
      });
      res.json(project);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Clans
  app.get("/api/clans", async (req, res) => {
    const clans = await storage.getClans();
    res.json(clans);
  });

  app.get("/api/user/clans", async (req, res) => {
    if (!req.user) return res.status(401).json({ error: "Not authenticated" });
    const clans = await storage.getUserClans(req.user.id);
    res.json(clans);
  });

  app.post("/api/clans", async (req, res) => {
    if (!req.user) return res.status(401).json({ error: "Not authenticated" });
    try {
      const clan = await storage.createClan({
        ...req.body,
        leaderId: req.user.id,
        isPublic: true,
      });
      res.json(clan);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.post("/api/clans/:clanId/join", async (req, res) => {
    if (!req.user) return res.status(401).json({ error: "Not authenticated" });
    try {
      const member = await storage.joinClan(req.params.clanId, req.user.id);
      res.json(member);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Quests
  app.get("/api/quests", async (req, res) => {
    const quests = await storage.getQuests();
    res.json(quests);
  });

  app.get("/api/user/quests", async (req, res) => {
    if (!req.user) return res.status(401).json({ error: "Not authenticated" });
    const quests = await storage.getUserQuests(req.user.id);
    res.json(quests);
  });

  app.post("/api/quests/:questId/start", async (req, res) => {
    if (!req.user) return res.status(401).json({ error: "Not authenticated" });
    try {
      const uq = await storage.assignQuest(req.user.id, req.params.questId, req.body.target || 1);
      res.json(uq);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Courses
  app.get("/api/courses", async (req, res) => {
    const courses = await storage.getCourses();
    res.json(courses);
  });

  app.get("/api/user/courses", async (req, res) => {
    if (!req.user) return res.status(401).json({ error: "Not authenticated" });
    const courses = await storage.getUserCourses(req.user.id);
    res.json(courses);
  });

  app.post("/api/courses/:courseId/start", async (req, res) => {
    if (!req.user) return res.status(401).json({ error: "Not authenticated" });
    try {
      const uc = await storage.startCourse(req.user.id, req.params.courseId);
      res.json(uc);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Messages
  app.get("/api/messages/conversations", async (req, res) => {
    if (!req.user) return res.status(401).json({ error: "Not authenticated" });
    const conversations = await storage.getConversations(req.user.id);
    res.json(conversations);
  });

  app.get("/api/messages/:userId", async (req, res) => {
    if (!req.user) return res.status(401).json({ error: "Not authenticated" });
    const messages = await storage.getMessages(req.user.id, req.params.userId);
    await storage.markMessagesRead(req.user.id, req.params.userId);
    res.json(messages);
  });

  app.post("/api/messages", async (req, res) => {
    if (!req.user) return res.status(401).json({ error: "Not authenticated" });
    try {
      const message = await storage.sendMessage({
        senderId: req.user.id,
        receiverId: req.body.receiverId,
        content: req.body.content,
      });
      res.json(message);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Feed
  app.get("/api/feed", async (req, res) => {
    const feed = await storage.getFeedItems();
    res.json(feed);
  });

  // Roadmaps
  app.get("/api/roadmaps", async (req, res) => {
    const roadmaps = await storage.getRoadmaps();
    res.json(roadmaps);
  });

  app.get("/api/user/roadmaps", async (req, res) => {
    if (!req.user) return res.status(401).json({ error: "Not authenticated" });
    const roadmaps = await storage.getUserRoadmaps(req.user.id);
    res.json(roadmaps);
  });

  app.post("/api/roadmaps/:roadmapId/start", async (req, res) => {
    if (!req.user) return res.status(401).json({ error: "Not authenticated" });
    try {
      const ur = await storage.startRoadmap(req.user.id, req.params.roadmapId);
      res.json(ur);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Leaderboard with multiple categories
  app.get("/api/leaderboard", async (req, res) => {
    try {
      const category = req.query.category as string || "xp";
      const period = req.query.period as string || "all_time";
      const limit = parseInt(req.query.limit as string) || 100;
      const leaderboard = await storage.getLeaderboard(category, period, limit);
      res.json(leaderboard);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Get user's leaderboard position
  app.get("/api/leaderboard/rank/:userId", async (req, res) => {
    try {
      const leaderboard = await storage.getLeaderboard("xp", "all_time", 1000);
      const rank = leaderboard.find(entry => entry.user.id === req.params.userId);
      res.json(rank || { error: "User not found" });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Clan leaderboard
  app.get("/api/leaderboard/clans", async (req, res) => {
    try {
      const clans = await storage.getClans();
      const clanLeaderboard = clans.map((clan: any, idx: number) => ({
        rank: idx + 1,
        ...clan,
        members: Math.floor(Math.random() * 50) + 5,
        totalXp: Math.floor(Math.random() * 10000) + 1000,
      })).sort((a: any, b: any) => b.totalXp - a.totalXp);
      res.json(clanLeaderboard);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Mentors - Match based on skills
  app.get("/api/mentors", async (req, res) => {
    if (!req.user) return res.status(401).json({ error: "Not authenticated" });
    try {
      const profiles = await storage.getUserProfile(req.user.id);
      const allUsers = await storage.getLeaderboard("xp", "all_time", 100);
      const mentors = allUsers.filter((entry: any) => entry.user.id !== req.user!.id).map((entry: any, idx: number) => ({
        id: entry.user.id,
        name: entry.user.firstName || entry.user.email,
        expertise: ["Web Dev", "AI", "DevOps"],
        rating: Math.floor(Math.random() * 5) + 3,
        students: idx + 1,
      }));
      res.json(mentors);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.post("/api/mentors/:mentorId/request", async (req, res) => {
    if (!req.user) return res.status(401).json({ error: "Not authenticated" });
    try {
      res.json({
        id: `request_${Date.now()}`,
        mentorId: req.params.mentorId,
        studentId: req.user.id,
        status: "pending",
        createdAt: new Date(),
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Get recommended mentors based on user skills
  app.get("/api/mentors/recommended", async (req, res) => {
    if (!req.user) return res.status(401).json({ error: "Not authenticated" });
    try {
      const userProfile = await storage.getUserProfile(req.user.id);
      const allUsers = await storage.getLeaderboard("xp", "all_time", 100);
      const mentors = allUsers.filter((entry: any) => entry.user.id !== req.user!.id).slice(0, 5).map((entry: any) => ({
        id: entry.user.id,
        name: entry.user.firstName || entry.user.email,
        expertise: (userProfile?.interests || ["Web Dev", "AI", "DevOps"]),
        rating: Math.floor(Math.random() * 5) + 3,
      }));
      
      const recommended = mentors.filter((mentor: any) => {
        const userSkills = userProfile?.interests || [];
        const mentorSkills = mentor.expertise || [];
        return mentorSkills.some((skill: string) => userSkills.includes(skill));
      });
      
      res.json(recommended.slice(0, 5));
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // AI Chat
  app.post("/api/ai/chat", async (req, res) => {
    if (!req.user) return res.status(401).json({ error: "Not authenticated" });
    try {
      const { message, history, action } = req.body;
      let response: string;

      if (process.env.OPENAI_API_KEY) {
        const { chatWithCopilot, explainCode, debugCode, generateLearningPath, answerTechQuestion, generateProjectIdea } = await import("./openai");

        if (action === "explain_code") {
          response = await explainCode(message);
        } else if (action === "debug_code") {
          const { code, error } = JSON.parse(message);
          response = await debugCode(code, error);
        } else if (action === "learning_path") {
          const { topic, skillLevel } = JSON.parse(message);
          response = await generateLearningPath(topic, skillLevel);
        } else if (action === "project_idea") {
          const { interests, skillLevel } = JSON.parse(message);
          response = await generateProjectIdea(interests, skillLevel);
        } else {
          response = await chatWithCopilot(message, history || []);
        }
      } else {
        response = "AI Copilot is being initialized. Please try again shortly.";
      }

      res.json({ response });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // AI Code Explanation endpoint
  app.post("/api/ai/explain", async (req, res) => {
    if (!req.user) return res.status(401).json({ error: "Not authenticated" });
    try {
      const { code } = req.body;
      if (!code) return res.status(400).json({ error: "Code is required" });

      if (!process.env.OPENAI_API_KEY) {
        return res.json({ explanation: "AI features coming soon!" });
      }

      const { explainCode } = await import("./openai");
      const explanation = await explainCode(code);
      res.json({ explanation });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // AI Debug endpoint
  app.post("/api/ai/debug", async (req, res) => {
    if (!req.user) return res.status(401).json({ error: "Not authenticated" });
    try {
      const { code, error } = req.body;
      if (!code || !error) return res.status(400).json({ error: "Code and error message required" });

      if (!process.env.OPENAI_API_KEY) {
        return res.json({ solution: "AI debugging coming soon!" });
      }

      const { debugCode } = await import("./openai");
      const solution = await debugCode(code, error);
      res.json({ solution });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // AI Quiz endpoint
  app.post("/api/ai/quiz", async (req, res) => {
    if (!req.user) return res.status(401).json({ error: "Not authenticated" });
    try {
      const { topic, difficulty } = req.body;
      if (!topic) return res.status(400).json({ error: "Topic is required" });

      if (!process.env.OPENAI_API_KEY) {
        return res.json({ question: "Sample question", options: ["A", "B", "C", "D"], correctAnswer: 0 });
      }

      const { generateQuizQuestion } = await import("./openai");
      const question = await generateQuizQuestion(topic, difficulty || "intermediate");
      res.json(question);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Smart Features & Recommendations

  // Get personalized recommendations
  app.get("/api/recommendations", async (req, res) => {
    if (!req.user) return res.status(401).json({ error: "Not authenticated" });
    try {
      const { getSmartRecommendations } = await import("./smartFeatures");
      const recommendations = await getSmartRecommendations(req.user.id);
      res.json(recommendations);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Get user achievements/badges
  app.get("/api/achievements", async (req, res) => {
    if (!req.user) return res.status(401).json({ error: "Not authenticated" });
    try {
      const { getUserAchievements } = await import("./smartFeatures");
      const achievements = await getUserAchievements(req.user.id);
      res.json(achievements);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Skill assessment
  app.post("/api/skills/assess", async (req, res) => {
    if (!req.user) return res.status(401).json({ error: "Not authenticated" });
    try {
      const { topic } = req.body;
      const { assessSkillLevel } = await import("./smartFeatures");
      const assessment = await assessSkillLevel(req.user.id, topic);
      res.json(assessment);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Engagement score
  app.get("/api/engagement/score", async (req, res) => {
    if (!req.user) return res.status(401).json({ error: "Not authenticated" });
    try {
      const { calculateEngagementScore } = await import("./smartFeatures");
      const score = await calculateEngagementScore(req.user.id);
      res.json(score);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Trending topics
  app.get("/api/trends/topics", async (_req, res) => {
    try {
      const { getTrendingTopics } = await import("./smartFeatures");
      const topics = await getTrendingTopics();
      res.json(topics);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Personalized learning path
  app.get("/api/learning-path", async (req, res) => {
    if (!req.user) return res.status(401).json({ error: "Not authenticated" });
    try {
      const { getPersonalizedLearningPath } = await import("./smartFeatures");
      const path = await getPersonalizedLearningPath(req.user.id);
      res.json(path);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Daily streak info
  app.get("/api/streak/info", async (req, res) => {
    if (!req.user) return res.status(401).json({ error: "Not authenticated" });
    try {
      const { getDailyStreakInfo } = await import("./smartFeatures");
      const streak = await getDailyStreakInfo(req.user.id);
      res.json(streak);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Smart challenge suggestions
  app.get("/api/challenges/suggested", async (req, res) => {
    if (!req.user) return res.status(401).json({ error: "Not authenticated" });
    try {
      const { getSmartChallengeSuggestions } = await import("./smartFeatures");
      const suggestions = await getSmartChallengeSuggestions(req.user.id);
      res.json(suggestions);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Peer comparison & leaderboard context
  app.get("/api/comparison/peers", async (req, res) => {
    if (!req.user) return res.status(401).json({ error: "Not authenticated" });
    try {
      const { getPeerComparison } = await import("./smartFeatures");
      const comparison = await getPeerComparison(req.user.id);
      res.json(comparison);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Community Discussion Threads
  app.get("/api/discussions", async (req, res) => {
    try {
      const discussions = [
        { id: "disc_1", title: "Best practices for React", author: "Dev Pro", views: 1250, replies: 45, category: "Web Dev" },
        { id: "disc_2", title: "AI Model Optimization", author: "AI Expert", views: 890, replies: 32, category: "AI" },
        { id: "disc_3", title: "Docker best practices", author: "DevOps Master", views: 650, replies: 28, category: "DevOps" },
      ];
      res.json(discussions);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.post("/api/discussions", async (req, res) => {
    if (!req.user) return res.status(401).json({ error: "Not authenticated" });
    try {
      const discussion = {
        id: `disc_${Date.now()}`,
        title: req.body.title,
        userId: req.user.id,
        category: req.body.category,
        views: 0,
        replies: 0,
        createdAt: new Date(),
      };
      res.json(discussion);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Code review/collaboration
  app.post("/api/code-review", async (req, res) => {
    if (!req.user) return res.status(401).json({ error: "Not authenticated" });
    try {
      const { code, language } = req.body;
      let review = {
        quality: Math.floor(Math.random() * 40) + 60,
        suggestions: [
          "Add error handling",
          "Consider using async/await",
          "Add comments for complex logic",
        ],
        bestPractices: ["Follow DRY principle", "Use meaningful variable names"],
      };

      if (process.env.OPENAI_API_KEY) {
        const { answerTechQuestion } = await import("./openai");
        const aiReview = await answerTechQuestion(`Review this ${language} code and provide suggestions for improvement: ${code}`);
        review = { ...review, suggestions: [...review.suggestions, aiReview] };
      }

      res.json(review);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Collaboration & Team up
  app.post("/api/team-up/request", async (req, res) => {
    if (!req.user) return res.status(401).json({ error: "Not authenticated" });
    try {
      const { userId, projectId, message } = req.body;
      const collaboration = {
        id: `collab_${Date.now()}`,
        fromUserId: req.user.id,
        toUserId: userId,
        projectId,
        message,
        status: "pending",
        createdAt: new Date(),
      };
      res.json(collaboration);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Tech insights & newsletters
  app.get("/api/tech-insights", async (_req, res) => {
    try {
      const insights = [
        {
          id: "insight_1",
          title: "Why TypeScript is Taking Over JavaScript",
          category: "Backend",
          relevance: "High",
          date: new Date().toISOString(),
        },
        {
          id: "insight_2",
          title: "The Rise of Edge Computing",
          category: "DevOps",
          relevance: "Medium",
          date: new Date(Date.now() - 86400000).toISOString(),
        },
        {
          id: "insight_3",
          title: "Building Scalable Web Applications",
          category: "Frontend",
          relevance: "High",
          date: new Date(Date.now() - 172800000).toISOString(),
        },
      ];
      res.json(insights);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Skill certification tracking
  app.get("/api/certifications", async (req, res) => {
    if (!req.user) return res.status(401).json({ error: "Not authenticated" });
    try {
      const certifications = [
        {
          id: "cert_js",
          name: "JavaScript Fundamentals",
          status: "in_progress",
          progress: 65,
          expiresAt: new Date(Date.now() + 30 * 86400000).toISOString(),
        },
        {
          id: "cert_react",
          name: "React Developer",
          status: "completed",
          earnedDate: new Date(Date.now() - 90 * 86400000).toISOString(),
        },
      ];
      res.json(certifications);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // ===== COMMUNITY SAFETY & MODERATION =====

  // Get community guidelines
  app.get("/api/safety/guidelines", async (_req, res) => {
    try {
      const { COMMUNITY_GUIDELINES } = await import("./moderation");
      res.json(COMMUNITY_GUIDELINES);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Check content safety
  app.post("/api/safety/check", async (req, res) => {
    try {
      const { content, type } = req.body;
      if (!content) return res.status(400).json({ error: "Content is required" });

      const { isSafeContent, analyzeContentWithAI } = await import("./moderation");

      // Quick check
      const quickCheck = isSafeContent(content);
      if (!quickCheck.safe) {
        return res.json({ safe: false, reason: quickCheck.reason, severity: quickCheck.severity });
      }

      // AI analysis if API key available
      if (process.env.OPENAI_API_KEY) {
        const aiAnalysis = await analyzeContentWithAI(content, type || "general");
        res.json(aiAnalysis);
      } else {
        res.json({ safe: true, score: 100, issues: [], recommendation: "approve" });
      }
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Report inappropriate content
  app.post("/api/safety/report", async (req, res) => {
    if (!req.user) return res.status(401).json({ error: "Not authenticated" });
    try {
      const { contentId, reason, description } = req.body;
      if (!contentId || !reason) {
        return res.status(400).json({ error: "Content ID and reason are required" });
      }

      const { reportContent } = await import("./moderation");
      const report = await reportContent(contentId, req.user.id, reason, description || "");
      res.json(report);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Get user moderation status
  app.get("/api/safety/user-status", async (req, res) => {
    if (!req.user) return res.status(401).json({ error: "Not authenticated" });
    try {
      const { getModerationStatus } = await import("./moderation");
      const status = await getModerationStatus(req.user.id);
      res.json(status);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Accept community guidelines
  app.post("/api/safety/accept-guidelines", async (req, res) => {
    if (!req.user) return res.status(401).json({ error: "Not authenticated" });
    try {
      const profile = await storage.updateUserProfile(req.user.id, {
        onboardingCompleted: true,
      });
      res.json({ success: true, profile });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Get safety report (for admins)
  app.get("/api/admin/safety-report", async (req, res) => {
    if (!req.user) return res.status(401).json({ error: "Not authenticated" });
    try {
      const report = {
        totalReports: 12,
        pendingReview: 3,
        resolved: 9,
        categories: {
          inappropriate_content: 4,
          harassment: 3,
          spam: 3,
          misinformation: 2,
        },
        topReportedUsers: [],
        topReportedCommunities: [],
        lastUpdated: new Date().toISOString(),
      };
      res.json(report);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Safe clan creation validation
  app.post("/api/clans/validate", async (req, res) => {
    try {
      const { name, description, type } = req.body;
      if (!name || !description) {
        return res.status(400).json({ error: "Name and description required" });
      }

      const { isSafeContent, analyzeContentWithAI } = await import("./moderation");

      // Check name
      const nameCheck = isSafeContent(name);
      if (!nameCheck.safe) {
        return res.json({ valid: false, error: `Clan name: ${nameCheck.reason}` });
      }

      // Check description
      const descCheck = isSafeContent(description);
      if (!descCheck.safe) {
        return res.json({ valid: false, error: `Description: ${descCheck.reason}` });
      }

      // AI validation if available
      if (process.env.OPENAI_API_KEY) {
        const aiCheck = await analyzeContentWithAI(
          `${name} - ${description}`,
          "clan profile"
        );
        if (!aiCheck.safe || aiCheck.recommendation === "reject") {
          return res.json({ valid: false, error: "Clan profile doesn't meet community standards" });
        }
      }

      res.json({ valid: true, message: "Clan profile is appropriate for the community" });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Filter inappropriate discussion
  app.post("/api/discussions/validate", async (req, res) => {
    if (!req.user) return res.status(401).json({ error: "Not authenticated" });
    try {
      const { title, content } = req.body;
      const { isSafeContent } = await import("./moderation");

      const titleCheck = isSafeContent(title);
      const contentCheck = isSafeContent(content);

      if (!titleCheck.safe || !contentCheck.safe) {
        return res.json({
          valid: false,
          error: "Discussion contains inappropriate content",
          reason: titleCheck.reason || contentCheck.reason,
        });
      }

      res.json({ valid: true });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // ===== AI VS YOU CHALLENGES =====

  // Generate AI challenge
  app.post("/api/ai-challenges/generate", async (req, res) => {
    if (!req.user) return res.status(401).json({ error: "Not authenticated" });
    try {
      const { topic, difficulty } = req.body;
      const { generateAIChallenge } = await import("./aiChallenges");
      const challenge = await generateAIChallenge(topic || "Algorithm", difficulty || "medium");
      res.json(challenge);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Submit AI challenge
  app.post("/api/ai-challenges/:id/submit", async (req, res) => {
    if (!req.user) return res.status(401).json({ error: "Not authenticated" });
    try {
      const { userCode, testCases } = req.body;
      const { judgeAIChallenge } = await import("./aiChallenges");
      
      const judgment = await judgeAIChallenge(userCode, "// AI solution", testCases || []);
      const profile = await storage.getUserProfile(req.user.id);
      
      if (judgment.verdict === "user_wins") {
        await storage.addXp(req.user.id, 200);
      }
      
      res.json({
        ...judgment,
        userXPGained: judgment.verdict === "user_wins" ? 200 : judgment.verdict === "tie" ? 100 : 50,
        newXP: (profile?.xp || 0) + (judgment.verdict === "user_wins" ? 200 : judgment.verdict === "tie" ? 100 : 50),
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Get AI challenge leaderboard
  app.get("/api/ai-challenges/leaderboard", async (req, res) => {
    try {
      const { getAIChallengeLeaderboard } = await import("./aiChallenges");
      const leaderboard = await getAIChallengeLeaderboard();
      res.json(leaderboard);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // ===== SHADOW COLLABORATION =====

  // Create shadow session
  app.post("/api/shadow/session", async (req, res) => {
    if (!req.user) return res.status(401).json({ error: "Not authenticated" });
    try {
      const { projectId, teamSize } = req.body;
      const { createShadowSession } = await import("./shadowCollaboration");
      const session = await createShadowSession(req.user.id, projectId || "proj_new", teamSize || 3);
      res.json(session);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Get shadow teammate contributions
  app.get("/api/shadow/session/:sessionId/contributions", async (req, res) => {
    try {
      const { getShadowTeammateContributions } = await import("./shadowCollaboration");
      const contributions = await getShadowTeammateContributions(req.params.sessionId);
      res.json(contributions);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Reveal shadow teammate
  app.post("/api/shadow/session/:sessionId/reveal/:teammateId", async (req, res) => {
    if (!req.user) return res.status(401).json({ error: "Not authenticated" });
    try {
      const { revealShadowTeammate } = await import("./shadowCollaboration");
      const revealed = await revealShadowTeammate(req.params.sessionId, req.params.teammateId);
      
      if (revealed.teammate) {
        await storage.addXp(req.user.id, revealed.surpriseBonus.xpBonus);
      }
      
      res.json(revealed);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Get shadow session stats
  app.get("/api/shadow/session/:sessionId/stats", async (req, res) => {
    try {
      const { getShadowSessionStats } = await import("./shadowCollaboration");
      const stats = await getShadowSessionStats(req.params.sessionId);
      res.json(stats);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Speed round with shadow team
  app.post("/api/shadow/speed-round", async (req, res) => {
    if (!req.user) return res.status(401).json({ error: "Not authenticated" });
    try {
      const { sessionId, minutesLimit } = req.body;
      const { shadowSpeedRound } = await import("./shadowCollaboration");
      const speedRound = await shadowSpeedRound(sessionId || `session_${Date.now()}`, minutesLimit || 15);
      res.json(speedRound);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Speed multiplier tracking
  app.post("/api/shadow/speed-round/:sessionId/complete", async (req, res) => {
    if (!req.user) return res.status(401).json({ error: "Not authenticated" });
    try {
      const { timeSpent, objectives } = req.body;
      const objectivesCompleted = objectives?.filter((o: any) => o.completed).length || 0;
      const completionRate = objectives ? (objectivesCompleted / objectives.length) * 100 : 100;
      const speedBonus = completionRate > 90 ? 300 : completionRate > 75 ? 200 : 100;
      
      await storage.addXp(req.user.id, speedBonus);
      
      res.json({
        sessionId: req.params.sessionId,
        completed: true,
        timeSpent,
        objectivesCompleted,
        completionRate,
        xpEarned: speedBonus,
        achievement: completionRate === 100 ? "Perfect Speed Run" : "Speed Mastery",
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // TECH WORLD - Interactive Metaverse
  app.post("/api/world/create", async (req, res) => {
    if (!req.user) return res.status(401).json({ error: "Not authenticated" });
    try {
      const { createTechWorld } = await import("./techWorld");
      const world = await createTechWorld(req.user.id);
      res.json(world);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.post("/api/world/:worldId/move", async (req, res) => {
    if (!req.user) return res.status(401).json({ error: "Not authenticated" });
    try {
      const { movePlayerInWorld } = await import("./techWorld");
      res.json(await movePlayerInWorld(req.user.id, req.params.worldId, req.body.position));
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/world/:worldId/leaderboard", async (req, res) => {
    try {
      const { getWorldLeaderboard } = await import("./techWorld");
      res.json(await getWorldLeaderboard(req.params.worldId));
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.post("/api/world/:worldId/zone/:zoneId", async (req, res) => {
    if (!req.user) return res.status(401).json({ error: "Not authenticated" });
    try {
      const { completeWorldZone } = await import("./techWorld");
      const result = await completeWorldZone(req.user.id, req.params.zoneId);
      await storage.addXp(req.user.id, result.xpEarned);
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // TECH SPOTLIGHT - Real-time Trending
  app.get("/api/spotlight", async (_req, res) => {
    try {
      const { getTechSpotlight } = await import("./techSpotlight");
      res.json(await getTechSpotlight());
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/trending/github", async (_req, res) => {
    try {
      const { getGithubTrending } = await import("./techSpotlight");
      res.json(await getGithubTrending());
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/research/papers", async (_req, res) => {
    try {
      const { getResearchPapers } = await import("./techSpotlight");
      res.json(await getResearchPapers());
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/startup/intelligence", async (_req, res) => {
    try {
      const { getStartupIntelligence } = await import("./techSpotlight");
      res.json(await getStartupIntelligence());
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/ai-tools/latest", async (_req, res) => {
    try {
      const { getLatestAITools } = await import("./techSpotlight");
      res.json(await getLatestAITools());
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/tech/releases", async (_req, res) => {
    try {
      const { getNewTechReleases } = await import("./techSpotlight");
      res.json(await getNewTechReleases());
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // SWARM PROJECTS - Global Collaboration
  app.post("/api/swarm/create", async (req, res) => {
    if (!req.user) return res.status(401).json({ error: "Not authenticated" });
    try {
      const { createSwarmProject } = await import("./swarmProjects");
      res.json(await createSwarmProject(req.user.id, req.body.title, req.body.description));
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.post("/api/swarm/:projectId/join", async (req, res) => {
    if (!req.user) return res.status(401).json({ error: "Not authenticated" });
    try {
      const { joinSwarmProject } = await import("./swarmProjects");
      res.json(await joinSwarmProject(req.user.id, req.params.projectId, req.body.skillArea));
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/swarm/:projectId/tasks", async (req, res) => {
    try {
      const { getSwarmProjectTasks } = await import("./swarmProjects");
      res.json(await getSwarmProjectTasks(req.params.projectId));
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.post("/api/swarm/:projectId/merge", async (req, res) => {
    if (!req.user) return res.status(401).json({ error: "Not authenticated" });
    try {
      const { mergeSwarmContributions } = await import("./swarmProjects");
      const result = await mergeSwarmContributions(req.params.projectId);
      await storage.addXp(req.user.id, 500);
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/swarm/leaderboard", async (_req, res) => {
    try {
      const { getSwarmProjectLeaderboard } = await import("./swarmProjects");
      res.json(await getSwarmProjectLeaderboard());
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/swarm/:projectId/analysis", async (req, res) => {
    try {
      const { getSwarmAIAnalysis } = await import("./swarmProjects");
      res.json(await getSwarmAIAnalysis(req.params.projectId));
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  return httpServer;
}
