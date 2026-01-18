'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Hero } from '@/components/Hero';
import { FilterBar } from '@/components/FilterBar';
import { ProductCard } from '@/components/ProductCard';
import { Footer } from '@/components/Footer';
import { ProductGridSkeleton } from '@/components/LoadingSkeleton';
import { GiftConsultantSection } from '@/components/GiftConsultantSection';
import { Header } from '@/components/Header';
import { Product, FilterState, NicheOption } from '@/types';
import { generateCuratedProducts } from '@/services/geminiService';
import { isRateLimitError } from '@/services/apiProxy';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { useLanguage } from '@/hooks/useLanguage';
import { RegionProvider } from '@/contexts/RegionContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { useRegionCache } from '@/hooks/useRegionCache';
import { AnalyticsProvider } from '@/contexts/AnalyticsContext';
import { useAnalytics } from '@/hooks/useAnalytics';

// Niche categories
const NICHE_IDS = ['surprise', 'tech', 'fashion', 'kids', 'decor', 'fitness', 'pets', 'travel', 'hobbies'];

// Icons mapping
const ICONS: Record<string, React.ReactNode> = {
  trending: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>,
  deals: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path></svg>,
  bestsellers: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path></svg>,
  gifts: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"></path></svg>,
  sustainable: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path></svg>,
  premium: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path></svg>,
  tech: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>,
  decor: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>,
  fashion: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>,
  fitness: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>,
  pets: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c-2.2 0-4 1.8-4 4 0 3 4 7 4 7s4-4 4-7c0-2.2-1.8-4-4-4zM8 7a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM13.5 5.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM19 7a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"></path></svg>,
  hobbies: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z"></path></svg>,
  travel: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>,
  kids: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>,
  surprise: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path></svg>
};

// Main App component with cache integration
const AppContent: React.FC = () => {
  const { locale, amazonConfig, t } = useLanguage();
  const { region, getCached, setCached, invalidateCache } = useRegionCache();
  const { trackPageView, trackLoadMoreClick } = useAnalytics();
  const [currentNiche, setCurrentNiche] = useState<string>('surprise');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [rateLimitError, setRateLimitError] = useState<{ message: string; resetIn: number } | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    minPrice: 0,
    maxPrice: 999999,
    minRating: 4.0,
    minViralityScore: 0,
    sort: 'newest',
    specialFilters: []
  });

  // Construct niches with translations
  const niches: NicheOption[] = NICHE_IDS.map(id => ({
    id,
    label: (t.categories as Record<string, string>)[id] || id,
    description: (t.categories as Record<string, string>)[`${id}Desc`] || '',
    icon: ICONS[id]
  }));

  // Pagination state
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const [isSticky, setIsSticky] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);
  const consultantRef = useRef<HTMLDivElement>(null);
  const trendingRef = useRef<HTMLDivElement>(null);

  // Scroll functions
  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Scroll detection for sticky header effect
  useEffect(() => {
    const handleScroll = () => {
      if (filterRef.current) {
        const rect = trendingRef.current?.getBoundingClientRect();
        if (rect && rect.top <= 0) {
            setIsSticky(true);
        } else {
            setIsSticky(false);
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Find active niche
  const activeCategory = niches.find(n => n.id === currentNiche);
  const activeNicheLabel = activeCategory?.label || '';
  const activeNicheDescription = activeCategory?.description || '';

  // Track page views
  useEffect(() => {
    trackPageView(`${activeNicheLabel || currentNiche} - Suggestiss`, {
      page_path: window.location.pathname,
      referrer: document.referrer || undefined,
    });
  }, [currentNiche, activeNicheLabel, trackPageView]);

  // Generate cache key based on filters and locale
  const getCacheKey = () => {
    const specialFiltersSuffix = filters.specialFilters && filters.specialFilters.length > 0
      ? `_${filters.specialFilters.sort().join('_')}`
      : '';
    const viralitySuffix = filters.minViralityScore > 0 ? `_v${filters.minViralityScore}` : '';
    const priceSuffix = filters.minPrice > 0 || filters.maxPrice < 999999
      ? `_p${filters.minPrice}-${filters.maxPrice}`
      : '';
    return `${currentNiche}_${filters.sort}${specialFiltersSuffix}${viralitySuffix}${priceSuffix}_${locale}`;
  };

  // Fetch products with cache
  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      const cacheKey = getCacheKey();

      const hasActiveFilters = filters.minPrice > 0 || filters.maxPrice < 999999 ||
                               filters.minViralityScore > 0 ||
                               (filters.specialFilters && filters.specialFilters.length > 0);

      if (hasActiveFilters) {
        console.log('[App] 🔄 Active filters detected - bypassing cache to fetch fresh products');
        invalidateCache(cacheKey);
      }

      const cached = !hasActiveFilters ? getCached<Product[]>(cacheKey) : null;
      if (cached && cached.length > 0) {
        console.log(`[App] ✅ Using cached products for ${region.code}/${cacheKey}`);
        setProducts(cached);
        setLoading(false);
        setCurrentPage(1);
        return;
      }

      setLoading(true);
      setRateLimitError(null);
      setCurrentPage(1);

      try {
        console.log(`[App] 🔄 Fetching products for ${region.code}/${currentNiche}`);
        console.log('[App] Filters being sent to API:', JSON.stringify(filters, null, 2));

        const data = await generateCuratedProducts(currentNiche, filters, 1, locale, amazonConfig);

        if (mounted) {
          if (data && data.length > 0) {
            console.log(`[App] ✅ Received ${data.length} products for ${region.code}/${currentNiche}`);
            setProducts(data);

            setCached(cacheKey, data, { ttl: 10 * 60 * 1000 });
            console.log(`[App] 💾 Cached products: ${region.code}/${cacheKey}`);
          } else {
            console.warn(`[App] ⚠️ No products returned for ${currentNiche}`);
            setProducts([]);
          }
          setLoading(false);
        }
      } catch (error) {
        if (mounted) {
          if (isRateLimitError(error)) {
            console.warn('[App] ⚠️ Rate limit error:', error.message);
            setRateLimitError({
              message: error.message,
              resetIn: error.resetIn
            });
            if (products.length === 0) {
              setProducts([]);
            }
          } else {
            console.error('[App] ❌ Error fetching products:', error);
            setProducts([]);
          }
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => { mounted = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentNiche, filters.minPrice, filters.maxPrice, filters.minViralityScore, filters.sort, filters.specialFilters, region.code, locale]);

  // Reset products when region changes - integrated into main fetch effect via region.code dependency

  // Countdown for rate limit
  useEffect(() => {
    if (!rateLimitError) return;

    const timer = setInterval(() => {
      setRateLimitError(prev => {
        if (!prev || prev.resetIn <= 1) {
          clearInterval(timer);
          return null;
        }
        return { ...prev, resetIn: prev.resetIn - 1 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [rateLimitError]);

  // Load more products handler
  const handleLoadMore = async () => {
    trackLoadMoreClick({
      category: currentNiche,
      current_products_count: products.length,
      list_type: 'curated',
    });

    setLoadingMore(true);
    setRateLimitError(null);

    try {
      const nextPage = currentPage + 1;
      console.log(`[App] Loading more products for ${currentNiche}, page ${nextPage}`);

      const currentNames = products.map(p => p.name);
      console.log(`[App] Sending ${currentNames.length} excluded names to API`);

      const newProducts = await generateCuratedProducts(
        currentNiche,
        filters,
        nextPage,
        locale,
        amazonConfig,
        false,
        currentNames
      );

      if (newProducts && newProducts.length > 0) {
        console.log(`[App] Received ${newProducts.length} more products`);
        setProducts(prev => [...prev, ...newProducts]);
        setCurrentPage(nextPage);
      }
      setLoadingMore(false);
    } catch (error) {
      if (isRateLimitError(error)) {
        console.warn('[App] Rate limit error on load more:', error.message);
        setRateLimitError({
          message: error.message,
          resetIn: error.resetIn
        });
      } else {
        console.error('[App] Error loading more products:', error);
      }
      setLoadingMore(false);
    }
  };

  const filteredProducts = products;

  return (
    <div className="min-h-screen flex flex-col font-sans text-zinc-900 bg-white selection:bg-zinc-900 selection:text-white relative">
      <Analytics />
      <div className="noise-overlay" />

      <Header
        onScrollToConsultant={() => scrollToSection(consultantRef)}
        onScrollToTrending={() => scrollToSection(trendingRef)}
      />

      <Hero
        onScrollToConsultant={() => scrollToSection(consultantRef)}
        onScrollToTrending={() => scrollToSection(trendingRef)}
      />

      <div ref={consultantRef} className="bg-zinc-50 pt-12 pb-24 border-y border-zinc-100 relative shadow-[0_0_100px_rgba(0,0,0,0.02)]">
         <div className="container mx-auto px-4 lg:px-8">
            <GiftConsultantSection />
         </div>
      </div>

      <div ref={trendingRef} className="relative bg-white pb-10">

          <div ref={filterRef}>
            <FilterBar
                filters={filters}
                setFilters={setFilters}
                isSticky={isSticky}
                niches={niches}
                currentNiche={currentNiche}
                onNicheChange={setCurrentNiche}
            />
          </div>

          <main className="container mx-auto px-4 lg:px-8 py-16">
            <div className="mb-12">
                <h2 className="text-3xl font-bold text-zinc-900 tracking-tight">
                  {activeNicheLabel}
                </h2>
                <p className="text-zinc-500 mt-2 text-lg font-light">{activeNicheDescription}</p>
            </div>

            {rateLimitError && products.length > 0 && (
              <div className="mb-8 p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
                <svg className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                </svg>
                <div className="flex-1">
                  <h4 className="font-semibold text-amber-900 text-sm">{t.app.cachedResultsTitle}</h4>
                  <p className="text-xs text-amber-700 mt-1">{rateLimitError.message} - {t.app.cachedResultsMessage}</p>
                  <p className="text-xs font-medium text-amber-600 mt-2">
                    {t.app.newSearchAvailable} {rateLimitError.resetIn > 60
                      ? `${Math.ceil(rateLimitError.resetIn / 60)}min`
                      : `${rateLimitError.resetIn}s`}
                  </p>
                </div>
              </div>
            )}

            {loading ? (
                <ProductGridSkeleton />
            ) : rateLimitError && products.length === 0 ? (
                <div className="text-center py-20 border-2 border-amber-200 bg-amber-50 rounded-xl">
                    <div className="mb-4">
                        <svg className="w-16 h-16 mx-auto text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                        </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-amber-900">{t.app.rateLimitTitle}</h3>
                    <p className="text-amber-700 mt-3 max-w-md mx-auto">{rateLimitError.message}</p>
                    <p className="text-sm font-medium text-amber-600 mt-3 bg-amber-100/50 py-1.5 px-4 rounded-full inline-block">
                        {t.app.retryIn}: {rateLimitError.resetIn > 60
                            ? `${Math.ceil(rateLimitError.resetIn / 60)} minuto${rateLimitError.resetIn > 120 ? 's' : ''}`
                            : `${rateLimitError.resetIn} segundo${rateLimitError.resetIn !== 1 ? 's' : ''}`}
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-8 px-6 py-2.5 bg-amber-600 text-white font-medium rounded-lg hover:bg-amber-700 transition-colors"
                    >
                        {t.app.rateLimitRetry}
                    </button>
                </div>
            ) : filteredProducts.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                      {filteredProducts.map((product, index) => (
                          <ProductCard
                            key={product.id}
                            product={product}
                            position={index + 1}
                            category={currentNiche}
                            listType="curated"
                          />
                      ))}
                  </div>

                  <div className="mt-12 flex justify-center">
                    <button
                      onClick={handleLoadMore}
                      disabled={loadingMore}
                      className="group relative inline-flex items-center justify-center gap-2 px-8 py-3 bg-white border border-zinc-200 hover:border-zinc-900 text-zinc-900 text-sm font-medium rounded-lg transition-all disabled:opacity-50 shadow-sm"
                    >
                      {loadingMore ? (
                        <>
                          <svg className="animate-spin h-4 w-4 text-zinc-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                          {t.common.loadingMore}
                        </>
                      ) : (
                        <>
                          {t.giftConsultant.loadMore}
                          <svg className="w-4 h-4 text-zinc-400 group-hover:text-zinc-900 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                        </>
                      )}
                    </button>
                  </div>
                </>
            ) : (
                <div className="text-center py-20 border border-dashed border-zinc-200 rounded-xl">
                    <h3 className="text-xl font-medium text-zinc-900">{t.common.noResults}</h3>
                    <p className="text-zinc-500 mt-2">Ajuste os filtros para encontrar novos produtos.</p>
                    <button
                        onClick={() => setFilters(prev => ({...prev, minPrice: 0, maxPrice: 999999, minViralityScore: 0}))}
                        className="mt-6 text-sm font-medium text-zinc-900 underline underline-offset-4 hover:text-zinc-600"
                    >
                        {t.common.cleanFilters}
                    </button>
                </div>
            )}
          </main>
      </div>

      <Footer />
    </div>
  );
};

// App wrapper with Providers
const App: React.FC = () => {
  return (
    <LanguageProvider>
      <RegionProvider>
        <AppWithAnalytics />
      </RegionProvider>
    </LanguageProvider>
  );
};

// Inner component to access region context
const AppWithAnalytics: React.FC = () => {
  const { locale } = useLanguage();
  const { region } = useRegionCache();

  return (
    <AnalyticsProvider locale={locale} region={region.code}>
      <AppContent />
      <Analytics />
      <SpeedInsights />
    </AnalyticsProvider>
  );
};

export default App;
