# Auditoria do Projeto - Migração Next.js

**Data:** 2025-01-14
**Projeto:** Suggestiss (Vite)
**Objetivo:** Documentação completa para migração Next.js

---

## 📁 Estrutura do Projeto Atual

### Componentes Principais (TSX)
```
components/
├── FilterBar.tsx
├── Footer.tsx
├── Header.tsx
├── Hero.tsx
├── GiftConsultantModal.tsx
├── GiftConsultantSection.tsx
├── LanguageSelector.tsx
├── LoadingSkeleton.tsx
├── ProductCard.tsx
└── Seo.tsx

contexts/
├── AnalyticsContext.tsx
├── LanguageContext.tsx
└── RegionContext.tsx

hooks/
├── useLanguage.ts
└── useRegionCache.ts

services/
├── apiProxy.ts
├── cacheService.ts
├── geolocation.ts
└── regionDetector.ts

config/
└── regions.ts

types/
└── analytics.ts

utils/
└── analytics.ts

locales/
└── (arquivos de tradução)

Root:
├── App.tsx (Componente principal)
├── index.tsx (Entry point)
├── types.ts
└── vite-env.d.ts
```

### Rotas/Páginas
**Atual:** SPA (Single Page Application)
- 1 rota principal: `/` (App.tsx)
- Sem routing adicional (todo conteúdo em uma página)

**Ação para Next.js:**
- Migrar App.tsx → `app/page.tsx`
- Manter estrutura SPA por enquanto
- Futuro: Adicionar rotas para nichos (`/beauty`, `/tech`, etc.)

---

## 📦 Dependências

### Dependências de Produção
```json
{
  "@google/genai": "^1.34.0",           // ✅ Manter
  "@upstash/redis": "^1.35.8",          // ✅ Manter
  "@vercel/analytics": "^1.6.1",        // ✅ Manter
  "@vercel/speed-insights": "^1.3.1",   // ✅ Manter
  "clsx": "^2.1.1",                     // ✅ Manter
  "framer-motion": "^12.26.2",          // ✅ Manter (Client Component)
  "lucide-react": "^0.562.0",           // ✅ Manter
  "posthog-js": "^1.313.0",             // ✅ Manter (Client Component)
  "react": "^19.2.3",                   // ✅ Next.js já inclui
  "react-dom": "^19.2.3",               // ✅ Next.js já inclui
  "react-helmet-async": "^2.0.5",       // ❌ Substituir por Metadata API
  "tailwind-merge": "^3.4.0"            // ✅ Manter
}
```

### Dependências de Desenvolvimento
```json
{
  "@testing-library/dom": "^10.4.1",
  "@testing-library/jest-dom": "^6.9.1",
  "@testing-library/react": "^16.3.1",
  "@types/node": "^22.14.0",           // ✅ Manter
  "@vitejs/plugin-react": "^5.0.0",    // ❌ Remover
  "dotenv": "^17.2.3",                 // ✅ Manter
  "jsdom": "^27.4.0",
  "supabase": "^2.67.3",               // ✅ Manter
  "tsx": "^4.21.0",
  "typescript": "~5.8.2",              // ✅ Manter
  "vite": "^6.2.0",                    // ❌ Remover
  "vitest": "^4.0.16"                  // ⚠️ Avaliar (Next.js usa Jest)
}
```

### Dependências Next.js a Adicionar
```bash
npm install next@latest
npm install next-pwa
npm install @next/font (já incluído no Next.js 13+)
```

---

## 🔐 Variáveis de Ambiente

### Arquivo: `.env.local`
```env
# ⚠️ ATENÇÃO: Renomear VITE_* para NEXT_PUBLIC_*

# APIs
GEMINI_API_KEY=***                              // ✅ Server-side (sem renomear)
OPENROUTER_API_KEY=***                          // ✅ Server-side (sem renomear)

# Upstash Redis
UPSTASH_REDIS_REST_TOKEN=***                    // ✅ Server-side (sem renomear)
UPSTASH_REDIS_REST_URL=***                      // ✅ Server-side (sem renomear)

# Vercel
VERCEL_OIDC_TOKEN=***                           // ✅ Automaticamente disponível

# Supabase (CLIENT-SIDE)
VITE_SUPABASE_ANON_KEY=***                      // ❌ Renomear → NEXT_PUBLIC_SUPABASE_ANON_KEY
VITE_SUPABASE_URL=***                           // ❌ Renomear → NEXT_PUBLIC_SUPABASE_URL

# PostHog (CLIENT-SIDE)
VITE_PUBLIC_POSTHOG_KEY=***                     // ❌ Renomear → NEXT_PUBLIC_POSTHOG_KEY
VITE_PUBLIC_POSTHOG_HOST=***                    // ❌ Renomear → NEXT_PUBLIC_POSTHOG_HOST
```

### Mudanças no Código
```typescript
// ANTES (Vite)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const posthogKey = import.meta.env.VITE_PUBLIC_POSTHOG_KEY

// DEPOIS (Next.js)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY
```

---

## ⚙️ Configurações Customizadas

### vite.config.ts
```typescript
{
  server: {
    port: 3000,                    // ✅ Next.js usa 3000 por padrão
    host: '0.0.0.0',              // ✅ Next.js suporta
    hmr: { overlay: true },       // ✅ Next.js tem HMR nativo
    watch: {
      usePolling: true,           // ⚠️ Windows specific
      interval: 100
    }
  },

  plugins: [
    react({ fastRefresh: true })  // ✅ Next.js tem Fast Refresh nativo
  ],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.')  // ✅ Migrar para tsconfig.json
    }
  },

  optimizeDeps: {
    include: ['posthog-js'],      // ✅ Next.js otimiza automaticamente
    exclude: []
  },

  build: {
    commonjsOptions: {
      include: [/posthog-js/, /node_modules/]  // ✅ Next.js já suporta
    }
  }
}
```

### Equivalente Next.js
```javascript
// next.config.js
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Server config
  // (Vercel configura automaticamente)

  // Images
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.amazonaws.com',
      },
    ],
  },

  // Transpile específico se necessário
  transpilePackages: ['posthog-js'],
}

module.exports = withPWA(nextConfig)
```

```json
// tsconfig.json - Alias
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

---

## 🎨 Features Específicas do Projeto

### 1. Internacionalização (i18n)
**Atual:**
- LanguageContext + LanguageSelector
- Arquivos em `/locales`
- Cliente-side switching

**Next.js:**
- ✅ Manter sistema atual (funciona bem)
- ✅ Adicionar meta tags dinâmicas baseadas em locale
- ✅ Middleware para detectar .com vs .com.br

### 2. Analytics
**Atual:**
- PostHog (client-side)
- Vercel Analytics
- Context API para tracking

**Next.js:**
- ✅ Manter PostHog (Client Component)
- ✅ Manter Vercel Analytics
- ✅ Context funciona normalmente

### 3. Cache/Redis
**Atual:**
- Upstash Redis
- cacheService.ts
- useRegionCache hook

**Next.js:**
- ✅ Manter Upstash
- ✅ Considerar Next.js Cache API (revalidate, tags)
- ✅ Hooks funcionam normalmente em Client Components

### 4. Region Detection
**Atual:**
- regionDetector.ts
- geolocation.ts
- RegionContext

**Next.js:**
- ✅ Manter lógica atual
- ✅ Adicionar middleware para SSR region detection
- ✅ Melhor UX com SSR

---

## 🚨 Pontos de Atenção

### Client Components Necessários
Estes componentes DEVEM ter `'use client'`:
- ✅ GiftConsultantModal (usa state)
- ✅ FilterBar (usa state)
- ✅ LanguageSelector (usa state)
- ✅ ProductCard (framer-motion animations)
- ✅ Hero (framer-motion)
- ✅ Qualquer componente que usa PostHog
- ✅ Componentes com AnalyticsContext

### Server Components (podem ser)
- ✅ Footer (se remover client logic)
- ✅ Header (depende de interatividade)

### Features que MELHORAM com Next.js
1. **Meta Tags:** Dinâmicas por locale/domínio
2. **SEO:** SSR melhora indexação
3. **Performance:** Otimizações automáticas
4. **Imagens:** next/image otimiza automaticamente
5. **Fonts:** next/font otimiza carregamento

---

## 📝 Scripts package.json

### Atual (Vite)
```json
{
  "dev": "vite",
  "build": "vite build",
  "preview": "vite preview",
  "test": "vitest",
  "supabase": "supabase",
  "clear-cache": "tsx clear-cache.ts"
}
```

### Novo (Next.js)
```json
{
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "next lint",
  "test": "vitest",           // Manter ou migrar para Jest
  "supabase": "supabase",
  "clear-cache": "tsx clear-cache.ts"
}
```

---

## 🔄 Arquivos a Migrar

### Copiar Diretamente (sem mudanças)
```
✅ components/
✅ hooks/
✅ services/
✅ config/
✅ types/
✅ utils/
✅ locales/
✅ public/
✅ .gitignore
✅ .env.local (com renomeação)
```

### Transformar/Adaptar
```
📝 App.tsx → app/page.tsx ('use client')
📝 index.tsx → (deletar, Next.js não usa)
📝 index.html → app/layout.tsx (meta tags)
📝 index.css → app/globals.css
📝 vite.config.ts → next.config.js
📝 package.json (scripts + dependências)
```

### Criar do Zero
```
🆕 middleware.ts (locale detection)
🆕 app/layout.tsx (root layout)
🆕 app/page.tsx (home page)
🆕 public/manifest.json (PWA)
```

---

## ✅ Checklist de Compatibilidade

### React Features
- [x] Hooks ✅ Funcionam normalmente
- [x] Context API ✅ Funciona (Client Components)
- [x] State Management ✅ Funciona
- [x] Framer Motion ✅ Funciona (Client Components)

### Bibliotecas Externas
- [x] PostHog ✅ Compatível (Client Component)
- [x] Upstash Redis ✅ Compatível
- [x] Supabase ✅ Compatível
- [x] Google Gemini ✅ Compatível
- [x] Lucide Icons ✅ Compatível
- [x] Tailwind CSS ✅ Nativo no Next.js

### Build/Deploy
- [x] Vercel ✅ Plataforma nativa do Next.js
- [x] Edge Functions ✅ Middleware nativo
- [x] Analytics ✅ Integração nativa

---

## 🎯 Resumo Executivo

### Complexidade da Migração
**Nível: MÉDIO** 🟡

**Por quê:**
- ✅ Projeto pequeno (1 rota principal)
- ✅ Dependências modernas e compatíveis
- ✅ Sem features bloqueantes
- ⚠️ Precisa marcar Client Components corretamente
- ⚠️ Renomear variáveis de ambiente

### Risco de Bugs
**Nível: BAIXO** 🟢

**Por quê:**
- ✅ Lógica de negócio não muda
- ✅ Componentes React iguais
- ✅ Rollback fácil (branch + deploy Vercel)
- ✅ Preview deploy antes de produção

### Tempo Estimado
**11-16 horas** (já documentado no plano principal)

### ROI (Return on Investment)
**ALTO** 🟢

**Ganhos:**
- ✅ Meta tags dinâmicas (resolve problema WhatsApp)
- ✅ SEO melhorado (SSR)
- ✅ Performance otimizada
- ✅ Pronto para múltiplos nichos
- ✅ PWA/TWA nativo
- ✅ Arquitetura escalável

---

**Auditoria completa. Pronto para iniciar Milestone 1.**
**Data:** 2025-01-14
