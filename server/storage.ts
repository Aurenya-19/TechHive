import {
  users,
  userProfiles,
  arenas,
  challenges,
  userChallenges,
  projects,
  projectCollaborators,
  clans,
  clanMembers,
  quests,
  userQuests,
  courses,
  userCourses,
  messages,
  feedItems,
  roadmaps,
  userRoadmaps,
  leaderboardEntries,
  aiChats,
  userAvatars,
  codeFusions,
  solutionSubmissions,
  learningReports,
  privateGroups,
  groupMembers,
  groupMessages,
  advancedChallenges,
  communityBadges,
  userBadges,
  aiCommunityRecommendations,
  type User,
  type UpsertUser,
  type UserProfile,
  type InsertUserProfile,
  type Arena,
  type Challenge,
  type UserChallenge,
  type Project,
  type InsertProject,
  type Clan,
  type InsertClan,
  type ClanMember,
  type Quest,
  type UserQuest,
  type Course,
  type UserCourse,
  type Message,
  type InsertMessage,
  type FeedItem,
  type Roadmap,
  type UserRoadmap,
  type AiChat,
  type UserAvatar,
  type InsertAvatar,
  type CodeFusion,
  type InsertCodeFusion,
  type SolutionSubmission,
  type LearningReport,
  type PrivateGroup,
  type GroupMember,
  type GroupMessage,
  type AdvancedChallenge,
  type CommunityBadge,
  type UserBadge,
  type AiRecommendation,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, asc, and, or, like, sql, inArray } from "drizzle-orm";
import { queryCache, queryBatcher } from "./queryOptimization";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  getUserProfile(userId: string): Promise<UserProfile | undefined>;
  upsertUserProfile(profile: InsertUserProfile & { userId: string }): Promise<UserProfile>;
  getArenas(limit?: number): Promise<Arena[]>;
  getArenaBySlug(slug: string): Promise<Arena | undefined>;
  getChallengesByArena(arenaId: string, limit?: number): Promise<Challenge[]>;
  getChallengeById(id: string): Promise<Challenge | undefined>;
  getQuests(limit?: number): Promise<Quest[]>;
  getQuestsByArena(arenaId: string): Promise<Quest[]>;
  getCourses(limit?: number): Promise<Course[]>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async upsertUser(user: UpsertUser): Promise<User> {
    const existing = await this.getUserByEmail(user.email!);
    if (existing) return existing;
    const [created] = await db.insert(users).values(user).returning();
    return created;
  }

  async getUserProfile(userId: string): Promise<UserProfile | undefined> {
    const [profile] = await db.select().from(userProfiles).where(eq(userProfiles.userId, userId));
    return profile;
  }

  async upsertUserProfile(profile: InsertUserProfile & { userId: string }): Promise<UserProfile> {
    const existing = await this.getUserProfile(profile.userId);
    if (existing) {
      const [updated] = await db
        .update(userProfiles)
        .set(profile)
        .where(eq(userProfiles.userId, profile.userId))
        .returning();
      return updated;
    }
    const [created] = await db.insert(userProfiles).values(profile).returning();
    return created;
  }

  async getArenas(limit = 20): Promise<Arena[]> {
    return db.select().from(arenas).limit(limit).orderBy(desc(arenas.activeUsers));
  }

  async getArenaBySlug(slug: string): Promise<Arena | undefined> {
    const [arena] = await db.select().from(arenas).where(eq(arenas.slug, slug));
    return arena;
  }

  async getChallengesByArena(arenaId: string, limit = 20): Promise<Challenge[]> {
    return db.select().from(challenges).where(eq(challenges.arenaId, arenaId)).limit(limit);
  }

  async getChallengeById(id: string): Promise<Challenge | undefined> {
    const [challenge] = await db.select().from(challenges).where(eq(challenges.id, id));
    return challenge;
  }

  async getQuests(limit = 20): Promise<Quest[]> {
    return db.select().from(quests).limit(limit).orderBy(desc(quests.createdAt));
  }

  async getQuestsByArena(arenaId: string): Promise<Quest[]> {
    return db.select().from(quests).where(eq(quests.arenaId, arenaId));
  }

  async getCourses(limit = 20): Promise<Course[]> {
    return db.select().from(courses).limit(limit);
  }

  // Community operations
  async createGroup(group: any): Promise<PrivateGroup> {
    const [created] = await db.insert(privateGroups).values(group).returning();
    return created;
  }

  async getGroupById(id: string): Promise<PrivateGroup | undefined> {
    const [group] = await db.select().from(privateGroups).where(eq(privateGroups.id, id));
    return group;
  }

  async joinGroup(groupId: string, userId: string): Promise<GroupMember> {
    const [member] = await db.insert(groupMembers).values({ groupId, userId, role: "member" }).returning();
    return member;
  }

  async getGroupMessages(groupId: string, limit = 50): Promise<GroupMessage[]> {
    return db.select().from(groupMessages).where(eq(groupMessages.groupId, groupId)).limit(limit).orderBy(desc(groupMessages.createdAt));
  }

  async createGroupMessage(groupId: string, userId: string, content: string): Promise<GroupMessage> {
    const [msg] = await db.insert(groupMessages).values({ groupId, userId, content }).returning();
    return msg;
  }

  async getAdvancedChallenges(arenaId?: string, limit = 20): Promise<AdvancedChallenge[]> {
    if (arenaId) return db.select().from(advancedChallenges).where(eq(advancedChallenges.arenaId, arenaId)).limit(limit);
    return db.select().from(advancedChallenges).limit(limit);
  }

  async getUserBadges(userId: string): Promise<UserBadge[]> {
    return db.select().from(userBadges).where(eq(userBadges.userId, userId));
  }

  async awardBadge(userId: string, badgeId: string): Promise<UserBadge | undefined> {
    const [badge] = await db.insert(userBadges).values({ userId, badgeId }).onConflictDoNothing().returning();
    return badge;
  }

  async getSolutionSubmissions(userId: string, limit = 50): Promise<SolutionSubmission[]> {
    return db.select().from(solutionSubmissions).where(eq(solutionSubmissions.userId, userId)).limit(limit);
  }

  async submitSolution(submission: any): Promise<SolutionSubmission> {
    const [created] = await db.insert(solutionSubmissions).values(submission).returning();
    return created;
  }

  async getMonthlyReport(userId: string, month: string): Promise<LearningReport | undefined> {
    const [report] = await db.select().from(learningReports)
      .where(and(eq(learningReports.userId, userId), eq(learningReports.month, month)));
    return report;
  }

  async createMonthlyReport(report: any): Promise<LearningReport> {
    const [created] = await db.insert(learningReports).values(report).returning();
    return created;
  }

  async getGroupRecommendations(userId: string, limit = 5): Promise<AiRecommendation[]> {
    return db.select().from(aiCommunityRecommendations)
      .where(eq(aiCommunityRecommendations.userId, userId))
      .limit(limit)
      .orderBy(desc(aiCommunityRecommendations.matchScore));
  }
}

export const storage = new DatabaseStorage();
