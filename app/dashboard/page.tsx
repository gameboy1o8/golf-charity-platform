import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*, charities(name)')
    .eq('id', user.id)
    .single()

  const { data: scores } = await supabase
    .from('scores')
    .select('*')
    .eq('user_id', user.id)
    .order('played_at', { ascending: false })
    .limit(5)

  const { data: wins } = await supabase
    .from('winners')
    .select('*')
    .eq('user_id', user.id)

  const totalWon = wins?.reduce((sum, w) => sum + (w.prize_amount || 0), 0) ?? 0

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold">
          Welcome back, {profile?.full_name?.split(' ')[0] ?? 'Player'} 👋
        </h1>
        <p className="text-slate-400 mt-1">Here's your overview</p>
      </div>

      {/* Subscription status */}
      {profile?.subscription_status !== 'active' && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-amber-400 font-medium">No active subscription</p>
            <p className="text-slate-400 text-sm">Subscribe to participate in draws and support charities</p>
          </div>
          <Link href="/dashboard/subscribe">
            <Button className="bg-emerald-600 hover:bg-emerald-500">
              Subscribe Now
            </Button>
          </Link>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            label: 'Subscription',
            value: profile?.subscription_status ?? 'inactive',
            badge: true
          },
          {
            label: 'Plan',
            value: profile?.subscription_plan ?? 'None',
          },
          {
            label: 'Scores Logged',
            value: scores?.length ?? 0,
          },
          {
            label: 'Total Won',
            value: `₹${totalWon.toLocaleString()}`,
          }
        ].map(stat => (
          <Card key={stat.label} className="bg-slate-900 border-slate-800">
            <CardContent className="pt-6">
              <p className="text-slate-400 text-sm">{stat.label}</p>
              {stat.badge ? (
                <Badge className={
                  stat.value === 'active'
                    ? 'mt-1 bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                    : 'mt-1 bg-red-500/10 text-red-400 border-red-500/20'
                }>
                  {stat.value}
                </Badge>
              ) : (
                <p className="text-2xl font-bold text-white mt-1 capitalize">{stat.value}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent scores */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-white">Recent Scores</CardTitle>
          <Link href="/dashboard/scores">
            <Button variant="ghost" size="sm" className="text-emerald-400 hover:text-emerald-300">
              Manage →
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {scores && scores.length > 0 ? (
            <div className="space-y-2">
              {scores.map(score => (
                <div key={score.id} className="flex items-center justify-between py-2 border-b border-slate-800 last:border-0">
                  <span className="text-slate-400 text-sm">
                    {new Date(score.played_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                  <span className="text-2xl font-bold text-emerald-400">{score.score}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-500 text-sm">No scores yet. <Link href="/dashboard/scores" className="text-emerald-400 hover:underline">Add your first score →</Link></p>
          )}
        </CardContent>
      </Card>

      {/* Charity */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white">My Charity</CardTitle>
        </CardHeader>
        <CardContent>
          {profile?.charity_id ? (
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">{(profile as any)?.charities?.name ?? 'Selected'}</p>
                <p className="text-slate-400 text-sm">{profile.charity_percentage}% of subscription</p>
              </div>
              <Link href="/dashboard/charity">
                <Button variant="ghost" size="sm" className="text-emerald-400">Change →</Button>
              </Link>
            </div>
          ) : (
            <p className="text-slate-500 text-sm">
              No charity selected. <Link href="/dashboard/charity" className="text-emerald-400 hover:underline">Choose one →</Link>
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}