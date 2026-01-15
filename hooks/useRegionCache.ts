/**
 * Region Cache Hook
 *
 * Convenient hook that combines region and cache functionality
 *
 * Features:
 * - Get/set cached data with automatic region namespacing
 * - Invalidate cache on region change
 * - Type-safe caching
 *
 * Usage:
 * ```typescript
 * import { useRegionCache } from './hooks/useRegionCache';
 *
 * function ProductList() {
 *   const { region, getCached, setCached, invalidateCache } = useRegionCache();
 *
 *   // Get cached products
 *   const cached = getCached<Product[]>('tech_products');
 *
 *   // Set cached products
 *   setCached('tech_products', products, { ttl: 600000 });
 *
 *   // Invalidate on region change
 *   useEffect(() => {
 *     invalidateCache('tech_products');
 *   }, [region.code]);
 * }
 * ```
 */

import { useRegion } from '../contexts/RegionContext';
import { RegionConfig } from '../config/regions';
import { CacheOptions } from '../services/cacheService';

export interface UseRegionCacheReturn {
  /** Current region config */
  region: RegionConfig;

  /** Get cached data */
  getCached: <T>(key: string, version?: string) => T | null;

  /** Set cached data */
  setCached: <T>(key: string, data: T, options?: CacheOptions) => void;

  /** Invalidate specific cache entry */
  invalidateCache: (key: string, version?: string) => void;

  /** Clear all cache for current region */
  clearRegionCache: () => void;

  /** Change current region */
  changeRegion: (code: string) => void;

  /** Check if cache has specific key */
  hasCache: (key: string, version?: string) => boolean;

  /** Get cache statistics */
  getCacheStats: () => {
    region: string;
    totalEntries: number;
    entries: { key: string; age: number; sizeKB: number }[];
  };
}

/**
 * Hook for region-aware caching
 */
export function useRegionCache(): UseRegionCacheReturn {
  const { region, cache, changeRegion } = useRegion();

  /**
   * Get cached data for current region
   */
  const getCached = <T>(key: string, version?: string): T | null => {
    return cache.get<T>(key, version);
  };

  /**
   * Set cached data for current region
   */
  const setCached = <T>(key: string, data: T, options?: CacheOptions): void => {
    cache.set(key, data, options);
  };

  /**
   * Invalidate specific cache entry
   */
  const invalidateCache = (key: string, version?: string): void => {
    cache.invalidate(key, version);
  };

  /**
   * Clear all cache for current region
   */
  const clearRegionCache = (): void => {
    cache.clearRegion();
  };

  /**
   * Check if cache has specific key
   */
  const hasCache = (key: string, version?: string): boolean => {
    return cache.has(key, version);
  };

  /**
   * Get cache statistics
   */
  const getCacheStats = () => {
    return cache.getStats();
  };

  return {
    region,
    getCached,
    setCached,
    invalidateCache,
    clearRegionCache,
    changeRegion,
    hasCache,
    getCacheStats,
  };
}

/**
 * Hook to cache products with automatic invalidation on region change
 *
 * Usage:
 * ```typescript
 * const { products, setProducts, isLoading } = useProductCache('tech');
 * ```
 */
export function useProductCache(niche: string) {
  const { region, getCached, setCached } = useRegionCache();
  const cacheKey = `${niche}_products`;

  /**
   * Get cached products
   */
  const getCachedProducts = <T>(): T | null => {
    return getCached<T>(cacheKey);
  };

  /**
   * Set cached products
   */
  const setCachedProducts = <T>(products: T): void => {
    // Cache for 10 minutes
    setCached(cacheKey, products, { ttl: 10 * 60 * 1000 });
  };

  return {
    region,
    getCachedProducts,
    setCachedProducts,
    cacheKey,
  };
}

/**
 * Hook to cache gift suggestions
 */
export function useGiftCache(identifier: string) {
  const { region, getCached, setCached } = useRegionCache();
  const cacheKey = `gift_${identifier}`;

  /**
   * Get cached gifts
   */
  const getCachedGifts = <T>(): T | null => {
    return getCached<T>(cacheKey);
  };

  /**
   * Set cached gifts
   */
  const setCachedGifts = <T>(gifts: T): void => {
    // Cache for 5 minutes (shorter TTL for personalized results)
    setCached(cacheKey, gifts, { ttl: 5 * 60 * 1000 });
  };

  return {
    region,
    getCachedGifts,
    setCachedGifts,
    cacheKey,
  };
}
