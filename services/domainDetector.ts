import { LanguageConfig, AmazonConfig, Locale, Country, LegacyLanguageConfig } from '../locales/types';

// ========================================
// LANGUAGE CONFIGS (UI Text Only)
// ========================================
const LANGUAGE_CONFIGS: Record<Locale, LanguageConfig> = {
  'pt-BR': {
    locale: 'pt-BR',
    currency: 'BRL'
  },
  'en-US': {
    locale: 'en-US',
    currency: 'USD'
  },
  'es-ES': {
    locale: 'es-ES',
    currency: 'EUR'
  },
  'en-GB': {
    locale: 'en-GB',
    currency: 'GBP'
  },
  'de-DE': {
    locale: 'de-DE',
    currency: 'EUR'
  }
};

// ========================================
// AMAZON CONFIGS (Delivery Country)
// ACTIVE AFFILIATE CODES: BR and US only (as of 2025-12-28)
// ========================================
const AMAZON_CONFIGS: Record<Country, AmazonConfig> = {
  'BR': {
    country: 'BR',
    amazonDomain: 'amazon.com.br',
    affiliateTag: 'suggestissBR-20', // ✅ ACTIVE
    currency: 'BRL'
  },
  'US': {
    country: 'US',
    amazonDomain: 'amazon.com',
    affiliateTag: 'suggestissus-20', // ✅ ACTIVE
    currency: 'USD'
  },
  'ES': {
    country: 'ES',
    amazonDomain: 'amazon.es',
    affiliateTag: 'suggestisses-20', // ⚠️ PLACEHOLDER - Update when registered
    currency: 'EUR'
  },
  'UK': {
    country: 'UK',
    amazonDomain: 'amazon.co.uk',
    affiliateTag: 'suggestissuk-20', // ⚠️ PLACEHOLDER - Update when registered
    currency: 'GBP'
  },
  'DE': {
    country: 'DE',
    amazonDomain: 'amazon.de',
    affiliateTag: 'suggestissde-20', // ⚠️ PLACEHOLDER - Update when registered
    currency: 'EUR'
  }
};

// ========================================
// LOCALE TO COUNTRY MAPPING (Default)
// ========================================
const LOCALE_TO_COUNTRY: Record<Locale, Country> = {
  'pt-BR': 'BR',
  'en-US': 'US',
  'es-ES': 'ES',
  'en-GB': 'UK',
  'de-DE': 'DE'
};

// ========================================
// DETECTION FUNCTIONS
// ========================================

/**
 * Detect UI language from domain/localStorage
 * Priority:
 * 1. Domain (HIGHEST - .com = EN, .br = PT-BR)
 * 2. Path routing (/pt-br, /en-us)
 * 3. Query param (?lang=en)
 * 4. Geolocation (will be checked in LanguageContext)
 * 5. Fallback (localhost = pt-BR)
 */
export const detectLanguage = (): Locale => {
  if (typeof window === 'undefined') return 'pt-BR';

  // 1. Check user preference FIRST (HIGHEST)
  const savedLocale = localStorage.getItem('locale') as Locale;
  const validLocales: Locale[] = ['pt-BR', 'en-US', 'es-ES', 'en-GB', 'de-DE'];
  if (savedLocale && validLocales.includes(savedLocale)) {
    console.log('[detectLanguage] Using saved user preference:', savedLocale);
    return savedLocale;
  }

  const pathname = window.location.pathname;
  const hostname = window.location.hostname;

  // 2. Check hostname SECOND
  // Domain determines default language if no preference is saved
  if (hostname.endsWith('.br')) {
    console.log('[detectLanguage] Domain .br → pt-BR');
    return 'pt-BR';
  }
  if (hostname.endsWith('.es')) {
    console.log('[detectLanguage] Domain .es → es-ES');
    return 'es-ES';
  }
  if (hostname.endsWith('.co.uk')) {
    console.log('[detectLanguage] Domain .co.uk → en-GB');
    return 'en-GB';
  }
  if (hostname.endsWith('.de')) {
    console.log('[detectLanguage] Domain .de → de-DE');
    return 'de-DE';
  }
  if (hostname === 'suggestiss.com' || hostname === 'www.suggestiss.com') {
    console.log('[detectLanguage] Domain .com → en-US');
    return 'en-US';
  }

  // 3. Check path-based routing (e.g., /pt-br, /en-us, /es-es)
  const pathMatch = pathname.match(/^\/(pt-br|en-us|es-es|en-gb|de-de)(\/|$)/i);
  if (pathMatch) {
    const localeFromPath = pathMatch[1].toLowerCase();
    const normalized = localeFromPath.replace(/-(.)/g, (_, char) => `-${char.toUpperCase()}`);
    if (normalized in LANGUAGE_CONFIGS) {
      console.log('[detectLanguage] Using locale from path:', normalized);
      return normalized as Locale;
    }
  }

  // 4. Check query parameter (for testing: ?lang=en)
  const params = new URLSearchParams(window.location.search);
  const langParam = params.get('lang');
  if (langParam) {
    if (langParam === 'en') return 'en-US';
    if (langParam === 'pt') return 'pt-BR';
    if (langParam === 'es') return 'es-ES';
    if (langParam === 'de') return 'de-DE';
  }

  // 5. Fallback default for localhost/development
  console.log('[detectLanguage] Fallback → pt-BR (localhost)');
  return 'pt-BR';
};

/**
 * Detect delivery country from domain/localStorage
 * Priority: domain > saved preference > locale default
 */
export const detectDeliveryCountry = (): Country => {
  if (typeof window === 'undefined') return 'BR';

  // 1. Check saved preference FIRST (HIGHEST)
  const savedCountry = localStorage.getItem('preferredRegion') as Country;
  const validCountries: Country[] = ['BR', 'US', 'ES', 'UK', 'DE'];
  if (savedCountry && validCountries.includes(savedCountry)) {
    console.log('[detectDeliveryCountry] Using saved user preference:', savedCountry);
    return savedCountry;
  }

  const hostname = window.location.hostname;

  // 2. Check hostname (strongest signal)
  if (hostname.endsWith('.br')) return 'BR';
  if (hostname.endsWith('.es')) return 'ES';
  if (hostname.endsWith('.co.uk')) return 'UK';
  if (hostname.endsWith('.de')) return 'DE';
  if (hostname === 'suggestiss.com' || hostname === 'www.suggestiss.com') return 'US';

  // 3. Fallback to locale default
  const locale = detectLanguage();
  return LOCALE_TO_COUNTRY[locale];
};

// ========================================
// CONFIG GETTERS
// ========================================

export const getLanguageConfig = (locale: Locale): LanguageConfig => {
  return LANGUAGE_CONFIGS[locale] || LANGUAGE_CONFIGS['pt-BR'];
};

export const getAmazonConfig = (country: Country): AmazonConfig => {
  return AMAZON_CONFIGS[country] || AMAZON_CONFIGS['BR'];
};

export const getSupportedLocales = () => {
  return [
    { code: 'pt-BR' as Locale, name: 'Português (BR)', flag: '🇧🇷' },
    { code: 'en-US' as Locale, name: 'English (US)', flag: '🇺🇸' },
    { code: 'es-ES' as Locale, name: 'Español (ES)', flag: '🇪🇸' },
    { code: 'en-GB' as Locale, name: 'English (UK)', flag: '🇬🇧' },
    { code: 'de-DE' as Locale, name: 'Deutsch (DE)', flag: '🇩🇪' },
  ];
};

export const getSupportedCountries = () => {
  return [
    { code: 'BR' as Country, name: 'Brazil', flag: '🇧🇷', currency: 'BRL' },
    { code: 'US' as Country, name: 'United States', flag: '🇺🇸', currency: 'USD' },
    { code: 'ES' as Country, name: 'Spain', flag: '🇪🇸', currency: 'EUR' },
    { code: 'UK' as Country, name: 'United Kingdom', flag: '🇬🇧', currency: 'GBP' },
    { code: 'DE' as Country, name: 'Germany', flag: '🇩🇪', currency: 'EUR' },
  ];
};

// ========================================
// LEGACY SUPPORT (Backward Compatibility)
// ========================================

/**
 * @deprecated Use getLanguageConfig() + getAmazonConfig() instead
 * This function exists only for backward compatibility during migration
 */
export const getLegacyConfig = (locale: Locale): LegacyLanguageConfig => {
  const country = LOCALE_TO_COUNTRY[locale];
  const langConfig = getLanguageConfig(locale);
  const amazonConfig = getAmazonConfig(country);

  return {
    locale: langConfig.locale,
    amazonDomain: amazonConfig.amazonDomain,
    affiliateTag: amazonConfig.affiliateTag,
    currency: amazonConfig.currency
  };
};
