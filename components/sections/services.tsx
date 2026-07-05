'use client'

import { useEffect, useRef, useState } from 'react'
import { useLang } from '@/components/lang-context'

const B    = 'var(--font-brutalist, system-ui)'
const M    = 'var(--font-mono-brutalist, monospace)'
const INK  = '#0e0d0b'
const GRN  = '#1a5e35'
const LIME = '#4ade80'
const MUT  = '#787068'
const ORANGE = '#c96442'

function getLevels(t: (nl: string, en: string) => string) {
  return [
    {
      id: '01', name: 'Foundation',
      keywords: [t('Aanbod definiëren', 'Define offer'), t('ICP bepalen', 'Determine ICP'), 'Speed-to-lead'],
      desc: t(
        'Je hebt al klanten. De vraag is niet of je aanbod werkt, maar voor wie het het beste werkt en via welk kanaal je er meer van vindt.',
        'You already have customers. The question is not whether your offer works, but who it works best for and which channel brings you more of them.'
      ),
      actions: [t('Aanbod scherpen', 'Sharpen offer'), t('ICP vastleggen', 'Lock in ICP'), t('Kanaal kiezen', 'Choose channel')],
    },
    {
      id: '02', name: 'Capture',
      keywords: [t('CRM activeren', 'Activate CRM'), t('Leadmagneet bouwen', 'Build lead magnet'), t('Nurture sequentie', 'Nurture sequence')],
      desc: t(
        '60 tot 80% van de leads lekt weg omdat niemand ze consequent opvolgt. Een CRM en nurture sequentie verdubbelen je omzet zonder één extra lead.',
        '60 to 80% of leads leak away because nobody follows up consistently. A CRM and nurture sequence double your revenue without a single extra lead.'
      ),
      actions: [t('CRM inrichten', 'Set up CRM'), t('Leadmagneet live', 'Launch lead magnet'), t('Sequentie schrijven', 'Write sequence')],
    },
    {
      id: '03', name: 'Convert',
      keywords: [t('Salesscript documenteren', 'Document sales script'), 'Website CRO', 'Offer ladder'],
      desc: t(
        'Conversie van 25 naar 35% bouwt meer omzet dan een verdubbeling van je adbudget. Eerst de pipeline fixen, dan de kraan openzetten.',
        'Boosting conversion from 25 to 35% builds more revenue than doubling your ad budget. Fix the pipeline first, then open the tap.'
      ),
      actions: [t('Script documenteren', 'Document script'), t('Pagina optimaliseren', 'Optimise page'), t('Offer uitschrijven', 'Write out offer')],
    },
    {
      id: '04', name: 'Acquire',
      keywords: [t('Best kanaal opschalen', 'Scale best channel'), 'Retargeting', t('Tweede kanaal', 'Second channel')],
      desc: t(
        'Schaal alleen wat al bewezen converteert. Een nieuw kanaal in deze fase is een experiment van maximaal 10% van het budget.',
        'Only scale what already converts. A new channel at this stage is an experiment capped at 10% of the budget.'
      ),
      actions: [t('Kanaal opschalen', 'Scale channel'), t('Retargeting live', 'Launch retargeting'), t('Test & leer', 'Test & learn')],
    },
    {
      id: '05', name: 'Compound',
      keywords: [t('SEO als systeem', 'SEO as a system'), t('Videoprogramma', 'Video programme'), 'Thought leadership'],
      desc: t(
        'SEO en video starten hier pas gestructureerd. Tot dit niveau ontbreekt het budget om 12 tot 18 maanden geduldig te zijn voor het rendement komt.',
        'SEO and video only start in a structured way here. Below this level, there is no budget to stay patient for the 12 to 18 months it takes to pay off.'
      ),
      actions: [t('SEO structuur', 'SEO structure'), t('Videoprogramma', 'Video programme'), t('Content systeem', 'Content system')],
    },
    {
      id: '06', name: 'Multiply',
      keywords: ['AI agents', t('Partnerprogramma', 'Partner programme'), t('Categorie definiëren', 'Define category')],
      desc: t(
        'Brand, AI en partnerships zijn compounding assets. Jouw rol verschuift van uitvoering naar richting geven.',
        'Brand, AI, and partnerships are compounding assets. Your role shifts from execution to direction.'
      ),
      actions: [t('AI inzetten', 'Deploy AI'), t('Partners vinden', 'Find partners'), t('Categorie claimen', 'Claim category')],
    },
  ]
}

const INTERVAL = 2800

export function Services() {
  const { t } = useLang()
  const LEVELS = getLevels(t)
  const [openIdx, setOpenIdx] = useState(0)
  const hovered = useRef(false)
  const timer = useRef<ReturnType<typeof setInterval> | null>(null)
  const currentIdx = useRef(0)

  function openRow(idx: number) {
    setOpenIdx(idx)
    currentIdx.current = idx
  }

  function startCycle() {
    if (timer.current) return
    timer.current = setInterval(() => {
      if (!hovered.current) {
        const next = (currentIdx.current + 1) % LEVELS.length
        openRow(next)
      }
    }, INTERVAL)
  }

  function stopCycle() {
    if (timer.current) { clearInterval(timer.current); timer.current = null }
  }

  useEffect(() => {
    startCycle()
    return () => stopCycle()
  }, [])

  return (
    <>
      <style>{`
        .b-ladder-section {
          border-bottom: 3px solid ${INK};
          position: relative;
          z-index: 1;
        }
        .b-ladder-header-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          border-bottom: 2px solid ${INK};
        }
        .b-ladder-header-left {
          padding: 56px;
          border-right: 2px solid ${INK};
          border-top: 4px solid transparent;
          transition: background 0.4s, border-top-color 0.4s;
        }
        .b-ladder-header-right {
          padding: 56px;
          display: flex;
          align-items: flex-end;
        }
        .b-section-num {
          font-family: ${M};
          font-size: 11px;
          color: ${MUT};
          letter-spacing: .1em;
          margin-bottom: 18px;
        }
        .b-section-h2 {
          font-size: clamp(28px, 4vw, 52px);
          font-weight: 700;
          letter-spacing: -.04em;
          line-height: 1;
          text-transform: uppercase;
          font-family: ${B};
          color: ${INK};
        }
        .b-section-h2 .accent { color: ${GRN}; transition: color 0.4s; }
        .b-ladder-desc-text {
          font-size: 14px;
          color: ${MUT};
          line-height: 1.75;
          max-width: 380px;
          font-family: ${B};
        }

        /* ROWS */
        .b-ladder-row {
          display: grid;
          grid-template-columns: 72px 220px 1fr;
          border-bottom: 2px solid ${INK};
          border-left: 4px solid transparent;
          transition: background .15s, border-left-color .15s;
          cursor: default;
        }
        .b-ladder-row:not(.open):hover {
          background: ${INK};
          border-left-color: ${LIME};
        }
        .b-ladder-row:not(.open):hover .b-lr-num  { color: rgba(242,240,235,.5); }
        .b-ladder-row:not(.open):hover .b-lr-name { color: #fff; }
        .b-ladder-row:not(.open):hover .b-lr-kw   { border-color: rgba(255,255,255,.15); color: rgba(255,255,255,.35); }
        .b-ladder-row.open {
          background: rgba(26,94,53,0.05);
          border-left-color: ${GRN};
        }
        .b-lr-num {
          padding: 26px 20px;
          font-family: ${M};
          font-size: 11px;
          font-weight: 700;
          color: ${MUT};
          letter-spacing: .06em;
          border-right: 2px solid ${INK};
          display: flex;
          align-items: center;
          transition: color .15s;
        }
        .b-ladder-row.open .b-lr-num { color: ${GRN}; }
        .b-lr-name {
          padding: 26px 28px;
          font-size: 14px;
          font-weight: 700;
          color: ${INK};
          letter-spacing: -.01em;
          text-transform: uppercase;
          border-right: 2px solid ${INK};
          display: flex;
          align-items: flex-start;
          padding-top: 26px;
          font-family: ${B};
          transition: color .15s;
        }
        .b-lr-content {
          padding: 18px 28px;
          display: flex;
          flex-direction: column;
          gap: 0;
        }
        .b-lr-keywords { display: flex; gap: 8px; flex-wrap: wrap; padding: 8px 0; }
        .b-lr-kw {
          font-size: 11px;
          font-weight: 500;
          color: ${MUT};
          border: 1px solid rgba(0,0,0,.15);
          padding: 4px 11px;
          letter-spacing: .04em;
          transition: border-color .15s, color .15s, background .15s;
          font-family: ${B};
        }
        .b-ladder-row.open .b-lr-kw {
          border-color: ${GRN};
          color: ${GRN};
          font-weight: 700;
        }
        .b-lr-expand {
          display: none;
          padding-top: 12px;
          margin-top: 8px;
          border-top: 1px solid rgba(0,0,0,.07);
        }
        .b-ladder-row.open .b-lr-expand { display: block; }
        .b-lr-expand-desc {
          font-size: 13px;
          color: ${INK};
          line-height: 1.8;
          font-style: italic;
          opacity: .6;
          margin-bottom: 14px;
          max-width: 560px;
          font-family: ${B};
        }
        .b-lr-actions { display: flex; gap: 2px; }
        .b-lr-action {
          flex: 1;
          padding: 9px 12px;
          background: rgba(26,94,53,0.05);
          border-top: 2px solid ${GRN};
          font-size: 10px;
          font-weight: 700;
          letter-spacing: .1em;
          text-transform: uppercase;
          color: ${GRN};
          font-family: ${M};
          transition: background 0.4s, color 0.4s, border-color 0.4s;
        }

        /* CTA strip */
        .b-ladder-cta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          padding: 28px 40px;
          border-top: 3px solid ${GRN};
          flex-wrap: wrap;
        }
        .b-ladder-cta-label {
          font-size: 10px; font-weight: 700; letter-spacing: .16em;
          text-transform: uppercase; color: ${GRN}; margin-bottom: 6px;
          font-family: ${M};
        }
        .b-ladder-cta-title {
          font-size: 18px; font-weight: 800; color: ${INK};
          letter-spacing: -.02em; font-family: ${B};
        }
        .b-ladder-cta-btn {
          display: inline-flex; align-items: center; gap: 8px;
          background: ${ORANGE}; color: #fff; padding: 12px 22px;
          font-size: 12px; font-weight: 700; letter-spacing: .06em;
          text-transform: uppercase; text-decoration: none; flex-shrink: 0;
          font-family: ${B};
          transition: background .15s;
        }
        .b-ladder-cta-btn:hover { background: #a84f34; }

        /* SPOTLIGHT */
        .b-ladder-section.in-view .b-ladder-header-left {
          background: ${LIME};
          border-top-color: ${LIME};
        }
        .b-ladder-section.in-view .b-ladder-header-left .b-section-num { color: ${INK}; opacity: .5; }
        .b-ladder-section.in-view .b-ladder-header-left .b-section-h2 { color: ${INK}; }
        .b-ladder-section.in-view .b-section-h2 .accent { color: ${INK}; }
        .b-ladder-section.in-view .b-ladder-row.open {
          background: ${LIME};
          border-left-color: ${INK};
        }
        .b-ladder-section.in-view .b-ladder-row.open .b-lr-num  { color: rgba(14,13,11,.45); }
        .b-ladder-section.in-view .b-ladder-row.open .b-lr-name { color: ${INK}; }
        .b-ladder-section.in-view .b-ladder-row.open .b-lr-kw   { color: ${INK}; border-color: rgba(14,13,11,.3); font-weight: 700; }
        .b-ladder-section.in-view .b-ladder-row.open .b-lr-expand-desc { color: ${INK}; opacity: .6; }
        .b-ladder-section.in-view .b-ladder-row.open .b-lr-action {
          color: ${INK}; border-top-color: rgba(14,13,11,.35); background: rgba(14,13,11,.06);
        }

        @media (max-width: 900px) {
          .b-ladder-header-row { grid-template-columns: 1fr; }
          .b-ladder-header-right { display: none; }
          .b-ladder-header-left { padding: 40px 24px; }
          .b-ladder-row { grid-template-columns: 56px 1fr; }
          .b-lr-name { display: none; }
          .b-ladder-cta { padding: 24px; }
        }
      `}</style>

      <section className="b-ladder-section" id="services" data-spot>
        <div className="b-ladder-header-row">
          <div className="b-ladder-header-left">
            <div className="b-section-num">// 01 {t('Groeiladder', 'Growth Ladder')}</div>
            <h2 className="b-section-h2">
              {t('Het juiste', 'The right')}<br />
              {t('systeem op het', 'system at the')}<br />
              <span className="accent">{t('juiste moment.', 'right moment.')}</span>
            </h2>
          </div>
          <div className="b-ladder-header-right">
            <p className="b-ladder-desc-text">
              {t(
                'Per niveau de acties met de hoogste ROI. De volgorde is geen voorkeur. Het is fysica.',
                'Per level the actions with the highest ROI. The order is not a preference. It is physics.'
              )}
            </p>
          </div>
        </div>

        <div>
          {LEVELS.map((l, i) => (
            <div
              key={l.id}
              className={`b-ladder-row${openIdx === i ? ' open' : ''}`}
              onMouseEnter={() => { hovered.current = true; openRow(i) }}
              onMouseLeave={() => { hovered.current = false; startCycle() }}
            >
              <div className="b-lr-num">{l.id}</div>
              <div className="b-lr-name">{l.name}</div>
              <div className="b-lr-content">
                <div className="b-lr-keywords">
                  {l.keywords.map(k => (
                    <span key={k} className="b-lr-kw">{k}</span>
                  ))}
                </div>
                <div className="b-lr-expand">
                  <p className="b-lr-expand-desc">{l.desc}</p>
                  <div className="b-lr-actions">
                    {l.actions.map(a => (
                      <div key={a} className="b-lr-action">{a}</div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="b-ladder-cta">
          <div>
            <div className="b-ladder-cta-label">{t('Gratis rapport', 'Free report')}</div>
            <div className="b-ladder-cta-title">
              {t(
                'Vind je grootste lek. Dicht het in 14 dagen.',
                'Find your biggest leak. Close it in 14 days.'
              )}
            </div>
          </div>
          <a href="/diagnostic" className="b-ladder-cta-btn">
            {t('Toon mijn lek', 'Show me my leak')} →
          </a>
        </div>
      </section>
    </>
  )
}
