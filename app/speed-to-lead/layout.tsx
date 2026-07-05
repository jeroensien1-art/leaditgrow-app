import type { Metadata } from 'next'
import { headers } from 'next/headers'
import Script from 'next/script'
import { getPillarMetadata, getPillarSchema } from '@/lib/pillar-seo'

const SLUG = 'speed-to-lead'

const FAQS_NL = [
  { q: 'Wat is speed-to-lead?', a: 'Speed-to-lead is de tijd tussen het moment dat een lead contact opneemt en het moment dat jij reageert. Hoe korter die tijd, hoe hoger de kans dat die lead klant wordt.' },
  { q: 'Hoe snel moet ik reageren op een nieuwe lead?', a: 'Onderzoek van InsideSales toont dat de kans op conversie met 80% daalt als je langer dan 5 minuten wacht met reageren. Binnen 1 minuut reageren geeft de hoogste conversiekans.' },
]
const FAQS_EN = [
  { q: 'What is speed-to-lead?', a: 'Speed-to-lead is the time between the moment a lead makes contact and the moment you respond. The shorter that time, the higher the odds that lead becomes a customer.' },
  { q: 'How fast should I respond to a new lead?', a: 'Research from InsideSales shows conversion odds drop by 80% once you wait longer than 5 minutes to respond. Responding within 1 minute gives the highest conversion odds.' },
]

export async function generateMetadata(): Promise<Metadata> {
  const isEn = (await headers()).get('host')?.includes('leaditgrow.com') ?? false
  return getPillarMetadata({
    isEn,
    slug: SLUG,
    nl: {
      title: 'Speed-to-Lead: Waarom de Eerste Reactie Wint | Lead it, Grow',
      description: '78% van de deals gaat naar wie het eerst reageert. Ontdek wat speed-to-lead is, waarom het je omzet bepaalt, en test het systeem 14 dagen gratis.',
    },
    en: {
      title: 'Speed-to-Lead: Why the First Response Wins | Lead it, Grow',
      description: '78% of deals go to whoever responds first. Discover what speed-to-lead is, why it decides your revenue, and try the system free for 14 days.',
    },
  })
}

export default async function Layout({ children }: { children: React.ReactNode }) {
  const isEn = (await headers()).get('host')?.includes('leaditgrow.com') ?? false
  const schema = getPillarSchema({
    isEn,
    slug: SLUG,
    headlineNl: 'Speed-to-Lead: Waarom de Eerste Reactie Wint',
    headlineEn: 'Speed-to-Lead: Why the First Response Wins',
    descriptionNl: '78% van de deals gaat naar wie het eerst reageert.',
    descriptionEn: '78% of deals go to whoever responds first.',
    faqsNl: FAQS_NL,
    faqsEn: FAQS_EN,
  })
  return (
    <>
      <Script id="speed-to-lead-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      {children}
    </>
  )
}
