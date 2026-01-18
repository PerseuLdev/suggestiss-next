/**
 * Region Detector Service
 *
 * Detects the current region based on multiple sources (priority order):
 * 1. Query parameter (?region=US) - for testing/debugging
 * 2. localStorage (user preference from LanguageSelector)
 * 3. URL pathname (/en-us, /pt-br)
 * 4. Hostname/subdomain (us.suggestiss.com, br.suggestiss.com)
 * 5. Default fallback (BR)
 *
 * Integrates with:
 * - config/regions.ts
 * - components/LanguageSelector.tsx (preferredRegion)
 */

import {
  RegionConfig,
  getRegionByLocale,
  REGIONS,
  isRegionActive,
} from '../config/regions';

/**
 * Detect current region from all available sources
 * @returns RegionConfig
 */
export function detectRegion(): RegionConfig {
  console.log('[RegionDetector] Starting region detection...');

  // 1. Check query parameter (highest priority - for testing)
  const regionFromQuery = detectFromQueryParam();
  if (regionFromQuery) {
    console.log('[RegionDetector] ✅ Detected from query param:', regionFromQuery.code);
    return regionFromQuery;
  }

  // 2. Check URL pathname (/en-us, /pt-br) - explicit user choice in URL
  const regionFromPath = detectFromPathname();
  if (regionFromPath) {
    console.log('[RegionDetector] ✅ Detected from pathname:', regionFromPath.code);
    return regionFromPath;
  }

  // 3. Check localStorage (user preference) - Option 1: User choice takes priority
  const regionFromStorage = detectFromLocalStorage();
  if (regionFromStorage) {
    console.log('[RegionDetector] ✅ Detected from localStorage (user preference):', regionFromStorage.code);
    return regionFromStorage;
  }

  // 4. Fallback to hostname/subdomain (domain default)
  // .com.br → BR, .com → US
  const regionFromHostname = detectFromHostname();
  if (regionFromHostname) {
    console.log('[RegionDetector] ✅ Detected from hostname (domain default):', regionFromHostname.code);
    return regionFromHostname;
  }

  // 5. Final fallback
  console.log('[RegionDetector] ⚠️ Using default fallback: US');
  return REGIONS.US;
}

/**
 * Detect region from query parameter
 * Example: ?region=US
 */
function detectFromQueryParam(): RegionConfig | null {
  if (typeof window === 'undefined') return null;

  try {
    const params = new URLSearchParams(window.location.search);
    const regionParam = params.get('region');

    if (regionParam) {
      const code = regionParam.toUpperCase();
      if (REGIONS[code]) {
        return REGIONS[code];
      }
    }
  } catch (error) {
    console.error('[RegionDetector] Error reading query param:', error);
  }

  return null;
}

/**
 * Detect region from localStorage
 * Key: 'preferredRegion' (set by LanguageSelector)
 */
function detectFromLocalStorage(): RegionConfig | null {
  if (typeof window === 'undefined') return null;

  try {
    const saved = localStorage.getItem('preferredRegion');

    if (saved) {
      const code = saved.toUpperCase();
      if (REGIONS[code] && isRegionActive(code)) {
        return REGIONS[code];
      }
    }
  } catch (error) {
    console.error('[RegionDetector] Error reading localStorage:', error);
  }

  return null;
}

/**
 * Detect region from URL pathname
 * Examples: /pt-br, /en-us, /es-es
 */
function detectFromPathname(): RegionConfig | null {
  if (typeof window === 'undefined') return null;

  try {
    const pathname = window.location.pathname;

    // Extract locale from path (e.g., /pt-br/... -> pt-br)
    const match = pathname.match(/^\/(pt-br|en-us|es-es|en-gb|de-de)(\/|$)/i);

    if (match) {
      const locale = match[1];
      const region = getRegionByLocale(locale);

      // Only return if it's an active region
      if (isRegionActive(region.code)) {
        return region;
      }
    }
  } catch (error) {
    console.error('[RegionDetector] Error reading pathname:', error);
  }

  return null;
}

/**
 * Detect region from hostname/subdomain
 * Examples:
 * - br.suggestiss.com -> BR
 * - us.suggestiss.com -> US
 * - suggestiss.com.br -> BR
 * - suggestiss.com -> US (default for .com)
 */
function detectFromHostname(): RegionConfig | null {
  if (typeof window === 'undefined') return null;

  try {
    const hostname = window.location.hostname;

    // Check for country-specific TLD (.com.br)
    if (hostname.includes('.com.br')) {
      return REGIONS.BR;
    }

    // Check for subdomain (us.suggestiss.com)
    const parts = hostname.split('.');
    if (parts.length >= 2) {
      const subdomain = parts[0].toUpperCase();

      if (REGIONS[subdomain] && isRegionActive(subdomain)) {
        return REGIONS[subdomain];
      }
    }

    // .com without subdomain -> default to US
    if (hostname.includes('suggestiss.com') && !hostname.includes('.com.br')) {
      return REGIONS.US;
    }
  } catch (error) {
    console.error('[RegionDetector] Error reading hostname:', error);
  }

  return null;
}

/**
 * Save region preference to localStorage
 * @param regionCode - Region code (BR, US, ES, etc)
 */
export function saveRegionPreference(regionCode: string): void {
  if (typeof window === 'undefined') return;

  try {
    const code = regionCode.toUpperCase();
    if (REGIONS[code]) {
      localStorage.setItem('preferredRegion', code);
      console.log('[RegionDetector] Saved region preference:', code);
    }
  } catch (error) {
    console.error('[RegionDetector] Error saving region preference:', error);
  }
}

/**
 * Get saved region preference from localStorage
 * @returns Region code or null
 */
export function getSavedRegionPreference(): string | null {
  if (typeof window === 'undefined') return null;

  try {
    return localStorage.getItem('preferredRegion');
  } catch (error) {
    console.error('[RegionDetector] Error getting saved preference:', error);
    return null;
  }
}

/**
 * Clear saved region preference
 */
export function clearRegionPreference(): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem('preferredRegion');
    console.log('[RegionDetector] Cleared region preference');
  } catch (error) {
    console.error('[RegionDetector] Error clearing preference:', error);
  }
}

/**
 * Detect region code (shorthand)
 * @returns Region code (BR, US, ES, etc)
 */
export function detectRegionCode(): string {
  return detectRegion().code;
}
