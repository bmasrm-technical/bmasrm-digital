import { createHash } from "crypto";

interface RateLimitEntry {
  timestamps: number[];
}

// In-memory rate limiting store
const rateLimitStore = new Map<string, RateLimitEntry>();

// Cleanup stale entries every 5 minutes
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of rateLimitStore.entries()) {
      entry.timestamps = entry.timestamps.filter((ts) => now - ts < 600000);
      if (entry.timestamps.length === 0) {
        rateLimitStore.delete(key);
      }
    }
  }, 300000);
}

const SALT = process.env.SUPABASE_SERVICE_ROLE_KEY || "bmasrm_rate_limit_salt";

export function hashClientKey(ipOrKey: string): string {
  return createHash("sha256")
    .update(`${SALT}:${ipOrKey || "127.0.0.1"}`)
    .digest("hex");
}

/**
 * Checks if client key exceeds `maxRequests` within `windowMs`
 */
export function checkRateLimit(
  clientKey: string,
  maxRequests: number,
  windowMs: number
): { success: boolean; remaining: number; resetMs: number } {
  const hashedKey = hashClientKey(clientKey);
  const now = Date.now();

  const entry = rateLimitStore.get(hashedKey) || { timestamps: [] };
  // Filter out timestamps outside the sliding window
  const validTimestamps = entry.timestamps.filter((ts) => now - ts < windowMs);

  if (validTimestamps.length >= maxRequests) {
    const oldest = validTimestamps[0];
    const resetMs = windowMs - (now - oldest);
    return {
      success: false,
      remaining: 0,
      resetMs,
    };
  }

  validTimestamps.push(now);
  rateLimitStore.set(hashedKey, { timestamps: validTimestamps });

  return {
    success: true,
    remaining: maxRequests - validTimestamps.length,
    resetMs: windowMs,
  };
}
