import { Country, Locale } from '../locales/types';

/**
 * Geolocation Service
 * Detects user's country using IP-based geolocation API
 */

interface GeolocationResponse {
  country_code: string;
  country_name: string;
}

// Map country codes to our Country type
const COUNTRY_CODE_MAP: Record<string, Country> = {
  'BR': 'BR',
  'US': 'US',
  'ES': 'ES',
  'GB': 'UK',
  'UK': 'UK',
  'DE': 'DE'
};

// Map country to default locale
const COUNTRY_TO_LOCALE: Record<Country, Locale> = {
  'BR': 'pt-BR',
  'US': 'en-US',
  'ES': 'es-ES',
  'UK': 'en-GB',
  'DE': 'de-DE'
};

/**
 * Detect user's country using IP geolocation
 * Uses ipapi.co free tier (no API key required, 1000 requests/day)
 * Falls back gracefully if service is unavailable
 */
export const detectCountryByIP = async (): Promise<Country | null> => {
  try {
    // Check cache first (valid for 24 hours)
    const cached = getCachedGeolocation();
    if (cached) {
      console.log('[Geolocation] Using cached country:', cached);
      return cached;
    }

    // Call free geolocation API
    const response = await fetch('https://ipapi.co/json/', {
      signal: AbortSignal.timeout(3000) // 3s timeout
    });

    if (!response.ok) {
      console.warn('[Geolocation] API request failed:', response.status);
      return null;
    }

    const data: GeolocationResponse = await response.json();
    const countryCode = data.country_code?.toUpperCase();

    if (!countryCode) {
      console.warn('[Geolocation] No country code in response');
      return null;
    }

    // Map to our Country type
    const country = COUNTRY_CODE_MAP[countryCode] || null;

    if (country) {
      console.log('[Geolocation] Detected country:', country, 'from IP');
      cacheGeolocation(country);
      return country;
    }

    console.log('[Geolocation] Country not supported:', countryCode);
    return null;

  } catch (error) {
    console.warn('[Geolocation] Detection failed:', error);
    return null;
  }
};

/**
 * Get suggested locale based on IP geolocation
 */
export const detectLocaleByIP = async (): Promise<Locale | null> => {
  const country = await detectCountryByIP();
  if (!country) return null;

  return COUNTRY_TO_LOCALE[country];
};

/**
 * Cache geolocation result for 24 hours
 */
const cacheGeolocation = (country: Country): void => {
  try {
    const cache = {
      country,
      timestamp: Date.now()
    };
    localStorage.setItem('geolocation_cache', JSON.stringify(cache));
  } catch (error) {
    console.warn('[Geolocation] Failed to cache:', error);
  }
};

/**
 * Get cached geolocation if valid (< 24 hours old)
 */
const getCachedGeolocation = (): Country | null => {
  try {
    const cached = localStorage.getItem('geolocation_cache');
    if (!cached) return null;

    const { country, timestamp } = JSON.parse(cached);
    const age = Date.now() - timestamp;
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours

    if (age < maxAge) {
      return country;
    }

    // Cache expired
    localStorage.removeItem('geolocation_cache');
    return null;

  } catch (error) {
    console.warn('[Geolocation] Failed to read cache:', error);
    return null;
  }
};

/**
 * Clear geolocation cache (useful for testing)
 */
export const clearGeolocationCache = (): void => {
  localStorage.removeItem('geolocation_cache');
  console.log('[Geolocation] Cache cleared');
};
