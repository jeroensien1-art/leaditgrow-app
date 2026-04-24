import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export type Intent = 'JA_INTERESSE' | 'VRAAG' | 'LATER' | 'NEE' | 'OOT' | 'GEEN'

export interface ReplyResult {
  intent: Intent
  summary: string
  replySubject: string
  replyBody: string      // plain text (for Claude to write naturally)
  replyBodyHtml: string  // HTML version with signature — built from replyBody
}

const LOGO_URL = 'https://leaditgrow.be/logo-email.svg'

export function buildHtmlEmail(plainText: string): string {
  // Convert plain text to HTML paragraphs
  const paragraphs = plainText
    .split(/\n{2,}/)
    .map(p => p.trim())
    .filter(Boolean)

  // Split off the signature block (last 2 lines starting from "Jeroen Sienaert")
  const sigIdx = paragraphs.findIndex(p => p.startsWith('Jeroen Sienaert'))
  const bodyParts = sigIdx > -1 ? paragraphs.slice(0, sigIdx) : paragraphs

  const bodyHtml = bodyParts
    .map(p => `<p style="margin:0 0 14px 0;line-height:1.6">${p.replace(/\n/g, '<br>')}</p>`)
    .join('\n')

  return `<div style="font-family:Georgia,'Times New Roman',serif;font-size:15px;color:#3d3929;max-width:560px">
${bodyHtml}
<table style="margin-top:28px;padding-top:16px;border-top:2px solid #e8e0d4;border-collapse:collapse" cellpadding="0" cellspacing="0">
  <tr>
    <td style="padding-right:14px;vertical-align:middle">
      <img src="${LOGO_URL}" width="28" height="34" alt="" style="display:block">
    </td>
    <td style="vertical-align:middle">
      <div style="font-weight:600;color:#3d3929;font-size:14px;line-height:1.3">Jeroen Sienaert</div>
      <div style="font-style:italic;font-size:13px;color:#3d3929;line-height:1.3">Lead it, <span style="color:#c96442;font-weight:600">Grow</span></div>
      <div style="font-size:12px;color:#999;margin-top:2px">
        <a href="https://leaditgrow.be" style="color:#999;text-decoration:none">leaditgrow.be</a>
      </div>
    </td>
  </tr>
</table>
</div>`
}

const WEBSITE_KNOWLEDGE = `
Lead it, Grow — kerninfo voor het beantwoorden van vragen:

Wat we doen: groeisystemen bouwen voor Vlaamse KMO-zaakvoerders zodat hun omzet niet meer afhangt van wat zij persoonlijk doen of opvolgen.

Aanbod (offer ladder):
- Gratis: Omzetcalculator (2 min, geeft direct inzicht) — https://leaditgrow.be/calculator
- Gratis: Business Diagnostic (volledig rapport van je groeifase) — https://leaditgrow.be/diagnostic
- €97-297: Actiehandboek (30-dagenplan, top 3 fixes voor jouw situatie)
- €997-2500: BD Sprint — 4 weken done-with-you. We bouwen de automatische opvolgings-engine zodat elke lead binnen minuten een reactie krijgt zonder extra mensen.
- €1500-3500/maand: Done-for-You Retainer — wij runnen het systeem volledig
- €5000+: White-Label licentie voor agencies

Voor wie: zaakvoerders van KMO's in Vlaanderen, typisch 2-20 medewerkers, die willen groeien zonder dat de groei puur via hen moet lopen.

Pijnpunten die we oplossen:
- Te veel omzet afhankelijk van de zaakvoerder
- Trage of inconsistente opvolging van leads (deals verloren door timing)
- Geen systeem voor business development — alles gaat ad hoc
- Groei via mensen aannemen werkt niet op schaal

Kwalificatievragen die we stellen:
- Hoeveel van jullie omzet hangt af van wat jij persoonlijk doet?
- Hoe groot is het team en wat is de omzet (ruwe schatting)?
- Wat is het voornaamste bottleneck: leads genereren, leads opvolgen, of leads converteren?
- Welke tools/systemen gebruik je nu voor business development?

Website pagina's:
- Homepage: https://leaditgrow.be
- Diensten & prijzen: https://leaditgrow.be/diensten
- Over Jeroen: https://leaditgrow.be/over
- Blog: https://leaditgrow.be/blog
- Calculator: https://leaditgrow.be/calculator
- Business Diagnostic: https://leaditgrow.be/diagnostic
- Contact: https://leaditgrow.be/contact
`

function generateTimeSlots(): string[] {
  const dayNames = ['maandag', 'dinsdag', 'woensdag', 'donderdag', 'vrijdag']
  const monthNames = [
    'januari', 'februari', 'maart', 'april', 'mei', 'juni',
    'juli', 'augustus', 'september', 'oktober', 'november', 'december',
  ]
  const timeOptions = ['10:00', '10:30', '11:00', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30']

  const now = new Date()
  // Seed based on day-of-month so same day gives same slots
  const seed = now.getDate() + now.getMonth() * 31
  let timeIdx = seed % timeOptions.length

  const slots: string[] = []
  const d = new Date(now)
  d.setDate(d.getDate() + 1) // start tomorrow

  while (slots.length < 3) {
    const dow = d.getDay()
    if (dow >= 1 && dow <= 5) {
      const t = timeOptions[timeIdx % timeOptions.length]
      slots.push(`${dayNames[dow - 1]} ${d.getDate()} ${monthNames[d.getMonth()]} om ${t}`)
      timeIdx += 3
      d.setDate(d.getDate() + 2) // spread slots: skip at least 1 day
    } else {
      d.setDate(d.getDate() + 1)
    }
    // Safety: don't go past 15 days
    if ((d.getTime() - now.getTime()) / 86400000 > 15) break
  }
  return slots
}

export async function classifyAndReply({
  fromEmail,
  replyText,
  originalSubject,
}: {
  fromEmail: string
  replyText: string
  originalSubject: string
}): Promise<ReplyResult> {
  const slots = generateTimeSlots()
  const slotsText = slots.map((s, i) => `${i + 1}. ${s}`).join('\n')
  const today = new Date().toLocaleDateString('nl-BE', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  })

  const replySubjectBase = originalSubject.startsWith('Re:') ? originalSubject : `Re: ${originalSubject}`

  const prompt = `Je bent Jeroen's AI assistent voor Lead it, Grow. Een prospect heeft gereageerd op een van Jeroen's outreach emails. Schrijf een directe, warme reply in dezelfde taal als hun bericht.

${WEBSITE_KNOWLEDGE}

Vandaag: ${today}

Beschikbare slots voor een kennismakingsgesprek (15 min):
${slotsText}

Van: ${fromEmail}
Onderwerp originele mail: ${originalSubject}

Hun bericht:
${replyText}

Jouw opdracht:
1. Classificeer de intent: JA_INTERESSE (positief/interesse), VRAAG (stellen een vraag), LATER (niet nu), NEE (geen interesse), OOT (buiten doelgroep), GEEN (spam/onbelangrijk)
2. ALTIJD kwalificeren: als je nog niet weet wat hun voornaamste groeibottleneck is, hoe groot het team is of wat hun huidige aanpak is voor BD — stel max 1 gerichte vraag.
3. ALTIJD een meeting proberen te boeken: stel de 3 tijdslots voor en vraag hun gsm-nummer om te bevestigen.
4. Als ze een vraag stellen: beantwoord bondig en correct op basis van de website info, dan direct doorsturen naar een meeting.
5. Als intent NEE is: sluit vriendelijk af, bied aan om over 3 maanden terug te komen.
6. Als intent LATER is: erken, stel toch 1 slot voor "gewoon om het al in te plannen, je kan altijd verzetten".
7. Nooit holle zinnen. Geen "ik hoop dat dit bericht je goed vindt". Direct en warm.
8. Onderteken altijd: Jeroen Sienaert / Lead it, Grow · leaditgrow.be

Antwoord met geldig JSON, geen markdown:
{
  "intent": "JA_INTERESSE|VRAAG|LATER|NEE|OOT|GEEN",
  "summary": "<één zin die beschrijft wie dit is en wat ze willen>",
  "replySubject": "${replySubjectBase}",
  "replyBody": "<plain text email body>"
}`

  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1200,
    messages: [{ role: 'user', content: prompt }],
  })

  const text = response.content.find(b => b.type === 'text')?.text ?? ''
  const clean = text.replace(/```json|```/g, '').trim()
  const result = JSON.parse(clean) as Omit<ReplyResult, 'replyBodyHtml'>
  return {
    ...result,
    replyBodyHtml: buildHtmlEmail(result.replyBody),
  }
}
