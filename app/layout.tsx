import type { Metadata } from "next";
import { Inter, Tenor_Sans } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import { headers } from "next/headers";
import { getMetadata } from "@/locales/meta-tags";
import type { Locale } from "@/locales/types";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const tenorSans = Tenor_Sans({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-tenor",
  display: "swap",
});

// Dynamic metadata based on locale from middleware
export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers();
  const locale = (headersList.get("x-locale") || "en-US") as Locale;

  return getMetadata(locale);
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const locale = (headersList.get("x-locale") || "en-US") as Locale;

  // Map locale to HTML lang attribute
  const htmlLang = locale === "pt-BR" ? "pt-BR" : "en";

  return (
    <html lang={htmlLang} className={`${inter.variable} ${tenorSans.variable}`}>
      <head>
        <meta name="theme-color" content="#18181b" />

        {/* PWA Meta Tags */}
        <meta name="application-name" content="Suggestiss" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Suggestiss" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#18181b" />
        <meta name="msapplication-tap-highlight" content="no" />

        {/* PWA Icons */}
        <link rel="apple-touch-icon" sizes="192x192" href="/icon-192x192.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/icon-192x192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/icon-512x512.png" />

        {/* Manifest */}
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className="font-sans antialiased">
        {children}

        {/* PostHog Analytics */}
        <Script
          id="posthog-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.async=!0,p.src=s.api_host+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="capture identify alias people.set people.set_once set_config register register_once unregister opt_out_capturing has_opted_out_capturing opt_in_capturing reset isFeatureEnabled onFeatureFlags getFeatureFlag getFeatureFlagPayload reloadFeatureFlags group updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures getActiveMatchingSurveys getSurveys onSessionId".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
            `,
          }}
        />

        {/* JSON-LD Structured Data */}
        <Script
          id="json-ld-website"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Suggestiss",
              description: "Discover the most desired gifts and trending products of the moment. Well-reviewed gift ideas for all occasions.",
              url: "https://suggestiss.com",
              potentialAction: {
                "@type": "SearchAction",
                target: {
                  "@type": "EntryPoint",
                  urlTemplate: "https://suggestiss.com?q={search_term_string}",
                },
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />

        <Script
          id="json-ld-organization"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Suggestiss",
              url: "https://suggestiss.com",
              logo: "https://suggestiss.com/images/logo/svg/logo-full.svg",
              description: "Your daily source for the best gift ideas and trending products. We track what's hot so you never miss the perfect gift.",
              sameAs: [
                "https://twitter.com/suggestiss",
                "https://instagram.com/suggestiss",
              ],
            }),
          }}
        />
      </body>
    </html>
  );
}
