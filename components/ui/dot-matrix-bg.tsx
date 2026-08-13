'use client'

import { useEffect, useState } from 'react'
import DottedBackground from '@/components/ui/dot-matrix'

// Merkpalet. De shader interpoleert van donker naar licht over deze lijst, dus
// de eerste kleur is de rustige zone en de laatste de accentzone. Alles met een
// lage alpha, want dit blijft achtergrond achter het logo.
export const BRAND_COLORS = [
  'rgba(14,13,11,0)',
  'rgba(26,94,53,0.10)',
  'rgba(201,100,66,0.16)',
]

type Props = {
  colors?: string[]
  frequency?: number
  speed?: number
  cellSize?: number
  gamma?: number
  paletteBias?: number
  useGlyphAtlas?: boolean
  characters?: string
  fontFamily?: string
  fontWeight?: string | number
  fontSizePx?: number
  /** Doorschijnendheid van de hele laag, los van de kleuren zelf. */
  opacity?: number
}

export function DotMatrixBg({
  colors = BRAND_COLORS,
  opacity = 1,
  ...rest
}: Props) {
  // De animatie draait continu op de GPU. Wie beweging heeft uitgezet krijgt
  // hem dus helemaal niet, in plaats van een stilstaand frame.
  const [allowed, setAllowed] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const apply = () => setAllowed(!mq.matches)
    apply()
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [])

  if (!allowed) return null

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        opacity,
      }}
    >
      <DottedBackground bgColor="transparent" colors={colors} {...rest} />
    </div>
  )
}
