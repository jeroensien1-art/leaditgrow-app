import { NextRequest, NextResponse } from 'next/server'
import { randomUUID } from 'crypto'
import { waitUntil } from '@vercel/functions'
import { createClient } from '@supabase/supabase-js'
import { generateDiagnosticReport, type DiagnosticSubmission } from '@/lib/crm/diagnostic'
import { sendToLead } from '@/lib/crm/email'
import { Resend } from 'resend'

// Allow up to 60s (requires Vercel Pro; ignored on Hobby but harmless)
export const maxDuration = 60

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

    // 1. Save to Supabase synchronously BEFORE returning — data always lands
    const { error: insertError } = await supabase.from('diagnostics').insert({
      id,
      name: body.name,
      email: body.email,
      score: body.score,
      industry: body.context.industry,
      monthly_leads: body.context.monthlyLeads,
      avg_deal_value: body.context.avgDealValue,
      team_size: body.context.teamSize,
      answers: body.answers,
      top_levers: body.topLevers,
    })

    if (insertError) {
      console.error('[diagnostic] supabase insert error:', insertError)
      // Continue anyway — still generate the report
    }

    // 2. Claude + email run in background (waitUntil extends function lifetime)
    waitUntil(sendReport(id, body).catch(err =>
      console.error('[diagnostic] report/email error:', err)
    ))

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[diagnostic] error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}

async function sendReport(id: string, submission: DiagnosticSubmission) {
  // Generate report with Claude Sonnet (fast — typically 5-10s)
  const report = await generateDiagnosticReport(submission)

  // Mark report as sent in Supabase
  await supabase.from('diagnostics').update({ report_sent: true }).eq('id', id)

  // Send personalised report to lead
  await sendToLead(submission.email, report.subject, report.html)

  // Notify Jeroen
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
