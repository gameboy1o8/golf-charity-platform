import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') redirect('/dashboard')

  const { count: totalUsers } = await supabase.from('profiles').select('*', { count: 'exact', head: true })
  const { count: activeUsers } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('subscription_status', 'active')
  const { count: totalDraws } = await supabase.from('draws').select('*', { count: 'exact', head: true })
  const { count: pendingWinners } = await supabase.from('winners').select('*', { count: 'exact', head: true }).eq('verification_status', 'pending')

  const stats = [
    { label: 'Total Users', value: totalUsers ?? 0 },
    { label: 'Active Subscribers', value: activeUsers ?? 0 },
    { label: 'Draws Run', value: totalDraws ?? 0 },
    { label: 'Pending Verifications', value: pendingWinners ?? 0 },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Admin Overview</h1>
        <p className="text-slate-400 mt-1">Platform at a glance</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map(s => (
          <Card key={s.label} className="bg-slate-900 border-slate-800">
            <CardContent className="pt-6">
              <p className="text-slate-400 text-sm">{s.label}</p>
              <p className="text-3xl font-bold text-white mt-1">{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}