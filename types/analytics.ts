// Analytics Event Types
// Definição de tipos para eventos de analytics do PostHog

/**
 * Dados de evento de produto
 */
export interface ProductEventData {
  productId: string;
  productName: string;
  category: string;
  price: number;
  rating: number;
  position: number; // Posição na lista (1-indexed)
}

/**
 * Dados de evento de busca
 */
export interface SearchEventData {
  niche?: string;
  filters?: FilterEventData;
  query?: string;
  interests?: string[];
  budget?: string;
  page: number;
  resultsCount?: number;
}

/**
 * Dados de evento de filtro
 */
export interface FilterEventData {
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  sort?: string;
  specialFilters?: string[];
}

/**
 * Dados de evento de navegação
 */
export interface NavigationEventData {
  from?: string;
  to?: string;
  page?: string;
  path?: string;
}

/**
 * Dados de propriedades do usuário
 */
export interface UserProperties {
  locale: string; // pt-BR, en-US
  region?: string; // Brazil, United States
  device_type?: 'mobile' | 'tablet' | 'desktop';
  browser?: string;
  first_visit?: string; // ISO date
  returning_user?: boolean;
}

/**
 * Tipos de eventos disponíveis
 */
export const ANALYTICS_EVENTS = {
  // Page & Navigation
  PAGE_VIEWED: 'page_viewed',
  CATEGORY_CLICKED: 'category_clicked',
  LANGUAGE_CHANGED: 'language_changed',
  SCROLL_DEPTH: 'scroll_depth',

  // Search
  SEARCH_PERFORMED: 'search_performed',
  GIFT_SEARCH: 'gift_search',
  GIFT_CONSULTANT_OPENED: 'gift_consultant_opened',
  GIFT_MODAL_OPENED: 'gift_modal_opened',
  GIFT_MODAL_CLOSED: 'gift_modal_closed',

  // Filters
  FILTER_APPLIED: 'filter_applied',
  FILTER_PRICE_CHANGED: 'filter_price_changed',
  FILTER_RATING_CHANGED: 'filter_rating_changed',
  SORT_CHANGED: 'sort_changed',
  SPECIAL_FILTER_TOGGLED: 'special_filter_toggled',

  // Products
  PRODUCT_IMPRESSION: 'product_impression',
  PRODUCT_CLICKED: 'product_clicked',
  AMAZON_LINK_CLICKED: 'amazon_link_clicked', // CONVERSÃO!

  // UI Actions
  LOAD_MORE_CLICKED: 'load_more_clicked',
  REFRESH_CLICKED: 'refresh_clicked',
  GIFT_TAG_CLICKED: 'gift_tag_clicked',
  HERO_CTA_CLICKED: 'hero_cta_clicked',
  FOOTER_LINK_CLICKED: 'footer_link_clicked',

  // Session
  SESSION_STARTED: 'session_started',
  USER_IDENTIFIED: 'user_identified',
} as const;

export type AnalyticsEventName = typeof ANALYTICS_EVENTS[keyof typeof ANALYTICS_EVENTS];

/**
 * Propriedades genéricas de evento
 */
export interface EventProperties {
  [key: string]: string | number | boolean | string[] | undefined;
}
