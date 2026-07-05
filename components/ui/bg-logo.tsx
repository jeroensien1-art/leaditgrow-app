'use client'

export function BgLogo() {
  return (
    <>
      <style>{`
        @keyframes bg-logo-spin {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to   { transform: translate(-50%, -50%) rotate(360deg); }
        }
        .bg-logo-wrap {
          position: fixed;
          top: 50%;
          left: 50%;
          width: min(88vw, 88vh);
          height: min(88vw, 88vh);
          z-index: 0;
          pointer-events: none;
          animation: bg-logo-spin 90s linear infinite;
        }
        .bg-logo-wrap svg {
          width: 100%;
          height: 100%;
          display: block;
        }
      `}</style>
      <div className="bg-logo-wrap" aria-hidden="true">
        <svg viewBox="-2 -2 104 123" xmlns="http://www.w3.org/2000/svg" overflow="visible">
          <path d="M 0,62 L 0,119 L 100,119 Z"
            fill="none" stroke="rgba(74,222,128,0.09)" strokeWidth="7"
            strokeLinejoin="miter" strokeLinecap="butt"/>
          <path d="M 10.5,37 L 10.5,88 L 59,88 Z"
            fill="none" stroke="rgba(74,222,128,0.09)" strokeWidth="7"
            strokeLinejoin="miter" strokeLinecap="butt"/>
          <path d="M 0,0 L 0,57 L 41,57 Z"
            fill="none" stroke="rgba(74,222,128,0.09)" strokeWidth="7"
            strokeLinejoin="miter" strokeLinecap="butt"/>
        </svg>
      </div>
    </>
  )
}
