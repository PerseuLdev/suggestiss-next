export type Locale = 'pt-BR' | 'en-US' | 'es-ES' | 'en-GB' | 'de-DE';
export type Country = 'BR' | 'US' | 'ES' | 'UK' | 'DE';

export interface LanguageConfig {
  locale: Locale;
  currency: string;
}

export interface AmazonConfig {
  country: Country;
  amazonDomain: string;
  affiliateTag: string;
  currency: string;
}

// Legacy: For backward compatibility during migration
export interface LegacyLanguageConfig {
  locale: Locale;
  amazonDomain: string;
  affiliateTag: string;
  currency: string;
}

export interface Translations {
  common: {
    loading: string;
    loadMore: string;
    loadingMore: string;
    refreshSuggestions: string;
    refreshing: string;
    refreshLimitReached: string;
    refreshLimitMessage: string;
    refreshSuccess: string;
    error: string;
    noResults: string;
    cleanFilters: string;
  };
  loading: {
    messages: string[];
  };
  nav: {
    aiConsultant: string;
    trending: string;
  };
  app: {
    rateLimitTitle: string;
    rateLimitMessage: string;
    rateLimitRetry: string;
    cachedResultsTitle: string;
    cachedResultsMessage: string;
    newSearchAvailable: string;
  };
  categories: {
    highlights: string;
    niches: string;
    trending: string;
    trendingDesc: string;
    deals: string;
    dealsDesc: string;
    bestsellers: string;
    bestsellersDesc: string;
    gifts: string;
    giftsDesc: string;
    sustainable: string;
    sustainableDesc: string;
    premium: string;
    premiumDesc: string;
    tech: string;
    techDesc: string;
    decor: string;
    decorDesc: string;
    fashion: string;
    fashionDesc: string;
    fitness: string;
    fitnessDesc: string;
    kids: string;
    kidsDesc: string;
  };
  hero: {
    badge: string;
    title: string;
    titleHighlight: string;
    subtitle: string;
    ctaGift: string;
    ctaExplore: string;
  };
  filters: {
    label: string;
    specialFilters: string;
    priceMin: string;
    priceMax: string;
    priceValue: string; // e.g. "R$ 100+"
    priceNoLimit: string;
    priceUpTo: string; // e.g. "Até R$ 1000"
    priceAbove: string; // e.g. "Acima de R$ 1000"
    priceAll: string;
    viralityMin: string;
    viralityAbove: string; // e.g. "Acima de 70"
    viralityAll: string;
    sortBy: string;
    sortPopularity: string;
    sortNewest: string;
    sortPriceAsc: string;
    sortPriceDesc: string;
    sortRating: string;
  };
  productCard: {
    whySuggest: string;
    averagePrice: string;
    seeOffer: string;
    tipLabel: string;
    tipText: string;
    readMore: string;
    readLess: string;
  };
  giftConsultant: {
    sectionTitle: string;
    sectionSubtitle: string;
    description: string;
    ageLabel: string;
    agePlaceholder: string;
    budgetLabel: string;
    interestsLabel: string;
    interestsPlaceholder: string;
    generateButton: string;
    generating: string;
    resultsTitle: string;
    resultsCount: string;
    loadMore: string;
    tags: {
      tech: string;
      decoration: string;
      games: string;
      books: string;
      sports: string;
      cooking: string;
      art: string;
      music: string;
      travel: string;
      minimalism: string;
      fitness: string;
    };
    budgetOptions: {
      any: string;
      upTo100: string;
      range100to300: string;
      range300to1000: string;
      premium: string;
    };
    directLinkLabel: string;
    directLinkDescription: string;
  };
  footer: {
    description: string;
    terms: string;
    privacy: string;
    contact: string;
    copyright: string;
    disclaimerTitle: string;
    disclaimerText: string;
  };
  errors: {
    generic: string;
    rateLimit: string;
  };
  seo: {
    title: string;
    description: string;
    keywords: string;
    ogTitle: string;
    ogDescription: string;
    twitterTitle: string;
    twitterDescription: string;
  };
}
