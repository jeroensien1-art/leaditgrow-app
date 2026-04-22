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
      title: 'Free Business Growth Diagnostic — Discover What Is Holding Your Business Back | Lead it, Grow',
      description: '7 honest questions. Discover which of the 7 growth levers in your business are blocked. Free personalised report in your inbox within minutes. No sales call.',
      alternates: { canonical: 'https://leaditgrow.com/diagnostic' },
      openGraph: { title: 'Free Business Growth Diagnostic | Lead it, Grow', description: '7 questions. Discover your #1 growth lever. Free personalised report.', url: 'https://leaditgrow.com/diagnostic', type: 'website' },
    }
  }
  return {
    title: 'Gratis Groeidiagnose — Ontdek Wat Jouw Bedrijf Tegenhoudt | Lead it, Grow',
    description: '7 eerlijke vragen. Ontdek welke van de 7 groeihefbomen in jouw bedrijf op slot staan. Gratis persoonlijk rapport in jouw inbox. Geen verkoopsgesprek.',
    alternates: { canonical: 'https://leaditgrow.be/diagnostic' },
    openGraph: { title: 'Gratis Groeidiagnose | Lead it, Grow', description: '7 vragen. Ontdek jouw #1 groeihefboom. Gratis persoonlijk rapport.', url: 'https://leaditgrow.be/diagnostic', type: 'website' },
  }
}

export default async function DiagnosticLayout({ children }: { children: React.ReactNode }) {
  const headersList = await headers()
  const host = headersList.get('host') || ''
  const isEn = host.includes('leaditgrow.com')
  const base = isEn ? 'https://leaditgrow.com' : 'https://leaditgrow.be'

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        name: isEn ? 'Business Growth Diagnostic' : 'Groeidiagnose',
        description: isEn
          ? 'A free 7-question diagnostic that maps which of the 7 growth levers in your business are blocked, with a personalised action plan.'
          : 'Een gratis diagnose van 7 vragen die in kaart brengt welke van de 7 groeihefbomen in jouw bedrijf op slot staan, met een persoonlijk actieplan.',
        url: `${base}/diagnostic`,
        applicationCategory: 'BusinessApplication',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR' },
        publisher: { '@type': 'Organization', name: 'Lead it, Grow', url: base },
      },
      {
        '@type': 'FAQPage',
        mainEntity: isEn ? [
          { '@type': 'Question', name: 'What are the 7 growth levers in the diagnostic?', acceptedAnswer: { '@type': 'Answer', text: 'The 7 levers are: owner time freedom, leadership and team, speed-to-lead, pipeline and follow-up, online presence and marketing, sales close rate, and client retention and referrals. Each lever represents a distinct area where most businesses leave revenue on the table.' } },
          { '@type': 'Question', name: 'How long does the business diagnostic take?', acceptedAnswer: { '@type': 'Answer', text: 'The diagnostic consists of 4 context questions and 7 scored questions. Most business owners complete it in 4 to 6 minutes.' } },
          { '@type': 'Question', name: 'What do I receive after completing the diagnostic?', acceptedAnswer: { '@type': 'Answer', text: 'You receive a personalised report with your business impact score, your top 3 growth levers ranked by priority, and a specific 30-day action plan for each gap. Delivered by email within minutes.' } },
          { '@type': 'Question', name: 'Is the diagnostic really free?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. The diagnostic and the personalised report are completely free. There is no sales call attached. The goal is to give you honest insight into where your business stands today.' } },
        ] : [
          { '@type': 'Question', name: 'Wat zijn de 7 groeihefbomen in de diagnose?', acceptedAnswer: { '@type': 'Answer', text: 'De 7 hefbomen zijn: tijd van de zaakvoerder, leiderschap en team, snelheid van opvolging, pipeline en nurture, online aanwezigheid en marketing, sluitingspercentage en klantbehoud. Elk vertegenwoordigt een gebied waar de meeste bedrijven omzet laten liggen.' } },
          { '@type': 'Question', name: 'Hoe lang duurt de groeidiagnose?', acceptedAnswer: { '@type': 'Answer', text: 'De diagnose bestaat uit 4 contextvragen en 7 scoringsvragen. De meeste zaakvoerders ronden het af in 4 tot 6 minuten.' } },
          { '@type': 'Question', name: 'Wat ontvang ik na het invullen van de diagnose?', acceptedAnswer: { '@type': 'Answer', text: 'Je ontvangt een persoonlijk rapport met jouw bedrijfsimpactscore, jouw top 3 groeihefbomen gerangschikt op prioriteit, en een concreet 30-dagenplan per gap. Afgeleverd per e-mail binnen enkele minuten.' } },
          { '@type': 'Question', name: 'Is de diagnose echt gratis?', acceptedAnswer: { '@type': 'Answer', text: 'Ja. De diagnose en het persoonlijk rapport zijn volledig gratis. Er is geen verkoopsgesprek aan gekoppeld. Het doel is je eerlijk inzicht te geven in waar jouw bedrijf vandaag staat.' } },
        ],
      },
    ],
  }

  return (
    <>
      <Script id="diag-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      {children}
    </>
  )
}
