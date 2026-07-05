import type { Metadata } from 'next'
import { headers } from 'next/headers'
import Script from 'next/script'
import { getPillarMetadata, getPillarSchema } from '@/lib/pillar-seo'

const SLUG = 'website-cro'

const FAQS_NL = [
  { q: 'Wat is CRO?', a: 'CRO (Conversion Rate Optimisation) is het proces om het percentage bezoekers dat een gewenste actie onderneemt op je website te verhogen, zonder meer traffic te kopen.' },
  { q: 'Moet ik eerst CRO doen of meer adverteren?', a: 'Eerst CRO. Meer bezoekers sturen naar een pagina die niet converteert, vergroot alleen het verlies. Fix de pipeline eerst, open dan pas de kraan.' },
]
const FAQS_EN = [
  { q: 'What is CRO?', a: 'CRO (Conversion Rate Optimisation) is the process of increasing the percentage of visitors who take a desired action on your website, without buying more traffic.' },
  { q: 'Should I do CRO first or advertise more?', a: 'CRO first. Sending more visitors to a page that does not convert only grows the loss. Fix the pipeline first, then open the tap.' },
]

export async function generateMetadata(): Promise<Metadata> {
  const isEn = (await headers()).get('host')?.includes('leaditgrow.com') ?? false
  return getPillarMetadata({
    isEn,
    slug: SLUG,
    nl: {
      title: 'Website CRO: Meer Omzet Zonder Meer Traffic | Lead it, Grow',
      description: 'Van 25 naar 35% conversie bouwt meer omzet dan een verdubbeld advertentiebudget. Ontdek wat CRO is en waarom het eerst komt.',
    },
    en: {
      title: 'Website CRO: More Revenue Without More Traffic | Lead it, Grow',
      description: 'Going from 25% to 35% conversion builds more revenue than doubling your ad budget. Discover what CRO is and why it comes first.',
    },
  })
}

export default async function Layout({ children }: { children: React.ReactNode }) {
  const isEn = (await headers()).get('host')?.includes('leaditgrow.com') ?? false
  const schema = getPillarSchema({
    isEn,
    slug: SLUG,
    headlineNl: 'Website CRO: Meer Omzet Zonder Meer Traffic',
    headlineEn: 'Website CRO: More Revenue Without More Traffic',
    descriptionNl: 'Van 25 naar 35% conversie bouwt meer omzet dan een verdubbeld advertentiebudget.',
    descriptionEn: 'Going from 25% to 35% conversion builds more revenue than doubling your ad budget.',
    faqsNl: FAQS_NL,
    faqsEn: FAQS_EN,
  })
  return (
    <>
      <Script id="website-cro-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      {children}
    </>
  )
}
