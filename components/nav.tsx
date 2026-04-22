'use client'

import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'
import { useLang } from '@/components/lang-context'
import { LogoFull } from '@/components/ui/logo-svg'

export function Nav() {
  const { lang, setLang, t } = useLang()
  const [open, setOpen] = useState(false)

  // Close mobile menu on scroll
  useEffect(() => {
    const close = () => setOpen(false)
    window.addEventListener('scroll', close, { passive: true })
    return () => window.removeEventListener('scroll', close)
  }, [])

  const links = [
    { href: '/diensten',   label: t('Diensten', 'Services') },
    { href: '/#about',     label: t('Over', 'About') },
    { href: '/blog',       label: t('Blog', 'Blog') },
    { href: '/#contact',   label: t('Contact', 'Contact') },
    { href: '/diagnostic', label: t('Gratis diagnose', 'Free diagnostic'), accent: true },
  ]

  const pillStyle: React.CSSProperties = {
    background: 'rgba(250,249,245,0.88)',
    backdropFilter: 'blur(12px)',
    boxShadow: '0 4px 24px rgba(0,0,0,0.12), 0 0 0 1px rgba(61,57,41,0.08)',
    color: '#3d3929',
    whiteSpace: 'nowrap',
  }

  return (
    <nav
      className="fixed top-5 left-1/2 z-50"
      style={{ transform: 'translateX(-50%)', maxWidth: 'calc(100vw - 2rem)', width: 'max-content' }}
    >
      {/* ── Pill bar ── */}
      <div className="flex items-center gap-4 px-5 py-2.5 rounded-full text-sm font-medium" style={pillStyle}>

        {/* Logo — smaller height so it sits neatly inside the pill */}
        <a href="/#home" className="flex-shrink-0">
          <LogoFull height={30} textColor="#3d3929" />
        </a>

        {/* ── Desktop links (hidden on mobile) ── */}
        <div className="hidden md:flex items-center gap-4">
          <div className="w-px h-4" style={{ background: 'rgba(61,57,41,0.2)' }} />
          {links.map(link => (
            <a
              key={link.href}
              href={link.href}
              className="hover:text-[#c96442] transition-colors"
              style={link.accent ? { color: '#c96442', fontWeight: 600 } : {}}
            >
              {link.label}
            </a>
          ))}
          <div className="w-px h-4" style={{ background: 'rgba(61,57,41,0.2)' }} />
        </div>

        {/* Lang toggle — redirects between .be (NL) and .com (EN) */}
        <a
          href={lang === 'nl' ? 'https://leaditgrow.com' : 'https://leaditgrow.be'}
          className="flex items-center rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider transition-all"
          style={{
            background: 'rgba(201,100,66,0.1)',
            color: '#c96442',
            border: '1px solid rgba(201,100,66,0.25)',
            textDecoration: 'none',
          }}
        >
          {lang === 'nl' ? 'EN' : 'NL'}
        </a>

        {/* ── Hamburger (mobile only) ── */}
        <button
          onClick={() => setOpen(v => !v)}
          className="flex md:hidden items-center justify-center w-8 h-8 rounded-full transition-colors"
          style={{ background: open ? 'rgba(201,100,66,0.1)' : 'transparent', color: '#3d3929' }}
          aria-label="Menu"
        >
          {open ? <X size={16} /> : <Menu size={16} />}
        </button>
      </div>

      {/* ── Mobile dropdown ── */}
      {open && (
        <div
          className="md:hidden mt-2 rounded-2xl overflow-hidden"
          style={{
            background: 'rgba(250,249,245,0.97)',
            backdropFilter: 'blur(12px)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.14), 0 0 0 1px rgba(61,57,41,0.08)',
            minWidth: '200px',
            position: 'absolute',
            right: 0,
            top: '100%',
          }}
        >
          {links.map((link, i) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="flex items-center px-5 py-3.5 text-sm font-medium transition-colors hover:bg-[rgba(201,100,66,0.06)]"
              style={{
                color: link.accent ? '#c96442' : '#3d3929',
                fontWeight: link.accent ? 600 : 500,
                borderTop: i > 0 ? '1px solid rgba(61,57,41,0.07)' : 'none',
              }}
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  )
}
