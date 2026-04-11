'use client'

import { useLang } from '@/components/lang-context'
import { LogoFull } from '@/components/ui/logo-svg'

export function Nav() {
  const { lang, setLang, t } = useLang()

  return (
    <nav
      className="fixed top-5 left-1/2 z-50"
      style={{ transform: 'translateX(-50%)' }}
    >
      <div
        className="flex items-center gap-6 px-6 py-3 rounded-full text-sm font-medium"
        style={{
          background: 'rgba(250,249,245,0.85)',
          backdropFilter: 'blur(12px)',
          boxShadow: '0 4px 24px rgba(0,0,0,0.12), 0 0 0 1px rgba(61,57,41,0.08)',
          color: '#3d3929',
        }}
      >
        <a href="#home">
          <LogoFull height={64} textColor="#3d3929" />
        </a>

        <div className="w-px h-4" style={{ background: 'rgba(61,57,41,0.2)' }} />

        <a href="#services" className="hover:text-[#c96442] transition-colors">{t('Diensten', 'Services')}</a>
        <a href="#about" className="hover:text-[#c96442] transition-colors">{t('Over', 'About')}</a>
        <a href="#contact" className="hover:text-[#c96442] transition-colors">{t('Contact', 'Contact')}</a>
        <a href="/diagnostic" className="hover:text-[#c96442] transition-colors font-semibold" style={{ color: '#c96442' }}>{t('Gratis diagnose', 'Free diagnostic')}</a>

        <div className="w-px h-4" style={{ background: 'rgba(61,57,41,0.2)' }} />

        {/* Language toggle */}
        <button
          onClick={() => setLang(lang === 'nl' ? 'en' : 'nl')}
          className="flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider transition-all"
          style={{
            background: 'rgba(201,100,66,0.1)',
            color: '#c96442',
            border: '1px solid rgba(201,100,66,0.25)',
          }}
        >
          {lang === 'nl' ? 'EN' : 'NL'}
        </button>
      </div>
    </nav>
  )
}
