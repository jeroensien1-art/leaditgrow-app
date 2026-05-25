import { NextRequest, NextResponse } from 'next/server'

export const maxDuration = 30

// Renews the Gmail push notification watch.
// Gmail watch expires after 7 days — this cron runs every 6 days to keep it fresh.
// On first run, also sets up the watch if it doesn't exist yet.
export async function GET(req: NextRequest) {
  if (req.headers.get('x-vercel-cron') !== '1') {
    // Allow manual trigger with secret
    const secret = req.nextUrl.searchParams.get('secret')
    if (secret !== process.env.GMAIL_WEBHOOK_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  const tokenJson = process.env.GMAIL_TOKEN_JSON
  if (!tokenJson) return NextResponse.json({ error: 'GMAIL_TOKEN_JSON not set' }, { status: 500 })

  const pubsubTopic = process.env.GMAIL_PUBSUB_TOPIC
  if (!pubsubTopic) return NextResponse.json({ error: 'GMAIL_PUBSUB_TOPIC not set' }, { status: 500 })

  try {
    // Get access token
    const creds = JSON.parse(tokenJson) as {
      client_id: string; client_secret: string; refresh_token: string; token_uri: string
    }
    const tokenRes = await fetch(creds.token_uri, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: creds.client_id,
        client_secret: creds.client_secret,
        refresh_token: creds.refresh_token,
        grant_type: 'refresh_token',
      }),
    })
    const tokenData = await tokenRes.json()
    if (!tokenData.access_token) throw new Error(`Token refresh failed: ${JSON.stringify(tokenData)}`)

    // Set up Gmail watch
    const watchRes = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/watch', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        topicName: pubsubTopic,           // e.g. projects/my-project/topics/gmail-notifications
        labelIds: ['INBOX'],
        labelFilterBehavior: 'INCLUDE',
      }),
    })

    const watchData = await watchRes.json()

    if (!watchRes.ok) {
      console.error('[gmail-watch] watch setup failed:', watchData)
      return NextResponse.json({ error: 'Watch setup failed', details: watchData }, { status: 500 })
    }

    console.log(`[gmail-watch] watch active until ${new Date(parseInt(watchData.expiration)).toISOString()}`)
    return NextResponse.json({
      ok: true,
      historyId: watchData.historyId,
      expiration: new Date(parseInt(watchData.expiration)).toISOString(),
    })
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('[gmail-watch] error:', msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
