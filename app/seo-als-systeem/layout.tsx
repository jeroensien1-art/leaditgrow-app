import type { Metadata } from 'next'
import { headers } from 'next/headers'
import Script from 'next/script'
import { getPillarMetadata, getPillarSchema } from '@/lib/pillar-seo'

const SLUG = 'seo-als-systeem'

const FAQS_NL = [
  { q: 'Waarom duurt SEO zo lang voor het resultaat oplevert?', a: 'Zoekmachines bouwen vertrouwen in je website op via consistente content, techniek en autoriteit over tijd. Dat proces duurt doorgaans 12 tot 18 maanden voor het zich vertaalt in stabiele posities.' },
  { q: 'Is SEO het nog waard als het zo lang duurt?', a: 'Ja, omdat het effect compoundeert: eenmaal opgebouwd, blijft SEO-traffic binnenkomen zonder dat je per klik betaalt, in tegenstelling tot advertenties.' },
]
const FAQS_EN = [
  { q: 'Why does SEO take so long to pay off?', a: 'Search engines build trust in your website through consistent content, technical foundations, and authority over time. That process typically takes 12 to 18 months before it translates into stable rankings.' },
  { q: 'Is SEO still worth it if it takes that long?', a: 'Yes, because the effect compounds: once built, SEO traffic keeps coming in without paying per click, unlike ads.' },
]

export async function generateMetadata(): Promise<Metadata> {
  const isEn = (await headers()).get('host')?.includes('leaditgrow.com') ?? false
  return getPillarMetadata({
    isEn,
    slug: SLUG,
    nl: {
      title: 'SEO als Systeem: Groei die Blijft Doorgaan | Lead it, Grow',
      description: 'SEO en video renderen pas na 12 tot 18 maanden. Ontdek waarom de meeste bedrijven net te vroeg stoppen en hoe je het wél volhoudt.',
    },
    en: {
      title: 'SEO as a System: Growth That Keeps Compounding | Lead it, Grow',
      description: 'SEO and video only pay off after 12 to 18 months. Discover why most businesses quit too early, and how to make it stick.',
    },
  })
}

export default async function Layout({ children }: { children: React.ReactNode }) {
  const isEn = (await headers()).get('host')?.includes('leaditgrow.com') ?? false
  const schema = getPillarSchema({
    isEn,
    slug: SLUG,
    headlineNl: 'SEO als Systeem: Groei die Blijft Doorgaan',
    headlineEn: 'SEO as a System: Growth That Keeps Compounding',
    descriptionNl: 'SEO en video renderen pas na 12 tot 18 maanden.',
    descriptionEn: 'SEO and video only pay off after 12 to 18 months.',
    faqsNl: FAQS_NL,
    faqsEn: FAQS_EN,
  })
  return (
    <>
      <Script id="seo-als-systeem-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      {children}
    </>
  )
}
