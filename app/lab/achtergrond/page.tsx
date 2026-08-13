'use client'

import { useEffect, useRef, useState } from 'react'
import { BgLogo } from '@/components/ui/bg-logo'
import { DotMatrixBg, BRAND_COLORS } from '@/components/ui/dot-matrix-bg'

const INK = '#0e0d0b'
const BG = '#f2f0eb'
const MUT = '#787068'
const D = 'var(--font-display, var(--font-brutalist, system-ui))'
const B = 'var(--font-brutalist, system-ui)'
const M = 'var(--font-mono-brutalist, monospace)'

const PALETTES: Record<string, string[]> = {
  Merk: BRAND_COLORS,
  Groen: ['rgba(14,13,11,0)', 'rgba(26,94,53,0.08)', 'rgba(74,222,128,0.20)'],
  Terracotta: ['rgba(14,13,11,0)', 'rgba(201,100,66,0.10)', 'rgba(201,100,66,0.26)'],
  Inkt: ['rgba(14,13,11,0)', 'rgba(14,13,11,0.06)', 'rgba(14,13,11,0.16)'],
  Origineel: ['#FFFFFF', '#E07000', '#000000'],
}

export default function AchtergrondLab() {
  const [cellSize, setCellSize] = useState(6)
  const [gamma, setGamma] = useState(8)
  const [bias, setBias] = useState(2)
  const [frequency, setFrequency] = useState(1)
  const [speed, setSpeed] = useState(1)
  const [opacity, setOpacity] = useState(1)
  const [palette, setPalette] = useState('Merk')
  const [glyphs, setGlyphs] = useState(false)
  const [showLogo, setShowLogo] = useState(true)
  const [fps, setFps] = useState(0)

  // Ruwe framerate van de pagina, om te zien wat de shader kost
  const frames = useRef(0)
  useEffect(() => {
    let raf = 0
    let last = performance.now()
    const tick = (t: number) => {
      frames.current++
      if (t - last >= 1000) {
        setFps(frames.current)
        frames.current = 0
        last = t
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  const row = (
    label: string, value: number, min: number, max: number, step: number,
    set: (n: number) => void
  ) => (
    <label style={{ display: 'grid', gridTemplateColumns: '92px 1fr 42px', alignItems: 'center', gap: 10 }}>
      <span style={{ fontFamily: M, fontSize: 10, letterSpacing: '.12em', textTransform: 'uppercase', color: MUT }}>{label}</span>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={e => set(Number(e.target.value))} style={{ accentColor: '#c96442', width: '100%' }} />
      <span style={{ fontFamily: M, fontSize: 11, color: INK, textAlign: 'right' }}>{value}</span>
    </label>
  )

  return (
    <>
      <style>{`body { background: ${BG}; }`}</style>

      <DotMatrixBg
        colors={PALETTES[palette]}
        cellSize={cellSize}
        gamma={gamma}
        paletteBias={bias}
        frequency={frequency}
        speed={speed}
        opacity={opacity}
        useGlyphAtlas={glyphs}
        characters="LIG"
        fontFamily="var(--font-mono-brutalist, monospace)"
        fontWeight={700}
        fontSizePx={42}
      />
      {showLogo && <BgLogo />}

      {/* Voorbeeldinhoud, zodat je ziet of tekst leesbaar blijft */}
      <main style={{ position: 'relative', zIndex: 1, minHeight: '100svh', padding: '90px 44px 120px', maxWidth: 1180, margin: '0 auto' }}>
        <div style={{ fontFamily: M, fontSize: 11, letterSpacing: '.2em', textTransform: 'uppercase', color: '#c96442', marginBottom: 22 }}>
          Testpagina · dot matrix achtergrond
        </div>
        <h1 style={{ fontFamily: D, fontWeight: 700, fontSize: 'clamp(48px, 8vw, 118px)', lineHeight: .92, letterSpacing: '-.018em', textTransform: 'uppercase', color: INK, maxWidth: '13ch' }}>
          Je omzet lekt.<br />Elke maand.
        </h1>
        <p style={{ fontFamily: B, fontSize: 19, lineHeight: 1.6, color: MUT, maxWidth: '48ch', marginTop: 28 }}>
          Deze tekst staat er om te controleren of de achtergrond de leesbaarheid niet aantast. Zet de dekking lager als het onrustig wordt.
        </p>
        <div style={{ display: 'flex', marginTop: 36 }}>
          <span style={{ fontFamily: B, fontSize: 13, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', background: INK, color: BG, padding: '16px 28px', border: `2px solid ${INK}` }}>
            Toon mijn lek
          </span>
          <span style={{ fontFamily: B, fontSize: 13, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: INK, padding: '16px 28px', border: `2px solid ${INK}`, marginLeft: -2 }}>
            Plan gesprek
          </span>
        </div>

        <div style={{ marginTop: 90, borderTop: `3px solid ${INK}`, paddingTop: 40 }}>
          <h2 style={{ fontFamily: D, fontWeight: 700, fontSize: 'clamp(28px, 4vw, 52px)', lineHeight: .96, letterSpacing: '-.015em', textTransform: 'uppercase', color: INK }}>
            Tweede blok om te scrollen
          </h2>
          <p style={{ fontFamily: B, fontSize: 17, lineHeight: 1.7, color: MUT, maxWidth: '56ch', marginTop: 18 }}>
            De achtergrond staat op fixed, dus hij blijft staan terwijl je scrollt. Zo zie je of dat rustig aanvoelt of net storend wordt.
          </p>
        </div>
      </main>

      {/* Regelaars */}
      <aside style={{
        position: 'fixed', right: 20, top: 20, zIndex: 50, width: 296,
        background: '#fff', border: `3px solid ${INK}`, padding: 20,
        display: 'flex', flexDirection: 'column', gap: 12,
        maxHeight: 'calc(100svh - 40px)', overflowY: 'auto',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <span style={{ fontFamily: D, fontWeight: 700, fontSize: 17, textTransform: 'uppercase', color: INK }}>Regelaars</span>
          <span style={{ fontFamily: M, fontSize: 11, color: fps < 45 ? '#c96442' : '#1a5e35' }}>{fps} fps</span>
        </div>

        {row('Cellgrootte', cellSize, 1, 100, 1, setCellSize)}
        {row('Gamma', gamma, 1, 20, 1, setGamma)}
        {row('Bias', bias, 0, 20, 1, setBias)}
        {row('Frequentie', frequency, 1, 10, 1, setFrequency)}
        {row('Snelheid', speed, 0, 10, 1, setSpeed)}
        {row('Dekking', opacity, 0, 1, 0.05, setOpacity)}

        <div style={{ borderTop: `1px solid rgba(14,13,11,.15)`, paddingTop: 12 }}>
          <div style={{ fontFamily: M, fontSize: 10, letterSpacing: '.12em', textTransform: 'uppercase', color: MUT, marginBottom: 8 }}>Palet</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 0 }}>
            {Object.keys(PALETTES).map(k => (
              <button key={k} onClick={() => setPalette(k)}
                style={{
                  fontFamily: B, fontSize: 11, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase',
                  padding: '8px 12px', border: `2px solid ${INK}`, marginLeft: -2, marginTop: -2, cursor: 'pointer',
                  background: palette === k ? '#4ade80' : 'transparent', color: INK,
                }}>
                {k}
              </button>
            ))}
          </div>
        </div>

        <label style={{ display: 'flex', alignItems: 'center', gap: 9, cursor: 'pointer', marginTop: 4 }}>
          <input type="checkbox" checked={glyphs} onChange={e => setGlyphs(e.target.checked)} style={{ accentColor: '#1a5e35' }} />
          <span style={{ fontFamily: B, fontSize: 14, color: INK }}>Letters LIG in plaats van stippen</span>
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: 9, cursor: 'pointer' }}>
          <input type="checkbox" checked={showLogo} onChange={e => setShowLogo(e.target.checked)} style={{ accentColor: '#1a5e35' }} />
          <span style={{ fontFamily: B, fontSize: 14, color: INK }}>Draaiend logo tonen</span>
        </label>

        <div style={{ fontFamily: M, fontSize: 10, lineHeight: 1.6, color: MUT, borderTop: `1px solid rgba(14,13,11,.15)`, paddingTop: 12 }}>
          Huidige waarden voor in de code:<br />
          cellSize {cellSize} · gamma {gamma} · bias {bias} · freq {frequency} · speed {speed} · dekking {opacity} · palet {palette}{glyphs ? ' · glyphs' : ''}
        </div>
      </aside>
    </>
  )
}
