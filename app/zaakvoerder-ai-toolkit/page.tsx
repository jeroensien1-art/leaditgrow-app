'use client'

import { useEffect } from 'react'
import { ArrowRight, CheckCircle2, Zap, MessageSquare, Sparkles, FlaskConical } from 'lucide-react'
import { LogoMark } from '@/components/ui/logo-mark'

// ── STRIPE PAYMENT LINK ──────────────────────────────────────────────────────
// TODO: vervang door de echte Stripe Payment Link voor dit product (€17)
const STRIPE_PAYMENT_LINK = 'https://buy.stripe.com/TODO_ZAAKVOERDER_AI_TOOLKIT'
// ────────────────────────────────────────────────────────────────────────────

const BLOKS = [
  { icon: MessageSquare, title: 'Plak je transcript', desc: 'Een salesgesprek, klantmeeting of klacht — geen opmaak nodig, rommelige notities werken net zo goed.' },
  { icon: Zap,           title: 'De AI doet het denkwerk', desc: 'Bezwaren eruit halen, actiepunten trekken, een offerte bouwen. Niet enkel herschrijven, het echte werk.' },
  { icon: Sparkles,      title: 'Eenmalig je context instellen', desc: 'De AI ondervraagt jou over je bedrijf — geen sjabloon met haakjes die je zelf moet invullen.' },
]

const INCLUDES = [
  'Intake-interview: de AI stelt de vragen, bouwt je bedrijfscontext op',
  'Sales-transcript → bezwaren + antwoordstrategie',
  'Meeting-notities → actiepunten en risico\'s',
  'Offerte-generator op basis van een gesprek',
  'Klacht-transcript → antwoordstrategie',
  'Volledige uitleg: Claude Skills, MCP en Connections instellen',
  'Werkt met Claude, ChatGPT en Gemini',
  'PDF, direct beschikbaar na aankoop',
]

export default function ZaakvoerderAiToolkitPage() {
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'ViewContent', { content_name: 'zaakvoerder-ai-toolkit' })
    }
  }, [])

  return (
    <div style={{ background: '#faf9f5', color: '#3d3929', fontFamily: 'var(--font-sans)', minHeight: '100vh' }}>

      {/* NAV */}
      <nav
        className="sticky top-0 z-50 flex items-center justify-between px-6 py-4"
        style={{ background: 'rgba(250,249,245,0.92)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(61,57,41,0.08)' }}
      >
        <LogoMark size={26} />
        <a
          href={STRIPE_PAYMENT_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white transition-all hover:opacity-90"
          style={{ background: '#c96442', boxShadow: '0 4px 16px rgba(201,100,66,0.3)' }}
        >
          Koop nu · €17
        </a>
      </nav>

      {/* ── HERO ── */}
      <section
        className="relative px-6 py-20 sm:py-28 flex flex-col items-center text-center overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #0a1e10 0%, #163320 60%, #0a1e10 100%)' }}
      >
        <div className="absolute" style={{ top: '-80px', right: '-80px', width: '480px', height: '480px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(201,100,66,0.12) 0%, transparent 65%)', pointerEvents: 'none' }} />

        <div
          className="relative z-10 inline-block text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-8"
          style={{ color: '#c96442', background: 'rgba(201,100,66,0.12)', border: '1px solid rgba(201,100,66,0.25)' }}
        >
          De Zaakvoerder AI Toolkit · €17 · Directe toegang
        </div>

        <h1
          className="relative z-10 leading-tight mb-5 max-w-3xl"
          style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(32px, 5.5vw, 64px)', fontWeight: 400, color: '#faf9f5' }}
        >
          Stop met prompts <em style={{ color: '#c96442' }}>zelf invullen</em>. Plak je transcript en laat de AI het werk doen.
        </h1>

        <p
          className="relative z-10 text-base sm:text-lg leading-relaxed mb-10 max-w-xl"
          style={{ color: 'rgba(250,249,245,0.6)' }}
        >
          Geen sjablonen met haakjes waar jij zelf het denkwerk al gedaan moet hebben. Plak een salesgesprek, meeting-notities of een klacht — de AI haalt er zelf de bezwaren, actiepunten en context uit.
        </p>

        <div className="relative z-10 flex flex-wrap gap-4 justify-center mb-4">
          <a
            href={STRIPE_PAYMENT_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-8 py-4 rounded-full text-base font-semibold text-white transition-all hover:opacity-90 hover:-translate-y-0.5"
            style={{ background: '#c96442', boxShadow: '0 8px 32px rgba(201,100,66,0.45)' }}
          >
            Download voor €17
            <ArrowRight className="w-5 h-5" />
          </a>
        </div>

        <p className="relative z-10 text-xs" style={{ color: 'rgba(250,249,245,0.3)' }}>
          Eenmalig €17 · Minder dan één uur administratie · 14 dagen niet-goed-geld-terug
        </p>

        {/* toolkit mockup */}
        <div
          className="relative z-10 mt-14 rounded-2xl overflow-hidden shadow-2xl"
          style={{
            width: 'min(300px, 85vw)',
            aspectRatio: '3/4',
            background: 'linear-gradient(160deg, #0f2a18 0%, #0a1e10 100%)',
            border: '1px solid rgba(201,100,66,0.2)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '2rem',
          }}
        >
          <div style={{ fontFamily: 'monospace', fontSize: '8px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(250,249,245,0.3)' }}>Lead it, Grow · 2026</div>
          <div>
            <div style={{ fontFamily: 'monospace', fontSize: '8px', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#c96442', marginBottom: '1rem' }}>Plak transcript · Claude · ChatGPT · Gemini</div>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(26px, 4vw, 38px)', fontWeight: 400, lineHeight: 0.95, color: '#faf9f5', letterSpacing: '-0.02em' }}>
              De<br /><em style={{ color: '#c96442' }}>Zaakvoerder</em><br />AI Toolkit
            </div>
          </div>
          <div style={{ fontFamily: 'monospace', fontSize: '8px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(250,249,245,0.25)' }}>Digitaal Werkpakket · €17</div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="px-6 py-12 border-b" style={{ borderColor: 'rgba(61,57,41,0.1)' }}>
        <div className="max-w-3xl mx-auto grid grid-cols-3 gap-6 text-center">
          {[
            { stat: '5', label: 'AI-gestuurde flows: intake, sales, meetings, offertes, klachten' },
            { stat: '10 min', label: 'om je bedrijfscontext één keer op te laten bouwen' },
            { stat: '€17', label: 'eenmalig, geen abonnement' },
          ].map(({ stat, label }) => (
            <div key={stat}>
              <div className="text-3xl sm:text-4xl font-semibold mb-1.5" style={{ color: '#c96442', fontFamily: 'var(--font-serif)' }}>{stat}</div>
              <div className="text-xs leading-relaxed" style={{ color: '#83827d' }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── WAT JE KRIJGT ── */}
      <section className="px-6 py-20 max-w-3xl mx-auto">
        <div className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: '#c96442' }}>Wat zit erin</div>
        <h2 className="text-2xl sm:text-3xl font-semibold mb-10 leading-tight" style={{ fontFamily: 'var(--font-serif)', fontWeight: 400 }}>
          Geen sjabloon invullen. De AI haalt het zelf uit je input.
        </h2>
        <div className="grid sm:grid-cols-3 gap-5 mb-12">
          {BLOKS.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="p-5 rounded-2xl" style={{ background: '#f5f3ee', border: '1px solid rgba(61,57,41,0.08)' }}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3" style={{ background: 'rgba(201,100,66,0.1)' }}>
                <Icon className="w-4 h-4" style={{ color: '#c96442' }} />
              </div>
              <div className="font-semibold text-sm mb-1.5">{title}</div>
              <div className="text-xs leading-relaxed" style={{ color: '#83827d' }}>{desc}</div>
            </div>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 gap-3">
          {INCLUDES.map((item) => (
            <div key={item} className="flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#c96442' }} />
              <span className="text-sm leading-relaxed" style={{ color: '#535146' }}>{item}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── QUOTE ── */}
      <section className="px-6 py-16" style={{ background: '#0a1e10' }}>
        <div className="max-w-2xl mx-auto text-center">
          <Sparkles className="w-7 h-7 mx-auto mb-5" style={{ color: '#c96442', opacity: 0.7 }} />
          <blockquote
            className="text-xl sm:text-2xl leading-relaxed mb-5"
            style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', color: 'rgba(250,249,245,0.85)' }}
          >
            "Het gereedschap is goed. Maar het echte werk moet de AI doen, niet jij."
          </blockquote>
          <div className="text-xs font-bold uppercase tracking-widest" style={{ color: '#c96442', fontFamily: 'monospace' }}>Jeroen · Lead it, Grow</div>
        </div>
      </section>

      {/* ── PRIMAIRE CTA ── */}
      <section className="px-6 py-24 flex flex-col items-center text-center">
        <div className="text-[10px] font-bold uppercase tracking-widest mb-4" style={{ color: '#c96442' }}>Klaar om te beginnen?</div>
        <h2 className="text-3xl sm:text-4xl font-semibold mb-4 max-w-xl leading-tight" style={{ fontFamily: 'var(--font-serif)', fontWeight: 400 }}>
          €17. Directe toegang. Vandaag nog bruikbaar.
        </h2>
        <p className="text-base mb-10 max-w-md leading-relaxed" style={{ color: '#83827d' }}>
          5 AI-gestuurde flows plus de volledige uitleg om je AI-assistent in te stellen. Plak een transcript, de AI doet de rest — geen haakjes zelf invullen.
        </p>
        <a
          href={STRIPE_PAYMENT_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-10 py-5 rounded-full text-lg font-semibold text-white transition-all hover:opacity-90 hover:-translate-y-0.5 mb-3"
          style={{ background: '#c96442', boxShadow: '0 12px 40px rgba(201,100,66,0.4)' }}
        >
          Download de Zaakvoerder AI Toolkit · €17
          <ArrowRight className="w-5 h-5" />
        </a>
        <p className="text-xs" style={{ color: '#b4b2a7' }}>PDF · Direct beschikbaar na betaling · 14 dagen niet-goed-geld-terug</p>
      </section>

      {/* ── VOLGENDE STAP (UPSELL) ── */}
      <section className="px-6 py-16" style={{ background: '#f5f3ee', borderTop: '1px solid rgba(61,57,41,0.08)', borderBottom: '1px solid rgba(61,57,41,0.08)' }}>
        <div className="max-w-2xl mx-auto text-center">
          <div className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: '#c96442' }}>Voor wie verder wil</div>
          <h3 className="text-xl sm:text-2xl font-semibold mb-4 leading-tight" style={{ fontFamily: 'var(--font-serif)', fontWeight: 400 }}>
            De toolkit lost je AI-antwoorden op. Het Actiehandboek lost je leadopvolging op.
          </h3>
          <p className="text-sm leading-relaxed mb-6 max-w-lg mx-auto" style={{ color: '#535146' }}>
            Andere kant van hetzelfde probleem: niet hoe je sneller schrijft, maar hoe je sneller reageert op elke nieuwe lead. Het Businessgroei Actiehandboek (€97) geeft je het volledige speed-to-lead-systeem en 30-dagenplan.
          </p>
          <a
            href="/actiehandboek"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold transition-all hover:opacity-90"
            style={{ background: '#3d3929', color: '#faf9f5' }}
          >
            Bekijk het Actiehandboek · €97
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </section>

      {/* ── GRATIS ANALYSE SECTIE ── */}
      <section
        id="analyse"
        className="px-6 py-20"
        style={{ background: 'linear-gradient(160deg, #f5f3ee 0%, #ede9de 100%)', borderTop: '1px solid rgba(61,57,41,0.1)' }}
      >
        <div className="max-w-2xl mx-auto">

          <div className="flex items-center gap-2 mb-5">
            <FlaskConical className="w-4 h-4" style={{ color: '#c96442' }} />
            <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#c96442' }}>
              Gratis · 3 minuten · Rapport in je mailbox
            </span>
          </div>

          <h2
            className="text-2xl sm:text-3xl font-semibold mb-4 leading-tight"
            style={{ fontFamily: 'var(--font-serif)', fontWeight: 400 }}
          >
            Los je grootste tijdslek op, niet alleen je AI-antwoorden.
          </h2>

          <p className="text-base leading-relaxed mb-8" style={{ color: '#535146' }}>
            Doe de gratis bedrijfsanalyse. In 3 minuten scan je de 7 groeihefbomen van je bedrijf, ontdek je waar jij de meeste winst laat liggen, en ontvang je een persoonlijk rapport direct in je mailbox. Gratis, geen verplichtingen.
          </p>

          <a
            href="/diagnostic"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full text-base font-semibold transition-all hover:opacity-90 hover:-translate-y-0.5"
            style={{ background: '#3d3929', color: '#faf9f5', boxShadow: '0 6px 24px rgba(61,57,41,0.2)' }}
          >
            Start de gratis analyse
            <ArrowRight className="w-5 h-5" />
          </a>

          <p className="mt-4 text-xs" style={{ color: '#83827d' }}>
            3 minuten · Geen creditcard · Rapport direct in je mailbox
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-8 text-center text-xs" style={{ background: '#051209', color: 'rgba(250,249,245,0.3)' }}>
        © {new Date().getFullYear()} Lead it, Grow · leaditgrow.be
      </footer>
    </div>
  )
}
