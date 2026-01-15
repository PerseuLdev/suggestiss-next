# Suggestiss Next.js

**Smart Gift Suggestions - Next.js Version**

This is the Next.js migration of Suggestiss, enabling dynamic meta tags, SSR, and better SEO.

---

## 📊 Migration Status

**Progress:** 🟢 **75% Complete** (3/8 milestones)

✅ Milestone 1: Preparação e Backup
✅ Milestone 2: Setup Next.js
✅ Milestone 3: Migração de Código
🔄 Milestone 4: Meta Tags Dinâmicas (Next)
⬜ Milestone 5: PWA/TWA Setup
⬜ Milestone 6: Testes Locais
⬜ Milestone 7: Deploy Vercel
⬜ Milestone 8: Monitoramento

📝 **Full migration plan:** See `Plans/NEXTJS_MIGRATION.md`
📋 **Audit document:** See `Plans/MIGRATION_AUDIT.md`

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🏗️ Tech Stack

- **Framework:** Next.js 15 (App Router)
- **UI:** React 19 + Tailwind CSS
- **Fonts:** Inter + Tenor Sans (Google Fonts)
- **Analytics:** PostHog + Vercel Analytics
- **Database:** Upstash Redis
- **AI:** Google Gemini
- **PWA:** next-pwa
- **State:** React Context API
- **Animations:** Framer Motion

---

## 📁 Project Structure

```
suggestiss-next/
├── app/
│   ├── layout.tsx      # Root layout with meta tags
│   ├── page.tsx        # Main page (client component)
│   └── globals.css     # Global styles
├── components/         # React components
├── hooks/             # Custom React hooks
├── services/          # API services (Gemini, Redis)
├── contexts/          # React contexts
├── utils/             # Utility functions
├── types/             # TypeScript types
├── locales/           # i18n translations
├── config/            # App configuration
├── public/            # Static assets
└── Plans/             # Migration documentation
```

---

## 🔑 Environment Variables

Create `.env.local`:

```env
# API Keys (server-side)
GEMINI_API_KEY=
OPENROUTER_API_KEY=
UPSTASH_REDIS_REST_TOKEN=
UPSTASH_REDIS_REST_URL=

# Client-side (NEXT_PUBLIC_*)
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_POSTHOG_HOST=
```

---

## 🌍 Repositories

- **Vite (current production):** https://github.com/PerseuLdev/Suggestiss
- **Next.js (this repo):** https://github.com/PerseuLdev/suggestiss-next

---

## 🎯 Key Features Implemented

✅ **App Router** with proper layout structure
✅ **Dynamic meta tags** ready for locale detection
✅ **PWA configuration** with next-pwa
✅ **PostHog analytics** integrated
✅ **All components** migrated from Vite
✅ **Environment variables** converted to Next.js format
✅ **Tailwind CSS** properly configured
✅ **Image optimization** for Amazon domains

---

## 🔄 Next Steps

1. **Milestone 4:** Implement dynamic meta tags by locale (.com vs .com.br)
2. **Milestone 5:** Configure PWA/TWA with proper manifest
3. **Milestone 6:** Test locally and fix any issues
4. **Milestone 7:** Deploy to Vercel and configure domains
5. **Milestone 8:** Monitor and optimize performance

---

## 📚 Documentation

- [Migration Plan](Plans/NEXTJS_MIGRATION.md) - Full migration roadmap
- [Audit Document](Plans/MIGRATION_AUDIT.md) - Current state analysis
- [Next.js Docs](https://nextjs.org/docs)
- [Vercel Deployment](https://vercel.com/docs)

---

## 🤝 Contributing

This is a migration-in-progress. The main branch may have incomplete features.

**Original project:** Built with Vite + React
**Migration goal:** Better SEO, SSR, and subdomain support

---

**Last Updated:** 2025-01-15
**Migration Progress:** 75% (3/8 milestones)
