'use client'

import { useEffect, useRef, useState } from 'react'

const levels = [
  {
    id: 1, name: 'Foundation', color: '#bbf7d0',
    keywords: ['Aanbod in twee zinnen definiëren', 'ICP bepalen', 'Speed-to-lead'],
    oneliner: 'Je hebt al klanten. De vraag is niet of je aanbod werkt, maar voor wie het het beste werkt en via welk kanaal je er meer van vindt.',
  },
  {
    id: 2, name: 'Capture', color: '#86efac',
    keywords: ['CRM activeren', 'Leadmagneet bouwen', 'Nurture sequentie'],
    oneliner: '60 tot 80% van de leads lekt weg omdat niemand ze consequent opvolgt. Een CRM en nurture sequentie verdubbelen je omzet zonder één extra lead.',
  },
  {
    id: 3, name: 'Convert', color: '#6ee7b7',
    keywords: ['Salesscript documenteren', 'Website CRO', 'Offer ladder uitschrijven'],
    oneliner: 'Conversie van 25 naar 35% bouwt meer omzet dan een verdubbeling van je adbudget. Eerst de pipeline fixen, dan de kraan openzetten.',
  },
  {
    id: 4, name: 'Acquire', color: '#34d399',
    keywords: ['Best kanaal opschalen', 'Retargeting activeren', 'Tweede kanaal testen'],
    oneliner: 'Schaal alleen wat al bewezen converteert. Een nieuw kanaal in deze fase is een experiment van maximaal 10% van het budget.',
  },
  {
    id: 5, name: 'Compound', color: '#4ade80',
    keywords: ['SEO als systeem', 'Videoprogramma opstarten', 'Thought leadership'],
    oneliner: 'SEO en video starten hier pas gestructureerd. Tot dit niveau ontbreekt het budget om 12 tot 18 maanden geduldig te zijn voor het rendement komt.',
  },
  {
    id: 6, name: 'Multiply', color: '#c96442',
    keywords: ['AI agents inzetten', 'Partnerprogramma bouwen', 'Categorie definiëren'],
    oneliner: 'Brand, AI en partnerships zijn compounding assets. Jouw rol verschuift van uitvoering naar richting geven.',
  },
]

const INTERVAL = 2800

export function Services() {
  const [openId, setOpenId] = useState(levels[0].id)
  const currentIdxRef = useRef(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const hoveredRef = useRef(false)

  const startTimer = () => {
    if (timerRef.current) return
    timerRef.current = setInterval(() => {
      if (hoveredRef.current) return
      currentIdxRef.current = (currentIdxRef.current + 1) % levels.length
      setOpenId(levels[currentIdxRef.current].id)
    }, INTERVAL)
  }

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }

  useEffect(() => {
    startTimer()
    return () => stopTimer()
  }, [])

  return (
    <section
      id="services"
      className="relative py-24 px-6"
      style={{ background: 'linear-gradient(to bottom, #0a1e10 0%, #051209 100%)' }}
    >
      <div className="max-width-860 mx-auto" style={{ maxWidth: 860 }}>

        <div className="text-[10px] font-bold uppercase tracking-widest mb-4 flex items-center gap-2" style={{ color: '#c96442' }}>
          <span style={{ display: 'inline-block', width: 24, height: 2, background: '#c96442' }} />
          De groeiladder
        </div>

        <h2 className="font-black leading-none mb-2" style={{ fontSize: 'clamp(28px, 4vw, 44px)', letterSpacing: '-.03em', color: '#faf9f5' }}>
          Het juiste systeem<br />
          <span style={{ color: 'rgba(250,249,245,0.32)' }}>op het juiste moment,</span><br />
          dat betaalt zichzelf terug.
        </h2>

        <p className="mb-12 leading-relaxed" style={{ fontSize: 15, color: 'rgba(250,249,245,0.42)', maxWidth: 500 }}>
          Per niveau de acties met de hoogste ROI. De volgorde is geen voorkeur, het is fysica.
        </p>

        {/* Ladder */}
        <div style={{ borderTop: '1px solid rgba(250,249,245,0.06)' }}>
          {levels.map((l, idx) => {
            const isOpen = openId === l.id
            return (
              <div
                key={l.id}
                style={{ borderBottom: '1px solid rgba(250,249,245,0.06)' }}
                onMouseEnter={() => {
                  hoveredRef.current = true
                  currentIdxRef.current = idx
                  setOpenId(l.id)
                }}
                onMouseLeave={() => {
                  hoveredRef.current = false
                  startTimer()
                }}
              >
                <div style={{ display: 'flex', alignItems: 'stretch' }}>
                  {/* Left */}
                  <div style={{ width: 200, flexShrink: 0, padding: '20px 0', display: 'flex', alignItems: 'center', gap: 14 }}>
                    <span style={{ fontSize: 11, fontWeight: 800, color: isOpen ? l.color : 'rgba(250,249,245,0.18)', letterSpacing: '.04em', width: 24, flexShrink: 0, transition: 'color .15s' }}>
                      0{l.id}
                    </span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: isOpen ? '#faf9f5' : 'rgba(250,249,245,0.55)', letterSpacing: '-.01em', transition: 'color .15s' }}>
                      {l.name}
                    </span>
                  </div>

                  {/* Divider */}
                  <div style={{ width: 1, background: 'rgba(250,249,245,0.06)', flexShrink: 0, margin: '0 28px' }} />

                  {/* Right */}
                  <div style={{ flex: 1, padding: '20px 0', cursor: 'default' }}>
                    {/* Collapsed: keywords inline */}
                    {!isOpen && (
                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                        {l.keywords.map((k, i) => (
                          <span key={k}>
                            <span style={{ fontSize: 12, color: 'rgba(250,249,245,0.32)', fontWeight: 500 }}>{k}</span>
                            {i < l.keywords.length - 1 && <span style={{ fontSize: 11, color: 'rgba(250,249,245,0.12)', marginLeft: 8 }}>·</span>}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Expanded */}
                    {isOpen && (
                      <div>
                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14 }}>
                          {l.keywords.map(k => (
                            <span key={k} style={{ fontSize: 11, fontWeight: 700, color: l.color, border: `1px solid ${l.color}`, padding: '4px 10px', letterSpacing: '.03em', opacity: .85 }}>
                              {k}
                            </span>
                          ))}
                        </div>
                        <p style={{ fontSize: 13.5, color: 'rgba(250,249,245,0.45)', lineHeight: 1.7, marginBottom: 18, fontStyle: 'italic' }}>
                          {l.oneliner}
                        </p>
                        <div style={{ display: 'flex', gap: 1 }}>
                          {['Brand positioneren', 'Leads onder de loep', 'Baseren op data'].map(f => (
                            <div key={f} style={{ flex: 1, padding: '11px 14px', background: 'rgba(250,249,245,0.03)', borderTop: `2px solid ${l.color}`, fontSize: 11, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', color: l.color, opacity: .7 }}>
                              {f}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* CTA */}
        <div style={{ marginTop: 48, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24, padding: '24px 28px', border: '1px solid rgba(201,100,66,0.2)', borderTop: '3px solid #c96442', flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.18em', textTransform: 'uppercase', color: '#c96442', marginBottom: 6 }}>Gratis rapport</div>
            <div style={{ fontSize: 20, fontWeight: 900, color: '#faf9f5', letterSpacing: '-.02em' }}>Krijg jouw gratis bedrijfsrapport en 14 dagen plan om je bedrijf te laten groeien.</div>
          </div>
          <a href="/diagnostic" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#c96442', color: '#fff', padding: '12px 22px', borderRadius: 3, fontSize: 13, fontWeight: 700, textDecoration: 'none', letterSpacing: '.02em', whiteSpace: 'nowrap' }}>
            Start gratis &rarr;
          </a>
        </div>

      </div>
    </section>
  )
}
