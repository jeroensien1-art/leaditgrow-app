'use client'

import { useLang } from '@/components/lang-context'

export function FooterCta() {
  const { t } = useLang()
  return (
    <a href="/diagnostic" style={{ fontFamily: 'var(--font-mono-brutalist, monospace)', fontSize: '10px', fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: '#1a5e35', textDecoration: 'none' }}>
      {t('Start gratis', 'Start free')} →
    </a>
  )
}
