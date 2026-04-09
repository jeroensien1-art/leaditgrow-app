'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

type Lang = 'nl' | 'en'

interface LangContextType {
  lang: Lang
  setLang: (lang: Lang) => void
  t: (nl: string, en: string) => string
}

const LangContext = createContext<LangContextType>({
  lang: 'nl',
  setLang: () => {},
  t: (nl) => nl,
})

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('nl')
  const [mounted, setMounted] = useState(false)

  // On mount, read language from cookie (set by middleware)
  useEffect(() => {
    const langCookie = document.cookie
      .split('; ')
      .find((row) => row.startsWith('lang='))
      ?.split('=')[1] as Lang | undefined

    if (langCookie && (langCookie === 'nl' || langCookie === 'en')) {
      setLang(langCookie)
    }
    setMounted(true)
  }, [])

  const t = (nl: string, en: string) => (lang === 'nl' ? nl : en)

  return (
    <LangContext.Provider value={{ lang, setLang, t }}>
      {mounted ? children : null}
    </LangContext.Provider>
  )
}

export const useLang = () => useContext(LangContext)
