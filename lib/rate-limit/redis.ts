// lib/redis.ts
import Redis from "ioredis";

export const redis = new Redis(process.env.REDIS_URL!);

export async function rateLimit(key: string) {
  const now = Math.floor(Date.now() / 1000);
  const window = 60; // 1 min
  const limit = 2;

  const redisKey = `email:${key}:${Math.floor(now / window)}`;

  const count = await redis.incr(redisKey);

  if (count === 1) {
    await redis.expire(redisKey, window);
  }

  return count <= limit;
}
