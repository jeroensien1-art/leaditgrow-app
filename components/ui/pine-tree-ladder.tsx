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

const levels: GrowthLevel[] = [
  {
    id: 5, phase: { nl: 'Level 5', en: 'Level 5' },
    title: { nl: 'Visionair Leiderschap', en: 'Visionary Leadership' },
    signals: {
      nl: ['Jij leidt de visie — anderen voeren uit', 'Bedrijfsimpact reikt verder dan jijzelf', 'Jij kiest wanneer en hoe jij betrokken bent', 'Systemen draaien, het team leidt', 'Erkend denker en leider in jouw sector'],
      en: ['You lead the vision — others execute', 'Company impact reaches beyond yourself', 'You choose when and how you\'re involved', 'Systems run, the team leads', 'Recognized thought leader in your field'],
    },
    fillColor: '#0a2412', glowColor: '#4ade80', width: 160, height: 118,
  },
  {
    id: 4, phase: { nl: 'Level 4', en: 'Level 4' },
    title: { nl: 'Schaalbaar Systeem', en: 'Scalable System' },
    signals: {
      nl: ['Leiderschapsteam op zijn plaats', 'BD-systeem genereert leads automatisch', 'Playbooks draaien zonder jouw aanwezigheid', 'Voorspelbare omzet, klaar om te schalen', 'Jij stuurt op strategie, niet op operaties'],
      en: ['Leadership team in place', 'BD system generates leads automatically', 'Playbooks run without your presence', 'Predictable revenue, ready to scale', 'You steer on strategy, not operations'],
    },
    fillColor: '#0d2a16', glowColor: '#34d399', width: 248, height: 146,
  },
  {
    id: 3, phase: { nl: 'Level 3', en: 'Level 3' },
    title: { nl: 'Voorspelbare Pipeline', en: 'Predictable Pipeline' },
    signals: {
      nl: ['BD-engine genereert consistent leads', 'Team beheert de dagelijkse operaties', 'Jij leidt strategie in plaats van brandjes te blussen', 'Groei voelt intentioneel en herhaalbaar', 'Eerste automatische opvolging in werking'],
      en: ['BD engine generates leads consistently', 'Team manages day-to-day operations', 'You lead strategy instead of firefighting', 'Growth feels intentional and repeatable', 'First automated follow-up running'],
    },
    fillColor: '#0f2e1c', glowColor: '#6ee7b7', width: 338, height: 170,
  },
  {
    id: 2, phase: { nl: 'Level 2', en: 'Level 2' },
    title: { nl: 'Eerste Fundamenten', en: 'First Foundations' },
    signals: {
      nl: ['Eerste processen gedocumenteerd maar wisselvallig', 'Team groeit maar heeft constant begeleiding nodig', 'BD is nog manueel en onvoorspelbaar', 'Omzetgroei aanwezig maar fragiel', 'Groeipieken, geen consistente pipeline'],
      en: ['First processes documented but inconsistent', 'Team growing but needs constant guidance', 'BD is still manual and unpredictable', 'Revenue growing but fragile', 'Growth spikes, no consistent pipeline'],
    },
    fillColor: '#123320', glowColor: '#86efac', width: 428, height: 192,
  },
  {
    id: 1, phase: { nl: 'Level 1', en: 'Level 1' },
    title: { nl: 'De Oprichtersbottleneck', en: 'The Founder Bottleneck' },
    signals: {
      nl: ['Alles loopt via jou — jij bent het bedrijf', 'Reactief werken, constant brandjes blussen', 'Geen systemen — groei hangt af van jouw energie', 'Leads vallen door de mazen van het net', 'Omzet plafonneerd aan jouw persoonlijke capaciteit'],
      en: ['Everything runs through you — you are the business', 'Reactive mode, constant firefighting', 'No systems — growth depends on your energy', 'Leads fall through the cracks', 'Revenue capped by your personal capacity'],
    },
    fillColor: '#153824', glowColor: '#bbf7d0', width: 518, height: 214,
  },
]

const baseDesires = {
  nl: ['Leiden met charisma en authentieke aanwezigheid', 'Delegeren met volledig vertrouwen', 'Tijd voor gezin, gezondheid en hobby\'s', 'Ruimte voor creativiteit en innovatie', 'Financiële vrijheid en bedrijfsmomentum'],
  en: ['Lead with charisma and authentic presence', 'Delegate with full confidence', 'Time for family, health and hobbies', 'Space for creativity and innovation', 'Financial freedom and business momentum'],
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
                    <ul className="space-y-1.5 mb-4">
                      {(lang === 'nl' ? level.signals.nl : level.signals.en).map((s, i) => (
                        <li key={i} className="flex items-start gap-2 text-[13px]" style={{ color: '#535146' }}>
                          <span className="flex-shrink-0 rounded-full" style={{ width: 6, height: 6, background: '#15803d', marginTop: 5 }} />
                          {s}
                        </li>
                      ))}
                    </ul>
                    <div className="flex flex-col gap-2">
                      <a
                        href="#contact"
                        className="flex items-center justify-center gap-2 w-full py-2.5 px-3 rounded-lg text-[12.5px] font-semibold text-white transition-opacity hover:opacity-85 text-center leading-snug"
                        style={{ background: '#15803d' }}
                      >
                        {t('Doe de 2-min test — ontdek jouw groeikans', 'Take the 2-min test — find your growth opportunity')}
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
            {t('Fundament', 'Foundation')}
          </div>
          <div className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: '#d97757' }}>
            {t('Impactvol Leiderschap', 'Impactful Leadership')}
          </div>
          <div className="text-base font-medium" style={{ color: '#faf9f5', fontFamily: 'var(--font-serif)', fontStyle: 'italic' }}>
            {t('De gebalanceerde leider', 'The balanced leader')}
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
                  {t('Het fundament van alles erboven', 'The foundation of everything above')}
                </div>
                <div className="text-[1.05rem] font-semibold mb-1 leading-snug" style={{ color: '#3d3929', fontFamily: 'var(--font-serif)', fontStyle: 'italic' }}>
                  {t('Hoe gebalanceerd leiderschap eruitziet', 'What balanced leadership looks like')}
                </div>
                <p className="text-[12px] mb-3" style={{ color: '#83827d' }}>
                  {t('Dit is de basis die elk volgend niveau mogelijk maakt.', 'This is the foundation that makes every level above possible.')}
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
