'use client'

import { useLang } from '@/components/lang-context'
import { Nav } from '@/components/nav'
import Link from 'next/link'

export default function BedanktAnalyse() {
  const { nl } = useLang()
  return (
    <>
      <Nav />
      <main style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f9f7f2', padding: '2rem' }}>
        <div style={{ maxWidth: 540, textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: '1rem' }}>✓</div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.6rem, 4vw, 2.2rem)', marginBottom: '1rem', color: '#1a1a1a' }}>
            {nl ? 'Jouw rapport is onderweg' : 'Your report is on its way'}
          </h1>
          <p style={{ color: '#555', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '2rem' }}>
            {nl
              ? 'Check je inbox (en spammap) voor jouw persoonlijk 30-dagenplan. Gemiddeld binnen 5 minuten.'
              : 'Check your inbox (and spam folder) for your personalised 30-day action plan. Usually within 5 minutes.'}
          </p>
          <Link href="/" style={{ display: 'inline-block', background: '#c95d3b', color: '#fff', padding: '0.75rem 1.75rem', borderRadius: 8, fontWeight: 600, textDecoration: 'none' }}>
            {nl ? 'Terug naar home' : 'Back to home'}
          </Link>
        </div>
      </main>
    </>
  )
}
