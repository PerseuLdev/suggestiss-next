import React from 'react';

/**
 * Affiliate store types
 */
export type AffiliateStore = 'amazon';

/**
 * Product interface
 */
export interface Product {
  id: string;
  name: string;
  price: number;
  rating: number;
  aiReasoning?: string;
  viralityScore?: number;
  affiliateUrl: string;
  store: AffiliateStore;
  currency: string;
  asin?: string;
  imageUrl?: string;
  category?: string;
}

/**
 * Filter state for product filtering
 */
export interface FilterState {
  minPrice: number;
  maxPrice: number;
  minRating: number;
  minViralityScore: number;
  sort: string;
  specialFilters: string[];
}

/**
 * Niche category option
 */
export interface NicheOption {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
}

/**
 * Sort option for products
 */
export interface SortOption {
  value: string;
  label: string;
}

/**
 * Price range option
 */
export interface PriceRange {
  min: number;
  max: number;
  label: string;
}

/**
 * API response types
 */
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  cached?: boolean;
  timestamp?: number;
}

/**
 * Rate limit error info
 */
export interface RateLimitInfo {
  message: string;
  resetIn: number;
  limit?: number;
}
