'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, CheckCircle2 } from 'lucide-react'
import { Nav } from '@/components/nav'

// ── Data ──────────────────────────────────────────────────────────────────────

const levels = [
  {
    id: 1,
    tag: 'Foundation · 0–100K',
    fase: 'Bewijzen',
    title: 'Het aanbod bewijs­leveren',
    color: '#bbf7d0',
    accent: 'rgba(187,247,208,0.12)',
    border: 'rgba(187,247,208,0.18)',
    prio: ['Aanbod definiëren in twee zinnen: voor wie, welk probleem, welk resultaat', 'Speed-to-lead onder 5 minuten — ook \'s avonds en weekends', 'Eerste 5 klanten met meetbaar resultaat als bewijs'],
    insight: 'Tot je 5 betalende klanten hebt met meetbaar resultaat is alles hypothese. Schaal niets voor het aanbod bewezen verkoopt.',
    brand: ['Één niche kiezen, niet twee', 'Eerste 5 testimonials met meetbaar resultaat'],
    leads: ['Website met één duidelijke CTA en bewijssectie', 'Verkoopproces uitschrijven: van contact tot getekende offerte'],
    data: ['GA4 + lead source tracking vanaf dag één', 'Leads bijhouden in spreadsheet tot CRM'],
  },
  {
    id: 2,
    tag: 'Capture · 100K–350K',
    fase: 'Vastpakken',
    title: 'Geen lead laat je­lopen',
    color: '#86efac',
    accent: 'rgba(134,239,172,0.10)',
    border: 'rgba(134,239,172,0.18)',
    prio: ['Leadmagneet bouwen: calculator of audit die de pijn zichtbaar maakt', 'E-mail nurture van 7–12 mails voor niet-koopklare leads', 'CRM implementeren: elke lead getraceerd, elke opvolging gepland'],
    insight: '60–80% van de leads lekt weg omdat niemand ze opvolgt. Een CRM en nurture sequentie verdubbelen je omzet zonder één extra lead te genereren.',
    brand: ['Één contentkanaal, 90 dagen consistent', 'Reviews automatisch verzamelen na elke opdracht'],
    leads: ['Eenvoudig referral systeem: vraag elke tevreden klant om één doorverwijzing', 'Eerste betaald advertentie-experiment om boodschappen te testen'],
    data: ['Conversiepixels op website voor Meta en Google Ads'],
  },
  {
    id: 3,
    tag: 'Convert · 350K–850K',
    fase: 'Optimaliseren',
    title: 'Meer halen uit wat al binnenkomt',
    color: '#6ee7b7',
    accent: 'rgba(110,231,183,0.10)',
    border: 'rgba(110,231,183,0.18)',
    prio: ['Website CRO: sterkere headline, duidelijke CTA, snellere laadtijd, sociaal bewijs', 'Salesscript en discovery framework documenteren — heel team gebruikt hetzelfde', 'Aanbod opdelen in offer ladder: free, low ticket, kern, premium'],
    insight: 'Conversie van 25 naar 35% bouwt meer omzet dan een verdubbeling van je adbudget. Eerst de pipeline fixen, dan de kraan openzetten.',
    brand: ['Casestudies publiceren met meetbare resultaten per klant', 'Tweede contentvorm toevoegen: nieuwsbrief of podcast'],
    leads: ['Onboarding sequentie zodat klanten sneller resultaat zien', 'Marketingverantwoordelijke aanstellen, intern of extern'],
    data: ['Conversietracking volledig: kost per lead per kanaal, conversieratio per fase', 'Wekelijkse marketing- en salesreview met cijfers'],
  },
  {
    id: 4,
    tag: 'Acquire · 850K–2M',
    fase: 'Schalen',
    title: 'Voorspelbare leads­stroom',
    color: '#34d399',
    accent: 'rgba(52,211,153,0.10)',
    border: 'rgba(52,211,153,0.18)',
    prio: ['Best presterend kanaal opschalen: 3–5x het budget op wat al converteert', 'Tweede betaald kanaal toevoegen zodra het eerste stabiel is', 'Retargeting funnel voor websitebezoekers en lead magnet downloaders'],
    insight: 'Schaal alleen wat al bewezen converteert. Een nieuw kanaal in deze fase is een experiment van maximaal 10% van het budget — niet de hoofdmoot.',
    brand: ['Contentkalender met thema\'s, niet ad-hoc posts', 'Content tweede leven geven: één lange post wordt vijf korte stukken'],
    leads: ['Sales coach of fractional sales lead inschakelen', 'Cohortanalyse: welke leadbron levert hoogste LTV'],
    data: ['12-maandenplan met kwartaaldoelen en wekelijkse metrics', 'Data audit: meet je de juiste dingen of wat makkelijk is?'],
  },
  {
    id: 5,
    tag: 'Compound · 2M–5M',
    fase: 'Bouwen',
    title: 'Assets die blijven werken',
    color: '#4ade80',
    accent: 'rgba(74,222,128,0.10)',
    border: 'rgba(74,222,128,0.18)',
    prio: ['SEO en GEO als systeem: 30–50 high-intent pagina\'s per topic cluster', 'Videoprogramma starten: YouTube of long-form/short-form combinatie', 'Thought leadership: spreekoptredens, gastpodcasts, eigen rapport'],
    insight: 'SEO en video starten hier niet later, maar pas nu écht gestructureerd. Tot dit niveau ontbreekt het budget om 12 tot 18 maanden geduldig te zijn voor het rendement komt.',
    brand: ['PR en earned media in vakpers en sectorpublicaties'],
    leads: ['Account-based marketing voor topsegment: persoonlijke aanpak top 100 prospects', 'Strategisch partnerprogramma met complementaire dienstverleners'],
    data: ['Marketing attributiemodel: weet welke touchpoints écht bijdragen', 'Kwartaalstrategie reviews met volledige datasets'],
  },
  {
    id: 6,
    tag: 'Multiply · 5M+',
    fase: 'Vermenigvuldigen',
    title: 'Het bedrijf groeit zonder jou',
    color: '#c96442',
    accent: 'rgba(201,100,66,0.10)',
    border: 'rgba(201,100,66,0.25)',
    prio: ['AI agents in leadkwalificatie, opvolging en eerstelijns support', 'Affiliate- en partnerprogramma: derden verkopen voor jou', 'Categorie definiëren: niet de beste in een markt, een nieuwe definiëren'],
    insight: 'Brand, AI en partnerships zijn compounding assets. Elke maand investering verhoogt het rendement. Jouw rol verschuift van uitvoering naar richting geven.',
    brand: ['Eigen event, community of certificering bouwen', 'Internationale of geografische uitbreiding met bewezen systemen'],
    leads: ['Productisering: deel van dienstverlening omzetten in SaaS, licentie of cursus'],
    data: ['Predictive analytics: welke prospect heeft welke kans op closing', 'Adviesraad of peergroep voor strategische verantwoording'],
  },
]

// ── Styles ────────────────────────────────────────────────────────────────────

const css = `
  .gl-page { min-height: 100svh; background: #051209; padding-top: 80px; }
  .gl-hero { max-width: 760px; margin: 0 auto; padding: 4rem 1.5rem 3rem; text-align: center; }
  .gl-eyebrow { font-size: 10px; font-weight: 700; letter-spacing: .18em; text-transform: uppercase; color: #c96442; margin-bottom: 14px; }
  .gl-h1 { font-family: var(--font-serif); font-size: clamp(30px, 5vw, 52px); font-weight: 700; color: #faf9f5; line-height: 1.15; margin-bottom: 16px; }
  .gl-h1 em { font-style: italic; color: rgba(250,249,245,0.55); }
  .gl-sub { font-size: 16px; color: rgba(250,249,245,0.55); line-height: 1.7; max-width: 520px; margin: 0 auto 2rem; }
  .gl-ctas { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }
  .gl-btn-primary { display: inline-flex; align-items: center; gap: 8px; background: #c96442; color: #fff; padding: 13px 26px; border-radius: 50px; font-size: 14px; font-weight: 700; text-decoration: none; transition: opacity .15s; }
  .gl-btn-primary:hover { opacity: .88; }
  .gl-btn-ghost { display: inline-flex; align-items: center; gap: 8px; background: rgba(250,249,245,0.07); color: rgba(250,249,245,0.7); padding: 13px 24px; border-radius: 50px; font-size: 14px; font-weight: 600; text-decoration: none; border: 1px solid rgba(250,249,245,0.12); transition: opacity .15s; }
  .gl-btn-ghost:hover { opacity: .75; }

  .gl-ladder { max-width: 860px; margin: 0 auto; padding: 0 1.5rem 5rem; display: flex; flex-direction: column; gap: 0; }
  .gl-step { display: flex; gap: 0; position: relative; }
  .gl-spine { display: flex; flex-direction: column; align-items: center; width: 48px; flex-shrink: 0; }
  .gl-node { width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 800; flex-shrink: 0; z-index: 1; }
  .gl-line { flex: 1; width: 2px; background: rgba(250,249,245,0.08); }
  .gl-card { flex: 1; background: rgba(250,249,245,0.03); border: 1px solid rgba(250,249,245,0.08); border-radius: 16px; padding: 1.6rem 1.8rem; margin-bottom: 20px; transition: border-color .2s, background .2s; cursor: pointer; }
  .gl-card:hover { background: rgba(250,249,245,0.05); }
  .gl-card.open { border-color: var(--level-border); background: var(--level-accent); }
  .gl-card-top { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; }
  .gl-tag { font-size: 10px; font-weight: 700; letter-spacing: .14em; text-transform: uppercase; margin-bottom: 6px; }
  .gl-title { font-family: var(--font-serif); font-size: 22px; font-weight: 700; color: #faf9f5; line-height: 1.25; }
  .gl-fase { font-size: 11px; font-weight: 600; color: rgba(250,249,245,0.35); text-transform: uppercase; letter-spacing: .1em; margin-top: 4px; }
  .gl-chevron { font-size: 18px; color: rgba(250,249,245,0.3); transition: transform .2s; flex-shrink: 0; margin-top: 4px; }
  .gl-card.open .gl-chevron { transform: rotate(180deg); }
  .gl-body { margin-top: 1.2rem; display: none; }
  .gl-card.open .gl-body { display: block; }
  .gl-prio { display: flex; flex-direction: column; gap: 8px; margin-bottom: 1.2rem; }
  .gl-prio-item { display: flex; align-items: flex-start; gap: 10px; }
  .gl-prio-dot { width: 18px; height: 18px; border-radius: 50%; flex-shrink: 0; display: flex; align-items: center; justify-content: center; margin-top: 1px; }
  .gl-prio-text { font-size: 14px; color: rgba(250,249,245,0.85); line-height: 1.55; }
  .gl-insight { border-radius: 10px; padding: 14px 16px; margin-bottom: 1.2rem; border-left: 3px solid; font-size: 13px; line-height: 1.65; font-style: italic; }
  .gl-tracks { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
  @media (max-width: 600px) { .gl-tracks { grid-template-columns: 1fr; } }
  .gl-track { background: rgba(250,249,245,0.04); border-radius: 10px; padding: 12px 14px; }
  .gl-track-label { font-size: 10px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; color: rgba(250,249,245,0.35); margin-bottom: 8px; }
  .gl-track-item { font-size: 12px; color: rgba(250,249,245,0.6); line-height: 1.55; display: flex; gap: 7px; margin-bottom: 5px; }
  .gl-track-item::before { content: '·'; color: rgba(250,249,245,0.25); flex-shrink: 0; }

  .gl-cta-section { max-width: 600px; margin: 0 auto; padding: 0 1.5rem 6rem; text-align: center; }
  .gl-cta-card { background: rgba(201,100,66,0.08); border: 1px solid rgba(201,100,66,0.2); border-radius: 20px; padding: 2.4rem 2rem; }
  .gl-cta-title { font-family: var(--font-serif); font-size: 26px; font-weight: 700; color: #faf9f5; line-height: 1.3; margin-bottom: 10px; }
  .gl-cta-sub { font-size: 14px; color: rgba(250,249,245,0.55); line-height: 1.7; margin-bottom: 1.6rem; }
  .gl-principle { max-width: 680px; margin: 0 auto; padding: 0 1.5rem 4rem; }
  .gl-principle-title { font-family: var(--font-serif); font-size: 20px; font-weight: 700; color: rgba(250,249,245,0.8); margin-bottom: 12px; }
  .gl-principle-text { font-size: 15px; color: rgba(250,249,245,0.45); line-height: 1.8; border-left: 2px solid rgba(201,100,66,0.4); padding-left: 18px; }
`

// ── Component ─────────────────────────────────────────────────────────────────

export default function GroeiladderPage() {
  const [open, setOpen] = useState<number | null>(1)

  const toggle = (id: number) => setOpen(prev => prev === id ? null : id)

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <Nav />
      <div className="gl-page">

        {/* Hero */}
        <div className="gl-hero">
          <div className="gl-eyebrow">De Lead it, Grow Groeiladder</div>
          <h1 className="gl-h1">
            De juiste hefboom,<br />
            <em>op het juiste moment.</em>
          </h1>
          <p className="gl-sub">
            6 niveaus. Per niveau de acties met de hoogste ROI. De volgorde is geen voorkeur — het is fysica. Acquisitie schalen op een lekkende pipeline is geld verbranden.
          </p>
          <div className="gl-ctas">
            <Link href="/diagnostic" className="gl-btn-primary">
              Doe de gratis diagnose <ArrowRight size={15} />
            </Link>
            <Link href="/calculator" className="gl-btn-ghost">
              Bereken mijn omzetverlies <ArrowRight size={15} />
            </Link>
          </div>
        </div>

        {/* Ladder */}
        <div className="gl-ladder">
          {levels.map((level, idx) => {
            const isOpen = open === level.id
            const isLast = idx === levels.length - 1

            return (
              <div key={level.id} className="gl-step">
                {/* Spine */}
                <div className="gl-spine">
                  <div
                    className="gl-node"
                    style={{ background: isOpen ? level.color : 'rgba(250,249,245,0.08)', color: isOpen ? '#051209' : 'rgba(250,249,245,0.4)' }}
                  >
                    {level.id}
                  </div>
                  {!isLast && <div className="gl-line" />}
                </div>

                {/* Card */}
                <div
                  className={`gl-card${isOpen ? ' open' : ''}`}
                  style={{
                    ['--level-border' as string]: level.border,
                    ['--level-accent' as string]: level.accent,
                  }}
                  onClick={() => toggle(level.id)}
                >
                  <div className="gl-card-top">
                    <div>
                      <div className="gl-tag" style={{ color: level.color }}>{level.tag}</div>
                      <div className="gl-title">{level.title}</div>
                      <div className="gl-fase">{level.fase}</div>
                    </div>
                    <div className="gl-chevron">&#8964;</div>
                  </div>

                  <div className="gl-body">
                    {/* Priority actions */}
                    <div className="gl-prio">
                      {level.prio.map((item, i) => (
                        <div key={i} className="gl-prio-item">
                          <div
                            className="gl-prio-dot"
                            style={{ background: level.accent, border: `1.5px solid ${level.color}` }}
                          >
                            <CheckCircle2 size={10} color={level.color} />
                          </div>
                          <div className="gl-prio-text">{item}</div>
                        </div>
                      ))}
                    </div>

                    {/* Insight */}
                    <div
                      className="gl-insight"
                      style={{
                        background: level.accent,
                        borderColor: level.color,
                        color: level.color,
                      }}
                    >
                      {level.insight}
                    </div>

                    {/* 3 tracks */}
                    <div className="gl-tracks">
                      <div className="gl-track">
                        <div className="gl-track-label">🎯 Brand</div>
                        {level.brand.map((b, i) => (
                          <div key={i} className="gl-track-item">{b}</div>
                        ))}
                      </div>
                      <div className="gl-track">
                        <div className="gl-track-label">⚡ Leads</div>
                        {level.leads.map((l, i) => (
                          <div key={i} className="gl-track-item">{l}</div>
                        ))}
                      </div>
                      <div className="gl-track">
                        <div className="gl-track-label">📊 Data</div>
                        {level.data.map((d, i) => (
                          <div key={i} className="gl-track-item">{d}</div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Principle */}
        <div className="gl-principle">
          <div className="gl-principle-title">Het principe achter de volgorde</div>
          <div className="gl-principle-text">
            Acquisitie schalen op een lekkende pipeline is geld verbranden. Eerst aanbod en bewijs, dan capture en speed-to-lead, dan conversie en data, dan acquisitie schalen, dan compounding assets, dan vermenigvuldigen. Wie deze volgorde respecteert, groeit voorspelbaar. Wie hem overslaat, betaalt het verschil in duurder leadkost.
          </div>
        </div>

        {/* CTA section */}
        <div className="gl-cta-section">
          <div className="gl-cta-card">
            <div className="gl-cta-title">Waar sta jij op de ladder?</div>
            <div className="gl-cta-sub">
              De gratis diagnose scant je bedrijf op alle 7 groeihefbomen en geeft je een persoonlijk rapport met de top 3 prioriteiten op jouw niveau. 10 minuten. Geen verkoopsgesprek.
            </div>
            <div className="gl-ctas">
              <Link href="/diagnostic" className="gl-btn-primary">
                Doe de gratis diagnose <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </div>

      </div>

      <footer
        className="py-8 text-center text-xs"
        style={{ background: '#020b05', color: 'rgba(250,249,245,0.25)' }}
      >
        © {new Date().getFullYear()} Lead it, Grow · leaditgrow.be
      </footer>
    </>
  )
}
