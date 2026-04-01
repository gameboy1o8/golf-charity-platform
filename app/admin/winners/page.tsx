'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export default function AdminWinnersPage() {
  const [winners, setWinners] = useState<any[]>([])
  const supabase = createClient()

  const fetchWinners = async () => {
    const { data } = await supabase
      .from('winners')
      .select('*, profiles(full_name, email), draws(draw_date)')
      .order('created_at', { ascending: false })
    if (data) setWinners(data)
  }

  useEffect(() => { fetchWinners() }, [])

  const updateStatus = async (id: string, field: string, value: string) => {
    await supabase.from('winners').update({ [field]: value }).eq('id', id)
    fetchWinners()
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Winners</h1>
      <Card className="bg-slate-900 border-slate-800">
        <CardContent className="pt-6 overflow-x-auto">
          {winners.length === 0 ? (
            <p className="text-slate-500 text-sm">No winners yet.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-slate-400 border-b border-slate-800">
                  <th className="text-left py-2 pr-4">User</th>
                  <th className="text-left py-2 pr-4">Draw</th>
                  <th className="text-left py-2 pr-4">Match</th>
                  <th className="text-left py-2 pr-4">Verification</th>
                  <th className="text-left py-2">Payment</th>
                </tr>
              </thead>
              <tbody>
                {winners.map(w => (
                  <tr key={w.id} className="border-b border-slate-800/50">
                    <td className="py-3 pr-4">
                      <p className="text-white">{w.profiles?.full_name || '—'}</p>
                      <p className="text-slate-500 text-xs">{w.profiles?.email}</p>
                    </td>
                    <td className="py-3 pr-4 text-slate-400">{w.draws?.draw_date}</td>
                    <td className="py-3 pr-4">
                      <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">{w.match_type}</Badge>
                    </td>
                    <td className="py-3 pr-4">
                      {w.verification_status === 'pending' ? (
                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => updateStatus(w.id, 'verification_status', 'approved')}
                            className="bg-emerald-600 hover:bg-emerald-500 h-7 text-xs">Approve</Button>
                          <Button size="sm" onClick={() => updateStatus(w.id, 'verification_status', 'rejected')}
                            variant="outline" className="border-red-500/30 text-red-400 hover:bg-red-500/10 h-7 text-xs">Reject</Button>
                        </div>
                      ) : (
                        <Badge className={w.verification_status === 'approved'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : 'bg-red-500/10 text-red-400 border-red-500/20'}>
                          {w.verification_status}
                        </Badge>
                      )}
                    </td>
                    <td className="py-3">
                      {w.payment_status === 'pending' && w.verification_status === 'approved' ? (
                        <Button size="sm" onClick={() => updateStatus(w.id, 'payment_status', 'paid')}
                          className="bg-blue-600 hover:bg-blue-500 h-7 text-xs">Mark Paid</Button>
                      ) : (
                        <Badge className={w.payment_status === 'paid'
                          ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                          : 'bg-slate-700 text-slate-400 border-slate-600'}>
                          {w.payment_status}
                        </Badge>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}