import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Product } from '../types';
import { ProductCard } from './ProductCard';
import { generateGiftSuggestions } from '../services/geminiService';
import { ProductGridSkeleton } from './LoadingSkeleton';
import { useLanguage } from '../hooks/useLanguage';
import { useAnalytics } from '../hooks/useAnalytics';
import {
  Search,
  ChevronDown,
  Tag as TagIcon,
  CreditCard,
  ArrowRight,
  AlertCircle,
  Plus
} from 'lucide-react';

// Keys for tags to lookup in translations
const TAG_KEYS = [
  "tech", "decoration", "games", "books", 
  "sports", "cooking", "art", "music",
  "travel", "minimalism"
];

const BUDGET_OPTIONS = [
  "any",
  "upTo100",
  "range100to300",
  "range300to1000",
  "premium"
];

export const GiftConsultantSection: React.FC = () => {
  const { locale, amazonConfig, t } = useLanguage();
  const { trackGiftSearch, trackLoadMoreClick } = useAnalytics();
  const [age, setAge] = useState('');
  const [interests, setInterests] = useState('');
  const [budgetKey, setBudgetKey] = useState<string>('any');

  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [results, setResults] = useState<Product[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [rateLimitError, setRateLimitError] = useState<{ message: string; resetIn: number } | null>(null);

  // Countdown for rate limit
  React.useEffect(() => {
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

  const handleTagClick = (tagKey: string) => {
    const tagLabel = t.giftConsultant.tags[tagKey as keyof typeof t.giftConsultant.tags] || tagKey;
    if (interests.includes(tagLabel)) return;
    setInterests(prev => prev ? `${prev}, ${tagLabel}` : tagLabel);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !loading && interests.trim()) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const fetchSuggestions = async (isLoadMore: boolean = false) => {
    if (!interests.trim()) return;

    setRateLimitError(null);
    if (isLoadMore) {
      setLoadingMore(true);
    } else {
      setLoading(true);
      setHasSearched(true);
      setResults([]);
    }

    try {
      const currentPage = isLoadMore ? Math.floor(results.length / 4) + 1 : 1;
      const budgetLabel = t.giftConsultant.budgetOptions[budgetKey as keyof typeof t.giftConsultant.budgetOptions] || budgetKey;

      if (!isLoadMore) {
        const searchStartTime = Date.now();
        const products = await generateGiftSuggestions(age || "Adulto", locale, amazonConfig, interests, budgetLabel, currentPage, []);
        const searchDuration = Date.now() - searchStartTime;

        trackGiftSearch({
          query: interests.trim(),
          age: age?.trim(),
          results_count: products.length,
          search_duration_ms: searchDuration,
        });

        setResults(products);
        setLoading(false);
      } else {
        const currentNames = results.map(p => p.name);
        const products = await generateGiftSuggestions(
          age || "Adulto",
          locale,
          amazonConfig,
          interests,
          budgetLabel,
          currentPage,
          currentNames
        );
        setResults(prev => [...prev, ...products]);
        setLoadingMore(false);
      }
    } catch (error: unknown) {
      console.error('[GiftConsultant] Error in fetchSuggestions:', error);
      if (error && typeof error === 'object' && 'isRateLimited' in error && error.isRateLimited) {
        const rateLimitError = error as { isRateLimited: boolean; message: string; resetIn: number };
        setRateLimitError({
          message: rateLimitError.message,
          resetIn: rateLimitError.resetIn
        });
      }
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleSubmit = () => fetchSuggestions(false);
  const handleLoadMore = () => {
    trackLoadMoreClick({
      category: 'gift_consultant',
      current_products_count: results.length,
      list_type: 'gift_consultant',
    });
    fetchSuggestions(true);
  };

  return (
    <section className="w-full bg-zinc-50 py-20 lg:py-24">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="w-full max-w-5xl mx-auto">

          {/* Premium Card Container */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
            className="bg-white rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.08),0_4px_12px_rgba(0,0,0,0.04)] border border-zinc-100 overflow-hidden relative"
          >

            <div className="p-8 md:p-12 lg:p-16 relative z-10">
              <header className="mb-12">
                  <h2 className="text-4xl md:text-5xl font-black text-zinc-900 tracking-tighter mb-4">
                    {t.giftConsultant.sectionTitle}
                  </h2>
                  <p className="text-zinc-600 text-base md:text-lg leading-relaxed max-w-2xl">
                    {t.giftConsultant.description}
                  </p>
              </header>

          <div className="space-y-8">
            {/* Input Groups */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

              {/* Age Field */}
              <div className="md:col-span-4">
                <label className="flex items-center gap-2 text-xs font-semibold text-zinc-900 uppercase tracking-wide mb-3">
                  <TagIcon className="w-3.5 h-3.5" />
                  {t.giftConsultant.ageLabel}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={age}
                    onChange={(e) => setAge(e.target.value.slice(0, 200))}
                    onKeyPress={handleKeyPress}
                    placeholder={t.giftConsultant.agePlaceholder}
                    className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 text-sm placeholder-zinc-400 focus:bg-white focus:border-zinc-300 focus:shadow-[0_1px_2px_rgba(0,0,0,0.04)] outline-none transition-all duration-200"
                  />
                </div>
              </div>

              {/* Interests Field */}
              <div className="md:col-span-8">
                <label className="flex items-center gap-2 text-xs font-semibold text-zinc-900 uppercase tracking-wide mb-3">
                  <Plus className="w-3.5 h-3.5" />
                  {t.giftConsultant.interestsLabel}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={interests}
                    onChange={(e) => setInterests(e.target.value.slice(0, 500))}
                    onKeyPress={handleKeyPress}
                    placeholder={t.giftConsultant.interestsPlaceholder}
                    className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 text-sm placeholder-zinc-400 focus:bg-white focus:border-zinc-300 focus:shadow-[0_1px_2px_rgba(0,0,0,0.04)] outline-none transition-all duration-200 mb-4"
                  />

                  {/* Quick Tags */}
                  <div className="flex flex-wrap gap-2">
                    {TAG_KEYS.map(tagKey => (
                      <button
                        key={tagKey}
                        onClick={() => handleTagClick(tagKey)}
                        className="px-3 py-2 rounded-lg border border-zinc-200 text-xs font-medium text-zinc-600 hover:border-zinc-900 hover:text-zinc-900 hover:bg-zinc-50 transition-all duration-200 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
                      >
                        + {t.giftConsultant.tags[tagKey as keyof typeof t.giftConsultant.tags]}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Price Selection */}
            <div className="pt-6 border-t border-zinc-100">
                <label htmlFor="budget-select" className="flex items-center gap-2 text-xs font-semibold text-zinc-900 uppercase tracking-wide mb-3">
                  <CreditCard className="w-3.5 h-3.5" />
                  {t.giftConsultant.budgetLabel}
                </label>
                <div className="relative">
                  <select
                    id="budget-select"
                    value={budgetKey}
                    onChange={(e) => setBudgetKey(e.target.value)}
                    className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 text-sm font-medium focus:bg-white focus:border-zinc-300 focus:shadow-[0_1px_2px_rgba(0,0,0,0.04)] outline-none transition-all duration-200 appearance-none cursor-pointer"
                  >
                    {BUDGET_OPTIONS.map(opt => (
                      <option key={opt} value={opt}>
                        {t.giftConsultant.budgetOptions[opt as keyof typeof t.giftConsultant.budgetOptions] || opt}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
                </div>
            </div>

            {/* Action Button */}
            <div className="pt-4">
                <button
                  onClick={handleSubmit}
                  disabled={loading || !interests}
                  className="w-full px-8 py-4 bg-zinc-900 hover:bg-zinc-800 text-white font-semibold rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.12),0_4px_8px_rgba(0,0,0,0.08)] hover:shadow-[0_2px_4px_rgba(0,0,0,0.12),0_8px_16px_rgba(0,0,0,0.10)] disabled:opacity-40 disabled:shadow-none transition-all duration-200 flex items-center justify-center gap-3 group"
                >
                  {loading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full"
                    />
                  ) : (
                    <>
                      <Search className="w-5 h-5" />
                      <span className="uppercase tracking-wide text-sm font-semibold">{t.giftConsultant.generateButton}</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200" />
                    </>
                  )}
                </button>
            </div>
          </div>
            </div>
          </motion.div>

      {/* Results Display */}
      <AnimatePresence mode="wait">
        <div className="mt-16">
          {loading && (
            <motion.div
              key="skeleton"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <ProductGridSkeleton />
            </motion.div>
          )}

          {!loading && hasSearched && results.length > 0 && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
            >
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                  <div>
                    <h3 className="text-3xl font-black text-zinc-900 tracking-tighter">{t.giftConsultant.sectionTitle}</h3>
                  </div>
                  <span className="inline-flex px-3 py-2 bg-white border border-zinc-200 rounded-lg text-xs font-medium text-zinc-600 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
                    {t.giftConsultant.resultsCount.replace('{count}', results.length.toString())}
                  </span>
               </div>

               {rateLimitError && (
                 <motion.div
                   initial={{ opacity: 0, x: -20 }}
                   animate={{ opacity: 1, x: 0 }}
                   className="mb-8 p-6 bg-zinc-900 text-white rounded-xl flex items-start gap-4 shadow-[0_4px_12px_rgba(0,0,0,0.15)] overflow-hidden relative"
                 >
                    <div className="p-2.5 bg-white/10 rounded-lg">
                      <AlertCircle className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm">{t.app.rateLimitTitle}</h4>
                      <p className="text-xs text-zinc-300 mt-1 leading-relaxed">{rateLimitError.message}</p>
                      <div className="mt-3 flex items-center gap-2">
                        <span className="text-xs font-medium text-zinc-400">
                          {t.app.newSearchAvailable}
                        </span>
                        <span className="px-2.5 py-1 bg-white/10 rounded-lg text-white font-mono text-xs">
                          {rateLimitError.resetIn > 60
                            ? `${Math.ceil(rateLimitError.resetIn / 60)}m`
                            : `${rateLimitError.resetIn}s`}
                        </span>
                      </div>
                    </div>
                 </motion.div>
               )}

               <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {results.map((product, index) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      position={index + 1}
                      category="gift_consultant"
                      listType="gift_consultant"
                    />
                  ))}
               </div>

               {/* Modern Load More Handler */}
               <div className="mt-12 flex justify-center">
                  <button
                    onClick={handleLoadMore}
                    disabled={loadingMore}
                    className="group relative inline-flex items-center gap-2 px-8 py-3 bg-white border border-zinc-200 hover:border-zinc-900 hover:bg-zinc-50 text-zinc-900 text-sm font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
                  >
                    {loadingMore ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-4 h-4 border-2 border-zinc-200 border-t-zinc-900 rounded-full"
                      />
                    ) : (
                      <>
                        {t.giftConsultant.loadMore}
                        <ChevronDown className="w-4 h-4 text-zinc-400 group-hover:text-zinc-900 group-hover:translate-y-0.5 transition-all duration-200" />
                      </>
                    )}
                  </button>
               </div>
            </motion.div>
          )}

          {!loading && hasSearched && results.length === 0 && (
             <motion.div
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               className="text-center py-16 bg-white rounded-2xl border-2 border-dashed border-zinc-200"
             >
                <div className="w-12 h-12 bg-zinc-50 rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.04)] flex items-center justify-center mx-auto mb-4">
                  <Search className="w-6 h-6 text-zinc-300" />
                </div>
                <p className="text-zinc-500 font-medium text-sm">{t.common.noResults}</p>
             </motion.div>
          )}
        </div>
      </AnimatePresence>
        </div>
      </div>
    </section>
  );
};