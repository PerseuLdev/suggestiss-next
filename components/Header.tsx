import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LanguageSelector } from './LanguageSelector';
import { useLanguage } from '../hooks/useLanguage';
import { Sparkles } from 'lucide-react';

interface HeaderProps {
  onScrollToConsultant: () => void;
  onScrollToTrending: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onScrollToConsultant, onScrollToTrending }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className="fixed w-full z-50 top-0 left-0 transition-all duration-300 ease-in-out px-4 py-4 sm:px-6 pointer-events-none">
      <div
        className={`container mx-auto max-w-7xl transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] pointer-events-auto
          ${isScrolled
            ? 'bg-white/95 backdrop-blur-md border-zinc-200 shadow-[0_1px_3px_rgba(0,0,0,0.08)] rounded-xl h-14 translate-y-0 px-6'
            : 'bg-transparent border-transparent h-16 translate-y-2 px-4'
          } border flex items-center justify-between`}
      >
        {/* Logo */}
        <div
          className="cursor-pointer group"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <img
            src="/images/logo/svg/logo-full-nobg.svg"
            alt="Suggestiss"
            className="h-12 w-auto max-w-[240px] transform transition-transform duration-200 group-hover:scale-105"
            style={{ aspectRatio: '900/472' }}
          />
        </div>

        {/* Navigation */}
        <div className="flex items-center gap-4 sm:gap-6">
          <button
            onClick={onScrollToConsultant}
            className="text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors duration-200 hidden md:block"
          >
            {t.nav.aiConsultant}
          </button>
          <button
            onClick={onScrollToTrending}
            className="text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors duration-200 hidden md:block"
          >
            {t.nav.trending}
          </button>

          <div className="h-4 w-px bg-zinc-200 hidden sm:block"></div>

          <LanguageSelector />
        </div>
      </div>
    </nav>
  );
};
