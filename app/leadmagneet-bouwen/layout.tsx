import type { Metadata } from 'next'
import { headers } from 'next/headers'
import Script from 'next/script'
import { getPillarMetadata, getPillarSchema } from '@/lib/pillar-seo'

const SLUG = 'leadmagneet-bouwen'

const FAQS_NL = [
  { q: 'Wat is een leadmagneet?', a: 'Een leadmagneet is iets waardevols dat je gratis weggeeft, zoals een checklist, calculator of rapport, in ruil voor een e-mailadres, zodat je een bezoeker kan opvolgen.' },
  { q: 'Welke leadmagneet werkt het beste?', a: 'De leadmagneet die het snelste, concrete resultaat belooft rond het probleem waar je bezoeker nu mee zit, werkt het beste. Een calculator of diagnose scoort vaak hoger dan een algemene gids.' },
]
const FAQS_EN = [
  { q: 'What is a lead magnet?', a: 'A lead magnet is something valuable you give away for free, such as a checklist, calculator, or report, in exchange for an email address, so you can follow up with a visitor.' },
  { q: 'Which lead magnet works best?', a: 'The lead magnet that promises the fastest, most concrete result around the problem your visitor has right now works best. A calculator or diagnostic often outperforms a general guide.' },
]

export async function generateMetadata(): Promise<Metadata> {
  const isEn = (await headers()).get('host')?.includes('leaditgrow.com') ?? false
  return getPillarMetadata({
    isEn,
    slug: SLUG,
    nl: {
      title: 'Leadmagneet Bouwen: Van Bezoeker naar Lead | Lead it, Grow',
      description: '60 tot 80% van je bezoekers vertrekt zonder spoor. Ontdek hoe een leadmagneet anonieme bezoekers omzet in leads die je kan opvolgen.',
    },
    en: {
      title: 'Building a Lead Magnet: From Visitor to Lead | Lead it, Grow',
      description: '60 to 80% of your visitors leave without a trace. Discover how a lead magnet turns anonymous visitors into leads you can follow up with.',
    },
  })
}

export default async function Layout({ children }: { children: React.ReactNode }) {
  const isEn = (await headers()).get('host')?.includes('leaditgrow.com') ?? false
  const schema = getPillarSchema({
    isEn,
    slug: SLUG,
    headlineNl: 'Leadmagneet Bouwen: Van Bezoeker naar Lead',
    headlineEn: 'Building a Lead Magnet: From Visitor to Lead',
    descriptionNl: '60 tot 80% van je bezoekers vertrekt zonder spoor.',
    descriptionEn: '60 to 80% of your visitors leave without a trace.',
    faqsNl: FAQS_NL,
    faqsEn: FAQS_EN,
  })
  return (
    <>
      <Script id="leadmagneet-bouwen-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      {children}
    </>
  )
}
