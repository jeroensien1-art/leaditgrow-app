'use client'

import { useLang } from '@/components/lang-context'
import { Nav } from '@/components/nav'
import Link from 'next/link'

export default function BedanktHandboek() {
  const { t } = useLang()
  return (
    <>
      <Nav />
      <main style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f9f7f2', padding: '2rem' }}>
        <div style={{ maxWidth: 540, textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: '1rem' }}>✓</div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.6rem, 4vw, 2.2rem)', marginBottom: '1rem', color: '#1a1a1a' }}>
            {t('Het handboek is onderweg', 'The handbook is on its way')}
          </h1>
          <p style={{ color: '#555', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '2rem' }}>
            {t(
              'Check je inbox (en spammap). Wil je ook weten welke hefboom jij als eerste moet aanpakken?',
              'Check your inbox (and spam folder). Want to find out which lever to pull first?'
            )}
          </p>
          <Link href="/diagnostic" style={{ display: 'inline-block', background: '#c95d3b', color: '#fff', padding: '0.75rem 1.75rem', borderRadius: 8, fontWeight: 600, textDecoration: 'none' }}>
            {t('Start gratis diagnose', 'Start free diagnostic')}
          </Link>
        </div>
      </main>
    </>
  )
}
