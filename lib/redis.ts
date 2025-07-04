// lib/redis.ts
import { Redis } from "@upstash/redis";

// Check for missing environment variables
if (!process.env.UPSTASH_REDIS_URL || !process.env.UPSTASH_REDIS_TOKEN) {
  throw new Error(
    "Upstash Redis environment variables are missing. Please set UPSTASH_REDIS_URL and UPSTASH_REDIS_TOKEN in your .env.local file"
  );
}

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL,
  token: process.env.UPSTASH_REDIS_TOKEN,
});

// Test connection on startup (optional)
(async () => {
  try {
    await redis.set("connection-test", "OK");
    const test = await redis.get("connection-test");
    if (test !== "OK") throw new Error("Redis connection test failed");
    console.log("✅ Redis connection established successfully");
  } catch (error) {
    console.error("❌ Failed to connect to Redis:", error);
    process.exit(1);
  }
})();
