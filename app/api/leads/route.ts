import { NextRequest, NextResponse } from 'next/server'
import { randomUUID } from 'crypto'
import { qualifyAndDraft, type Lead } from '@/lib/crm/claude'
import { sendToLead, notifyJeroen } from '@/lib/crm/email'
import { saveLead } from '@/lib/crm/store'

export async function POST(req: NextRequest) {
  try {
    const { name, email, message } = await req.json()

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    // 1. Claude qualifies and drafts a personalised reply
    const result = await qualifyAndDraft({ name, email, message })

    // 2. Build lead record
    const lead: Lead = {
      id: randomUUID(),
      name,
      email,
      message,
      lang: result.lang,
      submittedAt: Date.now(),
      qualified: result.qualified,
      score: result.score,
      status: 'new',
    }

    // 3. Save to Supabase
    await saveLead(lead)

    // 4. Send personalised reply to the lead
    await sendToLead(email, result.emailSubject, result.emailBody)

    // 5. Notify Jeroen
    await notifyJeroen(name, email, result.score, result.qualified, result.summary)

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[leads] error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
