import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Product } from '../types';
import { useLanguage } from '../hooks/useLanguage';
import { useAnalytics } from '../hooks/useAnalytics';
import { 
  Star, 
  ExternalLink, 
  Flame, 
  Info,
  ChevronRight,
  Sparkles
} from 'lucide-react';

interface ProductCardProps {
  product: Product;
  position?: number;
  category?: string;
  listType?: 'curated' | 'gift_consultant';
}

const StoreBadge = ({ store }: { store: string }) => {
  return (
    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-50 border border-zinc-200 text-[10px] font-medium text-zinc-600 uppercase tracking-wide">
      <div className="w-1.5 h-1.5 bg-zinc-900 rounded-full" />
      {store}
    </div>
  );
};

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  position = 0,
  category = 'unknown',
  listType = 'curated'
}) => {
  const { t } = useLanguage();
  const { trackProductImpression, trackProductClick, trackAmazonLinkClick } = useAnalytics();
  const [isExpanded, setIsExpanded] = useState(false);
  const [hasTrackedImpression, setHasTrackedImpression] = useState(false);
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { once: true, amount: 0.2 });

  const rating = product.rating ?? 4.5;
  const price = product.price ?? 0;
  const aiReasoning = product.aiReasoning ?? 'Produto recomendado baseado em análise de tendências.';
  const name = product.name ?? 'Produto sem nome';

  useEffect(() => {
    if (isInView && !hasTrackedImpression) {
      trackProductImpression({
        product_id: product.id,
        product_name: name,
        product_price: price,
        product_rating: rating,
        category,
        position,
        list_type: listType,
      });
      setHasTrackedImpression(true);
    }
  }, [isInView, hasTrackedImpression, product.id, name, price, rating, category, position, listType, trackProductImpression]);

  const WORD_LIMIT = 24;
  const words = aiReasoning.split(' ');
  const shouldTruncate = words.length > WORD_LIMIT;
  const displayText = isExpanded || !shouldTruncate
    ? aiReasoning
    : words.slice(0, WORD_LIMIT).join(' ') + '...';

  const getViralityStyle = (score: number) => {
    if (score >= 81) return 'text-orange-500 bg-orange-50 border-orange-100';
    if (score >= 61) return 'text-purple-500 bg-purple-50 border-purple-100';
    return 'text-zinc-500 bg-zinc-50 border-zinc-100';
  };

  const handleCardClick = () => {
    trackProductClick({
      product_id: product.id,
      product_name: name,
      product_price: price,
      product_rating: rating,
      category,
      position,
      list_type: listType,
    });
  };

  const handleAmazonLinkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    trackAmazonLinkClick({
      product_id: product.id,
      product_name: name,
      product_price: price,
      product_rating: rating,
      category,
      position,
      affiliate_link: product.affiliateUrl,
    });
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.8, delay: position % 3 * 0.1, ease: [0.25, 1, 0.5, 1] }}
      onClick={handleCardClick}
      className="group relative bg-white border border-zinc-200 rounded-xl p-6 transition-all duration-200 hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] hover:border-zinc-300 cursor-pointer overflow-hidden flex flex-col h-full"
    >

      {/* Card Header */}
      <div className="flex justify-between items-center mb-5 relative z-10">
         <StoreBadge store={product.store} />
         <div className="flex items-center gap-2">
            {product.viralityScore !== undefined && product.viralityScore > 0 && (
              <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-semibold ${getViralityStyle(product.viralityScore)}`}>
                 <Flame className="w-3.5 h-3.5" />
                 {product.viralityScore}
              </div>
            )}
            <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-yellow-50 border border-yellow-100">
                <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                <span className="text-xs font-semibold text-zinc-900">{rating.toFixed(1)}</span>
            </div>
         </div>
      </div>

      {/* Main Metadata */}
      <div className="flex-grow space-y-4 relative z-10">
        <h3 className="text-lg font-semibold text-zinc-900 leading-snug group-hover:text-zinc-700 transition-colors duration-200">
            {name}
        </h3>

        {/* AI Insight Box */}
        <div className="relative p-4 bg-zinc-50 rounded-xl border border-zinc-100 group-hover:bg-white transition-colors duration-200">
            <Sparkles className="w-3.5 h-3.5 text-zinc-300 absolute -top-1.5 -left-1.5 bg-white rounded-full p-0.5 border border-zinc-100" />
            <p className="text-sm text-zinc-600 leading-relaxed italic">
                "{displayText}"
            </p>
            {shouldTruncate && (
              <button
                onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }}
                className="mt-2 text-xs font-medium text-zinc-500 hover:text-zinc-900 transition-colors duration-200"
              >
                {isExpanded ? t.productCard.readLess : t.productCard.readMore}
              </button>
            )}
        </div>

        {/* Tip Indicator */}
        <div className="flex items-start gap-2 px-0.5">
          <Info className="w-3.5 h-3.5 text-zinc-400 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-zinc-500 leading-relaxed">
            <span className="text-zinc-900 font-semibold">{t.productCard.tipLabel}</span> {t.productCard.tipText}
          </p>
        </div>
      </div>

      {/* Price & Action */}
      <div className="mt-6 pt-5 border-t border-zinc-100 flex items-center justify-between gap-4 relative z-10">
        <div className="flex flex-col">
          <span className="text-[10px] font-medium text-zinc-400 uppercase tracking-wide mb-1">{t.productCard.averagePrice}</span>
          <p className="text-2xl font-black text-zinc-900 tracking-tight">
              <span className="text-xs font-semibold text-zinc-500 mr-1">{product.currency || 'R$'}</span>
              {price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </div>
        <a
          href={product.affiliateUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleAmazonLinkClick}
          className="inline-flex items-center justify-center gap-2 h-11 px-5 bg-zinc-900 text-white text-xs font-semibold rounded-xl hover:bg-zinc-800 transition-all duration-200 shadow-[0_1px_3px_rgba(0,0,0,0.12),0_4px_8px_rgba(0,0,0,0.08)] hover:shadow-[0_2px_4px_rgba(0,0,0,0.12),0_8px_16px_rgba(0,0,0,0.10)] group/btn"
        >
          {t.productCard.seeOffer}
          <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform duration-200" />
        </a>
      </div>
    </motion.div>
  );
};