// Dit endpoint wordt gebruikt als de gratis-handboek pagina ooit een
// directe email-capture nodig heeft (bv. voor een toekomstige gratis versie).
// Momenteel linkt de pagina door naar /diagnostic voor de gratis analyse.
import { NextRequest, NextResponse } from 'next/server'
import { sendWelcomeEmail, notifyJeroenNewOptin } from '@/lib/crm/email'
import { saveLead } from '@/lib/crm/store'
import { randomUUID } from 'crypto'
import Redis from 'ioredis'

const RATE_LIMIT = 3
const WINDOW_SECONDS = 60 * 60

let redis: Redis | null = null
function getRedis() {
  if (!redis && process.env.REDIS_URL) {
    redis = new Redis(process.env.REDIS_URL, { lazyConnect: true, enableReadyCheck: false })
  }
  return redis
}

async function checkRateLimit(ip: string): Promise<boolean> {
  const client = getRedis()
  if (!client) return true
  try {
    const key = `rate:ebook:${ip}`
    const count = await client.incr(key)
    if (count === 1) await client.expire(key, WINDOW_SECONDS)
    return count <= RATE_LIMIT
  } catch {
    return true
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name, email } = await req.json()

    if (!name || !email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json({ error: 'Ongeldige invoer' }, { status: 400 })
    }

    const ip = (req.headers.get('x-forwarded-for') ?? '127.0.0.1').split(',')[0].trim()
    if (!await checkRateLimit(ip)) {
      return NextResponse.json({ error: 'Te veel aanvragen' }, { status: 429 })
    }

    const id = randomUUID()

    // Save to CRM store (same as leads — zichtbaar in dashboard)
    await saveLead({
      id,
      name,
      email,
      message: 'Gratis actiehandboek opt-in via Meta Ads landingspagina',
      lang: 'nl',
      submittedAt: Date.now(),
      qualified: false,
      score: 0,
      status: 'new',
      source: 'widget',
    })

    // Welcome email met PDF link — fire and forget
    sendWelcomeEmail(name, email).catch(err =>
      console.error('[ebook-optin] welcome email error:', err)
    )

    // Notify Jeroen
    notifyJeroenNewOptin(name, email).catch(err =>
      console.error('[ebook-optin] notify error:', err)
    )

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[ebook-optin] error:', err)
    return NextResponse.json({ error: 'Interne fout' }, { status: 500 })
  }
}
