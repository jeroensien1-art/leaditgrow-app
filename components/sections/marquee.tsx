const ITEMS = ['Foundation', 'Capture', 'Convert', 'Acquire', 'Compound', 'Multiply']

export function MarqueeBar() {
  const doubled = [...ITEMS, ...ITEMS]
  return (
    <>
      <style>{`
        @keyframes b-marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .b-marquee-track {
          display: inline-block;
          animation: b-marquee 20s linear infinite;
          white-space: nowrap;
        }
        .b-marquee-wrap {
          overflow: hidden;
          background: #1a5e35;
          border-top: 3px solid #0e0d0b;
          border-bottom: 3px solid #0e0d0b;
          padding: 14px 0;
          position: relative;
          z-index: 1;
          transition: background 0.4s;
        }
        .b-marquee-wrap.in-view {
          background: #4ade80;
        }
        .b-marquee-wrap.in-view .b-marquee-item { color: #0e0d0b; }
        .b-marquee-wrap.in-view .b-marquee-dot  { color: rgba(14,13,11,0.4); }
      `}</style>
      <div className="b-marquee-wrap" data-spot>
        <div className="b-marquee-track">
          {doubled.map((item, i) => (
            <span key={i}>
              <span
                className="b-marquee-item"
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  letterSpacing: '.14em',
                  textTransform: 'uppercase',
                  color: '#fff',
                  margin: '0 32px',
                  fontFamily: 'var(--font-brutalist, system-ui)',
                }}
              >
                {item}
              </span>
              <span
                className="b-marquee-dot"
                style={{ color: 'rgba(255,255,255,.4)', margin: 0 }}
              >
                ✕
              </span>
            </span>
          ))}
        </div>
      </div>
    </>
  )
}
