import { Metadata } from 'next'

export const seoMetadata = {
  nl: {
    title: 'Lead it, Grow — Lead with clear impact',
    description: 'Wij helpen ondernemers groeien met systeem, strategie en meetbare impact.',
  },
  en: {
    title: 'Lead it, Grow — Lead with clear impact',
    description: 'We help entrepreneurs grow with systems, strategy, and measurable impact.',
  },
}

export function getMetadata(lang: 'nl' | 'en'): Metadata {
  return {
    title: seoMetadata[lang].title,
    description: seoMetadata[lang].description,
  }
}

export function getAlternateLinks(pathname: string, currentLang: 'nl' | 'en') {
  const basePathname = pathname === '/' ? '/' : pathname

  return {
    nl: {
      hreflang: 'nl-BE',
      href: `https://leaditgrow.be${basePathname}`,
    },
    en: {
      hreflang: 'en',
      href: `https://leaditgrow.com${basePathname}`,
    },
  }
}
