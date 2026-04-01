'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Check } from 'lucide-react'

export default function SubscribePage() {
  const [loading, setLoading] = useState<string | null>(null)

  const handleSubscribe = async (plan: 'monthly' | 'yearly') => {
    setLoading(plan)
    const res = await fetch('/api/stripe/create-checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan }),
    })
    const { url } = await res.json()
    if (url) window.location.href = url
    setLoading(null)
  }

  const features = [
    'Participate in monthly draws',
    'Track up to 5 Stableford scores',
    'Support your chosen charity',
    'Win prize pool rewards',
    'Full dashboard access',
  ]

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-3xl font-bold">Choose Your Plan</h1>
        <p className="text-slate-400 mt-1">Subscribe to unlock all features and start giving back.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Monthly */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white">Monthly</CardTitle>
            <p className="text-4xl font-bold text-white mt-2">₹499<span className="text-slate-400 text-base font-normal">/mo</span></p>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-2">
              {features.map(f => (
                <li key={f} className="flex items-center gap-2 text-slate-300 text-sm">
                  <Check size={14} className="text-emerald-400 flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <Button
              onClick={() => handleSubscribe('monthly')}
              disabled={loading === 'monthly'}
              className="w-full bg-emerald-600 hover:bg-emerald-500"
            >
              {loading === 'monthly' ? 'Redirecting...' : 'Subscribe Monthly'}
            </Button>
          </CardContent>
        </Card>

        {/* Yearly */}
        <Card className="bg-slate-900 border-emerald-500/40 relative">
          <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-600 text-white border-0">
            Best Value
          </Badge>
          <CardHeader>
            <CardTitle className="text-white">Yearly</CardTitle>
            <p className="text-4xl font-bold text-white mt-2">₹4,999<span className="text-slate-400 text-base font-normal">/yr</span></p>
            <p className="text-emerald-400 text-sm">Save ₹989 vs monthly</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-2">
              {features.map(f => (
                <li key={f} className="flex items-center gap-2 text-slate-300 text-sm">
                  <Check size={14} className="text-emerald-400 flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <Button
              onClick={() => handleSubscribe('yearly')}
              disabled={loading === 'yearly'}
              className="w-full bg-emerald-600 hover:bg-emerald-500"
            >
              {loading === 'yearly' ? 'Redirecting...' : 'Subscribe Yearly'}
            </Button>
          </CardContent>
        </Card>
      </div>

      <p className="text-center text-slate-500 text-sm">
        Powered by Stripe · Secure · Cancel anytime
      </p>
    </div>
  )
}