// Logo preview — visit /logo-preview

import { LogoSVG, LogoFull } from '@/components/ui/logo-svg'

const bg = '#faf9f5'
const dark = '#0a1e10'

export default function LogoPreview() {
  return (
    <div style={{ background: '#141414', minHeight: '100vh', padding: '56px 48px', fontFamily: 'sans-serif' }}>
      <p style={{ color: '#444', fontSize: 11, marginBottom: 52, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
        Logo preview — pick a variant
      </p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 56, alignItems: 'flex-start' }}>

        {/* A — mark on dark, small */}
        <div>
          <p style={{ color: '#555', fontSize: 11, marginBottom: 14, letterSpacing: '0.09em', textTransform: 'uppercase' }}>A — mark · dark · 40px</p>
          <div style={{ background: dark, padding: 24, borderRadius: 12, display: 'inline-block' }}>
            <LogoSVG size={40} />
          </div>
        </div>

        {/* B — mark on light, small */}
        <div>
          <p style={{ color: '#555', fontSize: 11, marginBottom: 14, letterSpacing: '0.09em', textTransform: 'uppercase' }}>B — mark · light · 40px</p>
          <div style={{ background: bg, padding: 24, borderRadius: 12, display: 'inline-block' }}>
            <LogoSVG size={40} />
          </div>
        </div>

        {/* C — full logo dark */}
        <div>
          <p style={{ color: '#555', fontSize: 11, marginBottom: 14, letterSpacing: '0.09em', textTransform: 'uppercase' }}>C — full · dark</p>
          <div style={{ background: dark, padding: 24, borderRadius: 12, display: 'inline-block' }}>
            <LogoFull height={44} textColor="#faf9f5" />
          </div>
        </div>

        {/* D — full logo light */}
        <div>
          <p style={{ color: '#555', fontSize: 11, marginBottom: 14, letterSpacing: '0.09em', textTransform: 'uppercase' }}>D — full · light</p>
          <div style={{ background: bg, padding: 24, borderRadius: 12, display: 'inline-block' }}>
            <LogoFull height={44} textColor="#3d3929" />
          </div>
        </div>

        {/* E — mark large detail */}
        <div>
          <p style={{ color: '#555', fontSize: 11, marginBottom: 14, letterSpacing: '0.09em', textTransform: 'uppercase' }}>E — mark · dark · 120px (detail)</p>
          <div style={{ background: dark, padding: 24, borderRadius: 12, display: 'inline-block' }}>
            <LogoSVG size={120} />
          </div>
        </div>

        {/* F — inline nav size light */}
        <div>
          <p style={{ color: '#555', fontSize: 11, marginBottom: 14, letterSpacing: '0.09em', textTransform: 'uppercase' }}>F — inline · light (nav size)</p>
          <div style={{ background: bg, padding: 16, borderRadius: 12, display: 'inline-block' }}>
            <LogoFull height={32} textColor="#3d3929" />
          </div>
        </div>

        {/* G — hero size on dark */}
        <div>
          <p style={{ color: '#555', fontSize: 11, marginBottom: 14, letterSpacing: '0.09em', textTransform: 'uppercase' }}>G — hero mark · dark · 72px</p>
          <div style={{ background: dark, padding: 32, borderRadius: 12, display: 'inline-block' }}>
            <LogoSVG size={72} />
          </div>
        </div>

      </div>
    </div>
  )
}
