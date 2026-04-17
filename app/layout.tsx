import type { Metadata } from 'next'
import { Instrument_Sans, Instrument_Serif } from 'next/font/google'
import { headers } from 'next/headers'
import Script from 'next/script'
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
        'nl-BE': 'https://leaditgrow.be/',
        en: 'https://leaditgrow.com/',
        'x-default': 'https://leaditgrow.com/',
      },
    },
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const lang = await getLangFromCookie()

  return (
    <html lang={lang} suppressHydrationWarning>
      <head>
        {/* ConsentEase: Set default consent BEFORE Google Tag Manager */}
        <Script id="consent-default" strategy="beforeInteractive">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('consent', 'default', {
            'ad_storage': 'denied',
            'ad_user_data': 'denied',
            'ad_personalization': 'denied',
            'analytics_storage': 'denied',
            'functionality_storage': 'denied',
            'personalization_storage': 'denied',
            'security_storage': 'granted',
            'wait_for_update': 500
          });
          gtag('set', 'ads_data_redaction', true);
          gtag('set', 'url_passthrough', true);
        `}</Script>
        {/* ConsentEase: Load consent banner (handles user interaction) */}
        <Script
          src="https://consentease.io/api/consent/4byewd8k045a/script.js?v=1776284702523"
          strategy="afterInteractive"
        />
      </head>
      <body className={`${instrumentSans.variable} ${instrumentSerif.variable} font-sans antialiased`}>
        <LangProvider>{children}</LangProvider>
      </body>
    </html>
  )
}

