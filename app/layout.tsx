import type { Metadata } from 'next'
import { Instrument_Sans, Instrument_Serif } from 'next/font/google'
import { headers } from 'next/headers'
import './globals.css'
import { LangProvider } from '@/components/lang-context'
import { seoMetadata } from '@/lib/seo'

const instrumentSans = Instrument_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
})

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: ['400'],
  style: ['normal', 'italic'],
  variable: '--font-serif',
})

// Get language from cookie (set by middleware)
async function getLangFromCookie(): Promise<'nl' | 'en'> {
  const headersList = await headers()
  const cookieHeader = headersList.get('cookie') || ''
  const langCookie = cookieHeader
    .split('; ')
    .find((row) => row.startsWith('lang='))
    ?.split('=')[1]

  return (langCookie === 'en' ? 'en' : 'nl') as 'nl' | 'en'
}

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLangFromCookie()
  return {
    title: seoMetadata[lang].title,
    description: seoMetadata[lang].description,
    alternates: {
      canonical:
        lang === 'nl'
          ? 'https://leaditgrow.be'
          : 'https://leaditgrow.com',
      languages: {
        'nl-BE': 'https://leaditgrow.be',
        en: 'https://leaditgrow.com',
      },
    },
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const lang = await getLangFromCookie()

  return (
    <html lang={lang} suppressHydrationWarning>
      <head>
        {/* Hreflang links for SEO */}
        <link rel="alternate" hreflang="nl-BE" href="https://leaditgrow.be/" />
        <link rel="alternate" hreflang="en" href="https://leaditgrow.com/" />
        <link rel="alternate" hreflang="x-default" href="https://leaditgrow.com/" />
      </head>
      <body className={`${instrumentSans.variable} ${instrumentSerif.variable} font-sans antialiased`}>
        <LangProvider>{children}</LangProvider>
      </body>
    </html>
  )
}
