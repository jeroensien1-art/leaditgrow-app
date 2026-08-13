'use client'

import { useLang } from '@/components/lang-context'

const B   = 'var(--font-brutalist, system-ui)'
const D   = 'var(--font-display, var(--font-brutalist, system-ui))'
const M   = 'var(--font-mono-brutalist, monospace)'
const INK = '#0e0d0b'
const BG  = '#f2f0eb'
const GRN = '#1a5e35'
const LIME = '#4ade80'
const MUT = '#787068'
const ORANGE = '#c96442'

export function Hero() {
  const { t } = useLang()

  return (
    <>
      <style>{`
        .b-hero {
          min-height: 100svh;
          display: grid;
          grid-template-rows: 1fr;
          border-bottom: 3px solid ${INK};
          position: relative;
          z-index: 1;
        }
        .b-hero-main {
          display: grid;
          grid-template-columns: 1fr 320px;
        }
        .b-hero-left {
          padding: 60px 60px;
          border-right: 2px solid ${INK};
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        .b-hero-year {
          font-family: ${M};
          font-size: 13px;
          color: ${MUT};
          letter-spacing: .08em;
          margin-bottom: 36px;
        }
        .b-hero-h1 {
          font-size: clamp(48px, 7vw, 112px);
          font-weight: 700;
          line-height: .92;
          letter-spacing: -.02em;
          color: ${INK};
          text-transform: uppercase;
          font-family: ${D};
        }
        .b-hero-h1 .accent-word { color: ${ORANGE}; display: block; transition: color 0.4s; }
        .b-hero-h1 .outline-word {
          -webkit-text-stroke: 2px ${INK};
          color: transparent;
          display: block;
        }
        .b-hero-bottom {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 20px;
          margin-top: 36px;
          flex-wrap: wrap;
        }
        /* Ongeveer de helft van de hoofdkop, zodat de belofte meeleest als
           tweede kop en niet als bijschrift. */
        .b-hero-tagline {
          font-size: clamp(20px, 3vw, 48px);
          color: ${MUT};
          line-height: 1.2;
          letter-spacing: -.01em;
          max-width: 24ch;
          margin-top: 28px;
          font-family: ${B};
        }
        .b-hero-ctas { display: flex; gap: 0; flex-shrink: 0; }
        .b-btn-black {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: ${INK};
          color: ${BG};
          font-size: 14px;
          font-weight: 700;
          letter-spacing: .1em;
          text-transform: uppercase;
          padding: 15px 26px;
          text-decoration: none;
          border: 2px solid ${INK};
          transition: background .15s, border-color .15s, color .15s, box-shadow 0.4s;
          font-family: ${B};
        }
        .b-btn-black:hover { background: ${GRN}; border-color: ${GRN}; }
        .b-btn-outline {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: transparent;
          color: ${INK};
          font-size: 14px;
          font-weight: 700;
          letter-spacing: .1em;
          text-transform: uppercase;
          padding: 15px 26px;
          text-decoration: none;
          border: 2px solid ${INK};
          margin-left: -2px;
          transition: background .15s, color .15s, box-shadow 0.4s, border-color 0.4s;
          font-family: ${B};
        }
        .b-btn-outline:hover { background: ${INK}; color: ${BG}; }

        /* RIGHT SIDEBAR */
        .b-hero-right { display: flex; flex-direction: column; }
        .b-hero-right-top {
          flex: 1;
          padding: 40px 28px;
          border-bottom: 2px solid ${INK};
          background: ${INK};
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .b-hero-stat-big {
          font-size: 68px;
          font-weight: 700;
          letter-spacing: -.04em;
          line-height: 1;
          color: ${LIME};
          font-family: ${M};
        }
        .b-hero-stat-label {
          font-size: 13px;
          color: rgba(242,240,235,.45);
          letter-spacing: .06em;
          text-transform: uppercase;
          line-height: 1.55;
          border-top: 1px solid rgba(255,255,255,.1);
          padding-top: 14px;
          font-family: ${M};
        }
        .b-hero-right-mid {
          padding: 28px;
          border-bottom: 2px solid ${INK};
          background: ${GRN};
          transition: background 0.4s, box-shadow 0.4s;
        }
        .b-hero-right-mid p {
          font-family: ${M};
          font-size: 12px;
          color: rgba(255,255,255,.6);
          text-transform: uppercase;
          letter-spacing: .1em;
          margin-bottom: 10px;
        }
        .b-hero-right-mid strong {
          display: block;
          font-size: 17px;
          font-weight: 700;
          color: #fff;
          line-height: 1.4;
          font-family: ${B};
        }
        .b-hero-right-bot {
          padding: 24px 28px;
          background: ${INK};
          overflow: hidden;
        }
        .b-hero-ticker {
          font-family: ${M};
          font-size: 12px;
          letter-spacing: .08em;
          color: rgba(255,255,255,.25);
          white-space: nowrap;
          overflow: hidden;
        }
        .b-hero-ticker span {
          display: inline-block;
          animation: hero-ticker 18s linear infinite;
        }
        @keyframes hero-ticker {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }

        /* SPOTLIGHT */
        .b-hero.in-view .b-btn-black {
          background: ${LIME};
          color: ${INK};
          border-color: ${LIME};
          box-shadow: 0 0 28px rgba(74,222,128,0.3);
        }
        .b-hero.in-view .b-hero-right-mid {
          background: ${LIME};
          box-shadow: none;
        }
        .b-hero.in-view .b-hero-right-mid p    { color: ${INK}; }
        .b-hero.in-view .b-hero-right-mid strong { color: ${INK}; }

        @media (max-width: 900px) {
          .b-hero-main { grid-template-columns: 1fr; }
          .b-hero-right { display: none; }
          .b-hero-left { padding: 40px 24px; }
          .b-hero-h1 { font-size: 52px; }
          .b-hero-tagline { font-size: 20px; margin-top: 20px; }
          .b-hero-bottom { flex-direction: column; align-items: flex-start; }
        }
      `}</style>

      <section className="b-hero" id="home" data-spot>
        <div className="b-hero-main">
          <div className="b-hero-left">
            <div className="b-hero-year">
              {t('Vrijheid en groei voor ondernemers', 'Freedom and growth for entrepreneurs')} · 2026
            </div>

            <div className="b-hero-copy">
              <h1 className="b-hero-h1">
                <span>{t('Je omzet', 'Your revenue')}</span>
                <span className="accent-word">{t('lekt.', 'leaks.')}</span>
                <span className="outline-word">{t('Elke maand.', 'Every month.')}</span>
              </h1>

              <p className="b-hero-tagline">
                {t(
                  'Wij zetten die verloren tijd en moeite om in omzet die zichzelf doet groeien voor jou.',
                  'We turn that lost time and effort into revenue that grows itself for you.'
                )}
              </p>
            </div>

            <div className="b-hero-bottom">
              <div className="b-hero-ctas">
                <a href="/diagnostic" className="b-btn-black">{t('Toon mijn lek', 'Show me my leak')} →</a>
                <a href="#contact" className="b-btn-outline">{t('Plan gesprek', 'Book a call')}</a>
              </div>
            </div>
          </div>

          <div className="b-hero-right">
            <div className="b-hero-right-top">
              <div className="b-hero-stat-big">78%</div>
              <div className="b-hero-stat-label">
                {t('van leads verloren bij\nopvolging na 2 uur', 'of leads lost when\nfollow-up takes 2+ hours')}
              </div>
            </div>
            <div className="b-hero-right-mid">
              <p>{t('Gratis rapport', 'Free report')}</p>
              <strong>
                {t(
                  'De 3 lekken die jou nu het meeste kosten, plus een 14-dagenplan om ze te dichten.',
                  'The 3 leaks costing you the most right now, plus a 14-day plan to close them.'
                )}
              </strong>
            </div>
            <div className="b-hero-right-bot">
              <div className="b-hero-ticker">
                <span>Foundation · Capture · Convert · Acquire · Compound · Multiply · Foundation · Capture · Convert · Acquire · Compound · Multiply · </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
