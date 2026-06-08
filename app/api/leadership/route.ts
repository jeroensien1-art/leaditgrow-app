import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM = 'Jeroen | Lead it, Grow <jeroen@leaditgrow.be>'
const NOTIFY = 'jeroen@leaditgrow.be'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as {
      name: string
      email: string
      gsm: string
      werknemers: string
      checks: string[]
    }

    if (!body.email || !body.name) {
      return NextResponse.json({ error: 'Missing name or email' }, { status: 400 })
    }

    const firstName = body.name.split(' ')[0] ?? body.name

    await resend.emails.send({
      from: FROM,
      to: body.email,
      subject: `${firstName}, jouw gegevens zijn goed ontvangen`,
      html: `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#faf9f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">
<div style="max-width:600px;margin:0 auto;padding:32px 16px">
  <div style="background:#fff;border-radius:16px;border:1px solid rgba(61,57,41,.1);padding:32px;box-shadow:0 4px 24px rgba(0,0,0,.06)">
    <div style="font-size:11px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:#c96442;margin-bottom:20px">Lead it, Grow</div>
    <p style="font-size:16px;color:#3d3929;margin:0 0 16px">Hi ${firstName},</p>
    <p style="font-size:14px;color:#535146;line-height:1.7;margin:0 0 20px">
      Jouw gegevens zijn goed ontvangen. Je wordt binnen de 48 uur opgebeld om een gratis diepgaande consultatie rond leiderschap in te plannen.
    </p>
    <div style="background:#3d3929;border-radius:12px;padding:22px 24px;margin-bottom:24px">
      <div style="font-size:14px;font-weight:700;color:#fff;margin-bottom:10px">Wat te verwachten</div>
      <p style="font-size:13px;color:rgba(255,255,255,.8);line-height:1.7;margin:0">
        Ik contacteer je om een volledig gratis diepgaande consultatie rond leiderschap en beter uitspelen van jouw persoonlijke sterktes (90 min) in te plannen. Een uiterst boeiend gesprek met practische inzichten die je als leider naar een hoger niveau helpen.
      </p>
    </div>
    <p style="font-size:13px;color:#83827d;line-height:1.65;margin:0">
      Geen verplichtingen. Volledig gratis. Tot snel.
    </p>
    <div style="margin-top:24px;padding-top:16px;border-top:1px solid rgba(61,57,41,.1)">
      <div style="font-size:13px;font-weight:600;color:#3d3929">Jeroen</div>
      <div style="font-size:12px;color:#83827d">Lead it, Grow · jeroen@leaditgrow.be</div>
    </div>
  </div>
</div>
</body></html>`,
    })

    const checksHtml = body.checks.length > 0
      ? body.checks.map(c => `<li style="font-size:13px;color:#3d3929;padding:3px 0">${c}</li>`).join('')
      : '<li style="font-size:13px;color:#83827d">Geen selecties gemaakt</li>'

    await resend.emails.send({
      from: FROM,
      to: NOTIFY,
      subject: `Nieuwe consultatie-aanvraag: ${body.name}`,
      html: `
        <div style="font-family:sans-serif;max-width:560px">
          <h2 style="color:#3d3929;margin-bottom:4px">Nieuwe consultatie-aanvraag</h2>
          <p style="color:#83827d;font-size:13px;margin:0 0 16px">
            ${body.name} · ${body.email} · ${body.gsm || 'geen GSM'} · ${body.werknemers || '?'} werknemers
          </p>
          <div style="background:#f3f1eb;border-radius:8px;padding:14px 18px;margin-bottom:16px">
            <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:#c96442;margin-bottom:8px">Pijnpunten</div>
            <ul style="margin:0;padding-left:16px">${checksHtml}</ul>
          </div>
          <p style="color:#83827d;font-size:12px">Bevestigingsmail verstuurd naar ${body.email}</p>
        </div>
      `,
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[leadership] error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
