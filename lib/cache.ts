// lib/cache.ts
import { Redis } from "@upstash/redis";

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL!,
  token: process.env.UPSTASH_REDIS_TOKEN!,
});

// Simple cache wrapper
export async function cachedQuery<T>(
  key: string,
  query: () => Promise<T>,
  ttl = 60
): Promise<T> {
  const cached = await redis.get(key);
  if (cached) return cached as T;
  const result = await query();
  await redis.setex(key, ttl, result);
  return result;
}
