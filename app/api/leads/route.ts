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

    // 1. Let Claude qualify and draft a personalized reply
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

    // 3. Store in KV (for follow-up scheduling)
    await saveLead(lead)

    // 4. Send personalized reply to the lead immediately
    await sendToLead(email, result.emailSubject, result.emailBody)

    // 5. Notify Jeroen with qualification summary
    await notifyJeroen(name, email, result.score, result.qualified, result.summary)

    // 6. Log to Google Sheets tracker (fire-and-forget, don't block response)
    logToTracker(lead, result).catch(console.error)

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[leads] error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}

// Logs to the existing Google Sheets tracker via the Python script on the server.
// On Vercel this won't work directly — wire up the Sheets API instead (see README).
async function logToTracker(lead: Lead, result: { score: number; summary: string; painPoints: string[] }) {
  // On local / VPS: call the Python tracker script
  // On Vercel: use Google Sheets API directly (see /lib/crm/sheets.ts — to implement)
  console.log('[tracker] lead logged:', {
    bedrijf: lead.name,
    email: lead.email,
    score: `${result.score}/10`,
    analyse: result.summary,
    pijnpunten: result.painPoints.join(', '),
  })
}
