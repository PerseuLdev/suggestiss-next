// useAnalytics Hook
// Custom hook para tracking de eventos com PostHog

import { useCallback } from 'react';
import {
  AnalyticsEventName,
  EventProperties,
  UserProperties,
} from '../types/analytics';
import {
  sanitizeEventProperties,
  isDevelopment,
  getOrCreateSessionId,
} from '../utils/analytics';

/**
 * Hook personalizado para analytics
 * Fornece métodos para trackear eventos, page views e identificar usuários
 */
export const useAnalytics = () => {
  /**
   * Trackeia um evento personalizado
   * @param eventName - Nome do evento
   * @param properties - Propriedades do evento (opcional)
   */
  const trackEvent = useCallback(
    (eventName: AnalyticsEventName | string, properties?: EventProperties) => {
      // Não trackear em desenvolvimento (opcional - remover para testar em dev)
      if (isDevelopment()) {
        console.log('[Analytics DEV]', eventName, properties);
      }

      if (typeof window === 'undefined' || !window.posthog) {
        return;
      }

      try {
        // Sanitizar propriedades (remover undefined/null)
        const sanitizedProps = properties
          ? sanitizeEventProperties(properties)
          : {};

        // Adicionar metadata do sistema
        const enrichedProps = {
          ...sanitizedProps,
          session_id: getOrCreateSessionId(),
          timestamp: new Date().toISOString(),
        };

        // Enviar evento para PostHog
        window.posthog.capture(eventName, enrichedProps);

        if (isDevelopment()) {
          console.log('[Analytics] Event tracked:', eventName, enrichedProps);
        }
      } catch (error) {
        console.error('[Analytics] Error tracking event:', error);
      }
    },
    []
  );

  /**
   * Trackeia visualização de página
   * @param pageName - Nome da página
   * @param properties - Propriedades adicionais (opcional)
   */
  const trackPageView = useCallback(
    (pageName: string, properties?: EventProperties) => {
      if (isDevelopment()) {
        console.log('[Analytics DEV] Page view:', pageName, properties);
      }

      if (typeof window === 'undefined' || !window.posthog) {
        return;
      }

      try {
        const pageProps = {
          page: pageName,
          path: window.location.pathname,
          url: window.location.href,
          referrer: document.referrer,
          ...properties,
        };

        window.posthog.capture('$pageview', sanitizeEventProperties(pageProps));

        if (isDevelopment()) {
          console.log('[Analytics] Page view tracked:', pageProps);
        }
      } catch (error) {
        console.error('[Analytics] Error tracking page view:', error);
      }
    },
    []
  );

  /**
   * Define propriedades do usuário
   * @param properties - Propriedades do usuário
   */
  const identifyUser = useCallback((properties: UserProperties) => {
    if (isDevelopment()) {
      console.log('[Analytics DEV] User identified:', properties);
    }

    if (typeof window === 'undefined' || !window.posthog) {
      return;
    }

    try {
      // Define propriedades do usuário no PostHog
      window.posthog.setPersonProperties(sanitizeEventProperties(properties));

      if (isDevelopment()) {
        console.log('[Analytics] User properties set:', properties);
      }
    } catch (error) {
      console.error('[Analytics] Error identifying user:', error);
    }
  }, []);

  /**
   * Reseta identificação do usuário (logout)
   */
  const resetUser = useCallback(() => {
    if (isDevelopment()) {
      console.log('[Analytics DEV] User reset');
    }

    if (typeof window === 'undefined' || !window.posthog) {
      return;
    }

    try {
      window.posthog.reset();

      if (isDevelopment()) {
        console.log('[Analytics] User reset successfully');
      }
    } catch (error) {
      console.error('[Analytics] Error resetting user:', error);
    }
  }, []);

  /**
   * Obtém ID do usuário atual (anônimo ou identificado)
   */
  const getUserId = useCallback((): string | undefined => {
    if (typeof window === 'undefined' || !window.posthog) {
      return undefined;
    }

    try {
      return window.posthog.get_distinct_id();
    } catch (error) {
      console.error('[Analytics] Error getting user ID:', error);
      return undefined;
    }
  }, []);

  /**
   * Verifica se PostHog está inicializado
   */
  const isInitialized = useCallback((): boolean => {
    if (typeof window === 'undefined' || !window.posthog) {
      return false;
    }

    try {
      return window.posthog.__loaded;
    } catch {
      return false;
    }
  }, []);

  const trackProductImpression = useCallback((properties: EventProperties) => {
    trackEvent('product_impression', properties);
  }, [trackEvent]);

  const trackProductClick = useCallback((properties: EventProperties) => {
    trackEvent('product_click', properties);
  }, [trackEvent]);

  const trackAmazonLinkClick = useCallback((properties: EventProperties) => {
    trackEvent('amazon_link_click', properties);
  }, [trackEvent]);

  const trackLoadMoreClick = useCallback((properties: EventProperties) => {
    trackEvent('load_more_click', properties);
  }, [trackEvent]);

  const trackRefreshClick = useCallback((properties: EventProperties) => {
    trackEvent('refresh_click', properties);
  }, [trackEvent]);

  const trackCategoryClick = useCallback((properties: EventProperties) => {
    trackEvent('category_click', properties);
  }, [trackEvent]);

  const trackFilterApplied = useCallback((properties: EventProperties) => {
    trackEvent('filter_applied', properties);
  }, [trackEvent]);

  const trackSortChange = useCallback((properties: EventProperties) => {
    trackEvent('sort_change', properties);
  }, [trackEvent]);

  const trackSpecialFilterToggle = useCallback((properties: EventProperties) => {
    trackEvent('special_filter_toggle', properties);
  }, [trackEvent]);

  const trackGiftSearch = useCallback((properties: EventProperties) => {
    trackEvent('gift_search', properties);
  }, [trackEvent]);

  const trackLanguageChange = useCallback((properties: EventProperties) => {
    trackEvent('language_change', properties);
  }, [trackEvent]);

  return {
    trackEvent,
    trackPageView,
    identifyUser,
    resetUser,
    getUserId,
    isInitialized,
    trackProductImpression,
    trackProductClick,
    trackAmazonLinkClick,
    trackLoadMoreClick,
    trackRefreshClick,
    trackCategoryClick,
    trackFilterApplied,
    trackSortChange,
    trackSpecialFilterToggle,
    trackGiftSearch,
    trackLanguageChange,
  };
};
