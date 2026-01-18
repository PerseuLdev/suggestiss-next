import type { Metadata } from "next";
import type { Locale } from "./types";
import ptBR from "./pt-BR.json";
import enUS from "./en-US.json";

export type MetaTagsConfig = {
  title: string;
  description: string;
  keywords: string;
  ogTitle: string;
  ogDescription: string;
  twitterTitle: string;
  twitterDescription: string;
  ogImage: string;
  locale: string;
  url: string;
};

const metaTags: Record<Locale, MetaTagsConfig> = {
  "pt-BR": {
    title: ptBR.seo.title,
    description: ptBR.seo.description,
    keywords: ptBR.seo.keywords,
    ogTitle: ptBR.seo.ogTitle,
    ogDescription: ptBR.seo.ogDescription,
    twitterTitle: ptBR.seo.twitterTitle,
    twitterDescription: ptBR.seo.twitterDescription,
    ogImage: "https://suggestiss.com.br/images/logo/png/og-suggestiss.png",
    locale: "pt_BR",
    url: "https://suggestiss.com.br",
  },
  "en-US": {
    title: enUS.seo.title,
    description: enUS.seo.description,
    keywords: enUS.seo.keywords,
    ogTitle: enUS.seo.ogTitle,
    ogDescription: enUS.seo.ogDescription,
    twitterTitle: enUS.seo.twitterTitle,
    twitterDescription: enUS.seo.twitterDescription,
    ogImage: "https://suggestiss.com/images/logo/png/og-suggestiss.png",
    locale: "en_US",
    url: "https://suggestiss.com",
  },
  // Fallback locales (using EN as base for now)
  "en-GB": {
    title: enUS.seo.title,
    description: enUS.seo.description,
    keywords: enUS.seo.keywords,
    ogTitle: enUS.seo.ogTitle,
    ogDescription: enUS.seo.ogDescription,
    twitterTitle: enUS.seo.twitterTitle,
    twitterDescription: enUS.seo.twitterDescription,
    ogImage: "https://suggestiss.com/images/logo/png/og-suggestiss.png",
    locale: "en_GB",
    url: "https://suggestiss.com",
  },
  "es-ES": {
    title: enUS.seo.title,
    description: enUS.seo.description,
    keywords: enUS.seo.keywords,
    ogTitle: enUS.seo.ogTitle,
    ogDescription: enUS.seo.ogDescription,
    twitterTitle: enUS.seo.twitterTitle,
    twitterDescription: enUS.seo.twitterDescription,
    ogImage: "https://suggestiss.com/images/logo/png/og-suggestiss.png",
    locale: "es_ES",
    url: "https://suggestiss.com",
  },
  "de-DE": {
    title: enUS.seo.title,
    description: enUS.seo.description,
    keywords: enUS.seo.keywords,
    ogTitle: enUS.seo.ogTitle,
    ogDescription: enUS.seo.ogDescription,
    twitterTitle: enUS.seo.twitterTitle,
    twitterDescription: enUS.seo.twitterDescription,
    ogImage: "https://suggestiss.com/images/logo/png/og-suggestiss.png",
    locale: "de_DE",
    url: "https://suggestiss.com",
  },
};

export function getMetadata(locale: Locale = "en-US"): Metadata {
  const config = metaTags[locale] || metaTags["en-US"];

  return {
    title: config.title,
    description: config.description,
    keywords: config.keywords,
    robots: "index, follow",
    authors: [{ name: "Suggestiss" }],
    openGraph: {
      type: "website",
      url: config.url,
      title: config.ogTitle,
      description: config.ogDescription,
      images: [
        {
          url: config.ogImage,
          width: 1200,
          height: 630,
          alt: config.ogTitle,
        },
      ],
      locale: config.locale,
      siteName: "Suggestiss",
    },
    twitter: {
      card: "summary_large_image",
      title: config.twitterTitle,
      description: config.twitterDescription,
      images: [config.ogImage],
    },
    icons: {
      icon: "/images/logo/svg/logo-icon.svg",
      apple: "/images/logo/svg/logo-icon.svg",
    },
    other: {
      "google-site-verification": "zN-CojicTmkYKxNUnGvj5PVc7jtCxmJBi-y5jQGj4PA",
      "build-version": "20251230-refresh-button",
    },
  };
}

export function getMetaTags(locale: Locale = "en-US"): MetaTagsConfig {
  return metaTags[locale] || metaTags["en-US"];
}
