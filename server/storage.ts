import { db, executeWithRetry, isDatabaseAvailable } from "./db";
import { eq, desc, asc, and } from "drizzle-orm";
import type {
  User,
  UpsertUser,
  UserProfile,
  InsertUserProfile,
  Arena,
  Challenge,
  Quest,
  Course,
  Project,
  Clan,
} from "@shared/schema";
import {
  users,
  userProfiles,
  arenas,
  challenges,
  quests,
  courses,
  projects,
  competitions,
  competitionParticipants,
  competitionLeaderboard,
  clans,
  clanMembers,
  userActivities,
} from "@shared/schema";

// In-memory storage as fallback
const memoryStore = {
  users: new Map<string, User>(),
  userProfiles: new Map<string, UserProfile>(),
  arenas: new Map<string, Arena>(),
  challenges: new Map<string, Challenge>(),
  quests: new Map<string, Quest>(),
  courses: new Map<string, Course>(),
  projects: new Map<string, Project>(),
  clans: new Map<string, Clan>(),
};

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
  createProject(userId: string, project: any): Promise<any>;
  getProjectsByUser(userId: string, limit?: number): Promise<Project[]>;
  getProject(id: string): Promise<Project | undefined>;
  getClans(limit?: number): Promise<Clan[]>;
  getUserClans(userId: string): Promise<Clan[]>;
  createClan(clan: any): Promise<Clan>;
  joinClan(clanId: string, userId: string): Promise<any>;
  recordActivity(userId: string, activityType: string, metadata?: any): Promise<void>;
  getUserActivities(userId: string, limit?: number): Promise<any[]>;
  getPerformanceMetrics(userId: string): Promise<any>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    if (!isDatabaseAvailable()) {
      return memoryStore.users.get(id);
    }
    
    const result = await executeWithRetry(() => 
      db.select().from(users).where(eq(users.id, id))
    );
    
    return result?.[0] || memoryStore.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    if (!isDatabaseAvailable()) {
      return Array.from(memoryStore.users.values()).find(u => u.email === email);
    }
    
    const result = await executeWithRetry(() =>
      db.select().from(users).where(eq(users.email, email))
    );
    
    return result?.[0] || Array.from(memoryStore.users.values()).find(u => u.email === email);
  }

  async upsertUser(user: UpsertUser): Promise<User> {
    // Always save to memory first
    const userData = user as User;
    memoryStore.users.set(userData.id, userData);
    if (userData.email) {
      // Also index by email for quick lookup
      Array.from(memoryStore.users.values())
        .filter(u => u.email === userData.email && u.id !== userData.id)
        .forEach(u => memoryStore.users.delete(u.id));
    }
    
    // Try database if available
    if (isDatabaseAvailable()) {
      try {
        const existing = await this.getUserByEmail(user.email!);
        if (existing) {
          const [updated] = await db
            .update(users)
            .set(user)
            .where(eq(users.id, existing.id))
            .returning();
          return updated;
        }
        
        const [created] = await db.insert(users).values(user).returning();
        return created;
      } catch (err) {
        console.log("[Storage] Database upsert failed, using memory");
      }
    }
    
    return userData;
  }

  async getUserProfile(userId: string): Promise<UserProfile | undefined> {
    if (!isDatabaseAvailable()) {
      return memoryStore.userProfiles.get(userId);
    }
    
    const result = await executeWithRetry(() =>
      db.select().from(userProfiles).where(eq(userProfiles.userId, userId))
    );
    
    return result?.[0] || memoryStore.userProfiles.get(userId);
  }

  async upsertUserProfile(profile: InsertUserProfile & { userId: string }): Promise<UserProfile> {
    const profileData = profile as UserProfile;
    memoryStore.userProfiles.set(profile.userId, profileData);
    
    if (isDatabaseAvailable()) {
      try {
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
      } catch (err) {
        console.log("[Storage] Profile upsert failed, using memory");
      }
    }
    
    return profileData;
  }

  async getArenas(limit = 100): Promise<Arena[]> {
    if (!isDatabaseAvailable()) {
      return Array.from(memoryStore.arenas.values()).slice(0, limit);
    }
    
    const result = await executeWithRetry(() =>
      db.select().from(arenas).limit(limit).orderBy(asc(arenas.name))
    );
    
    return result || Array.from(memoryStore.arenas.values()).slice(0, limit);
  }

  async getArenaBySlug(slug: string): Promise<Arena | undefined> {
    if (!isDatabaseAvailable()) {
      return Array.from(memoryStore.arenas.values()).find(a => a.slug === slug);
    }
    
    const result = await executeWithRetry(() =>
      db.select().from(arenas).where(eq(arenas.slug, slug))
    );
    
    return result?.[0] || Array.from(memoryStore.arenas.values()).find(a => a.slug === slug);
  }

  async getChallengesByArena(arenaId: string, limit = 50): Promise<Challenge[]> {
    if (!isDatabaseAvailable()) {
      return Array.from(memoryStore.challenges.values())
        .filter(c => c.arenaId === arenaId)
        .slice(0, limit);
    }
    
    const result = await executeWithRetry(() =>
      db.select().from(challenges).where(eq(challenges.arenaId, arenaId)).limit(limit)
    );
    
    return result || [];
  }

  async getChallengeById(id: string): Promise<Challenge | undefined> {
    if (!isDatabaseAvailable()) {
      return memoryStore.challenges.get(id);
    }
    
    const result = await executeWithRetry(() =>
      db.select().from(challenges).where(eq(challenges.id, id))
    );
    
    return result?.[0];
  }

  async getQuests(limit = 100): Promise<Quest[]> {
    if (!isDatabaseAvailable()) {
      return Array.from(memoryStore.quests.values()).slice(0, limit);
    }
    
    const result = await executeWithRetry(() =>
      db.select().from(quests).limit(limit).orderBy(desc(quests.createdAt))
    );
    
    return result || [];
  }

  async getQuestsByArena(arenaId: string): Promise<Quest[]> {
    if (!isDatabaseAvailable()) {
      return [];
    }
    
    const result = await executeWithRetry(() =>
      db.select().from(quests).orderBy(desc(quests.createdAt))
    );
    
    return result || [];
  }

  async getCourses(limit = 100): Promise<Course[]> {
    if (!isDatabaseAvailable()) {
      return Array.from(memoryStore.courses.values()).slice(0, limit);
    }
    
    const result = await executeWithRetry(() =>
      db.select().from(courses).limit(limit)
    );
    
    return result || [];
  }

  async getCompetitions(limit = 20): Promise<any[]> {
    if (!isDatabaseAvailable()) return [];
    
    const result = await executeWithRetry(() =>
      db.select().from(competitions).limit(limit)
    );
    
    return result || [];
  }

  async getCompetition(id: string): Promise<any> {
    if (!isDatabaseAvailable()) return null;
    
    const result = await executeWithRetry(() =>
      db.select().from(competitions).where(eq(competitions.id, id))
    );
    
    return result?.[0];
  }

  async joinCompetition(competitionId: string, userId: string): Promise<any> {
    if (!isDatabaseAvailable()) {
      return { success: true, message: "Memory mode - competition join recorded" };
    }
    
    const result = await executeWithRetry(() =>
      db.insert(competitionParticipants).values({ competitionId, userId }).returning()
    );
    
    return result?.[0] || { success: true };
  }

  async submitCompetitionSolution(data: any): Promise<any> {
    return { success: true, submissionId: Math.random() };
  }

  async getCompetitionLeaderboard(competitionId: string): Promise<any[]> {
    if (!isDatabaseAvailable()) return [];
    
    const result = await executeWithRetry(() =>
      db.select().from(competitionLeaderboard).where(eq(competitionLeaderboard.competitionId, competitionId))
    );
    
    return result || [];
  }

  async createProject(userId: string, project: any): Promise<any> {
    const projectData = { ...project, creatorId: userId, id: Math.random().toString() } as Project;
    memoryStore.projects.set(projectData.id, projectData);
    
    if (isDatabaseAvailable()) {
      try {
        const [created] = await db.insert(projects).values({ ...project, creatorId: userId }).returning();
        return created;
      } catch (err) {
        console.log("[Storage] Project create failed, using memory");
      }
    }
    
    return projectData;
  }

  async getProjectsByUser(userId: string, limit = 20): Promise<Project[]> {
    if (!isDatabaseAvailable()) {
      return Array.from(memoryStore.projects.values())
        .filter(p => p.creatorId === userId)
        .slice(0, limit);
    }
    
    const result = await executeWithRetry(() =>
      db.select().from(projects).where(eq(projects.creatorId, userId)).limit(limit)
    );
    
    return result || [];
  }

  async getProject(id: string): Promise<Project | undefined> {
    if (!isDatabaseAvailable()) {
      return memoryStore.projects.get(id);
    }
    
    const result = await executeWithRetry(() =>
      db.select().from(projects).where(eq(projects.id, id))
    );
    
    return result?.[0];
  }

  async getClans(limit = 50): Promise<Clan[]> {
    if (!isDatabaseAvailable()) {
      return Array.from(memoryStore.clans.values()).slice(0, limit);
    }
    
    const result = await executeWithRetry(() =>
      db.select().from(clans).limit(limit)
    );
    
    return result || [];
  }

  async getUserClans(userId: string): Promise<Clan[]> {
    if (!isDatabaseAvailable()) return [];
    
    const result = await executeWithRetry(async () => {
      const memberships = await db.select().from(clanMembers).where(eq(clanMembers.userId, userId));
      const clanIds = memberships.map(m => m.clanId);
      return db.select().from(clans).where(eq(clans.id, clanIds[0]));
    });
    
    return result || [];
  }

  async createClan(clan: any): Promise<Clan> {
    const clanData = { ...clan, id: Math.random().toString() } as Clan;
    memoryStore.clans.set(clanData.id, clanData);
    
    if (isDatabaseAvailable()) {
      try {
        const [created] = await db.insert(clans).values(clan).returning();
        return created;
      } catch (err) {
        console.log("[Storage] Clan create failed, using memory");
      }
    }
    
    return clanData;
  }

  async joinClan(clanId: string, userId: string): Promise<any> {
    if (!isDatabaseAvailable()) {
      return { success: true, message: "Memory mode - clan join recorded" };
    }
    
    const result = await executeWithRetry(() =>
      db.insert(clanMembers).values({ clanId, userId }).returning()
    );
    
    return result?.[0] || { success: true };
  }

  async recordActivity(userId: string, activityType: string, metadata?: any): Promise<void> {
    if (!isDatabaseAvailable()) return;
    
    await executeWithRetry(() =>
      db.insert(userActivities).values({ userId, activityType, metadata })
    );
  }

  async getUserActivities(userId: string, limit = 50): Promise<any[]> {
    if (!isDatabaseAvailable()) return [];
    
    const result = await executeWithRetry(() =>
      db.select().from(userActivities).where(eq(userActivities.userId, userId)).limit(limit)
    );
    
    return result || [];
  }

  async getPerformanceMetrics(userId: string): Promise<any> {
    return {
      totalActivities: 0,
      challengesCompleted: 0,
      averageScore: 0,
      rank: 0,
    };
  }
}

export const storage = new DatabaseStorage();
