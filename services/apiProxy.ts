/**
 * API Proxy Service
 * Communicates with Supabase Edge Functions to bypass client-side key exposure
 */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const FUNCTION_URL = `${SUPABASE_URL}/functions/v1/api-proxy`;

export interface RateLimitError extends Error {
  isRateLimited: true;
  resetIn: number;
  message: string;
}

export const callProxy = async (action: 'curated' | 'gift', payload: any) => {
  if (!SUPABASE_URL) {
    console.warn('[API Proxy] Supabase URL not configured. Ensure VITE_SUPABASE_URL is set.');
    // Fallback to local development if needed, or throw error
  }

  try {
    const response = await fetch(FUNCTION_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({ action, payload }),
    });

    // Log rate limit headers for debugging
    const rateLimitRemaining = response.headers.get('X-RateLimit-Remaining');
    const rateLimitReset = response.headers.get('X-RateLimit-Reset');
    if (rateLimitRemaining) {
      console.log(`[Rate Limit] Requests remaining: ${rateLimitRemaining}, Reset in: ${rateLimitReset}s`);
    }

    // Handle rate limit error (429)
    if (response.status === 429) {
      const errorData = await response.json();
      const rateLimitError = new Error(errorData.message || 'Rate limit exceeded') as RateLimitError;
      rateLimitError.isRateLimited = true;
      rateLimitError.resetIn = errorData.resetIn || 60;
      console.error(`[API Proxy] Rate limited: ${rateLimitError.message}`);
      throw rateLimitError;
    }

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || `Proxy error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`[API Proxy] ${action} failed:`, error);
    throw error;
  }
};

/**
 * Check if error is a rate limit error
 */
export const isRateLimitError = (error: any): error is RateLimitError => {
  return error && error.isRateLimited === true;
};
