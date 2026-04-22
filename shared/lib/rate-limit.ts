import { Ratelimit } from '@upstash/ratelimit'
import { NextResponse } from 'next/server'
import { redis } from './redis'

// Sliding-window limiters keyed by operation type.
// All return null (= allowed) when Redis is not configured.
const limiters = {
  // Standard write mutations — create invoice, create client, etc.
  writes: redis
    ? new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(30, '1 m'), prefix: 'invox:rl:writes' })
    : null,

  // PDF generation is CPU-intensive — tighter limit.
  pdf: redis
    ? new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(10, '1 m'), prefix: 'invox:rl:pdf' })
    : null,

  // Auth sync is called once per login — allow bursts but cap abuse.
  auth: redis
    ? new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(10, '1 m'), prefix: 'invox:rl:auth' })
    : null,
} as const

type LimiterKey = keyof typeof limiters

/**
 * Check the rate limit for a given operation and identifier (usually user.id).
 * Returns null when the request is allowed.
 * Returns a 429 NextResponse with Retry-After when the limit is exceeded.
 */
export async function rateLimit(
  type: LimiterKey,
  identifier: string,
): Promise<NextResponse | null> {
  const limiter = limiters[type]
  if (!limiter) return null

  const { success, limit, remaining, reset } = await limiter.limit(identifier)
  if (success) return null

  const retryAfter = Math.ceil((reset - Date.now()) / 1000)
  return NextResponse.json(
    { error: { code: 'rate_limited', message: 'Too many requests — please slow down.' } },
    {
      status: 429,
      headers: {
        'X-RateLimit-Limit': String(limit),
        'X-RateLimit-Remaining': String(remaining),
        'X-RateLimit-Reset': String(reset),
        'Retry-After': String(retryAfter),
      },
    },
  )
}
