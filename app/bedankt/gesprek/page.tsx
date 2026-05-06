'use client'

import { useLang } from '@/components/lang-context'
import { Nav } from '@/components/nav'
import Link from 'next/link'

export default function BedanktGesprek() {
  const { nl } = useLang()
  return (
    <>
      <Nav />
      <main style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f9f7f2', padding: '2rem' }}>
        <div style={{ maxWidth: 540, textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: '1rem' }}>✓</div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.6rem, 4vw, 2.2rem)', marginBottom: '1rem', color: '#1a1a1a' }}>
            {nl ? 'Gesprek aangevraagd' : 'Call requested'}
          </h1>
          <p style={{ color: '#555', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '2rem' }}>
            {nl
              ? 'Je hoort van mij binnen 24 uur met een voorstel voor een geschikt moment. Check ook je spammap.'
              : 'You will hear from me within 24 hours with a suggested time. Check your spam folder too.'}
          </p>
          <Link href="/" style={{ display: 'inline-block', background: '#c95d3b', color: '#fff', padding: '0.75rem 1.75rem', borderRadius: 8, fontWeight: 600, textDecoration: 'none' }}>
            {nl ? 'Terug naar home' : 'Back to home'}
          </Link>
        </div>
      </main>
    </>
  )
}
