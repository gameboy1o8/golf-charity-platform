'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { generateDrawNumbers, countMatches } from '@/lib/draw-engine'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export default function AdminDrawsPage() {
  const [draws, setDraws] = useState<any[]>([])
  const [simResult, setSimResult] = useState<number[] | null>(null)
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const fetchDraws = async () => {
    const { data } = await supabase.from('draws').select('*').order('created_at', { ascending: false })
    if (data) setDraws(data)
  }

  useEffect(() => { fetchDraws() }, [])

  const handleSimulate = () => {
    setSimResult(generateDrawNumbers())
  }

  const handleRunDraw = async () => {
    setLoading(true)
    const drawnNumbers = generateDrawNumbers()

    // Get all active subscribers with scores
    const { data: activeUsers } = await supabase
      .from('profiles')
      .select('id')
      .eq('subscription_status', 'active')

    // Create draw
    const today = new Date().toISOString().split('T')[0]
    const { data: draw } = await supabase.from('draws').insert({
      draw_date: today,
      drawn_numbers: drawnNumbers,
      jackpot_amount: (activeUsers?.length ?? 0) * 499 * 0.4,
      pool_4match: (activeUsers?.length ?? 0) * 499 * 0.35,
      pool_3match: (activeUsers?.length ?? 0) * 499 * 0.25,
      status: 'pending',
    }).select().single()

    if (draw && activeUsers) {
      // Create entries and check winners
      for (const user of activeUsers) {
        const { data: scores } = await supabase
          .from('scores')
          .select('score')
          .eq('user_id', user.id)
          .limit(5)

        const userNumbers = scores?.map(s => s.score) ?? []
        const matches = countMatches(userNumbers, drawnNumbers)

        await supabase.from('draw_entries').insert({
          draw_id: draw.id,
          user_id: user.id,
          numbers: userNumbers,
          match_count: matches,
        })

        if (matches >= 3) {
          const matchType = matches === 5 ? '5-match' : matches === 4 ? '4-match' : '3-match'
          await supabase.from('winners').insert({
            draw_id: draw.id,
            user_id: user.id,
            match_type: matchType,
            prize_amount: 0, // calculated when splitting
            verification_status: 'pending',
            payment_status: 'pending',
          })
        }
      }
    }

    setLoading(false)
    setSimResult(null)
    fetchDraws()
  }

  const handlePublish = async (drawId: string) => {
    await supabase.from('draws').update({ status: 'published' }).eq('id', drawId)
    fetchDraws()
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <h1 className="text-3xl font-bold">Draw Management</h1>

      <Card className="bg-slate-900 border-slate-800">
        <CardHeader><CardTitle className="text-white">Run a Draw</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-3 flex-wrap">
            <Button onClick={handleSimulate} variant="outline" className="border-slate-700 text-slate-300">
              Simulate (Preview Only)
            </Button>
            <Button onClick={handleRunDraw} disabled={loading} className="bg-emerald-600 hover:bg-emerald-500">
              {loading ? 'Running...' : 'Run Official Draw'}
            </Button>
          </div>
          {simResult && (
            <div className="bg-slate-800 rounded-lg p-4">
              <p className="text-slate-400 text-sm mb-2">Simulation result (not saved):</p>
              <div className="flex gap-3">
                {simResult.map(n => (
                  <span key={n} className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold">
                    {n}
                  </span>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="bg-slate-900 border-slate-800">
        <CardHeader><CardTitle className="text-white">Past Draws</CardTitle></CardHeader>
        <CardContent>
          {draws.length === 0 ? (
            <p className="text-slate-500 text-sm">No draws yet.</p>
          ) : (
            <div className="space-y-3">
              {draws.map(draw => (
                <div key={draw.id} className="bg-slate-800 rounded-lg p-4 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-white font-medium">{draw.draw_date}</p>
                    <div className="flex gap-2 mt-1 flex-wrap">
                      {draw.drawn_numbers.map((n: number) => (
                        <span key={n} className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                          {n}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={draw.status === 'published'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}>
                      {draw.status}
                    </Badge>
                    {draw.status === 'pending' && (
                      <Button onClick={() => handlePublish(draw.id)} size="sm" className="bg-emerald-600 hover:bg-emerald-500">
                        Publish
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}