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

// score = gap score 0–100 where HIGHER = MORE PROBLEMS
// The diagnostic page calculates: (sum_of_answers / max_possible) * 100

const LEVER_NL: Record<string, {
  label: string
  cost: string
  fix: string
}> = {
  time: {
    label: 'Tijd en vrijheid als ondernemer',
    cost: 'Elke taak die alleen jij kunt doen zet een plafond op jouw groei. Je bedrijf draait op jou — niet zonder jou.',
    fix: 'Maak een lijst van alles wat je vorige week deed. Markeer wat alleen jij echt kunt doen. Al het andere wordt deze maand gedelegeerd of geautomatiseerd.',
  },
  leadership: {
    label: 'Leiderschap en teamautonomie',
    cost: 'Als jouw team jou nodig heeft voor dagelijkse beslissingen, heb je geen team — je hebt een groep mensen die op jou wacht.',
    fix: 'Bepaal per type beslissing wie verantwoordelijk is, wie geconsulteerd wordt en wie het achteraf hoeft te weten. Zet het op papier. Houd je eraan.',
  },
  speed_to_lead: {
    label: 'Snelheid van eerste reactie op leads',
    cost: '78% van de deals gaat naar de leverancier die als eerste reageert. Elke uur dat je wacht kost je omzet die je al bijna had.',
    fix: 'Stel een automatische eerste reactie in binnen 5 minuten na elke aanvraag. Zelfs een eenvoudig "Ik heb je bericht en bel je vandaag" slaat je concurrenten.',
  },
  pipeline: {
    label: 'Pipeline-opvolging en nurturing',
    cost: 'De meeste deals sluiten niet bij het eerste contact. Zonder opvolging gaan warme leads koud — omzet die je al had verdiend, maar verloor.',
    fix: 'Maak een eenvoudige 5-staps opvolgingssequentie. De meeste concurrenten stoppen na 1–2 pogingen. Jij niet.',
  },
  marketing: {
    label: 'Online aanwezigheid en inbound leads',
    cost: 'Jij bent jouw marketing. Als jij stopt met pushen, stoppen de leads. Dat is geen systeem — dat is een baan.',
    fix: 'Kies 1 content formaat dat je consequent kunt produceren. LinkedIn-posts, korte video's, of een eenvoudige e-mailreeks. Eén, maar dan structureel.',
  },
  sales: {
    label: 'Salesconversie en closerate',
    cost: 'Een lage closerate is zelden een overtuigingsprobleem. Het is bijna altijd een kwalificatie- of framingprobleem: verkeerde leads, of verkeerde verwachtingen.',
    fix: 'Analyseer je laatste 10 gewonnen deals: wat hadden ze gemeen? Bouw je kwalificatievragen rond dat profiel. De rest verkoopt zichzelf.',
  },
  retention: {
    label: 'Klantbehoud en doorverwijzingen',
    cost: 'Nieuwe klanten werven kost 5–7x meer dan bestaande klanten behouden. Zonder systeem laat je doorverwijzingen en herhaalaankopen liggen.',
    fix: 'Plan na elk project een 30-dagencheck-in. Eén vraag: "Is er iets anders dat nu bij je speelt?" De meeste doorverwijzingen komen hieruit.',
  },
}

const LEVER_EN: Record<string, {
  label: string
  cost: string
  fix: string
}> = {
  time: {
    label: 'Owner time and freedom',
    cost: 'Every task that only you can do puts a ceiling on your growth. Your business runs on you — not without you.',
    fix: 'List every task you did last week. Mark what only you can truly do. Everything else gets delegated or automated this month.',
  },
  leadership: {
    label: 'Leadership and team autonomy',
    cost: 'If your team needs you for daily decisions, you don\'t have a team — you have a group of people waiting for you.',
    fix: 'For each type of decision, define who is responsible, who is consulted, and who just needs to know afterwards. Write it down. Stick to it.',
  },
  speed_to_lead: {
    label: 'Speed-to-lead (response time)',
    cost: '78% of deals go to the first vendor to respond. Every hour you wait costs you revenue you almost had.',
    fix: 'Set up an automatic first response within 5 minutes of every enquiry. Even a simple "I got your message and will call you today" beats your competitors.',
  },
  pipeline: {
    label: 'Pipeline follow-up and nurture',
    cost: 'Most deals don\'t close on first contact. Without follow-up, warm leads go cold — revenue you already nearly earned, but lost.',
    fix: 'Build a simple 5-touch follow-up sequence. Most of your competitors give up after 1–2 attempts. You won\'t.',
  },
  marketing: {
    label: 'Online presence and inbound leads',
    cost: 'You are your marketing. When you stop pushing, leads stop coming. That\'s not a system — that\'s a job.',
    fix: 'Choose 1 content format you can produce consistently. LinkedIn posts, short videos, or a simple email sequence. One, but structural.',
  },
  sales: {
    label: 'Sales conversion and close rate',
    cost: 'A low close rate is rarely a persuasion problem. It\'s almost always a qualification or framing problem: wrong leads, or wrong expectations set.',
    fix: 'Analyse your last 10 won deals: what did they have in common? Build your qualifying questions around that profile. The rest sells itself.',
  },
  retention: {
    label: 'Client retention and referrals',
    cost: 'Acquiring new clients costs 5–7x more than keeping existing ones. Without a system, you leave referrals and repeat business on the table.',
    fix: 'After every project, schedule a 30-day check-in. One question: "Is there anything else weighing on you right now?" Most referrals come from this.',
  },
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
  const nl = true  // targeting Belgian market; extend with language detection if needed
  const LEVER = nl ? LEVER_NL : LEVER_EN
  const fmt = (n: number) => n === 0 ? (nl ? 'Minimaal' : 'Minimal') : `€${n.toLocaleString('nl-BE')}`

  const top3 = submission.topLevers.slice(0, 3)
  const top1 = top3[0]
  const monthly = estimateRevenueLeak(submission)
  const annual = monthly * 12

  // score is a GAP score: higher = more problems
  // Invert for display: show as health score so "low" means there's work to do
  const healthPct = 100 - submission.score
  const healthColor = healthPct >= 70 ? '#3dba6e' : healthPct >= 40 ? '#e8a838' : '#e05b3a'

  const subject = nl
    ? `${submission.name}, jouw diagnose — #1 hefboom: ${LEVER[top1]?.label ?? top1}`
    : `${submission.name}, your diagnostic — #1 lever: ${LEVER[top1]?.label ?? top1}`

  // Top lever highlight
  const top1Data = LEVER[top1]
  const top1Block = top1Data ? `
    <div style="background:#3d3929;border-radius:14px;padding:26px 28px;margin-bottom:24px">
      <div style="font-size:10px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:#c96442;margin-bottom:10px">
        ${nl ? '🎯 Jouw #1 hefboom — grootste impact' : '🎯 Your #1 lever — biggest impact'}
      </div>
      <div style="font-size:17px;font-weight:700;color:#fff;margin-bottom:12px">${top1Data.label}</div>
      <p style="font-size:13px;color:rgba(255,255,255,.7);line-height:1.65;margin:0 0 16px">${top1Data.cost}</p>
      <div style="background:rgba(201,100,66,.15);border-left:3px solid #c96442;border-radius:0 8px 8px 0;padding:12px 16px">
        <div style="font-size:10px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#c96442;margin-bottom:6px">
          ${nl ? 'Concrete actie' : 'Concrete action'}
        </div>
        <p style="font-size:13px;color:rgba(255,255,255,.85);line-height:1.6;margin:0">${top1Data.fix}</p>
      </div>
    </div>` : ''

  // Revenue leak block
  const leakBlock = monthly > 0 ? `
    <div style="background:#fdf4f0;border:1.5px solid rgba(201,100,66,.25);border-radius:12px;padding:18px 22px;margin-bottom:24px;display:flex;align-items:center;gap:18px">
      <div style="text-align:center;min-width:80px">
        <div style="font-size:26px;font-weight:800;color:#c96442;line-height:1">${fmt(monthly)}</div>
        <div style="font-size:10px;color:#b0aea8;margin-top:2px">${nl ? 'per maand' : 'per month'}</div>
      </div>
      <div>
        <div style="font-size:12px;font-weight:700;color:#3d3929;margin-bottom:3px">
          ${nl ? 'Geschat maandelijks omzetverlies' : 'Estimated monthly revenue leak'}
        </div>
        <div style="font-size:12px;color:#83827d;line-height:1.5">
          ${nl ? `${fmt(annual)} per jaar. Gebaseerd op jouw leads, dealwaarde en respons- en opvolgingsgedrag.` : `${fmt(annual)} per year. Based on your leads, deal value, response time and follow-up behaviour.`}
        </div>
      </div>
    </div>` : ''

  // Top 3 gaps with tips
  const gapBlocks = top3.map((lever, i) => {
    const data = LEVER[lever]
    if (!data) return ''
    const answerScore = submission.answers[lever] ?? 0
    const severity = answerScore === 3
      ? (nl ? 'Kritiek' : 'Critical')
      : answerScore === 2
      ? (nl ? 'Significant' : 'Significant')
      : (nl ? 'Aandachtspunt' : 'Note')
    const severityColor = answerScore === 3 ? '#e05b3a' : answerScore === 2 ? '#e8a838' : '#83827d'

    return `
    <div style="border:1px solid rgba(61,57,41,.1);border-radius:12px;padding:20px 22px;margin-bottom:12px;background:#fff">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:10px">
        <div>
          <div style="font-size:10px;font-weight:700;color:#83827d;letter-spacing:.1em;text-transform:uppercase;margin-bottom:4px">
            ${nl ? `Prioriteit ${i + 1}` : `Priority ${i + 1}`}
          </div>
          <div style="font-size:14px;font-weight:700;color:#3d3929">${data.label}</div>
        </div>
        <span style="font-size:10px;font-weight:700;background:${severityColor}22;color:${severityColor};border-radius:4px;padding:3px 8px;white-space:nowrap;margin-left:12px">${severity}</span>
      </div>
      <p style="font-size:13px;color:#535146;line-height:1.65;margin:0 0 12px">${data.cost}</p>
      <div style="background:#f3f1eb;border-radius:8px;padding:11px 14px">
        <div style="font-size:10px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#83827d;margin-bottom:5px">
          ${nl ? 'Wat je nu kunt doen' : 'What you can do now'}
        </div>
        <p style="font-size:13px;color:#3d3929;line-height:1.6;margin:0;font-weight:500">${data.fix}</p>
      </div>
    </div>`
  }).join('')

  const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#faf9f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">
<div style="max-width:600px;margin:0 auto;padding:32px 16px">

  <div style="margin-bottom:24px">
    <div style="font-size:11px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:#c96442;margin-bottom:4px">Lead it, Grow</div>
    <div style="font-size:11px;color:#b0aea8">${nl ? 'Business Impact Diagnose — persoonlijk rapport' : 'Business Impact Diagnostic — personal report'}</div>
  </div>

  <div style="background:#fff;border-radius:16px;border:1px solid rgba(61,57,41,.1);padding:32px;box-shadow:0 4px 24px rgba(0,0,0,.06)">

    <p style="font-size:16px;color:#3d3929;margin:0 0 8px">Hi ${submission.name},</p>
    <p style="font-size:14px;color:#535146;line-height:1.7;margin:0 0 24px">
      ${nl
        ? 'Hier is jouw persoonlijk rapport op basis van de Business Impact Diagnose.'
        : 'Here is your personal report based on the Business Impact Diagnostic.'}
    </p>

    <!-- Overall score (displayed as health score: higher = better) -->
    <div style="background:#f3f1eb;border-radius:12px;padding:16px 20px;margin-bottom:24px;display:flex;align-items:center;gap:16px">
      <div style="text-align:center;min-width:56px">
        <div style="font-size:36px;font-weight:800;color:${healthColor};line-height:1">${healthPct}</div>
        <div style="font-size:10px;color:#83827d;font-weight:600">/100</div>
      </div>
      <div>
        <div style="font-size:13px;font-weight:700;color:#3d3929;margin-bottom:3px">
          ${nl ? 'Systeem-gezondheidsscore' : 'System health score'}
        </div>
        <div style="font-size:12px;color:#535146;line-height:1.5">
          ${healthPct >= 70
            ? (nl ? 'Sterke basis. Optimaliseren op specifieke punten.' : 'Strong foundation. Optimise on specific areas.')
            : healthPct >= 40
            ? (nl ? 'Goede basis, maar duidelijke kansen voor groei.' : 'Good foundation, but clear growth opportunities.')
            : (nl ? 'Significante groeikansen aanwezig — laaghangend fruit.' : 'Significant growth opportunities — low-hanging fruit.')}
        </div>
      </div>
    </div>

    ${leakBlock}

    ${top1Block}

    <!-- Top 3 gaps -->
    <div style="margin-bottom:24px">
      <div style="font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#83827d;margin-bottom:14px">
        ${nl ? 'Jouw top 3 aandachtspunten' : 'Your top 3 focus areas'}
      </div>
      ${gapBlocks}
    </div>

    <!-- CTA -->
    <div style="background:#3d3929;border-radius:12px;padding:24px 26px">
      <div style="font-size:15px;font-weight:700;color:#fff;margin-bottom:8px">
        ${nl ? 'Wil je dit concreet aanpakken?' : 'Want to act on this?'}
      </div>
      <p style="font-size:13px;color:rgba(255,255,255,.7);line-height:1.65;margin:0 0 16px">
        ${nl
          ? `Op basis van jouw diagnose zie ik de meeste impact rond <strong style="color:#fff">${top1Data?.label ?? top3[0]}</strong>. Dat is waar we in een gratis introgesprek van 15 minuten mee beginnen. Geen verkooppraatje — gewoon kijken wat er voor jou specifiek werkt.`
          : `Based on your diagnostic, I see the most impact around <strong style="color:#fff">${top1Data?.label ?? top3[0]}</strong>. That's where we'd start in a free 15-minute intro call. No sales pitch — just looking at what specifically works for you.`}
      </p>
      <p style="font-size:13px;color:rgba(255,255,255,.75);margin:0">
        ${nl
          ? 'Stuur een reply op dit bericht met een paar tijdstippen die jou passen — dan plannen we iets in.'
          : 'Reply to this email with a few times that work for you — we\'ll schedule something.'}
      </p>
    </div>

  </div>

  <!-- Context footer -->
  <div style="margin-top:16px;padding:14px 18px;background:#f3f1eb;border-radius:10px;font-size:11px;color:#83827d;line-height:1.6">
    <strong style="color:#3d3929">${nl ? 'Jouw context:' : 'Your context:'}</strong>
    ${submission.context.industry} · ${submission.context.teamSize} ${nl ? 'medewerkers' : 'team'} · ${submission.context.monthlyLeads} ${nl ? 'leads/maand' : 'leads/month'} · ${submission.context.avgDealValue}
  </div>

  <div style="margin-top:20px;padding-top:16px;border-top:1px solid rgba(61,57,41,.1)">
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

    // 2. Mirror into leads table (requires source column migration)
    // score is a gap score (higher = worse), so high gap score → high lead score
    try {
      await saveLead({
        id,
        name: body.name,
        email: body.email,
        message: `Business Impact Diagnostic — score: ${body.score}/100 (gap score, higher = more problems). Top gaps: ${body.topLevers.slice(0, 3).join(', ')}. Industry: ${body.context.industry}. Leads/mo: ${body.context.monthlyLeads}. Avg deal: ${body.context.avgDealValue}.`,
        lang: 'nl',
        submittedAt: Date.now(),
        qualified: body.score >= 30,  // higher gap score = more problems = better prospect
        score: Math.max(1, Math.min(10, Math.round(body.score / 10))),
        status: 'new',
        source: 'diagnostic',
      })
    } catch (err) {
      console.error('[diagnostic] leads mirror failed — run: ALTER TABLE leads ADD COLUMN IF NOT EXISTS source TEXT DEFAULT \'widget\'', err)
    }

    // 3. Build and send report email synchronously (no Claude — works on Vercel Hobby)
    const { subject, html } = buildReport(body)
    await sendToLead(body.email, subject, html)

    // 4. Mark report as sent
    await supabase.from('diagnostics').update({ report_sent: true }).eq('id', id)

    // 5. Notify Jeroen
    await resend.emails.send({
      from: FROM,
      to: NOTIFY,
      subject: `New diagnostic: ${body.name} — score ${body.score}/100 — top gap: ${body.topLevers[0] ?? '?'}`,
      html: `
        <h2 style="font-family:sans-serif;color:#3d3929">New diagnostic submission</h2>
        <p style="font-family:sans-serif;color:#535146"><strong>Name:</strong> ${body.name}</p>
        <p style="font-family:sans-serif;color:#535146"><strong>Email:</strong> ${body.email}</p>
        <p style="font-family:sans-serif;color:#535146"><strong>Gap score:</strong> ${body.score}/100 (higher = more gaps)</p>
        <p style="font-family:sans-serif;color:#535146"><strong>Industry:</strong> ${body.context.industry}</p>
        <p style="font-family:sans-serif;color:#535146"><strong>Monthly leads:</strong> ${body.context.monthlyLeads}</p>
        <p style="font-family:sans-serif;color:#535146"><strong>Avg deal value:</strong> ${body.context.avgDealValue}</p>
        <p style="font-family:sans-serif;color:#535146"><strong>Team size:</strong> ${body.context.teamSize}</p>
        <p style="font-family:sans-serif;color:#535146"><strong>Top 3 gaps:</strong> ${body.topLevers.slice(0, 3).join(', ')}</p>
        <p style="font-family:sans-serif;margin-top:16px;color:#535146">Report sent to ${body.email}</p>
      `,
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[diagnostic] error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
