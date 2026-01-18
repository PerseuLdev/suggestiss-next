import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import type { Locale } from "./locales/types";

// Detect locale based on domain
function getLocaleFromDomain(hostname: string): Locale {
  // .com.br domains → pt-BR
  if (hostname.includes(".com.br")) {
    return "pt-BR";
  }

  // .com domains → en-US (default)
  if (hostname.includes(".com")) {
    return "en-US";
  }

  // Localhost/Vercel preview → en-US (can be changed for testing)
  if (hostname.includes("localhost") || hostname.includes("vercel.app")) {
    return "en-US";
  }

  // Default fallback
  return "en-US";
}

// Detect subdomain/niche (optional for future use)
function getNicheFromSubdomain(hostname: string): string | null {
  const parts = hostname.split(".");

  // Examples: beauty.suggestiss.com, tech.suggestiss.com
  if (parts.length >= 3) {
    const subdomain = parts[0];

    // Ignore common subdomains
    if (["www", "app", "api", "admin"].includes(subdomain)) {
      return null;
    }

    return subdomain;
  }

  return null;
}

export function middleware(request: NextRequest) {
  const hostname = request.headers.get("host") || "";

  // Detect locale from domain
  const locale = getLocaleFromDomain(hostname);

  // Detect niche from subdomain (optional)
  const niche = getNicheFromSubdomain(hostname);

  // Clone the request headers and add custom headers
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-locale", locale);

  if (niche) {
    requestHeaders.set("x-niche", niche);
  }

  // Add pathname for potential future use
  requestHeaders.set("x-pathname", request.nextUrl.pathname);

  // Return response with custom headers
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

// Configure which routes to run middleware on
export const config = {
  // Run on all routes except static files and API routes
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files (images, etc.)
     */
    "/((?!_next/static|_next/image|favicon.ico|images|.*\\.svg|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.gif|.*\\.webp).*)",
  ],
};
