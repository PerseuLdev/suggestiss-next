import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { Locale, Country } from '../locales/types';
import { useRegion } from '../contexts/RegionContext';
import { useAnalytics } from '../hooks/useAnalytics';

interface LanguageOption {
  code: Locale;
  name: string;
  flag: string;
}

interface RegionOption {
  code: Country;
  name: string;
  flag: string;
  domain: string;
  currency: string;
}

export const LanguageSelector: React.FC = () => {
  const { locale, deliveryCountry, amazonConfig, changeLanguage, changeDeliveryCountry } = useLanguage();
  const { changeRegion } = useRegion();
  const { trackLanguageChange, trackEvent } = useAnalytics();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Language options (interface language) - Only languages with full translations
  const languages: LanguageOption[] = [
    { code: 'pt-BR', name: 'Português', flag: '🇧🇷' },
    { code: 'en-US', name: 'English', flag: '🇺🇸' },
  ];

  // Region options (shipping/Amazon domain) - Only regions with affiliate tags
  const regions: RegionOption[] = [
    { code: 'BR', name: 'Brasil', flag: '🇧🇷', domain: 'amazon.com.br', currency: 'BRL' },
    { code: 'US', name: 'United States', flag: '🇺🇸', domain: 'amazon.com', currency: 'USD' },
  ];

  const [selectedLanguage, setSelectedLanguage] = useState<Locale>(locale);
  const [selectedRegion, setSelectedRegion] = useState<Country>(deliveryCountry);

  // Update local state when context changes
  useEffect(() => {
    setSelectedLanguage(locale);
  }, [locale]);

  useEffect(() => {
    setSelectedRegion(deliveryCountry);
  }, [deliveryCountry]);

  const currentLanguage = languages.find(l => l.code === selectedLanguage);
  const currentRegion = regions.find(r => r.code === selectedRegion);

  console.log('[LanguageSelector] Current state:', {
    locale,
    deliveryCountry,
    selectedLanguage,
    selectedRegion,
    currentLanguage,
    currentRegion
  });

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleApply = () => {
    console.log('[LanguageSelector] Applying changes:', {
      language: selectedLanguage,
      region: selectedRegion
    });

    const languageChanged = selectedLanguage !== locale;
    const regionChanged = selectedRegion !== deliveryCountry;

    // If nothing changed, just close the dropdown
    if (!languageChanged && !regionChanged) {
      setIsOpen(false);
      return;
    }

    // If both changed, save both to localStorage before reload
    if (languageChanged && regionChanged) {
      console.log('[LanguageSelector] Both language and region changed - saving both');
      trackLanguageChange({
        from_language: locale,
        to_language: selectedLanguage,
      });
      trackEvent('region_changed', {
        from_region: deliveryCountry,
        to_region: selectedRegion,
      });
      localStorage.setItem('locale', selectedLanguage);
      localStorage.setItem('preferredRegion', selectedRegion);
      window.location.reload();
      return;
    }

    // If only language changed
    if (languageChanged) {
      trackLanguageChange({
        from_language: locale,
        to_language: selectedLanguage,
      });
      changeLanguage(selectedLanguage);
      return;
    }

    // If only region changed
    if (regionChanged) {
      trackEvent('region_changed', {
        from_region: deliveryCountry,
        to_region: selectedRegion,
      });
      changeDeliveryCountry(selectedRegion);
      changeRegion(selectedRegion); // Update RegionContext for cache invalidation
      return;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 transition-colors"
        aria-label="Select language and shipping region"
        title={`${currentRegion?.name || 'Region'} - ${currentLanguage?.name || 'Language'}`}
      >
        <span className="text-xl" role="img" aria-label={`${currentRegion?.name} flag`}>
          {currentRegion?.flag || '🌐'}
        </span>
        <span className="text-sm font-medium text-zinc-700 hidden sm:inline">
          {(currentLanguage?.code || 'pt-BR').split('-')[0].toUpperCase()}
        </span>
        <svg
          className={`w-4 h-4 text-zinc-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-zinc-200 z-50">
          {/* Language Selection */}
          <div className="p-4 border-b border-zinc-100">
            <div className="flex items-center gap-2 mb-3">
              <svg className="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
              </svg>
              <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                Idioma de Leitura
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setSelectedLanguage(lang.code)}
                  className={`flex flex-col items-center gap-1 p-2 rounded-lg border transition-all ${
                    selectedLanguage === lang.code
                      ? 'border-zinc-900 bg-zinc-50'
                      : 'border-zinc-200 hover:border-zinc-300'
                  }`}
                >
                  <span className="text-2xl">{lang.flag}</span>
                  <span className="text-xs font-medium text-zinc-700">{lang.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Region Selection */}
          <div className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <svg className="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                País de Entrega
              </p>
            </div>
            <div className="space-y-1">
              {regions.map((region) => (
                <button
                  key={region.code}
                  onClick={() => setSelectedRegion(region.code)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
                    selectedRegion === region.code
                      ? 'bg-zinc-900 text-white'
                      : 'hover:bg-zinc-50'
                  }`}
                >
                  <span className="text-xl">{region.flag}</span>
                  <div className="flex-1 text-left">
                    <div className={`text-sm font-medium ${selectedRegion === region.code ? 'text-white' : 'text-zinc-900'}`}>
                      {region.name}
                    </div>
                    <div className={`text-xs ${selectedRegion === region.code ? 'text-zinc-300' : 'text-zinc-500'}`}>
                      {region.domain} • {region.currency}
                    </div>
                  </div>
                  {selectedRegion === region.code && (
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Apply Button */}
          <div className="p-4 border-t border-zinc-100">
            <button
              onClick={handleApply}
              className="w-full bg-zinc-900 text-white py-2 px-4 rounded-lg font-medium hover:bg-zinc-800 transition-colors"
            >
              Aplicar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
