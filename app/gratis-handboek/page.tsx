'use client'

import { useEffect } from 'react'
import { ArrowRight, CheckCircle2, BookOpen, Zap, TrendingUp, FlaskConical } from 'lucide-react'
import { LogoMark } from '@/components/ui/logo-mark'

// ── STRIPE PAYMENT LINK ──────────────────────────────────────────────────────
// Maak aan via stripe.com → Products → Payment Links → €97
const STRIPE_PAYMENT_LINK = 'https://buy.stripe.com/REPLACE_WITH_YOUR_LINK'
// ────────────────────────────────────────────────────────────────────────────

const LEVERS = [
  { icon: Zap,        title: 'De 5-minutenregel', desc: 'Verhoog je sluitingskans 21× door binnen 5 minuten te reageren op elke lead.' },
  { icon: TrendingUp, title: 'Pipeline follow-up', desc: '5-staps opvolgsequentie die stille leads terugwint, zonder opdringerig te klinken.' },
  { icon: BookOpen,   title: '30-dagenplan + scripts', desc: 'Week-voor-week acties en kopieerbare scripts. Klaar om maandag te beginnen.' },
]

const INCLUDES = [
  '7-hefboom diagnose: scoor jezelf voor je begint',
  'Volledige scripts voor elke opvolgstap',
  '30-dagenplan met week-voor-week acties',
  'Bewezen GTM-kader voor servicebedrijven',
  'Droomklantenlijst template',
  'Revenue leak calculator',
]

export default function GratisHandboekPage() {
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'ViewContent', { content_name: 'gratis-handboek' })
    }
  }, [])

  return (
    <div style={{ background: '#faf9f5', color: '#3d3929', fontFamily: 'var(--font-sans)', minHeight: '100vh' }}>

      {/* NAV — logo + directe koop-knop */}
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
          Koop nu · €97
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
          Actiehandboek · €97 · Directe toegang
        </div>

        <h1
          className="relative z-10 leading-tight mb-5 max-w-3xl"
          style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(32px, 5.5vw, 64px)', fontWeight: 400, color: '#faf9f5' }}
        >
          Stop met leads mislopen.<br />
          <em style={{ color: '#c96442' }}>Begin maandag</em> met een systeem dat werkt.
        </h1>

        <p
          className="relative z-10 text-base sm:text-lg leading-relaxed mb-10 max-w-xl"
          style={{ color: 'rgba(250,249,245,0.6)' }}
        >
          Het exacte kader, de scripts en het 30-dagenplan om de speed-to-lead kloof te dichten en gemiste leads om te zetten in voorspelbare omzet.
        </p>

        <div className="relative z-10 flex flex-wrap gap-4 justify-center mb-4">
          <a
            href={STRIPE_PAYMENT_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-8 py-4 rounded-full text-base font-semibold text-white transition-all hover:opacity-90 hover:-translate-y-0.5"
            style={{ background: '#c96442', boxShadow: '0 8px 32px rgba(201,100,66,0.45)' }}
          >
            Download voor €97
            <ArrowRight className="w-5 h-5" />
          </a>
          <a
            href="#analyse"
            className="flex items-center gap-2 px-8 py-4 rounded-full text-base font-semibold transition-all hover:opacity-90"
            style={{ color: '#faf9f5', background: 'rgba(250,249,245,0.08)', border: '1px solid rgba(250,249,245,0.18)' }}
          >
            Eerst de gratis test
          </a>
        </div>

        <p className="relative z-10 text-xs" style={{ color: 'rgba(250,249,245,0.3)' }}>
          14 dagen terugbetalingsgarantie · PDF · Direct beschikbaar na betaling
        </p>

        {/* ebook mockup */}
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
          <div style={{ fontFamily: 'monospace', fontSize: '8px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(250,249,245,0.3)' }}>Lead it, Grow · Editie 2026</div>
          <div>
            <div style={{ fontFamily: 'monospace', fontSize: '8px', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#c96442', marginBottom: '1rem' }}>Meer leads · Op autopilot · 30-dagenplan</div>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(26px, 4vw, 38px)', fontWeight: 400, lineHeight: 0.95, color: '#faf9f5', letterSpacing: '-0.02em' }}>
              Het<br /><em style={{ color: '#c96442' }}>Businessgroei</em><br />Actiehandboek
            </div>
          </div>
          <div style={{ fontFamily: 'monospace', fontSize: '8px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(250,249,245,0.25)' }}>7-Hefboom Diagnose · GTM-kader · Scripts</div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="px-6 py-12 border-b" style={{ borderColor: 'rgba(61,57,41,0.1)' }}>
        <div className="max-w-3xl mx-auto grid grid-cols-3 gap-6 text-center">
          {[
            { stat: '21×', label: 'hogere sluitingskans bij reactie binnen 5 min' },
            { stat: '80%', label: 'van deals gaan naar de verkoper die het eerst reageert' },
            { stat: '30 dgn', label: 'om een volledig leadsysteem op te bouwen' },
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
          3 hefbomen die direct verschil maken.
        </h2>
        <div className="grid sm:grid-cols-3 gap-5 mb-12">
          {LEVERS.map(({ icon: Icon, title, desc }) => (
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
          <BookOpen className="w-7 h-7 mx-auto mb-5" style={{ color: '#c96442', opacity: 0.7 }} />
          <blockquote
            className="text-xl sm:text-2xl leading-relaxed mb-5"
            style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', color: 'rgba(250,249,245,0.85)' }}
          >
            "Dit handboek gaat niet over werken. Het gaat over systemen bouwen die werken terwijl jij dat niet doet."
          </blockquote>
          <div className="text-xs font-bold uppercase tracking-widest" style={{ color: '#c96442', fontFamily: 'monospace' }}>Jeroen · Lead it, Grow</div>
        </div>
      </section>

      {/* ── PRIMAIRE CTA ── */}
      <section className="px-6 py-24 flex flex-col items-center text-center">
        <div className="text-[10px] font-bold uppercase tracking-widest mb-4" style={{ color: '#c96442' }}>Klaar om te beginnen?</div>
        <h2 className="text-3xl sm:text-4xl font-semibold mb-4 max-w-xl leading-tight" style={{ fontFamily: 'var(--font-serif)', fontWeight: 400 }}>
          €97. Directe toegang. 30 dagen resultaat.
        </h2>
        <p className="text-base mb-10 max-w-md leading-relaxed" style={{ color: '#83827d' }}>
          Inclusief alle scripts, het 30-dagenplan en het GTM-kader. Als het niks oplevert binnen 14 dagen, krijg je je geld terug.
        </p>
        <a
          href={STRIPE_PAYMENT_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-10 py-5 rounded-full text-lg font-semibold text-white transition-all hover:opacity-90 hover:-translate-y-0.5 mb-3"
          style={{ background: '#c96442', boxShadow: '0 12px 40px rgba(201,100,66,0.4)' }}
        >
          Download het Actiehandboek · €97
          <ArrowRight className="w-5 h-5" />
        </a>
        <p className="text-xs" style={{ color: '#b4b2a7' }}>14 dagen terugbetalingsgarantie · PDF · Direct beschikbaar</p>
      </section>

      {/* ── GRATIS ANALYSE SECTIE ── */}
      <section
        id="analyse"
        className="px-6 py-20"
        style={{ background: 'linear-gradient(160deg, #f5f3ee 0%, #ede9de 100%)', borderTop: '1px solid rgba(61,57,41,0.1)' }}
      >
        <div className="max-w-2xl mx-auto">

          {/* Label */}
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
            Heb ik dit handboek nodig — en waarom?
          </h2>

          <p className="text-base leading-relaxed mb-8" style={{ color: '#535146' }}>
            Doe de gratis bedrijfsanalyse. In 3 minuten scan je de 7 groeihefbomen van je bedrijf, ontdek je waar jij de meeste winst laat liggen, en ontvang je een persoonlijk rapport met je grootste aandachtspunten direct in je mailbox. Gratis, geen verplichtingen.
          </p>

          {/* Voordelen van de test */}
          <div className="grid sm:grid-cols-3 gap-4 mb-8">
            {[
              { title: 'Weet precies waar je staat', desc: 'Score jezelf op de 7 hefbomen die bepalen of jouw bedrijf groeit of vastloopt.' },
              { title: 'Ontdek je #1 lek', desc: 'Één aandachtspunt levert voor de meeste ondernemers direct 20–30% meer resultaat.' },
              { title: 'Rapport in je mailbox', desc: 'Persoonlijk rapport met concrete vervolgstappen, gebaseerd op jouw antwoorden.' },
            ].map(({ title, desc }) => (
              <div key={title} className="p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.6)', border: '1px solid rgba(61,57,41,0.08)' }}>
                <div className="font-semibold text-sm mb-1.5">{title}</div>
                <div className="text-xs leading-relaxed" style={{ color: '#83827d' }}>{desc}</div>
              </div>
            ))}
          </div>

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
