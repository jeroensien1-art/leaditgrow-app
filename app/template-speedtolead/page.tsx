'use client'

import { useEffect } from 'react'
import { LogoMark } from '@/components/ui/logo-mark'
import { FreebieOptinForm } from '@/components/freebie-optin-form'

export default function TemplateSpeedToLeadPage() {
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'ViewContent', { content_name: 'template-speedtolead' })
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
          Gratis mini-template · Geen betaling
        </div>

        <h1
          className="relative z-10 leading-tight mb-5 max-w-2xl"
          style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(28px, 5vw, 52px)', fontWeight: 400, color: '#faf9f5' }}
        >
          De <em style={{ color: '#c96442' }}>speed-to-lead</em> e-mailtemplate
        </h1>

        <p
          className="relative z-10 text-base sm:text-lg leading-relaxed mb-10 max-w-lg"
          style={{ color: 'rgba(250,249,245,0.6)' }}
        >
          Eén kant-en-klare e-mail die je binnen twee minuten na een nieuwe lead kan versturen. Kopiëren, aanpassen, gebruiken.
        </p>

        <div className="relative z-10 w-full">
          <FreebieOptinForm freebie="template-speedtolead" />
        </div>
      </section>

      <section className="px-6 py-20 max-w-2xl mx-auto text-center">
        <p className="text-sm leading-relaxed" style={{ color: '#83827d' }}>
          Dit is het laatste gratis stuk voor een tijdje — er komt binnenkort iets nieuws specifiek voor hoe je AI inzet in je eigen administratie.
        </p>
      </section>

      <footer className="py-8 text-center text-xs" style={{ background: '#051209', color: 'rgba(250,249,245,0.3)' }}>
        © {new Date().getFullYear()} Lead it, Grow · leaditgrow.be
      </footer>
    </div>
  )
}
