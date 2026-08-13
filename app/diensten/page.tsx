'use client'

import Link from 'next/link'
import { ArrowRight, Zap, TrendingUp, BarChart2, BookOpen, Users, MessageCircle, FlaskConical } from 'lucide-react'
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
        ? 'De diagnose scant speed-to-lead, pipeline, leiderschap, retentie, marketing, systemen en team. Je krijgt een persoonlijk rapport met je top 3 prioriteiten.'
        : 'The diagnostic scans speed-to-lead, pipeline, leadership, retention, marketing, systems and team. You get a personalised report with your top 3 priorities.',
      cta: nl ? 'Start gratis diagnose' : 'Start free diagnostic',
      href: '/diagnostic',
      accent: '#15803d',
      bg: 'rgba(21,128,61,0.06)',
      border: 'rgba(21,128,61,0.15)',
      ctaStyle: 'solid-green',
      featured: true,
    },
    {
      icon: FlaskConical,
      tag: nl ? 'Betaald · €297 eenmalig' : 'Paid · €297 one-time',
      title: nl ? 'De Markttest' : 'The Market Test',
      outcome: nl
        ? 'Weet binnen 14 dagen welke boodschap jouw klanten doet klikken, vóór je budget aan campagnes geeft.'
        : 'Know within 14 days which message makes your customers click, before you spend budget on campaigns.',
      description: nl
        ? 'We testen 9 varianten van jouw verhaal met een klein advertentiebudget op Facebook en Instagram (testbudget inbegrepen). Je krijgt een rapport met de winnende boodschap en waar je ze meteen inzet. Volledig verrekend bij een vervolgtraject.'
        : 'We test 9 versions of your story with a small ad budget on Facebook and Instagram (test budget included). You get a report with the winning message and where to use it right away. Fully credited towards any follow-up project.',
      cta: nl ? 'Bekijk de Markttest' : 'See the Market Test',
      href: '/markttest',
      accent: '#c96442',
      bg: 'rgba(201,100,66,0.06)',
      border: 'rgba(201,100,66,0.15)',
      ctaStyle: 'ghost',
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

const INK = '#0e0d0b'
const BG = '#f2f0eb'
const BG2 = '#eae8e2'
const ORNG = '#c96442'
const GRN = '#1a5e35'
const LIME = '#4ade80'
const MUT = '#787068'
const D = 'var(--font-display, var(--font-brutalist, system-ui))'
const B = 'var(--font-brutalist, system-ui)'
const M = 'var(--font-mono-brutalist, monospace)'

const css = `
  .dn-main { background: ${BG}; min-height: 100vh; }

  .dn-hero { background: ${INK}; color: ${BG}; border-bottom: 3px solid ${INK}; padding: 84px 44px 72px; }
  .dn-wrap { max-width: 1180px; margin: 0 auto; }
  .dn-kicker { font-family: ${M}; font-size: 12px; font-weight: 700; letter-spacing: .2em;
               text-transform: uppercase; color: ${ORNG}; margin-bottom: 20px; }
  .dn-hero h1 { font-family: ${D}; font-weight: 700; font-size: clamp(38px, 6vw, 86px); line-height: .94;
                letter-spacing: -.018em; text-transform: uppercase; max-width: 15ch; margin: 0; }
  .dn-hero h1 span { color: ${ORNG}; }
  .dn-hero p { font-family: ${B}; font-size: 18px; line-height: 1.6; color: rgba(242,240,235,.55);
               max-width: 50ch; margin: 26px 0 0; }

  .dn-strip { background: ${BG2}; border-bottom: 3px solid ${INK}; padding: 18px 44px; }
  .dn-strip-in { max-width: 1180px; margin: 0 auto; display: flex; align-items: center; gap: 20px; flex-wrap: wrap; }
  .dn-strip-lbl { font-family: ${M}; font-size: 11px; font-weight: 700; letter-spacing: .16em;
                  text-transform: uppercase; color: ${MUT}; }
  .dn-strip a { font-family: ${B}; font-size: 14px; font-weight: 700; letter-spacing: .06em;
                text-transform: uppercase; text-decoration: none; display: inline-flex; align-items: center; gap: 7px; }
  .dn-strip a:hover { text-decoration: underline; }
  .dn-strip-sep { font-family: ${M}; font-size: 12px; color: ${MUT}; }

  .dn-list { max-width: 1180px; margin: 0 auto; padding: 64px 44px 96px; }
  .dn-svc { display: grid; grid-template-columns: 56px 1fr; gap: 24px; align-items: start;
            border: 3px solid ${INK}; padding: 32px 30px; margin-bottom: -3px; position: relative;
            background: transparent; transition: background .18s; }
  .dn-svc:hover { background: ${BG2}; }
  .dn-svc.feat { background: ${INK}; color: ${BG}; }
  .dn-svc.feat:hover { background: ${INK}; }
  .dn-ico { width: 44px; height: 44px; border: 2px solid ${INK}; display: flex; align-items: center;
            justify-content: center; flex-shrink: 0; }
  .dn-svc.feat .dn-ico { border-color: ${LIME}; }
  .dn-badge { position: absolute; top: 0; right: 0; font-family: ${M}; font-size: 10px; font-weight: 700;
              letter-spacing: .14em; text-transform: uppercase; background: ${LIME}; color: ${INK}; padding: 6px 12px; }
  .dn-tag { font-family: ${M}; font-size: 11px; font-weight: 700; letter-spacing: .14em;
            text-transform: uppercase; color: ${MUT}; margin-bottom: 10px; }
  .dn-svc.feat .dn-tag { color: rgba(242,240,235,.45); }
  .dn-svc h2 { font-family: ${D}; font-weight: 700; font-size: clamp(24px, 3vw, 38px); line-height: 1.02;
               letter-spacing: -.015em; text-transform: uppercase; margin: 0 0 12px; color: ${INK}; }
  .dn-svc.feat h2 { color: ${BG}; }
  .dn-out { font-family: ${B}; font-size: 17px; font-weight: 600; line-height: 1.5; margin: 0 0 12px; max-width: 62ch; }
  .dn-desc { font-family: ${B}; font-size: 16px; line-height: 1.7; color: ${MUT}; margin: 0 0 22px; max-width: 68ch; }
  .dn-svc.feat .dn-desc { color: rgba(242,240,235,.6); }

  .dn-cta { display: inline-flex; align-items: center; gap: 9px; font-family: ${B}; font-size: 13px;
            font-weight: 700; letter-spacing: .1em; text-transform: uppercase; padding: 15px 26px;
            text-decoration: none; border: 2px solid ${INK}; color: ${INK}; background: transparent;
            transition: background .15s, color .15s, border-color .15s; }
  .dn-cta:hover { background: ${INK}; color: ${BG}; }
  .dn-cta.green { background: ${LIME}; border-color: ${LIME}; color: ${INK}; }
  .dn-cta.green:hover { background: #fff; border-color: #fff; }
  .dn-svc.feat .dn-cta { border-color: ${BG}; color: ${BG}; }
  .dn-svc.feat .dn-cta:hover { background: ${BG}; color: ${INK}; }

  .dn-help { border: 3px solid ${INK}; background: ${INK}; color: ${BG}; padding: 40px; margin-top: 52px; }
  .dn-help-k { font-family: ${M}; font-size: 11px; font-weight: 700; letter-spacing: .18em;
               text-transform: uppercase; color: ${LIME}; margin-bottom: 14px; }
  .dn-help h3 { font-family: ${D}; font-weight: 700; font-size: clamp(24px, 3vw, 40px); line-height: 1.02;
                letter-spacing: -.02em; text-transform: uppercase; margin: 0 0 14px; max-width: 20ch; }
  .dn-help p { font-family: ${B}; font-size: 16px; line-height: 1.7; color: rgba(242,240,235,.6);
               margin: 0 0 24px; max-width: 60ch; }

  .dn-foot { background: ${INK}; border-top: 3px solid ${INK}; padding: 28px 44px; display: flex;
             align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; }
  .dn-foot span { font-family: ${M}; font-size: 11px; letter-spacing: .1em; color: rgba(242,240,235,.25); }
  .dn-foot b { font-family: ${M}; font-size: 11px; font-weight: 700; letter-spacing: .1em;
               text-transform: uppercase; color: rgba(242,240,235,.35); }

  @media (max-width: 900px) {
    .dn-hero { padding: 48px 20px 44px; }
    .dn-strip { padding: 14px 20px; }
    .dn-list { padding: 40px 20px 64px; }
    .dn-svc { grid-template-columns: 1fr; gap: 16px; padding: 26px 20px; }
    .dn-help { padding: 26px 22px; }
    .dn-foot { padding: 22px 20px; }
  }
`

export default function DienstenPage() {
  const { lang } = useLang()
  const nl = lang === 'nl'
  const services = useServices(nl)

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <Nav />
      <main className="dn-main">

        {/* ── HERO ── */}
        <div className="dn-hero">
          <div className="dn-wrap">
            <div className="dn-kicker">{nl ? 'Diensten' : 'Services'}</div>
            <h1>
              {nl
                ? <>Jouw business<br />is een <span>ketting.</span></>
                : <>Your business<br />is a <span>chain.</span></>}
            </h1>
            <p>
              {nl
                ? 'Leer welk onderdeel jou het meeste omzet en energie kost, en vind de oplossing hier. Start gratis met de diagnose of de calculator, ga verder met wat past bij jouw fase.'
                : 'Learn which link costs you the most revenue and energy, and find the solution here. Start free with the diagnostic or the calculator, then move forward with whatever fits your stage.'}
            </p>
          </div>
        </div>

        {/* ── WIDGET STRIP ── */}
        <div className="dn-strip">
          <div className="dn-strip-in">
            <span className="dn-strip-lbl">{nl ? 'Weet je niet waar te starten?' : "Don't know where to start?"}</span>
            <Link href="/calculator" style={{ color: ORNG }}>
              {nl ? 'Bereken je omzetverlies' : 'Calculate your revenue leak'} <ArrowRight size={13} />
            </Link>
            <span className="dn-strip-sep">{nl ? 'of' : 'or'}</span>
            <Link href="/diagnostic" style={{ color: GRN }}>
              {nl ? 'Start de gratis diagnose' : 'Start the free diagnostic'} <ArrowRight size={13} />
            </Link>
          </div>
        </div>

        {/* ── SERVICE LIJST ── */}
        <div className="dn-list">
          {services.map((s) => {
            const Icon = s.icon
            return (
              <div key={s.title} className={`dn-svc${s.featured ? ' feat' : ''}`}>
                {s.featured && (
                  <div className="dn-badge">{nl ? 'Aanbevolen start' : 'Recommended start'}</div>
                )}
                <div className="dn-ico">
                  <Icon size={20} color={s.featured ? LIME : s.accent} />
                </div>
                <div>
                  <div className="dn-tag">{s.tag}</div>
                  <h2>{s.title}</h2>
                  <p className="dn-out" style={{ color: s.featured ? LIME : s.accent }}>{s.outcome}</p>
                  <p className="dn-desc">{s.description}</p>
                  <Link
                    href={s.href}
                    className={`dn-cta${s.ctaStyle === 'solid-green' ? ' green' : ''}`}
                  >
                    {s.cta} <ArrowRight size={15} />
                  </Link>
                </div>
              </div>
            )
          })}

          {/* ── NIET ZEKER ── */}
          <div className="dn-help">
            <div className="dn-help-k">
              <MessageCircle size={13} style={{ display: 'inline', verticalAlign: '-2px', marginRight: 7 }} />
              {nl ? 'Niet zeker welke dienst past?' : 'Not sure which service fits?'}
            </div>
            <h3>{nl ? 'Begin bij de diagnose' : 'Start with the diagnostic'}</h3>
            <p>
              {nl
                ? 'Die brengt in 4 minuten in kaart waar jouw bedrijf staat en welke dienst de meeste impact heeft voor jouw fase.'
                : 'In 4 minutes it maps where your business stands and which service has the most impact for your stage.'}
            </p>
            <Link href="/diagnostic" className="dn-cta green">
              {nl ? 'Start gratis diagnose' : 'Start free diagnostic'} <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </main>

      <footer className="dn-foot">
        <b>Lead it, Grow</b>
        <span>© {new Date().getFullYear()} · leaditgrow.be · leaditgrow.com</span>
      </footer>
    </>
  )
}
