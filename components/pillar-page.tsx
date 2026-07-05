'use client'

import { Nav } from '@/components/nav'
import { useLang } from '@/components/lang-context'

const B = 'var(--font-brutalist, system-ui)'
const M = 'var(--font-mono-brutalist, monospace)'
const INK = '#0e0d0b'
const BG = '#f2f0eb'
const GRN = '#1a5e35'
const ORANGE = '#c96442'
const MUT = '#787068'

type Copy = [nl: string, en: string]

export function PillarPage({
  eyebrow,
  headline,
  pain,
  principle,
  ctaLabel,
  ctaHref,
  faqs,
}: {
  eyebrow: Copy
  headline: Copy
  pain: Copy
  principle: Copy
  ctaLabel: Copy
  ctaHref: string
  faqs: { q: Copy; a: Copy }[]
}) {
  const { t } = useLang()

  return (
    <>
      <Nav />
      <style>{`
        .b-pillar { background: ${BG}; min-height: 100vh; }
        .b-pillar-inner { max-width: 720px; margin: 0 auto; padding: 80px 24px 100px; }
        .b-pillar-eyebrow {
          font-family: ${M}; font-size: 11px; font-weight: 700; letter-spacing: .14em;
          text-transform: uppercase; color: ${ORANGE}; margin-bottom: 20px;
        }
        .b-pillar-h1 {
          font-family: ${B}; font-size: clamp(32px, 5vw, 56px); font-weight: 700;
          letter-spacing: -.03em; line-height: 1.05; text-transform: uppercase;
          color: ${INK}; margin-bottom: 28px;
        }
        .b-pillar-pain {
          font-size: 16px; color: ${MUT}; line-height: 1.7; max-width: 560px;
          margin-bottom: 40px; font-family: ${B};
        }
        .b-pillar-box { border-left: 3px solid ${GRN}; padding: 4px 0 4px 24px; margin-bottom: 44px; }
        .b-pillar-box-label {
          font-family: ${M}; font-size: 10px; font-weight: 700; letter-spacing: .12em;
          text-transform: uppercase; color: ${GRN}; margin-bottom: 10px;
        }
        .b-pillar-box-text { font-size: 15px; color: ${INK}; line-height: 1.75; font-family: ${B}; }
        .b-pillar-cta {
          display: inline-flex; align-items: center; gap: 10px; background: ${INK};
          color: ${BG}; font-size: 13px; font-weight: 700; letter-spacing: .08em;
          text-transform: uppercase; padding: 16px 28px; text-decoration: none;
          border: 2px solid ${INK}; font-family: ${B};
          transition: background .15s, border-color .15s;
        }
        .b-pillar-cta:hover { background: ${ORANGE}; border-color: ${ORANGE}; }
        .b-pillar-back {
          display: block; margin-top: 40px; font-family: ${M}; font-size: 11px;
          letter-spacing: .08em; text-transform: uppercase; color: ${MUT}; text-decoration: none;
        }
        .b-pillar-faq { margin-top: 56px; border-top: 2px solid ${INK}; padding-top: 32px; }
        .b-pillar-faq-title {
          font-family: ${B}; font-size: 20px; font-weight: 700; color: ${INK};
          text-transform: uppercase; letter-spacing: -.02em; margin-bottom: 20px;
        }
        .b-pillar-faq-item { padding: 18px 0; border-top: 1px solid rgba(14,13,11,.1); }
        .b-pillar-faq-item:first-child { border-top: none; padding-top: 0; }
        .b-pillar-faq-q { font-size: 15px; font-weight: 700; color: ${INK}; font-family: ${B}; margin-bottom: 8px; }
        .b-pillar-faq-a { font-size: 14px; color: ${MUT}; line-height: 1.7; font-family: ${B}; }
      `}</style>
      <div className="b-pillar">
        <div className="b-pillar-inner">
          <div className="b-pillar-eyebrow">{t(eyebrow[0], eyebrow[1])}</div>
          <h1 className="b-pillar-h1">{t(headline[0], headline[1])}</h1>
          <p className="b-pillar-pain">{t(pain[0], pain[1])}</p>
          <div className="b-pillar-box">
            <div className="b-pillar-box-label">{t('Het principe', 'The principle')}</div>
            <p className="b-pillar-box-text">{t(principle[0], principle[1])}</p>
          </div>
          <a href={ctaHref} className="b-pillar-cta">{t(ctaLabel[0], ctaLabel[1])} →</a>

          <div className="b-pillar-faq">
            <h2 className="b-pillar-faq-title">{t('Veelgestelde vragen', 'Frequently asked questions')}</h2>
            {faqs.map(f => (
              <div key={f.q[0]} className="b-pillar-faq-item">
                <div className="b-pillar-faq-q">{t(f.q[0], f.q[1])}</div>
                <p className="b-pillar-faq-a">{t(f.a[0], f.a[1])}</p>
              </div>
            ))}
          </div>

          <a href="/" className="b-pillar-back">{t('← Terug naar home', '← Back to home')}</a>
        </div>
      </div>
    </>
  )
}
