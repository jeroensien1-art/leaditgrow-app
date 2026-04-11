import { NextRequest, NextResponse } from 'next/server'
import { randomUUID } from 'crypto'
import { waitUntil } from '@vercel/functions'
import { qualifyAndDraft, type Lead } from '@/lib/crm/claude'
import { sendToLead, notifyJeroen } from '@/lib/crm/email'
import { saveLead } from '@/lib/crm/store'

export async function POST(req: NextRequest) {
  try {
    const { name, email, message } = await req.json()

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    const id = randomUUID()
    const submittedAt = Date.now()

    // waitUntil ensures Vercel keeps the function alive until processing completes
    waitUntil(processLead({ id, name, email, message, submittedAt }).catch(err =>
      console.error('[leads] background error:', err)
    ))

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[leads] error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}

async function processLead({
  id, name, email, message, submittedAt
}: {
  id: string; name: string; email: string; message: string; submittedAt: number
}) {
  // 1. Claude qualifies and drafts personalised reply
  const result = await qualifyAndDraft({ name, email, message })

  // 2. Save to Supabase
  const lead: Lead = {
    id,
    name,
    email,
    message,
    lang: result.lang,
    submittedAt,
    qualified: result.qualified,
    score: result.score,
    status: 'new',
  }
  await saveLead(lead)

  // 3. Send personalised reply to the lead
  await sendToLead(email, result.emailSubject, result.emailBody)

  // 4. Notify Jeroen
  await notifyJeroen(name, email, result.score, result.qualified, result.summary)
}
