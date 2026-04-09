'use client'

// Pine tree visual elements inspired by the illustrated pine illustration.
// Stack PineTreeLevel elements (each wider) under PineTreeTop.
// Use negative marginTop for overlap between levels.

const C_BODY  = '#0d4458'   // main teal needle mass
const C_SHADE = '#082e3d'   // shadow / undersides / wings
const C_LIME  = '#67a819'   // lime-green fresh growth highlights
const C_BARK  = '#5c3317'
const C_BARK_D= '#3a1f09'

// ─── Path helpers ─────────────────────────────────────────────────────────────

/**
 * Spiky polygon: alternates between outer radius and inner radius to create
 * the jagged needle-cluster silhouette characteristic of pine branches.
 * tips = number of spike tips (total points = tips * 2)
 * innerRatio = how far inner points sit relative to outer (0.8 = 20% inward)
 */
function spikyPath(
  cx: number, cy: number,
  rx: number, ry: number,
  tips: number,
  innerRatio = 0.82
): string {
  const total = tips * 2
  const pts = Array.from({ length: total }, (_, i) => {
    const angle = (i / total) * Math.PI * 2 - Math.PI / 2
    const r = i % 2 === 0 ? 1 : innerRatio
    const x = cx + Math.cos(angle) * rx * r
    const y = cy + Math.sin(angle) * ry * r
    return `${x.toFixed(1)},${y.toFixed(1)}`
  })
  return 'M ' + pts.join(' L ') + ' Z'
}

/** Triangular lime highlight for the lit upper face of a needle cluster */
function topHighlight(cx: number, top: number, rx: number, ry: number): string {
  const r = `${(cx + rx * 0.62).toFixed(1)},${(top + ry * 0.52).toFixed(1)}`
  const l = `${(cx - rx * 0.62).toFixed(1)},${(top + ry * 0.52).toFixed(1)}`
  return `M ${cx.toFixed(1)},${top.toFixed(1)} L ${r} L ${l} Z`
}

// ─── PineTreeTop ──────────────────────────────────────────────────────────────
// Pointed crown with 4 overlapping needle whorls.
// Use exactly once, at the very top.

export function PineTreeTop({ width = 200, className, style }: {
  width?: number
  className?: string
  style?: React.CSSProperties
}) {
  const VW = 220, VH = 310

  // [cx, cy, rx, ry, tips, innerRatio]
  // Ordered bottom-up so larger whorls paint first, smaller whorls on top
  const whorls: [number, number, number, number, number, number][] = [
    [110, 228, 96, 66, 20, 0.82],   // whorl 1 - largest, bottom
    [110, 165, 76, 56, 18, 0.81],   // whorl 2
    [110, 108, 58, 46, 16, 0.80],   // whorl 3
    [110,  52, 42, 36, 13, 0.78],   // whorl 4 - smallest, top
  ]

  return (
    <svg
      viewBox={`0 0 ${VW} ${VH}`}
      width={width}
      height={Math.round(width * VH / VW)}
      className={className}
      style={{ display: 'block', ...style }}
      overflow="visible"
    >
      {/* Draw bottom-up so top whorls paint over lower ones */}
      {whorls.map(([cx, cy, rx, ry, tips, ir], i) => (
        <g key={i}>
          <path d={spikyPath(cx, cy, rx, ry, tips, ir)} fill={C_BODY} />
          <path d={topHighlight(cx, cy - ry, rx, ry)} fill={C_LIME} opacity={0.52} />
        </g>
      ))}

      {/* Trunk nub at the base of the crown */}
      <rect x={104} y={292} width={12} height={18} rx={2} fill={C_BARK} />
    </svg>
  )
}

// ─── PineTreeLevel ────────────────────────────────────────────────────────────
// One horizontal branch tier. Repeat this with increasing widths to build
// the layered body of the tree. Use negative marginTop for natural overlap.

export function PineTreeLevel({ width = 400, className, style }: {
  width?: number
  className?: string
  style?: React.CSSProperties
}) {
  const VW = 580, VH = 130

  // Main central mass: wide horizontal needle cluster
  const body = spikyPath(290, 66, 236, 58, 24, 0.84)

  // Side wings: smaller clusters at each branch tip
  const wingL = spikyPath(62, 66, 64, 42, 14, 0.80)
  const wingR = spikyPath(518, 66, 64, 42, 14, 0.80)

  // Highlights
  const hlBody = topHighlight(290, 8, 236, 58)
  const hlL    = topHighlight(62, 24, 64, 42)
  const hlR    = topHighlight(518, 24, 64, 42)

  return (
    <svg
      viewBox={`0 0 ${VW} ${VH}`}
      width={width}
      height={Math.round(width * VH / VW)}
      className={className}
      style={{ display: 'block', ...style }}
      overflow="visible"
    >
      {/* Wings sit behind main body */}
      <path d={wingL} fill={C_SHADE} />
      <path d={wingR} fill={C_SHADE} />

      {/* Main needle mass */}
      <path d={body} fill={C_BODY} />

      {/* Lime highlights — light hitting the top face */}
      <path d={hlBody} fill={C_LIME} opacity={0.50} />
      <path d={hlL}    fill={C_LIME} opacity={0.36} />
      <path d={hlR}    fill={C_LIME} opacity={0.36} />

      {/* Visible branch lines radiating from trunk */}
      <line x1={290} y1={32} x2={520} y2={70} stroke={C_SHADE} strokeWidth={3} opacity={0.38} />
      <line x1={290} y1={32} x2={60}  y2={70} stroke={C_SHADE} strokeWidth={3} opacity={0.38} />
    </svg>
  )
}

// ─── PineTreeTrunk ────────────────────────────────────────────────────────────
// Brown bark trunk. Place below the last PineTreeLevel.

export function PineTreeTrunk({ width = 26, height = 70, className, style }: {
  width?: number
  height?: number
  className?: string
  style?: React.CSSProperties
}) {
  return (
    <div
      className={className}
      style={{
        width,
        height,
        background: `linear-gradient(to bottom, ${C_BARK}, ${C_BARK_D})`,
        borderRadius: '1px 1px 5px 5px',
        boxShadow: 'inset -4px 0 8px rgba(0,0,0,0.45), inset 2px 0 4px rgba(255,255,255,0.07)',
        flexShrink: 0,
        ...style,
      }}
    />
  )
}

// ─── PineTree (composed) ──────────────────────────────────────────────────────
// Convenience wrapper: stacks Top + Levels + Trunk automatically.
//
// levels     — array of widths per level, top to bottom (each should be wider)
// topWidth   — width of the crown
// overlap    — px of vertical overlap between consecutive elements
// trunkHeight — px height of the trunk
//
// Example:
//   <PineTree topWidth={160} levels={[210, 270, 330]} overlap={38} />

export function PineTree({
  levels      = [260, 330, 400],
  topWidth    = 200,
  overlap     = 40,
  trunkHeight = 70,
  className,
}: {
  levels?:      number[]
  topWidth?:    number
  overlap?:     number
  trunkHeight?: number
  className?:   string
}) {
  return (
    <div className={`flex flex-col items-center ${className ?? ''}`} style={{ overflow: 'visible' }}>
      <PineTreeTop width={topWidth} />
      {levels.map((w, i) => (
        <PineTreeLevel key={i} width={w} style={{ marginTop: -overlap }} />
      ))}
      <PineTreeTrunk height={trunkHeight} style={{ marginTop: -6 }} />
    </div>
  )
}
