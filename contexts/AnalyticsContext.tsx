// Analytics Context
// Provider para inicialização e configuração do PostHog

import React, { createContext, useEffect, useState, ReactNode } from 'react';
import {
  getDeviceType,
  getBrowser,
  isReturningUser,
  getFirstVisitDate,
  isDevelopment,
} from '../utils/analytics';

// Declare global posthog from script tag
declare global {
  interface Window {
    posthog: any;
  }
}

interface AnalyticsContextType {
  isReady: boolean;
}

export const AnalyticsContext = createContext<AnalyticsContextType>({
  isReady: false,
});

interface AnalyticsProviderProps {
  children: ReactNode;
  locale?: string;
  region?: string;
}

export const AnalyticsProvider: React.FC<AnalyticsProviderProps> = ({
  children,
  locale,
  region,
}) => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Only run on client-side
    if (typeof window === 'undefined' || !window.posthog) {
      return;
    }

    const initPostHog = () => {
      // Obter credenciais do ambiente
      const apiKey = import.meta.env.VITE_PUBLIC_POSTHOG_KEY;
      const apiHost = import.meta.env.VITE_PUBLIC_POSTHOG_HOST;

      if (!apiKey) {
        console.error(
          '[Analytics] PostHog API key not found. Analytics disabled.'
        );
        return;
      }

      if (!apiHost) {
        console.warn(
          '[Analytics] PostHog host not found. Using default: https://app.posthog.com'
        );
      }

      try {
        // Inicializar PostHog usando window.posthog
        window.posthog.init(apiKey, {
          api_host: apiHost || 'https://app.posthog.com',

          // Configurações de captura
          autocapture: false, // Desabilitar auto-capture (tracking manual)
          capture_pageview: false, // Controle manual de page views
          capture_pageleave: true, // Capturar quando usuário sai da página

          // Session Recording
          session_recording: {
            enabled: true,
            maskAllInputs: true, // Mascarar todos os inputs por privacidade
            maskTextSelector: '.sensitive, [data-sensitive]', // Mascarar elementos sensíveis
            recordCrossOriginIframes: false,
          },

          // Privacy & Compliance
          respect_dnt: true, // Respeitar "Do Not Track"
          opt_out_capturing_by_default: false,

          // Performance
          persistence: 'localStorage+cookie', // Melhor persistência

          // Debug (apenas em dev)
          loaded: (ph: any) => {
            if (isDevelopment()) {
              console.log('[Analytics] PostHog initialized successfully');
              console.log('[Analytics] Distinct ID:', ph.get_distinct_id());
            }

            // Definir propriedades iniciais do usuário DEPOIS que carregar
            const userProperties = {
              locale: locale || 'unknown',
              region: region || 'unknown',
              device_type: getDeviceType(),
              browser: getBrowser(),
              first_visit: getFirstVisitDate() || new Date().toISOString(),
              returning_user: isReturningUser(),
            };

            ph.setPersonProperties(userProperties);

            if (isDevelopment()) {
              console.log('[Analytics] User properties set:', userProperties);
            }

            // Trackear início de sessão
            ph.capture('session_started', {
              locale,
              region,
              device_type: getDeviceType(),
            });

            setIsReady(true);
          },
        });
      } catch (error) {
        console.error('[Analytics] Failed to initialize PostHog:', error);
      }
    };

    // Aguardar PostHog carregar
    if (window.posthog) {
      initPostHog();
    } else {
      // Retry after a short delay
      setTimeout(() => {
        if (window.posthog) {
          initPostHog();
        }
      }, 100);
    }
  }, []); // Rodar apenas uma vez no mount

  // Atualizar propriedades do usuário quando locale/region mudarem
  useEffect(() => {
    if (isReady && (locale || region) && window.posthog) {
      window.posthog.setPersonProperties({
        locale: locale || undefined,
        region: region || undefined,
      });

      if (isDevelopment()) {
        console.log('[Analytics] User properties updated:', { locale, region });
      }
    }
  }, [locale, region, isReady]);

  return (
    <AnalyticsContext.Provider value={{ isReady }}>
      {children}
    </AnalyticsContext.Provider>
  );
};
