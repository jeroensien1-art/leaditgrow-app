import { NextRequest, NextResponse } from 'next/server'
import { randomUUID } from 'crypto'
import { waitUntil } from '@vercel/functions'
import { createClient } from '@supabase/supabase-js'
import { generateDiagnosticReport, type DiagnosticSubmission } from '@/lib/crm/diagnostic'
import { sendToLead } from '@/lib/crm/email'
import { Resend } from 'resend'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
)

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM = 'Jeroen — Lead it, Grow <jeroen@leaditgrow.be>'
const NOTIFY = 'jeroen@leaditgrow.be'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as DiagnosticSubmission

    if (!body.email || !body.name) {
      return NextResponse.json({ error: 'Missing name or email' }, { status: 400 })
    }

    const id = randomUUID()

    // waitUntil ensures Vercel keeps the function alive until processing completes
    waitUntil(processDiagnostic(id, body).catch(err =>
      console.error('[diagnostic] background error:', err)
    ))

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[diagnostic] error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}

async function processDiagnostic(id: string, submission: DiagnosticSubmission) {
  // 1. Save to Supabase
  await supabase.from('diagnostics').insert({
    id,
    name: submission.name,
    email: submission.email,
    score: submission.score,
    industry: submission.context.industry,
    monthly_leads: submission.context.monthlyLeads,
    avg_deal_value: submission.context.avgDealValue,
    team_size: submission.context.teamSize,
    answers: submission.answers,
    top_levers: submission.topLevers,
  })

  // 2. Generate personalised report with Claude
  const report = await generateDiagnosticReport(submission)

  // 3. Send report to the business owner
  await sendToLead(submission.email, report.subject, report.html)

  // 4. Notify Jeroen
  await resend.emails.send({
    from: FROM,
    to: NOTIFY,
    subject: `New diagnostic: ${submission.name} — score ${submission.score}/100`,
    html: `
      <h2 style="font-family:sans-serif;color:#3d3929">New diagnostic submission</h2>
      <p style="font-family:sans-serif;color:#535146"><strong>Name:</strong> ${submission.name}</p>
      <p style="font-family:sans-serif;color:#535146"><strong>Email:</strong> ${submission.email}</p>
      <p style="font-family:sans-serif;color:#535146"><strong>Score:</strong> ${submission.score}/100</p>
      <p style="font-family:sans-serif;color:#535146"><strong>Industry:</strong> ${submission.context.industry}</p>
      <p style="font-family:sans-serif;color:#535146"><strong>Monthly leads:</strong> ${submission.context.monthlyLeads}</p>
      <p style="font-family:sans-serif;color:#535146"><strong>Avg deal value:</strong> ${submission.context.avgDealValue}</p>
      <p style="font-family:sans-serif;color:#535146"><strong>Team size:</strong> ${submission.context.teamSize}</p>
      <p style="font-family:sans-serif;color:#535146"><strong>Top 3 gaps:</strong> ${submission.topLevers.slice(0, 3).join(', ')}</p>
      <p style="font-family:sans-serif;margin-top:16px;color:#535146">Report sent to ${submission.email}</p>
    `,
  })
}
