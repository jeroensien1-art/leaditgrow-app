'use client'

import { useState, useEffect, useRef } from 'react'
import { ArrowRight } from 'lucide-react'
import { GLSLHills } from '@/components/ui/glsl-hills'
import { LogoSVG } from '@/components/ui/logo-svg'
import { useLang } from '@/components/lang-context'

interface Phrase {
  nl: React.ReactNode
  en: React.ReactNode
}

const O = '#c96442'
const W = '#faf9f5'

const PHRASES: Phrase[] = [
  {
    nl: <><span style={{ color: O }}>Systemen</span>{' '}op autopilot</>,
    en: <><span style={{ color: O }}>Systems</span>{' '}on autopilot</>,
  },
  {
    nl: <><span style={{ color: W }}>Converteer meer </span><span style={{ color: O }}>leads</span></>,
    en: <><span style={{ color: W }}>Convert more </span><span style={{ color: O }}>leads</span></>,
  },
  {
    nl: <><span style={{ color: W }}>Voorspelbare </span><span style={{ color: O }}>groei</span></>,
    en: <><span style={{ color: W }}>Predictable </span><span style={{ color: O }}>growth</span></>,
  },
  {
    nl: <><span style={{ color: O }}>Groei</span><span style={{ color: W }}> in omzet</span></>,
    en: <><span style={{ color: O }}>Grow</span><span style={{ color: W }}> revenue</span></>,
  },
  {
    nl: <><span style={{ color: O }}>Groei</span><span style={{ color: W }}> in impact</span></>,
    en: <><span style={{ color: O }}>Grow</span><span style={{ color: W }}> impact</span></>,
  },
]

function CyclingWord() {
  const { lang } = useLang()
  const [idx, setIdx] = useState(0)
  const [visible, setVisible] = useState(true)
  const tidRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const id = setInterval(() => {
      setVisible(false)
      if (tidRef.current) clearTimeout(tidRef.current)
      tidRef.current = setTimeout(() => {
        setIdx(i => (i + 1) % PHRASES.length)
        setVisible(true)
      }, 360)
    }, 2800)
    return () => {
      clearInterval(id)
      if (tidRef.current) clearTimeout(tidRef.current)
    }
  }, [])

  return (
    <span
      style={{
        display: 'inline-block',
        color: '#faf9f5',
        fontStyle: 'italic',
        fontFamily: 'var(--font-serif)',
        transition: 'opacity 0.36s ease, transform 0.36s ease',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(10px)',
      }}
    >
      {lang === 'nl' ? PHRASES[idx].nl : PHRASES[idx].en}
    </span>
  )
}

export function Hero() {
  const { t } = useLang()

  return (
    <section
      id="home"
      className="relative flex flex-col items-center justify-center"
      style={{ background: '#0a1e10', height: '100svh', overflow: 'clip' }}
    >
      <GLSLHills />

      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to bottom, rgba(10,30,16,0.3) 0%, rgba(10,30,16,0.0) 40%, rgba(10,30,16,0.6) 100%)',
          zIndex: 2,
          pointerEvents: 'none',
        }}
      />

      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-3xl">
        <LogoSVG size={72} style={{ marginBottom: 24, opacity: 0.92 }} />

        <div
          className="inline-block text-[11px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-8"
          style={{ color: '#c96442', background: 'rgba(201,100,66,0.12)', border: '1px solid rgba(201,100,66,0.3)' }}
        >
          Lead it, Grow
        </div>

        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-semibold leading-tight mb-4" style={{ color: '#faf9f5' }}>
          <CyclingWord />
          <br />
          <span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 400 }}>
            {t('met één duidelijke roadmap', 'with one clear roadmap')}
          </span>
        </h1>

        <p className="text-lg sm:text-xl leading-relaxed mb-10 max-w-xl" style={{ color: 'rgba(250,249,245,0.7)' }}>
          {t(
            'Bouw een voorspelbare groeimotor die leads aanbrengt, converteert en jou tijd teruggeeft voor leiderschap, strategie, privéleven en creativiteit.',
            'Build a predictable growth engine that attracts, converts leads and gives you back time for leadership, strategy, private life and creativity.'
          )}
        </p>

        <div className="flex flex-wrap gap-4 justify-center">
          <a
            href="#services"
            className="flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold text-white transition-all hover:opacity-90 hover:-translate-y-0.5"
            style={{ background: '#c96442', boxShadow: '0 8px 32px rgba(201,100,66,0.4)' }}
          >
            {t('Bekijk het systeem', 'See the system')}
            <ArrowRight className="w-4 h-4" />
          </a>
          <a
            href="#contact"
            className="flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold transition-all hover:opacity-90 hover:-translate-y-0.5"
            style={{ color: '#faf9f5', background: 'rgba(250,249,245,0.1)', border: '1px solid rgba(250,249,245,0.2)', backdropFilter: 'blur(8px)' }}
          >
            {t('Plan een gesprek', 'Book a call')}
          </a>
        </div>

        <a
          href="/diagnostic"
          className="mt-5 text-sm transition-all hover:opacity-100"
          style={{ color: 'rgba(250,249,245,0.45)' }}
        >
          {t('Waar zit mijn grootste groeikans? → Gratis diagnose', 'Where is my biggest growth gap? → Free diagnostic')}
        </a>
      </div>


    </section>
  )
}
