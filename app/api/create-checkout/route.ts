import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@/lib/supabase/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

const PRICES = {
  monthly: 'price_1THSQgFzKSBfhgJbjdzoRrE3',
  yearly: 'price_1THSNiFzKSBfhgJbOaii76Gg',
}

export async function POST(req: Request) {
  const { plan } = await req.json()
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [{ price: PRICES[plan as 'monthly' | 'yearly'], quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?subscribed=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/subscribe`,
    metadata: { user_id: user.id, plan },
  })

  return NextResponse.json({ url: session.url })
}