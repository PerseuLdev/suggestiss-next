/**
 * Cache Service
 *
 * Architecture Pattern: Service Layer with Namespacing (Shopify/Stripe pattern)
 *
 * Features:
 * - Automatic region-based namespacing (BR_tech_products vs US_tech_products)
 * - TTL (Time To Live) support
 * - Cache versioning (v1_BR_products for easy migration)
 * - Type-safe with TypeScript
 * - Centralized debug logging
 */

export interface CacheOptions {
  ttl?: number;        // Time to live in milliseconds (default: 10 minutes)
  version?: string;    // Cache version (default: 'v1')
}

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
  version: string;
}

/**
 * Cache Service Class
 *
 * Usage:
 * ```typescript
 * const cache = new CacheService('BR');
 * cache.set('tech_products', products, { ttl: 600000 }); // 10 min
 * const cached = cache.get('tech_products');
 * ```
 */
export class CacheService {
  private region: string;
  private defaultTTL: number = 10 * 60 * 1000; // 10 minutes
  private defaultVersion: string = 'v1';

  constructor(region: string) {
    this.region = region.toUpperCase();
    console.log(`[CacheService] Initialized for region: ${this.region}`);
  }

  /**
   * Generate namespaced cache key
   * @param key - Base key (e.g., 'tech_products')
   * @param version - Cache version
   * @returns Namespaced key (e.g., 'v1_BR_tech_products')
   */
  private getNamespacedKey(key: string, version: string = this.defaultVersion): string {
    return `${version}_${this.region}_${key}`;
  }

  /**
   * Get item from cache
   * @param key - Cache key
   * @param version - Cache version (optional)
   * @returns Cached data or null if expired/not found
   */
  get<T>(key: string, version?: string): T | null {
    const namespacedKey = this.getNamespacedKey(key, version);

    try {
      const item = localStorage.getItem(namespacedKey);

      if (!item) {
        console.log(`[CacheService] Cache MISS: ${namespacedKey}`);
        return null;
      }

      const entry: CacheEntry<T> = JSON.parse(item);
      const now = Date.now();
      const age = now - entry.timestamp;

      // Check if expired
      if (age > entry.ttl) {
        console.log(`[CacheService] Cache EXPIRED: ${namespacedKey} (age: ${Math.round(age / 1000)}s, ttl: ${entry.ttl / 1000}s)`);
        this.invalidate(key, version);
        return null;
      }

      console.log(`[CacheService] Cache HIT: ${namespacedKey} (age: ${Math.round(age / 1000)}s)`);
      return entry.data;
    } catch (error) {
      console.error(`[CacheService] Error reading cache ${namespacedKey}:`, error);
      return null;
    }
  }

  /**
   * Set item in cache
   * @param key - Cache key
   * @param data - Data to cache
   * @param options - Cache options (ttl, version)
   */
  set<T>(key: string, data: T, options: CacheOptions = {}): void {
    const { ttl = this.defaultTTL, version = this.defaultVersion } = options;
    const namespacedKey = this.getNamespacedKey(key, version);

    try {
      const entry: CacheEntry<T> = {
        data,
        timestamp: Date.now(),
        ttl,
        version,
      };

      localStorage.setItem(namespacedKey, JSON.stringify(entry));
      console.log(`[CacheService] Cache SET: ${namespacedKey} (ttl: ${ttl / 1000}s)`);
    } catch (error) {
      console.error(`[CacheService] Error setting cache ${namespacedKey}:`, error);
    }
  }

  /**
   * Invalidate (delete) specific cache entry
   * @param key - Cache key
   * @param version - Cache version (optional)
   */
  invalidate(key: string, version?: string): void {
    const namespacedKey = this.getNamespacedKey(key, version);

    try {
      localStorage.removeItem(namespacedKey);
      console.log(`[CacheService] Cache INVALIDATED: ${namespacedKey}`);
    } catch (error) {
      console.error(`[CacheService] Error invalidating cache ${namespacedKey}:`, error);
    }
  }

  /**
   * Clear all cache entries for this region
   */
  clearRegion(): void {
    try {
      const keysToRemove: string[] = [];

      // Find all keys for this region
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.includes(`_${this.region}_`)) {
          keysToRemove.push(key);
        }
      }

      // Remove all region keys
      keysToRemove.forEach(key => localStorage.removeItem(key));

      console.log(`[CacheService] Cleared ${keysToRemove.length} cache entries for region: ${this.region}`);
    } catch (error) {
      console.error(`[CacheService] Error clearing region cache:`, error);
    }
  }

  /**
   * Clear ALL cache entries (all regions, all versions)
   * Use with caution!
   */
  clearAll(): void {
    try {
      const keysToRemove: string[] = [];

      // Find all cache keys (versioned keys)
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        // Match pattern: v{number}_{REGION}_{key}
        if (key && /^v\d+_[A-Z]{2}_/.test(key)) {
          keysToRemove.push(key);
        }
      }

      // Remove all cache keys
      keysToRemove.forEach(key => localStorage.removeItem(key));

      console.log(`[CacheService] Cleared ALL cache entries (${keysToRemove.length} items)`);
    } catch (error) {
      console.error(`[CacheService] Error clearing all cache:`, error);
    }
  }

  /**
   * Get cache statistics for debugging
   */
  getStats(): {
    region: string;
    totalEntries: number;
    entries: { key: string; age: number; sizeKB: number }[];
  } {
    const entries: { key: string; age: number; sizeKB: number }[] = [];
    const now = Date.now();

    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.includes(`_${this.region}_`)) {
          const item = localStorage.getItem(key);
          if (item) {
            const entry: CacheEntry<unknown> = JSON.parse(item);
            const age = Math.round((now - entry.timestamp) / 1000); // seconds
            const sizeKB = Math.round((new Blob([item]).size) / 1024);

            entries.push({ key, age, sizeKB });
          }
        }
      }
    } catch (error) {
      console.error('[CacheService] Error getting stats:', error);
    }

    return {
      region: this.region,
      totalEntries: entries.length,
      entries,
    };
  }

  /**
   * Check if a key exists in cache (regardless of expiration)
   * @param key - Cache key
   * @param version - Cache version (optional)
   */
  has(key: string, version?: string): boolean {
    const namespacedKey = this.getNamespacedKey(key, version);
    return localStorage.getItem(namespacedKey) !== null;
  }
}

// ============================================================================
// GLOBAL CACHE UTILITIES
// ============================================================================

/**
 * Create cache service for a specific region
 * @param region - Region code (BR, US, ES, etc)
 */
export function createCacheService(region: string): CacheService {
  return new CacheService(region);
}

/**
 * Clear expired cache entries across all regions
 * Useful for periodic cleanup
 */
export function clearExpiredCache(): void {
  const now = Date.now();
  let clearedCount = 0;

  try {
    const keysToRemove: string[] = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && /^v\d+_[A-Z]{2}_/.test(key)) {
        const item = localStorage.getItem(key);
        if (item) {
          try {
            const entry: CacheEntry<unknown> = JSON.parse(item);
            const age = now - entry.timestamp;

            if (age > entry.ttl) {
              keysToRemove.push(key);
            }
          } catch {
            // Invalid entry, remove it
            keysToRemove.push(key);
          }
        }
      }
    }

    keysToRemove.forEach(key => {
      localStorage.removeItem(key);
      clearedCount++;
    });

    if (clearedCount > 0) {
      console.log(`[CacheService] Cleared ${clearedCount} expired cache entries`);
    }
  } catch (error) {
    console.error('[CacheService] Error clearing expired cache:', error);
  }
}
