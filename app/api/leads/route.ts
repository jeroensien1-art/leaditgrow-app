import { NextRequest, NextResponse } from 'next/server'
import { randomUUID } from 'crypto'
import { waitUntil } from '@vercel/functions'
import { qualifyAndDraft, type Lead } from '@/lib/crm/claude'
import { sendToLead, notifyJeroen } from '@/lib/crm/email'
import { saveLead, updateLead } from '@/lib/crm/store'

async function verifyTurnstile(token: string, ip: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY
  if (!secret) return true // skip in dev if key not set
  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ secret, response: token, remoteip: ip }),
  })
  const data = await res.json()
  return data.success === true
}

export async function POST(req: NextRequest) {
  try {
    const { name, email, message, source, turnstileToken } = await req.json()

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    const ip = req.headers.get('x-forwarded-for') ?? '127.0.0.1'
    const valid = await verifyTurnstile(turnstileToken ?? '', ip)
    if (!valid) {
      return NextResponse.json({ error: 'Bot check failed' }, { status: 403 })
    }

    const id = randomUUID()
    const submittedAt = Date.now()

    // Save stub immediately — entry always lands in dashboard even if Claude fails
    const stub: Lead = {
      id,
      name,
      email,
      message,
      lang: 'nl',
      submittedAt,
      qualified: false,
      score: 0,
      status: 'new',
      source: source ?? 'widget',
    }
    await saveLead(stub)

    // Claude qualification + email run in background
    waitUntil(processLead({ id, name, email, message }).catch(err =>
      console.error('[leads] background error:', err)
    ))

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[leads] error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}

async function processLead({
  id, name, email, message,
}: {
  id: string; name: string; email: string; message: string
}) {
  // 1. Claude qualifies and drafts personalised reply
  const result = await qualifyAndDraft({ name, email, message })

  // 2. Update the stub with real qualification data
  await updateLead(id, {
    lang: result.lang,
    qualified: result.qualified,
    score: result.score,
    status: 'replied',
    repliedAt: Date.now(),
  })

  // 3. Send personalised reply to the lead
  await sendToLead(email, result.emailSubject, result.emailBody)

  // 4. Notify Jeroen
  await notifyJeroen(name, email, result.score, result.qualified, result.summary)
}
