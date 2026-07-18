'use client'

import { useState } from 'react'
import { ArrowRight, Loader2 } from 'lucide-react'
import type { FreebieId } from '@/lib/freebies'

export function FreebieOptinForm({ freebie }: { freebie: FreebieId }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await fetch('/api/freebie-optin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, freebie }),
      })
      if (!res.ok) throw new Error()
      setStatus('done')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'done') {
    return (
      <div className="text-center p-6 rounded-2xl" style={{ background: '#f5f3ee', border: '1px solid rgba(61,57,41,0.08)' }}>
        <p className="text-sm font-semibold mb-1" style={{ color: '#3d3929' }}>Check je inbox</p>
        <p className="text-xs" style={{ color: '#83827d' }}>De download-link staat onderweg (check ook je spammap).</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-full max-w-sm mx-auto">
      <input
        type="text"
        required
        placeholder="Je naam"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="px-4 py-3 rounded-full text-sm outline-none"
        style={{ border: '1px solid rgba(61,57,41,0.15)', background: '#fff' }}
      />
      <input
        type="email"
        required
        placeholder="Je e-mailadres"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="px-4 py-3 rounded-full text-sm outline-none"
        style={{ border: '1px solid rgba(61,57,41,0.15)', background: '#fff' }}
      />
      <button
        type="submit"
        disabled={status === 'loading'}
        className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-full text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-60"
        style={{ background: '#c96442', boxShadow: '0 6px 24px rgba(201,100,66,0.35)' }}
      >
        {status === 'loading' ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Gratis downloaden <ArrowRight className="w-4 h-4" /></>}
      </button>
      {status === 'error' && (
        <p className="text-xs text-center" style={{ color: '#c96442' }}>Er ging iets mis — probeer het nog eens.</p>
      )}
    </form>
  )
}
