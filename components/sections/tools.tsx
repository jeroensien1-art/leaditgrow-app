'use client'

import { useLang } from '@/components/lang-context'

const B    = 'var(--font-brutalist, system-ui)'
const M    = 'var(--font-mono-brutalist, monospace)'
const INK  = '#0e0d0b'
const BG   = '#f2f0eb'
const GRN  = '#1a5e35'
const LIME = '#4ade80'
const MUT  = '#787068'

export function Tools() {
  const { t } = useLang()

  return (
    <>
      <style>{`
        .b-tools-section {
          border-bottom: 3px solid ${INK};
          background: ${INK};
          position: relative;
          z-index: 1;
          transition: background 0.4s;
        }
        .b-tools-header {
          display: grid;
          grid-template-columns: 1fr 1fr;
          border-bottom: 2px solid rgba(255,255,255,.08);
        }
        .b-tools-header-left {
          padding: 56px;
          border-right: 2px solid rgba(255,255,255,.08);
          transition: background 0.4s;
        }
        .b-tools-header-right {
          padding: 56px;
          display: flex;
          align-items: flex-end;
        }
        .b-tools-num {
          font-family: ${M};
          font-size: 11px;
          color: rgba(255,255,255,.3);
          letter-spacing: .1em;
          margin-bottom: 18px;
          transition: color 0.4s;
        }
        .b-tools-h2 {
          font-size: clamp(28px, 4vw, 52px);
          font-weight: 700;
          letter-spacing: -.04em;
          line-height: 1;
          text-transform: uppercase;
          font-family: ${B};
          color: ${BG};
          transition: color 0.4s;
        }
        .b-tools-h2 .accent { color: ${GRN}; transition: color 0.4s; }
        .b-tools-desc {
          font-size: 14px;
          color: rgba(242,240,235,.38);
          line-height: 1.75;
          max-width: 380px;
          font-family: ${B};
          transition: color 0.4s;
        }
        .b-tools-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
        }
        .b-tool-card {
          padding: 56px;
          border-right: 2px solid rgba(255,255,255,.08);
          border-top: 4px solid transparent;
          text-decoration: none;
          display: flex;
          flex-direction: column;
          gap: 22px;
          transition: background .15s, border-top-color .15s;
          cursor: pointer;
        }
        .b-tool-card:last-child { border-right: none; }
        .b-tool-card:hover {
          background: rgba(255,255,255,.03);
          border-top-color: ${GRN};
        }
        .b-tool-tag {
          font-family: ${M};
          font-size: 10px;
          font-weight: 700;
          letter-spacing: .14em;
          text-transform: uppercase;
          color: ${GRN};
        }
        .b-tool-title {
          font-size: 22px;
          font-weight: 700;
          letter-spacing: -.03em;
          line-height: 1.1;
          color: ${BG};
          font-family: ${B};
          transition: color 0.4s;
        }
        .b-tool-body {
          font-size: 13px;
          color: rgba(242,240,235,.45);
          line-height: 1.75;
          font-family: ${B};
          flex: 1;
          transition: color 0.4s;
        }
        .b-tool-cta {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-family: ${M};
          font-size: 11px;
          font-weight: 700;
          letter-spacing: .1em;
          text-transform: uppercase;
          color: ${GRN};
          transition: color 0.4s;
        }

        /* SPOTLIGHT */
        .b-tools-section.in-view .b-tools-header-left { background: ${LIME}; }
        .b-tools-section.in-view .b-tools-num { color: ${INK}; opacity: .5; }
        .b-tools-section.in-view .b-tools-h2 { color: ${INK}; }
        .b-tools-section.in-view .b-tools-h2 .accent { color: ${INK}; }
        .b-tools-section.in-view .b-tools-desc { color: rgba(14,13,11,.55); }
        .b-tools-section.in-view .b-tool-card { background: ${LIME}; border-top-color: ${INK}; border-right-color: rgba(14,13,11,.15); border-bottom-color: rgba(14,13,11,.15); }
        .b-tools-section.in-view .b-tool-title { color: ${INK}; }
        .b-tools-section.in-view .b-tool-body { color: rgba(14,13,11,.55); }
        .b-tools-section.in-view .b-tool-cta { color: ${INK}; }

        @media (max-width: 900px) {
          .b-tools-header { grid-template-columns: 1fr; }
          .b-tools-header-right { display: none; }
          .b-tools-header-left { padding: 40px 24px; }
          .b-tools-grid { grid-template-columns: 1fr; }
          .b-tool-card { padding: 36px 24px; border-right: none; border-bottom: 2px solid rgba(255,255,255,.08); }
        }
      `}</style>

      <section className="b-tools-section" id="tools" data-spot>
        <div className="b-tools-header">
          <div className="b-tools-header-left">
            <div className="b-tools-num">// 02 {t('Gratis tools', 'Free tools')}</div>
            <h2 className="b-tools-h2">
              {t('Waar wil', 'Where do')}<br />
              {t('je', 'you want')}<br />
              <span className="accent">{t('starten?', 'to start?')}</span>
            </h2>
          </div>
          <div className="b-tools-header-right">
            <p className="b-tools-desc">
              {t(
                'Twee gratis tools. Eén meet wat je verliest. De ander laat je zien wat je kunt winnen.',
                'Two free tools. One measures what you lose. The other shows what you can gain.'
              )}
            </p>
          </div>
        </div>

        <div className="b-tools-grid">
          <a href="/calculator" className="b-tool-card">
            <div className="b-tool-tag">{t('Hoeveel mis ik?', 'How much am I losing?')}</div>
            <div className="b-tool-title">{t('Revenue Calculator', 'Revenue Calculator')}</div>
            <p className="b-tool-body">
              {t(
                'Bereken in 2 minuten hoeveel omzet je maandelijks misloopt door trage opvolging.',
                'Calculate in 2 minutes how much revenue you lose monthly through slow follow-up.'
              )}
            </p>
            <div className="b-tool-cta">{t('Bereken mijn verlies', 'Calculate my leak')} →</div>
          </a>

          <a href="/diagnostic" className="b-tool-card">
            <div className="b-tool-tag">{t('Wat houdt mij tegen?', 'What is holding me back?')}</div>
            <div className="b-tool-title">{t('Business Diagnostic', 'Business Diagnostic')}</div>
            <p className="b-tool-body">
              {t(
                '6 gerichte vragen. Je ontvangt een persoonlijk rapport met je top 3 groeikansen en een 14-dagenplan.',
                '6 targeted questions. You get a personalised report with your top 3 growth gaps and a 14-day action plan.'
              )}
            </p>
            <div className="b-tool-cta">{t('Start gratis diagnose', 'Start free diagnostic')} →</div>
          </a>
        </div>
      </section>
    </>
  )
}
