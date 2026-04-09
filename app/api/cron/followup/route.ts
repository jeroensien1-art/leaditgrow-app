import { NextRequest, NextResponse } from 'next/server'
import { getDueFollowUps, markFollowedUp } from '@/lib/crm/store'
import { draftFollowUp } from '@/lib/crm/claude'
import { sendToLead } from '@/lib/crm/email'

// Vercel Cron calls this every 30 minutes.
// Protected by CRON_SECRET — set this in Vercel env vars.
export async function GET(req: NextRequest) {
  const auth = req.headers.get('authorization')
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const leads = await getDueFollowUps()
  console.log(`[followup cron] ${leads.length} leads due for follow-up`)

  const results = await Promise.allSettled(
    leads.map(async (lead) => {
      const { subject, body } = await draftFollowUp(lead)
      await sendToLead(lead.email, subject, body)
      await markFollowedUp(lead.id)
      console.log(`[followup] sent to ${lead.email}`)
    })
  )

  const failed = results.filter(r => r.status === 'rejected').length
  return NextResponse.json({ processed: leads.length, failed })
}
