import { NextRequest, NextResponse } from 'next/server'
import { processReplies } from '@/lib/crm/autoReply'

export const maxDuration = 60

// Handles two callers:
// 1. Google Cloud Pub/Sub push — POST with { message: { data: base64 } }
// 2. Direct call with ?secret=XXX (manual trigger / legacy)
export async function POST(req: NextRequest) {
  if (process.env.OUTREACH_PAUSED === 'true') {
    return NextResponse.json({ ok: true, paused: true })
  }

  // Pub/Sub push — Google sends a POST with a wrapped message, no secret header
  // Verify via the token we embedded in the subscription push endpoint URL
  const secret = req.nextUrl.searchParams.get('secret')
  const isPubSub = req.headers.get('content-type')?.includes('application/json') &&
    !secret  // Pub/Sub calls have no secret param — they use the URL token

  if (!isPubSub) {
    // Direct / manual call — require secret
    if (!process.env.GMAIL_WEBHOOK_SECRET || secret !== process.env.GMAIL_WEBHOOK_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  } else {
    // Pub/Sub push — verify via PUBSUB_AUDIENCE token embedded in subscription URL
    const audience = req.nextUrl.searchParams.get('token')
    if (!process.env.PUBSUB_TOKEN || audience !== process.env.PUBSUB_TOKEN) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  try {
    // For Pub/Sub: decode the notification to log which mailbox changed
    // We always call processReplies() regardless — it finds unread replies itself
    if (isPubSub) {
      try {
        const body = await req.json()
        const data = body?.message?.data
        if (data) {
          const notification = JSON.parse(Buffer.from(data, 'base64').toString('utf-8'))
          console.log(`[gmail-webhook] Pub/Sub notification for ${notification.emailAddress}, historyId: ${notification.historyId}`)
        }
      } catch {
        // Non-fatal — proceed with processReplies regardless
      }
    }

    const result = await processReplies()
    console.log(`[gmail-webhook] processed ${result.processed} messages`)
    return NextResponse.json({ ok: true, ...result })
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('[gmail-webhook] fatal:', msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
