import memoizee from "memoizee";

// In-memory cache for expensive database queries
// Supports 20k+ concurrent users with aggressive TTL-based invalidation

class CacheManager {
  // Cache expensive queries with 5-minute TTL
  private cachedArenas = memoizee(
    async () => {
      const { storage } = await import("./storage");
      return storage.getArenas();
    },
    { maxAge: 5 * 60 * 1000, promise: true }
  );

  private cachedChallenges = memoizee(
    async () => {
      const { storage } = await import("./storage");
      return storage.getChallenges();
    },
    { maxAge: 5 * 60 * 1000, promise: true }
  );

  private cachedQuests = memoizee(
    async () => {
      const { storage } = await import("./storage");
      return storage.getQuests();
    },
    { maxAge: 5 * 60 * 1000, promise: true }
  );

  // Leaderboard cache - 10 minute TTL for better scalability
  private leaderboardCache = new Map<string, { data: any; expiry: number }>();
  private readonly LEADERBOARD_TTL = 10 * 60 * 1000; // 10 minutes

  async getArenas() {
    return this.cachedArenas();
  }

  async getChallenges() {
    return this.cachedChallenges();
  }

  async getQuests() {
    return this.cachedQuests();
  }

  async getLeaderboard(category: string, period: string = "week") {
    const cacheKey = `${category}:${period}`;
    const cached = this.leaderboardCache.get(cacheKey);
    const now = Date.now();

    if (cached && cached.expiry > now) {
      return cached.data;
    }

    const { storage } = await import("./storage");
    const data = await storage.getLeaderboard(category, period, 100);
    this.leaderboardCache.set(cacheKey, { data, expiry: now + this.LEADERBOARD_TTL });
    return data;
  }

  // Clear caches on updates
  clearArenaCache() {
    this.cachedArenas.clear?.();
  }

  clearChallengeCache() {
    this.cachedChallenges.clear?.();
  }

  clearQuestCache() {
    this.cachedQuests.clear?.();
  }

  clearLeaderboardCache() {
    this.leaderboardCache.clear();
  }
}

export const cacheManager = new CacheManager();
