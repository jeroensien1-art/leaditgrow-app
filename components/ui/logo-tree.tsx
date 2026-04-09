export function LogoTree({ size = 32, color = '#c96442', className }: {
  size?: number
  color?: string
  className?: string
}) {
  // 3 triangles, each wider and lower than the previous.
  // Viewbox 40×36, trunk is a small rect at the bottom.
  return (
    <svg
      viewBox="0 0 40 38"
      width={size}
      height={Math.round(size * 38 / 40)}
      className={className}
      aria-label="Lead it, Grow logo"
      fill={color}
    >
      {/* Top triangle — narrowest */}
      <polygon points="20,2 27,13 13,13" />
      {/* Middle triangle */}
      <polygon points="20,9 31,22 9,22" />
      {/* Bottom triangle — widest */}
      <polygon points="20,16 40,33 0,33" />
      {/* Trunk */}
      <rect x="17.5" y="33" width="5" height="5" rx="1" />
    </svg>
  )
}
