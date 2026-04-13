'use client'

import Link from 'next/link'
import { ArrowRight, Zap, TrendingUp, BarChart2, BookOpen, Users, MessageCircle } from 'lucide-react'
import { Nav } from '@/components/nav'
import { useLang } from '@/components/lang-context'

type Service = {
  icon: React.ElementType
  tag: string
  title: string
  outcome: string
  description: string
  cta: string
  href: string
  accent: string
  bg: string
  border: string
  ctaStyle: string
  featured?: boolean
}

function useServices(nl: boolean): Service[] {
  return [
    {
      icon: BarChart2,
      tag: nl ? 'Gratis · 2 minuten' : 'Free · 2 minutes',
      title: nl ? 'Revenue Calculator' : 'Revenue Calculator',
      outcome: nl
        ? 'Ontdek hoeveel omzet je maandelijks misloopt door trage opvolging.'
        : 'Discover how much revenue you lose each month due to slow follow-up.',
      description: nl
        ? '4 vragen over je pipeline. Direct een concreet getal: wat kost jou trage reactiesnelheid en slechte follow-up per maand en per jaar.'
        : '4 questions about your pipeline. Instantly see your number: what slow response speed and weak follow-up costs you per month and per year.',
      cta: nl ? 'Bereken mijn verlies' : 'Calculate my leak',
      href: '/calculator',
      accent: '#c96442',
      bg: 'rgba(201,100,66,0.06)',
      border: 'rgba(201,100,66,0.15)',
      ctaStyle: 'ghost',
    },
    {
      icon: Zap,
      tag: nl ? 'Gratis · 4 minuten' : 'Free · 4 minutes',
      title: nl ? 'Gratis Bedrijfsdiagnose' : 'Free Business Diagnostic',
      outcome: nl
        ? 'Inzicht in welke van de 7 groeihefbomen in jouw bedrijf geblokkeerd zijn.'
        : 'Clarity on which of the 7 growth levers in your business are blocked.',
      description: nl
        ? 'De diagnose scant speed-to-lead, pipeline, leiderschap, retentie, marketing, systemen en team. Je krijgt een persoonlijk rapport met je top 3 prioriteiten. Geen verkoopsgesprek.'
        : 'The diagnostic scans speed-to-lead, pipeline, leadership, retention, marketing, systems and team. You get a personalised report with your top 3 priorities. No sales call.',
      cta: nl ? 'Start gratis diagnose' : 'Start free diagnostic',
      href: '/diagnostic',
      accent: '#15803d',
      bg: 'rgba(21,128,61,0.06)',
      border: 'rgba(21,128,61,0.15)',
      ctaStyle: 'solid-green',
      featured: true,
    },
    {
      icon: TrendingUp,
      tag: nl ? 'Betaald · Vanaf €600' : 'Paid · From €600',
      title: nl ? 'Speed-to-Lead Systeem' : 'Speed-to-Lead System',
      outcome: nl
        ? 'Behoud meer potentiële klanten doordat ze info of een afspraak krijgen terwijl jij aan iets anders werkt, of slaapt.'
        : 'Retain more potential clients because they get a response or booking while you are working on something else, or sleeping.',
      description: nl
        ? 'We bouwen een geautomatiseerd opvolgsysteem dat reageert op elke aanvraag, tijdssloten voorstelt en de lead warm houdt tot jij het gesprek overneemt. Inbegrepen: opzetkosten, copywriting en maandelijks onderhoud.'
        : 'We build an automated follow-up system that responds to every enquiry, proposes time slots and keeps the lead warm until you take over the conversation. Included: setup, copywriting and monthly maintenance.',
      cta: nl ? 'Plan een gesprek' : 'Book a call',
      href: '/#contact',
      accent: '#c96442',
      bg: 'rgba(201,100,66,0.06)',
      border: 'rgba(201,100,66,0.15)',
      ctaStyle: 'ghost',
    },
    {
      icon: TrendingUp,
      tag: nl ? 'Betaald · Vanaf €2.000' : 'Paid · From €2,000',
      title: nl ? 'Groeisysteem op Maat' : 'Custom Growth System',
      outcome: nl
        ? 'Een commercieel systeem dat leads aantrekt, opvolgt en converteert op autopilot, zodat jij je kan focussen op leveren.'
        : 'A commercial system that attracts, follows up and converts leads on autopilot, so you can focus on delivering.',
      description: nl
        ? 'Volledig op maat: lead capture, automatische opvolging, CRM-integratie, kwartaalrapportage en groeibegeleiding. Voor zaakvoerders die klaar zijn om hun bedrijf los te koppelen van hun persoonlijke aanwezigheid.'
        : 'Fully custom: lead capture, automated follow-up, CRM integration, quarterly reporting and growth coaching. For business owners ready to decouple their company from their personal presence.',
      cta: nl ? 'Plan een gesprek' : 'Book a call',
      href: '/#contact',
      accent: '#c96442',
      bg: 'rgba(201,100,66,0.06)',
      border: 'rgba(201,100,66,0.15)',
      ctaStyle: 'ghost',
    },
    {
      icon: BookOpen,
      tag: nl ? '€97 eenmalig' : '€97 one-time',
      title: nl ? 'Businessgroei Actiehandboek' : 'Business Growth Action Manual',
      outcome: nl
        ? 'Een 30-dagenplan om je groeisysteem te bouwen, stap voor stap, zonder agency.'
        : 'A 30-day plan to build your growth system, step by step, without an agency.',
      description: nl
        ? 'Het complete handboek voor zaakvoerders die zelf aan de slag willen. 7 groeihefbomen, praktische templates, swipe-files en een dagelijks actieplan. Inclusief de NL en EN versie.'
        : 'The complete manual for business owners who want to do it themselves. 7 growth levers, practical templates, swipe files and a daily action plan. Includes both NL and EN versions.',
      cta: nl ? 'Koop het handboek' : 'Get the manual',
      href: '/actiehandboek',
      accent: '#c96442',
      bg: 'rgba(201,100,66,0.06)',
      border: 'rgba(201,100,66,0.15)',
      ctaStyle: 'ghost',
    },
    {
      icon: Users,
      tag: nl ? 'Gratis via partnernetwerk' : 'Free via partner network',
      title: nl ? 'Leiderschapsanalyse' : 'Leadership Analysis',
      outcome: nl
        ? 'Ontdek jouw leiderschapsprofiel: sterktes, valkuilen, en hoe jij groei maakt of remt.'
        : 'Discover your leadership profile: strengths, blind spots, and how you enable or block growth.',
      description: nl
        ? '30 minuten online vragenlijst en 75 minuten diepgaand gesprek op jouw kantoor. Wetenschappelijk onderbouwde analyse door ervaren consultants. Beschikbaar voor zaakvoerders in de regio Antwerpen en Gent.'
        : '30-minute online questionnaire and a 75-minute in-depth conversation at your office. Scientifically grounded analysis by experienced consultants. Available for business owners in the Antwerp and Ghent area.',
      cta: nl ? 'Vraag de analyse aan' : 'Request the analysis',
      href: '/#contact',
      accent: '#535146',
      bg: 'rgba(83,81,70,0.06)',
      border: 'rgba(83,81,70,0.15)',
      ctaStyle: 'ghost-neutral',
    },
  ]
}

export default function DienstenPage() {
  const { lang } = useLang()
  const nl = lang === 'nl'
  const services = useServices(nl)

  return (
    <>
      <Nav />
      <main style={{ background: '#faf9f5', minHeight: '100vh', paddingTop: '6rem' }}>

        {/* ── HERO ── */}
        <div style={{ background: 'linear-gradient(160deg, #0a1e10 0%, #163320 100%)', padding: '4rem 1.5rem 5rem' }}>
          <div style={{ maxWidth: '760px', margin: '0 auto' }}>
            <div style={{ fontFamily: 'monospace', fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#c96442', marginBottom: '1rem' }}>
              {nl ? 'Diensten' : 'Services'}
            </div>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: 400, lineHeight: 1.15, color: '#faf9f5', margin: '0 0 1.25rem' }}>
              {nl
                ? <>Jouw business is een ketting.<br /><em style={{ color: 'rgba(250,249,245,0.6)' }}>Leer welk onderdeel jou het meeste omzet en energie kost, en vind de oplossing hier.</em></>
                : <>Your business is a chain.<br /><em style={{ color: 'rgba(250,249,245,0.6)' }}>Learn which link costs you the most revenue and energy, and find the solution here.</em></>
              }
            </h1>
            <p style={{ fontSize: '16px', color: 'rgba(250,249,245,0.5)', lineHeight: 1.7, maxWidth: '520px', margin: 0 }}>
              {nl
                ? 'Start gratis met de diagnose of calculator. Ga verder met wat past bij jouw fase.'
                : 'Start free with the diagnostic or calculator. Move forward with whatever fits your stage.'
              }
            </p>
          </div>
        </div>

        {/* ── WIDGET STRIP ── */}
        <div style={{ background: '#f3f1eb', borderBottom: '1px solid rgba(61,57,41,0.08)', padding: '1rem 1.5rem' }}>
          <div style={{ maxWidth: '760px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <span style={{ fontFamily: 'monospace', fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#83827d' }}>
              {nl ? 'Weet je niet waar te starten?' : "Don't know where to start?"}
            </span>
            <Link href="/calculator" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 600, color: '#c96442', textDecoration: 'none' }}>
              {nl ? 'Bereken je omzetverlies' : 'Calculate your revenue leak'} <ArrowRight size={12} />
            </Link>
            <span style={{ color: 'rgba(61,57,41,0.2)', fontSize: '12px' }}>{nl ? 'of' : 'or'}</span>
            <Link href="/diagnostic" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 600, color: '#15803d', textDecoration: 'none' }}>
              {nl ? 'Start de gratis diagnose' : 'Start the free diagnostic'} <ArrowRight size={12} />
            </Link>
          </div>
        </div>

        {/* ── SERVICE GRID ── */}
        <div style={{ maxWidth: '760px', margin: '0 auto', padding: '3.5rem 1.5rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {services.map((s) => {
              const Icon = s.icon
              return (
                <div
                  key={s.title}
                  style={{
                    background: s.featured ? '#0a1e10' : '#fff',
                    border: `1px solid ${s.featured ? 'transparent' : s.border}`,
                    borderRadius: '16px',
                    padding: '2rem',
                    boxShadow: s.featured ? '0 8px 32px rgba(10,30,16,0.15)' : '0 2px 8px rgba(0,0,0,0.04)',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  {s.featured && (
                    <div style={{ position: 'absolute', top: '1rem', right: '1rem', fontFamily: 'monospace', fontSize: '9px', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#c96442', background: 'rgba(201,100,66,0.15)', padding: '3px 8px', borderRadius: '999px', border: '1px solid rgba(201,100,66,0.25)' }}>
                      {nl ? 'Aanbevolen start' : 'Recommended start'}
                    </div>
                  )}

                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: s.featured ? 'rgba(201,100,66,0.15)' : s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon size={18} color={s.featured ? '#c96442' : s.accent} />
                    </div>

                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: 'monospace', fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase', color: s.featured ? 'rgba(250,249,245,0.4)' : '#83827d', marginBottom: '4px' }}>
                        {s.tag}
                      </div>
                      <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(20px, 3vw, 26px)', fontWeight: 400, color: s.featured ? '#faf9f5' : '#0a1e10', margin: '0 0 0.5rem', lineHeight: 1.2 }}>
                        {s.title}
                      </h2>
                      <p style={{ fontSize: '15px', fontWeight: 600, color: s.featured ? '#c96442' : s.accent, margin: '0 0 0.75rem', lineHeight: 1.4 }}>
                        {s.outcome}
                      </p>
                      <p style={{ fontSize: '14px', color: s.featured ? 'rgba(250,249,245,0.55)' : '#83827d', margin: '0 0 1.25rem', lineHeight: 1.65 }}>
                        {s.description}
                      </p>

                      <Link
                        href={s.href}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '11px 20px',
                          borderRadius: '999px',
                          fontSize: '13px',
                          fontWeight: 600,
                          textDecoration: 'none',
                          ...(s.ctaStyle === 'solid-green'
                            ? { background: '#15803d', color: '#fff', boxShadow: '0 4px 16px rgba(21,128,61,0.35)' }
                            : s.ctaStyle === 'ghost-neutral'
                            ? { background: 'transparent', color: '#535146', border: '1px solid rgba(61,57,41,0.2)' }
                            : s.featured
                            ? { background: 'rgba(201,100,66,0.15)', color: '#c96442', border: '1px solid rgba(201,100,66,0.3)' }
                            : { background: 'transparent', color: s.accent, border: `1px solid ${s.border}` }),
                        }}
                      >
                        {s.cta} <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* ── NOT SURE WIDGET ── */}
          <div style={{ marginTop: '3rem', padding: '2rem', borderRadius: '16px', background: '#f3f1eb', border: '1px solid rgba(61,57,41,0.08)', display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(201,100,66,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <MessageCircle size={16} color="#c96442" />
            </div>
            <div>
              <p style={{ fontSize: '15px', fontWeight: 600, color: '#0a1e10', margin: '0 0 0.25rem' }}>
                {nl ? 'Niet zeker welke dienst past?' : 'Not sure which service fits?'}
              </p>
              <p style={{ fontSize: '14px', color: '#83827d', margin: '0 0 1rem', lineHeight: 1.6 }}>
                {nl
                  ? 'Start met de gratis diagnose. Die brengt in 4 minuten in kaart waar jouw bedrijf staat en welke dienst de meeste impact heeft voor jouw fase.'
                  : 'Start with the free diagnostic. In 4 minutes it maps where your business stands and which service has the most impact for your stage.'
                }
              </p>
              <Link
                href="/diagnostic"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 18px', borderRadius: '999px', background: '#c96442', color: '#fff', fontSize: '13px', fontWeight: 600, textDecoration: 'none', boxShadow: '0 4px 16px rgba(201,100,66,0.3)' }}
              >
                {nl ? 'Start gratis diagnose' : 'Start free diagnostic'} <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </main>

      <footer className="py-8 text-center text-xs" style={{ background: '#051209', color: 'rgba(250,249,245,0.3)' }}>
        © {new Date().getFullYear()} Lead it, Grow · leaditgrow.com · leaditgrow.be
      </footer>
    </>
  )
}
