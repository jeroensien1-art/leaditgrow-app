import { NextRequest, NextResponse } from 'next/server'
import { getUnreadReplies, markProcessed } from '@/lib/crm/gmail'
import { classifyAndReply } from '@/lib/crm/reply'
import { Resend } from 'resend'

export const maxDuration = 60

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM   = 'Jeroen Sienaert <jeroen@leaditgrow.be>'
const JEROEN = 'jeroen@leaditgrow.be'

export async function POST(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret')
  if (!process.env.GMAIL_WEBHOOK_SECRET || secret !== process.env.GMAIL_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  await processReplies()
  return NextResponse.json({ ok: true })
}

async function processReplies() {
  const replies = await getUnreadReplies()
  console.log(`[gmail-webhook] found ${replies.length} replies to process`)

  for (const reply of replies) {
    try {
      await markProcessed(reply.id)

      const result = await classifyAndReply({
        fromEmail:       reply.fromEmail,
        replyText:       reply.text,
        originalSubject: reply.originalSubject,
      })

      console.log(`[gmail-webhook] ${reply.fromEmail} -> ${result.intent}`)

      if (result.intent === 'GEEN') continue

      await resend.emails.send({
        from:    FROM,
        to:      reply.fromEmail,
        subject: result.replySubject,
        html:    result.replyBodyHtml,
        text:    result.replyBody,
        headers: {
          'In-Reply-To': reply.originalMessageId,
          'References':  reply.originalMessageId,
        },
      })

      const intentLabel: Record<string, string> = {
        JA_INTERESSE: 'Interesse',
        VRAAG:        'Vraag',
        LATER:        'Later',
        NEE:          'Nee',
        OOT:          'Buiten doelgroep',
      }

      await resend.emails.send({
        from:    FROM,
        to:      JEROEN,
        subject: `[Reply] ${intentLabel[result.intent] ?? result.intent} - ${reply.fromEmail}`,
        html: `
<div style="font-family:sans-serif;max-width:600px;color:#333">
  <h3 style="color:#c96442">Reply van ${reply.fromEmail}</h3>
  <p><strong>Intent:</strong> ${intentLabel[result.intent] ?? result.intent}</p>
  <p><strong>Samenvatting:</strong> ${result.summary}</p>
  <hr style="border:none;border-top:1px solid #eee;margin:16px 0">
  <p><strong>Hun bericht:</strong></p>
  <pre style="background:#f5f5f5;padding:12px;border-radius:4px;white-space:pre-wrap;font-size:13px">${reply.text}</pre>
  <hr style="border:none;border-top:1px solid #eee;margin:16px 0">
  <p><strong>Automatische reply verstuurd:</strong></p>
  <pre style="background:#f0f7f0;padding:12px;border-radius:4px;white-space:pre-wrap;font-size:13px">${result.replyBody}</pre>
</div>`,
      })
    } catch (err) {
      console.error(`[gmail-webhook] error processing ${reply.fromEmail}:`, err)
    }
  }
}
