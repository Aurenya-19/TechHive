import type { Express, Request } from "express";
import {
  type User,
  type UpsertUser,
  type UserProfile,
  type InsertUserProfile,
  type Arena,
  type Challenge,
  type UserChallenge,
  type Project,
  type Clan,
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
  type UserActivity,
  type UserPerformance,
  users,
  userProfiles,
  arenas,
  challenges,
  userChallenges,
  projects,
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
  competitions,
  competitionParticipants,
  competitionLeaderboard,
  userActivities,
  userPerformance,
  userStats,
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
  getCompetitions(limit?: number): Promise<any[]>;
  getCompetition(id: string): Promise<any>;
  joinCompetition(competitionId: string, userId: string): Promise<any>;
  submitCompetitionSolution(data: any): Promise<any>;
  getCompetitionLeaderboard(competitionId: string): Promise<any[]>;
  getClans(limit?: number): Promise<Clan[]>;
  getUserClans(userId: string): Promise<Clan[]>;
  createClan(data: any): Promise<Clan>;
  joinClan(clanId: string, userId: string): Promise<ClanMember>;
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

  async getArenas(limit = 100): Promise<Arena[]> {
    return db.select().from(arenas).limit(limit).orderBy(asc(arenas.name));
  }

  async getArenaBySlug(slug: string): Promise<Arena | undefined> {
    const [arena] = await db.select().from(arenas).where(eq(arenas.slug, slug));
    return arena;
  }

  async getChallengesByArena(arenaId: string, limit = 50): Promise<Challenge[]> {
    return db.select().from(challenges).where(eq(challenges.arenaId, arenaId)).limit(limit);
  }

  async getChallengeById(id: string): Promise<Challenge | undefined> {
    const [challenge] = await db.select().from(challenges).where(eq(challenges.id, id));
    return challenge;
  }

  async getQuests(limit = 100): Promise<Quest[]> {
    return db.select().from(quests).limit(limit).orderBy(desc(quests.createdAt));
  }

  async getQuestsByArena(arenaId: string): Promise<Quest[]> {
    return db.select().from(quests).orderBy(desc(quests.createdAt));
  }

  async getCourses(limit = 100): Promise<Course[]> {
    return db.select().from(courses).limit(limit);
  }

  async getCompetitions(limit = 20): Promise<any[]> {
    return db.select().from(competitions).limit(limit);
  }

  async getCompetition(id: string): Promise<any> {
    const [comp] = await db.select().from(competitions).where(eq(competitions.id, id));
    return comp;
  }

  async joinCompetition(competitionId: string, userId: string): Promise<any> {
    return db.insert(competitionParticipants).values({ competitionId, userId }).returning();
  }

  async submitCompetitionSolution(data: any): Promise<any> {
    return { success: true, submissionId: Math.random() };
  }

  async getCompetitionLeaderboard(competitionId: string): Promise<any[]> {
    return db.select().from(competitionLeaderboard).where(eq(competitionLeaderboard.competitionId, competitionId));
  }

  async createProject(userId: string, project: any): Promise<any> {
    const [created] = await db.insert(projects).values({ ...project, creatorId: userId }).returning();
    return created;
  }

  async getProjectsByUser(userId: string, limit = 20): Promise<Project[]> {
    return db.select().from(projects).where(eq(projects.creatorId, userId)).limit(limit);
  }

  async getProject(id: string): Promise<Project | undefined> {
    const [project] = await db.select().from(projects).where(eq(projects.id, id));
    return project;
  }

  async updateProject(id: string, updates: any): Promise<Project | undefined> {
    const [updated] = await db.update(projects).set(updates).where(eq(projects.id, id)).returning();
    return updated;
  }

  async createChallenge(challenge: any): Promise<Challenge> {
    const [created] = await db.insert(challenges).values(challenge).returning();
    return created;
  }

  async updateChallenge(id: string, updates: any): Promise<Challenge | undefined> {
    const [updated] = await db.update(challenges).set(updates).where(eq(challenges.id, id)).returning();
    return updated;
  }

  async getUserChallenges(userId: string, status?: string): Promise<UserChallenge[]> {
    if (status) {
      return db.select().from(userChallenges).where(and(eq(userChallenges.userId, userId), eq(userChallenges.status, status)));
    }
    return db.select().from(userChallenges).where(eq(userChallenges.userId, userId));
  }

  async submitChallenge(userId: string, challengeId: string, code: string, score: number): Promise<UserChallenge> {
    const existing = await db
      .select()
      .from(userChallenges)
      .where(and(eq(userChallenges.userId, userId), eq(userChallenges.challengeId, challengeId)));

    if (existing.length > 0) {
      const [updated] = await db
        .update(userChallenges)
        .set({ status: "completed", score, code })
        .where(and(eq(userChallenges.userId, userId), eq(userChallenges.challengeId, challengeId)))
        .returning();
      return updated;
    }

    const [created] = await db
      .insert(userChallenges)
      .values({ userId, challengeId, status: "completed", code, score })
      .returning();
    return created;
  }

  async getClans(limit = 100): Promise<Clan[]> {
    return db.select().from(clans).limit(limit).orderBy(desc(clans.createdAt));
  }

  async getUserClans(userId: string): Promise<Clan[]> {
    const userClanIds = await db.select({ clanId: clanMembers.clanId }).from(clanMembers).where(eq(clanMembers.userId, userId));
    if (userClanIds.length === 0) return [];
    return db.select().from(clans).where(inArray(clans.id, userClanIds.map(uc => uc.clanId)));
  }

  async createClan(data: any): Promise<Clan> {
    const [created] = await db
      .insert(clans)
      .values({ 
        name: data.name, 
        description: data.description,
        leaderId: data.leaderId, 
        memberCount: 1,
        badge: data.badge,
        icon: data.icon,
        isPublic: data.isPublic !== false
      })
      .returning();
    return created;
  }

  async getClan(id: string): Promise<Clan | undefined> {
    const [clan] = await db.select().from(clans).where(eq(clans.id, id));
    return clan;
  }

  async joinClan(clanId: string, userId: string): Promise<ClanMember> {
    const [member] = await db.insert(clanMembers).values({ clanId, userId }).returning();
    const clan = await this.getClan(clanId);
    if (clan) {
      await db.update(clans).set({ memberCount: clan.memberCount + 1 }).where(eq(clans.id, clanId));
    }
    return member;
  }

  async getClanMembers(clanId: string): Promise<ClanMember[]> {
    return db.select().from(clanMembers).where(eq(clanMembers.clanId, clanId));
  }

  async getAiChat(id: string): Promise<AiChat | undefined> {
    const [chat] = await db.select().from(aiChats).where(eq(aiChats.id, id));
    return chat;
  }

  async getUserAiChats(userId: string): Promise<AiChat[]> {
    return db.select().from(aiChats).where(eq(aiChats.userId, userId)).orderBy(desc(aiChats.createdAt));
  }

  async createAiChat(userId: string, topic: string): Promise<AiChat> {
    const [created] = await db
      .insert(aiChats)
      .values({ userId, topic, conversationHistory: [] })
      .returning();
    return created;
  }

  async addAiMessage(chatId: string, role: "user" | "assistant", content: string): Promise<AiChat | undefined> {
    const chat = await this.getAiChat(chatId);
    if (!chat) return undefined;

    const history = (chat.conversationHistory as any) || [];
    history.push({ role, content, timestamp: new Date() });

    const [updated] = await db
      .update(aiChats)
      .set({ conversationHistory: history })
      .where(eq(aiChats.id, chatId))
      .returning();
    return updated;
  }

  async getRoadmaps(limit = 20): Promise<Roadmap[]> {
    return db.select().from(roadmaps).limit(limit);
  }

  async getRoadmap(id: string): Promise<Roadmap | undefined> {
    const [roadmap] = await db.select().from(roadmaps).where(eq(roadmaps.id, id));
    return roadmap;
  }

  async getUserRoadmaps(userId: string): Promise<UserRoadmap[]> {
    return db.select().from(userRoadmaps).where(eq(userRoadmaps.userId, userId));
  }

  async enrollRoadmap(userId: string, roadmapId: string): Promise<UserRoadmap> {
    const [enrolled] = await db
      .insert(userRoadmaps)
      .values({ userId, roadmapId, progress: 0 })
      .returning();
    return enrolled;
  }

  async getFeedItems(limit = 50): Promise<FeedItem[]> {
    return db.select().from(feedItems).orderBy(desc(feedItems.createdAt)).limit(limit);
  }

  async getResourcesByArena(arena: string, limit = 20): Promise<any[]> {
    return db.select().from(feedItems).where(like(feedItems.category, `%${arena}%`)).limit(limit);
  }

  async createCodeFusion(userId: string, title: string, code: string): Promise<CodeFusion> {
    const [created] = await db
      .insert(codeFusions)
      .values({ userId, title, code, viewCount: 0, likeCount: 0 })
      .returning();
    return created;
  }

  async getCodeFusion(id: string): Promise<CodeFusion | undefined> {
    const [fusion] = await db.select().from(codeFusions).where(eq(codeFusions.id, id));
    return fusion;
  }

  async updateCodeFusion(id: string, updates: any): Promise<CodeFusion | undefined> {
    const [updated] = await db.update(codeFusions).set(updates).where(eq(codeFusions.id, id)).returning();
    return updated;
  }

  async getUserCodeFusions(userId: string): Promise<CodeFusion[]> {
    return db.select().from(codeFusions).where(eq(codeFusions.userId, userId));
  }

  async createUserAvatar(userId: string, avatar: InsertAvatar): Promise<UserAvatar> {
    const [created] = await db.insert(userAvatars).values({ ...avatar, userId }).returning();
    return created;
  }

  async getUserAvatar(userId: string): Promise<UserAvatar | undefined> {
    const [avatar] = await db.select().from(userAvatars).where(eq(userAvatars.userId, userId));
    return avatar;
  }

  async updateUserAvatar(userId: string, updates: any): Promise<UserAvatar | undefined> {
    const [updated] = await db.update(userAvatars).set(updates).where(eq(userAvatars.userId, userId)).returning();
    return updated;
  }

  async submitSolution(userId: string, challengeId: string, code: string, explanation: string): Promise<SolutionSubmission> {
    const [created] = await db
      .insert(solutionSubmissions)
      .values({ userId, challengeId, code, explanation })
      .returning();
    return created;
  }

  async getSolutionsByChallenge(challengeId: string): Promise<SolutionSubmission[]> {
    return db.select().from(solutionSubmissions).where(eq(solutionSubmissions.challengeId, challengeId));
  }

  async createLearningReport(userId: string, report: any): Promise<LearningReport> {
    const [created] = await db
      .insert(learningReports)
      .values({ userId, ...report })
      .returning();
    return created;
  }

  async getUserLearningReports(userId: string): Promise<LearningReport[]> {
    return db.select().from(learningReports).where(eq(learningReports.userId, userId));
  }

  async createPrivateGroup(userId: string, groupData: any): Promise<PrivateGroup> {
    const [created] = await db
      .insert(privateGroups)
      .values({ ...groupData, creatorId: userId })
      .returning();
    return created;
  }

  async getPrivateGroup(id: string): Promise<PrivateGroup | undefined> {
    const [group] = await db.select().from(privateGroups).where(eq(privateGroups.id, id));
    return group;
  }

  async joinPrivateGroup(groupId: string, userId: string): Promise<GroupMember> {
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

  async getDailyChallenges(limit = 10): Promise<Challenge[]> {
    return db.select().from(challenges).limit(limit).orderBy(desc(challenges.createdAt));
  }

  async updateUser(id: string, data: any): Promise<any> {
    const [updated] = await db.update(users).set(data).where(eq(users.id, id)).returning();
    return updated;
  }

  async updateUserProfile(userId: string, data: any): Promise<any> {
    const existing = await this.getUserProfile(userId);
    if (existing) {
      const [updated] = await db.update(userProfiles).set(data).where(eq(userProfiles.userId, userId)).returning();
      return updated;
    }
    const [created] = await db.insert(userProfiles).values({ ...data, userId }).returning();
    return created;
  }

  async recordActivity(userId: string, type: string, description: string, xpGained: number = 0, arenaId?: string, challengeId?: string): Promise<UserActivity> {
    const [activity] = await db.insert(userActivities).values({
      userId,
      type,
      description,
      xpGained,
      arenaId,
      challengeId,
    }).returning();
    return activity;
  }

  async getUserActivities(userId: string, limit = 20): Promise<UserActivity[]> {
    return db.select().from(userActivities).where(eq(userActivities.userId, userId)).orderBy(desc(userActivities.timestamp)).limit(limit);
  }

  async updateUserPerformance(userId: string, metrics: any): Promise<UserPerformance> {
    const existing = await db.select().from(userPerformance).where(eq(userPerformance.userId, userId));
    if (existing.length > 0) {
      const [updated] = await db.update(userPerformance).set({ ...metrics, updatedAt: new Date() }).where(eq(userPerformance.userId, userId)).returning();
      return updated;
    }
    const [created] = await db.insert(userPerformance).values({ userId, ...metrics }).returning();
    return created;
  }

  async getUserPerformance(userId: string): Promise<UserPerformance | undefined> {
    const [perf] = await db.select().from(userPerformance).where(eq(userPerformance.userId, userId));
    return perf;
  }
}

export const storage = new DatabaseStorage();
