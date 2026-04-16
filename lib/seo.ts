import { Metadata } from 'next'

export const seoMetadata = {
  nl: {
    title: 'Lead it, Grow — Groeisystemen voor Vlaamse ondernemers',
    description: 'Wij helpen Vlaamse zaakvoerders groeien met geautomatiseerde leadopvolging, groeisystemen en meetbare impact. Actief in Antwerpen, Gent en heel Vlaanderen.',
  },
  en: {
    title: 'Lead it, Grow — Growth Systems for Entrepreneurs',
    description: 'We help entrepreneurs grow with automated lead follow-up, growth systems, and measurable impact.',
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
