import { createClient } from '@/lib/outreach/supabase'
import { redirect } from 'next/navigation'

export default async function SessionPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/outreach/login')
  }

  const { data: client } = await supabase
    .from('outreach_clients')
    .select('company_name')
    .eq('user_id', user.id)
    .single()

  const companyName = client?.company_name ?? user.email?.split('@')[0] ?? 'klant'

  return (
    <div style={{
      minHeight: '100svh',
      background: 'linear-gradient(to bottom, #faf9f5, #f0ede4)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }}>
      <div style={{ width: '100%', maxWidth: 400, padding: '0 24px', textAlign: 'center' }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#c96442', marginBottom: 8 }}>
          Lead it, Grow
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#3d3929', marginBottom: 12 }}>
          Welkom, {companyName}!
        </h1>
        <p style={{ fontSize: 15, color: '#3d3929', lineHeight: 1.6 }}>
          Je setup is klaar. Het dashboard wordt hier gebouwd in fase 2.
        </p>
      </div>
    </div>
  )
}
