import { Resend } from 'resend'
import { getUnreadReplies, markProcessed } from './gmail'
import { classifyAndReply } from './reply'

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM   = 'Jeroen Sienaert <jeroen@leaditgrow.be>'
const JEROEN = 'jeroen@leaditgrow.be'

const INTENT_LABEL: Record<string, string> = {
  JA_INTERESSE: 'Interesse',
  VRAAG:        'Vraag',
  LATER:        'Later',
  NEE:          'Nee',
  OOT:          'Buiten doelgroep',
}

export async function processReplies(): Promise<{ processed: number }> {
  const replies = await getUnreadReplies()
  console.log(`[auto-reply] found ${replies.length} messages to process`)

  let processed = 0

  for (const reply of replies.slice(0, 3)) {
    try {
      await markProcessed(reply.id)

      const result = await classifyAndReply({
        fromEmail:       reply.fromEmail,
        replyText:       reply.text,
        originalSubject: reply.originalSubject,
      })

      console.log(`[auto-reply] ${reply.fromEmail} -> ${result.intent}`)

      if (result.intent === 'GEEN') continue

      await resend.emails.send({
        from:    FROM,
        to:      reply.fromEmail,
        subject: result.replySubject,
        html:    result.replyBodyHtml,
        text:    result.replyBody,
        ...(reply.originalMessageId ? {
          headers: {
            'In-Reply-To': reply.originalMessageId,
            'References':  reply.originalMessageId,
          },
        } : {}),
      })

      await resend.emails.send({
        from:    FROM,
        to:      JEROEN,
        subject: `[Reply] ${INTENT_LABEL[result.intent] ?? result.intent} - ${reply.fromEmail}`,
        html: `
<div style="font-family:sans-serif;max-width:600px;color:#333">
  <h3 style="color:#c96442">Reply van ${reply.fromEmail}</h3>
  <p><strong>Intent:</strong> ${INTENT_LABEL[result.intent] ?? result.intent}</p>
  <p><strong>Samenvatting:</strong> ${result.summary}</p>
  <hr style="border:none;border-top:1px solid #eee;margin:16px 0">
  <p><strong>Hun bericht:</strong></p>
  <pre style="background:#f5f5f5;padding:12px;border-radius:4px;white-space:pre-wrap;font-size:13px">${reply.text}</pre>
  <hr style="border:none;border-top:1px solid #eee;margin:16px 0">
  <p><strong>Automatische reply verstuurd:</strong></p>
  <pre style="background:#f0f7f0;padding:12px;border-radius:4px;white-space:pre-wrap;font-size:13px">${result.replyBody}</pre>
</div>`,
      })

      processed++
    } catch (err) {
      console.error(`[auto-reply] error processing ${reply.fromEmail}:`, err)
    }
  }

  return { processed }
}
