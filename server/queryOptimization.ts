/**
 * Query optimization utilities for high-performance database access
 * Optimized for 20k+ concurrent users with proper caching and batching
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

class QueryCache {
  private cache = new Map<string, CacheEntry<any>>();
  private accessCount = new Map<string, number>();

  /**
   * Get cached data or execute query function
   * @param key - Cache key
   * @param ttl - Time to live in milliseconds (default: 5 minutes)
   * @param queryFn - Function to execute if cache miss
   */
  async get<T>(key: string, ttl: number = 300000, queryFn: () => Promise<T>): Promise<T> {
    const cached = this.cache.get(key);
    const now = Date.now();

    // Return cached data if still valid
    if (cached && now - cached.timestamp < cached.ttl) {
      this.accessCount.set(key, (this.accessCount.get(key) ?? 0) + 1);
      return cached.data;
    }

    // Cache miss - execute query
    const data = await queryFn();
    this.cache.set(key, { data, timestamp: now, ttl });
    this.accessCount.set(key, 1);

    return data;
  }

  /**
   * Invalidate a cache entry
   */
  invalidate(key: string): void {
    this.cache.delete(key);
    this.accessCount.delete(key);
  }

  /**
   * Invalidate multiple cache entries by pattern
   */
  invalidatePattern(pattern: string | RegExp): void {
    const regex = typeof pattern === "string" ? new RegExp(pattern) : pattern;
    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        this.invalidate(key);
      }
    }
  }

  /**
   * Get cache statistics for monitoring
   */
  getStats() {
    const entries = Array.from(this.accessCount.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

    return {
      totalKeys: this.cache.size,
      topAccessed: entries,
      memoryUsage: this.estimateMemory(),
    };
  }

  /**
   * Estimate memory usage (rough estimate in bytes)
   */
  private estimateMemory(): number {
    let total = 0;
    for (const entry of this.cache.values()) {
      total += JSON.stringify(entry.data).length;
    }
    return total;
  }

  /**
   * Clear all cache entries
   */
  clear(): void {
    this.cache.clear();
    this.accessCount.clear();
  }
}

// Export singleton instance
export const queryCache = new QueryCache();

/**
 * Batch query requests to reduce database round trips
 */
export class QueryBatcher {
  private pending = new Map<string, Promise<any>>();
  private queue: Array<{ key: string; resolve: Function; reject: Function }> = [];

  async batch<T>(key: string, queryFn: () => Promise<T>): Promise<T> {
    // If already pending, wait for existing request
    if (this.pending.has(key)) {
      return this.pending.get(key);
    }

    // Create new request
    const promise = queryFn();
    this.pending.set(key, promise);

    // Clean up after completion
    promise.finally(() => {
      this.pending.delete(key);
    });

    return promise;
  }
}

// Export singleton batcher
export const queryBatcher = new QueryBatcher();
