/**
 * Multi-Region Configuration
 *
 * Architecture Pattern: Region Config (similar to Shopify, Stripe)
 *
 * This file defines configuration for each supported region including:
 * - Amazon domain and affiliate tag
 * - Currency and locale
 * - Feature flags per region
 */

export interface RegionConfig {
  // Identity
  code: string;           // 'BR', 'US', 'ES', 'UK', 'DE'
  name: string;           // 'Brasil', 'United States', etc
  flag: string;           // Emoji flag

  // Amazon Integration
  amazonDomain: string;   // 'amazon.com.br', 'amazon.com', etc
  affiliateTag: string;   // 'suggestissBR-20', 'suggestissus-20', etc

  // Localization
  currency: string;       // 'BRL', 'USD', 'EUR', 'GBP'
  locale: string;         // 'pt-BR', 'en-US', 'es-ES', etc

  // Features (optional - for future use)
  features?: {
    giftConsultant: boolean;
    trending: boolean;
    deals: boolean;
  };
}

// ============================================================================
// REGION CONFIGURATIONS
// ============================================================================

/**
 * Brasil Configuration
 * Status: ✅ ACTIVE (with valid affiliate tag)
 */
export const brazilConfig: RegionConfig = {
  code: 'BR',
  name: 'Brasil',
  flag: '🇧🇷',
  amazonDomain: 'amazon.com.br',
  affiliateTag: 'suggestissBR-20',
  currency: 'BRL',
  locale: 'pt-BR',
  features: {
    giftConsultant: true,
    trending: true,
    deals: true,
  },
};

/**
 * United States Configuration
 * Status: ✅ ACTIVE (with valid affiliate tag)
 */
export const unitedStatesConfig: RegionConfig = {
  code: 'US',
  name: 'United States',
  flag: '🇺🇸',
  amazonDomain: 'amazon.com',
  affiliateTag: 'suggestissus-20',
  currency: 'USD',
  locale: 'en-US',
  features: {
    giftConsultant: true,
    trending: true,
    deals: true,
  },
};

/**
 * España Configuration
 * Status: 🔜 PLANNED (placeholder affiliate tag)
 */
export const spainConfig: RegionConfig = {
  code: 'ES',
  name: 'España',
  flag: '🇪🇸',
  amazonDomain: 'amazon.es',
  affiliateTag: 'suggestisses-20', // ⚠️ Placeholder - needs registration
  currency: 'EUR',
  locale: 'es-ES',
  features: {
    giftConsultant: true,
    trending: true,
    deals: true,
  },
};

/**
 * United Kingdom Configuration
 * Status: 🔜 PLANNED (placeholder affiliate tag)
 */
export const unitedKingdomConfig: RegionConfig = {
  code: 'UK',
  name: 'United Kingdom',
  flag: '🇬🇧',
  amazonDomain: 'amazon.co.uk',
  affiliateTag: 'suggestissuk-20', // ⚠️ Placeholder - needs registration
  currency: 'GBP',
  locale: 'en-GB',
  features: {
    giftConsultant: true,
    trending: true,
    deals: true,
  },
};

/**
 * Deutschland Configuration
 * Status: 🔜 PLANNED (placeholder affiliate tag)
 */
export const germanyConfig: RegionConfig = {
  code: 'DE',
  name: 'Deutschland',
  flag: '🇩🇪',
  amazonDomain: 'amazon.de',
  affiliateTag: 'suggestissde-20', // ⚠️ Placeholder - needs registration
  currency: 'EUR',
  locale: 'de-DE',
  features: {
    giftConsultant: true,
    trending: true,
    deals: true,
  },
};

// ============================================================================
// REGION REGISTRY
// ============================================================================

/**
 * Central registry of all regions
 */
export const REGIONS: Record<string, RegionConfig> = {
  BR: brazilConfig,
  US: unitedStatesConfig,
  ES: spainConfig,
  UK: unitedKingdomConfig,
  DE: germanyConfig,
};

/**
 * Active regions (with valid affiliate tags)
 */
export const ACTIVE_REGIONS: RegionConfig[] = [
  brazilConfig,
  unitedStatesConfig,
];

/**
 * Planned regions (placeholder affiliate tags)
 */
export const PLANNED_REGIONS: RegionConfig[] = [
  spainConfig,
  unitedKingdomConfig,
  germanyConfig,
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get region config by code
 * @param code - Region code (BR, US, ES, UK, DE)
 * @returns RegionConfig or default (Brazil)
 */
export function getRegionConfig(code: string): RegionConfig {
  return REGIONS[code.toUpperCase()] || REGIONS.BR;
}

/**
 * Get region config by Amazon domain
 * @param domain - Amazon domain (e.g., 'amazon.com.br')
 * @returns RegionConfig or default (Brazil)
 */
export function getRegionByDomain(domain: string): RegionConfig {
  const region = Object.values(REGIONS).find(r =>
    domain.includes(r.amazonDomain)
  );
  return region || REGIONS.BR;
}

/**
 * Get region config by locale
 * @param locale - Locale code (e.g., 'pt-BR', 'en-US')
 * @returns RegionConfig or default (Brazil)
 */
export function getRegionByLocale(locale: string): RegionConfig {
  const region = Object.values(REGIONS).find(r =>
    r.locale.toLowerCase() === locale.toLowerCase()
  );
  return region || REGIONS.BR;
}

/**
 * Check if region is active (has valid affiliate tag)
 * @param code - Region code
 * @returns boolean
 */
export function isRegionActive(code: string): boolean {
  return ACTIVE_REGIONS.some(r => r.code === code.toUpperCase());
}

/**
 * Get all active region codes
 * @returns Array of active region codes ['BR', 'US']
 */
export function getActiveRegionCodes(): string[] {
  return ACTIVE_REGIONS.map(r => r.code);
}
