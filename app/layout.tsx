import type { Metadata } from "next";
import { Inter, Tenor_Sans } from "next/font/google";
import "./globals.css";
import Script from "next/script";

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

export const metadata: Metadata = {
  title: "Suggestiss - Smart Gift Suggestions | AI-Powered Gift Ideas",
  description: "Discover trending gifts and viral products for all occasions. AI-powered recommendations to find the perfect gift every time.",
  keywords: "gift ideas, gift suggestions, present ideas, trending gifts, viral products, ai gift finder, smart gifts, gift recommendations, birthday gifts, christmas gifts, suggestiss",
  authors: [{ name: "Suggestiss" }],
  robots: "index, follow",
  openGraph: {
    type: "website",
    url: "https://suggestiss.com",
    title: "Suggestiss - Smart Gift Suggestions",
    description: "Discover trending gifts and products. AI-powered gift recommendations for all occasions.",
    images: [
      {
        url: "https://suggestiss.com/images/logo/png/og-suggestiss.png",
        width: 1200,
        height: 630,
        alt: "Suggestiss - Smart Gift Suggestions",
      },
    ],
    locale: "en_US",
    siteName: "Suggestiss",
  },
  twitter: {
    card: "summary_large_image",
    title: "Suggestiss - Smart Gift Ideas",
    description: "Discover trending gifts and viral products. Perfect for all occasions.",
    images: ["https://suggestiss.com/images/logo/png/og-suggestiss.png"],
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${tenorSans.variable}`}>
      <head>
        <meta name="theme-color" content="#18181b" />
        <link rel="canonical" href="https://suggestiss.com" />
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
