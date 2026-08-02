'use client'

import { useEffect } from 'react'
import { LogoMark } from '@/components/ui/logo-mark'
import { FreebieOptinForm } from '@/components/freebie-optin-form'

const STAPPEN = [
  'Leg beslissingsdrempels vast: wat beslist je team zelf, en tot welk bedrag',
  'Schrijf je drie meest gestelde vragen uit voor je vertrekt',
  'Spreek één noodkanaal af, en wat een écht noodgeval is',
  'Noteer elke storing tijdens je afwezigheid als data: elk brandje wijst naar een ontbrekend systeem',
  'Bonus: de AI-prompt die de hele voorbereiding voor je klaarzet in ChatGPT of Claude',
]

export default function VakantietestPage() {
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'ViewContent', { content_name: 'vakantietest' })
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
          Gratis handleiding + AI-prompt
        </div>

        <h1
          className="relative z-10 leading-tight mb-5 max-w-2xl"
          style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(28px, 5vw, 52px)', fontWeight: 400, color: '#faf9f5' }}
        >
          Kan jouw zaak <em style={{ color: '#c96442' }}>twee weken zonder jou</em>?
        </h1>

        <p
          className="relative z-10 text-base sm:text-lg leading-relaxed mb-10 max-w-lg"
          style={{ color: 'rgba(250,249,245,0.6)' }}
        >
          De vakantietest: gebruik je vakantie als bedrijfstest. Vier stappen om voor te bereiden, plus de AI-prompt die alles voor je klaarzet.
        </p>

        <div className="relative z-10 w-full">
          <FreebieOptinForm freebie="vakantietest" />
        </div>
      </section>

      <section className="px-6 py-20 max-w-2xl mx-auto">
        <div className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: '#c96442' }}>Wat je krijgt</div>
        <h2 className="text-2xl font-semibold mb-8 leading-tight" style={{ fontFamily: 'var(--font-serif)', fontWeight: 400 }}>
          De vakantietest in vijf onderdelen
        </h2>
        <div className="flex flex-col gap-3">
          {STAPPEN.map((s, i) => (
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
