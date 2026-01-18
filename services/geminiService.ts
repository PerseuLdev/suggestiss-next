import { Product, FilterState, AffiliateStore } from "../types";
import { Locale, AmazonConfig } from "../locales/types";
import { callProxy, isRateLimitError } from "./apiProxy";

/**
 * Generate Amazon affiliate URL based on ASIN or product name
 * @param product - Product object with optional ASIN
 * @param amazonConfig - Amazon configuration with domain and affiliate tag
 * @returns Complete Amazon affiliate URL
 */
const generateAmazonUrl = (product: { name: string; asin?: string }, amazonConfig: AmazonConfig): string => {
  const { amazonDomain, affiliateTag } = amazonConfig;

  console.log('[generateAmazonUrl] Product:', { name: product.name, asin: product.asin });
  console.log('[generateAmazonUrl] Amazon Config:', { country: amazonConfig.country, amazonDomain, affiliateTag });

  // Prefer ASIN direct link if available
  if (product.asin) {
    const url = `https://www.${amazonDomain}/dp/${product.asin}?tag=${affiliateTag}`;
    console.log('[generateAmazonUrl] Generated ASIN URL:', url);
    return url;
  }

  // Fallback to search URL if no ASIN
  const query = encodeURIComponent(product.name);
  const url = `https://www.${amazonDomain}/s?k=${query}&tag=${affiliateTag}`;
  console.log('[generateAmazonUrl] Generated Search URL:', url);
  return url;
};

export const generateCuratedProducts = async (
  niche: string,
  filters: FilterState,
  page: number = 1,
  locale: Locale,
  amazonConfig: AmazonConfig,
  bypassCache: boolean = false,
  excludeNames: string[] = [] // New parameter for deduplication
): Promise<Product[]> => {
  console.log('[generateCuratedProducts] Called with bypassCache:', bypassCache);
  console.log('[generateCuratedProducts] Excluding products:', excludeNames.length);

  try {
    const payload = {
      niche,
      filters,
      page,
      locale,
      currency: amazonConfig.currency,
      amazonDomain: amazonConfig.amazonDomain,
      bypassCache, // Add bypass flag to force fresh data
      freshData: true, // Enable Google Search Grounding
      excludeNames // Pass exclusion list to API
    };

    console.log('[generateCuratedProducts] Payload:', JSON.stringify(payload, null, 2));

    const data = await callProxy('curated', payload);

    if (!data || !Array.isArray(data)) return [];

    // Normalize products with ASIN-aware URL generation
    return data.map((p: Record<string, unknown>) => ({
      ...p,
      id: crypto.randomUUID(),
      affiliateUrl: generateAmazonUrl({ name: p.name as string, asin: p.asin as string | undefined }, amazonConfig),
      store: 'amazon' as AffiliateStore,
      currency: amazonConfig.currency
    }));
  } catch (error) {
    // Re-throw rate limit errors to be handled by UI
    if (isRateLimitError(error)) {
      console.warn(`[Curated Products] Rate limited: ${error.message}`);
      throw error;
    }
    console.error('[Curated Products] Proxy call failed:', error);
    return [];
  }
};

export const generateGiftSuggestions = async (
  ageOrDescription: string,
  locale: Locale,
  amazonConfig: AmazonConfig,
  interests?: string,
  budget?: string,
  page: number = 1,
  excludeNames: string[] = [], // New parameter for deduplication
  detailedSearch: boolean = false // Enable detailed ASIN extraction
): Promise<Product[]> => {
  try {
    console.log('[generateGiftSuggestions] Excluding products:', excludeNames.length);
    console.log('[generateGiftSuggestions] Detailed ASIN search:', detailedSearch);

    const data = await callProxy('gift', {
      ageOrDescription,
      interests,
      budget,
      page,
      locale,
      currency: amazonConfig.currency,
      amazonDomain: amazonConfig.amazonDomain,
      excludeNames, // Pass exclusion list to API
      freshData: true, // Google Search enabled (Tier 1: 1500 searches/day available)
      detailedSearch // Enable detailed ASIN extraction (slower but more accurate)
    });

    let products: unknown = data;

    // Extra layer of defense: Unwrap if API returned wrapped object
    if (products && !Array.isArray(products)) {
      const wrapped = products as Record<string, unknown>;
      if (wrapped.products) products = wrapped.products;
      else if (wrapped.data) products = wrapped.data;
      else if (wrapped.suggestions) products = wrapped.suggestions;
    }

    if (!products || !Array.isArray(products)) {
      console.warn('[GiftConsultant] API returned invalid format:', data);
      return [];
    }

    // Normalize products with ASIN-aware URL generation
    return products.map((p: Record<string, unknown>) => ({
      ...p,
      id: crypto.randomUUID(),
      affiliateUrl: generateAmazonUrl({ name: p.name as string, asin: p.asin as string | undefined }, amazonConfig),
      store: 'amazon' as AffiliateStore,
      currency: amazonConfig.currency
    }));
  } catch (error) {
    // Re-throw rate limit errors to be handled by UI
    if (isRateLimitError(error)) {
      console.warn(`[Gift Suggestions] Rate limited: ${error.message}`);
      throw error;
    }
    console.error('[Gift Suggestions] Proxy call failed:', error);
    return [];
  }
};

/**
 * Provider health is now managed server-side
 */
export const getProviderHealth = () => ({
  status: 'managed-by-proxy',
  timestamp: new Date().toISOString()
});
