'use client'

import { useState, useRef } from 'react'
import { ArrowRight } from 'lucide-react'
import { useLang } from '@/components/lang-context'

// ─── PineTier SVG component — simple triangle ────────────────────────────────

function PineTier({ width, height, fillColor, glowColor, isHovered }: {
  width: number; height: number; fillColor: string; glowColor: string; isHovered: boolean; levelId: number
}) {
  const cx = width / 2
  const d = `M ${cx} 0 L ${width} ${height} L 0 ${height} Z`

  return (
    <svg
      width={width}
      height={height}
      overflow="visible"
      style={{
        display: 'block',
        filter: isHovered
          ? `brightness(2.1) drop-shadow(0 0 14px ${glowColor}) drop-shadow(0 0 34px ${glowColor}99)`
          : 'brightness(1)',
        transform: isHovered ? 'scaleX(1.05)' : 'scaleX(1)',
        transformOrigin: 'center bottom',
        transition: 'filter 0.38s ease, transform 0.38s ease',
      }}
    >
      <path d={d} fill={fillColor} />
    </svg>
  )
}

// ─── Data ─────────────────────────────────────────────────────────────────────

interface GrowthLevel {
  id: number
  phase: { nl: string; en: string }
  title: { nl: string; en: string }
  signals: { nl: string[]; en: string[] }
  fillColor: string
  glowColor: string
  width: number
  height: number
}

interface GrowthLevelExt extends GrowthLevel {
  revenue: { nl: string; en: string }
  anchor: { nl: string; en: string }
}

const levels: GrowthLevelExt[] = [
  {
    id: 5,
    phase: { nl: 'Compound · 2M–5M', en: 'Compound · 2M–5M' },
    title: { nl: 'Bouwen', en: 'Build' },
    revenue: { nl: '2M – 5M omzet', en: '2M – 5M revenue' },
    anchor: { nl: 'SEO, video en thought leadership bouwen assets die jaar na jaar blijven renderen.', en: 'SEO, video and thought leadership build assets that compound year after year.' },
    signals: {
      nl: ['SEO + video als systeem: 30–50 high-intent pagina\'s', 'Thought leadership: spreekoptredens, gastpodcasts, eigen rapport', 'Account-based marketing voor jouw top 100 prospects'],
      en: ['SEO + video as a system: 30–50 high-intent pages', 'Thought leadership: speaking, guest podcasts, original report', 'Account-based marketing for your top 100 prospects'],
    },
    fillColor: '#0a2412', glowColor: '#4ade80', width: 160, height: 118,
  },
  {
    id: 4,
    phase: { nl: 'Acquire · 850K–2M', en: 'Acquire · 850K–2M' },
    title: { nl: 'Schalen', en: 'Scale' },
    revenue: { nl: '850K – 2M omzet', en: '850K – 2M revenue' },
    anchor: { nl: 'Schaal alleen wat al converteert. Een nieuw kanaal is een experiment van max 10% van het budget.', en: 'Scale only what already converts. A new channel is a max 10% budget experiment.' },
    signals: {
      nl: ['Best presterend kanaal opschalen: 3–5x het budget', 'Retargeting funnel voor bezoekers en lead magnet downloaders', 'Cohortanalyse: welke leadbron levert hoogste LTV'],
      en: ['Scale best-performing channel: 3–5x the budget', 'Retargeting funnel for visitors and lead magnet downloaders', 'Cohort analysis: which lead source delivers highest LTV'],
    },
    fillColor: '#0d2a16', glowColor: '#34d399', width: 248, height: 146,
  },
  {
    id: 3,
    phase: { nl: 'Convert · 350K–850K', en: 'Convert · 350K–850K' },
    title: { nl: 'Optimaliseren', en: 'Optimise' },
    revenue: { nl: '350K – 850K omzet', en: '350K – 850K revenue' },
    anchor: { nl: 'Conversie van 25→35% levert meer op dan je adbudget verdubbelen. Eerst de pipeline fixen.', en: 'Moving conversion from 25→35% generates more than doubling ad spend. Fix the pipeline first.' },
    signals: {
      nl: ['Website CRO: sterkere headline, snellere laadtijd, sociaal bewijs', 'Salesscript en discovery framework gedocumenteerd', 'Aanbod opdelen in offer ladder: free, low ticket, kern, premium'],
      en: ['Website CRO: stronger headline, faster load, social proof', 'Sales script and discovery framework documented', 'Offer ladder in place: free, low ticket, core, premium'],
    },
    fillColor: '#0f2e1c', glowColor: '#6ee7b7', width: 338, height: 170,
  },
  {
    id: 2,
    phase: { nl: 'Capture · 100K–350K', en: 'Capture · 100K–350K' },
    title: { nl: 'Vastpakken', en: 'Catch' },
    revenue: { nl: '100K – 350K omzet', en: '100K – 350K revenue' },
    anchor: { nl: 'CRM + nurture sequentie verdubbelen je omzet zonder één extra lead te genereren.', en: 'CRM + nurture sequence can double revenue without generating a single extra lead.' },
    signals: {
      nl: ['60–80% van leads lekt weg door gebrek aan opvolging', 'Leadmagneet bouwen: calculator of audit die de pijn zichtbaar maakt', 'E-mail nurture van 7–12 mails voor niet-koopklare leads'],
      en: ['60–80% of leads leak due to lack of follow-up', 'Build a lead magnet: calculator or audit that makes the pain visible', 'Email nurture of 7–12 emails for leads not ready to buy'],
    },
    fillColor: '#123320', glowColor: '#86efac', width: 428, height: 192,
  },
  {
    id: 1,
    phase: { nl: 'Foundation · 0–100K', en: 'Foundation · 0–100K' },
    title: { nl: 'Bewijzen', en: 'Prove' },
    revenue: { nl: '0 – 100K omzet', en: '0 – 100K revenue' },
    anchor: { nl: 'Tot je 5 betalende klanten hebt met meetbaar resultaat, is alles hypothese. Schaal niets voor het aanbod bewezen verkoopt.', en: 'Until you have 5 paying clients with measurable results, everything is hypothesis. Scale nothing before the offer is proven.' },
    signals: {
      nl: ['Aanbod definiëren in twee zinnen: voor wie, welk probleem, welk resultaat', 'Speed-to-lead onder 5 minuten — ook \'s avonds en weekends', 'Eerste 5 klanten met meetbaar resultaat als bewijs'],
      en: ['Define the offer in two sentences: who, what problem, what result', 'Speed-to-lead under 5 minutes — including evenings and weekends', 'First 5 clients with measurable results as proof'],
    },
    fillColor: '#153824', glowColor: '#bbf7d0', width: 518, height: 214,
  },
]

const baseDesires = {
  nl: ['Het bedrijf groeit zonder jouw dagelijkse aanwezigheid', 'AI agents in leadkwalificatie, opvolging en eerstelijns support', 'Categorie definiëren: niet de beste in een markt, een nieuwe definiëren', 'Affiliate- en partnerprogramma: derden verkopen voor jou', 'Jouw rol verschuift van uitvoering naar richting geven'],
  en: ['The business grows without your daily presence', 'AI agents in lead qualification, follow-up and first-line support', 'Define the category: not best in a market, define a new one', 'Affiliate and partner programme: third parties sell for you', 'Your role shifts from execution to direction'],
}

// ─── Main component ───────────────────────────────────────────────────────────

export function PineTreeLadder() {
  const [activeId, setActiveId] = useState<number | null>(null)
  const [visibleCount, setVisibleCount] = useState(1)
  const [baseActive, setBaseActive] = useState(false)
  const { t, lang } = useLang()

  const leaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const baseLeaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const enterLevel = (id: number) => {
    if (leaveTimer.current) clearTimeout(leaveTimer.current)
    setActiveId(id)
  }
  const leaveLevel = () => {
    leaveTimer.current = setTimeout(() => setActiveId(null), 140)
  }
  const enterBase = () => {
    if (baseLeaveTimer.current) clearTimeout(baseLeaveTimer.current)
    setBaseActive(true)
  }
  const leaveBase = () => {
    baseLeaveTimer.current = setTimeout(() => setBaseActive(false), 140)
  }

  const reveal = (nextId: number) => {
    setVisibleCount(nextId)
    setActiveId(null)
  }

  return (
    <>
      <style>{`
        @keyframes treeEnter {
          from { opacity: 0; transform: scaleX(0.86) translateY(-8px); }
          to   { opacity: 1; transform: scaleX(1)    translateY(0);    }
        }
        .tree-enter { animation: treeEnter 0.5s cubic-bezier(0.16,1,0.3,1) forwards; transform-origin: center bottom; }
      `}</style>

      <div className="flex flex-col items-center" style={{ overflow: 'visible' }}>
        {levels.map((level) => {
          if (level.id > visibleCount) return null
          const isTop = level.id === visibleCount
          const isActive = activeId === level.id

          return (
            <div
              key={level.id}
              className={`relative flex justify-center cursor-pointer${isTop ? ' tree-enter' : ''}`}
              style={{
                marginTop: isTop ? 0 : '-36px',
                zIndex: isActive ? 50 : level.id + 5,
                overflow: 'visible',
              }}
              onMouseEnter={() => enterLevel(level.id)}
              onMouseLeave={leaveLevel}
            >
              <div className="relative" style={{ overflow: 'visible' }}>
                <PineTier
                  width={level.width}
                  height={level.height}
                  fillColor={level.fillColor}
                  glowColor={level.glowColor}
                  isHovered={isActive}
                  levelId={level.id}
                />
                {/* Level badge — always visible on each tier */}
                <div
                  className="absolute left-1/2 pointer-events-none select-none"
                  style={{
                    top: '54%',
                    transform: 'translateX(-50%)',
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: isActive ? level.glowColor : 'rgba(250,249,245,0.55)',
                    transition: 'color 0.3s ease',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {t(`Level ${level.id}`, `Level ${level.id}`)}
                </div>
              </div>

              {/* Popup */}
              {isActive && (
                <div
                  className="absolute pointer-events-none"
                  style={{ bottom: 'calc(100% + 10px)', left: '50%', transform: 'translateX(-50%)', width: 310, zIndex: 100 }}
                >
                  <div
                    className="rounded-2xl p-5 shadow-2xl pointer-events-auto"
                    style={{ background: '#faf9f5', boxShadow: '0 24px 64px rgba(0,0,0,0.38)' }}
                    onMouseEnter={() => enterLevel(level.id)}
                    onMouseLeave={leaveLevel}
                  >
                    <div className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: '#c96442' }}>
                      {t(level.phase.nl, level.phase.en)}
                    </div>
                    <div className="text-[1.05rem] font-semibold mb-3 leading-snug" style={{ color: '#3d3929', fontFamily: 'var(--font-serif)', fontStyle: 'italic' }}>
                      {t(level.title.nl, level.title.en)}
                    </div>
                    <ul className="space-y-1.5 mb-3">
                      {(lang === 'nl' ? level.signals.nl : level.signals.en).map((s, i) => (
                        <li key={i} className="flex items-start gap-2 text-[13px]" style={{ color: '#535146' }}>
                          <span className="flex-shrink-0 rounded-full" style={{ width: 6, height: 6, background: '#15803d', marginTop: 5 }} />
                          {s}
                        </li>
                      ))}
                    </ul>
                    <div className="rounded-lg px-3 py-2 mb-4 text-[11.5px] leading-relaxed" style={{ background: 'rgba(21,128,61,0.07)', color: '#2d6a4f', borderLeft: '2px solid #15803d' }}>
                      {t((level as GrowthLevelExt).anchor.nl, (level as GrowthLevelExt).anchor.en)}
                    </div>
                    <div className="flex flex-col gap-2">
                      <a
                        href="/diagnostic"
                        className="flex items-center justify-center gap-2 w-full py-2.5 px-3 rounded-lg text-[12.5px] font-semibold text-white transition-opacity hover:opacity-85 text-center leading-snug"
                        style={{ background: '#15803d' }}
                      >
                        {t('Gratis diagnose', 'Free diagnostic')}
                        <ArrowRight className="w-3.5 h-3.5 flex-shrink-0" />
                      </a>
                      {level.id < 5 && level.id === visibleCount && (
                        <button
                          onClick={() => reveal(level.id + 1)}
                          className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg text-[13px] font-semibold transition-all hover:opacity-80"
                          style={{ background: 'rgba(61,57,41,0.07)', color: '#3d3929', border: '1px solid rgba(61,57,41,0.14)' }}
                        >
                          {t(`Ontgrendel level ${level.id + 1}`, `Unlock level ${level.id + 1}`)}
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="mx-auto mt-1 rounded-full" style={{ width: 10, height: 10, background: '#faf9f5', boxShadow: '0 2px 6px rgba(0,0,0,0.28)' }} />
                </div>
              )}
            </div>
          )
        })}

        {/* Trunk — warm brown like the reference image */}
        <div style={{
          width: 28, height: 65,
          background: 'linear-gradient(to bottom, #6b3f1e, #3d2210)',
          borderRadius: '1px 1px 5px 5px',
          marginTop: -4,
          boxShadow: 'inset -4px 0 8px rgba(0,0,0,0.45), inset 2px 0 4px rgba(255,255,255,0.06)',
        }} />

        {/* Base — Impactful Leadership */}
        <div
          className="relative text-center transition-all duration-300 cursor-pointer"
          style={{ width: 'min(580px, 92vw)', padding: '20px 32px', background: 'linear-gradient(135deg, rgba(201,100,66,0.08) 0%, rgba(10,26,14,0.95) 45%, rgba(21,128,61,0.1) 100%)', borderTop: '2px solid rgba(201,100,66,0.4)', borderRadius: '0 0 16px 16px' }}
          onMouseEnter={enterBase}
          onMouseLeave={leaveBase}
        >
          <div className="absolute -top-3 right-6 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full text-white" style={{ background: '#c96442' }}>
            {t('Multiply · 5M+', 'Multiply · 5M+')}
          </div>
          <div className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: '#d97757' }}>
            {t('Vermenigvuldigen', 'Multiply')}
          </div>
          <div className="text-base font-medium" style={{ color: '#faf9f5', fontFamily: 'var(--font-serif)', fontStyle: 'italic' }}>
            {t('Het bedrijf groeit zonder jou', 'The business grows without you')}
          </div>

          {baseActive && (
            <div className="absolute left-1/2 bottom-full mb-3 pointer-events-none" style={{ transform: 'translateX(-50%)', width: 350, zIndex: 100 }}>
              <div
                className="rounded-2xl p-5 pointer-events-auto"
                style={{ background: '#faf9f5', boxShadow: '0 24px 64px rgba(0,0,0,0.35)' }}
                onMouseEnter={enterBase}
                onMouseLeave={leaveBase}
              >
                <div className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: '#c96442' }}>
                  {t('Multiply · 5M+', 'Multiply · 5M+')}
                </div>
                <div className="text-[1.05rem] font-semibold mb-1 leading-snug" style={{ color: '#3d3929', fontFamily: 'var(--font-serif)', fontStyle: 'italic' }}>
                  {t('Vermenigvuldigen', 'Multiply')}
                </div>
                <p className="text-[12px] mb-3" style={{ color: '#83827d' }}>
                  {t('Brand, AI en partnerships zijn compounding assets. Jouw rol verschuift van uitvoering naar richting.', 'Brand, AI and partnerships are compounding assets. Your role shifts from execution to direction.')}
                </p>
                <ul className="space-y-1.5 mb-4">
                  {(lang === 'nl' ? baseDesires.nl : baseDesires.en).map((d, i) => (
                    <li key={i} className="flex items-start gap-2 text-[13px]" style={{ color: '#535146' }}>
                      <span className="flex-shrink-0 rounded-full" style={{ width: 6, height: 6, background: '#c96442', marginTop: 5 }} />
                      {d}
                    </li>
                  ))}
                </ul>
                <a href="#contact" className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg text-[13px] font-semibold text-white transition-opacity hover:opacity-85" style={{ background: '#c96442' }}>
                  {t('Ontdek jouw pad', 'Discover your path')}
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
              <div className="mx-auto mt-1 rounded-full" style={{ width: 10, height: 10, background: '#faf9f5', boxShadow: '0 2px 6px rgba(0,0,0,0.28)' }} />
            </div>
          )}
        </div>
      </div>
    </>
  )
}
