import { Resend } from 'resend'
import { getUnreadReplies, markProcessed } from './gmail'
import { classifyAndReply } from './reply'
import { cancelNurtureSequence } from './store'
import { findSheetLeadByEmail, updateSheetLeadIntent } from './sheetLeads'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
)

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM   = 'Jeroen Sienaert <jeroen@leaditgrow.be>'
const JEROEN = 'jeroen@leaditgrow.be'

const INTENT_LABEL: Record<string, string> = {
  JA_INTERESSE:    'Interesse',
  VRAAG:           'Vraag',
  LATER:           'Later',
  LATER_SPECIFIEK: 'Later (datum)',
  NEE:             'Nee',
  OOT:             'Buiten doelgroep',
}

// Plant één reminder-mail naar Jeroen op de datum die de prospect zelf noemde
// (bv. "neem in oktober contact op"), i.p.v. de vaste nurture-cadans te hervatten.
async function scheduleFollowUpReminder(fromEmail: string, followUpDateIso: string): Promise<void> {
  const followUpDate = new Date(`${followUpDateIso}T09:00:00`)
  if (Number.isNaN(followUpDate.getTime()) || followUpDate.getTime() < Date.now()) return

  await resend.emails.send({
    from:    FROM,
    to:      JEROEN,
    subject: `Reminder: opnieuw contact opnemen met ${fromEmail}`,
    html: `<p>${fromEmail} vroeg om pas op ${followUpDateIso} opnieuw benaderd te worden. Dit is die reminder.</p>`,
    scheduledAt: followUpDate.toISOString(),
  })
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

      // Zoek eerst een Supabase-lead (contactformulier/calculator/diagnostic).
      const { data: lead } = await supabase
        .from('leads')
        .select('id')
        .eq('email', reply.fromEmail)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      if (lead?.id) {
        // Bij positieve of negatieve intent: lead status updaten + nurture stoppen
        if (result.intent === 'JA_INTERESSE') {
          await supabase.from('leads').update({ status: 'replied', replied_at: new Date().toISOString() }).eq('id', lead.id)
          await cancelNurtureSequence(lead.id).catch(() => {})
        } else if (result.intent === 'NEE' || result.intent === 'OOT') {
          await supabase.from('leads').update({ status: 'closed' }).eq('id', lead.id)
          await cancelNurtureSequence(lead.id).catch(() => {})
        } else if (result.intent === 'LATER_SPECIFIEK') {
          // Nurture stoppen, reminder plannen op de genoemde datum i.p.v. het vaste ritme
          await cancelNurtureSequence(lead.id).catch(() => {})
          if (result.followUpDate) {
            await scheduleFollowUpReminder(reply.fromEmail, result.followUpDate)
          }
        }
      } else {
        // Geen Supabase-lead — mogelijk een reply op de sheet-gebaseerde cold-outreach
        // (Apify Leads sheet). getUnreadReplies() heeft al bevestigd dat dit een reply
        // is binnen een thread die door ons verstuurd is (sentByUs-check in gmail.ts),
        // dus we zoeken hier enkel nog de bijbehorende rij op om de status weg te schrijven.
        const sheetMatch = await findSheetLeadByEmail(reply.fromEmail).catch(() => null)
        if (sheetMatch) {
          const sheetIntent = result.intent === 'LATER_SPECIFIEK' ? 'LATER_SPECIFIEK' : result.intent
          await updateSheetLeadIntent(sheetMatch.rowIndex, sheetIntent, reply.text).catch(() => {})
        }
      }

      // Bij LATER_SPECIFIEK geen directe reply met meeting-voorstel versturen —
      // classifyAndReply schreef al een reply die enkel de datum bevestigt.
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
