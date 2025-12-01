import { sql, relations } from "drizzle-orm";
import {
  pgTable,
  text,
  varchar,
  integer,
  boolean,
  timestamp,
  jsonb,
  index,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)]
);

// Users table with Replit Auth fields
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// User profiles with tech persona data
export const userProfiles = pgTable("user_profiles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  interests: text("interests").array().default(sql`'{}'::text[]`),
  techTier: varchar("tech_tier").default("Beginner"),
  xp: integer("xp").default(0),
  level: integer("level").default(1),
  learningPace: varchar("learning_pace").default("moderate"),
  cognitiveStyle: varchar("cognitive_style").default("visual"),
  country: varchar("country"),
  ageGroup: varchar("age_group"),
  bio: text("bio"),
  avatarStyle: varchar("avatar_style").default("default"),
  avatarAura: varchar("avatar_aura").default("none"),
  badges: text("badges").array().default(sql`'{}'::text[]`),
  achievements: text("achievements").array().default(sql`'{}'::text[]`),
  skillScores: jsonb("skill_scores").default(sql`'{}'::jsonb`),
  onboardingCompleted: boolean("onboarding_completed").default(false),
  currentRoadmap: varchar("current_roadmap"),
  dailyStreak: integer("daily_streak").default(0),
  totalChallengesCompleted: integer("total_challenges_completed").default(0),
  totalProjectsCreated: integer("total_projects_created").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Skill Arenas
export const arenas = pgTable("arenas", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(),
  slug: varchar("slug").notNull().unique(),
  description: text("description"),
  icon: varchar("icon"),
  color: varchar("color"),
  category: varchar("category").notNull(),
  difficulty: varchar("difficulty").default("all"),
  activeUsers: integer("active_users").default(0),
  totalMissions: integer("total_missions").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// Arena Challenges/Missions
export const challenges = pgTable("challenges", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  arenaId: varchar("arena_id").references(() => arenas.id),
  title: varchar("title").notNull(),
  description: text("description"),
  difficulty: varchar("difficulty").default("beginner"),
  xpReward: integer("xp_reward").default(50),
  timeLimit: integer("time_limit"),
  type: varchar("type").default("coding"),
  instructions: text("instructions"),
  starterCode: text("starter_code"),
  testCases: jsonb("test_cases"),
  hints: text("hints").array().default(sql`'{}'::text[]`),
  tags: text("tags").array().default(sql`'{}'::text[]`),
  isDaily: boolean("is_daily").default(false),
  isWeekly: boolean("is_weekly").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// User Challenge Progress
export const userChallenges = pgTable("user_challenges", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  challengeId: varchar("challenge_id").notNull().references(() => challenges.id),
  status: varchar("status").default("not_started"),
  score: integer("score").default(0),
  timeSpent: integer("time_spent").default(0),
  submittedCode: text("submitted_code"),
  completedAt: timestamp("completed_at"),
  startedAt: timestamp("started_at").defaultNow(),
});

// Projects Hub
export const projects = pgTable("projects", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  title: varchar("title").notNull(),
  description: text("description"),
  content: text("content"),
  language: varchar("language"),
  techStack: text("tech_stack").array().default(sql`'{}'::text[]`),
  isPublic: boolean("is_public").default(true),
  stars: integer("stars").default(0),
  forks: integer("forks").default(0),
  views: integer("views").default(0),
  thumbnail: varchar("thumbnail"),
  repoUrl: varchar("repo_url"),
  liveUrl: varchar("live_url"),
  tags: text("tags").array().default(sql`'{}'::text[]`),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Project collaborators
export const projectCollaborators = pgTable("project_collaborators", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  projectId: varchar("project_id").notNull().references(() => projects.id),
  userId: varchar("user_id").notNull().references(() => users.id),
  role: varchar("role").default("contributor"),
  joinedAt: timestamp("joined_at").defaultNow(),
});

// Tech Clans
export const clans = pgTable("clans", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(),
  description: text("description"),
  leaderId: varchar("leader_id").notNull().references(() => users.id),
  bannerImage: varchar("banner_image"),
  emblem: varchar("emblem"),
  xp: integer("xp").default(0),
  level: integer("level").default(1),
  memberCount: integer("member_count").default(1),
  maxMembers: integer("max_members").default(50),
  focus: text("focus").array().default(sql`'{}'::text[]`),
  type: varchar("type").default("interest"),
  projectGoal: text("project_goal"),
  skillsNeeded: text("skills_needed").array().default(sql`'{}'::text[]`),
  isPublic: boolean("is_public").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Clan Members
export const clanMembers = pgTable("clan_members", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  clanId: varchar("clan_id").notNull().references(() => clans.id),
  userId: varchar("user_id").notNull().references(() => users.id),
  role: varchar("role").default("member"),
  xpContributed: integer("xp_contributed").default(0),
  joinedAt: timestamp("joined_at").defaultNow(),
});

// Quests
export const quests = pgTable("quests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title").notNull(),
  description: text("description"),
  type: varchar("type").notNull(),
  xpReward: integer("xp_reward").default(25),
  requirement: jsonb("requirement"),
  icon: varchar("icon"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// User Quest Progress
export const userQuests = pgTable("user_quests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  questId: varchar("quest_id").notNull().references(() => quests.id),
  progress: integer("progress").default(0),
  target: integer("target").default(1),
  isCompleted: boolean("is_completed").default(false),
  completedAt: timestamp("completed_at"),
  assignedAt: timestamp("assigned_at").defaultNow(),
});

// Mini-Courses
export const courses = pgTable("courses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title").notNull(),
  description: text("description"),
  duration: integer("duration").default(10),
  difficulty: varchar("difficulty").default("beginner"),
  category: varchar("category"),
  icon: varchar("icon"),
  content: jsonb("content"),
  xpReward: integer("xp_reward").default(100),
  enrollments: integer("enrollments").default(0),
  rating: integer("rating").default(0),
  tags: text("tags").array().default(sql`'{}'::text[]`),
  createdAt: timestamp("created_at").defaultNow(),
});

// User Course Progress
export const userCourses = pgTable("user_courses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  courseId: varchar("course_id").notNull().references(() => courses.id),
  progress: integer("progress").default(0),
  isCompleted: boolean("is_completed").default(false),
  completedAt: timestamp("completed_at"),
  startedAt: timestamp("started_at").defaultNow(),
});

// Direct Messages
export const messages = pgTable("messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  senderId: varchar("sender_id").notNull().references(() => users.id),
  receiverId: varchar("receiver_id").notNull().references(() => users.id),
  content: text("content").notNull(),
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// TechPulse Feed Items
export const feedItems = pgTable("feed_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title").notNull(),
  description: text("description"),
  content: text("content"),
  source: varchar("source"),
  sourceUrl: varchar("source_url"),
  imageUrl: varchar("image_url"),
  category: varchar("category"),
  tags: text("tags").array().default(sql`'{}'::text[]`),
  likes: integer("likes").default(0),
  views: integer("views").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// Roadmaps
export const roadmaps = pgTable("roadmaps", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(),
  slug: varchar("slug").notNull().unique(),
  description: text("description"),
  category: varchar("category"),
  difficulty: varchar("difficulty").default("beginner"),
  estimatedWeeks: integer("estimated_weeks").default(12),
  milestones: jsonb("milestones"),
  skills: text("skills").array().default(sql`'{}'::text[]`),
  icon: varchar("icon"),
  color: varchar("color"),
  createdAt: timestamp("created_at").defaultNow(),
});

// User Roadmap Progress
export const userRoadmaps = pgTable("user_roadmaps", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  roadmapId: varchar("roadmap_id").notNull().references(() => roadmaps.id),
  currentMilestone: integer("current_milestone").default(0),
  completedMilestones: integer("completed_milestones").array().default(sql`'{}'::integer[]`),
  isCompleted: boolean("is_completed").default(false),
  startedAt: timestamp("started_at").defaultNow(),
  completedAt: timestamp("completed_at"),
});

// Leaderboard entries (cached for performance)
export const leaderboardEntries = pgTable("leaderboard_entries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  category: varchar("category").notNull(),
  score: integer("score").default(0),
  rank: integer("rank"),
  period: varchar("period").default("all_time"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// AI Chat History for Copilot
export const aiChats = pgTable("ai_chats", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  messages: jsonb("messages").default(sql`'[]'::jsonb`),
  context: varchar("context"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Competitions & Hackathons
export const competitions = pgTable("competitions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(),
  description: text("description"),
  type: varchar("type").notNull(), // 'hackathon', 'competition', 'code-race'
  arenaId: varchar("arena_id").references(() => arenas.id),
  status: varchar("status").default("upcoming"), // upcoming, active, completed
  prizePool: integer("prize_pool").default(0),
  maxParticipants: integer("max_participants"),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  difficulty: varchar("difficulty").default("intermediate"),
  rules: text("rules"),
  prizes: jsonb("prizes"), // {first: "prize", second: "prize", ...}
  participantCount: integer("participant_count").default(0),
  tags: text("tags").array().default(sql`'{}'::text[]`),
  createdBy: varchar("created_by").notNull().references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Competition Participants
export const competitionParticipants = pgTable("competition_participants", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  competitionId: varchar("competition_id").notNull().references(() => competitions.id),
  userId: varchar("user_id").notNull().references(() => users.id),
  teamName: varchar("team_name"),
  score: integer("score").default(0),
  rank: integer("rank"),
  submissionUrl: varchar("submission_url"),
  submittedAt: timestamp("submitted_at"),
  joinedAt: timestamp("joined_at").defaultNow(),
});

// Competition Leaderboard (cached for performance)
export const competitionLeaderboard = pgTable("competition_leaderboard", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  competitionId: varchar("competition_id").notNull().references(() => competitions.id),
  userId: varchar("user_id").notNull().references(() => users.id),
  score: integer("score").default(0),
  rank: integer("rank"),
  xpEarned: integer("xp_earned").default(0),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true, updatedAt: true });
export const insertUserProfileSchema = createInsertSchema(userProfiles).omit({ id: true, createdAt: true, updatedAt: true });
export const insertArenaSchema = createInsertSchema(arenas).omit({ id: true, createdAt: true });
export const insertChallengeSchema = createInsertSchema(challenges).omit({ id: true, createdAt: true });
export const insertUserChallengeSchema = createInsertSchema(userChallenges).omit({ id: true, startedAt: true });
export const insertProjectSchema = createInsertSchema(projects).omit({ id: true, createdAt: true, updatedAt: true });
export const insertClanSchema = createInsertSchema(clans).omit({ id: true, createdAt: true });
export const insertClanMemberSchema = createInsertSchema(clanMembers).omit({ id: true, joinedAt: true });
export const insertQuestSchema = createInsertSchema(quests).omit({ id: true, createdAt: true });
export const insertUserQuestSchema = createInsertSchema(userQuests).omit({ id: true, assignedAt: true });
export const insertCourseSchema = createInsertSchema(courses).omit({ id: true, createdAt: true });
export const insertUserCourseSchema = createInsertSchema(userCourses).omit({ id: true, startedAt: true });
export const insertMessageSchema = createInsertSchema(messages).omit({ id: true, createdAt: true });
export const insertFeedItemSchema = createInsertSchema(feedItems).omit({ id: true, createdAt: true });
export const insertRoadmapSchema = createInsertSchema(roadmaps).omit({ id: true, createdAt: true });
export const insertUserRoadmapSchema = createInsertSchema(userRoadmaps).omit({ id: true, startedAt: true });
export const insertAiChatSchema = createInsertSchema(aiChats).omit({ id: true, createdAt: true, updatedAt: true });
export const insertCompetitionSchema = createInsertSchema(competitions).omit({ id: true, createdAt: true, updatedAt: true });
export const insertCompetitionParticipantSchema = createInsertSchema(competitionParticipants).omit({ id: true, joinedAt: true });
export const insertCompetitionLeaderboardSchema = createInsertSchema(competitionLeaderboard).omit({ id: true, updatedAt: true });

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type UserProfile = typeof userProfiles.$inferSelect;
export type InsertUserProfile = z.infer<typeof insertUserProfileSchema>;
export type Arena = typeof arenas.$inferSelect;
export type InsertArena = z.infer<typeof insertArenaSchema>;
export type Challenge = typeof challenges.$inferSelect;
export type InsertChallenge = z.infer<typeof insertChallengeSchema>;
export type UserChallenge = typeof userChallenges.$inferSelect;
export type Project = typeof projects.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Clan = typeof clans.$inferSelect;
export type InsertClan = z.infer<typeof insertClanSchema>;
export type ClanMember = typeof clanMembers.$inferSelect;
export type Quest = typeof quests.$inferSelect;
export type UserQuest = typeof userQuests.$inferSelect;
export type Course = typeof courses.$inferSelect;
export type UserCourse = typeof userCourses.$inferSelect;
export type Message = typeof messages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type FeedItem = typeof feedItems.$inferSelect;
export type Roadmap = typeof roadmaps.$inferSelect;
export type UserRoadmap = typeof userRoadmaps.$inferSelect;
export type AiChat = typeof aiChats.$inferSelect;
export type Competition = typeof competitions.$inferSelect;
export type InsertCompetition = z.infer<typeof insertCompetitionSchema>;
export type CompetitionParticipant = typeof competitionParticipants.$inferSelect;
export type CompetitionLeaderboard = typeof competitionLeaderboard.$inferSelect;

// Interest options for onboarding
export const TECH_INTERESTS = [
  "AI",
  "Robotics",
  "Web Dev",
  "ML",
  "Cybersecurity",
  "Game Dev",
  "Cloud",
  "Blockchain",
  "AR/VR",
  "Electronics",
  "Startups",
  "Data Science",
  "Mobile Dev",
  "DevOps",
] as const;

// Avatar customization for metaverse
export const userAvatars = pgTable("user_avatars", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  skinTone: varchar("skin_tone").default("default"),
  hairStyle: varchar("hair_style").default("default"),
  outfit: varchar("outfit").default("default"),
  aura: varchar("aura").default("none"),
  level: integer("level").default(1),
  xp: integer("xp").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type UserAvatar = typeof userAvatars.$inferSelect;

const insertAvatarSchema = createInsertSchema(userAvatars).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertAvatar = z.infer<typeof insertAvatarSchema>;

export const TECH_TIERS = ["Beginner", "Explorer", "Builder", "Expert", "Master", "Legend"] as const;

export const LEARNING_PACES = ["slow", "moderate", "fast", "intensive"] as const;

export const COGNITIVE_STYLES = ["visual", "logical", "examples", "fast_track"] as const;

// CodeFusion - Code Blending & Mixing Feature
export const codeFusions = pgTable("code_fusions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  title: varchar("title").notNull(),
  description: text("description"),
  sourceCode: text("source_code").array().default(sql`'{}'::text[]`),
  blendedCode: text("blended_code"),
  language: varchar("language").default("javascript"),
  tags: text("tags").array().default(sql`'{}'::text[]`),
  isPublic: boolean("is_public").default(false),
  likes: integer("likes").default(0),
  downloads: integer("downloads").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type CodeFusion = typeof codeFusions.$inferSelect;
const insertCodeFusionSchema = createInsertSchema(codeFusions).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertCodeFusion = z.infer<typeof insertCodeFusionSchema>;
