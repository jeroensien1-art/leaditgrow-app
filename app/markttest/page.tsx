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

export default function MarkttestPage() {
  return (
    <>
      <Nav />

      <style>{`
        .mt-page { background: ${BG}; min-height: 100vh; color: ${INK}; }
        .mt-inner { max-width: 780px; margin: 0 auto; padding: 0 24px; }
        .mt-section { padding: 72px 0; }
        .mt-section + .mt-section { border-top: 2px solid ${INK}; }
        .mt-tag { font-family: ${M}; font-size: 11px; text-transform: uppercase; letter-spacing: .1em; color: ${MUT}; }
        .mt-h1 { font-family: ${B}; font-size: clamp(2rem, 5vw, 3.2rem); font-weight: 700; line-height: 1.1; margin: 16px 0 24px; }
        .mt-h2 { font-family: ${B}; font-size: clamp(1.4rem, 3vw, 2rem); font-weight: 700; line-height: 1.15; margin: 0 0 12px; }
        .mt-lead { font-size: 1.05rem; line-height: 1.65; color: ${MUT}; max-width: 620px; }
        .mt-btn { display: inline-block; background: ${GRN}; color: #fff; font-family: ${B}; font-weight: 600; font-size: .95rem; padding: 14px 28px; text-decoration: none; border: 2px solid ${GRN}; }
        .mt-btn:hover { background: #0f3d21; border-color: #0f3d21; }
        .mt-btn-ghost { background: transparent; color: ${INK}; border: 2px solid ${INK}; }
        .mt-btn-ghost:hover { background: ${INK}; color: ${BG}; }
        .mt-stat { font-family: ${M}; font-size: .85rem; background: ${INK}; color: ${LIME}; padding: 12px 20px; margin-top: 32px; display: inline-block; }
        .mt-step { display: flex; gap: 20px; align-items: flex-start; padding: 24px 0; border-bottom: 1px solid ${BG2}; }
        .mt-step:last-child { border-bottom: none; }
        .mt-step-num { font-family: ${M}; font-size: 1.4rem; font-weight: 700; color: ${GRN}; min-width: 36px; }
        .mt-step-title { font-family: ${B}; font-size: 1rem; font-weight: 600; margin-bottom: 4px; }
        .mt-step-body { font-size: .9rem; color: ${MUT}; line-height: 1.6; }
        .mt-table { width: 100%; border-collapse: collapse; margin-top: 24px; font-size: .9rem; }
        .mt-table th { text-align: left; padding: 10px 12px; background: ${INK}; color: ${BG}; font-family: ${M}; font-size: .8rem; font-weight: 400; letter-spacing: .06em; }
        .mt-table td { padding: 12px; vertical-align: top; border-bottom: 1px solid ${BG2}; line-height: 1.5; }
        .mt-table tr:last-child td { border-bottom: none; }
        .mt-table td:first-child { font-family: ${B}; font-weight: 600; font-size: .88rem; }
        .mt-table td:nth-child(2) { font-family: ${M}; font-size: .78rem; color: ${ORANGE}; white-space: nowrap; }
        .mt-garantie { border-left: 3px solid ${GRN}; padding: 20px 20px 20px 24px; margin-top: 32px; background: ${BG2}; }
        .mt-garantie-title { font-family: ${B}; font-weight: 600; margin-bottom: 6px; }
        .mt-garantie-body { font-size: .9rem; color: ${MUT}; line-height: 1.6; }
        .mt-faq { padding: 18px 0; border-bottom: 1px solid ${BG2}; }
        .mt-faq:last-child { border-bottom: none; }
        .mt-faq-q { font-family: ${B}; font-weight: 600; margin-bottom: 6px; }
        .mt-faq-a { font-size: .9rem; color: ${MUT}; line-height: 1.6; }
        .mt-cta-block { background: ${INK}; color: ${BG}; padding: 60px 24px; text-align: center; }
        .mt-cta-h { font-family: ${B}; font-size: clamp(1.5rem, 3vw, 2.2rem); font-weight: 700; margin-bottom: 12px; }
        .mt-cta-sub { color: rgba(242,240,235,.65); font-size: .95rem; margin-bottom: 28px; }
        .mt-cta-btn { display: inline-block; background: ${LIME}; color: ${INK}; font-family: ${B}; font-weight: 700; font-size: 1rem; padding: 16px 32px; text-decoration: none; }
        .mt-cta-btn:hover { background: #86efac; }
      `}</style>

      <main className="mt-page">

        {/* HERO */}
        <section className="mt-section">
          <div className="mt-inner">
            <span className="mt-tag">De Markttest · je boodschap getest met echte data</span>
            <h1 className="mt-h1">
              Test wat je markt wil horen,<br />
              vóór je er budget aan geeft.
            </h1>
            <p className="mt-lead">
              De meeste bedrijven kiezen hun boodschap op gevoel. Wij testen 9 varianten van
              jouw verhaal met een klein advertentiebudget op Facebook en Instagram. Binnen
              14 dagen weet je welk probleem, welke belofte en welke woorden jouw klanten
              doen klikken.
            </p>
            <div style={{ marginTop: 32, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Link href="/#contact" className="mt-btn">Plan een gesprek van 20 minuten</Link>
              <Link href="/diagnostic" className="mt-btn mt-btn-ghost">Start gratis diagnose</Link>
            </div>
            <span className="mt-stat">Eén variant testen kost een paar euro. Fout gokken kost maanden.</span>
          </div>
        </section>

        {/* HET PROBLEEM */}
        <section className="mt-section" style={{ background: BG2 }}>
          <div className="mt-inner">
            <span className="mt-tag">Het probleem</span>
            <h2 className="mt-h2" style={{ marginTop: 12 }}>
              De duurste zin in marketing: &quot;we zien wel of het aanslaat.&quot;
            </h2>
            <p className="mt-lead" style={{ marginBottom: 0 }}>
              Een campagne, een nieuwe website of een outreach-reeks vertrekt bijna altijd
              vanuit één onbewezen aanname: dat de boodschap klopt. Slaat ze aan, dan had je
              geluk. Slaat ze niet aan, dan ben je budget en maanden kwijt, en weet je nog
              altijd niet waarom. Terwijl het antwoord meetbaar is voor de prijs van een etentje.
            </p>
          </div>
        </section>

        {/* WAT JE KRIJGT */}
        <section className="mt-section">
          <div className="mt-inner">
            <span className="mt-tag">Hoe het werkt</span>
            <h2 className="mt-h2" style={{ marginTop: 12 }}>Van 9 aannames naar 1 bewezen boodschap, in 14 dagen</h2>
            <div style={{ marginTop: 8 }}>
              <div className="mt-step">
                <span className="mt-step-num">01</span>
                <div>
                  <p className="mt-step-title">Intake van 30 minuten</p>
                  <p className="mt-step-body">
                    We bepalen samen 3 problemen van jouw klant en 3 invalshoeken per probleem.
                    Dat geeft 9 versies van je verhaal. Jij levert de kennis van je klanten,
                    wij de structuur.
                  </p>
                </div>
              </div>
              <div className="mt-step">
                <span className="mt-step-num">02</span>
                <div>
                  <p className="mt-step-title">Wij bouwen en lanceren de test</p>
                  <p className="mt-step-body">
                    De 9 varianten gaan als mini-advertenties live op Facebook en Instagram,
                    gericht op jouw doelgroep. Klein budget, 10 tot 14 dagen. Jij hoeft geen
                    advertentie-ervaring te hebben, wij zetten alles op.
                  </p>
                </div>
              </div>
              <div className="mt-step">
                <span className="mt-step-num">03</span>
                <div>
                  <p className="mt-step-title">Data in plaats van meningen</p>
                  <p className="mt-step-body">
                    We meten per variant wie stopt met scrollen, wie klikt en wie doorleest.
                    Mensen zeggen A in een enquête en klikken B in het echt. De test meet
                    gedrag, en gedrag liegt niet.
                  </p>
                </div>
              </div>
              <div className="mt-step">
                <span className="mt-step-num">04</span>
                <div>
                  <p className="mt-step-title">Rapport en adviesgesprek</p>
                  <p className="mt-step-body">
                    Je krijgt de winnende boodschap zwart op wit, wat de cijfers zeggen over je
                    positionering, en concreet waar je de winnaar meteen inzet: je website, je
                    advertenties, je offertes en je koude outreach.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PRIJZEN */}
        <section className="mt-section" style={{ background: BG2 }}>
          <div className="mt-inner">
            <span className="mt-tag">Investering</span>
            <h2 className="mt-h2" style={{ marginTop: 12 }}>Eén prijs, testbudget inbegrepen</h2>
            <table className="mt-table">
              <thead>
                <tr>
                  <th>Formule</th>
                  <th>Prijs</th>
                  <th>Wat</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>De Markttest · 14 dagen</td>
                  <td>€297 eenmalig</td>
                  <td>Intake, 9 advertentievarianten, €50 advertentiebudget inbegrepen, rapport en adviesgesprek. Ga je binnen 60 dagen door met een vervolgtraject, dan wordt de volledige €297 verrekend.</td>
                </tr>
              </tbody>
            </table>

            <div className="mt-garantie">
              <p className="mt-garantie-title">Garantie</p>
              <p className="mt-garantie-body">
                Levert de test na 14 dagen geen bruikbare winnaar op, dan draaien we gratis een
                tweede ronde met 9 nieuwe varianten. Je stapt pas uit met een antwoord.
              </p>
            </div>

            <p style={{ marginTop: 24, fontSize: '.9rem', color: MUT, lineHeight: 1.6 }}>
              Ter vergelijking: klassiek marktonderzoek kost €3.000 tot €5.000 en vertelt je wat
              mensen zéggen. Eén maand advertenties draaien op een ongeteste boodschap kost al
              snel €500. De Markttest kost €297 en vertelt je wat mensen dóen.
            </p>
            <p style={{ marginTop: 12, fontSize: '.9rem', color: MUT, lineHeight: 1.6 }}>
              We draaien maximaal 4 markttesten tegelijk, zodat elke test de aandacht krijgt
              die de data betrouwbaar maakt.
            </p>
          </div>
        </section>

        {/* FAQ */}
        <section className="mt-section">
          <div className="mt-inner">
            <span className="mt-tag">Veelgestelde vragen</span>
            <h2 className="mt-h2" style={{ marginTop: 12 }}>Wat zaakvoerders willen weten</h2>
            <div style={{ marginTop: 24 }}>
              {[
                {
                  q: 'Ik heb nog nooit advertenties gedraaid. Is dit iets voor mij?',
                  a: 'Juist dan. De Markttest bestaat om te vermijden dat je eerste echte budget verdampt aan een boodschap die niemand raakt. Wij zetten alles op en jij krijgt het resultaat.',
                },
                {
                  q: 'Waarom geen enquête of klantengesprekken?',
                  a: 'Die blijven waardevol, maar mensen zeggen A en klikken B. Een klein advertentiebudget meet wat je doelgroep echt doet wanneer ze je boodschap tegenkomen, zonder dat iemand sociaal wenselijk hoeft te antwoorden.',
                },
                {
                  q: 'Wat gebeurt er met de resultaten?',
                  a: 'Die zijn van jou. Je krijgt het volledige rapport met alle cijfers per variant, plus de exacte teksten. Ook als we daarna nooit meer samenwerken, blijft de winnende boodschap jouw eigendom.',
                },
                {
                  q: 'Is €50 testbudget niet te weinig om iets te leren?',
                  a: 'Voor een verkoopcampagne wel. Voor een vergelijkende test niet: we zoeken geen klanten maar een winnaar tussen 9 varianten, en daarvoor volstaan enkele euro\'s per variant. Zien we een kansrijke twijfelwinnaar, dan bespreken we samen of een tweede ronde met meer budget zinvol is.',
                },
                {
                  q: 'Wat als er geen duidelijke winnaar is?',
                  a: 'Daarvoor is de garantie: dan draaien we gratis een tweede ronde met 9 nieuwe varianten. Ook een test waarin alles gelijk scoort is trouwens een antwoord, want dan weet je dat het verschil niet in de boodschap zit.',
                },
              ].map(({ q, a }) => (
                <div key={q} className="mt-faq">
                  <p className="mt-faq-q">{q}</p>
                  <p className="mt-faq-a">{a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="mt-cta-block">
          <div style={{ maxWidth: 600, margin: '0 auto' }}>
            <p className="mt-cta-h">Welke van de 9 versies van jouw verhaal wint?</p>
            <p className="mt-cta-sub">
              Daar is maar één eerlijke rechter voor: je markt. Plan een gesprek van 20 minuten
              en we bepalen samen of de Markttest voor jouw aanbod zinvol is.
            </p>
            <Link href="/#contact" className="mt-cta-btn">Plan een gesprek</Link>
          </div>
        </section>

      </main>
    </>
  )
}
