import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../hooks/useLanguage';
import { ArrowRight } from 'lucide-react';

interface HeroProps {
  onScrollToConsultant: () => void;
  onScrollToTrending: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onScrollToConsultant, onScrollToTrending }) => {
  const { t } = useLanguage();

  return (
    <section className="relative min-h-[80vh] flex items-center justify-center pt-24 pb-12 lg:pt-32 lg:pb-16 overflow-hidden bg-white">

      {/* Subtle Static Gradient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none -z-10">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-purple-50/40 rounded-full blur-[100px]" />
        <div className="absolute bottom-[10%] right-[-5%] w-[40%] h-[40%] bg-blue-50/30 rounded-full blur-[80px]" />
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
          className="flex flex-col items-center text-center max-w-4xl mx-auto"
        >

            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-50 border border-zinc-200 text-zinc-600 text-xs uppercase tracking-wide font-medium mb-8 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
                <span className="relative flex h-2 w-2">
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-zinc-900"></span>
                </span>
                {t.hero.badge}
            </div>

            {/* Title */}
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter text-zinc-900 mb-8 leading-[0.9]">
              {t.hero.title}
              <span className="block text-zinc-400 mt-3">
                {t.hero.titleHighlight}
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base md:text-lg text-zinc-600 max-w-2xl mx-auto mb-12 leading-relaxed">
              {t.hero.subtitle}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                    onClick={onScrollToConsultant}
                    className="w-full sm:w-auto px-8 py-4 bg-zinc-900 text-white font-semibold rounded-xl hover:bg-zinc-800 transition-all duration-200 flex items-center justify-center gap-2 shadow-[0_1px_3px_rgba(0,0,0,0.12),0_4px_8px_rgba(0,0,0,0.08)] hover:shadow-[0_2px_4px_rgba(0,0,0,0.12),0_8px_16px_rgba(0,0,0,0.10)] group"
                >
                    <span>{t.hero.ctaGift}</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform duration-200" />
                </button>

                 <button
                    onClick={onScrollToTrending}
                    className="w-full sm:w-auto px-8 py-4 bg-white border border-zinc-200 text-zinc-900 font-semibold rounded-xl hover:bg-zinc-50 hover:border-zinc-300 transition-all duration-200 shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
                >
                    {t.hero.ctaExplore}
                </button>
            </div>

        </motion.div>
      </div>
      


    </section>
  );
};