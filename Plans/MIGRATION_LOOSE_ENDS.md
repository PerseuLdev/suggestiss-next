# Pontas Soltas - Migração Vite → Next.js

**Data:** 2026-01-17
**Status:** 🟡 Análise de Configurações Externas

---

## 🎯 Objetivo

Documentar TODAS as configurações externas, serviços e ajustes necessários para a migração completa do Suggestiss para Next.js.

---

## 1️⃣ Supabase

### ❓ Preciso criar novo projeto?

**Resposta:** ❌ **NÃO precisa criar novo projeto**

### ✅ O que fazer:

#### 1.1 Variáveis de Ambiente
- ✅ **Já migradas corretamente** no `.env.local`:
  ```env
  NEXT_PUBLIC_SUPABASE_URL="https://mbxfntgiebfpgcoioxod.supabase.co"
  NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGc..."
  ```

#### 1.2 Edge Function (api-proxy)
- ✅ **Já está funcionando** (`services/apiProxy.ts`)
- ⚠️ **ATENÇÃO:** Verificar se a Edge Function está deployada no Supabase
- 📋 **TODO:** Testar chamadas à Edge Function após deploy Next.js

#### 1.3 Verificações Necessárias:

**Antes do Deploy:**
- [ ] 1.3.1 Acessar [Supabase Dashboard](https://supabase.com/dashboard)
- [ ] 1.3.2 Ir em **Edge Functions** → Verificar se `api-proxy` está deployada
- [ ] 1.3.3 Testar função manualmente no dashboard
- [ ] 1.3.4 Verificar logs da função

**Configurações de CORS (se necessário):**
```sql
-- Caso precise atualizar CORS headers na Edge Function
-- Adicionar domínio next.suggestiss.com (temporário)
-- Adicionar domínio suggestiss.com (produção)
```

#### 1.4 Potenciais Problemas:

⚠️ **Server vs Client Components:**
- ✅ Código atual usa `process.env.NEXT_PUBLIC_*` (correto para Client)
- ⚠️ Se migrar para Server Components no futuro, pode usar variáveis privadas

---

## 2️⃣ Vercel

### ❓ Abro outro projeto ou uso o existente?

**Resposta:** ✅ **Criar NOVO projeto Vercel** apontando para `suggestiss-next`

### ✅ Passo a Passo:

#### 2.1 Criar Novo Projeto Vercel

**Opção A: Via Dashboard (Recomendado)**
1. Acessar https://vercel.com/new
2. Importar repo `suggestiss-next`
3. Configurar:
   - **Framework Preset:** Next.js
   - **Root Directory:** `./`
   - **Build Command:** `npm run build`
   - **Output Directory:** `.next`
   - **Install Command:** `npm install`

**Opção B: Via CLI**
```bash
cd suggestiss-next
vercel --prod
```

#### 2.2 Configurar Variáveis de Ambiente

**No Vercel Dashboard → Settings → Environment Variables:**

Copiar TODAS as variáveis do `.env.local`:

```env
# APIs
GEMINI_API_KEY=AIzaSyCEbl7TFrx8vXxP4Ztr5HahzGZbVi72uwY
OPENROUTER_API_KEY=sk-or-v1-...

# Upstash Redis
UPSTASH_REDIS_REST_TOKEN=AYu5AAIncDE5...
UPSTASH_REDIS_REST_URL=https://growing-primate-35769.upstash.io

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://mbxfntgiebfpgcoioxod.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# PostHog Analytics
NEXT_PUBLIC_POSTHOG_KEY=phc_XZkX04zctpWncfOM20pNKHgTmGqyztAc98oYm8ApM81
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

⚠️ **IMPORTANTE:**
- Configurar para **Production**, **Preview** e **Development**
- Verificar se TODAS as variáveis estão presentes
- Testar build no Vercel antes de apontar domínios

#### 2.3 Configurar Domínios

**Domínios a configurar:**
1. **Temporário (Teste):**
   - `next.suggestiss.com` → Preview/Staging

2. **Produção (Quando aprovado):**
   - `suggestiss.com` (principal)
   - `suggestiss.com.br` (Brasil)
   - `www.suggestiss.com` (redirect → suggestiss.com)
   - `www.suggestiss.com.br` (redirect → suggestiss.com.br)

**Subdomínios (futuro):**
- `beauty.suggestiss.com`
- `tech.suggestiss.com`
- etc.

#### 2.4 Configurar DNS

**Após criar projeto Vercel:**

1. Vercel fornecerá:
   - CNAME record para domínios
   - A records (fallback)

2. No seu provedor DNS (Cloudflare/Namecheap/etc):
   ```
   # Exemplo (valores reais vêm do Vercel)
   CNAME suggestiss.com → cname.vercel-dns.com
   CNAME suggestiss.com.br → cname.vercel-dns.com
   ```

3. **Certificados SSL:**
   - ✅ Vercel provisiona automaticamente (Let's Encrypt)
   - ⏱️ Pode levar até 24h para propagar

#### 2.5 Comparação: Projeto Antigo vs Novo

| Aspecto | Projeto Vite (Antigo) | Projeto Next.js (Novo) |
|---------|----------------------|----------------------|
| Repo | `Suggestiss` | `suggestiss-next` |
| Build | Vite | Next.js |
| Domínios | suggestiss.com/br | Mesmo (migrar depois) |
| Env Vars | Mesmas | Copiar manualmente |
| Analytics | Mesmo projeto | Sem mudança necessária |

---

## 3️⃣ PostHog Analytics

### ❓ Mudo variáveis ou tenho que mudar mais algo?

**Resposta:** ✅ **Apenas variáveis (já feito)** + verificar App Router

### ✅ Status Atual:

- ✅ Variáveis corretas (`NEXT_PUBLIC_POSTHOG_*`)
- ✅ Provider criado (`contexts/AnalyticsContext.tsx`)
- ✅ Script tag no `layout.tsx`

### ⚠️ Verificações Necessárias:

#### 3.1 Client Components
- ✅ Provider está usando `'use client'` implicitamente
- ⚠️ Verificar se `window.posthog` está disponível apenas no cliente

#### 3.2 Next.js App Router Compatibility

**Possível problema:**
- PostHog pode não funcionar bem com Server Components
- Solução: Garantir que Provider seja Client Component

**Teste necessário:**
```tsx
// contexts/AnalyticsContext.tsx
'use client'; // ⚠️ Adicionar se ainda não tiver

export const AnalyticsProvider: React.FC<...> = ({ children }) => {
  // ...código atual
}
```

#### 3.3 Pageview Tracking

**⚠️ IMPORTANTE:** Next.js App Router não dispara eventos de rota como Vite

**Solução recomendada:**
```tsx
// app/layout.tsx ou hooks/usePageTracking.ts
'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export function usePageTracking() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (window.posthog) {
      window.posthog.capture('$pageview');
    }
  }, [pathname, searchParams]);
}
```

**📋 TODO:**
- [ ] Criar hook `usePageTracking`
- [ ] Adicionar no layout principal
- [ ] Testar tracking em Preview

#### 3.4 Session Recording

- ✅ Configurado no Provider
- ⚠️ Verificar se funciona com Next.js após deploy

---

## 4️⃣ Upstash Redis

### ✅ Status:

- ✅ Variáveis corretas
- ✅ Cliente configurado
- ⚠️ **ATENÇÃO:** Verificar rate limiting em produção

### 📋 Verificações:

**Antes do Deploy:**
- [ ] 4.1 Acessar [Upstash Dashboard](https://console.upstash.com/)
- [ ] 4.2 Verificar limites do plano atual
- [ ] 4.3 Configurar alertas de uso (se disponível)
- [ ] 4.4 Testar rate limiting em Preview

**Potencial Ajuste:**
```typescript
// Se precisar de rate limiting mais agressivo
// Configurar no Upstash Dashboard ou na Edge Function
```

---

## 5️⃣ Google Gemini API

### ✅ Status:

- ✅ Variável `GEMINI_API_KEY` configurada
- ⚠️ **ATENÇÃO:** Verificar quotas e limites

### 📋 Verificações:

**Antes do Deploy:**
- [ ] 5.1 Acessar [Google AI Studio](https://makersuite.google.com/app/apikey)
- [ ] 5.2 Verificar quotas disponíveis
- [ ] 5.3 Configurar billing alerts (se aplicável)
- [ ] 5.4 Testar chamadas após deploy

**Whitelist de Domínios:**
- ⚠️ Verificar se Gemini API tem restrições de domínio
- Adicionar `suggestiss.com` e `suggestiss.com.br` se necessário

---

## 6️⃣ Vercel Analytics & Speed Insights

### ✅ Status:

- ✅ Pacotes instalados:
  - `@vercel/analytics`
  - `@vercel/speed-insights`

### ⚠️ Configurações Necessárias:

#### 6.1 Verificar Imports no Layout

**Checklist:**
- [ ] Importar no `app/layout.tsx`:
  ```tsx
  import { Analytics } from '@vercel/analytics/react';
  import { SpeedInsights } from '@vercel/speed-insights/next';

  export default function RootLayout({ children }) {
    return (
      <html>
        <body>
          {children}
          <Analytics />
          <SpeedInsights />
        </body>
      </html>
    );
  }
  ```

#### 6.2 Configuração no Vercel Dashboard

- ✅ Analytics habilitado automaticamente (plano gratuito)
- ✅ Speed Insights habilitado automaticamente

**📋 TODO:**
- [ ] Verificar se métricas aparecem após primeiro deploy
- [ ] Configurar alertas de performance (opcional)

---

## 7️⃣ DNS e Domínios

### ⚠️ Configuração Crítica

#### 7.1 Estratégia de Migração

**Fase 1: Preview (Domínio Temporário)**
```
next.suggestiss.com → Vercel (projeto suggestiss-next)
suggestiss.com → Vercel (projeto antigo Vite)
```

**Fase 2: Migração Gradual**
```
suggestiss.com → Vercel (projeto suggestiss-next) 🆕
suggestiss.com.br → Vercel (projeto suggestiss-next) 🆕
vite.suggestiss.com → Vercel (projeto antigo) [backup]
```

**Fase 3: Produção Final**
```
suggestiss.com → Next.js
suggestiss.com.br → Next.js
[projeto Vite deletado após 1 semana estável]
```

#### 7.2 Configurações DNS

**No Provedor DNS (ex: Cloudflare):**

```bash
# Registros atuais (não mexer até Fase 2)
A suggestiss.com → [IP Vercel antigo]
CNAME www.suggestiss.com → suggestiss.com

# Novo registro (Fase 1)
CNAME next.suggestiss.com → cname.vercel-dns.com

# Migração (Fase 2)
A suggestiss.com → [IP Vercel novo]
A suggestiss.com.br → [IP Vercel novo]
```

#### 7.3 Propagação DNS

- ⏱️ TTL: Reduzir para 300s (5 min) antes da migração
- ⏱️ Propagação total: até 48h (geralmente 2-4h)
- ✅ Testar: `nslookup suggestiss.com`

---

## 8️⃣ SEO e Redirects

### ⚠️ Manter Rankings

#### 8.1 Sitemap

**📋 TODO:**
- [ ] Criar `app/sitemap.ts`:
  ```typescript
  import { MetadataRoute } from 'next';

  export default function sitemap(): MetadataRoute.Sitemap {
    return [
      {
        url: 'https://suggestiss.com',
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1,
      },
      // Adicionar outras páginas
    ];
  }
  ```

#### 8.2 Robots.txt

**📋 TODO:**
- [ ] Criar `app/robots.ts`:
  ```typescript
  import { MetadataRoute } from 'next';

  export default function robots(): MetadataRoute.Robots {
    return {
      rules: {
        userAgent: '*',
        allow: '/',
      },
      sitemap: 'https://suggestiss.com/sitemap.xml',
    };
  }
  ```

#### 8.3 Redirects (se houver mudança de URLs)

**Exemplo:**
```typescript
// next.config.ts
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/old-path',
        destination: '/new-path',
        permanent: true, // 301 redirect
      },
    ];
  },
};
```

---

## 9️⃣ Social Login & OAuth Callbacks

### ⚠️ Verificar se há

**Checklist de serviços que podem ter callbacks:**
- [ ] Google OAuth
- [ ] Facebook Login
- [ ] Twitter/X Login
- [ ] GitHub OAuth
- [ ] Apple Sign In

**Se houver, atualizar URLs de callback:**
```
Antigo: https://suggestiss.com/auth/callback
Novo: https://suggestiss.com/auth/callback (mesmo)
```

⚠️ Alguns provedores precisam whitelistar domínio novo

---

## 🔟 Webhooks e Integrações Externas

### ⚠️ Verificar se há

**Serviços que podem ter webhooks apontando para app:**
- [ ] Stripe (pagamentos)
- [ ] SendGrid (emails)
- [ ] Twilio (SMS)
- [ ] Zapier
- [ ] Discord/Slack notifications

**Se houver, atualizar URLs:**
```
Antigo: https://suggestiss.com/api/webhook
Novo: https://suggestiss.com/api/webhook (mesmo)
```

---

## 1️⃣1️⃣ Monitoramento e Error Tracking

### 📋 Recomendações

#### 11.1 Sentry (Opcional, mas Recomendado)

**Instalação:**
```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

**Benefícios:**
- ✅ Tracking de erros em produção
- ✅ Performance monitoring
- ✅ Source maps automáticos
- ✅ Alertas por email/Slack

#### 11.2 Vercel Logs

**Acessar:**
- Dashboard → Projeto → Logs
- Real-time streaming de logs
- Filtrar por errors/warnings

#### 11.3 PostHog Error Tracking

**Configurar:**
```typescript
// utils/analytics.ts
export const trackError = (error: Error, context?: Record<string, any>) => {
  if (window.posthog) {
    window.posthog.capture('error', {
      error_message: error.message,
      error_stack: error.stack,
      ...context,
    });
  }
};
```

---

## 1️⃣2️⃣ Performance & CDN

### ✅ Vercel Edge Network

- ✅ CDN global automático
- ✅ Edge caching
- ✅ Brotli compression
- ✅ HTTP/2 & HTTP/3

### ⚠️ Imagens

**Já configurado:**
```typescript
// next.config.ts
images: {
  remotePatterns: [
    { hostname: 'm.media-amazon.com' },
    { hostname: 'images-na.ssl-images-amazon.com' },
  ],
}
```

**📋 TODO:**
- [ ] Testar carregamento de imagens em Preview
- [ ] Verificar performance no Lighthouse

---

## 1️⃣3️⃣ Environment-Specific Configs

### 📋 Checklist

**Development:**
- [x] `.env.local` configurado
- [x] PostHog tracking desabilitado em dev
- [x] PWA desabilitado em dev

**Preview/Staging:**
- [ ] Variáveis configuradas no Vercel
- [ ] Domínio `next.suggestiss.com`
- [ ] Analytics funcionando

**Production:**
- [ ] Variáveis configuradas no Vercel
- [ ] Domínios principais configurados
- [ ] SSL ativo
- [ ] Analytics validado

---

## 1️⃣4️⃣ Backup e Rollback Plan

### ✅ Estratégia

**Se algo der errado:**

1. **Rollback DNS (Rápido):**
   ```
   Reverter DNS para IP antigo do Vite
   Tempo: ~5 minutos (+ propagação)
   ```

2. **Rollback Vercel (Instantâneo):**
   ```
   Dashboard → Deployments → Deployment anterior → Promote
   Tempo: ~30 segundos
   ```

3. **Manter Projeto Vite Ativo:**
   - Não deletar por pelo menos 1 semana
   - Manter domínio `vite.suggestiss.com` como fallback

---

## 1️⃣5️⃣ Documentação a Atualizar

### 📋 Pós-Deploy

**Após migração bem-sucedida:**
- [ ] README.md (stack, scripts, setup)
- [ ] CONTRIBUTING.md (se houver)
- [ ] Documentação de API (se houver)
- [ ] Changelog/Release notes

---

## 📊 Resumo: Checklist Pré-Deploy

### ⚠️ Crítico

- [ ] **Supabase Edge Function** deployada e testada
- [ ] **Vercel Projeto Novo** criado e configurado
- [ ] **Variáveis de Ambiente** copiadas para Vercel
- [ ] **DNS temporário** configurado (next.suggestiss.com)
- [ ] **Certificado SSL** ativo no Vercel
- [ ] **Build no Vercel** passando sem erros

### 🟡 Importante

- [ ] **PostHog tracking** testado em Preview
- [ ] **Vercel Analytics** aparecendo no dashboard
- [ ] **Gemini API** funcionando em Preview
- [ ] **Upstash Redis** rate limiting testado
- [ ] **Imagens Amazon** carregando corretamente
- [ ] **PWA** instalável em Preview

### 🟢 Opcional mas Recomendado

- [ ] **Sentry** configurado para error tracking
- [ ] **Sitemap.xml** gerado automaticamente
- [ ] **Robots.txt** configurado
- [ ] **Redirects** (se houver URLs antigas)
- [ ] **Monitoring** configurado (alertas)

---

## 🎯 Próximos Passos Recomendados

### Ordem de Execução:

1. **Milestone 6: Testes Locais** (em andamento)
   - Rodar todos os testes listados
   - Validar Lighthouse scores
   - Testar meta tags

2. **Criar Projeto Vercel**
   - Importar repo `suggestiss-next`
   - Configurar variáveis de ambiente
   - Deploy Preview

3. **Configurar DNS Temporário**
   - `next.suggestiss.com` → Vercel
   - Testar completamente

4. **Validação Completa**
   - Todas as features funcionando
   - Analytics tracking
   - Performance OK

5. **Migração DNS Produção**
   - Reduzir TTL DNS (24h antes)
   - Apontar domínios principais
   - Monitorar por 48h

6. **Cleanup**
   - Deletar projeto Vite (após 1 semana)
   - Remover domínio temporário

---

## 📞 Suporte de Emergência

**Se algo crítico quebrar:**

1. **Vercel Support:**
   - https://vercel.com/support
   - Dashboard → Help

2. **Supabase Support:**
   - https://supabase.com/dashboard/support
   - Discord: https://discord.supabase.com

3. **PostHog Support:**
   - https://posthog.com/support
   - Community: https://posthog.com/questions

---

**Última atualização:** 2026-01-17
**Próxima revisão:** Antes do deploy Preview
