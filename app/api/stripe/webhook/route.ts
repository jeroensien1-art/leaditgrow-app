import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'
import { sendPurchaseSequence } from '@/lib/crm/sequences'

const FROM = 'Jeroen | Lead it, Grow <jeroen@leaditgrow.be>'

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2026-04-22.dahlia' })
}
function getSupabase() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_KEY!)
}
function getResend() {
  return new Resend(process.env.RESEND_API_KEY)
}

export async function POST(req: NextRequest) {
  const stripe = getStripe()
  const supabase = getSupabase()
  const resend = getResend()

  const body = await req.text()
  const sig = req.headers.get('stripe-signature')

  if (!sig) return NextResponse.json({ error: 'No signature' }, { status: 400 })

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    console.error('[stripe/webhook] signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session

    const email = session.customer_details?.email ?? session.customer_email
    const name = session.customer_details?.name ?? 'there'
    const amountPaid = session.amount_total ?? 0

    if (!email) {
      console.error('[stripe/webhook] no email in session')
      return NextResponse.json({ ok: true })
    }

    // Save buyer to Supabase
    const { error: insertError } = await supabase.from('buyers').insert({
      stripe_session_id: session.id,
      email,
      name,
      amount_cents: amountPaid,
      product: 'actiehandboek',
    })
    if (insertError) {
      console.error('[stripe/webhook] buyers insert error:', insertError.message)
    }

    // Trigger purchase email sequence
    try {
      await sendPurchaseSequence(name, email)
    } catch (err) {
      console.error('[stripe/webhook] sendPurchaseSequence error:', err)
    }

    // Notify Jeroen
    await resend.emails.send({
      from: FROM,
      to: 'jeroen@leaditgrow.be',
      subject: `Nieuwe aankoop: ${name} · €${(amountPaid / 100).toFixed(2)}`,
      html: `
        <h2 style="font-family:sans-serif;color:#3d3929">Nieuwe aankoop actiehandboek 🎉</h2>
        <p style="font-family:sans-serif;color:#535146"><strong>Naam:</strong> ${name}</p>
        <p style="font-family:sans-serif;color:#535146"><strong>Email:</strong> ${email}</p>
        <p style="font-family:sans-serif;color:#535146"><strong>Bedrag:</strong> €${(amountPaid / 100).toFixed(2)}</p>
        <p style="font-family:sans-serif;color:#535146"><strong>Stripe session:</strong> ${session.id}</p>
        <p style="font-family:sans-serif;color:#535146;margin-top:16px">Email sequence (dag 0, 3, 7, 14) is verstuurd naar ${email}.</p>
      `,
    })
  }

  return NextResponse.json({ ok: true })
}
