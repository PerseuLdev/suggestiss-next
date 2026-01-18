import React, { createContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { Locale, Country, Translations, LanguageConfig, AmazonConfig } from '../locales/types';
import ptBR from '../locales/pt-BR.json';
import enUS from '../locales/en-US.json';
import {
  detectLanguage,
  detectDeliveryCountry,
  getLanguageConfig,
  getAmazonConfig
} from '../services/domainDetector';
import { detectLocaleByIP, detectCountryByIP } from '../services/geolocation';

interface LanguageContextProps {
  locale: Locale;
  deliveryCountry: Country;
  t: Translations;
  languageConfig: LanguageConfig;
  amazonConfig: AmazonConfig;
  changeLanguage: (locale: Locale) => void;
  changeDeliveryCountry: (country: Country) => void;
}

export const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  // Initialize with detected values immediately (prevents flash of wrong language)
  const initialLocale = detectLanguage();
  const initialCountry = detectDeliveryCountry();

  const [locale, setLocale] = useState<Locale>(initialLocale);
  const [deliveryCountry, setDeliveryCountry] = useState<Country>(initialCountry);
  const [languageConfig, setLanguageConfig] = useState<LanguageConfig>(getLanguageConfig(initialLocale));
  const [amazonConfig, setAmazonConfig] = useState<AmazonConfig>(getAmazonConfig(initialCountry));

  // Derive translations from locale using useMemo
  const t = useMemo<Translations>(() => {
    return locale === 'pt-BR' ? (ptBR as Translations) : (enUS as Translations);
  }, [locale]);

  useEffect(() => {
    const initializeLanguage = async () => {
      // NEW Priority hierarchy:
      // 1. User saved preference (HIGHEST - persists across domains)
      // 2. Domain detection (.com = EN, .br = PT-BR)
      // 3. Geolocation by IP (only on localhost)
      // 4. Fallback

      const detectedLocale = detectLanguage();
      const detectedCountry = detectDeliveryCountry();
      const hostname = window.location.hostname;
      const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1';

      // Check for saved preferences
      const savedLocale = localStorage.getItem('locale') as Locale;
      const savedCountry = localStorage.getItem('preferredRegion') as Country;

      const validLocales: Locale[] = ['pt-BR', 'en-US'];
      const validCountries: Country[] = ['BR', 'US'];

      let currentLocale: Locale;
      let currentCountry: Country;

      // 1. Check user preference FIRST (applies everywhere, not just localhost)
      if (savedLocale && validLocales.includes(savedLocale)) {
        currentLocale = savedLocale;
        console.log('[LanguageContext] Using user preference:', {
          locale: savedLocale,
          source: 'USER_PREFERENCE'
        });
      } else if (!isLocalhost) {
        // 2. On production domains, use domain detection as fallback
        currentLocale = detectedLocale;
        console.log('[LanguageContext] Using domain-based locale:', {
          hostname,
          locale: currentLocale,
          source: 'DOMAIN_DETECTION'
        });
      } else {
        // 3. On localhost, try geolocation
        const geoLocale = await detectLocaleByIP();
        currentLocale = geoLocale || detectedLocale;
        console.log('[LanguageContext] Using geolocation/fallback:', currentLocale);
      }

      // Same logic for country
      if (savedCountry && validCountries.includes(savedCountry)) {
        currentCountry = savedCountry;
        console.log('[LanguageContext] Using user country preference:', savedCountry);
      } else if (!isLocalhost) {
        currentCountry = detectedCountry;
      } else {
        const geoCountry = await detectCountryByIP();
        currentCountry = geoCountry || detectedCountry;
      }

      setLocale(currentLocale);
      setDeliveryCountry(currentCountry);
      setLanguageConfig(getLanguageConfig(currentLocale));
      setAmazonConfig(getAmazonConfig(currentCountry));
    };

    initializeLanguage();
  }, []);

  useEffect(() => {
    // Update HTML lang attribute when locale changes
    document.documentElement.lang = locale;
  }, [locale]);

  const changeLanguage = (newLocale: Locale) => {
    console.log('[LanguageContext] Changing language to:', newLocale);

    // Save preference to localStorage (synchronous - happens immediately)
    localStorage.setItem('locale', newLocale);

    // Reload page to apply changes
    // On reload, useEffect will read from localStorage and initialize with new locale
    window.location.reload();
  };

  const changeDeliveryCountry = (newCountry: Country) => {
    console.log('[LanguageContext] Changing delivery country to:', newCountry);

    // Save preference to localStorage (synchronous - happens immediately)
    localStorage.setItem('preferredRegion', newCountry);

    // Reload page to apply changes
    // On reload, useEffect will read from localStorage and initialize with new country
    window.location.reload();
  };

  return (
    <LanguageContext.Provider
      value={{
        locale,
        deliveryCountry,
        t,
        languageConfig,
        amazonConfig,
        changeLanguage,
        changeDeliveryCountry
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};
