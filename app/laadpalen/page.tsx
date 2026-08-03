'use client'

import { Nav } from '@/components/nav'
import Link from 'next/link'

const B = 'var(--font-brutalist, system-ui)'
const M = 'var(--font-mono-brutalist, monospace)'
const INK = '#0e0d0b'
const BG = '#f2f0eb'
const BG2 = '#eae8e2'
const GRN = '#1a5e35'
const LIME = '#4ade80'
const ORANGE = '#c96442'
const MUT = '#787068'

export default function LaadpalenPage() {
  return (
    <>
      <Nav />

      <style>{`
        .lp-page { background: ${BG}; min-height: 100vh; color: ${INK}; }
        .lp-inner { max-width: 780px; margin: 0 auto; padding: 0 24px; }
        .lp-section { padding: 72px 0; }
        .lp-section + .lp-section { border-top: 2px solid ${INK}; }
        .lp-tag { font-family: ${M}; font-size: 11px; text-transform: uppercase; letter-spacing: .1em; color: ${MUT}; }
        .lp-h1 { font-family: ${B}; font-size: clamp(2rem, 5vw, 3.2rem); font-weight: 700; line-height: 1.1; margin: 16px 0 24px; }
        .lp-h2 { font-family: ${B}; font-size: clamp(1.4rem, 3vw, 2rem); font-weight: 700; line-height: 1.15; margin: 0 0 12px; }
        .lp-lead { font-size: 1.05rem; line-height: 1.65; color: ${MUT}; max-width: 620px; }
        .lp-btn { display: inline-block; background: ${GRN}; color: #fff; font-family: ${B}; font-weight: 600; font-size: .95rem; padding: 14px 28px; text-decoration: none; border: 2px solid ${GRN}; }
        .lp-btn:hover { background: #0f3d21; border-color: #0f3d21; }
        .lp-btn-ghost { background: transparent; color: ${INK}; border: 2px solid ${INK}; }
        .lp-btn-ghost:hover { background: ${INK}; color: ${BG}; }
        .lp-stat { font-family: ${M}; font-size: .85rem; background: ${INK}; color: ${LIME}; padding: 12px 20px; margin-top: 32px; display: inline-block; }
        .lp-step { display: flex; gap: 20px; align-items: flex-start; padding: 24px 0; border-bottom: 1px solid ${BG2}; }
        .lp-step:last-child { border-bottom: none; }
        .lp-step-num { font-family: ${M}; font-size: 1.4rem; font-weight: 700; color: ${GRN}; min-width: 36px; }
        .lp-step-title { font-family: ${B}; font-size: 1rem; font-weight: 600; margin-bottom: 4px; }
        .lp-step-body { font-size: .9rem; color: ${MUT}; line-height: 1.6; }
        .lp-table { width: 100%; border-collapse: collapse; margin-top: 24px; font-size: .9rem; }
        .lp-table th { text-align: left; padding: 10px 12px; background: ${INK}; color: ${BG}; font-family: ${M}; font-size: .8rem; font-weight: 400; letter-spacing: .06em; }
        .lp-table td { padding: 12px; vertical-align: top; border-bottom: 1px solid ${BG2}; line-height: 1.5; }
        .lp-table tr:last-child td { border-bottom: none; }
        .lp-table td:first-child { font-family: ${B}; font-weight: 600; font-size: .88rem; }
        .lp-table td:nth-child(2) { font-family: ${M}; font-size: .78rem; color: ${ORANGE}; white-space: nowrap; }
        .lp-garantie { border-left: 3px solid ${GRN}; padding: 20px 20px 20px 24px; margin-top: 32px; background: ${BG2}; }
        .lp-garantie-title { font-family: ${B}; font-weight: 600; margin-bottom: 6px; }
        .lp-garantie-body { font-size: .9rem; color: ${MUT}; line-height: 1.6; }
        .lp-faq { padding: 18px 0; border-bottom: 1px solid ${BG2}; }
        .lp-faq:last-child { border-bottom: none; }
        .lp-faq-q { font-family: ${B}; font-weight: 600; margin-bottom: 6px; }
        .lp-faq-a { font-size: .9rem; color: ${MUT}; line-height: 1.6; }
        .lp-cta-block { background: ${INK}; color: ${BG}; padding: 60px 24px; text-align: center; }
        .lp-cta-h { font-family: ${B}; font-size: clamp(1.5rem, 3vw, 2.2rem); font-weight: 700; margin-bottom: 12px; }
        .lp-cta-sub { color: rgba(242,240,235,.65); font-size: .95rem; margin-bottom: 28px; }
        .lp-cta-btn { display: inline-block; background: ${LIME}; color: ${INK}; font-family: ${B}; font-weight: 700; font-size: 1rem; padding: 16px 32px; text-decoration: none; }
        .lp-cta-btn:hover { background: #86efac; }
      `}</style>

      <main className="lp-page">

        {/* HERO */}
        <section className="lp-section">
          <div className="lp-inner">
            <span className="lp-tag">De Offerte-Versneller · voor elektriciens en laadpaal-installateurs</span>
            <h1 className="lp-h1">
              De snelste offerte wint.<br />
              Ook als jij in de meterkast zit.
            </h1>
            <p className="lp-lead">
              Wie een laadpaal wil, vraagt bij 3 installateurs tegelijk een offerte. Wij zorgen
              dat elke aanvraag binnen 5 minuten antwoord krijgt, automatisch gekwalificeerd
              wordt, en offerte-klaar in jouw mailbox landt. Jij installeert, het systeem verkoopt.
            </p>
            <div style={{ marginTop: 32, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Link href="/#contact" className="lp-btn">Plan een gesprek van 20 minuten</Link>
              <Link href="/diagnostic" className="lp-btn lp-btn-ghost">Start gratis diagnose</Link>
            </div>
            <span className="lp-stat">Eén gemiste installatie = €1.500 tot €3.000 · met thuisbatterij een veelvoud</span>
          </div>
        </section>

        {/* HET PROBLEEM */}
        <section className="lp-section" style={{ background: BG2 }}>
          <div className="lp-inner">
            <span className="lp-tag">Het probleem</span>
            <h2 className="lp-h2" style={{ marginTop: 12 }}>
              Jij zit op de werf. De klant wacht niet.
            </h2>
            <p className="lp-lead" style={{ marginBottom: 0 }}>
              Aanvragen worden &apos;s avonds of dagen later beantwoord, terwijl de klant bij
              drie installateurs tegelijk aanvroeg. En de helft van de aanvragen is onvolledig:
              geen foto van de meterkast, geen idee van de afstand tot de teller. Offertes maken
              vreet tijd, ook voor mensen die alleen de prijs komen shoppen.
            </p>
          </div>
        </section>

        {/* WAT JE KRIJGT */}
        <section className="lp-section">
          <div className="lp-inner">
            <span className="lp-tag">Wat je krijgt</span>
            <h2 className="lp-h2" style={{ marginTop: 12 }}>Van aanvraag tot getekende offerte</h2>
            <div style={{ marginTop: 8 }}>
              <div className="lp-step">
                <span className="lp-step-num">01</span>
                <div>
                  <p className="lp-step-title">Antwoord binnen 5 minuten</p>
                  <p className="lp-step-body">
                    Elke aanvraag krijgt automatisch een bevestiging met prijsindicatie-range,
                    7 dagen per week. De klant weet meteen dat hij bij jou aan het juiste adres is.
                  </p>
                </div>
              </div>
              <div className="lp-step">
                <span className="lp-step-num">02</span>
                <div>
                  <p className="lp-step-title">Automatische kwalificatie</p>
                  <p className="lp-step-body">
                    Het systeem vraagt zelf de foto van de meterkast, de afstand tot de
                    parkeerplek, het type aansluiting en de gewenste laadsnelheid. Jij krijgt
                    een offerte-klare aanvraag in je mailbox in plaats van een half ingevuld formulier.
                  </p>
                </div>
              </div>
              <div className="lp-step">
                <span className="lp-step-num">03</span>
                <div>
                  <p className="lp-step-title">Opvolging tot de handtekening</p>
                  <p className="lp-step-body">
                    Wie niet reageert op je offerte, wordt automatisch opgevolgd tot er een
                    beslissing valt. Oude offertes van vorig jaar die nooit iets werden, krijgen
                    automatisch een nieuw aanbod.
                  </p>
                </div>
              </div>
              <div className="lp-step">
                <span className="lp-step-num">04</span>
                <div>
                  <p className="lp-step-title">Reviews-flow voor Google</p>
                  <p className="lp-step-body">
                    Na elke installatie automatisch een reviewvraag, zodat jij bovenaan Google
                    komt te staan in je regio en de volgende aanvragen vanzelf binnenkomen.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PRIJZEN */}
        <section className="lp-section" style={{ background: BG2 }}>
          <div className="lp-inner">
            <span className="lp-tag">Investering</span>
            <h2 className="lp-h2" style={{ marginTop: 12 }}>Start met een pilot. Beslis daarna.</h2>
            <table className="lp-table">
              <thead>
                <tr>
                  <th>Formule</th>
                  <th>Prijs</th>
                  <th>Wat</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Pilot · 4 weken</td>
                  <td>€1.500 eenmalig</td>
                  <td>Volledig systeem live, resultaat gemeten. Ga je door, dan wordt dit bedrag verrekend in je eerste maand.</td>
                </tr>
                <tr>
                  <td>Offerte-Versneller</td>
                  <td>€747/maand</td>
                  <td>Systeem draait en wordt maandelijks geoptimaliseerd. Rapport inbegrepen.</td>
                </tr>
                <tr>
                  <td>Offerte-Versneller Plus</td>
                  <td>€1.250/maand</td>
                  <td>Alles hierboven + Google Business optimalisatie en lokale content, zodat jij dé laadpaal-installateur van je regio wordt.</td>
                </tr>
              </tbody>
            </table>

            <div className="lp-garantie">
              <p className="lp-garantie-title">Garantie</p>
              <p className="lp-garantie-body">
                Elke aanvraag binnen 5 minuten beantwoord en minstens 20% meer geboekte
                plaatsbezoeken in de eerste 30 dagen, of we werken gratis door tot het staat.
                Geen jaarcontract, maandelijks opzegbaar.
              </p>
            </div>

            <p style={{ marginTop: 24, fontSize: '.9rem', color: MUT, lineHeight: 1.6 }}>
              De rekensom: twee extra installaties per maand betalen het systeem drie keer terug.
              En je stopt met offertes maken voor prijs-shoppers.
            </p>
          </div>
        </section>

        {/* FAQ */}
        <section className="lp-section">
          <div className="lp-inner">
            <span className="lp-tag">Veelgestelde vragen</span>
            <h2 className="lp-h2" style={{ marginTop: 12 }}>Wat installateurs willen weten</h2>
            <div style={{ marginTop: 24 }}>
              {[
                {
                  q: 'Ik heb al genoeg aanvragen. Waarom zou ik dit nodig hebben?',
                  a: 'Veel aanvragen is niet hetzelfde als veel installaties. Als de helft onvolledig binnenkomt en offertes dagen op antwoord wachten, verlies je exact de klanten met het meeste budget: die kiezen de installateur die eerst professioneel reageert. Dit systeem haalt meer uit wat je nu al krijgt.',
                },
                {
                  q: 'Filtert dat systeem ook de prijs-shoppers eruit?',
                  a: 'Ja. De kwalificatievragen (foto meterkast, afstand tot teller, type aansluiting) schrikken prijs-shoppers af en leveren jou alleen aanvragen op waar je meteen een correcte offerte voor kan maken. Minder offertes maken, meer installaties.',
                },
                {
                  q: 'Klinkt die automatische opvolging niet als een robot?',
                  a: 'Nee. Elke mail is geschreven in jouw toon en wordt vooraf door jou goedgekeurd. De klant merkt alleen dat jij als enige installateur binnen 5 minuten professioneel reageert.',
                },
                {
                  q: 'Ik heb geen tijd om hiermee bezig te zijn.',
                  a: 'Dat is het punt: na de installatie van het systeem hoef jij niets te doen. Aanvragen komen offerte-klaar binnen, opvolging loopt vanzelf, en je ziet alles in één overzicht. De pilot van 4 weken kost jou ongeveer één uur aan input.',
                },
                {
                  q: 'Wat als het niets oplevert?',
                  a: 'Daarvoor is de garantie: reactietijd onder 5 minuten en minstens 20% meer geboekte plaatsbezoeken in de eerste 30 dagen, of we werken gratis door tot het staat. Je beslist op cijfers, niet op beloftes.',
                },
              ].map(({ q, a }) => (
                <div key={q} className="lp-faq">
                  <p className="lp-faq-q">{q}</p>
                  <p className="lp-faq-a">{a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="lp-cta-block">
          <div style={{ maxWidth: 600, margin: '0 auto' }}>
            <p className="lp-cta-h">Hoe snel krijgt een aanvraag bij jou vandaag antwoord?</p>
            <p className="lp-cta-sub">
              Plan een gesprek van 20 minuten. We lichten door hoe jouw aanvragen nu binnenkomen
              en waar ze blijven liggen. Daarna weet je exact waar het lek zit, ook als we nooit samenwerken.
            </p>
            <Link href="/#contact" className="lp-cta-btn">Plan een gesprek</Link>
          </div>
        </section>

      </main>
    </>
  )
}
