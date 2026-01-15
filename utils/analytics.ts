// Analytics Utilities
// Funções utilitárias para analytics

import { ANALYTICS_EVENTS } from '../types/analytics';

/**
 * Constantes de eventos para fácil acesso
 */
export const EVENTS = ANALYTICS_EVENTS;

/**
 * Detecta o tipo de dispositivo do usuário
 */
export const getDeviceType = (): 'mobile' | 'tablet' | 'desktop' => {
  const width = window.innerWidth;
  if (width < 768) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
};

/**
 * Detecta o navegador do usuário
 */
export const getBrowser = (): string => {
  const userAgent = navigator.userAgent;

  if (userAgent.indexOf('Chrome') > -1) return 'Chrome';
  if (userAgent.indexOf('Safari') > -1) return 'Safari';
  if (userAgent.indexOf('Firefox') > -1) return 'Firefox';
  if (userAgent.indexOf('Edge') > -1) return 'Edge';
  if (userAgent.indexOf('Opera') > -1) return 'Opera';

  return 'Unknown';
};

/**
 * Verifica se está em ambiente de desenvolvimento
 */
export const isDevelopment = (): boolean => {
  return process.env.NODE_ENV === 'development';
};

/**
 * Sanitiza propriedades do evento (remove valores undefined/null)
 */
export const sanitizeEventProperties = (properties: Record<string, any>): Record<string, any> => {
  const sanitized: Record<string, any> = {};

  Object.keys(properties).forEach((key) => {
    const value = properties[key];
    if (value !== undefined && value !== null) {
      sanitized[key] = value;
    }
  });

  return sanitized;
};

/**
 * Formata categoria para analytics (lowercase, sem espaços)
 */
export const formatCategory = (category: string): string => {
  return category.toLowerCase().replace(/\s+/g, '_');
};

/**
 * Cria um ID único para sessão (se não existir)
 */
export const getOrCreateSessionId = (): string => {
  const SESSION_KEY = 'analytics_session_id';
  const SESSION_DURATION = 30 * 60 * 1000; // 30 minutos

  // Verificar se existe sessão ativa
  const stored = sessionStorage.getItem(SESSION_KEY);
  const lastActivity = sessionStorage.getItem('analytics_last_activity');

  if (stored && lastActivity) {
    const timeSinceLastActivity = Date.now() - parseInt(lastActivity);
    if (timeSinceLastActivity < SESSION_DURATION) {
      // Atualizar último timestamp de atividade
      sessionStorage.setItem('analytics_last_activity', Date.now().toString());
      return stored;
    }
  }

  // Criar nova sessão
  const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  sessionStorage.setItem(SESSION_KEY, sessionId);
  sessionStorage.setItem('analytics_last_activity', Date.now().toString());

  return sessionId;
};

/**
 * Verifica se usuário já visitou o site antes
 */
export const isReturningUser = (): boolean => {
  const FIRST_VISIT_KEY = 'analytics_first_visit';
  const firstVisit = localStorage.getItem(FIRST_VISIT_KEY);

  if (!firstVisit) {
    // Marcar primeira visita
    localStorage.setItem(FIRST_VISIT_KEY, new Date().toISOString());
    return false;
  }

  return true;
};

/**
 * Obtém data da primeira visita
 */
export const getFirstVisitDate = (): string | null => {
  const FIRST_VISIT_KEY = 'analytics_first_visit';
  return localStorage.getItem(FIRST_VISIT_KEY);
};

/**
 * Calcula profundidade de scroll (%)
 */
export const getScrollDepth = (): number => {
  const windowHeight = window.innerHeight;
  const documentHeight = document.documentElement.scrollHeight;
  const scrollTop = window.scrollY || document.documentElement.scrollTop;

  const maxScroll = documentHeight - windowHeight;
  const scrollPercentage = Math.round((scrollTop / maxScroll) * 100);

  return Math.min(scrollPercentage, 100);
};
