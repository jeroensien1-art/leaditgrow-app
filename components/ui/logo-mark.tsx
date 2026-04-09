'use client'

import { useId } from 'react'

// ─── LogoMark ─────────────────────────────────────────────────────────────────
// Three right-half-triangle OUTLINES that form an L shape and interlock
// like chain links (each tier passes through the one above it).
//
// `bg` must match the surface the logo sits on (the "hole" in chain links).

export function LogoMark({
  size = 40,
  color = '#c96442',
  bg = '#faf9f5',
  className,
}: {
  size?: number
  color?: string
  bg?: string
  className?: string
}) {
  const uid = useId().replace(/[^a-z0-9]/gi, '')
  const sw = 2.4

  // Three right-half triangles — apex on the left (the vertical cut),
  // hypotenuse going down-right. Together they trace an L silhouette.
  //
  // All share the same cut edge at x = 26.
  // Heights: 18 / 24 / 30  |  Widths: 14 / 19 / 24  (consistent ~0.8 slope)
  //
  //  L1  apex (26,2)   → base (26,20) and (40,20)
  //  L2  apex (26,14)  → base (26,38) and (45,38)   overlap L1: y 14-20
  //  L3  apex (26,28)  → base (26,58) and (50,58)   overlap L2: y 28-38

  const p1 = 'M 26,2 L 26,20 L 40,20 Z'
  const p2 = 'M 26,14 L 26,38 L 45,38 Z'
  const p3 = 'M 26,28 L 26,58 L 50,58 Z'

  // Chain interlock: each link passes THROUGH the one above.
  // Overlap split points (midpoint of each overlap zone):
  //   L1-L2 overlap y=14..20  →  split at y=17
  //   L2-L3 overlap y=28..38  →  split at y=33
  //
  // Draw order (back to front):
  //   1. L3 full            — starts behind
  //   2. L2 full            — covers L3 top  → L2 in front of L3's top ✓
  //   3. L1 full            — covers L2 top  → L1 in front of L2's top ✓
  //   4. L2 clipped y≥17   — L2 bottom now in front of L1's bottom ✓
  //   5. L3 clipped y≥33   — L3 bottom now in front of L2's bottom ✓

  const lp = {
    stroke: color,
    strokeWidth: sw,
    strokeLinejoin: 'round' as const,
    fill: bg,
  }

  return (
    <svg
      viewBox="0 0 52 60"
      width={size}
      height={Math.round(size * 60 / 52)}
      className={className}
      aria-label="Lead it, Grow"
      overflow="visible"
    >
      <defs>
        <clipPath id={`${uid}fl2`}>
          <rect x="0" y="17" width="52" height="60" />
        </clipPath>
        <clipPath id={`${uid}fl3`}>
          <rect x="0" y="33" width="52" height="60" />
        </clipPath>
      </defs>

      <path d={p3} {...lp} />
      <path d={p2} {...lp} />
      <path d={p1} {...lp} />
      <path d={p2} {...lp} clipPath={`url(#${uid}fl2)`} />
      <path d={p3} {...lp} clipPath={`url(#${uid}fl3)`} />
    </svg>
  )
}

// ─── LogoFull ─────────────────────────────────────────────────────────────────
// LogoMark + "Lead it, Grow" wordmark side by side.
// "Grow" is accented in the brand color; the rest uses textColor.

export function LogoFull({
  height = 44,
  color = '#c96442',
  textColor = '#3d3929',
  bg = '#faf9f5',
  className,
}: {
  height?: number
  color?: string
  textColor?: string
  bg?: string
  className?: string
}) {
  const fs = height * 0.52

  return (
    <div className={`inline-flex items-center gap-3 ${className ?? ''}`}>
      <LogoMark size={Math.round(height * 0.72)} color={color} bg={bg} />
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
        <span style={{ color, fontWeight: 500 }}>Grow</span>
      </span>
    </div>
  )
}
