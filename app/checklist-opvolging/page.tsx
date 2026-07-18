'use client'

import { useEffect } from 'react'
import { LogoMark } from '@/components/ui/logo-mark'
import { FreebieOptinForm } from '@/components/freebie-optin-form'

const SIGNALS = [
  'Je weet niet hoelang een lead moet wachten op een eerste reactie',
  'Leads die niet meteen reageren, verdwijnen stilletjes',
  'Je opvolging hangt volledig van jouw geheugen af',
  'Je reageert \'s avonds of in het weekend later dan doordeweeks',
  'Je hebt geen idee hoeveel leads vorige maand geen antwoord kregen',
]

export default function ChecklistOpvolgingPage() {
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'ViewContent', { content_name: 'checklist-opvolging' })
    }
  }, [])

  return (
    <div style={{ background: '#faf9f5', color: '#3d3929', fontFamily: 'var(--font-sans)', minHeight: '100vh' }}>
      <nav
        className="sticky top-0 z-50 flex items-center justify-between px-6 py-4"
        style={{ background: 'rgba(250,249,245,0.92)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(61,57,41,0.08)' }}
      >
        <LogoMark size={26} />
      </nav>

      <section
        className="relative px-6 py-20 sm:py-28 flex flex-col items-center text-center overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #0a1e10 0%, #163320 60%, #0a1e10 100%)' }}
      >
        <div
          className="relative z-10 inline-block text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-8"
          style={{ color: '#c96442', background: 'rgba(201,100,66,0.12)', border: '1px solid rgba(201,100,66,0.25)' }}
        >
          Gratis checklist · Geen betaling
        </div>

        <h1
          className="relative z-10 leading-tight mb-5 max-w-2xl"
          style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(28px, 5vw, 52px)', fontWeight: 400, color: '#faf9f5' }}
        >
          5 signalen dat je <em style={{ color: '#c96442' }}>opvolging lekt</em>
        </h1>

        <p
          className="relative z-10 text-base sm:text-lg leading-relaxed mb-10 max-w-lg"
          style={{ color: 'rgba(250,249,245,0.6)' }}
        >
          Vijf vragen die in twee minuten laten zien waar je leads verdwijnen, voor je het zelf doorhebt.
        </p>

        <div className="relative z-10 w-full">
          <FreebieOptinForm freebie="checklist-opvolging" />
        </div>
      </section>

      <section className="px-6 py-20 max-w-2xl mx-auto">
        <div className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: '#c96442' }}>Wat je krijgt</div>
        <h2 className="text-2xl font-semibold mb-8 leading-tight" style={{ fontFamily: 'var(--font-serif)', fontWeight: 400 }}>
          De 5 signalen op een rij
        </h2>
        <div className="flex flex-col gap-3">
          {SIGNALS.map((s, i) => (
            <div key={s} className="flex items-start gap-4 p-4 rounded-xl" style={{ background: '#f5f3ee', border: '1px solid rgba(61,57,41,0.08)' }}>
              <span className="font-semibold flex-shrink-0" style={{ fontFamily: 'var(--font-serif)', color: '#c96442' }}>{i + 1}</span>
              <span className="text-sm leading-relaxed" style={{ color: '#535146' }}>{s}</span>
            </div>
          ))}
        </div>
      </section>

      <footer className="py-8 text-center text-xs" style={{ background: '#051209', color: 'rgba(250,249,245,0.3)' }}>
        © {new Date().getFullYear()} Lead it, Grow · leaditgrow.be
      </footer>
    </div>
  )
}
