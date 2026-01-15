
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLanguage } from '../hooks/useLanguage';

export const Seo: React.FC = () => {
  const { locale, t } = useLanguage();
  
  // Define content based on translations
  const title = t.seo?.title || "Suggestiss - Smart Gift Suggestions with AI";
  const description = t.seo?.description || "Find the perfect gift with AI! Suggestiss offers personalized gift recommendations for all occasions.";
  const keywords = t.seo?.keywords || "gift suggestions, gift ideas, present ideas, ai gift finder, smart gift ideas";
  
  // Define canonical URL based on locale
  const canonicalUrl = locale === 'pt-BR' 
    ? 'https://suggestiss.com.br' 
    : 'https://suggestiss.com';

  const htmlLang = locale === 'pt-BR' ? 'pt-BR' : 'en-US';

  return (
    <Helmet>
      {/* HTML Attributes */}
      <html lang={htmlLang} />

      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      {/* Canonical & Hreflang */}
      <link rel="canonical" href={canonicalUrl} />
      <link rel="alternate" href="https://suggestiss.com" hreflang="en-us" />
      <link rel="alternate" href="https://suggestiss.com.br" hreflang="pt-br" />
      <link rel="alternate" href="https://suggestiss.com" hreflang="x-default" />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={t.seo?.ogTitle || title} />
      <meta property="og:description" content={t.seo?.ogDescription || description} />
      <meta property="og:locale" content={locale.replace('-', '_')} />
      <meta property="og:site_name" content="Suggestiss" />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={canonicalUrl} />
      <meta property="twitter:title" content={t.seo?.twitterTitle || title} />
      <meta property="twitter:description" content={t.seo?.twitterDescription || description} />
    </Helmet>
  );
};
