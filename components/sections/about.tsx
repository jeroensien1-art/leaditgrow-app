'use client'

import { useLang } from '@/components/lang-context'

const stats = [
  { value: '78%', labelNl: 'van leads gaat verloren bij opvolging na meer dan 2 uur', labelEn: 'of leads are lost when follow-up takes more than 2 hours' },
  { value: 'tot 40%', labelNl: 'meer leads te converteren — bereken het nu', labelEn: 'more leads you could convert — calculate now' },
  { value: '4 weken', labelNl: 'van constante druk naar systeem', labelEn: 'from constant pressure to system' },
  { value: '80%', labelNl: 'minder manueel werk', labelEn: 'less manual work' },
]

export function About() {
  const { t } = useLang()

  return (
    <section
      id="about"
      className="relative py-28 px-6"
      style={{ background: '#faf9f5' }}
    >
      <div className="max-w-5xl mx-auto">
        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
          {/* Text */}
          <div>
            <div
              className="text-[11px] font-bold uppercase tracking-widest mb-5"
              style={{ color: '#c96442' }}
            >
              {t('Over mij', 'About me')}
            </div>
            <h2
              className="text-3xl sm:text-4xl font-semibold leading-tight mb-6"
              style={{ color: '#3d3929' }}
            >
              {t('Business strategy en systemen ', 'Business strategy and systems ')}
              <span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 400 }}>
                {t('die tijd teruggeven', 'that give back time')}
              </span>
            </h2>
            <p className="text-base leading-relaxed mb-4" style={{ color: '#535146' }}>
              {t(
                'Ik combineer business strategy met een voorspelbare groeimotor: systemen die leads automatisch opvolgen, kwalificeren en converteren. Zo leg ik de operationele last weg en creëer ik ruimte voor wat jij het best doet: leiden en bouwen.',
                'I combine business strategy with a predictable growth engine: systems that automatically follow up, qualify, and convert leads. That removes the operational weight and creates room for what you do best: leading and building.'
              )}
            </p>
            <p className="text-base leading-relaxed mb-4" style={{ color: '#535146' }}>
              {t(
                'Het resultaat is een bedrijf dat doorgroeit terwijl jij je energie investeert in creativiteit, strategie en leiderschap in plaats van in brandjes blussen.',
                'The result is a business that keeps growing while you invest your energy in creativity, strategy, and leadership instead of firefighting.'
              )}
            </p>
            <p className="text-base leading-relaxed mb-8" style={{ color: '#535146' }}>
              {t(
                'Vergeet niet: het fundament is jouw sterktes als leider ten volle benutten en een evenwichtige levensstijl. Om ondernemers en hun veeleisende leven echt te ondersteunen, bieden we 360° coaching als basislaag, geen bijzaak.',
                "Don't forget that the foundation is fully taking advantage of your strengths as a leader and a balanced lifestyle. To truly support entrepreneurs and their demanding lives, we offer 360° coaching as a base layer, not just an afterthought."
              )}
            </p>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 text-sm font-semibold"
              style={{ color: '#c96442' }}
            >
              {t('Laten we praten', "Let's talk")} →
            </a>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-5">
            {stats.map((s) => (
              <div
                key={s.value}
                className="rounded-2xl p-6"
                style={{
                  background: '#f3f1eb',
                  border: '1px solid rgba(61,57,41,0.08)',
                }}
              >
                <div
                  className="text-4xl font-bold mb-2 leading-none"
                  style={{ color: '#c96442', fontFamily: 'var(--font-serif)', fontStyle: 'italic' }}
                >
                  {s.value}
                </div>
                <div className="text-sm" style={{ color: '#83827d' }}>
                  {t(s.labelNl, s.labelEn)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Uman callout */}
        <div
          className="rounded-2xl p-8 flex flex-col sm:flex-row items-start sm:items-center gap-6"
          style={{
            background: 'linear-gradient(135deg, rgba(201,100,66,0.06) 0%, rgba(10,30,16,0.04) 100%)',
            border: '1px solid rgba(201,100,66,0.2)',
          }}
        >
          <div className="flex-1">
            <div className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: '#c96442' }}>
              360° Leiderschap
            </div>
            <div
              className="text-xl font-medium mb-1"
              style={{ color: '#3d3929', fontFamily: 'var(--font-serif)', fontStyle: 'italic' }}
            >
              {t('Leiderschapsanalyse & Balans', 'Leadership Analysis & Balance')}
            </div>
            <p className="text-sm" style={{ color: '#83827d' }}>
              {t(
                'Gratis leiderschapsanalyse en consultatie, volledig vrijblijvend.',
                'Free leadership analysis and consultation, no strings attached.'
              )}
            </p>
          </div>
          <a
            href="#contact"
            className="flex-shrink-0 px-5 py-2.5 rounded-full text-sm font-semibold text-white transition-opacity hover:opacity-85"
            style={{ background: '#c96442' }}
          >
            {t('Meer info', 'Learn more')}
          </a>
        </div>
      </div>
    </section>
  )
}
