'use client'

import { useState, useEffect } from 'react'
import { useLang } from '@/components/lang-context'

const B = 'var(--font-brutalist, system-ui)'
const M = 'var(--font-mono-brutalist, monospace)'
const INK = '#0e0d0b'
const BG  = '#f2f0eb'
const GRN = '#1a5e35'

export function Nav() {
  const { lang, t } = useLang()
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const close = () => setMenuOpen(false)
    window.addEventListener('scroll', close, { passive: true })
    return () => window.removeEventListener('scroll', close)
  }, [])

  const links = [
    { href: '/diensten',    label: t('Diensten', 'Services') },
    { href: '/#about',      label: t('Over', 'About') },
    { href: '/blog',        label: t('Blog', 'Blog') },
    { href: '/#contact',    label: t('Contact', 'Contact') },
  ]

  return (
    <>
      <style>{`
        .b-nav {
          position: sticky;
          top: 0;
          z-index: 100;
          background: ${INK};
          display: grid;
          grid-template-columns: 1fr auto;
          align-items: center;
          border-bottom: 3px solid ${INK};
        }
        .b-nav-brand {
          padding: 16px 28px;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: .12em;
          text-transform: uppercase;
          color: ${BG};
          text-decoration: none;
          border-right: 2px solid rgba(255,255,255,.1);
          font-family: ${B};
        }
        .b-nav-items {
          display: flex;
          list-style: none;
          align-items: stretch;
        }
        .b-nav-items li a {
          display: flex;
          align-items: center;
          padding: 16px 20px;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: .12em;
          text-transform: uppercase;
          color: rgba(242,240,235,.45);
          text-decoration: none;
          border-right: 1px solid rgba(255,255,255,.08);
          transition: color .15s, background .15s;
          font-family: ${B};
        }
        .b-nav-items li a:hover { color: ${BG}; background: rgba(255,255,255,.05); }
        .b-nav-cta {
          background: ${GRN} !important;
          color: #fff !important;
          font-weight: 700 !important;
          border-right: none !important;
          padding: 16px 24px !important;
        }
        .b-nav-cta:hover { background: #0f3d21 !important; }
        .b-nav-lang {
          padding: 16px 18px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: .12em;
          text-transform: uppercase;
          color: rgba(242,240,235,.4);
          text-decoration: none;
          border-left: 1px solid rgba(255,255,255,.08);
          transition: color .15s;
          font-family: ${M};
        }
        .b-nav-lang:hover { color: ${BG}; }
        .b-nav-hamburger {
          padding: 16px 18px;
          background: none;
          border: none;
          color: rgba(242,240,235,.6);
          cursor: pointer;
          font-size: 18px;
          line-height: 1;
          display: none;
        }
        .b-mobile-menu {
          background: ${INK};
          border-bottom: 3px solid ${INK};
          display: flex;
          flex-direction: column;
        }
        .b-mobile-menu a {
          padding: 14px 28px;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: .1em;
          text-transform: uppercase;
          color: rgba(242,240,235,.55);
          text-decoration: none;
          border-bottom: 1px solid rgba(255,255,255,.06);
          transition: color .15s;
          font-family: ${B};
        }
        .b-mobile-menu a:hover { color: ${BG}; }
        .b-mobile-menu a.cta { color: #4ade80; font-weight: 700; }
        @media (max-width: 768px) {
          .b-nav-items { display: none; }
          .b-nav-hamburger { display: block; }
        }
      `}</style>

      <nav className="b-nav">
        <a href="/#home" className="b-nav-brand">Lead it, Grow</a>
        <ul className="b-nav-items">
          {links.map(l => (
            <li key={l.href}><a href={l.href}>{l.label}</a></li>
          ))}
          <li>
            <a href="/diagnostic" className="b-nav-cta">
              {t('Start diagnose', 'Start diagnostic')}
            </a>
          </li>
          <a
            href={lang === 'nl' ? 'https://leaditgrow.com' : 'https://leaditgrow.be'}
            className="b-nav-lang"
          >
            {lang === 'nl' ? 'EN' : 'NL'}
          </a>
        </ul>
        <button
          className="b-nav-hamburger"
          onClick={() => setMenuOpen(v => !v)}
          aria-label="Menu"
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      </nav>

      {menuOpen && (
        <div className="b-mobile-menu">
          {links.map(l => (
            <a key={l.href} href={l.href} onClick={() => setMenuOpen(false)}>{l.label}</a>
          ))}
          <a href="/diagnostic" className="cta" onClick={() => setMenuOpen(false)}>
            {t('Start gratis diagnose', 'Start free diagnostic')}
          </a>
        </div>
      )}
    </>
  )
}
