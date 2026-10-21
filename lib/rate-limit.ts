// Fixed-window rate limiting kept in memory. It is per server instance and
// best-effort: serverless instances don't share it and it resets on cold
// starts, so it slows down abuse but is not a hard guarantee.

type Window = { count: number; resetAt: number }

const buckets = new Map<string, Map<string, Window>>()
const MAX_ENTRIES = 5000

// Client IP as seen by the platform: first x-forwarded-for hop, then x-real-ip
export function clientIp(req: Request) {
  const forwarded = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
  return forwarded || req.headers.get('x-real-ip')?.trim() || 'unknown'
}

// Returns true if the request is allowed
export function rateLimit(name: string, key: string, limit: number, windowMs: number) {
  let bucket = buckets.get(name)
  if (!bucket) {
    bucket = new Map()
    buckets.set(name, bucket)
  }

  const now = Date.now()
  if (bucket.size > MAX_ENTRIES) {
    for (const [k, w] of bucket) if (w.resetAt <= now) bucket.delete(k)
  }

  const entry = bucket.get(key)
  if (!entry || entry.resetAt <= now) {
    bucket.set(key, { count: 1, resetAt: now + windowMs })
    return true
  }
  entry.count++
  return entry.count <= limit
}
