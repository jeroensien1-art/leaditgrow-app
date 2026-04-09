'use client'

import { PineTreeLadder } from '@/components/ui/pine-tree-ladder'
import { useLang } from '@/components/lang-context'

export function Services() {
  const { t } = useLang()

  return (
    <section
      id="services"
      className="relative py-28 px-6 flex flex-col items-center"
      style={{ background: 'linear-gradient(to bottom, #0a1e10 0%, #051209 100%)' }}
    >
      {/* Section label */}
      <div
        className="text-[11px] font-bold uppercase tracking-widest mb-5"
        style={{ color: '#c96442' }}
      >
        {t('Het systeem', 'The system')}
      </div>

      <h2
        className="text-3xl sm:text-4xl font-semibold text-center mb-4 leading-tight"
        style={{ color: '#faf9f5' }}
      >
        {t('De groeiladder', 'The growth ladder')}
        <span
          className="block"
          style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 400, color: 'rgba(250,249,245,0.65)' }}
        >
          {t('Krijg direct inzicht met de gratis tool. Groei wanneer je klaar bent.', 'Gain instant clarity with the free tool. Grow when you are ready.')}
        </span>
      </h2>

      <p
        className="text-base max-w-md text-center mb-16 leading-relaxed"
        style={{ color: 'rgba(250,249,245,0.5)' }}
      >
        {t(
          'Elk level bouwt op het vorige. Hover over een niveau om te zien wat het inhoudt.',
          'Each level builds on the one before. Hover a level to see what it contains.'
        )}
      </p>

      <PineTreeLadder />
    </section>
  )
}
