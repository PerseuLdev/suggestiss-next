# Migração Vite → Next.js - Plano de Execução

**Projeto:** Suggestiss
**Data Início:** 2025-01-14
**Estimativa Total:** 11-16 horas (2-3 dias)
**Status:** 🟢 Em Progresso

---

## 🚀 Estratégia: Repositório Separado

**Decisão:** Criar repositório separado `suggestiss-next` em paralelo ao Vite.

**Repositórios:**
- **Vite (atual):** https://github.com/PerseuLdev/Suggestiss
- **Next.js (novo):** https://github.com/PerseuLdev/suggestiss-next

**Vantagens:**
- ✅ Projetos isolados durante migração
- ✅ Permite testes em produção sem afetar Vite
- ✅ Rollback instantâneo se necessário
- ✅ Ambos podem rodar em paralelo
- ✅ Facilita comparação de performance

**Processo de Deploy:**
1. Deploy Next.js em domínio temporário (ex: `next.suggestiss.com`)
2. Testar completamente
3. Quando 100% OK, trocar DNS principal

---

## 📊 Progresso Geral

```
[██████░░░░░░] 50% - Migração Técnica Completa | i18n e Deploy Pendentes

Fases Completas: 5/11
```

**Milestones Completas:**
- ✅ Milestone 1: Preparação e Backup
- ✅ Milestone 2: Setup Next.js
- ✅ Milestone 3: Migração de Código
- ✅ Milestone 4: Meta Tags Dinâmicas
- ✅ Milestone 5: PWA/TWA Setup

**Próxima Milestone:**
- 🔄 Milestone 6: Migração para Next.js i18n (em andamento)

---

## 🎯 Objetivos da Migração

1. ✅ Meta tags dinâmicas por locale (.com vs .com.br)
2. ✅ Suporte a múltiplos subdomínios (beauty, tech, etc.)
3. ✅ SEO melhorado (SSR)
4. ✅ PWA/TWA nativo
5. ✅ Performance otimizada
6. ✅ Arquitetura escalável

---

## 📋 Milestones

### Milestone 1: Preparação e Backup ✅
**Status:** ✅ Completo
**Tempo:** 1h (Completado em 2025-01-15)
**Prioridade:** 🔴 Crítico

#### Tarefas
- [x] 1.1 Auditoria do projeto atual
  - [x] Listar todas as rotas/páginas
  - [x] Mapear dependências do Vite
  - [x] Documentar variáveis de ambiente
  - [x] Listar configurações customizadas
  - [x] Criar `Plans/MIGRATION_AUDIT.md`
- [x] 1.2 Criar branch `feature/migrate-to-nextjs`
- [x] 1.3 Criar backup completo
  - [x] Commit atual
  - [x] Tag `backup-vite-v1`
  - [x] Push para remote

#### Critérios de Conclusão
- ✓ Branch criada e pusheada
- ✓ Tag de backup criada
- ✓ Documentação de dependências completa

---

### Milestone 2: Setup Next.js ✅
**Status:** ✅ Completo
**Tempo:** 1h (Completado em 2025-01-15)
**Prioridade:** 🔴 Crítico

#### Tarefas
- [x] 2.1 Criar projeto Next.js paralelo
  ```bash
  npx create-next-app@latest suggestiss-next --typescript --tailwind --app --no-src-dir
  ```
- [x] 2.2 Configurar estrutura de pastas
  - [x] Criar `/app` directory
  - [x] Copiar `/components`
  - [x] Copiar `/hooks`
  - [x] Copiar `/services`
  - [x] Copiar `/contexts`
  - [x] Copiar `/locales`
  - [x] Copiar `/types`
  - [x] Copiar `/utils`
  - [x] Copiar `/public`
- [x] 2.3 Instalar dependências
  - [x] framer-motion
  - [x] lucide-react
  - [x] posthog-js
  - [x] @vercel/analytics
  - [x] @upstash/redis
  - [x] @google/genai
  - [x] next-pwa
  - [x] Outras do package.json atual

#### Critérios de Conclusão
- ✓ Projeto Next.js criado
- ✓ Estrutura de pastas configurada
- ✓ Todas as dependências instaladas
- ✓ `npm run dev` funciona

---

### Milestone 3: Migração de Código ✅
**Status:** ✅ Completo
**Tempo:** 2h (Completado em 2025-01-15)
**Prioridade:** 🔴 Crítico

#### Tarefas
- [x] 3.1 Criar `app/layout.tsx`
  - [x] Migrar meta tags do `index.html`
  - [x] Configurar fontes (Inter + Tenor Sans)
  - [x] Adicionar metadata básica
  - [x] Adicionar Open Graph tags
  - [x] Configurar PostHog analytics
  - [x] Adicionar JSON-LD structured data
- [x] 3.2 Criar `app/page.tsx`
  - [x] Copiar lógica do `App.tsx`
  - [x] Marcar como 'use client'
  - [x] Migrar estado e hooks
  - [x] Configurar Providers (Region, Analytics)
- [x] 3.3 Migrar estilos
  - [x] Copiar `index.css` → `app/globals.css`
  - [x] Configurar Tailwind CSS
  - [x] Ajustar imports de fontes
- [x] 3.4 Configurar `next.config.ts`
  - [x] Configurar images domains (Amazon)
  - [x] Adicionar PWA config (next-pwa)
  - [x] Configurar env variables
- [x] 3.5 Migrar variáveis de ambiente
  - [x] Renomear `VITE_*` → `NEXT_PUBLIC_*`
  - [x] Atualizar código que usa env vars
  - [x] Atualizar `.env.local`
  - [x] Fix import.meta.env → process.env

#### Critérios de Conclusão
- ✓ App renderiza sem erros
- ✓ Todas as páginas funcionam
- ✓ Estilos aplicados corretamente
- ✓ Variáveis de ambiente funcionando
- ✓ Código migrado para repositório separado

---

### Milestone 4: Meta Tags Dinâmicas
**Status:** ✅ Completo
**Tempo:** 2h (Completado em 2026-01-16)
**Prioridade:** 🟡 Alto

#### Tarefas
- [x] 4.1 Criar `middleware.ts`
  - [x] Detectar `.com` vs `.com.br`
  - [x] Detectar subdomínio (beauty, tech, etc.)
  - [x] Adicionar headers `x-locale` e `x-niche`
- [x] 4.2 Atualizar `app/layout.tsx`
  - [x] Implementar `generateMetadata()` dinâmico
  - [x] Meta tags PT-BR para .com.br
  - [x] Meta tags EN para .com
  - [x] Suporte a diferentes nichos
- [x] 4.3 Criar arquivo de traduções para meta tags
  - [x] `/locales/meta-tags.ts`
  - [x] Títulos e descrições em PT-BR
  - [x] Títulos e descrições em EN

#### Critérios de Conclusão
- ✓ Meta tags mudam baseado no domínio
- ✓ .com.br mostra PT-BR
- ✓ .com mostra EN
- ✓ Middleware funcionando

---

### Milestone 5: PWA/TWA Setup
**Status:** ✅ Completo
**Tempo:** 1h (Completado em 2026-01-16)
**Prioridade:** 🟢 Médio

#### Tarefas
- [x] 5.1 Configurar `next-pwa`
  - [x] Atualizar `next.config.js`
  - [x] Desabilitar em desenvolvimento
- [x] 5.2 Criar `public/manifest.json`
  - [x] Configurar name, short_name
  - [x] Adicionar ícones (192x192, 512x512)
  - [x] Configurar theme colors
  - [x] Configurar display mode
- [x] 5.3 Adicionar meta tags PWA no layout
  - [x] apple-mobile-web-app-capable
  - [x] apple-mobile-web-app-status-bar-style
  - [x] Links para manifest

#### Critérios de Conclusão
- ✓ PWA instalável no mobile
- ✓ Service worker funcionando
- ✓ "Add to Home Screen" aparece
- ✓ Ícones corretos no app instalado

---

### Milestone 6: Migração Next.js i18n
**Status:** 🔄 Em andamento
**Tempo:** 2-3h
**Prioridade:** 🔴 Crítico

**Contexto:** O projeto terá múltiplos idiomas no futuro em .com (EN, ES, FR, DE, etc.), então migrar para o sistema nativo de i18n do Next.js AGORA evita refatoração complexa depois e garante SEO correto desde o início.

**Estratégia:**
- `.com.br` → PT-BR fixo (sem prefixo na URL)
- `.com` → Múltiplos idiomas com prefixo (`/en`, `/es`, `/fr`, etc.)
- URLs com locale: `/en/`, `/es/`, `/pt-BR/`
- Hreflang automático para SEO
- Detecção automática de idioma do browser

#### Tarefas
- [ ] 6.1 Atualizar next.config.ts
  - [ ] Adicionar configuração i18n
  - [ ] Configurar locales: ['pt-BR', 'en', 'es', 'fr', 'de']
  - [ ] Configurar domains (suggestiss.com.br e suggestiss.com)
  - [ ] Definir defaultLocale por domínio
  - [ ] Habilitar localeDetection
- [ ] 6.2 Refatorar estrutura de traduções
  - [ ] Manter locales/pt-BR.json
  - [ ] Renomear locales/en-US.json → locales/en.json
  - [ ] Criar locales/es.json (placeholder para Espanhol)
  - [ ] Criar locales/fr.json (placeholder para Francês)
  - [ ] Atualizar tipos em locales/types.ts
- [ ] 6.3 Atualizar LanguageContext
  - [ ] Adaptar para usar router.locale do Next.js
  - [ ] Manter fallback para locales não configurados
  - [ ] Remover domainDetector (substituído por i18n do Next.js)
  - [ ] Atualizar changeLanguage para usar router.push com locale
- [ ] 6.4 Atualizar middleware.ts
  - [ ] Simplificar (Next.js i18n cuida do roteamento)
  - [ ] Manter apenas detecção de niche (subdomain)
  - [ ] Remover lógica de detecção de locale manual
- [ ] 6.5 Atualizar app/layout.tsx
  - [ ] Receber locale como prop do Next.js
  - [ ] Ajustar generateMetadata para usar locale
  - [ ] Garantir hreflang tags corretos
- [ ] 6.6 Testar localmente
  - [ ] /en → Inglês
  - [ ] /pt-BR → Português
  - [ ] Trocar idioma funciona
  - [ ] Redirecionamento automático funciona
  - [ ] Build sem erros

#### Critérios de Conclusão
- ✓ Next.js i18n configurado e funcionando
- ✓ URLs com locale funcionando (/en, /pt-BR)
- ✓ Troca de idioma funcionando
- ✓ Build local passando sem erros
- ✓ SEO: hreflang tags presentes
- ✓ Preparado para adicionar novos idiomas facilmente

---

### Milestone 7: Testes Locais
**Status:** ⬜ Não iniciado
**Tempo:** 2h
**Prioridade:** 🔴 Crítico

#### Tarefas
- [ ] 7.1 Testes funcionais
  - [ ] Homepage carrega
  - [ ] Header funciona
  - [ ] Footer funciona
  - [ ] Filtros funcionam
  - [ ] API calls funcionam
  - [ ] Imagens carregam
  - [ ] Navegação funciona
- [ ] 7.2 Testes de responsividade
  - [ ] Mobile (375px)
  - [ ] Tablet (768px)
  - [ ] Desktop (1440px)
- [ ] 7.3 Testes de meta tags
  - [ ] Simular .com (EN)
  - [ ] Simular .com.br (PT-BR)
  - [ ] Validar com Facebook Debugger
  - [ ] Validar com Twitter Card Validator
- [ ] 7.4 Performance (Lighthouse)
  - [ ] Performance > 90
  - [ ] SEO > 95
  - [ ] Accessibility > 90
  - [ ] Best Practices > 90

#### Critérios de Conclusão
- ✓ Todos os testes passando
- ✓ Lighthouse scores acima dos targets
- ✓ Zero erros no console
- ✓ Meta tags validadas

---

### Milestone 8: Configuração de Serviços Externos
**Status:** ⬜ Não iniciado
**Tempo:** 1-2h
**Prioridade:** 🔴 Crítico
**Documentação:** Ver `Plans/MIGRATION_LOOSE_ENDS.md` para detalhes

#### Tarefas
- [ ] 8.1 Verificar Supabase
  - [ ] Acessar Supabase Dashboard
  - [ ] Verificar Edge Function `api-proxy` deployada
  - [ ] Testar função manualmente
  - [ ] Verificar logs da função
- [ ] 8.2 Criar Novo Projeto Vercel
  - [ ] Importar repo `suggestiss-next`
  - [ ] Configurar Framework Preset (Next.js)
  - [ ] Copiar TODAS variáveis de ambiente (.env.local)
  - [ ] Fazer primeiro deploy Preview
  - [ ] Verificar build passando
- [ ] 8.3 Configurar PostHog
  - [ ] Adicionar 'use client' no AnalyticsProvider (se necessário)
  - [ ] Criar hook usePageTracking para App Router
  - [ ] Testar tracking em Preview
  - [ ] Verificar eventos no PostHog Dashboard
- [ ] 8.4 Verificar Upstash Redis
  - [ ] Acessar Upstash Dashboard
  - [ ] Verificar limites do plano
  - [ ] Testar rate limiting em Preview
- [ ] 8.5 Verificar Gemini API
  - [ ] Acessar Google AI Studio
  - [ ] Verificar quotas disponíveis
  - [ ] Testar chamadas em Preview
- [ ] 8.6 Configurar Vercel Analytics
  - [ ] Adicionar <Analytics /> no layout (se não estiver)
  - [ ] Adicionar <SpeedInsights /> no layout (se não estiver)
  - [ ] Verificar métricas após deploy
- [ ] 8.7 Criar sitemap.xml
  - [ ] Criar app/sitemap.ts
  - [ ] Testar em Preview
- [ ] 8.8 Criar robots.txt
  - [ ] Criar app/robots.ts
  - [ ] Testar em Preview

#### Critérios de Conclusão
- ✓ Projeto Vercel criado e funcionando
- ✓ Todas as variáveis de ambiente configuradas
- ✓ Supabase Edge Function testada
- ✓ PostHog tracking funcionando
- ✓ Todas as APIs respondendo corretamente

---

### Milestone 9: Deploy Preview e Testes
**Status:** ⬜ Não iniciado
**Tempo:** 2-3h
**Prioridade:** 🔴 Crítico

#### Tarefas
- [ ] 9.1 Configurar DNS Temporário
  - [ ] Configurar CNAME next.suggestiss.com
  - [ ] Apontar para Vercel
  - [ ] Aguardar propagação DNS (2-4h)
  - [ ] Testar acesso via next.suggestiss.com
- [ ] 9.2 Testes em Preview (next.suggestiss.com)
  - [ ] Testar todas as funcionalidades
  - [ ] Testar .com (EN) via headers/middleware
  - [ ] Testar .com.br (PT-BR) via headers/middleware
  - [ ] Testar compartilhamento WhatsApp
  - [ ] Verificar PostHog Analytics
  - [ ] Verificar Vercel Analytics
  - [ ] Testar PWA (instalação mobile)
- [ ] 9.3 Performance em Preview
  - [ ] Lighthouse Performance > 90
  - [ ] Lighthouse SEO > 95
  - [ ] Lighthouse Accessibility > 90
  - [ ] Verificar Web Vitals no Vercel
- [ ] 9.4 Correções (se necessário)
  - [ ] Corrigir bugs encontrados
  - [ ] Re-deploy Preview
  - [ ] Re-testar

#### Critérios de Conclusão
- ✓ Preview 100% funcional
- ✓ Todos os testes passando
- ✓ Performance aceitável
- ✓ Zero erros críticos

---

### Milestone 10: Deploy Produção
**Status:** ⬜ Não iniciado
**Tempo:** 2-3h (+ propagação DNS)
**Prioridade:** 🔴 Crítico

#### Tarefas
- [ ] 10.1 Preparação DNS
  - [ ] Reduzir TTL para 300s (24h antes)
  - [ ] Anotar IPs/CNAMEs atuais (rollback)
  - [ ] Backup configurações DNS
- [ ] 10.2 Configurar Domínios Principais no Vercel
  - [ ] Adicionar suggestiss.com
  - [ ] Adicionar suggestiss.com.br
  - [ ] Adicionar www.suggestiss.com (redirect)
  - [ ] Adicionar www.suggestiss.com.br (redirect)
  - [ ] Anotar novos CNAMEs fornecidos pelo Vercel
- [ ] 10.3 Atualizar DNS
  - [ ] Atualizar CNAME/A suggestiss.com
  - [ ] Atualizar CNAME/A suggestiss.com.br
  - [ ] Atualizar www redirects
  - [ ] Aguardar propagação (2-48h)
- [ ] 10.4 Merge para develop
  - [ ] Commit final com todas as mudanças
  - [ ] Merge branch feature → develop
  - [ ] Push develop
- [ ] 10.5 Deploy Produção Vercel
  - [ ] Verificar build automático
  - [ ] Aguardar deploy completar
  - [ ] Verificar certificados SSL ativos
- [ ] 10.6 Smoke Tests Produção
  - [ ] Acessar suggestiss.com
  - [ ] Acessar suggestiss.com.br
  - [ ] Verificar meta tags PT/EN
  - [ ] Testar funcionalidades principais
  - [ ] Verificar Analytics tracking
  - [ ] Testar compartilhamento social

#### Critérios de Conclusão
- ✓ Domínios principais apontando para Next.js
- ✓ SSL ativo em todos os domínios
- ✓ Site 100% funcional
- ✓ Analytics funcionando
- ✓ Zero erros críticos

---

### Milestone 11: Monitoramento Pós-Deploy
**Status:** ⬜ Não iniciado
**Tempo:** Contínuo (primeiras 48h)
**Prioridade:** 🟡 Alto

#### Tarefas
- [ ] 10.1 Monitorar métricas Vercel
  - [ ] Page views
  - [ ] Performance (Web Vitals)
  - [ ] Error rate
  - [ ] Bandwidth usage
- [ ] 10.2 Verificar Analytics
  - [ ] PostHog tracking funcionando
  - [ ] Vercel Analytics mostrando dados
  - [ ] Eventos sendo capturados
- [ ] 10.3 Monitorar erros
  - [ ] Verificar Logs do Vercel
  - [ ] Verificar Console do navegador
  - [ ] Configurar Sentry (opcional)
- [ ] 10.4 Validação final
  - [ ] SEO mantido (Google Search Console)
  - [ ] Links compartilhados funcionando (WhatsApp, Facebook, Twitter)
  - [ ] PWA instalável
  - [ ] Performance estável
- [ ] 10.5 Documentação
  - [ ] Atualizar README.md
  - [ ] Documentar processo de deploy
  - [ ] Criar changelog

#### Critérios de Conclusão
- ✓ Zero erros críticos em 48h
- ✓ Métricas estáveis
- ✓ Performance mantida/melhorada

---

## 🔄 Rollback Plan

### Se algo der errado:

#### Opção 1: Rollback Vercel (Recomendado)
1. Acessar Vercel Dashboard
2. Deployments → Deployment anterior
3. "Promote to Production"
4. **Tempo:** ~30 segundos

#### Opção 2: Git Revert
```bash
git revert HEAD
git push origin master
```
**Tempo:** ~2 minutos

#### Opção 3: Restaurar Backup
```bash
git checkout backup-vite-v1
git checkout -b hotfix/restore-vite
git push origin hotfix/restore-vite
# Merge para master via PR
```
**Tempo:** ~5 minutos

---

## 📝 Notas Importantes

### Durante a Migração
- ⚠️ **NÃO** fazer outras mudanças ao mesmo tempo
- ⚠️ **NÃO** pular testes
- ✅ Commit frequente (cada tarefa concluída)
- ✅ Manter branch develop funcional

### Comunicação
- [ ] Avisar equipe (se houver) antes de começar
- [ ] Avisar quando entrar em produção
- [ ] Documentar problemas encontrados

### Após Migração
- [ ] Deletar projeto Vite antigo (após 1 semana estável)
- [ ] Atualizar documentação do projeto
- [ ] Atualizar README com stack Next.js

---

## 📚 Referências

### Documentação do Projeto
- **[MIGRATION_LOOSE_ENDS.md](./MIGRATION_LOOSE_ENDS.md)** - ⚠️ **LEIA ANTES DE FAZER DEPLOY!** Detalhes sobre configurações externas (Supabase, Vercel, PostHog, DNS, etc.)

### Documentação Externa
- [Next.js Documentation](https://nextjs.org/docs)
- [Next.js Migration Guide](https://nextjs.org/docs/app/building-your-application/upgrading/from-vite)
- [next-pwa](https://github.com/shadowwalker/next-pwa)
- [Vercel Deployment](https://vercel.com/docs)
- [PWA Manifest](https://web.dev/add-manifest/)

### Serviços Utilizados
- [Vercel Dashboard](https://vercel.com/dashboard)
- [Supabase Dashboard](https://supabase.com/dashboard)
- [PostHog Dashboard](https://app.posthog.com)
- [Upstash Redis](https://console.upstash.com)
- [Google AI Studio](https://makersuite.google.com/app/apikey)

---

## ✅ Checklist Rápido Pré-Deploy

⚠️ **IMPORTANTE:** Consultar [MIGRATION_LOOSE_ENDS.md](./MIGRATION_LOOSE_ENDS.md) para detalhes completos

### Código e Funcionalidades
- [ ] Todas as funcionalidades do Vite funcionando
- [ ] Meta tags dinâmicas testadas (.com e .com.br)
- [ ] Lighthouse scores > 90 (Performance, SEO, Accessibility)
- [ ] Zero erros no console
- [ ] PWA instalável
- [ ] Imagens Amazon carregando

### Serviços Externos
- [ ] **Supabase:** Edge Function `api-proxy` deployada e testada
- [ ] **Vercel:** Projeto novo criado apontando para `suggestiss-next`
- [ ] **Vercel:** Variáveis de ambiente configuradas (Production + Preview)
- [ ] **PostHog:** Tracking funcionando (pageviews + eventos)
- [ ] **Vercel Analytics:** Componentes adicionados no layout
- [ ] **Upstash Redis:** Rate limiting testado
- [ ] **Gemini API:** Quotas verificadas

### Deploy e DNS
- [ ] DNS temporário configurado (next.suggestiss.com)
- [ ] Preview testado completamente
- [ ] Certificados SSL ativos
- [ ] Domínios principais configurados (aguardando apontar)
- [ ] Backup/rollback plan testado

### SEO e Metadata
- [ ] sitemap.xml criado
- [ ] robots.txt criado
- [ ] Meta tags Open Graph testadas
- [ ] Compartilhamento social funcionando (WhatsApp, Facebook, Twitter)

---

**Última atualização:** 2026-01-17
**Próxima revisão:** Antes de Milestone 7 (Configuração Serviços Externos)

**NOTA:** Para detalhes completos sobre configuração de serviços externos (Supabase, Vercel, PostHog, DNS, etc.), consulte **[MIGRATION_LOOSE_ENDS.md](./MIGRATION_LOOSE_ENDS.md)**
