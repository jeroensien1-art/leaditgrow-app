import type { Metadata } from 'next'

type LangCopy = { title: string; description: string }
type Faq = { q: string; a: string }

export function getPillarMetadata(opts: {
  isEn: boolean
  slug: string
  nl: LangCopy
  en: LangCopy
}): Metadata {
  const base = opts.isEn ? 'https://leaditgrow.com' : 'https://leaditgrow.be'
  const copy = opts.isEn ? opts.en : opts.nl
  const url = `${base}/${opts.slug}`
  return {
    title: copy.title,
    description: copy.description,
    alternates: { canonical: url },
    openGraph: { title: copy.title, description: copy.description, url, type: 'website' },
  }
}

export function getPillarSchema(opts: {
  isEn: boolean
  slug: string
  headlineNl: string
  headlineEn: string
  descriptionNl: string
  descriptionEn: string
  faqsNl: Faq[]
  faqsEn: Faq[]
}) {
  const base = opts.isEn ? 'https://leaditgrow.com' : 'https://leaditgrow.be'
  const faqs = opts.isEn ? opts.faqsEn : opts.faqsNl

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        headline: opts.isEn ? opts.headlineEn : opts.headlineNl,
        description: opts.isEn ? opts.descriptionEn : opts.descriptionNl,
        author: { '@type': 'Organization', name: 'Lead it, Grow', url: base },
        publisher: { '@type': 'Organization', name: 'Lead it, Grow', url: base },
        url: `${base}/${opts.slug}`,
      },
      {
        '@type': 'FAQPage',
        mainEntity: faqs.map(f => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      },
    ],
  }
}
