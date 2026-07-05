import type { Metadata } from 'next'
import { headers } from 'next/headers'
import Script from 'next/script'
import { getPillarMetadata, getPillarSchema } from '@/lib/pillar-seo'

const SLUG = 'systeem-op-autopilot'

const FAQS_NL = [
  { q: "Wat betekent 'systeem op autopilot'?", a: 'Het betekent dat leads worden aangetrokken, opgevolgd en geconverteerd door een commercieel systeem, ongeacht of jij op dat moment beschikbaar bent.' },
  { q: 'Hoe lang duurt het om zo een systeem op te zetten?', a: 'De meeste klanten zien binnen 4 weken het verschil tussen constante druk en een systeem dat op autopilot draait.' },
]
const FAQS_EN = [
  { q: "What does 'system on autopilot' mean?", a: 'It means leads are attracted, followed up with, and converted by a commercial system, whether or not you are personally available at that moment.' },
  { q: 'How long does it take to set up a system like this?', a: 'Most clients see the difference between constant pressure and a system running on autopilot within 4 weeks.' },
]

export async function generateMetadata(): Promise<Metadata> {
  const isEn = (await headers()).get('host')?.includes('leaditgrow.com') ?? false
  return getPillarMetadata({
    isEn,
    slug: SLUG,
    nl: {
      title: 'Systeem op Autopilot: Groei Los van Jouw Agenda | Lead it, Grow',
      description: 'Zolang je bedrijf draait op jouw persoonlijke aanwezigheid, groeit het maar zo snel als je agenda toelaat. Ontdek hoe een commercieel systeem dat oplost.',
    },
    en: {
      title: 'System on Autopilot: Growth Independent of Your Calendar | Lead it, Grow',
      description: 'As long as your business runs on your personal presence, it only grows as fast as your calendar allows. Discover how a commercial system fixes that.',
    },
  })
}

export default async function Layout({ children }: { children: React.ReactNode }) {
  const isEn = (await headers()).get('host')?.includes('leaditgrow.com') ?? false
  const schema = getPillarSchema({
    isEn,
    slug: SLUG,
    headlineNl: 'Systeem op Autopilot: Groei Los van Jouw Agenda',
    headlineEn: 'System on Autopilot: Growth Independent of Your Calendar',
    descriptionNl: 'Zolang je bedrijf draait op jouw persoonlijke aanwezigheid, groeit het maar zo snel als je agenda toelaat.',
    descriptionEn: 'As long as your business runs on your personal presence, it only grows as fast as your calendar allows.',
    faqsNl: FAQS_NL,
    faqsEn: FAQS_EN,
  })
  return (
    <>
      <Script id="systeem-op-autopilot-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      {children}
    </>
  )
}
