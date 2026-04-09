'use client'

import { useId } from 'react'

// ─── LogoSVG ──────────────────────────────────────────────────────────────────
// The actual Lead it, Grow logo mark: 3 right-angled half-triangles (outline)
// forming an L-shape, interlocked like chain links.
//
// Coordinates are normalized from the original 1500×1500 artwork.
// Draw order: T3 (back) → T2 → T1 (front) = painter's algorithm chain effect.
//
//  T1 apex: (0, 0)      base: (0,57)  → (41, 57)    [top, narrowest]
//  T2 apex: (10.5, 37)  base: (10.5,88) → (59, 88)  [mid, connector link]
//  T3 apex: (0, 62)     base: (0,119) → (100, 119)   [bottom, widest]

export function LogoSVG({
  size = 40,
  className,
  style,
}: {
  size?: number
  className?: string
  style?: React.CSSProperties
}) {
  const uid = useId().replace(/[^a-z0-9]/gi, '')
  const h = Math.round(size * 119 / 100)

  return (
    <svg
      viewBox="-2 -2 104 123"
      width={size}
      height={h}
      className={className}
      style={{ display: 'block', ...style }}
      aria-label="Lead it, Grow"
      overflow="visible"
    >
      <defs>
        <linearGradient id={`${uid}g`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="#c96342" />
          <stop offset="100%" stopColor="#ff904d" />
        </linearGradient>
      </defs>

      {/* T3 — bottom, widest (drawn first = behind) */}
      <path
        d="M 0,62 L 0,119 L 100,119 Z"
        fill="none"
        stroke={`url(#${uid}g)`}
        strokeWidth="7"
        strokeLinejoin="miter"
        strokeLinecap="butt"
      />

      {/* T2 — middle, chain link connector */}
      <path
        d="M 10.5,37 L 10.5,88 L 59,88 Z"
        fill="none"
        stroke={`url(#${uid}g)`}
        strokeWidth="7"
        strokeLinejoin="miter"
        strokeLinecap="butt"
      />

      {/* T1 — top, narrowest (drawn last = front) */}
      <path
        d="M 0,0 L 0,57 L 41,57 Z"
        fill="none"
        stroke={`url(#${uid}g)`}
        strokeWidth="7"
        strokeLinejoin="miter"
        strokeLinecap="butt"
      />
    </svg>
  )
}

// ─── LogoFull ─────────────────────────────────────────────────────────────────
// Logo mark + "Lead it, Grow" wordmark side by side.

export function LogoFull({
  height = 44,
  textColor = '#3d3929',
  className,
}: {
  height?: number
  textColor?: string
  className?: string
}) {
  const markSize = Math.round(height * 0.68)
  const fs = height * 0.44

  return (
    <div className={`inline-flex items-center gap-3 ${className ?? ''}`}>
      <LogoSVG size={markSize} />
      <span
        style={{
          fontFamily: 'var(--font-serif)',
          fontStyle: 'italic',
          fontWeight: 400,
          fontSize: fs,
          color: textColor,
          letterSpacing: '-0.01em',
          lineHeight: 1,
          whiteSpace: 'nowrap',
        }}
      >
        Lead it,{' '}
        <span style={{ color: '#c96442', fontWeight: 500 }}>Grow</span>
      </span>
    </div>
  )
}
