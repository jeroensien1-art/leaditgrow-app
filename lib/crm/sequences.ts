import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM = 'Jeroen | Lead it, Grow <jeroen@leaditgrow.be>'
const SITE = 'https://leaditgrow.be'

function daysFromNow(days: number): string {
  const d = new Date()
  d.setDate(d.getDate() + days)
  d.setHours(9, 0, 0, 0)
  return d.toISOString()
}

// ─── PURCHASE SEQUENCE ────────────────────────────────────────────────────────
// Triggered by Stripe checkout.session.completed

export async function sendPurchaseSequence(name: string, email: string) {
  const first = name.split(' ')[0]

  // Day 0 — bevestiging + download
  await resend.emails.send({
    from: FROM,
    to: email,
    subject: `${first}, je actiehandboek staat klaar`,
    html: purchaseDay0(first),
  })

  // Day 3 — hefboomdiagnose prompt
  await resend.emails.send({
    from: FROM,
    to: email,
    subject: `Heb je de diagnose al gedaan, ${first}?`,
    html: purchaseDay3(first),
    scheduledAt: daysFromNow(3),
  })

  // Day 7 — implementatie check-in
  await resend.emails.send({
    from: FROM,
    to: email,
    subject: `Week 1 achter de rug — hoe loopt het?`,
    html: purchaseDay7(first),
    scheduledAt: daysFromNow(7),
  })

  // Day 14 — resultaten + uitnodiging strategie gesprek
  await resend.emails.send({
    from: FROM,
    to: email,
    subject: `14 dagen in — wat merk je al?`,
    html: purchaseDay14(first),
    scheduledAt: daysFromNow(14),
  })
}

function purchaseDay0(first: string): string {
  return emailWrap(`
    <p>Hoi ${first},</p>
    <p>Betaling gelukt — het Businessgroei Actiehandboek staat klaar voor je.</p>
    <cta-btn href="${SITE}/downloads/actiehandboek.pdf">Download het actiehandboek →</cta-btn>
    <p><strong>Waar te beginnen:</strong></p>
    <ul>
      <li><strong>Pagina 1 — De 7-hefboomdiagnose:</strong> scoor jezelf voor je verder leest. Dit bepaalt in welke volgorde je de hoofdstukken aanpakt.</li>
      <li><strong>Hoofdstuk 3 — Speed-to-lead:</strong> als je maar één ding deze week implementeert, laat dit het zijn. Resultaat voelbaar binnen 48u.</li>
      <li><strong>Het 30-dagenplan achteraan:</strong> kopieer week 1 direct naar je agenda. Niet lezen, plannen.</li>
    </ul>
    <p>Vragen terwijl je door het handboek gaat? Reply gewoon op deze mail.</p>
    <sign>Jeroen</sign>
  `)
}

function purchaseDay3(first: string): string {
  return emailWrap(`
    <p>Hoi ${first},</p>
    <p>Drie dagen geleden heb je het actiehandboek gedownload. Ik ben benieuwd: ben je al begonnen met de 7-hefboomdiagnose?</p>
    <p>De diagnose (pagina 1) is het meest onderschatte onderdeel van het handboek. De meeste ondernemers slaan hem over en beginnen meteen met hoofdstuk 1. Dat is een vergissing.</p>
    <p>Waarom? Omdat de diagnose je vertelt <em>welk hoofdstuk jij als eerste moet uitvoeren</em>. Zonder die volgorde werk je misschien aan het verkeerde ding.</p>
    <p>Het kost 5 minuten. Doe het nu als je het nog niet gedaan hebt.</p>
    <p>Als je vastzit of als een hoofdstuk vragen oproept: reply op deze mail. Ik lees alles.</p>
    <sign>Jeroen</sign>
  `)
}

function purchaseDay7(first: string): string {
  return emailWrap(`
    <p>Hoi ${first},</p>
    <p>Week 1 zit erop. Hoe gaat het met het handboek?</p>
    <p>Ik wil je een concrete tip meegeven voor deze week, ongeacht waar je staat:</p>
    <blockquote>Meet deze week hoelang het duurt voor een nieuwe aanvraag een eerste reactie krijgt — ook 's avonds, in het weekend en op maandag voor 9u. Dat getal is je baseline. Alles boven 30 minuten is geld dat je laat liggen.</blockquote>
    <p>Dit is de maatstaf uit hoofdstuk 3. Als je dat getal nog niet hebt, start daar. Als je het al hebt: goed bezig — het systeem uit H3 doet de rest.</p>
    <p>Laat me weten wat je vindt als je eenmaal een getal hebt. Veel ondernemers zijn verrast.</p>
    <sign>Jeroen</sign>
  `)
}

function purchaseDay14(first: string): string {
  return emailWrap(`
    <p>Hoi ${first},</p>
    <p>14 dagen geleden begon je aan het actiehandboek. Ik check graag even in.</p>
    <p>Twee mogelijke scenario's:</p>
    <p><strong>Je hebt dingen uitgevoerd en merkt al iets.</strong> Dat is het moment om door te gaan en het systeem verder op te bouwen. Het sneeuwbaleffect begint nu.</p>
    <p><strong>Je bent er nog niet aan toegekomen.</strong> Dat is oké — maar dan is dit de nudge. Kies één hoofdstuk, één actie, en doe die morgen. Geen planning, gewoon die ene stap.</p>
    <p>Als je vastloopt of als je het liever samen doet: ik doe een beperkt aantal strategie gesprekken per maand. Geen verkooppraatje — gewoon jouw situatie doorlopen en kijken wat als eerste zin heeft.</p>
    <cta-btn href="mailto:jeroen@leaditgrow.be?subject=Strategiegesprek">Stuur me een mail →</cta-btn>
    <p>Reply ook gewoon op deze mail als je vragen hebt.</p>
    <sign>Jeroen</sign>
  `)
}

// ─── DIAGNOSTIC NURTURE SEQUENCE ─────────────────────────────────────────────
// Triggered after diagnostic submit — complements the report that's already sent

const LEVER_CHAPTER: Record<string, { chapter: string; hook: string }> = {
  time: {
    chapter: 'H1 (De Groeiladder) en H2 (jouw omzetlek)',
    hook: 'Je spendeert meer dan 40% van je week aan taken die een ander kan doen. Dat is geen gevoel — dat is een berekening die H2 je laat maken.',
  },
  leadership: {
    chapter: 'H8 (Impactvol leiderschap)',
    hook: 'Jouw team is niet het probleem. De beslissingsstructuur is het probleem. H8 geeft je een kader om dat in één gesprek met je team te veranderen.',
  },
  speed_to_lead: {
    chapter: 'H3 (Speed-to-lead) en H4 (pipeline-opvolging)',
    hook: 'Je reageert te laat op leads. HubSpot-data: na 30 minuten daalt je kans met 100x. H3 lost dit op in één middag.',
  },
  marketing: {
    chapter: 'H5 (Online aanwezigheid) en H7 (groeimotoren)',
    hook: 'Jouw pipeline stopt als jij stopt. H5 en H7 bouwen een systeem dat leads genereert ook als jij niet actief bent.',
  },
  sales: {
    chapter: 'H6 (Sluitingspercentage)',
    hook: 'Goede gesprekken die niet sluiten zijn een kwalificatieprobleem, geen overtuigingsprobleem. H6 geeft je het kader om dat te corrigeren.',
  },
}

export async function sendDiagnosticNurtureSequence(
  name: string,
  email: string,
  topLever: string,
  score: number
) {
  const first = name.split(' ')[0]
  const leverInfo = LEVER_CHAPTER[topLever] ?? LEVER_CHAPTER['time']
  const isLeadership = topLever === 'leadership'

  // Day 3 — lever-specifieke opvolging + zachte push
  await resend.emails.send({
    from: FROM,
    to: email,
    subject: `${first}, één ding over jouw diagnoseresultaat`,
    html: diagnosticDay3(first, leverInfo, isLeadership),
    scheduledAt: daysFromNow(3),
  })

  // Day 7 — specifiek hoofdstuk + social proof
  await resend.emails.send({
    from: FROM,
    to: email,
    subject: `Het hoofdstuk dat jouw #1 probleem oplost`,
    html: diagnosticDay7(first, leverInfo, score, isLeadership),
    scheduledAt: daysFromNow(7),
  })

  // Day 14 — laatste kans + alternatief aanbod
  await resend.emails.send({
    from: FROM,
    to: email,
    subject: `${first}, nog één keer`,
    html: diagnosticDay14(first, isLeadership),
    scheduledAt: daysFromNow(14),
  })
}

function diagnosticDay3(
  first: string,
  lever: { chapter: string; hook: string },
  isLeadership: boolean
): string {
  return emailWrap(`
    <p>Hoi ${first},</p>
    <p>Ik wilde even terugkomen op jouw diagnoseresultaat van drie dagen geleden.</p>
    <p>${lever.hook}</p>
    <p>Dit is precies wat ${lever.chapter} in het actiehandboek aanpakt — met concrete stappen die je zelf uitvoert, geen theorie.</p>
    ${isLeadership
      ? `<p>Voor leiderschap geldt wel dat de gratis leiderschapsanalyse (75 min) je sneller verderbrengt dan het handboek alleen. Die analyse gaat specifiek in op <em>jouw</em> situatie, niet op een algemeen kader.</p>
         <cta-btn href="${SITE}/analyse">Boek de gratis leiderschapsanalyse →</cta-btn>`
      : `<cta-btn href="${SITE}/actiehandboek">Bekijk het actiehandboek · €97 →</cta-btn>`
    }
    <p>Vragen over de diagnose? Reply gewoon.</p>
    <sign>Jeroen</sign>
  `)
}

function diagnosticDay7(
  first: string,
  lever: { chapter: string; hook: string },
  score: number,
  isLeadership: boolean
): string {
  const urgency = score >= 60
    ? 'Jouw diagnose gaf een score van meer dan 60/100. Dat betekent dat meerdere hefbomen tegelijk energie kosten. De volgorde waarin je ze aanpakt bepaalt hoe snel je resultaat voelt.'
    : 'Jouw diagnose wees op een duidelijk #1 hefboom. Dat is eigenlijk goed nieuws: er is één ding dat het meeste verschil maakt. Focus op dat ene ding.'

  return emailWrap(`
    <p>Hoi ${first},</p>
    <p>${urgency}</p>
    <p>Het hoofdstuk dat voor jou het meeste verschil maakt: <strong>${lever.chapter}</strong>.</p>
    <p>Een zaakvoerder die vorige maand hetzelfde traject doorliep zei na een week: <em>"Ik had dit drie jaar geleden moeten doen. Niet omdat het moeilijk is, maar omdat het simpel is als je het eens op papier ziet."</em></p>
    ${isLeadership
      ? `<p>Voor leiderschap raad ik de gratis analyse aan voor je met het handboek begint. Die analyse geeft je de context die het handboek mee te veel mist.</p>
         <cta-btn href="${SITE}/analyse">Gratis leiderschapsanalyse →</cta-btn>`
      : `<cta-btn href="${SITE}/actiehandboek">Actiehandboek · €97 — met 21-dagen garantie →</cta-btn>`
    }
    <sign>Jeroen</sign>
  `)
}

function diagnosticDay14(first: string, isLeadership: boolean): string {
  return emailWrap(`
    <p>Hoi ${first},</p>
    <p>Dit is de laatste mail in deze reeks — ik wil je inbox niet blijven vullen als de timing niet klopt.</p>
    <p>Maar als je de diagnose hebt gedaan en je weet wat jouw #1 hefboom is, dan is er eigenlijk maar één vraag: wanneer begin je?</p>
    ${isLeadership
      ? `<p>Als leiderschap jouw grootste lek is, is de gratis leiderschapsanalyse de snelste manier om te starten. 75 minuten, geen pitch, je gaat weg met een concreet beeld van wat je moet aanpassen.</p>
         <cta-btn href="${SITE}/analyse">Boek de gratis leiderschapsanalyse →</cta-btn>
         <p>Of als je liever met het handboek begint:</p>
         <a href="${SITE}/actiehandboek" style="color:#c96442;">Actiehandboek · €97 →</a>`
      : `<p>Het actiehandboek heeft een 21-dagen geld-terug-garantie als je de eerste stappen uitvoert. Als het niks oplevert na drie weken van uitvoering, krijg je €97 terug. Geen vragen.</p>
         <cta-btn href="${SITE}/actiehandboek">Actiehandboek · €97 →</cta-btn>`
    }
    <p>Als de timing nu gewoon niet klopt: dat begrijp ik ook. Maar stuur me dan een reply — ik help je graag als het moment er wel is.</p>
    <sign>Jeroen</sign>
  `)
}

// ─── APPOINTMENT WARM-UP SEQUENCE ────────────────────────────────────────────
// Triggered after appointment booking (Calendly webhook or manual)

export async function sendAppointmentSequence(
  name: string,
  email: string,
  appointmentDate: string  // ISO string of the appointment
) {
  const first = name.split(' ')[0]
  const apptMs = new Date(appointmentDate).getTime()
  const now = Date.now()
  const daysBefore = Math.max(0, Math.floor((apptMs - now) / (1000 * 60 * 60 * 24)))

  // Immediate — bevestiging
  await resend.emails.send({
    from: FROM,
    to: email,
    subject: `Goed, ${first} — je afspraak staat in de agenda`,
    html: appointmentConfirm(first, appointmentDate),
  })

  // 1 dag voor de afspraak — prep mail (alleen als afspraak > 2 dagen weg is)
  if (daysBefore >= 2) {
    const prepDate = new Date(apptMs - 24 * 60 * 60 * 1000)
    prepDate.setHours(9, 0, 0, 0)
    await resend.emails.send({
      from: FROM,
      to: email,
      subject: `Morgen onze afspraak — dit helpt om er het meeste uit te halen`,
      html: appointmentPrep(first),
      scheduledAt: prepDate.toISOString(),
    })
  }
}

function appointmentConfirm(first: string, appointmentDate: string): string {
  const date = new Date(appointmentDate).toLocaleDateString('nl-BE', {
    weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit'
  })
  return emailWrap(`
    <p>Hoi ${first},</p>
    <p>Je afspraak staat bevestigd: <strong>${date}</strong>.</p>
    <p>Wat we gaan doen: jouw situatie doorlopen op basis van de diagnose (of wat je zelf meebrengt) en kijken welke één verandering de meeste impact heeft. Geen generieke adviezen — gewoon jouw bedrijf.</p>
    <p>Geen voorbereiding nodig. Als je de diagnose al deed, stuur me dan gerust even je resultaten door zodat ik al een beeld heb.</p>
    <p>Tot ${new Date(appointmentDate).toLocaleDateString('nl-BE', { weekday: 'long' })}.</p>
    <sign>Jeroen</sign>
  `)
}

function appointmentPrep(first: string): string {
  return emailWrap(`
    <p>Hoi ${first},</p>
    <p>Morgen onze afspraak. Eén ding dat het gesprek scherper maakt als je er even 5 minuten voor hebt:</p>
    <p>Denk aan de situatie die je het meest frustreert in je bedrijf op dit moment. Niet de symptomen — de onderliggende oorzaak. Bijvoorbeeld niet "we hebben te weinig leads" maar "ik weet niet welk kanaal echt werkt en meet het niet".</p>
    <p>Dat ene ding is waar we van vertrekken. De rest volgt vanzelf.</p>
    <p>Tot morgen.</p>
    <sign>Jeroen</sign>
  `)
}

// ─── SHARED TEMPLATE HELPER ──────────────────────────────────────────────────

function emailWrap(body: string): string {
  const processed = body
    .replace(/<cta-btn href="([^"]+)">([^<]+)<\/cta-btn>/g, (_m, href, label) => `
      <table cellpadding="0" cellspacing="0" style="margin:24px 0;">
        <tr><td style="background:#c96442;border-radius:50px;">
          <a href="${href}" style="display:inline-block;padding:13px 28px;font-size:14px;font-weight:600;color:#ffffff;text-decoration:none;">${label}</a>
        </td></tr>
      </table>`)
    .replace(/<sign>([^<]+)<\/sign>/g, (_m, name) => `
      <hr style="border:none;border-top:1px solid rgba(61,57,41,0.1);margin:28px 0 20px;">
      <p style="margin:0;font-size:13px;font-weight:600;color:#3d3929;">${name}</p>
      <p style="margin:4px 0 0;font-size:12px;color:#83827d;">Lead it, Grow · <a href="mailto:jeroen@leaditgrow.be" style="color:#83827d;">jeroen@leaditgrow.be</a></p>`)

  return `<!DOCTYPE html>
<html lang="nl">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#faf9f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#faf9f5;padding:40px 16px;">
    <tr><td align="center">
      <table width="100%" style="max-width:560px;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid rgba(61,57,41,0.1);">
        <tr><td style="background:#3d3929;padding:20px 36px;">
          <p style="margin:0;font-size:10px;letter-spacing:0.15em;text-transform:uppercase;color:rgba(250,249,245,0.4);font-family:monospace;">Lead it, Grow</p>
        </td></tr>
        <tr><td style="padding:32px 36px;font-size:14px;line-height:1.7;color:#535146;">
          ${processed}
        </td></tr>
        <tr><td style="padding:16px 36px;background:#f5f3ee;border-top:1px solid rgba(61,57,41,0.08);">
          <p style="margin:0;font-size:11px;color:#83827d;line-height:1.5;">
            © Lead it, Grow · <a href="${SITE}" style="color:#83827d;">leaditgrow.be</a>
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}
