'use client'

import { useLang } from '@/components/lang-context'

const B    = 'var(--font-brutalist, system-ui)'
const M    = 'var(--font-mono-brutalist, monospace)'
const INK  = '#0e0d0b'
const BG   = '#f2f0eb'
const GRN  = '#1a5e35'
const LIME = '#4ade80'
const MUT  = '#787068'

export function About() {
  const { t } = useLang()

  return (
    <>
      <style>{`
        .b-about-section {
          border-bottom: 3px solid ${INK};
          display: grid;
          grid-template-columns: 1fr 1fr;
          position: relative;
          z-index: 1;
        }
        .b-about-left {
          background: ${INK};
          padding: 80px 56px;
          border-right: 3px solid ${INK};
          display: flex;
          flex-direction: column;
          gap: 28px;
          transition: background 0.4s;
        }
        .b-about-right {
          background: ${BG};
          padding: 80px 56px;
          display: flex;
          flex-direction: column;
          gap: 0;
          transition: background 0.4s;
        }
        .b-about-num {
          font-family: ${M};
          font-size: 11px;
          color: rgba(255,255,255,.3);
          letter-spacing: .1em;
          margin-bottom: 4px;
        }
        .b-about-h2 {
          font-size: clamp(28px, 3.5vw, 48px);
          font-weight: 700;
          letter-spacing: -.04em;
          line-height: 1;
          text-transform: uppercase;
          font-family: ${B};
          color: ${BG};
          transition: color 0.4s;
        }
        .b-about-h2 .accent { color: ${GRN}; transition: color 0.4s; }
        .b-about-body {
          font-size: 14px;
          color: rgba(242,240,235,.5);
          line-height: 1.8;
          font-family: ${B};
          transition: color 0.4s;
        }
        .b-about-cta {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-family: ${M};
          font-size: 11px;
          font-weight: 700;
          letter-spacing: .12em;
          text-transform: uppercase;
          color: ${GRN};
          text-decoration: none;
          margin-top: auto;
          transition: color 0.4s;
        }
        .b-about-stat-row {
          display: flex;
          border-top: 2px solid rgba(14,13,11,.08);
          flex-direction: column;
          padding: 28px 0;
          gap: 6px;
        }
        .b-about-stat-row:first-child { border-top: none; padding-top: 0; }
        .b-about-stat-val {
          font-family: ${M};
          font-size: 40px;
          font-weight: 700;
          letter-spacing: -.04em;
          color: ${GRN};
          line-height: 1;
          transition: color 0.4s;
        }
        .b-about-stat-label {
          font-size: 13px;
          color: ${MUT};
          line-height: 1.55;
          font-family: ${B};
          transition: color 0.4s;
        }
        .b-about-uman {
          margin-top: 40px;
          padding: 24px 28px;
          background: rgba(26,94,53,0.06);
          border-left: 4px solid ${GRN};
          display: flex;
          flex-direction: column;
          gap: 6px;
          transition: background 0.4s, border-left-color 0.4s;
        }
        .b-about-uman-label {
          font-family: ${M};
          font-size: 10px;
          font-weight: 700;
          letter-spacing: .14em;
          text-transform: uppercase;
          color: ${GRN};
          transition: color 0.4s;
        }
        .b-about-uman-title {
          font-size: 15px;
          font-weight: 700;
          color: ${INK};
          font-family: ${B};
          transition: color 0.4s;
        }
        .b-about-uman-sub {
          font-size: 12px;
          color: ${MUT};
          font-family: ${B};
          transition: color 0.4s;
        }
        .b-about-uman-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-family: ${M};
          font-size: 10px;
          font-weight: 700;
          letter-spacing: .1em;
          text-transform: uppercase;
          color: ${GRN};
          text-decoration: none;
          margin-top: 8px;
          transition: color 0.4s;
        }

        /* SPOTLIGHT */
        .b-about-section.in-view .b-about-left { background: ${LIME}; }
        .b-about-section.in-view .b-about-num { color: rgba(14,13,11,.4); }
        .b-about-section.in-view .b-about-h2 { color: ${INK}; }
        .b-about-section.in-view .b-about-h2 .accent { color: ${INK}; }
        .b-about-section.in-view .b-about-body { color: rgba(14,13,11,.55); }
        .b-about-section.in-view .b-about-cta { color: ${INK}; }
        .b-about-section.in-view .b-about-stat-val { color: ${GRN}; }
        .b-about-section.in-view .b-about-right { background: ${LIME}; }
        .b-about-section.in-view .b-about-uman { background: rgba(14,13,11,.06); border-left-color: ${INK}; }
        .b-about-section.in-view .b-about-uman-label { color: ${INK}; }
        .b-about-section.in-view .b-about-uman-title { color: ${INK}; }
        .b-about-section.in-view .b-about-uman-link { color: ${INK}; }

        @media (max-width: 900px) {
          .b-about-section { grid-template-columns: 1fr; }
          .b-about-left { padding: 56px 24px; }
          .b-about-right { padding: 40px 24px; }
        }
      `}</style>

      <section className="b-about-section" id="about" data-spot>
        <div className="b-about-left">
          <div>
            <div className="b-about-num">// 03 {t('Over mij', 'About me')}</div>
          </div>
          <h2 className="b-about-h2">
            {t('Systemen die', 'Systems that')}<br />
            {t('tijd', 'give back')}<br />
            <span className="accent">{t('teruggeven.', 'time.')}</span>
          </h2>
          <p className="b-about-body">
            {t(
              'Ik combineer business strategy met een voorspelbare groeimotor: systemen die leads automatisch opvolgen, kwalificeren en converteren. Zo leg ik de operationele last weg en creëer ik ruimte voor wat jij het best doet: leiden en bouwen.',
              'I combine business strategy with a predictable growth engine: systems that automatically follow up, qualify, and convert leads. That removes the operational weight and creates room for what you do best: leading and building.'
            )}
          </p>
          <p className="b-about-body">
            {t(
              'Het resultaat is een bedrijf dat doorgroeit terwijl jij je energie investeert in creativiteit, strategie en leiderschap in plaats van in brandjes blussen.',
              'The result is a business that keeps growing while you invest your energy in creativity, strategy, and leadership instead of firefighting.'
            )}
          </p>
          <a href="#contact" className="b-about-cta">
            {t('Laten we praten', "Let's talk")} →
          </a>
        </div>

        <div className="b-about-right">
          <div className="b-about-stat-row">
            <div className="b-about-stat-val">78%</div>
            <div className="b-about-stat-label">{t('van leads verloren bij opvolging na meer dan 2 uur', 'of leads lost when follow-up takes more than 2 hours')}</div>
          </div>
          <div className="b-about-stat-row">
            <div className="b-about-stat-val">+40%</div>
            <div className="b-about-stat-label">{t('meer conversie zonder extra advertentiebudget', 'more conversions without extra ad budget')}</div>
          </div>
          <div className="b-about-stat-row">
            <div className="b-about-stat-val">4 wk</div>
            <div className="b-about-stat-label">{t('van constante druk naar systeem op autopilot', 'from constant pressure to a system on autopilot')}</div>
          </div>
          <div className="b-about-stat-row">
            <div className="b-about-stat-val">80%</div>
            <div className="b-about-stat-label">{t('minder manueel werk dankzij automatisering', 'less manual work thanks to automation')}</div>
          </div>

          <div className="b-about-uman">
            <div className="b-about-uman-label">360° {t('Leiderschap', 'Leadership')}</div>
            <div className="b-about-uman-title">{t('Leiderschapsanalyse & Balans', 'Leadership Analysis & Balance')}</div>
            <div className="b-about-uman-sub">{t('Gratis leiderschapsanalyse en consultatie, volledig vrijblijvend.', 'Free leadership analysis and consultation, no strings attached.')}</div>
            <a href="#contact" className="b-about-uman-link">{t('Meer info', 'Learn more')} →</a>
          </div>
        </div>
      </section>
    </>
  )
}
