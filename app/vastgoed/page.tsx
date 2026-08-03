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

export default function VastgoedPage() {
  return (
    <>
      <Nav />

      <style>{`
        .vg-page { background: ${BG}; min-height: 100vh; color: ${INK}; }
        .vg-inner { max-width: 780px; margin: 0 auto; padding: 0 24px; }
        .vg-section { padding: 72px 0; }
        .vg-section + .vg-section { border-top: 2px solid ${INK}; }
        .vg-tag { font-family: ${M}; font-size: 11px; text-transform: uppercase; letter-spacing: .1em; color: ${MUT}; }
        .vg-h1 { font-family: ${B}; font-size: clamp(2rem, 5vw, 3.2rem); font-weight: 700; line-height: 1.1; margin: 16px 0 24px; }
        .vg-h2 { font-family: ${B}; font-size: clamp(1.4rem, 3vw, 2rem); font-weight: 700; line-height: 1.15; margin: 0 0 12px; }
        .vg-lead { font-size: 1.05rem; line-height: 1.65; color: ${MUT}; max-width: 620px; }
        .vg-btn { display: inline-block; background: ${GRN}; color: #fff; font-family: ${B}; font-weight: 600; font-size: .95rem; padding: 14px 28px; text-decoration: none; border: 2px solid ${GRN}; }
        .vg-btn:hover { background: #0f3d21; border-color: #0f3d21; }
        .vg-btn-ghost { background: transparent; color: ${INK}; border: 2px solid ${INK}; }
        .vg-btn-ghost:hover { background: ${INK}; color: ${BG}; }
        .vg-stat { font-family: ${M}; font-size: .85rem; background: ${INK}; color: ${LIME}; padding: 12px 20px; margin-top: 32px; display: inline-block; }
        .vg-step { display: flex; gap: 20px; align-items: flex-start; padding: 24px 0; border-bottom: 1px solid ${BG2}; }
        .vg-step:last-child { border-bottom: none; }
        .vg-step-num { font-family: ${M}; font-size: 1.4rem; font-weight: 700; color: ${GRN}; min-width: 36px; }
        .vg-step-title { font-family: ${B}; font-size: 1rem; font-weight: 600; margin-bottom: 4px; }
        .vg-step-body { font-size: .9rem; color: ${MUT}; line-height: 1.6; }
        .vg-table { width: 100%; border-collapse: collapse; margin-top: 24px; font-size: .9rem; }
        .vg-table th { text-align: left; padding: 10px 12px; background: ${INK}; color: ${BG}; font-family: ${M}; font-size: .8rem; font-weight: 400; letter-spacing: .06em; }
        .vg-table td { padding: 12px; vertical-align: top; border-bottom: 1px solid ${BG2}; line-height: 1.5; }
        .vg-table tr:last-child td { border-bottom: none; }
        .vg-table td:first-child { font-family: ${B}; font-weight: 600; font-size: .88rem; }
        .vg-table td:nth-child(2) { font-family: ${M}; font-size: .78rem; color: ${ORANGE}; white-space: nowrap; }
        .vg-garantie { border-left: 3px solid ${GRN}; padding: 20px 20px 20px 24px; margin-top: 32px; background: ${BG2}; }
        .vg-garantie-title { font-family: ${B}; font-weight: 600; margin-bottom: 6px; }
        .vg-garantie-body { font-size: .9rem; color: ${MUT}; line-height: 1.6; }
        .vg-commissie { border: 2px solid ${ORANGE}; padding: 24px; margin-top: 32px; }
        .vg-faq { padding: 18px 0; border-bottom: 1px solid ${BG2}; }
        .vg-faq:last-child { border-bottom: none; }
        .vg-faq-q { font-family: ${B}; font-weight: 600; margin-bottom: 6px; }
        .vg-faq-a { font-size: .9rem; color: ${MUT}; line-height: 1.6; }
        .vg-cta-block { background: ${INK}; color: ${BG}; padding: 60px 24px; text-align: center; }
        .vg-cta-h { font-family: ${B}; font-size: clamp(1.5rem, 3vw, 2.2rem); font-weight: 700; margin-bottom: 12px; }
        .vg-cta-sub { color: rgba(242,240,235,.65); font-size: .95rem; margin-bottom: 28px; }
        .vg-cta-btn { display: inline-block; background: ${LIME}; color: ${INK}; font-family: ${B}; font-weight: 700; font-size: 1rem; padding: 16px 32px; text-decoration: none; }
        .vg-cta-btn:hover { background: #86efac; }
      `}</style>

      <main className="vg-page">

        {/* HERO */}
        <section className="vg-section">
          <div className="vg-inner">
            <span className="vg-tag">De Mandaten-Machine · voor vastgoedkantoren</span>
            <h1 className="vg-h1">
              Het kantoor dat eerst belt,<br />
              wint het mandaat.
            </h1>
            <p className="vg-lead">
              Wie zijn woning wil verkopen, vraagt bij 3 of 4 kantoren tegelijk een schatting aan.
              Wij zorgen dat elke aanvraag binnen 5 minuten een persoonlijk antwoord en een
              afspraakvoorstel krijgt. Automatisch, 7 dagen per week, ook zondagavond om 21u.
            </p>
            <div style={{ marginTop: 32, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Link href="/#contact" className="vg-btn">Plan een gesprek van 20 minuten</Link>
              <Link href="/diagnostic" className="vg-btn vg-btn-ghost">Start gratis diagnose</Link>
            </div>
            <span className="vg-stat">30 tot 50% van de schattingsaanvragen krijgt nooit een tweede opvolging</span>
          </div>
        </section>

        {/* HET PROBLEEM */}
        <section className="vg-section" style={{ background: BG2 }}>
          <div className="vg-inner">
            <span className="vg-tag">Het probleem</span>
            <h2 className="vg-h2" style={{ marginTop: 12 }}>
              Elk gemist mandaat is €3.000 tot €8.000 courtage.
            </h2>
            <p className="vg-lead" style={{ marginBottom: 0 }}>
              Schattingsaanvragen blijven uren of dagen liggen, zeker buiten de kantooruren.
              Portaal-leads verdwijnen in een overvolle mailbox. En de database van oude
              schattingen en vroegere klanten? Die staat gewoon stil, terwijl daar de
              makkelijkste mandaten in zitten.
            </p>
          </div>
        </section>

        {/* WAT JE KRIJGT */}
        <section className="vg-section">
          <div className="vg-inner">
            <span className="vg-tag">Wat je krijgt</span>
            <h2 className="vg-h2" style={{ marginTop: 12 }}>Van aanvraag tot afspraak, zonder dat jij eraan denkt</h2>
            <div style={{ marginTop: 8 }}>
              <div className="vg-step">
                <span className="vg-step-num">01</span>
                <div>
                  <p className="vg-step-title">Opvolging binnen 5 minuten</p>
                  <p className="vg-step-body">
                    Elke schattingsaanvraag krijgt automatisch een persoonlijk antwoord met een
                    afspraakvoorstel. Ook &apos;s avonds, ook in het weekend. Jij wint de race
                    naar de eerste indruk zonder je gsm vast te houden.
                  </p>
                </div>
              </div>
              <div className="vg-step">
                <span className="vg-step-num">02</span>
                <div>
                  <p className="vg-step-title">6-touch opvolging voor twijfelaars</p>
                  <p className="vg-step-body">
                    Verkopers die niet meteen boeken, worden zes keer netjes opgevolgd tot ze
                    kiezen. Niemand valt nog door de mazen van het net.
                  </p>
                </div>
              </div>
              <div className="vg-step">
                <span className="vg-step-num">03</span>
                <div>
                  <p className="vg-step-title">Gratis waardebepaling-funnel</p>
                  <p className="vg-step-body">
                    Een schattingspagina die bezoekers omzet in aanvragen met naam, adres en
                    telefoonnummer. Jouw site wordt een bron van mandaten in plaats van een visitekaartje.
                  </p>
                </div>
              </div>
              <div className="vg-step">
                <span className="vg-step-num">04</span>
                <div>
                  <p className="vg-step-title">Dashboard en maandrapport</p>
                  <p className="vg-step-body">
                    Elke aanvraag en zijn status in één overzicht. Elke maand zwart op wit:
                    aanvragen, afspraken, mandaten.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PRIJZEN */}
        <section className="vg-section" style={{ background: BG2 }}>
          <div className="vg-inner">
            <span className="vg-tag">Investering</span>
            <h2 className="vg-h2" style={{ marginTop: 12 }}>Start met een pilot. Beslis daarna.</h2>
            <table className="vg-table">
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
                  <td>Mandaten-Machine</td>
                  <td>€997/maand</td>
                  <td>Systeem draait en wordt maandelijks geoptimaliseerd. Rapport inbegrepen.</td>
                </tr>
                <tr>
                  <td>Mandaten-Machine Plus</td>
                  <td>€1.750/maand</td>
                  <td>Alles hierboven + lokale content (reels en carrousels) zodat jouw kantoor dé naam wordt in de regio.</td>
                </tr>
              </tbody>
            </table>

            <div className="vg-commissie">
              <p className="vg-step-title" style={{ marginBottom: 6 }}>Extra: Database-Reactivatie · geen vaste kost</p>
              <p className="vg-step-body">
                Je database van oude schattingen en vroegere klanten is een goudmijn die stilstaat.
                Wij reactiveren ze automatisch per e-mail en volgen elke reactie op tot afspraak.
                Jij betaalt enkel 15% van de courtage op mandaten die aantoonbaar uit deze
                reactivatie komen. We starten met een pilot van 2 weken op een deel van je
                database, zodat je eerst afspraken ziet vóór je iets beslist.
              </p>
            </div>

            <div className="vg-garantie">
              <p className="vg-garantie-title">Garantie</p>
              <p className="vg-garantie-body">
                Minstens 5 extra schattingsafspraken in de eerste 30 dagen, of we werken gratis
                door tot ze er zijn. Geen jaarcontract, maandelijks opzegbaar.
              </p>
            </div>

            <p style={{ marginTop: 24, fontSize: '.9rem', color: MUT, lineHeight: 1.6 }}>
              De rekensom: één extra mandaat per kwartaal betaalt het volledige systeem voor een
              heel jaar. Alles daarboven is winst.
            </p>
          </div>
        </section>

        {/* FAQ */}
        <section className="vg-section">
          <div className="vg-inner">
            <span className="vg-tag">Veelgestelde vragen</span>
            <h2 className="vg-h2" style={{ marginTop: 12 }}>Wat kantoren willen weten</h2>
            <div style={{ marginTop: 24 }}>
              {[
                {
                  q: 'Wij volgen onze aanvragen al snel op. Wat voegt dit toe?',
                  a: 'Sterk, dan zit je bij de minderheid. De vraag is: ook om 21u en in het weekend? En hoe vaak wordt een aanvraag waar niemand op reageert een tweede, derde en zesde keer opgevolgd? Precies daar liggen de mandaten die nu naar de concurrent gaan.',
                },
                {
                  q: 'Klinkt die automatische opvolging niet als een robot?',
                  a: 'Nee. Elke mail en elk bericht is geschreven in de toon van jouw kantoor en wordt vooraf door jou goedgekeurd. De verkoper merkt alleen dat jouw kantoor als eerste en als beste reageert.',
                },
                {
                  q: 'Werkt dit ook met onze bestaande website en portalen?',
                  a: 'Ja. We koppelen op wat er al is: je site, je aanvraagformulier en de portaal-leads die per mail binnenkomen. Je hoeft niets te vervangen.',
                },
                {
                  q: 'Hoe werkt de commissie-deal op de database precies?',
                  a: 'We taggen elk gereactiveerd contact, zodat exact traceerbaar is welk mandaat uit de reactivatie komt. Alleen op die mandaten betaal je 15% van de courtage. Volledig transparant, en je ziet elke opvolging in het dashboard.',
                },
                {
                  q: 'Wat als het niets oplevert?',
                  a: 'Daarvoor is de garantie: minstens 5 extra schattingsafspraken in de eerste 30 dagen, of we werken gratis door tot ze er zijn. De pilot is bewust kort en meetbaar, zodat je beslist op cijfers en niet op beloftes.',
                },
              ].map(({ q, a }) => (
                <div key={q} className="vg-faq">
                  <p className="vg-faq-q">{q}</p>
                  <p className="vg-faq-a">{a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="vg-cta-block">
          <div style={{ maxWidth: 600, margin: '0 auto' }}>
            <p className="vg-cta-h">Hoeveel mandaten liet jouw kantoor vorige maand liggen?</p>
            <p className="vg-cta-sub">
              Plan een gesprek van 20 minuten. We lichten door hoe jullie aanvragen nu binnenkomen
              en waar ze blijven liggen. Daarna weet je exact waar het lek zit, ook als we nooit samenwerken.
            </p>
            <Link href="/#contact" className="vg-cta-btn">Plan een gesprek</Link>
          </div>
        </section>

      </main>
    </>
  )
}
