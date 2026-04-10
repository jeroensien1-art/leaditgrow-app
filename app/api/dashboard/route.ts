import { NextResponse } from 'next/server'
import Redis from 'ioredis'
import type { Lead } from '@/lib/crm/claude'

const redis = new Redis(process.env.REDIS_URL!)

export async function GET() {
  try {
    // Get all lead keys
    const keys = await redis.keys('lead:*')
    if (!keys.length) return NextResponse.json({ leads: [] })

    const raws = await redis.mget(...keys)
    const leads: Lead[] = raws
      .filter((r): r is string => r !== null)
      .map(r => JSON.parse(r))
      .sort((a, b) => b.submittedAt - a.submittedAt)

    return NextResponse.json({ leads })
  } catch (err) {
    console.error('[dashboard] error:', err)
    return NextResponse.json({ error: 'Failed to load leads' }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  try {
    const { id, status } = await req.json()
    if (!id || !status) return NextResponse.json({ error: 'Missing id or status' }, { status: 400 })

    const raw = await redis.get(`lead:${id}`)
    if (!raw) return NextResponse.json({ error: 'Lead not found' }, { status: 404 })

    const lead: Lead = JSON.parse(raw)
    lead.status = status
    await redis.set(`lead:${id}`, JSON.stringify(lead))

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[dashboard patch] error:', err)
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 })
  }
}
