import { NextResponse } from 'next/server'
import { fetchAnalytics } from '@/lib/analytics'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

export async function GET() {
  try {
    const data = await fetchAnalytics()
    return NextResponse.json(data)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Analytics fetch failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
