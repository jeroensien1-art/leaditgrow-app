import { NextRequest, NextResponse } from 'next/server'
import { processReplies } from '@/lib/crm/autoReply'

export const maxDuration = 60

export async function GET(req: NextRequest) {
  // Vercel cron adds this header automatically
  if (req.headers.get('x-vercel-cron') !== '1') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (process.env.OUTREACH_PAUSED === 'true') {
    return NextResponse.json({ ok: true, paused: true })
  }

  try {
    const result = await processReplies()
    console.log(`[cron/gmail-poll] processed ${result.processed} messages`)
    return NextResponse.json({ ok: true, ...result })
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('[cron/gmail-poll] fatal:', msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
