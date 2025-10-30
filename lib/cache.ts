import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// Rate limiting
export const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(100, "1 m"), // 100 requests per minute
  analytics: true,
});

// Caching for aggregated stats
const CACHE_TTL = 300; // 5 minutes

export async function getCachedAnalytics(key: string) {
  try {
    const cached = await redis.get(`analytics:${key}`);
    return cached ? JSON.parse(cached as string) : null;
  } catch (error) {
    console.error("Cache read error:", error);
    return null;
  }
}

export async function setCachedAnalytics(key: string, data: any) {
  try {
    await redis.setex(`analytics:${key}`, CACHE_TTL, JSON.stringify(data));
  } catch (error) {
    console.error("Cache write error:", error);
  }
}

export async function invalidateAnalyticsCache() {
  try {
    const keys = await redis.keys("analytics:*");
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  } catch (error) {
    console.error("Cache invalidation error:", error);
  }
}