import { NextRequest, NextResponse } from 'next/server'
import { randomUUID } from 'crypto'
import { saveLead } from '@/lib/crm/store'
import { sendToLead } from '@/lib/crm/email'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM = 'Jeroen | Lead it, Grow <jeroen@leaditgrow.be>'
const NOTIFY = 'jeroen@leaditgrow.be'

export interface CalculatorSubmission {
  name: string
  email: string
  lang: 'nl' | 'en'
  leads: string
  deal: string
  speed: string
  followup: string
  monthly: number
  annual: number
  speedLeak: number
  followupLeak: number
}

function fmt(n: number, lang: 'nl' | 'en') {
  return n === 0
    ? (lang === 'nl' ? 'Minimaal' : 'Minimal')
    : `€${n.toLocaleString('nl-BE')}`
}

function buildEmail(s: CalculatorSubmission): { subject: string; html: string } {
  const nl = s.lang === 'nl'
  const hasLeak = s.monthly > 0

  const subject = hasLeak
    ? (nl
        ? `${s.name}, jij laat ${fmt(s.monthly, 'nl')}/maand liggen`
        : `${s.name}, you're losing ${fmt(s.monthly, 'en')}/month`)
    : (nl
        ? `${s.name}, jouw systemen werken goed  - hier is wat nog beter kan`
        : `${s.name}, your systems are solid  - here's what to sharpen next`)

  const leakSection = hasLeak ? `
    <div style="background:#3d3929;border-radius:14px;padding:28px 32px;margin-bottom:24px;text-align:center">
      <div style="font-size:11px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:rgba(255,255,255,.45);margin-bottom:10px">
        ${nl ? 'Geschat maandelijks omzetverlies' : 'Estimated monthly revenue leak'}
      </div>
      <div style="font-size:52px;font-weight:800;color:#c96442;line-height:1;margin-bottom:4px">${fmt(s.monthly, s.lang)}</div>
      <div style="font-size:14px;color:rgba(255,255,255,.45);margin-bottom:10px">${nl ? 'per maand' : 'per month'}</div>
      <div style="font-size:13px;color:rgba(255,255,255,.6)">${nl ? `Dat is ${fmt(s.annual, 'nl')} per jaar` : `That is ${fmt(s.annual, 'en')} per year`}</div>
    </div>

    <div style="margin-bottom:24px">
      <div style="font-size:10px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:#b0aea8;margin-bottom:10px">
        ${nl ? 'Hoe is dit opgebouwd?' : 'Where does this come from?'}
      </div>
      <div style="background:#f3f1eb;border-radius:10px;padding:13px 16px;display:flex;justify-content:space-between;margin-bottom:6px">
        <span style="font-size:13px;color:#535146">${nl ? 'Trage eerste reactie' : 'Slow first response'}</span>
        <span style="font-size:13px;font-weight:700;color:#3d3929">${fmt(s.speedLeak, s.lang)}</span>
      </div>
      <div style="background:#f3f1eb;border-radius:10px;padding:13px 16px;display:flex;justify-content:space-between">
        <span style="font-size:13px;color:#535146">${nl ? 'Onvoldoende opvolging' : 'Insufficient follow-up'}</span>
        <span style="font-size:13px;font-weight:700;color:#3d3929">${fmt(s.followupLeak, s.lang)}</span>
      </div>
    </div>

    <p style="font-size:14px;color:#535146;line-height:1.7;margin:0 0 16px">
      ${nl
        ? `Dit zijn geen vage schattingen. Ze zijn gebaseerd op gepubliceerd B2B sales onderzoek: 78% van de deals gaat naar de leverancier die als eerste reageert, en leads die niet worden opgevolgd na de eerste aanvraag converteren 80% minder.`
        : `These aren't vague estimates. They're based on published B2B sales research: 78% of deals go to the first vendor to respond, and leads that don't receive follow-up after their first enquiry convert 80% less often.`}
    </p>
  ` : `
    <div style="background:#f3f1eb;border-radius:14px;padding:24px 28px;margin-bottom:24px;text-align:center">
      <div style="font-size:22px;font-weight:800;color:#3dba6e;margin-bottom:6px">✓ ${nl ? 'Sterk systeem' : 'Strong systems'}</div>
      <div style="font-size:14px;color:#535146;line-height:1.6">
        ${nl
          ? 'Jouw reactietijd en opvolging zitten goed. De volgende groeikansen zitten elders.'
          : 'Your response time and follow-up are solid. The next growth opportunities lie elsewhere.'}
      </div>
    </div>
  `

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#faf9f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">
  <div style="max-width:600px;margin:0 auto;padding:32px 16px">

    <!-- Header -->
    <div style="margin-bottom:28px">
      <div style="font-size:11px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:#c96442;margin-bottom:4px">Lead it, Grow</div>
      <div style="font-size:11px;color:#b0aea8">${nl ? 'Revenue Calculator  - jouw resultaat' : 'Revenue Calculator  - your result'}</div>
    </div>

    <!-- Card -->
    <div style="background:#fff;border-radius:16px;border:1px solid rgba(61,57,41,.1);padding:32px;box-shadow:0 4px 24px rgba(0,0,0,.06)">

      <p style="font-size:16px;color:#3d3929;line-height:1.6;margin:0 0 24px">
        ${nl ? `Hi ${s.name},` : `Hi ${s.name},`}
      </p>

      <p style="font-size:14px;color:#535146;line-height:1.7;margin:0 0 24px">
        ${nl
          ? `Je hebt de Revenue Calculator op leaditgrow.be ingevuld. Hier zijn jouw resultaten:`
          : `You just completed the Revenue Calculator on leaditgrow.be. Here are your results:`}
      </p>

      ${leakSection}

      <!-- CTA -->
      <div style="background:#faf9f5;border-radius:12px;padding:24px 28px;border:1px solid rgba(61,57,41,.1);margin-bottom:24px">
        <div style="font-size:16px;font-weight:700;color:#3d3929;margin-bottom:8px">
          ${nl ? 'Wil je weten hoe je dit terugwint?' : 'Want to know exactly how to recover this?'}
        </div>
        <p style="font-size:13px;color:#535146;line-height:1.65;margin:0 0 16px">
          ${nl
            ? 'De Business Impact Diagnose kijkt ook naar leiderschap, sales, retentie en marketing. Je ontvangt een volledig persoonlijk rapport met je top 3 fixes  - gratis, 10 minuten.'
            : 'The Business Impact Diagnostic also covers leadership, sales, retention and marketing. You get a full personalised report with your top 3 fixes  - free, 10 minutes.'}
        </p>
        <a href="https://leaditgrow.be/diagnostic"
           style="display:inline-block;background:#15803d;color:#fff;text-decoration:none;padding:12px 22px;border-radius:9px;font-size:14px;font-weight:600">
          ${nl ? 'Start gratis diagnose →' : 'Start free diagnostic →'}
        </a>
      </div>

      <p style="font-size:13px;color:#83827d;line-height:1.65;margin:0">
        ${nl
          ? 'Of stuur me gewoon een reply als je vragen hebt  - ik lees alles zelf.'
          : 'Or just reply to this email if you have questions  - I read everything myself.'}
      </p>

    </div>

    <!-- Footer -->
    <div style="margin-top:24px;padding-top:20px;border-top:1px solid rgba(61,57,41,.1)">
      <div style="font-size:13px;font-weight:600;color:#3d3929">Jeroen</div>
      <div style="font-size:12px;color:#83827d">Lead it, Grow  - jeroen@leaditgrow.be</div>
      <div style="font-size:11px;color:#b0aea8;margin-top:6px">
        ${nl
          ? 'Berekeningen gebaseerd op gepubliceerd B2B sales onderzoek. Schattingen, geen garanties.'
          : 'Estimates based on published B2B sales research. Indicative, not guaranteed.'}
      </div>
    </div>

  </div>
</body>
</html>`

  return { subject, html }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as CalculatorSubmission

    if (!body.name || !body.email) {
      return NextResponse.json({ error: 'Missing name or email' }, { status: 400 })
    }

    const id = randomUUID()

    // Save to leads table
    await saveLead({
      id,
      name: body.name,
      email: body.email,
      message: `Revenue Calculator  - monthly leak: ${fmt(body.monthly, body.lang)} | speed: ${body.speed} | follow-up: ${body.followup} | leads/mo: ${body.leads} | avg deal: ${body.deal}`,
      lang: body.lang,
      submittedAt: Date.now(),
      qualified: body.monthly > 5000,   // treat as qualified if meaningful leak
      score: body.monthly > 20000 ? 8 : body.monthly > 5000 ? 6 : body.monthly > 0 ? 4 : 3,
      status: 'replied',
      source: 'calculator',
    })

    // Send revenue report email to lead
    const { subject, html } = buildEmail(body)
    await sendToLead(body.email, subject, html)

    // Notify Jeroen
    await resend.emails.send({
      from: FROM,
      to: NOTIFY,
      subject: `Calculator lead: ${body.name}  - ${fmt(body.monthly, body.lang)}/mo leak`,
      html: `
        <h2 style="font-family:sans-serif;color:#3d3929">Calculator submission</h2>
        <p style="font-family:sans-serif;color:#535146"><strong>Name:</strong> ${body.name}</p>
        <p style="font-family:sans-serif;color:#535146"><strong>Email:</strong> ${body.email}</p>
        <p style="font-family:sans-serif;color:#535146"><strong>Monthly leak:</strong> ${fmt(body.monthly, body.lang)}</p>
        <p style="font-family:sans-serif;color:#535146"><strong>Annual leak:</strong> ${fmt(body.annual, body.lang)}</p>
        <p style="font-family:sans-serif;color:#535146"><strong>Speed:</strong> ${body.speed}</p>
        <p style="font-family:sans-serif;color:#535146"><strong>Follow-up:</strong> ${body.followup}</p>
        <p style="font-family:sans-serif;color:#535146"><strong>Leads/mo:</strong> ${body.leads}</p>
        <p style="font-family:sans-serif;color:#535146"><strong>Avg deal:</strong> ${body.deal}</p>
        <p style="font-family:sans-serif;color:#535146;margin-top:16px">Report sent to ${body.email}</p>
      `,
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[calculator] error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
