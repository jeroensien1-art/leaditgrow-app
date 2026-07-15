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

export default function ContentStrategiePage() {
  return (
    <>
      <Nav />

      <style>{`
        .cs-page { background: ${BG}; min-height: 100vh; color: ${INK}; }
        .cs-inner { max-width: 780px; margin: 0 auto; padding: 0 24px; }
        .cs-section { padding: 72px 0; }
        .cs-section + .cs-section { border-top: 2px solid ${INK}; }
        .cs-mono { font-family: ${M}; }
        .cs-brut { font-family: ${B}; }
        .cs-tag { font-family: ${M}; font-size: 11px; text-transform: uppercase; letter-spacing: .1em; color: ${MUT}; }
        .cs-h1 { font-family: ${B}; font-size: clamp(2rem, 5vw, 3.2rem); font-weight: 700; line-height: 1.1; margin: 16px 0 24px; }
        .cs-h2 { font-family: ${B}; font-size: clamp(1.4rem, 3vw, 2rem); font-weight: 700; line-height: 1.15; margin: 0 0 12px; }
        .cs-lead { font-size: 1.05rem; line-height: 1.65; color: ${MUT}; max-width: 620px; }
        .cs-btn { display: inline-block; background: ${GRN}; color: #fff; font-family: ${B}; font-weight: 600; font-size: .95rem; padding: 14px 28px; text-decoration: none; border: 2px solid ${GRN}; }
        .cs-btn:hover { background: #0f3d21; border-color: #0f3d21; }
        .cs-btn-ghost { background: transparent; color: ${INK}; border: 2px solid ${INK}; }
        .cs-btn-ghost:hover { background: ${INK}; color: ${BG}; }
        .cs-stat { font-family: ${M}; font-size: .85rem; background: ${INK}; color: ${LIME}; padding: 12px 20px; margin-bottom: 40px; display: inline-block; }
        .cs-grid3 { display: grid; grid-template-columns: repeat(auto-fit, minmax(210px, 1fr)); gap: 2px; margin-top: 32px; }
        .cs-card { background: ${BG2}; padding: 28px 24px; border: 2px solid transparent; }
        .cs-card-num { font-family: ${M}; font-size: 2rem; font-weight: 700; color: ${ORANGE}; display: block; margin-bottom: 8px; }
        .cs-table { width: 100%; border-collapse: collapse; margin-top: 24px; font-size: .9rem; }
        .cs-table th { text-align: left; padding: 10px 12px; background: ${INK}; color: ${BG}; font-family: ${M}; font-size: .8rem; font-weight: 400; letter-spacing: .06em; }
        .cs-table td { padding: 12px; vertical-align: top; border-bottom: 1px solid ${BG2}; line-height: 1.5; }
        .cs-table tr:last-child td { border-bottom: none; }
        .cs-table td:first-child { color: ${MUT}; font-size: .85rem; }
        .cs-table td:nth-child(2) { font-family: ${M}; font-size: .78rem; color: ${ORANGE}; white-space: nowrap; }
        .cs-table td:last-child { font-size: .88rem; }
        .cs-step { display: flex; gap: 20px; align-items: flex-start; padding: 24px 0; border-bottom: 1px solid ${BG2}; }
        .cs-step:last-child { border-bottom: none; }
        .cs-step-num { font-family: ${M}; font-size: 1.4rem; font-weight: 700; color: ${GRN}; min-width: 36px; }
        .cs-step-title { font-family: ${B}; font-size: 1rem; font-weight: 600; margin-bottom: 4px; }
        .cs-step-body { font-size: .9rem; color: ${MUT}; line-height: 1.6; }
        .cs-diff { border-left: 3px solid ${GRN}; padding: 20px 20px 20px 24px; margin-bottom: 16px; background: ${BG2}; }
        .cs-diff-title { font-family: ${B}; font-weight: 600; margin-bottom: 6px; }
        .cs-diff-body { font-size: .9rem; color: ${MUT}; line-height: 1.6; }
        .cs-faq { padding: 18px 0; border-bottom: 1px solid ${BG2}; }
        .cs-faq:last-child { border-bottom: none; }
        .cs-faq-q { font-family: ${B}; font-weight: 600; margin-bottom: 6px; }
        .cs-faq-a { font-size: .9rem; color: ${MUT}; line-height: 1.6; }
        .cs-cta-block { background: ${INK}; color: ${BG}; padding: 60px 24px; text-align: center; }
        .cs-cta-h { font-family: ${B}; font-size: clamp(1.5rem, 3vw, 2.2rem); font-weight: 700; margin-bottom: 12px; }
        .cs-cta-sub { color: rgba(242,240,235,.65); font-size: .95rem; margin-bottom: 28px; }
        .cs-cta-btn { display: inline-block; background: ${LIME}; color: ${INK}; font-family: ${B}; font-weight: 700; font-size: 1rem; padding: 16px 32px; text-decoration: none; }
        .cs-cta-btn:hover { background: #86efac; }
      `}</style>

      <main className="cs-page">

        {/* HERO */}
        <section className="cs-section">
          <div className="cs-inner">
            <span className="cs-tag">Content Systeem · Lead it, Grow</span>
            <h1 className="cs-h1">
              Jouw verhaal.<br />
              Elke maand. Op tijd.
            </h1>
            <p className="cs-lead">
              Geen bureau dat je socials overneemt. Een content-intelligencesysteem dat elke maand
              wetenschappelijk onderbouwde trends aanlevert, waar jij in 5 minuten je perspectief aan toevoegt,
              en dat daaruit een volledige contentwaterval bouwt — die klinkt zoals jij praat.
            </p>
            <div style={{ marginTop: 32, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Link href="/#contact" className="cs-btn">Plan een gesprek</Link>
              <Link href="/diagnostic" className="cs-btn cs-btn-ghost">Start gratis diagnose</Link>
            </div>
          </div>
        </section>

        {/* CHURN STAT + TABEL */}
        <section className="cs-section" style={{ background: BG2 }}>
          <div className="cs-inner">
            <span className="cs-tag">Waarom bureaus klanten verliezen</span>
            <h2 className="cs-h2" style={{ marginTop: 12 }}>
              48% vertrekt door leveringsontevredenheid.<br />Niet door prijs.
            </h2>
            <p className="cs-lead" style={{ marginBottom: 0 }}>
              De echte reden is stiller: de klant weet niet wat er gebeurt, de content klinkt niet
              als zichzelf, en hij ziet nooit welk stuk content wat opbracht. Dat lossen wij
              structureel op — niet als belofte, maar als productfeature.
            </p>
            <table className="cs-table">
              <thead>
                <tr>
                  <th>Reden van vertrek</th>
                  <th>Cijfer</th>
                  <th>Ons antwoord</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Leveringsontevredenheid</td>
                  <td>48% · +14pp j-o-j</td>
                  <td>Vaste maandcadans zichtbaar in het klantdashboard: pulse scan → perspectief → waterval → publicatie.</td>
                </tr>
                <tr>
                  <td>Communicatiestilte</td>
                  <td>stille killer</td>
                  <td>Het systeem stuurt zelf updates en reminders. Je hoeft nooit te vragen "hoe staat het ervoor."</td>
                </tr>
                <tr>
                  <td>Vanity metrics in rapporten</td>
                  <td>geen ROI-zicht</td>
                  <td>Performance per content-item + automatisch maandrapport: bereik, clicks en leads per stuk.</td>
                </tr>
                <tr>
                  <td>Druk om in-house te brengen</td>
                  <td>32% binnen 12 mnd</td>
                  <td>Wij verkopen intelligence + systeem. Hoe langer het draait, hoe waardevoller het wordt. Niet vervangbaar door een assistent.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* HOE HET WERKT */}
        <section className="cs-section">
          <div className="cs-inner">
            <span className="cs-tag">Hoe het werkt</span>
            <h2 className="cs-h2" style={{ marginTop: 12 }}>3 stappen, elke maand opnieuw</h2>

            <div style={{ marginTop: 8 }}>
              <div className="cs-step">
                <span className="cs-step-num">01</span>
                <div>
                  <p className="cs-step-title">Pulse scan</p>
                  <p className="cs-step-body">
                    Elke maand scant het systeem Reddit, YouTube, X en Instagram op wat er leeft
                    in jouw niche. Per content-cluster: trending topics, onderbouwd met 2-3
                    wetenschappelijke studies. Jij ziet de bronnen, niet enkel het advies.
                  </p>
                </div>
              </div>
              <div className="cs-step">
                <span className="cs-step-num">02</span>
                <div>
                  <p className="cs-step-title">Jouw perspectief · 5 minuten</p>
                  <p className="cs-step-body">
                    Je krijgt een link op je gsm. Geen login. Je kiest welke hook bij jou past
                    en schrijft 3 zinnen vanuit jouw ervaring. Dat is het enige moment dat je
                    actief iets doet. De rest loopt.
                  </p>
                </div>
              </div>
              <div className="cs-step">
                <span className="cs-step-num">03</span>
                <div>
                  <p className="cs-step-title">Content waterval</p>
                  <p className="cs-step-body">
                    Uit één idee + jouw perspectief bouwt het systeem automatisch: een reel-script,
                    een carousel, een quote-kaart, een LinkedIn-post en een blogpost. Allemaal
                    vanuit jouw angle. Jij keurt goed voor publicatie. Eén klik.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* DIFFERENTIATORS */}
        <section className="cs-section" style={{ background: BG2 }}>
          <div className="cs-inner">
            <span className="cs-tag">Wat je erin hebt</span>
            <h2 className="cs-h2" style={{ marginTop: 12 }}>Wat anderen niet doen</h2>

            <div style={{ marginTop: 24 }}>
              <div className="cs-diff">
                <p className="cs-diff-title">Content-intelligentieradar</p>
                <p className="cs-diff-body">
                  Andere bureaus maken content op basis van wat ze denken dat werkt. Wij leveren
                  elke maand een trendscan over Reddit, YouTube, X en Instagram, aangevuld met
                  studies. Jij ziet de bronnen. Dat systeem wordt maand na maand slimmer naarmate
                  het jouw niche leert kennen.
                </p>
              </div>
              <div className="cs-diff">
                <p className="cs-diff-title">Jouw stem, niet AI-slop</p>
                <p className="cs-diff-body">
                  Elke waterval vertrekt uit wat jij vindt. AI stelt voor, jij beslist. Geen
                  content die klinkt als "gegenereerd" — elke publicatie passeert expliciete
                  goedkeuring en is geschreven vanuit jouw perspectief, niet dat van een copywriter
                  die jouw sector niet kent.
                </p>
              </div>
              <div className="cs-diff">
                <p className="cs-diff-title">Frictieloos voor jou</p>
                <p className="cs-diff-body">
                  Magic link zonder inlogpagina (elke inlogpagina halveert de kans dat je
                  actie onderneemt). Goedkeuren vanaf gsm. Het systeem herinnert vriendelijk
                  als er iets op je wacht. Jij hoeft niets bij te houden.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* WAT JE KRIJGT */}
        <section className="cs-section">
          <div className="cs-inner">
            <span className="cs-tag">Wat je maandelijks krijgt</span>
            <h2 className="cs-h2" style={{ marginTop: 12 }}>Uit 1 idee komen 5 formats</h2>
            <div className="cs-grid3" style={{ marginTop: 24 }}>
              {[
                ['Reel-script', 'Visueel + audio getimed, klaar voor productie'],
                ['Carousel', '5-8 slides met hook, kern en CTA'],
                ['Quote-kaart', 'Single-image voor stories en feed'],
                ['LinkedIn-post', '400-600 woorden, hashtags inbegrepen'],
                ['Blogpost', 'SEO-geoptimaliseerd, 2000+ woorden'],
              ].map(([title, desc]) => (
                <div key={title} className="cs-card">
                  <span style={{ fontFamily: B, fontWeight: 600, fontSize: '.95rem', display: 'block', marginBottom: 6 }}>{title}</span>
                  <span style={{ fontSize: '.85rem', color: MUT }}>{desc}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="cs-section" style={{ background: BG2 }}>
          <div className="cs-inner">
            <span className="cs-tag">Veelgestelde vragen</span>
            <h2 className="cs-h2" style={{ marginTop: 12 }}>Wat mensen willen weten</h2>
            <div style={{ marginTop: 24 }}>
              {[
                {
                  q: 'Hoeveel tijd kost het mij echt per maand?',
                  a: '5 minuten per content-idee. Je krijgt een link op je gsm, kiest een hook, schrijft 3 zinnen vanuit jouw ervaring en keurt goed. Dat is alles.',
                },
                {
                  q: 'Klinkt de content ook echt als mij, of herken ik meteen dat het AI is?',
                  a: 'De content vertrekt altijd vanuit jouw perspectief en jouw woorden. AI bouwt de structuur, jij levert de inhoud. Klanten van ons zeggen dat de content klinkt zoals ze praten — dat is het punt van het perspectief-mechanisme.',
                },
                {
                  q: 'Wat als ik een maand niets wil publiceren?',
                  a: 'Dan sla je die maand de goedkeuring over. Er is geen verplichting. Het systeem wacht rustig op jouw input en herinnert je vriendelijk.',
                },
                {
                  q: 'Hoe is dit anders dan een VA of freelance copywriter?',
                  a: 'Een VA of copywriter schrijft vanuit wat jij uitlegt. Wij leveren een systeem dat zelf trends opspoort, jouw stem bewaart en maand na maand leert. Hoe langer het draait, hoe beter het wordt. Een copywriter vervangt geen systeem.',
                },
                {
                  q: 'Kan ik stoppen wanneer ik wil?',
                  a: 'Ja. Geen jaarcontracten. Wel raden we aan minstens 3 maanden te lopen om het verschil te zien — content werkt cumulatief.',
                },
              ].map(({ q, a }) => (
                <div key={q} className="cs-faq">
                  <p className="cs-faq-q">{q}</p>
                  <p className="cs-faq-a">{a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="cs-cta-block">
          <div style={{ maxWidth: 600, margin: '0 auto' }}>
            <p className="cs-cta-h">Klaar om te stoppen met uitleggen wat je bedoelt?</p>
            <p className="cs-cta-sub">
              Plan een gesprek van 20 minuten. We bekijken of het systeem past bij wat jij wil bereiken.
              Geen verkoopsgesprek, wel een eerlijk beeld van wat het kost en wat je terugkrijgt.
            </p>
            <Link href="/#contact" className="cs-cta-btn">Plan een gesprek</Link>
          </div>
        </section>

      </main>
    </>
  )
}
