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
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, asc, and, or, like, sql, inArray } from "drizzle-orm";
import { queryCache, queryBatcher } from "./queryOptimization";

export interface IStorage {
  // User operations (required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;

  // User Profile operations
  getUserProfile(userId: string): Promise<UserProfile | undefined>;
  createUserProfile(profile: InsertUserProfile): Promise<UserProfile>;
  updateUserProfile(userId: string, profile: Partial<InsertUserProfile>): Promise<UserProfile | undefined>;

  // Arena operations
  getArenas(): Promise<Arena[]>;
  getArenaBySlug(slug: string): Promise<Arena | undefined>;
  getArenaById(id: string): Promise<Arena | undefined>;

  // Challenge operations
  getChallenges(arenaId?: string): Promise<Challenge[]>;
  getChallengeById(id: string): Promise<Challenge | undefined>;
  getDailyChallenges(): Promise<Challenge[]>;
  getWeeklyChallenges(): Promise<Challenge[]>;

  // User Challenge operations
  getUserChallenges(userId: string): Promise<UserChallenge[]>;
  getUserChallenge(userId: string, challengeId: string): Promise<UserChallenge | undefined>;
  startChallenge(userId: string, challengeId: string): Promise<UserChallenge>;
  submitChallenge(userId: string, challengeId: string, code: string, score: number): Promise<UserChallenge | undefined>;

  // Project operations
  getProjects(limit?: number): Promise<Project[]>;
  getProjectById(id: string): Promise<Project | undefined>;
  getUserProjects(userId: string): Promise<Project[]>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: string, project: Partial<InsertProject>): Promise<Project | undefined>;
  deleteProject(id: string): Promise<void>;

  // Clan operations
  getClans(): Promise<Clan[]>;
  getClanById(id: string): Promise<Clan | undefined>;
  createClan(clan: InsertClan): Promise<Clan>;
  updateClan(id: string, clan: Partial<InsertClan>): Promise<Clan | undefined>;
  getClanMembers(clanId: string): Promise<(ClanMember & { user: User })[]>;
  joinClan(clanId: string, userId: string): Promise<ClanMember>;
  leaveClan(clanId: string, userId: string): Promise<void>;
  getUserClans(userId: string): Promise<Clan[]>;

  // Quest operations
  getQuests(type?: string): Promise<Quest[]>;
  getUserQuests(userId: string): Promise<(UserQuest & { quest: Quest })[]>;
  assignQuest(userId: string, questId: string, target: number): Promise<UserQuest>;
  updateQuestProgress(userId: string, questId: string, progress: number): Promise<UserQuest | undefined>;
  completeQuest(userId: string, questId: string): Promise<UserQuest | undefined>;

  // Course operations
  getCourses(category?: string): Promise<Course[]>;
  getCourseById(id: string): Promise<Course | undefined>;
  getUserCourses(userId: string): Promise<(UserCourse & { course: Course })[]>;
  startCourse(userId: string, courseId: string): Promise<UserCourse>;
  updateCourseProgress(userId: string, courseId: string, progress: number): Promise<UserCourse | undefined>;

  // Message operations
  getMessages(userId: string, otherUserId: string): Promise<Message[]>;
  getConversations(userId: string): Promise<{ user: User; lastMessage: Message }[]>;
  sendMessage(message: InsertMessage): Promise<Message>;
  markMessagesRead(userId: string, senderId: string): Promise<void>;

  // Feed operations
  getFeedItems(categories?: string[], limit?: number): Promise<FeedItem[]>;
  getFeedItemById(id: string): Promise<FeedItem | undefined>;

  // Roadmap operations
  getRoadmaps(): Promise<Roadmap[]>;
  getRoadmapBySlug(slug: string): Promise<Roadmap | undefined>;
  getUserRoadmaps(userId: string): Promise<(UserRoadmap & { roadmap: Roadmap })[]>;
  startRoadmap(userId: string, roadmapId: string): Promise<UserRoadmap>;
  updateRoadmapProgress(userId: string, roadmapId: string, milestone: number): Promise<UserRoadmap | undefined>;

  // Leaderboard operations
  getLeaderboard(category: string, period?: string, limit?: number): Promise<{ user: User; profile: UserProfile; score: number; rank: number }[]>;
  updateLeaderboardEntry(userId: string, category: string, score: number): Promise<void>;

  // AI Chat operations
  getAiChat(userId: string, context?: string): Promise<AiChat | undefined>;
  createOrUpdateAiChat(userId: string, messages: any[], context?: string): Promise<AiChat>;

  // XP operations
  addXp(userId: string, amount: number): Promise<UserProfile | undefined>;

  // Avatar operations
  getUserAvatar(userId: string): Promise<UserAvatar | undefined>;
  createAvatar(avatar: InsertAvatar): Promise<UserAvatar>;
  updateAvatar(userId: string, updates: Partial<InsertAvatar>): Promise<UserAvatar | undefined>;
  getMetaverseLeaderboard(): Promise<(UserAvatar & { user: User; profile: UserProfile })[]>;

  // CodeFusion operations
  getUserCodeFusions(userId: string): Promise<any[]>;
  createCodeFusion(fusion: any): Promise<any>;
  updateCodeFusion(id: string, fusion: Partial<any>): Promise<any>;
  deleteCodeFusion(id: string): Promise<void>;
  getPublicCodeFusions(limit?: number): Promise<any[]>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // User Profile operations
  async getUserProfile(userId: string): Promise<UserProfile | undefined> {
    const [profile] = await db.select().from(userProfiles).where(eq(userProfiles.userId, userId));
    return profile;
  }

  async createUserProfile(profile: InsertUserProfile): Promise<UserProfile> {
    const [created] = await db.insert(userProfiles).values(profile).returning();
    return created;
  }

  async updateUserProfile(userId: string, profile: Partial<InsertUserProfile>): Promise<UserProfile | undefined> {
    const [updated] = await db
      .update(userProfiles)
      .set({ ...profile, updatedAt: new Date() })
      .where(eq(userProfiles.userId, userId))
      .returning();
    return updated;
  }

  // Arena operations
  async getArenas(): Promise<Arena[]> {
    return db.select().from(arenas).orderBy(asc(arenas.name));
  }

  async getArenaBySlug(slug: string): Promise<Arena | undefined> {
    const [arena] = await db.select().from(arenas).where(eq(arenas.slug, slug));
    return arena;
  }

  async getArenaById(id: string): Promise<Arena | undefined> {
    const [arena] = await db.select().from(arenas).where(eq(arenas.id, id));
    return arena;
  }

  // Challenge operations
  async getChallenges(arenaId?: string): Promise<Challenge[]> {
    if (arenaId) {
      return db.select().from(challenges).where(eq(challenges.arenaId, arenaId));
    }
    return db.select().from(challenges);
  }

  async getChallengeById(id: string): Promise<Challenge | undefined> {
    const [challenge] = await db.select().from(challenges).where(eq(challenges.id, id));
    return challenge;
  }

  async getDailyChallenges(): Promise<Challenge[]> {
    return db.select().from(challenges).where(eq(challenges.isDaily, true));
  }

  async getWeeklyChallenges(): Promise<Challenge[]> {
    return db.select().from(challenges).where(eq(challenges.isWeekly, true));
  }

  // User Challenge operations
  async getUserChallenges(userId: string): Promise<UserChallenge[]> {
    return db.select().from(userChallenges).where(eq(userChallenges.userId, userId));
  }

  async getUserChallenge(userId: string, challengeId: string): Promise<UserChallenge | undefined> {
    const [uc] = await db
      .select()
      .from(userChallenges)
      .where(and(eq(userChallenges.userId, userId), eq(userChallenges.challengeId, challengeId)));
    return uc;
  }

  async startChallenge(userId: string, challengeId: string): Promise<UserChallenge> {
    const [uc] = await db
      .insert(userChallenges)
      .values({ userId, challengeId, status: "in_progress" })
      .returning();
    return uc;
  }

  async submitChallenge(userId: string, challengeId: string, code: string, score: number): Promise<UserChallenge | undefined> {
    const [uc] = await db
      .update(userChallenges)
      .set({
        status: "completed",
        submittedCode: code,
        score,
        completedAt: new Date(),
      })
      .where(and(eq(userChallenges.userId, userId), eq(userChallenges.challengeId, challengeId)))
      .returning();
    return uc;
  }

  // Project operations
  async getProjects(limit = 50): Promise<Project[]> {
    return db.select().from(projects).where(eq(projects.isPublic, true)).orderBy(desc(projects.createdAt)).limit(limit);
  }

  async getProjectById(id: string): Promise<Project | undefined> {
    const [project] = await db.select().from(projects).where(eq(projects.id, id));
    return project;
  }

  async getUserProjects(userId: string): Promise<Project[]> {
    return db.select().from(projects).where(eq(projects.userId, userId)).orderBy(desc(projects.createdAt));
  }

  async createProject(project: InsertProject): Promise<Project> {
    const [created] = await db.insert(projects).values(project).returning();
    return created;
  }

  async updateProject(id: string, project: Partial<InsertProject>): Promise<Project | undefined> {
    const [updated] = await db
      .update(projects)
      .set({ ...project, updatedAt: new Date() })
      .where(eq(projects.id, id))
      .returning();
    return updated;
  }

  async deleteProject(id: string): Promise<void> {
    await db.delete(projects).where(eq(projects.id, id));
  }

  // Clan operations
  async getClans(): Promise<Clan[]> {
    return db.select().from(clans).where(eq(clans.isPublic, true)).orderBy(desc(clans.xp));
  }

  async getClanById(id: string): Promise<Clan | undefined> {
    const [clan] = await db.select().from(clans).where(eq(clans.id, id));
    return clan;
  }

  async createClan(clan: InsertClan): Promise<Clan> {
    const [created] = await db.insert(clans).values(clan).returning();
    // Add creator as leader member
    await db.insert(clanMembers).values({
      clanId: created.id,
      userId: clan.leaderId,
      role: "leader",
    });
    return created;
  }

  async updateClan(id: string, clan: Partial<InsertClan>): Promise<Clan | undefined> {
    const [updated] = await db.update(clans).set(clan).where(eq(clans.id, id)).returning();
    return updated;
  }

  async getClanMembers(clanId: string): Promise<(ClanMember & { user: User })[]> {
    const members = await db
      .select()
      .from(clanMembers)
      .innerJoin(users, eq(clanMembers.userId, users.id))
      .where(eq(clanMembers.clanId, clanId));
    return members.map((m) => ({ ...m.clan_members, user: m.users }));
  }

  async joinClan(clanId: string, userId: string): Promise<ClanMember> {
    const [member] = await db.insert(clanMembers).values({ clanId, userId }).returning();
    await db
      .update(clans)
      .set({ memberCount: sql`${clans.memberCount} + 1` })
      .where(eq(clans.id, clanId));
    return member;
  }

  async leaveClan(clanId: string, userId: string): Promise<void> {
    await db.delete(clanMembers).where(and(eq(clanMembers.clanId, clanId), eq(clanMembers.userId, userId)));
    await db
      .update(clans)
      .set({ memberCount: sql`${clans.memberCount} - 1` })
      .where(eq(clans.id, clanId));
  }

  async getUserClans(userId: string): Promise<Clan[]> {
    const memberClans = await db
      .select({ clan: clans })
      .from(clanMembers)
      .innerJoin(clans, eq(clanMembers.clanId, clans.id))
      .where(eq(clanMembers.userId, userId));
    return memberClans.map((m) => m.clan);
  }

  // Quest operations
  async getQuests(type?: string): Promise<Quest[]> {
    if (type) {
      return db.select().from(quests).where(and(eq(quests.type, type), eq(quests.isActive, true)));
    }
    return db.select().from(quests).where(eq(quests.isActive, true));
  }

  async getUserQuests(userId: string): Promise<(UserQuest & { quest: Quest })[]> {
    const uqs = await db
      .select()
      .from(userQuests)
      .innerJoin(quests, eq(userQuests.questId, quests.id))
      .where(eq(userQuests.userId, userId));
    return uqs.map((uq) => ({ ...uq.user_quests, quest: uq.quests }));
  }

  async assignQuest(userId: string, questId: string, target: number): Promise<UserQuest> {
    const [uq] = await db.insert(userQuests).values({ userId, questId, target }).returning();
    return uq;
  }

  async updateQuestProgress(userId: string, questId: string, progress: number): Promise<UserQuest | undefined> {
    const [uq] = await db
      .update(userQuests)
      .set({ progress })
      .where(and(eq(userQuests.userId, userId), eq(userQuests.questId, questId)))
      .returning();
    return uq;
  }

  async completeQuest(userId: string, questId: string): Promise<UserQuest | undefined> {
    const [uq] = await db
      .update(userQuests)
      .set({ isCompleted: true, completedAt: new Date() })
      .where(and(eq(userQuests.userId, userId), eq(userQuests.questId, questId)))
      .returning();
    return uq;
  }

  // Course operations
  async getCourses(category?: string): Promise<Course[]> {
    if (category) {
      return db.select().from(courses).where(eq(courses.category, category)).orderBy(asc(courses.title));
    }
    return db.select().from(courses).orderBy(asc(courses.title));
  }

  async getCourseById(id: string): Promise<Course | undefined> {
    const [course] = await db.select().from(courses).where(eq(courses.id, id));
    return course;
  }

  async getUserCourses(userId: string): Promise<(UserCourse & { course: Course })[]> {
    const ucs = await db
      .select()
      .from(userCourses)
      .innerJoin(courses, eq(userCourses.courseId, courses.id))
      .where(eq(userCourses.userId, userId));
    return ucs.map((uc) => ({ ...uc.user_courses, course: uc.courses }));
  }

  async startCourse(userId: string, courseId: string): Promise<UserCourse> {
    const [uc] = await db.insert(userCourses).values({ userId, courseId }).returning();
    await db
      .update(courses)
      .set({ enrollments: sql`${courses.enrollments} + 1` })
      .where(eq(courses.id, courseId));
    return uc;
  }

  async updateCourseProgress(userId: string, courseId: string, progress: number): Promise<UserCourse | undefined> {
    const isCompleted = progress >= 100;
    const [uc] = await db
      .update(userCourses)
      .set({
        progress,
        isCompleted,
        completedAt: isCompleted ? new Date() : undefined,
      })
      .where(and(eq(userCourses.userId, userId), eq(userCourses.courseId, courseId)))
      .returning();
    return uc;
  }

  // Message operations
  async getMessages(userId: string, otherUserId: string): Promise<Message[]> {
    return db
      .select()
      .from(messages)
      .where(
        or(
          and(eq(messages.senderId, userId), eq(messages.receiverId, otherUserId)),
          and(eq(messages.senderId, otherUserId), eq(messages.receiverId, userId))
        )
      )
      .orderBy(asc(messages.createdAt));
  }

  async getConversations(userId: string): Promise<{ user: User; lastMessage: Message }[]> {
    // Get unique conversations with last message
    const allMessages = await db
      .select()
      .from(messages)
      .where(or(eq(messages.senderId, userId), eq(messages.receiverId, userId)))
      .orderBy(desc(messages.createdAt));

    const conversationMap = new Map<string, Message>();
    for (const msg of allMessages) {
      const otherUserId = msg.senderId === userId ? msg.receiverId : msg.senderId;
      if (!conversationMap.has(otherUserId)) {
        conversationMap.set(otherUserId, msg);
      }
    }

    const conversations: { user: User; lastMessage: Message }[] = [];
    const entries = Array.from(conversationMap.entries());
    for (const [otherUserId, lastMessage] of entries) {
      const user = await this.getUser(otherUserId);
      if (user) {
        conversations.push({ user, lastMessage });
      }
    }

    return conversations;
  }

  async sendMessage(message: InsertMessage): Promise<Message> {
    const [created] = await db.insert(messages).values(message).returning();
    return created;
  }

  async markMessagesRead(userId: string, senderId: string): Promise<void> {
    await db
      .update(messages)
      .set({ isRead: true })
      .where(and(eq(messages.receiverId, userId), eq(messages.senderId, senderId)));
  }

  // Feed operations
  async getFeedItems(categories?: string[], limit = 50): Promise<FeedItem[]> {
    if (categories && categories.length > 0) {
      return db
        .select()
        .from(feedItems)
        .where(inArray(feedItems.category, categories))
        .orderBy(desc(feedItems.createdAt))
        .limit(limit);
    }
    return db.select().from(feedItems).orderBy(desc(feedItems.createdAt)).limit(limit);
  }

  async getFeedItemById(id: string): Promise<FeedItem | undefined> {
    const [item] = await db.select().from(feedItems).where(eq(feedItems.id, id));
    return item;
  }

  // Roadmap operations
  async getRoadmaps(): Promise<Roadmap[]> {
    return db.select().from(roadmaps).orderBy(asc(roadmaps.name));
  }

  async getRoadmapBySlug(slug: string): Promise<Roadmap | undefined> {
    const [roadmap] = await db.select().from(roadmaps).where(eq(roadmaps.slug, slug));
    return roadmap;
  }

  async getUserRoadmaps(userId: string): Promise<(UserRoadmap & { roadmap: Roadmap })[]> {
    const urs = await db
      .select()
      .from(userRoadmaps)
      .innerJoin(roadmaps, eq(userRoadmaps.roadmapId, roadmaps.id))
      .where(eq(userRoadmaps.userId, userId));
    return urs.map((ur) => ({ ...ur.user_roadmaps, roadmap: ur.roadmaps }));
  }

  async startRoadmap(userId: string, roadmapId: string): Promise<UserRoadmap> {
    const [ur] = await db.insert(userRoadmaps).values({ userId, roadmapId }).returning();
    return ur;
  }

  async updateRoadmapProgress(userId: string, roadmapId: string, milestone: number): Promise<UserRoadmap | undefined> {
    const [existing] = await db
      .select()
      .from(userRoadmaps)
      .where(and(eq(userRoadmaps.userId, userId), eq(userRoadmaps.roadmapId, roadmapId)));

    if (!existing) return undefined;

    const completedMilestones = [...(existing.completedMilestones || []), milestone];
    const [updated] = await db
      .update(userRoadmaps)
      .set({ currentMilestone: milestone, completedMilestones })
      .where(and(eq(userRoadmaps.userId, userId), eq(userRoadmaps.roadmapId, roadmapId)))
      .returning();
    return updated;
  }

  // Leaderboard operations
  async getLeaderboard(
    category: string,
    period = "all_time",
    limit = 100
  ): Promise<{ user: User; profile: UserProfile; score: number; rank: number }[]> {
    const entries = await db
      .select()
      .from(leaderboardEntries)
      .innerJoin(users, eq(leaderboardEntries.userId, users.id))
      .innerJoin(userProfiles, eq(leaderboardEntries.userId, userProfiles.userId))
      .where(and(eq(leaderboardEntries.category, category), eq(leaderboardEntries.period, period)))
      .orderBy(desc(leaderboardEntries.score))
      .limit(limit);

    return entries.map((e, index) => ({
      user: e.users,
      profile: e.user_profiles,
      score: e.leaderboard_entries.score ?? 0,
      rank: index + 1,
    }));
  }

  async updateLeaderboardEntry(userId: string, category: string, score: number): Promise<void> {
    await db
      .insert(leaderboardEntries)
      .values({ userId, category, score, period: "all_time" })
      .onConflictDoUpdate({
        target: [leaderboardEntries.userId, leaderboardEntries.category],
        set: { score, updatedAt: new Date() },
      });
  }

  // AI Chat operations
  async getAiChat(userId: string, context?: string): Promise<AiChat | undefined> {
    const query = context
      ? and(eq(aiChats.userId, userId), eq(aiChats.context, context))
      : eq(aiChats.userId, userId);
    const [chat] = await db.select().from(aiChats).where(query).orderBy(desc(aiChats.updatedAt));
    return chat;
  }

  async createOrUpdateAiChat(userId: string, chatMessages: any[], context?: string): Promise<AiChat> {
    const existing = await this.getAiChat(userId, context);
    if (existing) {
      const [updated] = await db
        .update(aiChats)
        .set({ messages: chatMessages, updatedAt: new Date() })
        .where(eq(aiChats.id, existing.id))
        .returning();
      return updated;
    }
    const [created] = await db
      .insert(aiChats)
      .values({ userId, messages: chatMessages, context })
      .returning();
    return created;
  }

  // XP operations
  async addXp(userId: string, amount: number): Promise<UserProfile | undefined> {
    const profile = await this.getUserProfile(userId);
    if (!profile) return undefined;

    const newXp = (profile.xp || 0) + amount;
    const newLevel = Math.floor(newXp / 1000) + 1;

    const [updated] = await db
      .update(userProfiles)
      .set({ xp: newXp, level: newLevel, updatedAt: new Date() })
      .where(eq(userProfiles.userId, userId))
      .returning();

    return updated;
  }

  // Avatar operations for metaverse
  async getUserAvatar(userId: string): Promise<UserAvatar | undefined> {
    const [avatar] = await db.select().from(userAvatars).where(eq(userAvatars.userId, userId));
    return avatar;
  }

  async createAvatar(avatar: InsertAvatar): Promise<UserAvatar> {
    const [created] = await db.insert(userAvatars).values(avatar).returning();
    return created;
  }

  async updateAvatar(userId: string, updates: Partial<InsertAvatar>): Promise<UserAvatar | undefined> {
    const [updated] = await db
      .update(userAvatars)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(userAvatars.userId, userId))
      .returning();
    return updated;
  }

  async getMetaverseLeaderboard(): Promise<(UserAvatar & { user: User; profile: UserProfile })[]> {
    const results = await db
      .select()
      .from(userAvatars)
      .innerJoin(users, eq(userAvatars.userId, users.id))
      .innerJoin(userProfiles, eq(userAvatars.userId, userProfiles.userId))
      .orderBy(desc(userProfiles.xp))
      .limit(100);

    return results.map((r) => ({
      ...r.user_avatars,
      user: r.users,
      profile: r.user_profiles,
    }));
  }

  // CodeFusion operations
  async getUserCodeFusions(userId: string): Promise<CodeFusion[]> {
    return db.select().from(codeFusions).where(eq(codeFusions.userId, userId));
  }

  async createCodeFusion(fusion: InsertCodeFusion & { userId: string }): Promise<CodeFusion> {
    const [created] = await db.insert(codeFusions).values(fusion).returning();
    return created;
  }

  async updateCodeFusion(id: string, fusion: Partial<InsertCodeFusion>): Promise<CodeFusion | undefined> {
    const [updated] = await db.update(codeFusions).set({ ...fusion, updatedAt: new Date() }).where(eq(codeFusions.id, id)).returning();
    return updated;
  }

  async deleteCodeFusion(id: string): Promise<void> {
    await db.delete(codeFusions).where(eq(codeFusions.id, id));
  }

  async getPublicCodeFusions(limit = 20): Promise<CodeFusion[]> {
    return db.select().from(codeFusions).where(eq(codeFusions.isPublic, true)).limit(limit);
  }
}

export const storage = new DatabaseStorage();
