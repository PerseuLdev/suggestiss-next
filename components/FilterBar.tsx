import React from 'react';
import { motion } from 'framer-motion';
import { FilterState, NicheOption } from '../types';
import { useLanguage } from '../hooks/useLanguage';
import { useAnalytics } from '../hooks/useAnalytics';
import {
  SlidersHorizontal,
  Flame,
  Star,
  Zap,
  DollarSign,
  Leaf,
  Crown,
  ArrowUpDown,
  ChevronDown
} from 'lucide-react';

interface FilterBarProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  niches: NicheOption[];
  currentNiche: string;
  onNicheChange: (id: string) => void;
}

interface SpecialFilter {
  id: string;
  label: string;
  icon: React.ReactNode;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters, setFilters, niches, currentNiche, onNicheChange
}) => {
  const { t } = useLanguage();
  const { trackCategoryClick, trackFilterApplied, trackSortChange, trackSpecialFilterToggle } = useAnalytics();

  const handleNicheChange = (nicheId: string) => {
    const currentNicheLabel = niches.find(n => n.id === currentNiche)?.label || currentNiche;
    const newNicheLabel = niches.find(n => n.id === nicheId)?.label || nicheId;

    trackCategoryClick({
      category_id: nicheId,
      category_name: newNicheLabel,
      previous_category: currentNicheLabel,
    });
    onNicheChange(nicheId);
  };

  const specialFilters: SpecialFilter[] = [
    { id: 'trending', label: t.categories.trending, icon: <Flame className="w-3.5 h-3.5" /> },
    { id: 'deals', label: t.categories.deals, icon: <Zap className="w-3.5 h-3.5" /> },
    { id: 'bestsellers', label: t.categories.bestsellers, icon: <Star className="w-3.5 h-3.5" /> },
    { id: 'gifts', label: t.categories.gifts, icon: <SlidersHorizontal className="w-3.5 h-3.5" /> },
    { id: 'sustainable', label: t.categories.sustainable, icon: <Leaf className="w-3.5 h-3.5" /> },
    { id: 'premium', label: t.categories.premium, icon: <Crown className="w-3.5 h-3.5" /> },
  ];

  const toggleSpecialFilter = (filterId: string) => {
    setFilters(prev => {
      const currentFilters = prev.specialFilters || [];
      const isActive = currentFilters.includes(filterId);
      const newFilters = isActive
        ? currentFilters.filter(f => f !== filterId)
        : [...currentFilters, filterId];

      const totalFilters = newFilters.length +
        (prev.minPrice > 0 || prev.maxPrice < 999999 ? 1 : 0) +
        (prev.minViralityScore > 0 ? 1 : 0);

      trackSpecialFilterToggle({
        filter_type: 'special',
        filter_value: filterId,
        category: currentNiche,
        total_filters_active: totalFilters,
      });

      return { ...prev, specialFilters: newFilters };
    });
  };

  const handlePriceChange = (value: number) => {
    const totalFilters = (filters.specialFilters?.length || 0) + 1 + (filters.minViralityScore > 0 ? 1 : 0);
    trackFilterApplied({ filter_type: 'price', filter_value: value, category: currentNiche, total_filters_active: totalFilters });

    if (value === 1001) {
      setFilters(prev => ({ ...prev, minPrice: 1000, maxPrice: 999999 }));
    } else {
      setFilters(prev => ({ ...prev, minPrice: 0, maxPrice: value }));
    }
  };

  const handleSortChange = (sort: string) => {
    const totalFilters = (filters.specialFilters?.length || 0) + (filters.minPrice > 0 || filters.maxPrice < 999999 ? 1 : 0) + (filters.minViralityScore > 0 ? 1 : 0);
    trackSortChange({ filter_type: 'sort', filter_value: sort, category: currentNiche, total_filters_active: totalFilters });
    setFilters(prev => ({ ...prev, sort }));
  };

  return (
    <div className="w-full bg-white border-b border-zinc-200">
      <div className="container mx-auto px-4 lg:px-8">

        {/* Categories Tab Bar */}
        <div className="flex items-center gap-6 overflow-x-auto no-scrollbar pt-6 group">
          {niches.map((item) => {
            const isActive = currentNiche === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNicheChange(item.id)}
                className={`
                  relative pb-4 flex items-center gap-2 whitespace-nowrap group/tab
                  ${isActive ? 'text-zinc-900' : 'text-zinc-500 hover:text-zinc-700'}
                  transition-all duration-200
                `}
              >
                <span className={`text-sm font-semibold ${isActive ? 'opacity-100' : 'opacity-90 group-hover/tab:opacity-100'}`}>
                  {item.label}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-zinc-900 rounded-full"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Filter Controls Row */}
        <div className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 border-t border-zinc-100">

          {/* Quick Special Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-zinc-400 mr-1">
              {t.filters.specialFilters}
            </span>
            {specialFilters.map((filter) => {
              const isActive = filters.specialFilters?.includes(filter.id) || false;
              return (
                <button
                  key={filter.id}
                  onClick={() => toggleSpecialFilter(filter.id)}
                  className={`
                    inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 border
                    ${isActive
                      ? 'bg-zinc-900 text-white border-zinc-900 shadow-[0_1px_3px_rgba(0,0,0,0.12),0_4px_8px_rgba(0,0,0,0.08)]'
                      : 'bg-white text-zinc-600 border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50 shadow-[0_1px_2px_rgba(0,0,0,0.04)]'}
                  `}
                >
                  {filter.icon}
                  {filter.label}
                </button>
              );
            })}
          </div>

          {/* Functional Filters (Selects) */}
          <div className="flex flex-wrap items-center gap-2">
             {/* Sort Select */}
             <div className="relative group/select min-w-[140px]">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <ArrowUpDown className="w-3.5 h-3.5 text-zinc-400" />
                </div>
                <select
                  value={filters.sort}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="w-full pl-9 pr-8 py-2.5 bg-zinc-50 border border-zinc-200 rounded-lg text-xs font-medium text-zinc-900 appearance-none focus:bg-white focus:border-zinc-300 focus:shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-all duration-200 cursor-pointer"
                >
                  <option value="newest">{t.filters.sortNewest}</option>
                  <option value="price_asc">{t.filters.sortPriceAsc}</option>
                  <option value="price_desc">{t.filters.sortPriceDesc}</option>
                  <option value="rating">{t.filters.sortRating}</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400 pointer-events-none" />
             </div>

             {/* Price Select */}
             <div className="relative group/select min-w-[140px]">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <DollarSign className="w-3.5 h-3.5 text-zinc-400" />
                </div>
                <select
                   value={filters.minPrice === 1000 && filters.maxPrice >= 999999 ? 1001 : filters.maxPrice}
                   onChange={(e) => handlePriceChange(Number(e.target.value))}
                   className="w-full pl-9 pr-8 py-2.5 bg-zinc-50 border border-zinc-200 rounded-lg text-xs font-medium text-zinc-900 appearance-none focus:bg-white focus:border-zinc-300 focus:shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-all duration-200 cursor-pointer"
                >
                  <option value={999999}>{t.filters.priceAll}</option>
                  <option value={200}>{t.filters.priceUpTo.replace('{value}', '200')}</option>
                  <option value={500}>{t.filters.priceUpTo.replace('{value}', '500')}</option>
                  <option value={1000}>{t.filters.priceUpTo.replace('{value}', '1k')}</option>
                  <option value={1001}>{t.filters.priceAbove.replace('{value}', '1k')}</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400 pointer-events-none" />
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};