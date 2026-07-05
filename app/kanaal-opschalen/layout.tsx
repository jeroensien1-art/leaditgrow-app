import type { Metadata } from 'next'
import { headers } from 'next/headers'
import Script from 'next/script'
import { getPillarMetadata, getPillarSchema } from '@/lib/pillar-seo'

const SLUG = 'kanaal-opschalen'

const FAQS_NL = [
  { q: 'Hoe weet ik welk kanaal ik moet opschalen?', a: 'Kijk naar welk kanaal nu al de laagste kost per klant en de hoogste conversie oplevert. Dat kanaal schaal je eerst, voor je een nieuw kanaal test.' },
  { q: 'Hoeveel budget zet ik op een nieuw kanaal?', a: 'Maximaal 10% van je marketingbudget. Een nieuw kanaal is een experiment, geen gok op je hele groei.' },
]
const FAQS_EN = [
  { q: 'How do I know which channel to scale?', a: 'Look at which channel already delivers the lowest cost per customer and the highest conversion. Scale that channel first, before testing a new one.' },
  { q: 'How much budget should I put on a new channel?', a: 'A maximum of 10% of your marketing budget. A new channel is an experiment, not a bet on your entire growth.' },
]

export async function generateMetadata(): Promise<Metadata> {
  const isEn = (await headers()).get('host')?.includes('leaditgrow.com') ?? false
  return getPillarMetadata({
    isEn,
    slug: SLUG,
    nl: {
      title: 'Beste Kanaal Opschalen: Groeien Zonder te Gokken | Lead it, Grow',
      description: 'Schaal alleen wat al bewezen converteert. Ontdek hoe je het juiste marketingkanaal identificeert en veilig opschaalt.',
    },
    en: {
      title: 'Scaling Your Best Channel: Growth Without Gambling | Lead it, Grow',
      description: 'Only scale what already converts. Discover how to identify the right marketing channel and scale it safely.',
    },
  })
}

export default async function Layout({ children }: { children: React.ReactNode }) {
  const isEn = (await headers()).get('host')?.includes('leaditgrow.com') ?? false
  const schema = getPillarSchema({
    isEn,
    slug: SLUG,
    headlineNl: 'Beste Kanaal Opschalen: Groeien Zonder te Gokken',
    headlineEn: 'Scaling Your Best Channel: Growth Without Gambling',
    descriptionNl: 'Schaal alleen wat al bewezen converteert.',
    descriptionEn: 'Only scale what already converts.',
    faqsNl: FAQS_NL,
    faqsEn: FAQS_EN,
  })
  return (
    <>
      <Script id="kanaal-opschalen-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      {children}
    </>
  )
}
