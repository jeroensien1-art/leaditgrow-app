import { NextRequest, NextResponse } from 'next/server'
import { randomUUID } from 'crypto'
import { createClient } from '@supabase/supabase-js'
import { type DiagnosticSubmission } from '@/lib/crm/diagnostic'
import { sendToLead } from '@/lib/crm/email'
import { saveLead } from '@/lib/crm/store'
import { Resend } from 'resend'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
)

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM = 'Jeroen — Lead it, Grow <jeroen@leaditgrow.be>'
const NOTIFY = 'jeroen@leaditgrow.be'

const LEVER_LABELS: Record<string, string> = {
  time:          'Owner time / ability to switch off',
  leadership:    'Leadership and team autonomy',
  speed_to_lead: 'Speed-to-lead (response time)',
  pipeline:      'Pipeline follow-up and nurture',
  marketing:     'Online presence / inbound generation',
  sales:         'Sales close rate',
  retention:     'Client retention and referrals',
}

const LEVER_LABELS_NL: Record<string, string> = {
  time:          'Vrijheid en tijd als ondernemer',
  leadership:    'Leiderschap en teamautonomie',
  speed_to_lead: 'Snelheid van eerste reactie op leads',
  pipeline:      'Pipeline-opvolging en nurturing',
  marketing:     'Online aanwezigheid en inbound leads',
  sales:         'Salesconversie en closerate',
  retention:     'Klantbehoud en doorverwijzingen',
}

function scoreLabel(score: number): { nl: string; en: string } {
  if (score === 3) return { nl: 'Kritiek knelpunt', en: 'Critical gap' }
  if (score === 2) return { nl: 'Significant verlies', en: 'Significant gap' }
  if (score === 1) return { nl: 'Kleine ruimte voor verbetering', en: 'Minor gap' }
  return { nl: 'Sterk', en: 'Strong' }
}

function estimateRevenueLeak(submission: DiagnosticSubmission): number {
  const leadsMap: Record<string, number> = {
    'Fewer than 5': 3, 'Minder dan 5': 3,
    '5 to 20': 12, '5 tot 20': 12,
    '20 to 50': 35, '20 tot 50': 35,
    'More than 50': 65, 'Meer dan 50': 65,
  }
  const dealMap: Record<string, number> = {
    'Under €1,000': 600, 'Onder €1.000': 600,
    '€1,000 to €5,000': 2500, '€1.000 tot €5.000': 2500,
    '€5,000 to €20,000': 10000, '€5.000 tot €20.000': 10000,
    'Over €20,000': 25000, 'Boven €20.000': 25000,
  }
  const leads = leadsMap[submission.context.monthlyLeads] ?? 10
  const deal = dealMap[submission.context.avgDealValue] ?? 2000
  const stlScore = submission.answers['speed_to_lead'] ?? 0
  const pipelineScore = submission.answers['pipeline'] ?? 0
  const salesScore = submission.answers['sales'] ?? 0
  const stlLoss = stlScore === 3 ? 0.5 : stlScore === 2 ? 0.3 : stlScore === 1 ? 0.1 : 0
  const pipelineLoss = pipelineScore === 3 ? 0.4 : pipelineScore === 2 ? 0.25 : pipelineScore === 1 ? 0.1 : 0
  const salesLoss = salesScore === 3 ? 0.35 : salesScore === 2 ? 0.2 : salesScore === 1 ? 0.08 : 0
  const total = Math.min(stlLoss + pipelineLoss + salesLoss, 0.85)
  return Math.round(leads * deal * total / 500) * 500
}

function buildReport(submission: DiagnosticSubmission): { subject: string; html: string } {
  const nl = /minder|binnen|dezelfde|volgende|automatisch|manueel|zelden/i.test(
    Object.keys(submission.answers).join(' ') + submission.context.industry
  ) || true  // default NL — targeting Belgian market

  const top3 = submission.topLevers.slice(0, 3)
  const monthly = estimateRevenueLeak(submission)
  const annual = monthly * 12
  const fmt = (n: number) => n === 0 ? (nl ? 'Minimaal' : 'Minimal') : `€${n.toLocaleString('nl-BE')}`

  const scoreBar = (pct: number) => {
    const color = pct >= 70 ? '#3dba6e' : pct >= 40 ? '#e8a838' : '#e05b3a'
    return `<div style="background:#f3f1eb;border-radius:4px;height:6px;margin-top:6px;overflow:hidden">
      <div style="background:${color};height:6px;width:${pct}%;border-radius:4px"></div>
    </div>`
  }

  const gapRows = top3.map((lever, i) => {
    const answerScore = submission.answers[lever] ?? 0
    const label = nl ? (LEVER_LABELS_NL[lever] ?? lever) : (LEVER_LABELS[lever] ?? lever)
    const sl = scoreLabel(answerScore)
    const badgeColor = answerScore === 3 ? '#e05b3a' : answerScore === 2 ? '#e8a838' : '#83827d'
    return `
    <div style="background:#faf9f5;border-radius:10px;padding:16px 18px;margin-bottom:10px;border:1px solid rgba(61,57,41,.08)">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">
        <span style="font-size:13px;font-weight:700;color:#3d3929">${i + 1}. ${label}</span>
        <span style="font-size:11px;font-weight:700;color:${badgeColor};background:${badgeColor}22;border-radius:4px;padding:2px 7px">${nl ? sl.nl : sl.en}</span>
      </div>
      ${scoreBar(Math.round((3 - answerScore) / 3 * 100))}
    </div>`
  }).join('')

  const leakSection = monthly > 0 ? `
    <div style="background:#3d3929;border-radius:14px;padding:24px 28px;margin-bottom:24px;text-align:center">
      <div style="font-size:10px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:rgba(255,255,255,.4);margin-bottom:8px">
        ${nl ? 'Geschat maandelijks omzetverlies' : 'Estimated monthly revenue leak'}
      </div>
      <div style="font-size:48px;font-weight:800;color:#c96442;line-height:1;margin-bottom:4px">${fmt(monthly)}</div>
      <div style="font-size:13px;color:rgba(255,255,255,.5)">${nl ? `${fmt(annual)} per jaar` : `${fmt(annual)} per year`}</div>
    </div>` : ''

  const subject = nl
    ? `${submission.name}, jouw diagnose-rapport — score ${submission.score}/100`
    : `${submission.name}, your diagnostic report — score ${submission.score}/100`

  const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#faf9f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">
<div style="max-width:600px;margin:0 auto;padding:32px 16px">

  <div style="margin-bottom:24px">
    <div style="font-size:11px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:#c96442;margin-bottom:4px">Lead it, Grow</div>
    <div style="font-size:11px;color:#b0aea8">${nl ? 'Business Impact Diagnose — persoonlijk rapport' : 'Business Impact Diagnostic — personal report'}</div>
  </div>

  <div style="background:#fff;border-radius:16px;border:1px solid rgba(61,57,41,.1);padding:32px;box-shadow:0 4px 24px rgba(0,0,0,.06)">

    <p style="font-size:16px;color:#3d3929;margin:0 0 20px">Hi ${submission.name},</p>

    <p style="font-size:14px;color:#535146;line-height:1.7;margin:0 0 24px">
      ${nl
        ? `Je hebt de Business Impact Diagnose ingevuld. Hier is jouw persoonlijk rapport op basis van jouw antwoorden.`
        : `You just completed the Business Impact Diagnostic. Here is your personal report based on your answers.`}
    </p>

    <!-- Overall score -->
    <div style="background:#f3f1eb;border-radius:12px;padding:20px 24px;margin-bottom:24px;display:flex;align-items:center;gap:20px">
      <div style="text-align:center;min-width:72px">
        <div style="font-size:40px;font-weight:800;color:${submission.score >= 70 ? '#3dba6e' : submission.score >= 40 ? '#e8a838' : '#e05b3a'};line-height:1">${submission.score}</div>
        <div style="font-size:11px;color:#83827d;font-weight:600">/100</div>
      </div>
      <div>
        <div style="font-size:14px;font-weight:700;color:#3d3929;margin-bottom:4px">
          ${nl ? 'Jouw totaalscore' : 'Your overall score'}
        </div>
        <div style="font-size:13px;color:#535146;line-height:1.5">
          ${submission.score >= 70
            ? (nl ? 'Sterke basis — ruimte voor optimalisatie op specifieke punten.' : 'Strong foundation — room to optimise in specific areas.')
            : submission.score >= 40
            ? (nl ? 'Solide systemen op sommige vlakken, maar duidelijke kansen voor groei.' : 'Solid in some areas, but clear growth opportunities exist.')
            : (nl ? 'Significante kansen voor omzetgroei — laaghangend fruit aanwezig.' : 'Significant revenue growth opportunities — low-hanging fruit available.')}
        </div>
      </div>
    </div>

    ${leakSection}

    <!-- Top 3 gaps -->
    <div style="margin-bottom:24px">
      <div style="font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#83827d;margin-bottom:12px">
        ${nl ? 'Jouw top 3 prioriteiten' : 'Your top 3 priorities'}
      </div>
      ${gapRows}
    </div>

    <!-- Context -->
    <div style="background:#f3f1eb;border-radius:10px;padding:14px 18px;margin-bottom:24px;font-size:12px;color:#83827d;line-height:1.6">
      <strong style="color:#3d3929">${nl ? 'Jouw context:' : 'Your context:'}</strong>
      ${submission.context.industry} · ${submission.context.teamSize} ${nl ? 'medewerkers' : 'team size'} · ${submission.context.monthlyLeads} ${nl ? 'leads/maand' : 'leads/month'} · ${submission.context.avgDealValue}
    </div>

    <!-- CTA -->
    <div style="background:#faf9f5;border-radius:12px;padding:22px 24px;border:1px solid rgba(61,57,41,.1);margin-bottom:24px">
      <div style="font-size:15px;font-weight:700;color:#3d3929;margin-bottom:8px">
        ${nl ? 'Wil je dit concreet aanpakken?' : 'Ready to act on this?'}
      </div>
      <p style="font-size:13px;color:#535146;line-height:1.65;margin:0 0 16px">
        ${nl
          ? `Op basis van jouw diagnose zie ik duidelijke kansen rond ${top3.map(l => LEVER_LABELS_NL[l] ?? l).slice(0, 2).join(' en ')}. Dat zijn precies de gebieden waar we in een gratis introgesprek naar kijken.`
          : `Based on your diagnostic, I see clear opportunities around ${top3.map(l => LEVER_LABELS[l] ?? l).slice(0, 2).join(' and ')}. That's exactly what we'd look at in a free intro call.`}
      </p>
      <p style="font-size:13px;color:#535146;line-height:1.65;margin:0 0 16px">
        ${nl
          ? 'Stuur me gewoon een reply op dit bericht — dan plannen we 15 minuten in.'
          : 'Just reply to this email — we\'ll schedule 15 minutes.'}
      </p>
      <div style="font-size:13px;font-weight:600;color:#c96442">
        ${nl ? 'Gratis, geen verplichtingen.' : 'Free, no obligations.'}
      </div>
    </div>

  </div>

  <div style="margin-top:24px;padding-top:20px;border-top:1px solid rgba(61,57,41,.1)">
    <div style="font-size:13px;font-weight:600;color:#3d3929">Jeroen</div>
    <div style="font-size:12px;color:#83827d">Lead it, Grow — jeroen@leaditgrow.be</div>
  </div>

</div>
</body></html>`

  return { subject, html }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as DiagnosticSubmission

    if (!body.email || !body.name) {
      return NextResponse.json({ error: 'Missing name or email' }, { status: 400 })
    }

    const id = randomUUID()

    // 1. Save to diagnostics table
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
      console.error('[diagnostic] diagnostics insert error:', insertError.message)
    }

    // 2. Mirror into leads table so it shows in the dashboard
    try {
      await saveLead({
        id,
        name: body.name,
        email: body.email,
        message: `Business Impact Diagnostic — score: ${body.score}/100. Top gaps: ${body.topLevers.slice(0, 3).join(', ')}. Industry: ${body.context.industry}. Leads/mo: ${body.context.monthlyLeads}. Avg deal: ${body.context.avgDealValue}.`,
        lang: 'nl',
        submittedAt: Date.now(),
        qualified: body.score <= 60,
        score: Math.max(1, Math.round((100 - body.score) / 10)),
        status: 'new',
        source: 'diagnostic',
      })
    } catch (err) {
      // Log clearly — most likely the 'source' column migration hasn't been run yet
      console.error('[diagnostic] leads mirror failed — did you run: ALTER TABLE leads ADD COLUMN IF NOT EXISTS source TEXT DEFAULT \'widget\'?', err)
    }

    // 3. Build and send the diagnostic report synchronously
    //    (no Claude — works reliably on Vercel Hobby within the 10s limit)
    const { subject, html } = buildReport(body)
    await sendToLead(body.email, subject, html)

    // 4. Mark report as sent
    await supabase.from('diagnostics').update({ report_sent: true }).eq('id', id)

    // 5. Notify Jeroen
    await resend.emails.send({
      from: FROM,
      to: NOTIFY,
      subject: `New diagnostic: ${body.name} — score ${body.score}/100`,
      html: `
        <h2 style="font-family:sans-serif;color:#3d3929">New diagnostic submission</h2>
        <p style="font-family:sans-serif;color:#535146"><strong>Name:</strong> ${body.name}</p>
        <p style="font-family:sans-serif;color:#535146"><strong>Email:</strong> ${body.email}</p>
        <p style="font-family:sans-serif;color:#535146"><strong>Score:</strong> ${body.score}/100</p>
        <p style="font-family:sans-serif;color:#535146"><strong>Industry:</strong> ${body.context.industry}</p>
        <p style="font-family:sans-serif;color:#535146"><strong>Monthly leads:</strong> ${body.context.monthlyLeads}</p>
        <p style="font-family:sans-serif;color:#535146"><strong>Avg deal value:</strong> ${body.context.avgDealValue}</p>
        <p style="font-family:sans-serif;color:#535146"><strong>Team size:</strong> ${body.context.teamSize}</p>
        <p style="font-family:sans-serif;color:#535146"><strong>Top 3 gaps:</strong> ${body.topLevers.slice(0, 3).join(', ')}</p>
        <p style="font-family:sans-serif;color:#535146;margin-top:16px">Report sent to ${body.email}</p>
      `,
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[diagnostic] error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
