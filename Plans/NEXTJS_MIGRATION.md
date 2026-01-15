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
[████████░░] 75% - Migração Core Completa

Fases Completas: 3/8
```

**Milestones Completas:**
- ✅ Milestone 1: Preparação e Backup
- ✅ Milestone 2: Setup Next.js
- ✅ Milestone 3: Migração de Código

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
**Status:** ⬜ Não iniciado
**Tempo:** 1-2h
**Prioridade:** 🟡 Alto

#### Tarefas
- [ ] 4.1 Criar `middleware.ts`
  - [ ] Detectar `.com` vs `.com.br`
  - [ ] Detectar subdomínio (beauty, tech, etc.)
  - [ ] Adicionar headers `x-locale` e `x-niche`
- [ ] 4.2 Atualizar `app/layout.tsx`
  - [ ] Implementar `generateMetadata()` dinâmico
  - [ ] Meta tags PT-BR para .com.br
  - [ ] Meta tags EN para .com
  - [ ] Suporte a diferentes nichos
- [ ] 4.3 Criar arquivo de traduções para meta tags
  - [ ] `/locales/meta-tags.ts`
  - [ ] Títulos e descrições em PT-BR
  - [ ] Títulos e descrições em EN

#### Critérios de Conclusão
- ✓ Meta tags mudam baseado no domínio
- ✓ .com.br mostra PT-BR
- ✓ .com mostra EN
- ✓ Middleware funcionando

---

### Milestone 5: PWA/TWA Setup
**Status:** ⬜ Não iniciado
**Tempo:** 1h
**Prioridade:** 🟢 Médio

#### Tarefas
- [ ] 5.1 Configurar `next-pwa`
  - [ ] Atualizar `next.config.js`
  - [ ] Desabilitar em desenvolvimento
- [ ] 5.2 Criar `public/manifest.json`
  - [ ] Configurar name, short_name
  - [ ] Adicionar ícones (192x192, 512x512)
  - [ ] Configurar theme colors
  - [ ] Configurar display mode
- [ ] 5.3 Adicionar meta tags PWA no layout
  - [ ] apple-mobile-web-app-capable
  - [ ] apple-mobile-web-app-status-bar-style
  - [ ] Links para manifest

#### Critérios de Conclusão
- ✓ PWA instalável no mobile
- ✓ Service worker funcionando
- ✓ "Add to Home Screen" aparece
- ✓ Ícones corretos no app instalado

---

### Milestone 6: Testes Locais
**Status:** ⬜ Não iniciado
**Tempo:** 2h
**Prioridade:** 🔴 Crítico

#### Tarefas
- [ ] 6.1 Testes funcionais
  - [ ] Homepage carrega
  - [ ] Header funciona
  - [ ] Footer funciona
  - [ ] Filtros funcionam
  - [ ] API calls funcionam
  - [ ] Imagens carregam
  - [ ] Navegação funciona
- [ ] 6.2 Testes de responsividade
  - [ ] Mobile (375px)
  - [ ] Tablet (768px)
  - [ ] Desktop (1440px)
- [ ] 6.3 Testes de meta tags
  - [ ] Simular .com (EN)
  - [ ] Simular .com.br (PT-BR)
  - [ ] Validar com Facebook Debugger
  - [ ] Validar com Twitter Card Validator
- [ ] 6.4 Performance (Lighthouse)
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

### Milestone 7: Deploy e Validação
**Status:** ⬜ Não iniciado
**Tempo:** 1-2h
**Prioridade:** 🔴 Crítico

#### Tarefas
- [ ] 7.1 Deploy Preview
  - [ ] Push branch para GitHub
  - [ ] Verificar preview URL do Vercel
  - [ ] Configurar variáveis de ambiente no Vercel
- [ ] 7.2 Configurar domínios
  - [ ] Adicionar suggestiss.com
  - [ ] Adicionar suggestiss.com.br
  - [ ] Configurar redirects www
- [ ] 7.3 Testes em Preview
  - [ ] Testar .com (EN)
  - [ ] Testar .com.br (PT-BR)
  - [ ] Testar compartilhamento WhatsApp
  - [ ] Verificar Analytics
- [ ] 7.4 Merge para develop
  - [ ] Code review (se houver equipe)
  - [ ] Merge branch
  - [ ] Testar staging
- [ ] 7.5 Deploy produção
  - [ ] Merge develop → master
  - [ ] Verificar deploy produção
  - [ ] Smoke tests

#### Critérios de Conclusão
- ✓ Preview funcionando
- ✓ Domínios configurados
- ✓ Produção no ar
- ✓ Meta tags funcionando no WhatsApp

---

### Milestone 8: Monitoramento Pós-Deploy
**Status:** ⬜ Não iniciado
**Tempo:** Contínuo (primeiras 48h)
**Prioridade:** 🟡 Alto

#### Tarefas
- [ ] 8.1 Monitorar métricas Vercel
  - [ ] Page views
  - [ ] Performance (Web Vitals)
  - [ ] Error rate
- [ ] 8.2 Verificar Analytics
  - [ ] Google Analytics funcionando
  - [ ] PostHog tracking
  - [ ] Conversões mantidas
- [ ] 8.3 Monitorar erros
  - [ ] Verificar console do Vercel
  - [ ] Configurar Sentry (opcional)
- [ ] 8.4 Validação final
  - [ ] SEO mantido (Google Search Console)
  - [ ] Links compartilhados funcionando
  - [ ] PWA instalável

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

- [Next.js Documentation](https://nextjs.org/docs)
- [Next.js Migration Guide](https://nextjs.org/docs/app/building-your-application/upgrading/from-vite)
- [next-pwa](https://github.com/shadowwalker/next-pwa)
- [Vercel Deployment](https://vercel.com/docs)
- [PWA Manifest](https://web.dev/add-manifest/)

---

## ✅ Checklist Rápido Pré-Deploy

Antes de fazer merge para master, verificar:

- [ ] Todas as funcionalidades do Vite funcionando
- [ ] Meta tags dinâmicas testadas (.com e .com.br)
- [ ] Lighthouse scores > 90
- [ ] Zero erros no console
- [ ] Analytics configurado
- [ ] PWA instalável
- [ ] Variáveis de ambiente configuradas no Vercel
- [ ] Domínios configurados
- [ ] Backup/rollback plan testado

---

**Última atualização:** 2025-01-14
**Próxima revisão:** Após cada milestone
