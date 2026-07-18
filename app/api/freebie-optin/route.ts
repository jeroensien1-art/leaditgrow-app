import { NextRequest, NextResponse } from 'next/server'
import { saveLead } from '@/lib/crm/store'
import { randomUUID } from 'crypto'
import { Resend } from 'resend'
import { FREEBIES, type FreebieId } from '@/lib/freebies'
import Redis from 'ioredis'

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM = 'Jeroen | Lead it, Grow <jeroen@leaditgrow.be>'
const NOTIFY = 'jeroen@leaditgrow.be'
const SITE = 'https://leaditgrow.be'

const RATE_LIMIT = 3
const WINDOW_SECONDS = 60 * 60

let redis: Redis | null = null
function getRedis() {
  if (!redis && process.env.REDIS_URL) {
    redis = new Redis(process.env.REDIS_URL, { lazyConnect: true, enableReadyCheck: false })
  }
  return redis
}

async function checkRateLimit(ip: string): Promise<boolean> {
  const client = getRedis()
  if (!client) return true
  try {
    const key = `rate:freebie:${ip}`
    const count = await client.incr(key)
    if (count === 1) await client.expire(key, WINDOW_SECONDS)
    return count <= RATE_LIMIT
  } catch {
    return true
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name, email, freebie } = await req.json()

    if (!name || !email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json({ error: 'Ongeldige invoer' }, { status: 400 })
    }
    const config = FREEBIES[freebie as FreebieId]
    if (!config) {
      return NextResponse.json({ error: 'Onbekende freebie' }, { status: 400 })
    }

    const ip = (req.headers.get('x-forwarded-for') ?? '127.0.0.1').split(',')[0].trim()
    if (!await checkRateLimit(ip)) {
      return NextResponse.json({ error: 'Te veel aanvragen' }, { status: 429 })
    }

    const id = randomUUID()
    const firstName = String(name).split(' ')[0]
    const downloadUrl = `${SITE}/downloads/${config.downloadFile}`

    await saveLead({
      id,
      name,
      email,
      message: `Gratis freebie opt-in: ${config.title}`,
      lang: 'nl',
      submittedAt: Date.now(),
      qualified: false,
      score: 0,
      status: 'new',
      source: 'widget',
    })

    resend.emails.send({
      from: FROM,
      to: email,
      bcc: NOTIFY,
      subject: `${firstName}, ${config.subject}`,
      html: `<!DOCTYPE html>
<html lang="nl">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#faf9f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#faf9f5;padding:40px 16px;">
    <tr><td align="center">
      <table width="100%" style="max-width:560px;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid rgba(61,57,41,0.1);">
        <tr><td style="background:#3d3929;padding:32px 40px;">
          <p style="margin:0;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:rgba(250,249,245,0.4);font-family:monospace;">Lead it, Grow</p>
          <h1 style="margin:12px 0 0;font-size:24px;font-weight:400;color:#faf9f5;line-height:1.2;font-family:Georgia,serif;">${config.title}</h1>
        </td></tr>
        <tr><td style="padding:36px 40px;">
          <p style="margin:0 0 20px;font-size:15px;line-height:1.6;color:#535146;">Hoi ${firstName},</p>
          <p style="margin:0 0 20px;font-size:15px;line-height:1.6;color:#535146;">${config.emailIntro}</p>
          <table cellpadding="0" cellspacing="0" style="margin:28px 0;">
            <tr><td style="background:#c96442;border-radius:50px;">
              <a href="${downloadUrl}" style="display:inline-block;padding:14px 32px;font-size:15px;font-weight:600;color:#ffffff;text-decoration:none;">Download →</a>
            </td></tr>
          </table>
          <ul style="margin:0 0 8px;padding-left:20px;font-size:14px;line-height:1.8;color:#535146;">
            ${config.emailBullets.map(b => `<li>${b}</li>`).join('')}
          </ul>
        </td></tr>
        <tr><td style="padding:20px 40px;background:#f5f3ee;border-top:1px solid rgba(61,57,41,0.08);">
          <p style="margin:0;font-size:12px;color:#83827d;line-height:1.6;">
            Jeroen · Lead it, Grow · <a href="https://leaditgrow.be" style="color:#83827d;">leaditgrow.be</a>
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`,
    }).catch(err => console.error('[freebie-optin] email error:', err))

    resend.emails.send({
      from: FROM,
      to: NOTIFY,
      subject: `Nieuwe opt-in (${config.title}): ${name}`,
      html: `<p style="font-family:sans-serif;color:#535146"><strong>Naam:</strong> ${name}<br><strong>Email:</strong> ${email}<br><strong>Freebie:</strong> ${config.title}</p>`,
    }).catch(err => console.error('[freebie-optin] notify error:', err))

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[freebie-optin] error:', err)
    return NextResponse.json({ error: 'Interne fout' }, { status: 500 })
  }
}
