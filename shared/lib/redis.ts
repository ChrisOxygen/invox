import { Redis } from '@upstash/redis'

// Redis is optional — when env vars are absent (local dev without Redis), all
// rate limiters fall back to a no-op and every request is allowed through.
export const redis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      })
    : null
