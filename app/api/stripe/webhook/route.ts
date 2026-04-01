import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createAdminClient } from '@/lib/supabase/admin'

export const runtime = 'nodejs'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: Request) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')!

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const supabase = createAdminClient()

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session

    const userId = session.metadata?.user_id || null
    const plan = session.metadata?.plan || null

    if (!userId || !session.subscription) {
      return NextResponse.json({ received: true })
    }

    const subResponse = await stripe.subscriptions.retrieve(
  session.subscription as string
)

const sub = subResponse as unknown as Stripe.Subscription

    await supabase.from('profiles').update({
      subscription_status: 'active',
      subscription_plan: plan,
      stripe_customer_id: session.customer ?? null,
      stripe_subscription_id: session.subscription,
      subscription_end_date: new Date(
        (sub as any).current_period_end * 1000
      ).toISOString(),
    }).eq('id', userId)
  }

  if (event.type === 'customer.subscription.deleted') {
    const sub = event.data.object as Stripe.Subscription

    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('stripe_subscription_id', sub.id)
      .single()

    if (profile) {
      await supabase.from('profiles').update({
        subscription_status: 'cancelled',
      }).eq('id', profile.id)
    }
  }

  return NextResponse.json({ received: true })
}