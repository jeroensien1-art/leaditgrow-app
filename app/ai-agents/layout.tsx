import type { Metadata } from 'next'
import { headers } from 'next/headers'
import Script from 'next/script'
import { getPillarMetadata, getPillarSchema } from '@/lib/pillar-seo'

const SLUG = 'ai-agents'

const FAQS_NL = [
  { q: 'Wat is een AI agent?', a: 'Een AI agent is een geautomatiseerde assistent die jouw bedrijf kent, reageert op mails, WhatsApp en telefoons in jouw stijl, en gekoppeld is aan je CRM, agenda en offertes.' },
  { q: 'Vervangt een AI agent mijn team?', a: 'Nee. Een AI agent vangt de eerste reactie en opvolging op zodat niets blijft liggen. Jouw team neemt het gesprek over zodra het menselijke beslissingen vereist.' },
]
const FAQS_EN = [
  { q: 'What is an AI agent?', a: 'An AI agent is an automated assistant that knows your business, responds to emails, WhatsApp, and calls in your voice, and connects to your CRM, calendar, and quotes.' },
  { q: 'Does an AI agent replace my team?', a: 'No. An AI agent catches the first response and follow-up so nothing falls through the cracks. Your team takes over the conversation once it requires a human decision.' },
]

export async function generateMetadata(): Promise<Metadata> {
  const isEn = (await headers()).get('host')?.includes('leaditgrow.com') ?? false
  return getPillarMetadata({
    isEn,
    slug: SLUG,
    nl: {
      title: 'AI Agents voor Jouw Bedrijf: 24/7 Bereikbaar | Lead it, Grow',
      description: 'Jij kan niet 24/7 mails, telefoons en offertes opvolgen. Ontdek wat een AI agent doet en test hem 14 dagen gratis.',
    },
    en: {
      title: 'AI Agents for Your Business: Available 24/7 | Lead it, Grow',
      description: 'You cannot follow up on emails, calls, and quotes around the clock. Discover what an AI agent does and try it free for 14 days.',
    },
  })
}

export default async function Layout({ children }: { children: React.ReactNode }) {
  const isEn = (await headers()).get('host')?.includes('leaditgrow.com') ?? false
  const schema = getPillarSchema({
    isEn,
    slug: SLUG,
    headlineNl: 'AI Agents voor Jouw Bedrijf: 24/7 Bereikbaar',
    headlineEn: 'AI Agents for Your Business: Available 24/7',
    descriptionNl: 'Jij kan niet 24/7 mails, telefoons en offertes opvolgen.',
    descriptionEn: 'You cannot follow up on emails, calls, and quotes around the clock.',
    faqsNl: FAQS_NL,
    faqsEn: FAQS_EN,
  })
  return (
    <>
      <Script id="ai-agents-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      {children}
    </>
  )
}
