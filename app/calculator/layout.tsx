import type { Metadata } from 'next'
import { headers } from 'next/headers'
import Script from 'next/script'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers()
  const host = headersList.get('host') || ''
  const isEn = host.includes('leaditgrow.com')

  if (isEn) {
    return {
      title: 'Revenue Leak Calculator — How Much Are You Losing Per Month? | Lead it, Grow',
      description: 'Free 2-minute calculator for business owners. Discover exactly how much revenue you lose each month through slow lead response and poor follow-up. Instant result.',
      alternates: { canonical: 'https://leaditgrow.com/calculator' },
      openGraph: { title: 'Revenue Leak Calculator | Lead it, Grow', description: 'How much revenue do you lose per month? 4 questions. Instant result.', url: 'https://leaditgrow.com/calculator', type: 'website' },
    }
  }
  return {
    title: 'Omzetverlies Calculator — Hoeveel Miss Jij Per Maand? | Lead it, Grow',
    description: 'Gratis calculator voor Vlaamse ondernemers. Ontdek in 2 minuten hoeveel omzet jij elke maand misloopt door trage opvolging en onvoldoende leadopvolging. Direct resultaat.',
    alternates: { canonical: 'https://leaditgrow.be/calculator' },
    openGraph: { title: 'Omzetverlies Calculator | Lead it, Grow', description: 'Hoeveel omzet mis jij per maand? 4 vragen. Direct jouw getal.', url: 'https://leaditgrow.be/calculator', type: 'website' },
  }
}

export default async function CalculatorLayout({ children }: { children: React.ReactNode }) {
  const headersList = await headers()
  const host = headersList.get('host') || ''
  const isEn = host.includes('leaditgrow.com')
  const base = isEn ? 'https://leaditgrow.com' : 'https://leaditgrow.be'

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        name: isEn ? 'Revenue Leak Calculator' : 'Omzetverlies Calculator',
        description: isEn
          ? 'Free calculator that shows business owners exactly how much revenue they lose monthly through slow lead response and poor follow-up.'
          : 'Gratis calculator die zaakvoerders laat zien hoeveel omzet ze maandelijks mislopen door trage opvolging.',
        url: `${base}/calculator`,
        applicationCategory: 'BusinessApplication',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR' },
        publisher: { '@type': 'Organization', name: 'Lead it, Grow', url: base },
      },
      {
        '@type': 'FAQPage',
        mainEntity: isEn ? [
          { '@type': 'Question', name: 'How accurate is the revenue leak calculator?', acceptedAnswer: { '@type': 'Answer', text: 'The calculator uses published B2B sales research benchmarks, including InsideSales data on response time and conversion rates. Results are indicative estimates based on your inputs, not a guaranteed figure.' } },
          { '@type': 'Question', name: 'What causes revenue leaks in a business?', acceptedAnswer: { '@type': 'Answer', text: 'The two biggest drivers are slow lead response (responding after 5 minutes drops conversion by 80%) and insufficient follow-up (80% of sales require 5+ contacts, most businesses stop at one).' } },
          { '@type': 'Question', name: 'How do I stop losing revenue to slow follow-up?', acceptedAnswer: { '@type': 'Answer', text: 'The most effective fix is an automated response system that replies to every enquiry within 60 seconds, plus a structured follow-up sequence of 5+ touchpoints. Together these address the two main causes of revenue leakage.' } },
        ] : [
          { '@type': 'Question', name: 'Hoe nauwkeurig is de omzetverlies calculator?', acceptedAnswer: { '@type': 'Answer', text: 'De calculator gebruikt gepubliceerde B2B-verkooponderzoeksbenchmarks, inclusief InsideSales-data over reactietijd en conversieratio\'s. Resultaten zijn indicatieve schattingen op basis van jouw invoer.' } },
          { '@type': 'Question', name: 'Wat veroorzaakt omzetverlies in een bedrijf?', acceptedAnswer: { '@type': 'Answer', text: 'De twee grootste oorzaken zijn trage opvolging van leads (reageren na 5 minuten verlaagt de conversiekans met 80%) en onvoldoende opvolging (80% van verkopen vereist 5+ contactmomenten, de meeste bedrijven stoppen bij één).' } },
          { '@type': 'Question', name: 'Hoe stop ik omzetverlies door trage opvolging?', acceptedAnswer: { '@type': 'Answer', text: 'De meest effectieve oplossing is een geautomatiseerd antwoordsysteem dat elke aanvraag binnen 60 seconden beantwoordt, plus een gestructureerde opvolgsequentie van 5+ contactmomenten.' } },
        ],
      },
    ],
  }

  return (
    <>
      <Script id="calc-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      {children}
    </>
  )
}
