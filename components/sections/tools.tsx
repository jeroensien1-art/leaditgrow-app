'use client'

import { ArrowRight, TrendingDown, BarChart2 } from 'lucide-react'
import { useLang } from '@/components/lang-context'

export function Tools() {
  const { t } = useLang()

  return (
    <section
      className="py-20 px-6"
      style={{ background: '#faf9f5' }}
    >
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="text-[11px] font-bold uppercase tracking-widest mb-4" style={{ color: '#c96442' }}>
            {t('Gratis tools', 'Free tools')}
          </div>
          <h2 className="text-2xl sm:text-3xl font-semibold leading-tight" style={{ color: '#3d3929' }}>
            {t('Waar wil je starten?', 'Where do you want to start?')}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Revenue Calculator — coming soon */}
          <div
            className="rounded-2xl p-8 flex flex-col gap-4"
            style={{ background: '#f3f1eb', border: '1px solid rgba(61,57,41,0.08)', opacity: 0.7 }}
          >
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(201,100,66,0.1)' }}
            >
              <TrendingDown className="w-5 h-5" style={{ color: '#c96442' }} />
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: '#c96442' }}>
                {t('Hoeveel mis ik?', 'How much am I losing?')}
              </div>
              <h3 className="text-lg font-semibold mb-2" style={{ color: '#3d3929' }}>
                {t('Revenue Calculator', 'Revenue Calculator')}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: '#83827d' }}>
                {t(
                  'Bereken in 2 minuten hoeveel omzet je maandelijks misloopt door trage opvolging.',
                  'Calculate in 2 minutes how much revenue you lose monthly through slow follow-up.'
                )}
              </p>
            </div>
            <div className="mt-auto">
              <span
                className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full"
                style={{ background: 'rgba(61,57,41,0.08)', color: '#83827d' }}
              >
                {t('Binnenkort beschikbaar', 'Coming soon')}
              </span>
            </div>
          </div>

          {/* Business Diagnostic */}
          <a
            href="/diagnostic"
            className="rounded-2xl p-8 flex flex-col gap-4 transition-all hover:-translate-y-1 hover:shadow-lg"
            style={{ background: '#fff', border: '1px solid rgba(201,100,66,0.2)', boxShadow: '0 4px 20px rgba(201,100,66,0.08)', textDecoration: 'none' }}
          >
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(201,100,66,0.1)' }}
            >
              <BarChart2 className="w-5 h-5" style={{ color: '#c96442' }} />
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: '#c96442' }}>
                {t('Wat houdt mij tegen?', 'What is holding me back?')}
              </div>
              <h3 className="text-lg font-semibold mb-2" style={{ color: '#3d3929' }}>
                {t('Business Diagnostic', 'Business Diagnostic')}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: '#83827d' }}>
                {t(
                  '7 eerlijke vragen. Je ontvangt een persoonlijk rapport met je top 3 groeikansen en een 30-dagenplan.',
                  '7 honest questions. You get a personalised report with your top 3 growth gaps and a 30-day action plan.'
                )}
              </p>
            </div>
            <div className="mt-auto flex items-center gap-2 text-sm font-semibold" style={{ color: '#c96442' }}>
              {t('Start gratis diagnose', 'Start free diagnostic')}
              <ArrowRight className="w-4 h-4" />
            </div>
          </a>
        </div>
      </div>
    </section>
  )
}
