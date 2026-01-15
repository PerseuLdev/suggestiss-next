/**
 * Region Context
 *
 * Provides global access to:
 * - Current region configuration
 * - Region-specific cache service
 * - Region change handler
 *
 * Usage:
 * ```typescript
 * import { useRegion } from './contexts/RegionContext';
 *
 * function MyComponent() {
 *   const { region, cache, changeRegion } = useRegion();
 *
 *   // Use region config
 *   console.log(region.amazonDomain); // amazon.com.br
 *
 *   // Use cache
 *   cache.set('products', data);
 *   const cached = cache.get('products');
 *
 *   // Change region
 *   changeRegion('US');
 * }
 * ```
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { RegionConfig } from '../config/regions';
import { detectRegion, saveRegionPreference } from '../services/regionDetector';
import { CacheService, createCacheService } from '../services/cacheService';

// ============================================================================
// CONTEXT INTERFACE
// ============================================================================

export interface RegionContextValue {
  /** Current region configuration */
  region: RegionConfig;

  /** Cache service for current region */
  cache: CacheService;

  /** Change current region */
  changeRegion: (code: string) => void;

  /** Check if region is loading */
  isLoading: boolean;
}

// ============================================================================
// CONTEXT CREATION
// ============================================================================

const RegionContext = createContext<RegionContextValue | undefined>(undefined);

// ============================================================================
// PROVIDER COMPONENT
// ============================================================================

export interface RegionProviderProps {
  children: ReactNode;
}

export const RegionProvider: React.FC<RegionProviderProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [region, setRegion] = useState<RegionConfig>(() => detectRegion());
  const [cache, setCache] = useState<CacheService>(() => createCacheService(region.code));

  // Initialize region on mount
  useEffect(() => {
    const detectedRegion = detectRegion();
    setRegion(detectedRegion);
    setCache(createCacheService(detectedRegion.code));
    setIsLoading(false);

    console.log('[RegionContext] Initialized with region:', detectedRegion.code);
  }, []);

  /**
   * Change current region
   * - Updates region state
   * - Creates new cache service
   * - Saves preference to localStorage
   * - Clears old region cache
   */
  const changeRegion = (code: string) => {
    console.log('[RegionContext] Changing region to:', code);

    // Clear old region cache before switching
    cache.clearRegion();

    // Update region
    const newRegionConfig = detectRegion(); // Re-detect with new preference
    setRegion(newRegionConfig);

    // Create new cache service
    const newCache = createCacheService(code);
    setCache(newCache);

    // Save preference
    saveRegionPreference(code);

    console.log('[RegionContext] Region changed successfully to:', code);
  };

  const value: RegionContextValue = {
    region,
    cache,
    changeRegion,
    isLoading,
  };

  return (
    <RegionContext.Provider value={value}>
      {children}
    </RegionContext.Provider>
  );
};

// ============================================================================
// HOOK
// ============================================================================

/**
 * Hook to access region context
 *
 * @throws Error if used outside RegionProvider
 */
export function useRegion(): RegionContextValue {
  const context = useContext(RegionContext);

  if (context === undefined) {
    throw new Error('useRegion must be used within RegionProvider');
  }

  return context;
}

// ============================================================================
// UTILITY HOOKS
// ============================================================================

/**
 * Hook to get just the region config (lighter than useRegion)
 */
export function useRegionConfig(): RegionConfig {
  const { region } = useRegion();
  return region;
}

/**
 * Hook to get just the cache service (lighter than useRegion)
 */
export function useRegionCacheService(): CacheService {
  const { cache } = useRegion();
  return cache;
}

/**
 * Hook to check if specific region is active
 */
export function useIsRegion(code: string): boolean {
  const { region } = useRegion();
  return region.code === code.toUpperCase();
}
