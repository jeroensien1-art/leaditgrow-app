import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'
import { cancelNurtureSequence } from '@/lib/crm/store'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
)
const resend = new Resend(process.env.RESEND_API_KEY)
const FROM = 'Lead it, Grow <jeroen@leaditgrow.be>'
const NOTIFY = 'jeroen@leaditgrow.be'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  const slot = searchParams.get('slot')

  if (!id || !slot) {
    return new NextResponse('Ongeldige link.', {
      status: 400,
      headers: { 'Content-Type': 'text/plain' },
    })
  }

  const { data: lead } = await supabase
    .from('leads')
    .select('name, email, status')
    .eq('id', id)
    .single()

  if (lead?.status !== 'booked') {
    await supabase
      .from('leads')
      .update({ status: 'booked', replied_at: new Date().toISOString() })
      .eq('id', id)

    // Stop alle ingeplande nurture emails
    await cancelNurtureSequence(id).catch(err => console.error('[book] cancel nurture error:', err))

    await resend.emails.send({
      from: FROM,
      to: NOTIFY,
      subject: `Gesprek geboekt: ${lead?.name ?? 'Onbekend'} — ${slot}`,
      html: `
        <div style="font-family:sans-serif;max-width:480px">
          <h2 style="color:#3d3929;margin-bottom:4px">Gesprek geboekt</h2>
          <p style="color:#535146"><strong>${lead?.name ?? 'Onbekend'}</strong> (${lead?.email ?? id}) heeft een tijdstip gekozen:</p>
          <div style="background:#f3f1eb;border-radius:8px;padding:14px 18px;font-size:18px;font-weight:700;color:#c96442;margin:16px 0">${slot}</div>
          <p style="color:#83827d;font-size:13px">Status in dashboard bijgewerkt naar <strong>booked</strong>.</p>
        </div>
      `,
    })
  }

  return new NextResponse(
    `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Gesprek bevestigd — Lead it, Grow</title></head>
<body style="margin:0;padding:0;background:#faf9f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">
<div style="max-width:480px;margin:0 auto;padding:60px 24px;text-align:center">
  <div style="font-size:48px;margin-bottom:20px">&#10003;</div>
  <div style="font-size:11px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:#c96442;margin-bottom:8px">Lead it, Grow</div>
  <h1 style="font-size:1.5rem;color:#3d3929;margin-bottom:16px;font-weight:700">Gesprek bevestigd</h1>
  <div style="background:#f3f1eb;border-radius:10px;padding:16px 24px;margin:0 auto 24px;display:inline-block">
    <div style="font-size:16px;font-weight:600;color:#3d3929">${slot}</div>
  </div>
  <p style="color:#535146;font-size:0.95rem;line-height:1.7;margin-bottom:0">Jeroen neemt contact met je op om het gesprek te bevestigen. Graag tot dan!</p>
  <div style="margin-top:48px;font-size:12px;color:#b0aea8">Lead it, Grow &middot; jeroen@leaditgrow.be</div>
</div>
</body></html>`,
    { headers: { 'Content-Type': 'text/html; charset=utf-8' } }
  )
}
