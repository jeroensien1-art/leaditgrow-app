'use client'

import { useState, useMemo } from 'react'

type Step = 'intro' | 'context' | 'questions' | 'results' | 'capture' | 'thanks'

interface ContextAnswers {
  industry: string
  monthlyLeads: string
  avgDealValue: string
  teamSize: string
}

interface Question {
  lever: string
  theme: string
  meta: string
  label: string
  emotion: string
  options: { main: string; feel: string; score: number }[]
}

const contextQuestions = [
  {
    id: 'industry',
    label: 'What type of business are you running?',
    emotion: 'This helps us tailor every recommendation to your situation.',
    options: [
      'B2B services (consulting, agency, professional services)',
      'B2C services (coaching, health, personal services)',
      'Trade / construction / installation',
      'Retail or e-commerce',
      'Other',
    ],
  },
  {
    id: 'monthlyLeads',
    label: 'How many new enquiries or leads do you receive per month?',
    emotion: 'Rough estimate is fine.',
    options: ['Fewer than 5', '5 to 20', '20 to 50', 'More than 50'],
  },
  {
    id: 'avgDealValue',
    label: 'What is your typical deal or project value?',
    emotion: 'Average across your clients.',
    options: ['Under €1,000', '€1,000 to €5,000', '€5,000 to €20,000', 'Over €20,000'],
  },
  {
    id: 'teamSize',
    label: 'How many people work in your business (including you)?',
    emotion: 'Full-time equivalents.',
    options: ['Just me', '2 to 5', '6 to 15', 'More than 15'],
  },
]

const questions: Question[] = [
  {
    lever: 'time',
    theme: 'Your time',
    meta: 'Time and freedom',
    label: 'When did you last have a full day completely off, no messages, no checking in, no thinking about the business?',
    emotion: 'Not a holiday where you just quickly checked in. A real day.',
    options: [
      { main: 'Last week, I have proper boundaries.', feel: 'Time is protected, the business runs without me', score: 0 },
      { main: 'A few weeks ago, it happens sometimes.', feel: 'I can disconnect, but not reliably', score: 1 },
      { main: 'I honestly cannot remember the last time.', feel: 'The business follows me everywhere', score: 2 },
      { main: 'That is not really possible for me right now.', feel: 'If I stop, everything stops', score: 3 },
    ],
  },
  {
    lever: 'leadership',
    theme: 'Your role',
    meta: 'Leadership and team',
    label: 'When something goes wrong in the business, what usually happens?',
    emotion: 'Think about the last real problem. How did it get resolved?',
    options: [
      { main: 'My team handles it. I hear about it after.', feel: 'Systems and people work without me', score: 0 },
      { main: 'Someone flags it and waits for my call.', feel: 'Decisions still run through me', score: 1 },
      { main: 'Usually I am the one who spots it first.', feel: 'Still in the weeds more than I should be', score: 2 },
      { main: 'Nothing moves unless I am directly involved.', feel: 'I am the bottleneck for everything', score: 3 },
    ],
  },
  {
    lever: 'speed_to_lead',
    theme: 'Your leads',
    meta: 'Speed-to-lead',
    label: 'When a new enquiry comes in, a form, a DM, a call, how quickly does your business respond?',
    emotion: 'On a Saturday afternoon. Or a Tuesday evening when your team has gone home.',
    options: [
      { main: 'Within 5 minutes, automatically.', feel: 'A system handles first contact every time', score: 0 },
      { main: 'Within the hour, usually.', feel: 'Someone picks it up when they see it', score: 1 },
      { main: 'Same day, when there is time.', feel: 'Inconsistent, depends who is around', score: 2 },
      { main: 'Next day or later, it varies.', feel: 'Leads regularly go cold before we reach them', score: 3 },
    ],
  },
  {
    lever: 'pipeline',
    theme: 'Your pipeline',
    meta: 'Follow-up and nurture',
    label: 'What happens to a lead who shows interest but does not buy immediately?',
    emotion: 'Think about the last 10 people who said "I\'ll think about it."',
    options: [
      { main: 'They enter an automated follow-up sequence.', feel: 'No lead falls through the cracks', score: 0 },
      { main: 'I or my team follows up manually a few times.', feel: 'Inconsistent but we try', score: 1 },
      { main: 'We follow up once, then leave it to them.', feel: 'Most warm leads go cold', score: 2 },
      { main: 'Honestly, most of them just disappear.', feel: 'We have no real follow-up process', score: 3 },
    ],
  },
  {
    lever: 'marketing',
    theme: 'Your visibility',
    meta: 'Online presence',
    label: 'If you stopped all active outreach tomorrow, no referral chasing, no DMs, no networking, what would happen?',
    emotion: 'Honest answer.',
    options: [
      { main: 'Pipeline keeps running. Inbound handles it.', feel: 'Strong online presence working on its own', score: 0 },
      { main: 'It would slow, but not stop.', feel: 'Some inbound, but I still push it along', score: 1 },
      { main: 'It would dry up within a couple of weeks.', feel: 'Almost entirely dependent on my direct effort', score: 2 },
      { main: 'It would stop immediately.', feel: 'I am the marketing. There is no system.', score: 3 },
    ],
  },
  {
    lever: 'sales',
    theme: 'Your conversions',
    meta: 'Sales close rate',
    label: 'When you get into a real conversation with a potential client who seems like a good fit, what usually happens?',
    emotion: 'Think about your last 10 conversations.',
    options: [
      { main: 'Most of them buy. The process works.', feel: '60%+ conversion, clear and consistent', score: 0 },
      { main: 'About half close. Depends on the day.', feel: '40–60%, good but not reliable', score: 1 },
      { main: 'Maybe 1 in 4. Lots of "let me think about it."', feel: '20–30%, the gap between interest and commitment', score: 2 },
      { main: 'Rarely. Great conversations, few decisions.', feel: 'Under 20%, something is breaking down', score: 3 },
    ],
  },
  {
    lever: 'retention',
    theme: 'Your clients',
    meta: 'Client retention and referrals',
    label: 'What happens after a client finishes working with you?',
    emotion: 'Think about how many past clients have come back or referred someone.',
    options: [
      { main: 'Most come back and send referrals regularly.', feel: 'Clients become long-term advocates', score: 0 },
      { main: 'Some come back, some refer. Not systematic.', feel: 'Good relationships, no deliberate process', score: 1 },
      { main: 'We finish the project and that is mostly it.', feel: 'No follow-up, referrals happen by chance', score: 2 },
      { main: 'We rarely hear from clients after delivery.', feel: 'No retention or referral system at all', score: 3 },
    ],
  },
]

const leverConfig: Record<string, { label: string; color: string }> = {
  time:          { label: 'Owner time',         color: '#c96442' },
  leadership:    { label: 'Leadership',          color: '#8b4513' },
  speed_to_lead: { label: 'Speed-to-lead',       color: '#c0392b' },
  pipeline:      { label: 'Pipeline & nurture',  color: '#7d3c98' },
  marketing:     { label: 'Online presence',     color: '#2980b9' },
  sales:         { label: 'Sales close rate',    color: '#16a085' },
  retention:     { label: 'Client retention',    color: '#27ae60' },
}

const leverDetail: Record<string, { title: string; emotion: string; desc: string; action: string }> = {
  time: {
    title: 'Buy back your time',
    emotion: '"I did not start this business to work more than I did in a job."',
    desc: 'Every task that only you can do is a ceiling on your growth. The goal is a business that operates without your constant presence.',
    action: 'List every task you did last week. Mark the ones only you can genuinely do. Everything else gets automated or delegated this month.',
  },
  leadership: {
    title: 'Stop being the bottleneck',
    emotion: '"My team is great, but everything still comes back to me."',
    desc: 'The business can only grow as fast as your attention allows. Build clear decision frameworks so your team can act without waiting for you.',
    action: 'Identify 3 recurring decisions your team escalates to you. Write the criteria for each. Hand them over this week.',
  },
  speed_to_lead: {
    title: 'Never let a lead go cold again',
    emotion: '"We paid to get that lead. Someone replied six hours later."',
    desc: 'Research shows responding in under 5 minutes makes you 100x more likely to connect with a lead vs 30 minutes. Slow response is your most expensive hidden cost.',
    action: 'Set up an automated first-response that fires in under 60 seconds, including weekends and after hours.',
  },
  pipeline: {
    title: 'Build a follow-up system that never forgets',
    emotion: '"They were interested. Then they just went quiet."',
    desc: '80% of sales require 5+ follow-ups. Most businesses stop at one. The money is not in the first contact. It is in the sequence.',
    action: 'Map your last 10 lost deals. How many follow-ups happened? Build a 5-touch sequence for every warm lead this week.',
  },
  marketing: {
    title: 'Build something that works while you sleep',
    emotion: '"When I stop pushing, the pipeline dries up."',
    desc: 'Referrals are a starting point, not a strategy. A business dependent on your personal effort is fragile. The right system works while you are with your family.',
    action: 'Identify your one highest-converting channel. Spend 2 focused hours improving it this week, then systematise it.',
  },
  sales: {
    title: 'Close more of the right conversations',
    emotion: '"Great meeting. They seemed so interested. Then nothing."',
    desc: 'Most close rate problems are not a persuasion issue. They are a qualification and framing issue. The right leads, with the right expectations, close themselves.',
    action: 'Review your last 5 lost deals. Find the moment the conversation shifted. That single insight is your fix.',
  },
  retention: {
    title: 'Turn every client into a growth engine',
    emotion: '"I keep finding new clients instead of growing the ones I have."',
    desc: 'Acquiring a new client costs 5 to 7x more than retaining one. Your existing clients are your cheapest source of new revenue, and most businesses ignore them after delivery.',
    action: 'List every client from the last 12 months. Email the top 5 with a simple check-in this week.',
  },
}

const css = `
  :root {
    --cream: #faf7f2; --warm-white: #fff9f4; --sand: #f0e9de; --sand-mid: #e2d5c3;
    --ink: #1c1a18; --ink-mid: #4a4540; --ink-muted: #9a9088; --ink-faint: #c8bfb4;
    --rust: #c96442; --rust-light: #fdf1eb; --rust-border: rgba(201,100,66,0.2);
    --green: #2d6a4f; --green-light: #eaf4ee;
    --border: rgba(28,26,24,0.08); --border-mid: rgba(28,26,24,0.14);
    --font-display: 'Georgia', serif; --font-body: system-ui, sans-serif;
    --shadow-card: 0 1px 3px rgba(28,26,24,0.06);
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  .diag-page {
    font-family: var(--font-body); background: var(--sand);
    min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 2rem 1rem;
  }
  .wrap { background: var(--warm-white); border-radius: 20px; max-width: 520px; width: 100%; overflow: hidden; box-shadow: 0 8px 48px rgba(28,26,24,0.12); }
  .top-stripe { height: 4px; background: linear-gradient(90deg,#c96442,#e0845a,#c96442); }
  .inner { padding: 2.2rem 2rem 2.6rem; }
  .eyebrow { font-size:10px; font-weight:600; letter-spacing:.16em; text-transform:uppercase; color:var(--rust); margin-bottom:10px; }
  .headline { font-family:var(--font-display); font-size:26px; font-weight:700; color:var(--ink); line-height:1.2; margin-bottom:10px; }
  .headline em { font-style:italic; color:var(--rust); }
  .subline { font-size:14px; color:var(--ink-muted); line-height:1.7; margin-bottom:1.8rem; }
  .moments { display:flex; flex-direction:column; gap:6px; margin-bottom:1.6rem; }
  .moment { display:flex; align-items:flex-start; gap:10px; padding:11px 14px; background:var(--cream); border-radius:8px; border-left:2px solid var(--sand-mid); }
  .moment-text { font-size:13px; color:var(--ink-mid); line-height:1.55; }
  .moment-text strong { font-weight:600; color:var(--ink); display:block; margin-bottom:2px; }
  .btn-primary { width:100%; padding:14px 24px; background:var(--rust); color:white; border:none; border-radius:10px; font-size:13px; font-weight:600; cursor:pointer; transition:all .15s; box-shadow:0 2px 8px rgba(201,100,66,.25); }
  .btn-primary:hover { background:#b8572a; transform:translateY(-1px); }
  .btn-primary:disabled { opacity:.4; cursor:not-allowed; transform:none; }
  .btn-ghost { padding:14px 18px; background:transparent; color:var(--ink-muted); border:1.5px solid var(--border-mid); border-radius:10px; font-size:13px; cursor:pointer; transition:all .15s; }
  .btn-ghost:hover { border-color:var(--ink-muted); color:var(--ink-mid); }
  .btn-row { display:flex; gap:8px; }
  .btn-row .btn-primary { flex:1; width:auto; }
  .progress-wrap { margin-bottom:2rem; }
  .progress-meta { display:flex; justify-content:space-between; margin-bottom:8px; }
  .prog-label { font-size:11px; font-weight:500; color:var(--ink-muted); letter-spacing:.06em; }
  .progress-track { height:3px; background:var(--sand); border-radius:2px; overflow:hidden; }
  .progress-fill { height:100%; background:var(--rust); border-radius:2px; transition:width .5s ease; }
  .q-meta { font-size:10px; font-weight:600; letter-spacing:.14em; text-transform:uppercase; color:var(--ink-faint); margin-bottom:10px; }
  .q-label { font-family:var(--font-display); font-size:19px; font-weight:700; color:var(--ink); line-height:1.35; margin-bottom:6px; }
  .q-emotion { font-size:14px; font-style:italic; color:var(--ink-muted); line-height:1.55; margin-bottom:1.4rem; }
  .options { display:flex; flex-direction:column; gap:7px; margin-bottom:1.6rem; }
  .opt { background:var(--cream); border:1.5px solid transparent; border-radius:10px; padding:13px 16px; cursor:pointer; transition:all .15s; text-align:left; display:flex; gap:12px; align-items:flex-start; box-shadow:var(--shadow-card); width:100%; }
  .opt:hover { border-color:var(--sand-mid); background:var(--warm-white); transform:translateY(-1px); }
  .opt.selected { border-color:var(--rust); background:var(--rust-light); transform:translateY(-1px); }
  .opt-marker { width:20px; height:20px; border-radius:50%; border:1.5px solid var(--sand-mid); flex-shrink:0; margin-top:2px; transition:all .15s; display:flex; align-items:center; justify-content:center; }
  .opt.selected .opt-marker { background:var(--rust); border-color:var(--rust); }
  .opt-dot { width:6px; height:6px; background:white; border-radius:50%; }
  .opt-main { font-size:13px; font-weight:500; color:var(--ink); line-height:1.35; margin-bottom:2px; }
  .opt-feel { font-size:12px; color:var(--ink-muted); font-style:italic; line-height:1.4; }
  .result-hero { background:var(--ink); border-radius:12px; padding:1.6rem; margin-bottom:1.4rem; position:relative; overflow:hidden; }
  .rh-eyebrow { font-size:10px; font-weight:600; letter-spacing:.14em; text-transform:uppercase; color:rgba(255,255,255,.35); margin-bottom:10px; }
  .rh-score { font-family:var(--font-display); font-size:52px; font-weight:700; color:white; line-height:1; margin-bottom:6px; }
  .rh-score span { font-size:20px; color:rgba(255,255,255,.35); margin-left:4px; }
  .rh-verdict { font-family:var(--font-display); font-size:16px; font-style:italic; color:#e8a87c; margin-bottom:8px; line-height:1.3; }
  .rh-sub { font-size:13px; color:rgba(255,255,255,.5); line-height:1.65; }
  .section-label { font-size:10px; font-weight:600; letter-spacing:.14em; text-transform:uppercase; color:var(--ink-faint); margin-bottom:12px; }
  .levers-section { margin-bottom:1.6rem; }
  .lever-row { display:flex; align-items:center; gap:10px; margin-bottom:11px; }
  .lever-rank { font-size:11px; font-weight:600; color:var(--ink-faint); width:16px; text-align:center; flex-shrink:0; }
  .lever-rank.top { color:var(--rust); }
  .lever-name { font-size:12px; font-weight:500; color:var(--ink-mid); width:130px; flex-shrink:0; }
  .lever-track { flex:1; height:5px; background:var(--sand); border-radius:3px; overflow:hidden; }
  .lever-fill { height:100%; border-radius:3px; transition:width 1s ease; }
  .lever-pct { font-size:11px; color:var(--ink-muted); width:32px; text-align:right; font-weight:500; }
  .priority-card { background:var(--cream); border:1px solid var(--border); border-radius:12px; padding:16px 18px; margin-bottom:8px; box-shadow:var(--shadow-card); }
  .priority-card.top-pick { background:var(--warm-white); border-color:var(--rust-border); border-left:3px solid var(--rust); }
  .pc-row { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:5px; }
  .pc-rank { font-size:10px; font-weight:600; letter-spacing:.1em; text-transform:uppercase; color:var(--ink-faint); }
  .priority-card.top-pick .pc-rank { color:var(--rust); }
  .pc-badge { font-size:9px; font-weight:600; letter-spacing:.08em; text-transform:uppercase; background:var(--rust-light); color:var(--rust); padding:3px 8px; border-radius:20px; border:1px solid var(--rust-border); }
  .pc-title { font-family:var(--font-display); font-size:15px; font-weight:700; color:var(--ink); margin-bottom:5px; line-height:1.3; }
  .pc-emotion { font-size:13px; font-style:italic; color:var(--ink-muted); margin-bottom:8px; line-height:1.5; }
  .pc-desc { font-size:13px; color:var(--ink-mid); line-height:1.6; margin-bottom:10px; }
  .pc-action { font-size:12px; font-weight:600; color:var(--rust); display:flex; align-items:center; gap:6px; }
  .cta-box { background:var(--sand); border-radius:12px; padding:1.4rem 1.6rem; border:1px solid var(--sand-mid); margin-top:1.4rem; }
  .cta-title { font-family:var(--font-display); font-size:18px; font-weight:700; color:var(--ink); margin-bottom:5px; }
  .cta-sub { font-size:13px; color:var(--ink-muted); line-height:1.6; margin-bottom:14px; }
  .field-label { font-size:10px; font-weight:600; letter-spacing:.1em; text-transform:uppercase; color:var(--ink-muted); margin-bottom:6px; display:block; }
  .text-input { width:100%; padding:12px 14px; background:var(--warm-white); border:1.5px solid var(--border-mid); border-radius:10px; font-size:13px; color:var(--ink); outline:none; transition:border-color .15s; margin-bottom:10px; }
  .text-input:focus { border-color:var(--rust); }
  .text-input::placeholder { color:var(--ink-faint); }
  .thanks-wrap { text-align:center; padding:1rem 0 .5rem; }
  .thanks-circle { width:60px; height:60px; border-radius:50%; background:var(--green-light); border:1px solid rgba(45,106,79,.2); display:flex; align-items:center; justify-content:center; margin:0 auto 1.2rem; font-size:24px; }
  .what-in { background:var(--cream); border-radius:10px; padding:1.2rem 1.4rem; margin-top:1.4rem; text-align:left; }
  .what-in-title { font-size:10px; font-weight:600; letter-spacing:.14em; text-transform:uppercase; color:var(--rust); margin-bottom:10px; }
  .what-item { font-size:13px; color:var(--ink-mid); line-height:1.9; display:flex; gap:8px; }
  .what-item::before { content:'·'; color:var(--ink-faint); flex-shrink:0; }
  .italic-note { font-family:var(--font-display); font-size:13px; font-style:italic; color:var(--ink-muted); margin-bottom:1.6rem; line-height:1.6; }
`

export default function DiagnosticPage() {
  const [step, setStep] = useState<Step>('intro')
  const [ctxIndex, setCtxIndex] = useState(0)
  const [ctxAnswers, setCtxAnswers] = useState<ContextAnswers>({ industry: '', monthlyLeads: '', avgDealValue: '', teamSize: '' })
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [animScore, setAnimScore] = useState(0)

  const scored = useMemo(() => {
    return questions
      .map(q => ({ key: q.lever, score: answers[q.lever] ?? 0 }))
      .sort((a, b) => b.score - a.score)
  }, [answers])

  const overallScore = useMemo(() => {
    const total = Object.values(answers).reduce((s, v) => s + v, 0)
    return Math.round((total / (questions.length * 3)) * 100)
  }, [answers])

  const getVerdict = (score: number) => {
    if (score < 25) return ['You have built something that works for you.', 'The foundation is solid. The gains from here are about protecting your time and making sure it stays this way as you grow.']
    if (score < 50) return ['Good momentum, but something is pulling against you.', 'Real strengths here, and one or two places where the business is costing you more than it should. Fix the top lever and the others often follow.']
    if (score < 75) return ['The business is running you more than you are running it.', 'Multiple areas are draining your time and revenue. You do not need to fix everything. Fix them in the right order and the others sort themselves out.']
    return ['You are carrying too much. This is not sustainable.', 'High scores across the board usually mean one thing: the business was built around you, not for you. One focused quarter, fixing the right things in sequence, changes everything.']
  }

  const startResults = () => {
    setStep('results')
    let n = 0
    const target = overallScore
    const t = setInterval(() => {
      n = Math.min(n + 2, target)
      setAnimScore(n)
      if (n >= target) clearInterval(t)
    }, 20)
  }

  const handleSubmit = async () => {
    if (!email.includes('@') || !name.trim()) return
    setSubmitting(true)
    try {
      await fetch('/api/diagnostic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, context: ctxAnswers, answers, score: overallScore, topLevers: scored.map(s => s.key) }),
      })
    } catch {
      // fire and forget — show thanks regardless
    }
    setStep('thanks')
    setSubmitting(false)
  }

  const selectCtxOpt = (value: string) => {
    const key = contextQuestions[ctxIndex].id as keyof ContextAnswers
    setCtxAnswers(prev => ({ ...prev, [key]: value }))
  }

  const ctxSelected = ctxAnswers[contextQuestions[ctxIndex].id as keyof ContextAnswers]

  const selectOpt = (i: number) => {
    setAnswers(prev => ({ ...prev, [questions[currentQ].lever]: i }))
  }

  const [verdict, sub] = getVerdict(overallScore)

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div className="diag-page">
        <div className="wrap">
          <div className="top-stripe" />
          <div className="inner">

            {/* INTRO */}
            {step === 'intro' && (
              <div>
                <div className="eyebrow">For business owners</div>
                <div className="headline">You built this business.<br />Is it <em>working for you?</em></div>
                <div className="subline">7 honest questions. You get a clear picture of which one change, in leadership, systems, sales or time, would give you the most back.</div>
                <div className="moments">
                  {[
                    ['Revenue is up, but so is everything else', 'More clients, more problems, more of your time. Growth feels like it costs more than it gives back.'],
                    ['You have a team, but you are still doing everything', 'They are good people. But every real decision still lands on your desk.'],
                    ['Leads are coming in, but not all of them convert', 'Some go cold before anyone followed up. Others were never chased a second time.'],
                    ['There is more revenue sitting there, untouched', 'Past clients who never came back. Referrals that were never asked for.'],
                  ].map(([title, body]) => (
                    <div key={title} className="moment">
                      <div className="moment-text"><strong>{title}</strong>{body}</div>
                    </div>
                  ))}
                </div>
                <div className="italic-note">This diagnostic finds which lever to pull first, so you can grow revenue, lead better and build a business that gives you your life back.</div>
                <button className="btn-primary" onClick={() => setStep('context')}>Show me what is holding my business back</button>
              </div>
            )}

            {/* CONTEXT QUESTIONS */}
            {step === 'context' && (
              <div>
                <div className="progress-wrap">
                  <div className="progress-meta">
                    <span className="prog-label">Context {ctxIndex + 1} of {contextQuestions.length}</span>
                    <span className="prog-label">About your business</span>
                  </div>
                  <div className="progress-track">
                    <div className="progress-fill" style={{ width: `${((ctxIndex + 1) / (contextQuestions.length + questions.length)) * 100}%` }} />
                  </div>
                </div>
                <div className="q-meta">About your business</div>
                <div className="q-label">{contextQuestions[ctxIndex].label}</div>
                <div className="q-emotion">{contextQuestions[ctxIndex].emotion}</div>
                <div className="options">
                  {contextQuestions[ctxIndex].options.map(opt => (
                    <button key={opt} className={`opt ${ctxSelected === opt ? 'selected' : ''}`} onClick={() => selectCtxOpt(opt)}>
                      <div className="opt-marker">{ctxSelected === opt && <div className="opt-dot" />}</div>
                      <div><div className="opt-main">{opt}</div></div>
                    </button>
                  ))}
                </div>
                <div className="btn-row">
                  <button className="btn-ghost" onClick={() => ctxIndex === 0 ? setStep('intro') : setCtxIndex(i => i - 1)}>Back</button>
                  <button className="btn-primary" disabled={!ctxSelected} onClick={() => {
                    if (ctxIndex < contextQuestions.length - 1) setCtxIndex(i => i + 1)
                    else { setStep('questions'); setCurrentQ(0) }
                  }}>Continue</button>
                </div>
              </div>
            )}

            {/* SCORED QUESTIONS */}
            {step === 'questions' && (
              <div>
                <div className="progress-wrap">
                  <div className="progress-meta">
                    <span className="prog-label">Question {currentQ + 1} of {questions.length}</span>
                    <span className="prog-label">{questions[currentQ].theme}</span>
                  </div>
                  <div className="progress-track">
                    <div className="progress-fill" style={{ width: `${((contextQuestions.length + currentQ + 1) / (contextQuestions.length + questions.length)) * 100}%` }} />
                  </div>
                </div>
                <div className="q-meta">{questions[currentQ].meta}</div>
                <div className="q-label">{questions[currentQ].label}</div>
                <div className="q-emotion">{questions[currentQ].emotion}</div>
                <div className="options">
                  {questions[currentQ].options.map((opt, i) => (
                    <button key={i} className={`opt ${answers[questions[currentQ].lever] === i ? 'selected' : ''}`} onClick={() => selectOpt(i)}>
                      <div className="opt-marker">{answers[questions[currentQ].lever] === i && <div className="opt-dot" />}</div>
                      <div>
                        <div className="opt-main">{opt.main}</div>
                        <div className="opt-feel">{opt.feel}</div>
                      </div>
                    </button>
                  ))}
                </div>
                <div className="btn-row">
                  <button className="btn-ghost" onClick={() => currentQ === 0 ? setStep('context') : setCurrentQ(q => q - 1)}>Back</button>
                  <button className="btn-primary" disabled={answers[questions[currentQ].lever] === undefined}
                    onClick={() => {
                      if (currentQ < questions.length - 1) setCurrentQ(q => q + 1)
                      else startResults()
                    }}>
                    {currentQ < questions.length - 1 ? 'Continue' : 'See my results'}
                  </button>
                </div>
              </div>
            )}

            {/* RESULTS */}
            {step === 'results' && (
              <div>
                <div className="result-hero">
                  <div className="rh-eyebrow">Your business impact score</div>
                  <div className="rh-score">{animScore} <span>/ 100</span></div>
                  <div className="rh-verdict">{verdict}</div>
                  <div className="rh-sub">{sub}</div>
                </div>
                <div className="levers-section">
                  <div className="section-label">Where your energy is being lost, ranked</div>
                  {scored.map((l, i) => {
                    const cfg = leverConfig[l.key]
                    const pct = Math.round((l.score / 3) * 100)
                    return (
                      <div key={l.key} className="lever-row">
                        <div className={`lever-rank ${i === 0 ? 'top' : ''}`}>{i + 1}</div>
                        <div className="lever-name">{cfg.label}</div>
                        <div className="lever-track">
                          <div className="lever-fill" style={{ width: `${pct || 4}%`, background: cfg.color }} />
                        </div>
                        <div className="lever-pct">{pct}%</div>
                      </div>
                    )
                  })}
                </div>
                <div className="section-label">Your top priorities</div>
                <div style={{ marginBottom: 8 }} />
                {scored.slice(0, 3).map((l, i) => {
                  const d = leverDetail[l.key]
                  return (
                    <div key={l.key} className={`priority-card ${i === 0 ? 'top-pick' : ''}`}>
                      <div className="pc-row">
                        <div className="pc-rank">Priority {i + 1}</div>
                        {i === 0 && <div className="pc-badge">Biggest impact</div>}
                      </div>
                      <div className="pc-title">{d.title}</div>
                      <div className="pc-emotion">{d.emotion}</div>
                      <div className="pc-desc">{d.desc}</div>
                      <div className="pc-action">{d.action}</div>
                    </div>
                  )
                })}
                <div className="cta-box">
                  <div className="cta-title">Get your personalised 30-day action plan</div>
                  <div className="cta-sub">A full breakdown of your top 3 gaps, exact next steps, what each is costing you, and a personalised plan to fix it.</div>
                  <button className="btn-primary" onClick={() => setStep('capture')}>Get my free report</button>
                </div>
              </div>
            )}

            {/* EMAIL CAPTURE */}
            {step === 'capture' && (
              <div>
                <div className="eyebrow">Almost there</div>
                <div className="headline" style={{ fontSize: 22, marginBottom: 8 }}>Where should we send it?</div>
                <div className="subline">Your personalised report will be in your inbox within minutes. Check spam if you do not see it.</div>
                <label className="field-label">Your name</label>
                <input className="text-input" type="text" placeholder="First name" value={name} onChange={e => setName(e.target.value)} />
                <label className="field-label">Email address</label>
                <input className="text-input" type="email" placeholder="you@email.com" value={email} onChange={e => setEmail(e.target.value)} />
                <button className="btn-primary" disabled={submitting || !email.includes('@') || !name.trim()} onClick={handleSubmit}>
                  {submitting ? 'Sending...' : 'Send my report'}
                </button>
                <div style={{ marginTop: 12 }}>
                  <button className="btn-ghost" style={{ width: '100%' }} onClick={() => setStep('results')}>Back to results</button>
                </div>
              </div>
            )}

            {/* THANKS */}
            {step === 'thanks' && (
              <div className="thanks-wrap">
                <div className="thanks-circle">✓</div>
                <div className="headline" style={{ fontSize: 22, marginBottom: 8 }}>It is heading to your inbox</div>
                <div className="subline" style={{ marginBottom: 0 }}>Your personalised strategy breakdown will be with you within minutes. Check your spam folder too.</div>
                <div className="what-in">
                  <div className="what-in-title">What is in your report</div>
                  <div className="what-item">Your #1 lever with an honest diagnosis of what it is costing you</div>
                  <div className="what-item">Your top 3 fixes, specific to your business type and size</div>
                  <div className="what-item">A 30-day implementation plan with one action per day</div>
                  <div className="what-item">Industry-specific scripts and templates you can use immediately</div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </>
  )
}
