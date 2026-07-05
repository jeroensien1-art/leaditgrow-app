const STATS = [
  { value: '78%',   label: 'van leads verloren bij opvolging na meer dan 2 uur' },
  { value: '+40%',  label: 'meer conversie zonder extra advertentiebudget' },
  { value: '4 wk',  label: 'van constante druk naar systeem op autopilot' },
  { value: '80%',   label: 'minder manueel werk dankzij automatisering' },
]

export function StatsBar() {
  return (
    <>
      <style>{`
        .stats-bar {
          background: #0e0d0b;
          border-bottom: 3px solid #0e0d0b;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          position: relative;
          z-index: 1;
          transition: background 0.4s;
        }
        .stats-bar.in-view .stat-n {
          color: #4ade80;
          text-shadow: 0 0 40px rgba(74,222,128,0.25);
        }
        .stats-bar.in-view .stat-block {
          border-top-color: #4ade80;
          background: #4ade80;
        }
        .stats-bar.in-view .stat-n  { color: #0e0d0b; text-shadow: none; }
        .stats-bar.in-view .stat-t  { color: rgba(14,13,11,0.55); }
        .stat-block {
          padding: 56px 40px;
          border-right: 1px solid rgba(255,255,255,.08);
          border-top: 4px solid transparent;
          transition: border-color 0.4s, background 0.4s;
        }
        .stat-block:last-child { border-right: none; }
        .stat-n {
          font-size: clamp(40px, 5vw, 68px);
          font-weight: 700;
          color: #4ade80;
          font-family: var(--font-mono-brutalist, monospace);
          letter-spacing: -.04em;
          line-height: 1;
          margin-bottom: 18px;
          transition: color 0.4s, text-shadow 0.4s;
        }
        .stat-t {
          font-size: 12px;
          color: rgba(255,255,255,.38);
          line-height: 1.65;
          letter-spacing: .02em;
          font-family: var(--font-brutalist, system-ui);
          transition: color 0.4s;
        }
        @media (max-width: 768px) {
          .stats-bar { grid-template-columns: 1fr 1fr; }
          .stat-block { border-bottom: 1px solid rgba(255,255,255,.08); }
        }
      `}</style>
      <div className="stats-bar" data-spot>
        {STATS.map(s => (
          <div key={s.value} className="stat-block">
            <div className="stat-n">{s.value}</div>
            <p className="stat-t">{s.label}</p>
          </div>
        ))}
      </div>
    </>
  )
}
